const { SlashCommandBuilder } = require('discord.js');
const { VOTE_POINTS_ANSWERS, tagIds } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote-points')
    .setDescription(
      'Start a Effort Estimation Points votation for current Thread'
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    await interaction.reply(`<@&${tagIds.taskCompletedTagId}> <@${user.id}>`);

    interaction.followUp({
      poll: {
        question: {
          text: `How much cost this task? | ${user.id}`,
          emoji: { name: '🧮' },
        },
        allowMultiselect: false,
        duration: 24,
        answers: VOTE_POINTS_ANSWERS,
      },
    });
  },
};
