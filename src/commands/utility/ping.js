const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage, translateCommand } = require('../../languages');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(translateLanguage('ping.description'))
    .setDescriptionLocalizations(translateCommand('ping.description')),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
