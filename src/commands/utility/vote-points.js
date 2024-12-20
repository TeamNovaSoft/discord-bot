const { SlashCommandBuilder } = require('discord.js');
const { VOTE_POINTS } = require('../../config');
const { translateLanguage } = require('../../languages/index');

const tagIds = VOTE_POINTS.TAG_IDS;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote-points')
    .setDescription(translateLanguage('votePoints.description'))
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(translateLanguage('votePoints.userDescription'))
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const roleMention = `<@&${tagIds.taskCompletedTagId}>`;
    const userMention = `<@${user.id}>`;
    const question = translateLanguage('votePoints.pollQuestion', {
      userId: user.id,
    });

    // Reply with the mention of the role and user
    await interaction.reply(`${roleMention} ${userMention}`);

    // Follow-up with the poll
    await interaction.followUp({
      poll: {
        question: {
          text: question,
          emoji: { name: '🧮' },
        },
        allowMultiselect: false,
        duration: 24, // Duration in hours
        answers: VOTE_POINTS.ANSWERS,
      },
    });
  },
};
