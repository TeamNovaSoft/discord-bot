const { SlashCommandBuilder } = require('discord.js');
const {
  scheduleEventNotification,
} = require('../../cron/schedule-google-calendar');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calendar')
    .setDescription('Replies with Pong!'),
  async execute() {
    try {
      const events2 = [
        {
          summary: 'Reunión importante',
          start: { dateTime: '2024-11-26T10:56:00Z' }, // Hora UTC
          end: { dateTime: '2024-11-26T16:00:00Z' },
        },
        {
          summary: 'Taller de equipo',
          start: { dateTime: '2024-11-26T18:00:00Z' },
          end: { dateTime: '2024-11-26T19:00:00Z' },
        },
      ];
      events2.forEach((event) => scheduleEventNotification(event));
    } catch (error) {
      console.log(error);
    }
  },
};
