const { SlashCommandBuilder } = require('discord.js');
const { VOTE_POINTS_ANSWERS } = require('../../config');

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
    
    interaction.reply({
      poll: {
        question: {
          text: `How much cost this task? | ${user.id}`,
          emoji: { name: '🧮' },
        },
        allowMultiselect: false,
        duration: 1,
        answers: VOTE_POINTS_ANSWERS,
      },
    });    
  },
};
