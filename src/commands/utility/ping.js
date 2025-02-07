import { SlashCommandBuilder } from 'discord.js';
import { translateLanguage } from '../../languages/index.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(translateLanguage('ping.description')),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
