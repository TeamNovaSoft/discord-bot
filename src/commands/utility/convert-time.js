const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment-timezone');
const { TIME_ZONES } = require('../../config');
const { translateLanguage, keyTranslations } = require('../../languages');
const { sendErrorToChannel } = require('../../utils/send-error');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert-time')
    .setDescription(translateLanguage('convertTime.description'))
    .setDescriptionLocalizations(keyTranslations('changeStatus.description'))
    .addStringOption((option) =>
      option
        .setName('from')
        .setDescription(translateLanguage('convertTime.fromOption'))
        .setDescriptionLocalizations(keyTranslations('convertTime.fromOption'))
        .setRequired(true)
        .addChoices(TIME_ZONES)
    )
    .addStringOption((option) =>
      option
        .setName('to')
        .setDescription(translateLanguage('convertTime.toOption'))
        .setDescriptionLocalizations(keyTranslations('convertTime.toOption'))
        .setRequired(true)
        .addChoices(TIME_ZONES)
    )
    .addStringOption((option) =>
      option
        .setName('time')
        .setDescription(translateLanguage('convertTime.timeOption'))
        .setDescriptionLocalizations(keyTranslations('convertTime.timeOption'))
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
          content: translateLanguage('convertTime.invalidTimeFormat'),
          ephemeral: true,
        });
      }

      if (fromTimeZone === toTimeZone) {
        return await interaction.reply(
          translateLanguage('convertTime.noConversionNeeded', {
            time,
            timeZone: fromTimeZone,
          })
        );
      }

      const inputTime = moment.tz(time, 'HH:mm', fromTimeZone);
      const convertedTime = inputTime.clone().tz(toTimeZone).format('HH:mm');

      await interaction.reply(
        translateLanguage('convertTime.conversionSuccess', {
          originalTime: time,
          fromTimeZone,
          convertedTime,
          toTimeZone,
        })
      );
    } catch (error) {
      console.error(error);
      await sendErrorToChannel(interaction, error);
      await interaction.reply(translateLanguage('convertTime.error'));
    }
  },
};
