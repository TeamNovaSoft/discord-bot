const { SlashCommandBuilder } = require('discord.js');
const { MAPPED_STATUS_COMMANDS } = require('../../config');

const COMMAND_KEYS = Object.keys(MAPPED_STATUS_COMMANDS);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('request-point')
    .setDescription('Request point in this theads')
    .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('User to search for')
          .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const { options, channel, guild } = interaction;

      if (!channel.isThread()) {
        return await interaction.reply({
          content: 'Sorry, this is not a thread!',
          ephemeral: true,
        });
      }
      const user = options.getUser('user') || interaction.user;
      const escapedUserId = `<@${user.id}>`;

      // Generate the message and the thread link
      const threadLink = `https://discord.com/channels/${guild.id}/${channel.id}`;
      const message = `@QA ${escapedUserId} está pidiendo ayuda en este canal: ${threadLink}`;

      // Send the message to the thread
      await channel.send(message);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while request QA.');
    }
  },
};
