const { SlashCommandBuilder } = require('discord.js');
const { listEvents } = require('../../../calendar');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calendar')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    try {
      const events = await listEvents();
      if (events.length === 0) {
        console.log(events);
        await interaction.reply('Response message');
      } else {
        console.log(events);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
