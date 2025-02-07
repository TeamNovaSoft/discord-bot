import { CronJob } from 'cron';
import { Client, GuildScheduledEvent, TextChannel } from 'discord.js';
import { DISCORD_SERVER } from '../config.ts';
import { translateLanguage } from '../languages/index.ts';
import dateToCronExpression from '../utils/date-to-cron-expression.js';
import { SCHEDULE_MESSAGES } from '../config.ts';
import saveErrorLog from '../utils/log-error.ts';

const hoursInMilliseconds = 60 * 60 * 1000;
const dayInMilliseconds = 24 * hoursInMilliseconds;

let activeCronJobs: CronJob[] = [];

const clearAllCronJobs = (): void => {
  activeCronJobs.forEach((job) => job.stop());
  activeCronJobs = [];
};

interface ScheduleEventParams {
  client: Client;
  event: GuildScheduledEvent;
  channelId: string;
  timeZone: string;
}

/**
 * Schedules a reminder for an event to be sent to a Discord channel at a specific time.
 */
const scheduleEventReminder = ({
  client,
  event,
  channelId,
  timeZone,
}: ScheduleEventParams): void => {
  const now = new Date();
  const eventEndTimeDate = new Date(event.scheduledEndTimestamp ?? 0);
  const timeDifference = eventEndTimeDate.getTime() - now.getTime();

  const reminderTime = new Date(
    timeDifference > dayInMilliseconds
      ? eventEndTimeDate.getTime() - dayInMilliseconds
      : eventEndTimeDate.getTime() - hoursInMilliseconds
  );

  if (reminderTime < now) {
    return;
  }

  const cronExpression = dateToCronExpression(reminderTime);

  const job = new CronJob(
    cronExpression,
    async () => {
      try {
        const eventAnnouncementChannel = (await client.channels.fetch(
          channelId
        )) as TextChannel | null;

        if (eventAnnouncementChannel) {
          await eventAnnouncementChannel.send(
            translateLanguage('calendarSchedules.reminderDiscordEvent', {
              eventName: event.name,
            })
          );
        } else {
          console.log(
            translateLanguage('calendarSchedules.errorChannelNotFound')
          );
        }
      } catch (error) {
        saveErrorLog(
          `Error sending event reminder in channel - '${channelId}': ${
            (error as Error).message
          }`
        );
      }
    },
    null,
    true,
    timeZone
  );

  job.start();
  activeCronJobs.push(job);
};

/**
 * Schedules reminders for multiple events to be sent to a Discord channel.
 */
export const scheduledEventNotifications = async (client: Client): Promise<void> => {
  try {
    const guild = await client.guilds.fetch(DISCORD_SERVER.discordGuildId);
    const events = await guild.scheduledEvents.fetch();

    if (events.size === 0) {
      console.log(
        translateLanguage('calendarSchedules.errorInvalidEventsArray')
      );
      return;
    }

    clearAllCronJobs();

    events.forEach((event) => {
      scheduleEventReminder({
        client,
        event,
        timeZone: SCHEDULE_MESSAGES.timeZone,
        channelId: DISCORD_SERVER.discordAnnouncementsChannel,
      });
    });
  } catch (error) {
    saveErrorLog(`Error fetching scheduled events: ${(error as Error).message}`);
  }
};
