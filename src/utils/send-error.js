require('dotenv').config();
const { translateLanguage } = require('../languages/index');
const { getGitHubIssueURL } = require('./githubIssue');

async function sendErrorToChannel(source, error, additionalInfo = {}) {
  const title = translateLanguage('sendChannelError.error');

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

  let message = `**${title}**\n`;
  message += `**${translateLanguage('sendChannelError.commandLabel')}** ${commandName}\n`;

  if (user !== translateLanguage('sendChannelError.unknownUser')) {
    message += `**${translateLanguage('sendChannelError.userLabel')}** ${user}\n`;
  }

  if (additionalInfo.channel) {
    message += `**${translateLanguage('sendChannelError.channelLabel')}** ${additionalInfo.channel}\n`;
  }

  message += `**${translateLanguage('sendChannelError.errorLabel')}** \`\`\`js\n${error.stack || error}\n\`\`\``;

  const issueUrl = getGitHubIssueURL(error.stack || error);
  if (issueUrl) {
    message += `\n🔗 **${translateLanguage('sendChannelError.reportIssue')}**: [${translateLanguage('sendChannelError.clickHere')}](${issueUrl})`;
  }

  try {
    await errorChannel.send(message);
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
