const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { translateLanguage } = require('../languages');

function createSendMessageModal(channelId, userName) {
  const modal = new ModalBuilder()
    .setCustomId(`send-message-modal-${channelId}-${userName}`)
    .setTitle(translateLanguage('sendMessage.modal.modalTitle'));

  const titleInput = new TextInputBuilder()
    .setCustomId('titleInput')
    .setLabel(translateLanguage('sendMessage.modal.titleLabel'))
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('descriptionInput')
    .setLabel(translateLanguage('sendMessage.modal.descriptionLabel'))
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setMinLength(50);

  const rows = [titleInput, descriptionInput].map((input) =>
    new ActionRowBuilder().addComponents(input)
  );

  modal.addComponents(...rows);
  return modal;
}

module.exports = { createSendMessageModal };
