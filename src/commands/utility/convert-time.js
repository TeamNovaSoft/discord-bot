const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment-timezone');
const { TIME_ZONES } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert-time')
    .setDescription('Convert time between time zones')
    .addStringOption((option) =>
      option
        .setName('from')
        .setDescription('Select the source time zone')
        .setRequired(true)
        .addChoices(TIME_ZONES)
    )
    .addStringOption((option) =>
      option
        .setName('to')
        .setDescription('Select the target time zone')
        .setRequired(true)
        .addChoices(TIME_ZONES)
    )
    .addStringOption((option) =>
      option
        .setName('time')
        .setDescription('Enter the time to convert (HH:MM format)')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const fromTimeZone = interaction.options.getString('from');
      const toTimeZone = interaction.options.getString('to');
      const time = interaction.options.getString('time');

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(time)) {
        return await interaction.reply({
          content: 'Please provide a valid time in HH:MM format.',
          ephemeral: true,
        });
      }

      if (fromTimeZone === toTimeZone) {
        await interaction.reply(
          `No conversion needed! The time in ${fromTimeZone} is ${time}`
        );
      }

      const inputTime = moment.tz(time, 'HH:mm', fromTimeZone);
      const convertedTime = inputTime.clone().tz(toTimeZone).format('HH:mm');

      await interaction.reply(
        `The time ${time} in ${fromTimeZone} is ${convertedTime} in ${toTimeZone}.`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while converting the time.');
    }
  },
};
