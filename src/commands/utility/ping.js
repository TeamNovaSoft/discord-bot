import { SlashCommandBuilder } from 'discord.js';
import { translateLanguage } from '../../languages/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(translateLanguage('ping.description')),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
