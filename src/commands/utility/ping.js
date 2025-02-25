const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage, keyTranslations } = require('../../languages');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(translateLanguage('ping.description'))
    .setDescriptionLocalizations(keyTranslations('ping.description')),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
