const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

function createSendMessageModal(channelId, userName) {
  const modal = new ModalBuilder()
    .setCustomId(`send-message-modal-${channelId}-${userName}`)
    .setTitle('Send message Request');

  const titleInput = new TextInputBuilder()
    .setCustomId('titleInput')
    .setLabel(' Message Title')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('descriptionInput')
    .setLabel('Message Description')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(50);

  const rows = [titleInput, descriptionInput].map((input) =>
    new ActionRowBuilder().addComponents(input)
  );

  modal.addComponents(...rows);
  return modal;
}

module.exports = { createSendMessageModal };
