import { SlashCommandBuilder } from 'discord.js';
import { translateLanguage } from '../../languages/index.js';
import { VOTE_POINTS } from '../../config.ts';

const tagIds = VOTE_POINTS.TAG_IDS;

export default {
  data: new SlashCommandBuilder()
    .setName('my-points')
    .setDescription(translateLanguage('myPoints.description'))
    .addIntegerOption((option) =>
      option
        .setName('year')
        .setDescription(translateLanguage('myPoints.yearOption'))
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('month')
        .setDescription(translateLanguage('myPoints.monthOption'))
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(translateLanguage('myPoints.userOption'))
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('channels')
        .setDescription(translateLanguage('myPoints.channelsOption'))
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

      const targetStartDate = new Date(year, month - 1, 1);
      const targetEndDate = new Date(year, month, 0);

      const fetchedPoints = {
        taskCompleted: 0,
        addPoint: 0,
        boostedPoint: 0,
      };
      function calculatePoints(messages, user, tagIds, fetchedPoints) {
        messages.forEach((message) => {
          if (message.author.id !== interaction.client.user.id) {
            return;
          }

          const userMentionRegex = /<@(\d+)>/g;
          const mentionedUsers = Array.from(
            message.content.matchAll(userMentionRegex),
            (match) => match[1]
          );

          mentionedUsers.forEach((mentionedUserId) => {
            if (mentionedUserId === user.id) {
              if (
                message.content.includes(`<@&${tagIds.taskCompletedTagId}>`)
              ) {
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
        });
      }

      async function processChannel(channelName) {
        const channel = interaction.guild.channels.cache.find(
          (ch) => ch.name === channelName && ch.isTextBased()
        );
        if (!channel) {
          return;
        }

        const activeThreads = await channel.threads.fetchActive();
        for (const thread of activeThreads.threads.values()) {
          const threadCreationDate = new Date(thread.createdAt);
          if (
            threadCreationDate >= targetStartDate &&
            threadCreationDate <= targetEndDate
          ) {
            const messages = await thread.messages.fetch();
            calculatePoints(messages, user, tagIds, fetchedPoints);
          }
        }
      }

      // Process channels concurrently
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

      await interaction.editReply({
        content: responseContent,
      });
    } catch (error) {
      console.error(`Error in my-points command: ${error}`);
      await interaction.editReply({
        content: translateLanguage(
          'myPoints.errorFetching',
          interaction.locale
        ),
      });
    }
  },
};
