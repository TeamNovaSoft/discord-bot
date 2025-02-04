const { SlashCommandBuilder } = require('discord.js');
const { MAPPED_STATUS_COMMANDS } = require('../../config');
const { translateLanguage } = require('../../languages/index');

const COMMAND_KEYS = Object.keys(MAPPED_STATUS_COMMANDS);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('change-status')
    .setDescription(translateLanguage('changeStatus.description'))
    .addStringOption((option) =>
      option
        .setName('status')
        .setDescription(translateLanguage('changeStatus.statusOption'))
        .setRequired(true)
        .addChoices(
          COMMAND_KEYS.map((command) => ({
            name: command.replaceAll('pr-', '').replaceAll('-', ' '),
            value: command,
          }))
        )
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription(translateLanguage('changeStatus.messageOption'))
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const { options, channel, user } = interaction;
      await interaction.deferReply({ ephemeral: true });

      if (!channel.isThread()) {
        return await interaction.editReply({
          content: translateLanguage('changeStatus.notAThread'),
          ephemeral: true,
        });
      }

      const status = options.getString('status');
      const message = options.getString('message');
      const newStatus = MAPPED_STATUS_COMMANDS[status];

      if (!newStatus) {
        return await interaction.editReply(
          translateLanguage('changeStatus.invalidStatus')
        );
      }

      // This line escapes special regex characters in the emoji values from MAPPED_STATUS_COMMANDS.
      // It ensures that symbols like *, +, or ? are treated as literals when used in a regex.
      const escapedEmojis = Object.values(MAPPED_STATUS_COMMANDS).map((emoji) =>
        emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      );
      const emojisRegExp = new RegExp(`^(${escapedEmojis})\\s?`, 'ig');

      const channelName = channel.name.replace(emojisRegExp, '').trim();

      const updatedChannelName = `${newStatus} ${channelName}`;
      await channel.setName(updatedChannelName);

      if (message) {
        const markdownMessage =
          `# ${MAPPED_STATUS_COMMANDS[status]} ${status.replaceAll('-', ' ')}\n\n` +
          `${message}\n\n` +
          `> ${user}`;
        await channel.send(markdownMessage);
      }

      await interaction.editReply(
        translateLanguage('changeStatus.updatedStatus', {
          status: status.replaceAll('-', ' '),
        })
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(translateLanguage('changeStatus.error'));
    }
  },
};
