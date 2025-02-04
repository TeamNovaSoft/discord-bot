const { SlashCommandBuilder } = require('discord.js');
const { DISCORD_SERVER } = require('../../config');
const { translateLanguage } = require('../../languages/index');

const ASSIGN_EMOJI = '⚔';
const ASSIGNED_PATTERN = /\|⚔ @[\w-]+\|/;
const userAssignedPattern = (username) =>
  new RegExp(`\\|${ASSIGN_EMOJI} \\@(${username})\\|`, 'g');

const getAssignReply = async ({ originalChannelName, user, client }) => {
  const assignedUsername = user.username;
  const escapedNewUserId = `<@${user.id}>`;
  const currentUserAssignationString = `|${ASSIGN_EMOJI} @${assignedUsername}|`;

  if (originalChannelName.includes(currentUserAssignationString)) {
    return {
      content: translateLanguage('tasksThread.taskAssigned'),
    };
  }

  if (originalChannelName.search(ASSIGNED_PATTERN) < 0) {
    return {
      channelName: `${currentUserAssignationString} ${originalChannelName}`,
      content: translateLanguage('tasksThread.taskAssignedTo', {
        newUserId: escapedNewUserId,
      }),
    };
  }

  const guild = await client.guilds.fetch(DISCORD_SERVER.discordGuildId);
  const members = await guild.members.fetch();
  const previousAssignedMember = members.find(
    (member) =>
      originalChannelName.search(userAssignedPattern(member.user.username)) >= 0
  );
  const escapedOriginalUserId = `<@${previousAssignedMember?.id}>`;
  const previousAssignedUsername = previousAssignedMember?.user?.username;
  const userAssignationString = `|${ASSIGN_EMOJI} @${assignedUsername}|`;
  const updatedChannelName = `${userAssignationString} ${originalChannelName.replace(userAssignedPattern(previousAssignedUsername), '')}`;

  return {
    channelName: updatedChannelName,
    content: translateLanguage('tasksThread.reassignedTaskTo', {
      originalUserAssigned: escapedOriginalUserId,
      newUserAssigned: escapedNewUserId,
    }),
  };
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('assign-me')
    .setDescription(
      'Mark a task as assigned and define the name of the user that is assigned in the thread'
    ),
  async execute(interaction) {
    try {
      const { channel, client, user } = interaction;
      await interaction.deferReply();

      if (!channel.isThread()) {
        return await interaction.editReply({
          content: translateLanguage('changeStatus.notAThread'),
        });
      }
      const channelName = channel.name;
      const { channelName: updatedChannelName, content } = await getAssignReply(
        { client, originalChannelName: channelName, user }
      );

      if (updatedChannelName) {
        await channel.setName(updatedChannelName);
      }

      await interaction.editReply({
        content,
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply(translateLanguage('changeStatus.error'));
    }
  },
};
