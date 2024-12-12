const { SlashCommandBuilder } = require('discord.js');
const { tagIds } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my-points-query')
    .setDescription(
      'Get the Discord search query to check points for a specific month'
    )
    .addIntegerOption((option) =>
      option.setName('year').setDescription('Year to search').setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('month')
        .setDescription('Month to search')
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to search for')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('channels')
        .setDescription(
          'Enter one or more channels (comma-separated, Ex: novabot,code-review)'
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const currentDate = new Date();
    const year =
      interaction.options.getInteger('year') || currentDate.getFullYear();
    const month =
      interaction.options.getInteger('month') || currentDate.getMonth() || 12;
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

    const taskCompletedQuery = `before: ${endDateStr} after: ${startDateStr} ${channelQueryParts} <@&${tagIds.taskCompletedTagId}> ${escapedUserId}`;
    const addPointQuery = `before: ${endDateStr} after: ${startDateStr} ${channelQueryParts} <@&${tagIds.addPointTagId}> ${escapedUserId}`;
    const boostedPointQuery = `before: ${endDateStr} after: ${startDateStr} ${channelQueryParts} <@&${tagIds.boostedPointTagId}> ${escapedUserId}`;

    await interaction.reply({
      content: `Here are your search queries:\n\n**Tasks completed:**\n\`\`\`${taskCompletedQuery}\`\`\`\n\n**Points obtained:**\n\`\`\`${addPointQuery}\`\`\`\n\n**Boosted Points obtained:**\n\`\`\`${boostedPointQuery}\`\`\``,
      ephemeral: true,
    });
  },
};
