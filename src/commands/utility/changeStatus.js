const { SlashCommandBuilder } = require("discord.js");

const MAPPED_STATUS_COMMANDS = {
  'pr-no-merge': '🚫',
  'pr-sos': '🆘',
  'pr-draft': '🚧',
  'pr-reviewing': '👀',
  'pr-request-changes': '🔁',
  'pr-request-review': '❗',
  'pr-working-in-fixes': '🧑‍🔧',
  'pr-approved': '✅',
  'pr-merged': '✅🛫',
  'pr-merged-need-tasks': '✅🛫📝',
  'pr-merged-task-created': '✅🛫📋'
};

const COMMAND_KEYS = Object.keys(MAPPED_STATUS_COMMANDS);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changestatus')
    .setDescription('Change the status of the thread')
    .addStringOption(option =>
      option.setName('status')
        .setDescription('status command')
        .setRequired(true)
        .addChoices(
          COMMAND_KEYS.map(command => ({ name: `/${command}`, value: command }))
        )
    ),
  async execute(interaction) {
    try {

      const { options, channel } = interaction;

      if (!channel.isThread()) return await interaction.reply("Sorry, this is not a thread!");

      const status = options.getString('status');
      const newStatus = MAPPED_STATUS_COMMANDS[status];

      if (!newStatus) {
        return await interaction.reply("Invalid status command.");
      }

      const oldStatus = COMMAND_KEYS.find(command => channel.name.startsWith(MAPPED_STATUS_COMMANDS[command]));
      const regex = new RegExp(`(${MAPPED_STATUS_COMMANDS[oldStatus]})`, 'g');
      const channelNameWithStatus = oldStatus ? channel.name.replace(regex, newStatus) : `${newStatus} ${channel.name}`;

      await channel.setName(channelNameWithStatus);
      await interaction.reply(`Status updated to ${channelNameWithStatus}`);
    } catch (error) {
      await interaction.reply("An error occurred while updating the status.");
    }
  },
};
