const { CronJob } = require('cron');
const { ChannelType } = require('discord.js');
const { translateLanguage } = require('../languages/index');
const saveErrorLog = require('../utils/log-error');
const {
  MAPPED_STATUS_COMMANDS,
  DISCORD_SERVER,
  CRON_REVIEW_SETTINGS,
  TIME_ZONES,
} = require('../config');

/**
 * Gets the mapped status text.
 * @param {string} key - Status key.
 * @returns {string|null} - Mapped text or null if not found.
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
 * Checks threads with a specific status and sends reminders if necessary.
 * @param {Client} client - Instance of the Discord.js client.
 * @param {string} statusKey - Key of the status to check.
 * @returns {string|null}
 */
const checkThreadsForStatus = async (client, statusKey, statusConfig) => {
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

    if (!statusConfig) {
      console.error(`No configuration found for status: ${statusKey}`);
      return;
    }

    const statusText = getMappedStatusText(statusKey);
    if (!statusText) {
      console.log('Status key not mapped:', statusKey);
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
          const lastActivity =
            thread.lastMessage?.createdTimestamp ||
            thread.createdTimestamp ||
            0;

          if (lastActivity === 0) {
            console.warn(
              `Skipping thread "${thread.name}" due to missing timestamps.`
            );
            return;
          }

          if (now - lastActivity >= statusConfig.rememberAfterMs) {
            const translatedMessage = translateLanguage(
              statusConfig.messageTranslationKey
            )
              .replace('{{threadName}}', thread.name)
              .replace('{{threadUrl}}', thread.url);

            messageContent.push(translatedMessage);
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
 * @param {Client} client - Instance of the Discord.js client.
 */
const scheduleAllStatusChecks = (client) => {
  Object.entries(CRON_REVIEW_SETTINGS.statusScheduleRemember).forEach(
    ([key, config]) => {
      const schedule = config.scheduleConfig;

      try {
        new CronJob(
          schedule,
          () => checkThreadsForStatus(client, key, config),
          null,
          true,
          TIME_ZONES || 'America/Bogota'
        );
      } catch (error) {
        console.error(`Failed to create CronJob for ${key}:`, error.message);
      }
    }
  );
};

module.exports = { scheduleAllStatusChecks, getMappedStatusText };
