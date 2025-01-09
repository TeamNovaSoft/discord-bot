const { formatPRMessage } = require('../utils/pr-formatter');
const { formatSendMessage } = require('../utils/send-message-formatter');

async function handleModalSubmit(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (interaction.customId.startsWith('pr-template-modal-')) {
    const channelId = interaction.customId.replace('pr-template-modal-', '');
    const prUrl = interaction.fields.getTextInputValue('urlInput');
    const title = interaction.fields.getTextInputValue('titleInput');
    const overview = interaction.fields.getTextInputValue('overviewInput');
    const howToTest = interaction.fields.getTextInputValue('howToTestInput');

    const formattedMessage = formatPRMessage({
      prUrl,
      title,
      overview,
      howToTest,
      requester: interaction.user,
    });

    try {
      const channel = await interaction.client.channels.fetch(channelId);

      if (!channel) {
        await interaction.editReply({
          content: '❌ The channel you are trying to access was not found.',
          ephemeral: true,
        });
        return;
      }

      const permissions = channel.permissionsFor(interaction.client.user);
      if (!permissions.has('SendMessages')) {
        await interaction.editReply({
          content:
            "❌ I don't have permission to send messages in that channel.",
          ephemeral: true,
        });
        return;
      }

      await channel.send(formattedMessage);
      await interaction.editReply({
        content: `✅ PR review request has been posted in ${channel}!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error sending PR message:', error);
      await interaction.editReply({
        content: '❌ Failed to post PR review request. Please try again.',
        ephemeral: true,
      });
    }
  }
  if (interaction.customId.startsWith('send-message-modal-')) {
    const result = interaction.customId.replace('send-message-modal-', '');
    const [channelId, userName] = result.split('-');
    const title = interaction.fields.getTextInputValue('titleInput');
    const description =
      interaction.fields.getTextInputValue('descriptionInput');

    const formattedMessage = formatSendMessage({
      title,
      description,
      userName,
    });

    try {
      const channel = await interaction.client.channels.fetch(channelId);

      if (!channel) {
        await interaction.editReply({
          content: '❌ The channel you are trying to access was not found.',
          ephemeral: true,
        });
        return;
      }

      const permissions = channel.permissionsFor(interaction.client.user);
      if (!permissions.has('SendMessages')) {
        await interaction.editReply({
          content:
            "❌ I don't have permission to send messages in that channel.",
          ephemeral: true,
        });
        return;
      }

      await channel.send(formattedMessage);
      await interaction.editReply({
        content: `✅ PR review request has been posted in ${channel}!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error sending PR message:', error);
      await interaction.editReply({
        content: '❌ Failed to post PR review request. Please try again.',
        ephemeral: true,
      });
    }
  }
}

module.exports = { handleModalSubmit };
