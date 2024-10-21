const { SlashCommandBuilder } = require("discord.js");

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
        answers: [
          {
            text: "1",
            emoji: "🥇"
          },
          {
            text: "2",
            emoji: "🥈"
          },
          {
            text: '3',
            emoji: '🥉'
          },
          {
            text: '4',
            emoji: '4️⃣'
          },
          {
            text: '5',
            emoji: '5️⃣'
          },
          {
            text: '6',
            emoji: '6️⃣'
          },
          {
            text: '7',
            emoji: '7️⃣',
          },
          {
            text: '8',
            emoji: '🎱'
          }
        ]
      }
    })
  }
}
