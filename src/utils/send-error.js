require('dotenv').config();
const { translateLanguage } = require('../languages/index');

async function sendErrorToChannel(source, error, additionalInfo = {}) {
  const title = translateLanguage('sendChannelError.error');

  let client, commandName, user, interaction;
  const unknownUserText = translateLanguage('sendChannelError.unknownUser');

  if (source && source.client && source.commandName) {
    client = source.client;
    commandName =
      source.commandName ||
      translateLanguage('sendChannelError.unknownCommand');
    user = source.user ? source.user.tag : unknownUserText;
    interaction = source;
  } else {
    client = source;
    commandName =
      additionalInfo.command ||
      translateLanguage('sendChannelError.unknownFunction');
    user = unknownUserText;
  }

  const errorChannelID = process.env.ERROR_CHANNEL_ID;
  const errorChannel = client.channels.cache.get(errorChannelID);

  if (!errorChannel || !errorChannel.isTextBased()) {
    console.error(translateLanguage('sendChannelError.channelNotFound'));
    return;
  }

  let message = `**${title}**\n`;
  message += `**${translateLanguage('sendChannelError.commandLabel')}** ${commandName}\n`;

  if (user !== unknownUserText) {
    message += `**${translateLanguage('sendChannelError.userLabel')}** ${user}\n`;
  }

  if (additionalInfo.channel) {
    message += `**${translateLanguage('sendChannelError.channelLabel')}** ${additionalInfo.channel}\n`;
  }

  message += `**${translateLanguage('sendChannelError.errorLabel')}** \`\`\`js\n${
    error.stack || error
  }\n\`\`\``;

  try {
    await errorChannel.send(message);
  } catch (err) {
    console.error(translateLanguage('sendChannelError.couldNotSend'), err);
  }

  if (interaction && interaction.isRepliable()) {
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: translateLanguage('sendChannelError.userMessage'),
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: translateLanguage('sendChannelError.userMessage'),
          ephemeral: true,
        });
      }
    } catch (err) {
      console.error(
        translateLanguage('sendChannelError.couldNotSendToUser'),
        err
      );
    }
  }
}

function registerGlobalErrorHandlers(client) {
  process.on('uncaughtException', async (error) => {
    console.error('Unhandled Exception:', error);
    await sendErrorToChannel(client, error);
  });

  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await sendErrorToChannel(client, reason, { promise });
  });
}

module.exports = { sendErrorToChannel, registerGlobalErrorHandlers };
