const { CronJob } = require('cron');
const { listEvents } = require('../../calendar');
const { EmbedBuilder } = require('discord.js');
const { firebaseConfig } = require('../../firebase-config');
const { translateLanguage } = require('../languages/index');

let activeCronJobs = [];

const clearAllCronJobs = () => {
  activeCronJobs.forEach((job) => job.stop());
  activeCronJobs = [];
};

/**
 * Schedules a notification to be sent when an event starts.
 *
 * @param {Object} event - The event object containing details about the event.
 * @param {string} event.summary - The name or description of the event.
 * @param {Object} event.start - The start date object for the event.
 * @param {string} event.start.dateTime - The date and time (ISO string) when the event starts.
 * @param {string} timeZone - The timezone to use for scheduling the notification.
 */
const scheduleEventNotification = async ({ client, event }) => {
  if (
    !client ||
    !event ||
    !event.start ||
    !event.start.dateTime ||
    !event.start.timeZone
  ) {
    throw new Error(
      translateLanguage('calendarSchedules.errorMissingParameters')
    );
  }

  const dateToCronExpression = (dateString) => {
    const date = new Date(dateString);
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${minutes} ${hours} ${day} ${month} *`;
  };

  const cronExpression = dateToCronExpression(event.start.dateTime);
  const job = new CronJob(
    cronExpression,
    async () => {
      const currentChannel = await client.channels.cache.get(
        firebaseConfig.channelCalendarId
      );
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(translateLanguage('calendarSchedules.notificationMessage'))
        .setDescription(`**${event.summary}**`)
        .setFooter({
          text: translateLanguage('calendarSchedules.appFooter'),
        });

      if (event?.hangoutLink) {
        embed.addFields({
          name: translateLanguage('calendarSchedules.meetingLinkLabel'),
          value: `[${translateLanguage('calendarSchedules.clickHere')}](${event.hangoutLink})`,
          inline: false,
        });
      }

      if (currentChannel) {
        currentChannel.send({ embeds: [embed] });
      } else {
        console.log(
          translateLanguage('calendarSchedules.errorChannelNotFound')
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
 *
 * @param {Array<{summary: string, start: {dateTime: string, timeZone: string}}>} events - List of event objects.
 */
const scheduleCalendarNotifications = async (client) => {
  const events = await listEvents();

  if (!Array.isArray(events)) {
    return console.log(
      translateLanguage('calendarSchedules.errorInvalidEventsArray')
    );
  }

  clearAllCronJobs();

  events.forEach((event) => {
    scheduleEventNotification({ client, event });
  });
};

module.exports = { scheduleCalendarNotifications };
