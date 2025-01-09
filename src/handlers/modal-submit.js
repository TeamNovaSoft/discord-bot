const { formatPRMessage } = require('../utils/pr-formatter');
const { formatSendMessage } = require('../utils/send-message-formatter');
const { translateLanguage } = require('../../languages/index');

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
          content: translateLanguage('prTemplate.modal.channelNotFound'),
          ephemeral: true,
        });
        return;
      }

      const permissions = channel.permissionsFor(interaction.client.user);
      if (!permissions.has('SendMessages')) {
        await interaction.editReply({
          content: translateLanguage('prTemplate.modal.noPermissions'),
          ephemeral: true,
        });
        return;
      }

      await channel.send(formattedMessage);
      await interaction.editReply({
        content: translateLanguage('prTemplate.modal.postSuccess', {
          channel: channel.toString(),
        }),
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error sending PR message:', error);
      await interaction.editReply({
        content: translateLanguage('prTemplate.modal.postError'),
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
          content: translateLanguage('sendMessage.modal.channelNotFound'),
          ephemeral: true,
        });
        return;
      }

      const permissions = channel.permissionsFor(interaction.client.user);
      if (!permissions.has('SendMessages')) {
        await interaction.editReply({
          content: translateLanguage('sendMessage.modal.noPermissions'),
          ephemeral: true,
        });
        return;
      }

      await channel.send(formattedMessage);
      await interaction.editReply({
        content: translateLanguage('sendMessage.modal.postSuccess', {
          channel: channel.toString(),
        }),
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error sending announcement:', error);
      await interaction.editReply({
        content: translateLanguage('sendMessage.modal.postError'),
        ephemeral: true,
      });
    }
  }
}

module.exports = { handleModalSubmit };
