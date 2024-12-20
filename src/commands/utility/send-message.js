const { SlashCommandBuilder } = require('discord.js');
const { createSendMessageModal } = require('../../modals/send-message-modal');
const { translateLanguage } = require('../../languages/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send-message')
    .setDescription(translateLanguage('sendMessage.description'))
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription(translateLanguage('sendMessage.channelOption'))
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const channelId = channel?.id;
    const user = interaction.user;

    if (channelId) {
      const modal = createSendMessageModal(channelId, user);
      await interaction.showModal(modal);
    } else {
      const modal = createSendMessageModal(interaction.channelId, user);
      await interaction.showModal(modal);
    }
  },
};
