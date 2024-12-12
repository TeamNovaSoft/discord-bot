const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage } = require('../../languages');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(translateLanguage('pingCommand.description')),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
