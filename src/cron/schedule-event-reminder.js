import { CronJob } from 'cron';
import { DISCORD_SERVER } from '../config.ts';
import { translateLanguage } from '../languages/index.js';
import dateToCronExpression from '../utils/date-to-cron-expression.js';
import { SCHEDULE_MESSAGES } from '../config.ts';
import saveErrorLog from '../utils/log-error.js';

const hoursInMilliseconds = 60 * 60 * 1000;
const dayInMilliseconds = 24 * hoursInMilliseconds;

let activeCronJobs = [];

const clearAllCronJobs = () => {
  activeCronJobs.forEach((job) => job.stop());
  activeCronJobs = [];
};

/**
 * @typedef {import('discord.js').Client} Client
 */

/**
 * Schedules a reminder for an event to be sent to a Discord channel at a specific time.
 *
 * @param {Client} client - The Discord.js client instance.
 * @param {Object} event - The event object containing its name, startTime, and endTime.
 * @param {string} channelId - The ID of the channel where the reminder will be sent.
 * @param {string} timeZone - The timezone to use for scheduling the reminder.
 */
const scheduleEventReminder = ({ client, event, channelId, timeZone }) => {
  const now = new Date();
  const eventEndTimeDate = new Date(event.scheduledEndTimestamp);
  const timeDifference = eventEndTimeDate - now;

  const reminderTime = new Date(
    timeDifference > dayInMilliseconds
      ? eventEndTimeDate - dayInMilliseconds
      : eventEndTimeDate - hoursInMilliseconds
  );

  if (reminderTime < now) {
    return;
  }

  const cronExpression = dateToCronExpression(reminderTime);

  const job = new CronJob(
    cronExpression,
    async () => {
      try {
        const eventAnnouncementChannel = await client.channels.fetch(channelId);
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
          `Error sending event reminder in channel - '${channelId}': ${error.message}`
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
 *
 * @param {Client} client - The Discord.js client instance.
 */
export const scheduledEventNotifications = async (client) => {
  const guild = await client.guilds.fetch(DISCORD_SERVER.discordGuildId);
  const events = await guild.scheduledEvents.fetch();

  if (events.size === 0) {
    return console.log(
      translateLanguage('calendarSchedules.errorInvalidEventsArray')
    );
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
};
