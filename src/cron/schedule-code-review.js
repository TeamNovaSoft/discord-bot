import { CronJob } from 'cron';
import { ChannelType } from 'discord.js';
import { translateLanguage } from '../languages/index.js';
import saveErrorLog from '../utils/log-error.js';
import {
  CRON_SCHEDULE_REVIEW,
  DISCORD_SERVER,
  MAPPED_STATUS_COMMANDS,
} from '../config.ts';

export const STATUS_KEY = 'pr-request-review';

/**
 * Retrieves the mapped status text for the given key.
 *
 * @param {string} key - The key to retrieve the mapped status for.
 * @returns {string|null} - The mapped status text or null if not found.
 */
export const getMappedStatusText = (key) => {
  const statusText = MAPPED_STATUS_COMMANDS[key];
  if (!statusText) {
    console.error(`Mapped status for ${key} not found.`);
    return null;
  }
  return statusText;
};

/**
 * Checks threads for a specific status and sends reminders in all text channels.
 *
 * @param {Client} client - The Discord.js client instance.
 * @param {string} statusText - The status to look for in thread titles.
 */
const checkThreadsForReview = async (client, statusText) => {
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

    for (const channel of textChannels.values()) {
      try {
        const threads = await channel.threads.fetchActive();
        const pendingReviews = threads.threads.filter((thread) =>
          thread.name.includes(statusText)
        );

        if (pendingReviews.size > 0) {
          let messageContent = `${translateLanguage(
            'checkReview.pendingThreads'
          ).replace('{{channelName}}', channel.name)}\n\n`;
          for (const thread of pendingReviews.values()) {
            messageContent += `${translateLanguage(
              'checkReview.threadNotReviewed'
            )
              .replace('{{threadName}}', thread.name)
              .replace('{{threadUrl}}', thread.url)}\n`;
          }

          await channel.send({
            content: messageContent,
          });
        } else {
          console.log(
            translateLanguage('checkReview.noPendingReviews').replace(
              '{{channelName}}',
              channel.name
            )
          );
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
 * Schedules a cron job to run `checkThreadsForReview` at specified intervals.
 *
 * @param {Client} client - The Discord.js client instance.
 */
export const scheduleReviewCheck = (client) => {
  const statusText = getMappedStatusText(STATUS_KEY);
  if (!statusText) {
    return;
  }

  const schedule = CRON_SCHEDULE_REVIEW.scheduleReview;

  if (typeof schedule !== 'string' || !schedule.trim()) {
    console.error('Invalid or missing cron schedule in configuration.');
    return;
  }

  try {
    new CronJob(
      schedule,
      () => {
        checkThreadsForReview(client, statusText);
      },
      null,
      true,
      CRON_SCHEDULE_REVIEW.timeZone
    );
  } catch (error) {
    console.error('Failed to create CronJob:', error.message);
  }
};
