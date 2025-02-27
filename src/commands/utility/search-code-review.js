const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { translateLanguage, keyTranslations } = require('../../languages');
const {
  getMappedStatusText,
  STATUS_KEY,
} = require('../../cron/schedule-code-review');
const { sendErrorToChannel } = require('../../utils/send-error');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-review')
    .setDescription(translateLanguage('checkReview.description'))
    .setDescriptionLocalizations(keyTranslations('checkReview.description'))
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription(translateLanguage('checkReview.channelOption'))
        .setDescriptionLocalizations(
          keyTranslations('checkReview.channelOption')
        )
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel');
      if (!channel) {
        await interaction.reply({
          content: translateLanguage('checkReview.noChannels'),
          ephemeral: true,
        });
        return;
      }

      const statusText = getMappedStatusText(STATUS_KEY);
      if (!statusText) {
        throw new Error('Mapped status for pr-request-review not found.');
      }

      const reminders = [];

      // Fetch active threads in the channel
      const threads = await channel.threads.fetchActive();

      // Filter threads where the title contains the desired status text
      const pendingReviews = threads.threads.filter((thread) =>
        thread.name.includes(statusText)
      );

      if (pendingReviews.size > 0) {
        // Create reminders for each pending review thread
        for (const thread of pendingReviews.values()) {
          reminders.push(
            translateLanguage('checkReview.threadNotReviewed')
              .replace('{{threadName}}', thread.name)
              .replace('{{threadUrl}}', thread.url)
          );
        }

        await interaction.reply({
          content: reminders.join('\n\n'),
          ephemeral: true,
        });
      } else {
        const channelName = channel.name;
        const noPRMessage = translateLanguage(
          'checkReview.noPendingReviews'
        ).replace('{{channelName}}', channelName);

        await interaction.reply({
          content: noPRMessage,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Error in check-review command: ${error}`);
      await sendErrorToChannel(interaction, error);
      await interaction.reply({
        content: translateLanguage('checkReview.error'),
        ephemeral: true,
      });
    }
  },
};
