import { SlashCommandBuilder } from 'discord.js';
import { createPRModal } from '../../modals/pr-template-modal.js';
import { PR_TEMPLATE } from '../../config.ts';
import { translateLanguage } from '../../languages/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pr-template')
    .setDescription(translateLanguage('prTemplate.description'))
    .addStringOption((option) =>
      option
        .setName('channel')
        .setDescription(translateLanguage('prTemplate.channelOption'))
        .setRequired(true)
        .addChoices(PR_TEMPLATE.allowedChannels)
    ),

  async execute(interaction) {
    const selectedChannelId = interaction.options.getString('channel');

    const modal = createPRModal(selectedChannelId);
    await interaction.showModal(modal);
  },
};
