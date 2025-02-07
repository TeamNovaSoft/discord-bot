import { SlashCommandBuilder } from 'discord.js';
import { translateLanguage } from '../../languages/index.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription(translateLanguage('user.description')),
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
