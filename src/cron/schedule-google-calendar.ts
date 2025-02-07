import { CronJob } from 'cron';
import { listEvents } from '../../calendar.js';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { firebaseConfig } from '../../firebase-config.ts';
import { translateLanguage } from '../languages/index.ts';
import dateToCronExpression from '../utils/date-to-cron-expression.js';

let activeCronJobs: CronJob[] = [];

const clearAllCronJobs = (): void => {
  activeCronJobs.forEach((job) => job.stop());
  activeCronJobs = [];
};

interface EventStart {
  dateTime: string;
  timeZone: string;
}

interface Event {
  summary: string;
  start: EventStart;
  hangoutLink?: string;
}

interface ScheduleEventParams {
  client: Client;
  event: Event;
}

/**
 * Schedules a notification to be sent when an event starts.
 */
const scheduleEventNotification = async ({ client, event }: ScheduleEventParams): Promise<void> => {
  if (!event?.start?.dateTime || !event?.start?.timeZone) {
    throw new Error(
      translateLanguage('calendarSchedules.errorMissingParameters')
    );
  }

  const cronExpression = dateToCronExpression(event.start.dateTime);
  const job = new CronJob(
    cronExpression,
    async () => {
      try {
        const currentChannel = client.channels.cache.get(
          firebaseConfig.channelCalendarId
        ) as TextChannel | undefined;

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(translateLanguage('calendarSchedules.notificationMessage'))
          .setDescription(`**${event.summary}**`)
          .setFooter({
            text: translateLanguage('calendarSchedules.appFooter'),
          });

        if (event.hangoutLink) {
          embed.addFields({
            name: translateLanguage('calendarSchedules.meetingLinkLabel'),
            value: `[${translateLanguage('calendarSchedules.clickHere')}](${event.hangoutLink})`,
            inline: false,
          });
        }

        if (currentChannel) {
          await currentChannel.send({ embeds: [embed] });
        } else {
          console.log(
            translateLanguage('calendarSchedules.errorChannelNotFound')
          );
        }
      } catch (error) {
        console.error(
          `Error sending event notification: ${(error as Error).message}`
        );
      }
    },
    null,
    true,
    event.start.timeZone
  );

  job.start();
  activeCronJobs.push(job);
};

/**
 * Schedules multiple notifications for a list of events.
 */
export const scheduleCalendarNotifications = async (client: Client): Promise<void> => {
  try {
    const events: Event[] = await listEvents();

    if (!Array.isArray(events) || events.length === 0) {
      console.log(
        translateLanguage('calendarSchedules.errorInvalidEventsArray')
      );
      return;
    }

    clearAllCronJobs();

    events.forEach((event) => {
      scheduleEventNotification({ client, event });
    });
  } catch (error) {
    console.error(
      `Error fetching events: ${(error as Error).message}`
    );
  }
};
