const { CronJob } = require("cron");
const { cronTimes } = require("../config");

const scheduleMessage = function (client, message, deliveryTime, timeZone) {
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

module.exports = { scheduleMessage }
