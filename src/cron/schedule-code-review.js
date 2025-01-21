const { CronJob } = require('cron');
const { ChannelType } = require('discord.js');
const { translateLanguage } = require('../languages/index');
const {
  MAPPED_STATUS_COMMANDS,
  DISCORD_SERVER,
  CRON_SHECDULE_REVIEW,
} = require('../config');

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
          let messageContent = `🔔 **Pending Threads in ${channel.name}**:\n\n`;
          for (const thread of pendingReviews.values()) {
            messageContent += `The thread [${thread.name}] has not been reviewed:\n${thread.url}\n`;
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
      } catch (channelError) {
        console.error(
          `Error processing channel ${channel.name}: ${channelError.message}`
        );
      }
    }
  } catch (error) {
    console.error(
      `Error fetching guild or processing threads: ${error.message}`
    );
  }
};

/**
 * Schedules a cron job to run `checkThreadsForReview` at specified intervals.
 *
 * @param {Client} client - The Discord.js client instance.
 * @param {string} timeZone - The timezone for the cron job.
 */
const scheduleReviewCheck = (client, timeZone) => {
  const statusText = MAPPED_STATUS_COMMANDS['pr-request-review'];
  if (!statusText) {
    console.error('Mapped status for pr-request-review not found.');
    return;
  }

  new CronJob(
    CRON_SHECDULE_REVIEW.scheduleReview,
    () => {
      checkThreadsForReview(client, statusText);
    },
    null,
    true,
    timeZone
  );
};

module.exports = { scheduleReviewCheck };
