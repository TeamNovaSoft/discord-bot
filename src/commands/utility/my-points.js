const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage, keyTranslations } = require('../../languages');
const { VOTE_POINTS } = require('../../config');
const { sendErrorToChannel } = require('../../utils/send-error');

const tagIds = VOTE_POINTS.TAG_IDS;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my-points')
    .setDescription(translateLanguage('myPoints.description'))
    .setDescriptionLocalizations(keyTranslations('myPoints.description'))
    .addIntegerOption((option) =>
      option
        .setName('year')
        .setDescription(translateLanguage('myPoints.yearOption'))
        .setDescriptionLocalizations(keyTranslations('myPoints.yearOption'))
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('month')
        .setDescription(translateLanguage('myPoints.monthOption'))
        .setDescriptionLocalizations(keyTranslations('myPoints.monthOption'))
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(translateLanguage('myPoints.userOption'))
        .setDescriptionLocalizations(keyTranslations('myPoints.userOption'))
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('channels')
        .setDescription(translateLanguage('myPoints.channelsOption'))
        .setDescriptionLocalizations(keyTranslations('myPoints.channelsOption'))
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const currentDate = new Date();
      const year =
        interaction.options.getInteger('year') || currentDate.getFullYear();
      const month =
        interaction.options.getInteger('month') || currentDate.getMonth() + 1;
      const user = interaction.options.getUser('user') || interaction.user;

      const channelsInput = interaction.options.getString('channels');
      const channels = channelsInput
        ? channelsInput.split(',').map((channel) => channel.trim())
        : [];

      const targetStartDate = new Date(year, month - 1, 0);
      const targetEndDate = new Date(year, month, 1);

      const fetchedPoints = {
        taskCompleted: 0,
        addPoint: 0,
        boostedPoint: 0,
      };

      function calculatePoints(
        messages,
        user,
        tagIds,
        fetchedPoints,
        start,
        end
      ) {
        messages.forEach((message) => {
          if (message.author.id !== interaction.client.user.id) {
            return;
          }

          const messageDate = new Date(message.createdAt);
          if (messageDate < start || messageDate >= end) {
            return;
          }

          const userMentionRegex = /<@(\d+)>/g;
          const mentionedUsers = Array.from(
            message.content.matchAll(userMentionRegex),
            (match) => match[1]
          );

          if (mentionedUsers.includes(user.id)) {
            if (message.content.includes(`<@&${tagIds.taskCompletedTagId}>`)) {
              fetchedPoints.taskCompleted += 1;
            }
            if (message.content.includes(`<@&${tagIds.addPointTagId}>`)) {
              fetchedPoints.addPoint += 1;
            }
            if (message.content.includes(`<@&${tagIds.boostedPointTagId}>`)) {
              fetchedPoints.boostedPoint += 1;
            }
          }
        });
      }

      async function processChannel(channelName) {
        const channel = interaction.guild.channels.cache.find(
          (ch) => ch.name === channelName && ch.isTextBased()
        );
        if (!channel) {
          return;
        }

        const activeThreadsData = await channel.threads.fetchActive();
        const archivedThreadsData = await channel.threads.fetchArchived({
          type: 'public',
        });
        const threads = [
          ...activeThreadsData.threads.values(),
          ...archivedThreadsData.threads.values(),
        ];

        for (const thread of threads) {
          const messages = await thread.messages.fetch();
          calculatePoints(
            messages,
            user,
            tagIds,
            fetchedPoints,
            targetStartDate,
            targetEndDate
          );
        }
      }

      await Promise.all(channels.map(processChannel));

      const monthName = new Intl.DateTimeFormat(interaction.locale, {
        month: 'long',
      }).format(new Date(year, month - 1));
      const responseContent = [
        `${user.tag} - ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} - ${year}`,
        `${translateLanguage('myPoints.taskComplete')}: ${fetchedPoints.taskCompleted || 0}`,
        `${translateLanguage('myPoints.addPoints')}: ${fetchedPoints.addPoint || 0}`,
        `${translateLanguage('myPoints.boostedPoints')}: ${fetchedPoints.boostedPoint || 0}`,
        `${translateLanguage('myPoints.totalPoints')}: ${fetchedPoints.addPoint + fetchedPoints.boostedPoint || 0}`,
      ].join('\n');

      await interaction.editReply({ content: responseContent });
    } catch (error) {
      console.error(`Error in my-points command: ${error}`);
      await sendErrorToChannel(interaction, error);
      await interaction.editReply({
        content: translateLanguage(
          'myPoints.errorFetching',
          interaction.locale
        ),
      });
    }
  },
};
