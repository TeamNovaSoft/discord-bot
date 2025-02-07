import dotenv from 'dotenv';
dotenv.config();

import { Client, Collection, GatewayIntentBits } from 'discord.js';

import {
  DISCORD_SERVER,
  SCHEDULE_MESSAGES,
  SCHEDULE_CALENDAR,
  GEMINI_INTEGRATION,
  CRON_SCHEDULE_REVIEW,
} from './config.ts';

import deployEvents from './deploy-events.ts';
import deployCommands from './deploy-commands.ts';

import { scheduledEventNotifications } from './cron/schedule-event-reminder.ts';
import { scheduleCalendarNotifications } from './cron/schedule-google-calendar.ts';
import { firebaseConfig } from '../firebase-config.ts';

import cron from 'cron';

import { scheduleIaContentLogging } from '../src/cron/schedule-gemini.ts';

import saveErrorLog from './utils/log-error.ts';
import convertCronToText from './utils/cron-to-text-parser.ts';
import { processMarkdownFiles } from './cron/utils/read-markdown-messages.ts';
import { scheduleReviewCheck } from './cron/schedule-code-review.ts';


async function startClientBot(client: any) {
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
        console.log("Running scheduled calendar notifications...");
        scheduleCalendarNotifications(client);
      },
      null,
      true,
      SCHEDULE_MESSAGES.timeZone
    );
    console.log(convertCronToText(SCHEDULE_CALENDAR.scheduledCalendarInterval));
  }

  const timeZone = CRON_SCHEDULE_REVIEW.timeZone;
  scheduleReviewCheck(client);

  await client.login(token);

  if (DISCORD_SERVER.scheduledDiscordEventsEnabled) {
    new cron.CronJob(
      SCHEDULE_CALENDAR.scheduledCalendarInterval,
      () => {
        console.log("Running scheduled event notifications...");
        scheduledEventNotifications(client);
      },
      null,
      true,
      SCHEDULE_MESSAGES.timeZone
    );
  }
}

function handleCriticalError(error: any) {
  saveErrorLog(error);
}

const token = DISCORD_SERVER.discordToken;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

process.on("uncaughtException", (error) => {
  handleCriticalError(error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise);
  handleCriticalError(reason);
});

startClientBot(client);
