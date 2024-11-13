const { CronJob } = require("cron");
const { CronTimes } = require("../config");

const sendMorningGreeting = function (client) {
    new CronJob(
        CronTimes.cronMorning,
        function () {
            const channel = client.channels.cache.get(CronTimes.channelMessageId);
            if (channel) {
                channel.send(CronTimes.grettingMorning);
            } else {
                console.log('Canal no encontrado o cliente no listo.');
            }
        },
        null,
        true,
        CronTimes.timeZone
    ).start()
}

const sendNoonGreeting = function (client) {
    new CronJob(
        CronTimes.cronNoon,
        function () {
            const channel = client.channels.cache.get(CronTimes.channelMessageId);
            if (channel) {
                channel.send(CronTimes.greetingNoon);
            } else {
                console.log('Canal no encontrado o cliente no listo.');
            }
        },
        null,
        true,
        CronTimes.timeZone
    ).start()
}
const sendEveningGreeting = function (client) {
    new CronJob(
        CronTimes.cronEvening,
        function () {
            const channel = client.channels.cache.get(CronTimes.channelMessageId);
            if (channel) {
                channel.send(CronTimes.greetingEvening);
            } else {
                console.log('Canal no encontrado o cliente no listo.');
            }
        },
        null,
        true,
        CronTimes.timeZone
    ).start()
}

module.exports = { sendMorningGreeting, sendNoonGreeting, sendEveningGreeting }
