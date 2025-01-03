const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage } = require('../../languages/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription(translateLanguage('server.description')),
  async execute(interaction) {
    const serverName = interaction.guild.name;
    const memberCount = interaction.guild.memberCount;

    const replyMessage = translateLanguage('server.reply', {
      serverName,
      memberCount,
    });

    await interaction.reply(replyMessage);
  },
};
