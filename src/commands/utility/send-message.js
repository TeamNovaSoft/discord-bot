const { SlashCommandBuilder } = require('discord.js');
const { createSendMessageModal } = require('../../modals/send-message-modal');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send-message')
    .setDescription('Replies with your input!')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The channel to message into')
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const channelId = channel?.id;
    const user = interaction.user;

    if (channel) {
      const modal = createSendMessageModal(channelId, user);
      await interaction.showModal(modal);
      await interaction.reply({
        content: `Message sent to ${channel.name}`,
        ephemeral: true,
      });
    } else {
      const modal = createSendMessageModal(interaction.channelId, user);
      await interaction.showModal(modal);
    }
  },
};
