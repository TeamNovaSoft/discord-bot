const { CronJob } = require("cron");
const { cronTimes } = require("../config");

/**
 * Schedules a message to be sent to a Discord channel at a specific time.
 * 
 * @param {Client} client - The Discord.js client instance.
 * @param {string} message - The message to send to the channel.
 * @param {string} deliveryTime - The cron expression that defines when the message should be sent.
 * @param {string} timeZone - The timezone to use for scheduling the message.
 * @returns {null} Returns null if any of the parameters are missing.
 */
const scheduleMessage = (client, message, deliveryTime, timeZone) => {
    if (!client || !message || !deliveryTime || !timeZone) return null
    new CronJob(
        deliveryTime,
        function () {
            const channel = client.channels.cache.get(cronTimes.channelMessageId);
            if (channel) {
                channel.send(message);
            } else {
                console.log('Channel not found or client not ready.');
            }
        },
        null,
        true,
        timeZone
    ).start()
}

/**
 * Schedules multiple messages to be sent to a Discord channel based on the provided greeting times.
 * 
 * @param {Client} client - The Discord.js client instance.
 * @param {Array<{cronTime: string, greeting: string}>} greetingTimes - Array of objects containing cron time and greeting message.
 */
const scheduleMessages = (client, greetingTimes) => {
    greetingTimes.forEach((greetingTime) => {
        const { cronTime, greeting } = greetingTime; 
        scheduleMessage(client, greeting, cronTime, cronTimes.timeZone);
      });
}

module.exports = { scheduleMessages }
