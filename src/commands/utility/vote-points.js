const { SlashCommandBuilder } = require('discord.js');
const { VOTE_POINTS } = require('../../config');

const tagIds = VOTE_POINTS.TAG_IDS;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote-points')
    .setDescription(
      'Start an Effort Estimation Points votation for the current Thread'
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to search for')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('point-type')
        .setDescription('Select the type of points to award')
        .setRequired(true)
        .addChoices(
          { name: 'Normal Points', value: 'normal' },
          { name: 'Boosted Points', value: 'boosted' }
        )
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const pointType = interaction.options.getString('point-type');

    const selectedTagId =
      pointType === 'boosted' ? tagIds.boostedPointTagId : tagIds.addPointTagId;

    await interaction.reply(
      `<@&${tagIds.taskCompletedTagId}> <@${user.id}> (Awarding: ${pointType.toUpperCase()} Points with Tag <@&${selectedTagId}>)`
    );
    interaction.followUp({
      poll: {
        question: {
          text: `How much does this task cost? Point type: ${selectedTagId} | ${user.id}`,
          emoji: { name: '🧮' },
        },
        allowMultiselect: false,
        duration: 24,
        answers: VOTE_POINTS.ANSWERS,
        fields: [
          { name: 'User', value: `<@${user.id}>`, inline: true },
          { name: 'Point Type', value: pointType, inline: true },
        ],
      },
    });
  },
};
