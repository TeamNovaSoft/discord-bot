import { SlashCommandBuilder } from 'discord.js';
import { createSendMessageModal } from '../../modals/send-message-modal.js';
import { translateLanguage } from '../../languages/index.ts';

export default {
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
