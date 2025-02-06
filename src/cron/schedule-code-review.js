const { CronJob } = require('cron');
const { ChannelType } = require('discord.js');
const { translateLanguage } = require('../languages/index');
const saveErrorLog = require('../utils/log-error');
const {
  MAPPED_STATUS_COMMANDS,
  DISCORD_SERVER,
  CRON_SCHEDULE_REVIEW,
  STATUS_SCHEDULE_REMEMBER_SETTING,
} = require('../config');

/**
 * Retrieves the mapped status text for the given key.
 *
 * @param {string} key - The key to retrieve the mapped status for.
 * @returns {string|null} - The mapped status text or null if not found.
 */
const getMappedStatusText = (key) => {
  const statusText = MAPPED_STATUS_COMMANDS[key];
  if (!statusText) {
    console.error(`Mapped status for ${key} not found.`);
    return null;
  }
  return statusText;
};

/**
 * Checks threads for a specific status and sends reminders if needed.
 *
 * @param {Client} client - The Discord.js client instance.
 * @param {string} statusKey - The status key to check.
 */
const checkThreadsForStatus = async (client, statusKey) => {
  try {
    const guild = await client.guilds.fetch(DISCORD_SERVER.discordGuildId);
    if (!guild) {
      console.error(
        `Guild with ID ${DISCORD_SERVER.discordGuildId} not found.`
      );
      return;
    }

    const channels = await guild.channels.fetch();
    const textChannels = channels.filter(
      (channel) => channel.type === ChannelType.GuildText
    );
    if (textChannels.size === 0) {
      console.error('No text channels found.');
      return;
    }

    const statusConfig = STATUS_SCHEDULE_REMEMBER_SETTING[statusKey];
    if (!statusConfig) {
      console.error(`No configuration found for status: ${statusKey}`);
      return;
    }

    const statusText = getMappedStatusText(statusKey);
    if (!statusText) {
      return;
    }

    for (const channel of textChannels.values()) {
      try {
        const threads = await channel.threads.fetchActive();
        const pendingThreads = threads.threads.filter((thread) =>
          thread.name.includes(statusText)
        );

        const now = Date.now();
        const messageContent = [];
        pendingThreads.forEach((thread) => {
          const lastActivity = thread.lastMessageId
            ? thread.lastMessage.createdTimestamp
            : thread.createdTimestamp;
          if (now - lastActivity >= statusConfig.rememberAfterMs) {
            messageContent.push(
              translateLanguage(statusConfig.messageTranslation)
                .replace('{{threadName}}', thread.name)
                .replace('{{threadUrl}}', thread.url)
            );
          }
        });

        if (messageContent.length > 0) {
          await channel.send({ content: messageContent.join('\n') });
        }
      } catch (error) {
        saveErrorLog(error);
      }
    }
  } catch (error) {
    saveErrorLog(error);
  }
};

/**
 * Schedules cron jobs for all statuses defined in the configuration.
 *
 * @param {Client} client - The Discord.js client instance.
 */
const scheduleAllStatusChecks = (client) => {
  Object.entries(STATUS_SCHEDULE_REMEMBER_SETTING).forEach(
    ([statusKey, config]) => {
      const schedule = CRON_SCHEDULE_REVIEW.scheduleReview;
      if (typeof schedule !== 'string' || !schedule.trim()) {
        console.error(`Invalid cron schedule for status ${statusKey}.`);
        return;
      }

      try {
        new CronJob(
          schedule,
          () => checkThreadsForStatus(client, statusKey, config),
          null,
          true,
          CRON_SCHEDULE_REVIEW.timeZone
        );
      } catch (error) {
        console.error(
          `Failed to create CronJob for ${statusKey}:`,
          error.message
        );
      }
    }
  );
};

module.exports = { scheduleAllStatusChecks, getMappedStatusText };
