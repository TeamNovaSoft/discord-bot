const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { translateLanguage } = require('../../languages/index');
const { MAPPED_STATUS_COMMANDS } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-review')
    .setDescription(translateLanguage('checkReview.description'))
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription(translateLanguage('checkReview.channelOption'))
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

      const now = Date.now();
      const threshold = 24 * 60 * 60 * 1000;
      const reminders = [];
      const statusEmoji = MAPPED_STATUS_COMMANDS['pr-request-review'];

      const messages = await channel.messages.fetch({ limit: 50 });

      const pendingReviews = messages.filter(
        (msg) =>
          msg.content.includes(statusEmoji) &&
          msg.createdTimestamp < now - threshold
      );

      if (pendingReviews.size > 0) {
        for (const msg of pendingReviews.values()) {
          reminders.push(
            `🔔 **Reminder**: The message from [${msg.author.tag}] with status \`pr-request-review\` has not been reviewed:\n${msg.url}`
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
      await interaction.reply({
        content: translateLanguage('checkReview.error'),
        ephemeral: true,
      });
    }
  },
};
