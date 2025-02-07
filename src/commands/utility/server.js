import { SlashCommandBuilder } from 'discord.js';
import { translateLanguage } from '../../languages/index.ts';

export default {
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
