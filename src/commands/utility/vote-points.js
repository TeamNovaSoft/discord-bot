const { SlashCommandBuilder } = require("discord.js");
const { VOTE_POINTS_ANSWERS } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote-points")
    .setDescription("Start a Effort Estimation Points votation for current Thread"),
  async execute(interaction) {
    interaction.reply({
      poll: {
        question: {
          text: "How much cost this task?",
          emoji: { name: '🧮' },
        },
        allowMultiselect: false,
        duration: 24,
        answers: VOTE_POINTS_ANSWERS
      }
    })
  }
}
