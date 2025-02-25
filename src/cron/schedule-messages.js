const { CronJob } = require('cron');
const { translateLanguage } = require('../languages');
const { SCHEDULE_MESSAGES } = require('../config');

/**
 * Converts extracted variables to a cron expression.
 * @param {object} variables - Extracted variables from the Markdown file.
 * @returns {string} - A valid cron expression.
 */
const convertToCronExpression = (variables) => {
  const {
    days = '*',
    hour = '08',
    minutes = '00',
    timezone = 'UTC',
    channel,
  } = variables;

  if (isNaN(hour) || isNaN(minutes)) {
    throw new Error('Invalid time format. Expected "HH:mm".');
  }

  const cronExpression = `${minutes} ${hour} * * ${days}`;

  return {
    cronExpression,
    timezone,
    channel,
  };
};

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
 * Schedules multiple messages to be sent to a Discord channel based on the provided schedule.
 *
 * @param {Client} client - The Discord.js client instance.
 * @param {Array<{message: string, variables: {channel: string, time: string, timezone: string, days?: string}}>} scheduledMessages -
 */
const scheduleMessages = ({ client, messages }) => {
  messages.forEach((msg) => {
    const { message, variables } = msg;
    const { channel, cronExpression, timezone } =
      convertToCronExpression(variables);
    scheduleMessage({
      client,
      channel,
      message,
      datetime: cronExpression,
      timeZone: timezone || SCHEDULE_MESSAGES.timeZone,
    });
  });
};

module.exports = { scheduleMessages };
