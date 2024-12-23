const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage } = require('../../languages');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(translateLanguage('ping.description')),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
