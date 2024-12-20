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
    ),
  async execute(interaction) {
    try {
      const { options, channel } = interaction;

      if (!channel.isThread()) {
        return await interaction.reply({
          content: translateLanguage('changeStatus.notAThread'),
          ephemeral: true,
        });
      }

      const status = options.getString('status');
      const newStatus = MAPPED_STATUS_COMMANDS[status];

      if (!newStatus) {
        return await interaction.reply(
          translateLanguage('changeStatus.invalidStatus')
        );
      }

      let channelName = channel.name;
      Object.values(MAPPED_STATUS_COMMANDS).forEach((emoji) => {
        if (channelName.startsWith(emoji)) {
          channelName = channelName.replace(emoji, '').trim();
        }
      });

      const updatedChannelName = `${newStatus} ${channelName}`;
      await channel.setName(updatedChannelName);
      await interaction.reply(
        translateLanguage('changeStatus.updatedStatus', {
          status: status.replaceAll('-', ' '),
        })
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(translateLanguage('changeStatus.error'));
    }
  },
};
