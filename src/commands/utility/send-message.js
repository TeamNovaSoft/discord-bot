const { SlashCommandBuilder } = require('discord.js');
const { createSendMessageModal } = require('../../modals/send-message-modal');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send-message')
    .setDescription('Send a message with the bot')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The channel to message into')
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
