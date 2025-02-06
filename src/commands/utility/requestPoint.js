import { SlashCommandBuilder } from 'discord.js';
import { REQUEST_POINT } from '../../config.ts';
import { translateLanguage } from '../../languages/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('request-point')
    .setDescription(translateLanguage('requestPoint.description'))
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(translateLanguage('requestPoint.userOption'))
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription(translateLanguage('requestPoint.reasonOption'))
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const { options, channel, guild } = interaction;

      if (!channel.isThread()) {
        return await interaction.reply({
          content: translateLanguage('requestPoint.notAThread'),
          ephemeral: true,
        });
      }

      const user = options.getUser('user');
      const userMessage = options.getString('reason');
      const escapedUserId = `<@${user.id}>`;

      const threadLink = `https://discord.com/channels/${guild.id}/${channel.id}`;
      const message = translateLanguage('requestPoint.message', {
        userId: escapedUserId,
        reason: userMessage,
        threadLink,
      });

      const channelSend = await interaction.client.channels.fetch(
        REQUEST_POINT.discordAdminPointRequestChannel
      );

      if (channelSend) {
        await channelSend.send(message);
      }

      await interaction.reply({
        content: translateLanguage('requestPoint.success'),
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error executing request-point command:', error);

      await interaction.reply({
        content: translateLanguage('requestPoint.error'),
        ephemeral: true,
      });
    }
  },
};
