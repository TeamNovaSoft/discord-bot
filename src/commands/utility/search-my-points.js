const { SlashCommandBuilder } = require('discord.js');
const { VOTE_POINTS } = require('../../config');
const { translateLanguage } = require('../../languages/index');
const { sendErrorToChannel } = require('../../utils/send-error');

const tagIds = VOTE_POINTS.TAG_IDS;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my-points-query')
    .setDescription(translateLanguage('searchMyPoints.description'))
    .addIntegerOption((option) =>
      option
        .setName('year')
        .setDescription(translateLanguage('searchMyPoints.yearOption'))
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('month')
        .setDescription(translateLanguage('searchMyPoints.monthOption'))
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(translateLanguage('searchMyPoints.userOption'))
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('channels')
        .setDescription(translateLanguage('searchMyPoints.channelsOption'))
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const currentDate = new Date();
      const year =
        interaction.options.getInteger('year') || currentDate.getFullYear();
      const month =
        interaction.options.getInteger('month') || currentDate.getMonth() + 1;
      const user = interaction.options.getUser('user') || interaction.user;

      const channelsInput = interaction.options.getString('channels');
      const channels = channelsInput
        ? channelsInput.split(',').map((channel) => channel.trim())
        : [];

      const targetStartDate = new Date(year, month - 1, 0);
      const targetEndDate = new Date(year, month, 1);

      const startDateStr = `${targetStartDate.getFullYear()}-${String(
        targetStartDate.getMonth() + 1
      ).padStart(2, '0')}-${String(targetStartDate.getDate())}`;
      const endDateStr = `${targetEndDate.getFullYear()}-${String(
        targetEndDate.getMonth() + 1
      ).padStart(2, '0')}-01`;

      const escapedUserId = `<@${user.id}>`;

      const channelQueryParts = channels.length
        ? channels.map((channel) => `in:${channel}`).join(' ')
        : '';

      const openedPRs = `before: ${endDateStr} after: ${startDateStr} ${channelQueryParts} Author: ${escapedUserId}`;
      const taskCompletedQuery = `before: ${endDateStr} after: ${startDateStr} ${channelQueryParts} <@&${tagIds.taskCompletedTagId}> ${escapedUserId}`;
      const addPointQuery = `before: ${endDateStr} after: ${startDateStr} ${channelQueryParts} <@&${tagIds.addPointTagId}> ${escapedUserId}`;
      const boostedPointQuery = `before: ${endDateStr} after: ${startDateStr} ${channelQueryParts} <@&${tagIds.boostedPointTagId}> ${escapedUserId}`;

      await interaction.reply({
        content: translateLanguage('searchMyPoints.reply', {
          openedPRs,
          taskCompletedQuery,
          addPointQuery,
          boostedPointQuery,
        }),
        ephemeral: true,
      });
    } catch (error) {
      await sendErrorToChannel(
        interaction,
        translateLanguage('sendChannelError.error'),
        error,
        { user: interaction.user.tag }
      );
    }
  },
};
