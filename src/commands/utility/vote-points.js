const { SlashCommandBuilder } = require('discord.js');
const { VOTE_POINTS_ANSWERS, tagIds } = require('../../config');

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
          text: `How much does this task cost? | ${user.id}`,
          emoji: { name: '🧮' },
        },
        allowMultiselect: false,
        duration: 1,
        answers: VOTE_POINTS_ANSWERS,
      },
    });
  },
};
