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
const saveErrorLog = require('./utils/log-error');
const convertCronToText = require('./utils/cron-to-text-parser');

async function startClientBot(client) {
  client.commands = new Collection();
  deployCommands(client);
  deployEvents(client);

  scheduleMessages(client, SCHEDULE_MESSAGES.messageTimes);
  if (firebaseConfig.scheduledCalendarEnabled) {
    new cron.CronJob(
      SCHEDULE_MESSAGES.scheduledCalendarInterval,
      () => {
        console.log('Running scheduled calendar notifications...');
        scheduleCalendarNotifications(client);
      },
      null,
      true,
      SCHEDULE_MESSAGES.timeZone
    );
  }
  console.log(convertCronToText(SCHEDULE_MESSAGES.scheduledCalendarInterval));

  await client.login(token);
}

function handleCriticalError(error) {
  saveErrorLog(error);
}

const token = DISCORD_SERVER.discordToken;
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

process.on('uncaughtException', (error) => {
  handleCriticalError(error);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  handleCriticalError(reason);
});

startClientBot(client);
