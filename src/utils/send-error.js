// utils/sendError.js
require('dotenv').config();
const { translateLanguage } = require('../languages/index');

/**
 * Sends an error message to the configured channel.
 *
 * @param {Interaction|Client} source - Can be the interaction object or directly the Discord client.
 * @param {string} title - Title or header of the error.
 * @param {Error} error - The Error object to report.
 * @param {object} [additionalInfo={}] - Additional information (e.g., command, user, channel, etc.).
 */
async function sendErrorToChannel(source, title, error, additionalInfo = {}) {
  let client, commandName, user;

  // If "source" has interaction properties, it is assumed to be an interaction.
  if (source && source.client && source.commandName) {
    client = source.client;
    commandName =
      source.commandName ||
      translateLanguage('sendChannelError.unknownCommand');
    user = source.user
      ? source.user.tag
      : translateLanguage('sendChannelError.unknownUser');
  } else {
    // Otherwise, it is assumed that "source" is a client directly.
    client = source;
    commandName =
      additionalInfo.command ||
      translateLanguage('sendChannelError.unknownFunction');
    user =
      additionalInfo.user || translateLanguage('sendChannelError.unknownUser');
  }

  // Ensure additionalInfo has the command or function name.
  additionalInfo.command = commandName;

  const errorChannelID = process.env.ERROR_CHANNEL_ID;
  const errorChannel = client.channels.cache.get(errorChannelID);

  if (!errorChannel || !errorChannel.isTextBased()) {
    console.error(translateLanguage('sendChannelError.channelNotFound'));
    return;
  }

  // Format the error message
  let message = `**${title}**\n`;
  message += `**${translateLanguage('sendChannelError.commandLabel')}** ${commandName}\n`;
  message += `**${translateLanguage('sendChannelError.userLabel')}** ${user}\n`;
  if (additionalInfo.channel) {
    message += `**${translateLanguage('sendChannelError.channelLabel')}** ${additionalInfo.channel}\n`;
  }
  message += `**${translateLanguage('sendChannelError.errorLabel')}** \`\`\`js\n${error.stack || error}\n\`\`\``;
  try {
    await errorChannel.send(message);
  } catch (err) {
    console.error(translateLanguage('sendChannelError.couldNotSend'), err);
  }
}

module.exports = { sendErrorToChannel };
