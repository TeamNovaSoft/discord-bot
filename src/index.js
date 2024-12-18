require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { DISCORD_SERVER, SCHEDULE_MESSAGES } = require('./config');
const { scheduleMessages } = require('./cron/schedule-messages');
const deployEvents = require('./deploy-events');
const deployCommands = require('./deploy-commands');
const {
  scheduleCalendarNotifications,
} = require('./cron/schedule-google-calendar');
const { firebaseConfig } = require('../firebase-config');
const cron = require('cron');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.DirectMessagePolls,
  ],
});

client.commands = new Collection();
const token = DISCORD_SERVER.discordToken;

deployCommands(client);
deployEvents(client);

scheduleMessages(client, SCHEDULE_MESSAGES.messageTimes);
if (firebaseConfig.scheduledCalendarEnabled) {
  new cron.CronJob(
    cronTimes.scheduledCalendarInterval,
    () => {
      console.log('Running scheduled calendar notifications...');
      scheduleCalendarNotifications(client);
    },
    null,
    true,
    cronTimes.timeZone
  );

  console.log(
    'Calendar event collector scheduled to run from Monday to Friday, 8 AM to 5 PM each 20 MIN (Colombia time).'
  );
}

client.login(token);
