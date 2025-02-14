require('dotenv').config();
const { translateLanguage } = require('../languages/index');

async function sendErrorToChannel(source, title, error, additionalInfo = {}) {
  let client, commandName, user;

  if (source && source.client && source.commandName) {
    client = source.client;
    commandName =
      source.commandName ||
      translateLanguage('sendChannelError.unknownCommand');
    user = source.user
      ? source.user.tag
      : translateLanguage('sendChannelError.unknownUser');
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
    console.error(translateLanguage('sendChannelError.channelNotFound'));
    return;
  }

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

function registerGlobalErrorHandlers(client) {
  process.on('uncaughtException', async (error) => {
    console.error('Unhandled Exception:', error);
    await sendErrorToChannel(client, 'Unhandled Exception', error);
  });

  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await sendErrorToChannel(client, 'Unhandled Rejection', reason, {
      promise,
    });
  });
}

module.exports = { sendErrorToChannel, registerGlobalErrorHandlers };
