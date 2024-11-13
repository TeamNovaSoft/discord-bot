const { SlashCommandBuilder } = require("discord.js");
const { VOTE_POINTS_ANSWERS } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote-points")
    .setDescription("Start a Effort Estimation Points votation for current Thread")
    .addStringOption(option =>
      option.setName('user')
        .setDescription('Select a user')
        .setRequired(true) // Cambié 'status' a 'user' para reflejar la opción correcta
    ),
  async execute(interaction) {
    // Obtener todos los miembros del servidor
    const members = await interaction.guild.members.fetch();
    const users = members.map(member => ({
      name: member.user.username,
      value: member.user.id
    }));

    // Añadir la opción de usuarios dinámicamente
    const selectMenu = new SlashCommandBuilder()
      .addStringOption(option =>
        option.setName('user')
          .setDescription('Select a user')
          .setRequired(true)
          .addChoices(
            users // Aquí usamos la lista de usuarios obtenida
          )
      );

    await interaction.reply({
      poll: {
        question: {
          text: "How much cost this task?",
          emoji: { name: '🧮' },
        },
        allowMultiselect: false,
        duration: 1,
        answers: VOTE_POINTS_ANSWERS
      }
    });
  }
}
