const { SlashCommandBuilder } = require('discord.js');
const { translateLanguage } = require('../../languages/index');
const { VOTE_POINTS } = require('../../config');

const tagIds = VOTE_POINTS.TAG_IDS;

module.exports = {
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

      // Calculate date range for the specified month
      const targetStartDate = new Date(year, month - 1, 1);
      const targetEndDate = new Date(year, month, 0);

      const fetchedPoints = {
        taskCompleted: 0,
        addPoint: 0,
        boostedPoint: 0,
      };

      for (const channelName of channels) {
        const channel = interaction.guild.channels.cache.find(
          (ch) => ch.name === channelName.trim()
        );
        if (!channel || !channel.isTextBased()) {
          continue;
        }

        const threads = await channel.threads.fetchActive();

        for (const thread of threads.threads.values()) {
          if (
            new Date(thread.createdAt) >= targetStartDate &&
            new Date(thread.createdAt) <= targetEndDate
          ) {
            const messages = await thread.messages.fetch();

            messages.forEach((message) => {
              if (message.author.id === user.id) {
                if (
                  message.content.includes(`<@&${tagIds.taskCompletedTagId}>`)
                ) {
                  fetchedPoints.taskCompleted += 1;
                }
                if (message.content.includes(`<@&${tagIds.addPointTagId}>`)) {
                  fetchedPoints.addPoint += 1;
                }
                if (
                  message.content.includes(`<@&${tagIds.boostedPointTagId}>`)
                ) {
                  fetchedPoints.boostedPoint += 1;
                }
              }
            });
          }
        }
      }
      const monthName = new Intl.DateTimeFormat(interaction.locale, {
        month: 'long',
      }).format(new Date(year, month - 1));
      const responseContent = [
        `${user.tag} - ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} - ${year}`,
        `Task Completed Points: ${fetchedPoints.taskCompleted || 0}`,
        `Add Points: ${fetchedPoints.addPoint || 0}`,
        `Boosted Points: ${fetchedPoints.boostedPoint || 0}`,
        `Total Points: ${fetchedPoints.addPoint + fetchedPoints.boostedPoint || 0}`,
      ].join('\n');

      await interaction.reply({
        content: responseContent,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error in my-points command: ${error}`);
      await interaction.reply({
        content: translateLanguage(
          'myPoints.errorFetching',
          interaction.locale
        ),
        ephemeral: true,
      });
    }
  },
};
