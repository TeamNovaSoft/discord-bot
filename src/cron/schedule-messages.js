const { CronJob } = require('cron');
const { SCHEDULE_MESSAGES } = require('../config');
const { translateLanguage } = require('../languages/index');

/**
 * Schedules a message to be sent to a Discord channel at a specific time.
 *
 * @param {Client} client - The Discord.js client instance.
 * @param {string} channel - The channel to send the message.
 * @param {string} message - The message to send to the channel.
 * @param {string} datetime - The cron expression that defines when the message should be sent.
 * @param {string} timeZone - The timezone to use for scheduling the message.
 * @returns {null} Returns null if any of the parameters are missing.
 */
const scheduleMessage = ({ client, channel, message, datetime, timeZone }) => {
  if (!client || !channel || !message || !datetime || !timeZone) {
    return console.log(
      translateLanguage('messageSchedules.errorMissingParameters')
    );
  }

  new CronJob(
    datetime,
    () => {
      const currentChannel = client.channels.cache.get(channel);
      if (currentChannel) {
        currentChannel.send(message);
      } else {
        console.log(translateLanguage('messageSchedules.errorChannelNotFound'));
      }
    },
    null,
    true,
    timeZone
  ).start();
};

/**
 * Schedules multiple messages to be sent to a Discord channel based on the provided message times.
 *
 * @param {Client} client - The Discord.js client instance.
 * @param {Array<{channel: string, datetime: string, messsage: string}>} scheduledMessages - Array of objects containing cron time and message message.
 */
const scheduleMessages = (client, scheduledMessages) => {
  scheduledMessages.forEach((scheduledMessage) => {
    const { channel, datetime, message } = scheduledMessage;
    scheduleMessage({
      client,
      channel,
      message,
      datetime,
      timeZone: SCHEDULE_MESSAGES.timeZone,
    });
  });
};

module.exports = { scheduleMessages };
