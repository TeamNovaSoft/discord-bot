const { CronJob } = require("cron");
const { cronTimes } = require("../config");

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

const scheduleMessages = (client, greetingTimes) => {
    greetingTimes.forEach((greetingTime) => {
        const { cronTime, greeting } = greetingTime; 
        scheduleMessage(client, greeting, cronTime, cronTimes.timeZone);
      });
}

module.exports = { scheduleMessages }
