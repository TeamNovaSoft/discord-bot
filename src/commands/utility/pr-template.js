const { SlashCommandBuilder } = require('discord.js');
const { createPRModal } = require('../../modals/pr-template-modal');
const { PR_TEMPLATE } = require('../../config');
const { translateLanguage } = require('../../languages/index');

module.exports = {
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
