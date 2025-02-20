const { SlashCommandBuilder } = require('discord.js');
const {
  translateLanguage,
  translateCommand,
} = require('../../languages/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription(translateLanguage('user.description'))
    .setDescriptionLocalizations(translateCommand('user.description')),
  async execute(interaction) {
    const username = interaction.user.username;
    const joinedAt = interaction.member.joinedAt.toDateString();

    const replyMessage = translateLanguage('user.reply', {
      username,
      joinedAt,
    });

    await interaction.reply(replyMessage);
  },
};
