const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage } = require('../../languages');
const { botLanguage } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(translateLanguage(botLanguage, 'pingCommand.description')),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
