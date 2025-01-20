require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const {
  DISCORD_SERVER,
  SCHEDULE_MESSAGES,
  SCHEDULE_CALENDAR,
  GEMINI_INTEGRATION,
} = require('./config');
const deployEvents = require('./deploy-events');
const deployCommands = require('./deploy-commands');
const {
  scheduleCalendarNotifications,
} = require('./cron/schedule-google-calendar');
const { firebaseConfig } = require('../firebase-config');
const cron = require('cron');
const { scheduleIaContentLogging } = require('../src/cron/schedule-gemini');
const saveErrorLog = require('./utils/log-error');
const convertCronToText = require('./utils/cron-to-text-parser');
const { processMarkdownFiles } = require('./cron/utils/read-markdown-messages');
const { scheduleReviewCheck } = require('./cron/schedule-code-review');

async function startClientBot(client) {
  client.commands = new Collection();
  deployCommands(client);
  deployEvents(client);

  processMarkdownFiles(client);
  if (GEMINI_INTEGRATION.scheduledGeminiEnabled) {
    scheduleIaContentLogging(client);
  }
  if (firebaseConfig.scheduledCalendarEnabled) {
    new cron.CronJob(
      SCHEDULE_CALENDAR.scheduledCalendarInterval,
      () => {
        console.log('Running scheduled calendar notifications...');
        scheduleCalendarNotifications(client);
      },
      null,
      true,
      SCHEDULE_MESSAGES.timeZone
    );
    console.log(convertCronToText(SCHEDULE_CALENDAR.scheduledCalendarInterval));
  }

  const cronExpression = '* * * * *'; // Cron para ejecutarse de lunes a viernes a las 7:00 AM
  const timeZone = 'America/Bogota'; // Hora de Colombia

  // Llama a la función que ejecutará el check-review a la hora programada
  scheduleReviewCheck({
    client,
    cronExpression,
    timeZone,
  });

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
