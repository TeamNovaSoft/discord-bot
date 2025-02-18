require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const {
  DISCORD_SERVER,
  SCHEDULE_MESSAGES,
  SCHEDULE_CALENDAR,
  GEMINI_INTEGRATION,
  CRON_SCHEDULE_REVIEW,
  FIREBASE_CONFIG,
} = require('./config');
const deployEvents = require('./deploy-events');
const deployCommands = require('./deploy-commands');
const {
  scheduledEventNotifications,
} = require('./cron/schedule-event-reminder');
const {
  scheduleCalendarNotifications,
} = require('./cron/schedule-google-calendar');
const cron = require('cron');
const { scheduleIaContentLogging } = require('../src/cron/schedule-gemini');
const convertCronToText = require('./utils/cron-to-text-parser');
const { processMarkdownFiles } = require('./cron/utils/read-markdown-messages');
const { scheduleReviewCheck } = require('./cron/schedule-code-review');
const { registerGlobalErrorHandlers } = require('./utils/send-error');

async function startClientBot(client) {
  client.commands = new Collection();
  deployCommands(client);
  deployEvents(client);

  processMarkdownFiles(client);
  if (GEMINI_INTEGRATION.scheduledGeminiEnabled) {
    scheduleIaContentLogging(client);
  }
  if (FIREBASE_CONFIG.scheduledCalendarEnabled) {
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

  const timeZone = CRON_SCHEDULE_REVIEW.timeZone;
  scheduleReviewCheck(client, timeZone);

  await client.login(token);

  if (DISCORD_SERVER.scheduledDiscordEventsEnabled) {
    new cron.CronJob(
      SCHEDULE_CALENDAR.scheduledCalendarInterval,
      () => {
        console.log('Running scheduled event notifications...');
        scheduledEventNotifications(client);
      },
      null,
      true,
      SCHEDULE_MESSAGES.timeZone
    );
  }
}

const token = DISCORD_SERVER.discordToken;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.commands = new Collection();

registerGlobalErrorHandlers(client);

startClientBot(client);
