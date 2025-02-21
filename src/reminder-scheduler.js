const {
  DISCORD_SERVER,
  GEMINI_INTEGRATION,
  FIREBASE_CONFIG,
} = require('./config');
const { scheduleAllStatusChecks } = require('./cron/schedule-code-review');
const { scheduleIaContentLogging } = require('../src/cron/schedule-gemini');
const { processMarkdownFiles } = require('./cron/utils/read-markdown-messages');
const {
  setupCalendarNotifications,
} = require('./cron/schedule-google-calendar');
const {
  scheduleDiscordEventNotifications,
} = require('./cron/schedule-event-reminder');

function reminderScheduler(client) {
  processMarkdownFiles(client);

  if (GEMINI_INTEGRATION.scheduledGeminiEnabled) {
    scheduleIaContentLogging(client);
  }

  if (FIREBASE_CONFIG.scheduledCalendarEnabled) {
    setupCalendarNotifications(client);
  }

  scheduleAllStatusChecks(client);

  if (DISCORD_SERVER.scheduledDiscordEventsEnabled) {
    scheduleDiscordEventNotifications(client);
  }
}

module.exports = { reminderScheduler };
