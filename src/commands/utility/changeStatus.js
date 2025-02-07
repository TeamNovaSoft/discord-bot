import { SlashCommandBuilder } from 'discord.js';
import { MAPPED_STATUS_COMMANDS } from '../../config.ts';
import { translateLanguage } from '../../languages/index.ts';

const COMMAND_KEYS = Object.keys(MAPPED_STATUS_COMMANDS);

export default {
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

      const emojisRegExp = new RegExp(
        `(${Object.values(MAPPED_STATUS_COMMANDS).join('|')})`,
        'ig'
      );

      const channelName = channel.name.replace(emojisRegExp, '').trim();

      const updatedChannelName = `${newStatus} ${channelName}`;
      await channel.setName(updatedChannelName);

      if (message) {
        const markdownMessage =
          `# ${newStatus} ${status.replaceAll('-', ' ')}\n\n` +
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
