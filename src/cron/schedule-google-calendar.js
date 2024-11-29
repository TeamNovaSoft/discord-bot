const { CronJob } = require('cron');
const { listEvents } = require('../../calendar');
const { EmbedBuilder } = require('discord.js');
const { firebaseConfig } = require('../../firebase-config');

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
    return console.log(
      'Error: Missing one or more required parameters (client, event, event.start.dateTime, or timeZone).'
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
  new CronJob(
    cronExpression,
    async () => {
      const currentChannel = await client.channels.cache.get(
        firebaseConfig.channelCalendarId
      );
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📅 Meeting reminder!')
        .setDescription(`**${event.summary}**`)
        .setFooter({
          text: 'Meet remember APP',
        });

      if (event?.hangoutLink) {
        embed.addFields({
          name: 'Meeting link:',
          value: `[Click here](${event.hangoutLink})`,
          inline: false,
        });
      }

      if (currentChannel) {
        currentChannel.send({ embeds: [embed] });
      } else {
        console.log('Channel not found or client not ready.');
      }
    },
    null,
    true,
    event.start.timeZone
  ).start();
};

/**
 * Schedules multiple notifications for a list of events.
 *
 * @param {Array<{summary: string, start: {dateTime: string, timeZone: string}}>} events - List of event objects.
 */
const scheduleEventNotifications = async (client) => {
  const events = await listEvents();

  if (!Array.isArray(events)) {
    return console.log('Error: Missing or invalid parameters (events array).');
  }

  events.forEach((event) => {
    scheduleEventNotification({ client, event });
  });
};

module.exports = { scheduleEventNotifications };
