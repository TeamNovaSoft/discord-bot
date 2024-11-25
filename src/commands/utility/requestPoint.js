const { SlashCommandBuilder } = require('discord.js');
const { DISCORD_CONFIG } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('request-point')
    .setDescription('Request a point in this thread')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to search for')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for requesting the point')
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

      const user = options.getUser('user');
      const userMessage = options.getString('reason');
      const escapedUserId = `<@${user.id}>`;

      const threadLink = `https://discord.com/channels/${guild.id}/${channel.id}`;
      const message = `${escapedUserId} está pidiendo un punto por **${userMessage}**. Revisa el mensaje acá: ${threadLink}`;

      const channelSend = await interaction.client.channels.fetch(
        DISCORD_CONFIG.discordAdminPointRequestChannel
      );

      if (channelSend) {
        await channelSend.send(message);
      }

      await interaction.reply({
        content: 'Your request has been sent successfully.',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error executing request-point command:', error);

      await interaction.reply({
        content:
          'An error occurred while submitting your request. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
