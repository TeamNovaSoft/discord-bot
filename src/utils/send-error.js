require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const { translateLanguage } = require('../languages/index');
const { getGitHubIssueURL } = require('./githubIssue');

/**
 * Maximum character length for a Discord embed description.
 *
 * This constant is based on the limit defined by Discord's API.
 * Exceeding this limit will result in an error when attempting to send the embed.
 *
 * @see {@link https://discordjs.guide/popular-topics/embeds.html#embed-limits}
 * @type {number}
 */
const MAX_EMBED_MESSAGE_DESCRIPTION_LENGTH = 4096;

/**
 * Maximum character length for an error message (regular message).
 *
 * This constant defines the upper limit for the length of error messages
 * sent to Discord (regular text messages).
 * It's used to prevent exceeding Discord's normal message size limits and ensure that
 * error reports are delivered successfully.
 *
 * @type {number}
 */
const MAX_ERROR_MESSAGE_LENGTH = 1000;

const GITHUB_IMAGE_LOGO =
  'https://github.githubassets.com/assets/github-mark-57519b92ca4e.png';

function buildErrorMessage({ error, commandName, user, additionalInfo }) {
  const title = `Error: ${error.message.slice(0, 200)}. ${translateLanguage('sendChannelError.errorReport')}`;
  const errorStack = (error.stack || error).toString();
  const gitHubIssueURL = getGitHubIssueURL(errorStack);

  if (errorStack.length >= MAX_ERROR_MESSAGE_LENGTH) {
    const embedMessage = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`**${title}**\n`)
      .setThumbnail(GITHUB_IMAGE_LOGO)
      .setURL(gitHubIssueURL)
      .setDescription(
        `
        **${translateLanguage('sendChannelError.commandLabel')}** ${commandName}\n
        ${
          user !== translateLanguage('sendChannelError.unknownUser')
            ? `**${translateLanguage('sendChannelError.userLabel')}** ${user}\n`
            : ''
        }
        ${
          additionalInfo.channel
            ? `**${translateLanguage('sendChannelError.channelLabel')}** ${additionalInfo.channel}\n`
            : ''
        }

        **${translateLanguage('sendChannelError.errorLabel')}** \`\`\`js\n${errorStack}\n\`\`\`

        ${
          gitHubIssueURL
            ? `\n🔗 **${translateLanguage('sendChannelError.reportIssue')}**: [${translateLanguage('sendChannelError.clickHere')}](${gitHubIssueURL})`
            : ''
        }
        `.slice(0, MAX_EMBED_MESSAGE_DESCRIPTION_LENGTH)
      );

    return embedMessage;
  }

  let message = `**${title}**\n`;
  message += `**${translateLanguage('sendChannelError.commandLabel')}** ${commandName}\n`;

  if (user !== translateLanguage('sendChannelError.unknownUser')) {
    message += `**${translateLanguage('sendChannelError.userLabel')}** ${user}\n`;
  }

  if (additionalInfo.channel) {
    message += `**${translateLanguage('sendChannelError.channelLabel')}** ${additionalInfo.channel}\n`;
  }

  message += `**${translateLanguage('sendChannelError.errorLabel')}** \`\`\`js\n${errorStack}\n\`\`\``;

  const issueUrl = getGitHubIssueURL(errorStack);

  if (issueUrl) {
    message += `\n🔗 **${translateLanguage('sendChannelError.reportIssue')}**: [${translateLanguage('sendChannelError.clickHere')}](${issueUrl})`;
  }

  return message;
}

async function sendErrorToChannel(source, error, additionalInfo = {}) {
  let client, commandName, user, interaction;

  if (source && source.client && source.commandName) {
    client = source.client;
    commandName =
      source.commandName ||
      translateLanguage('sendChannelError.unknownCommand');
    user = source.user
      ? source.user.tag
      : translateLanguage('sendChannelError.unknownUser');
    interaction = source;
  } else {
    client = source;
    commandName =
      additionalInfo.command ||
      translateLanguage('sendChannelError.unknownFunction');
    user = translateLanguage('sendChannelError.unknownUser');
  }

  const errorChannelID = process.env.ERROR_CHANNEL_ID;
  const errorChannel = client.channels.cache.get(errorChannelID);

  if (!errorChannel || !errorChannel.isTextBased()) {
    if (interaction && interaction.replied === false) {
      try {
        await interaction.reply({
          content: translateLanguage('sendChannelError.channelNotFound'),
          ephemeral: true,
        });
      } catch (err) {
        console.error(
          translateLanguage('sendChannelError.couldNotSendToUser \n'),
          `Failed to find error channel with ID: ${errorChannelID}\n${err}`,
          err
        );
      }
    }
    return;
  }

  const errorMessage = buildErrorMessage({
    error,
    commandName,
    user,
    additionalInfo,
  });

  try {
    await errorChannel.send(
      errorMessage.data ? { embeds: [errorMessage] } : errorMessage
    );
  } catch (err) {
    console.error(translateLanguage('sendChannelError.couldNotSend'), err);
  }

  if (interaction && interaction.isRepliable()) {
    try {
      await interaction.followUp({
        content: translateLanguage('sendChannelError.userMessage'),
        ephemeral: true,
      });
    } catch (err) {
      console.error(
        translateLanguage('sendChannelError.couldNotSendToUser'),
        err
      );
    }
  }
}

module.exports = { sendErrorToChannel };
