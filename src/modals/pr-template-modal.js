const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { translateLanguage } = require('../languages/index');

function createPRModal(channelId) {
  const modal = new ModalBuilder()
    .setCustomId(`pr-template-modal-${channelId}`)
    .setTitle(translateLanguage('prTemplate.modal.modalTitle'));

  const urlInput = new TextInputBuilder()
    .setCustomId('urlInput')
    .setLabel(translateLanguage('prTemplate.modal.urlLabel'))
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const titleInput = new TextInputBuilder()
    .setCustomId('titleInput')
    .setLabel(translateLanguage('prTemplate.modal.titleLabel'))
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const overviewInput = new TextInputBuilder()
    .setCustomId('overviewInput')
    .setLabel(translateLanguage('prTemplate.modal.overviewLabel'))
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(50);

  const howToTestInput = new TextInputBuilder()
    .setCustomId('howToTestInput')
    .setLabel(translateLanguage('prTemplate.modal.howToTestLabel'))
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(50);

  const rows = [urlInput, titleInput, overviewInput, howToTestInput].map(
    (input) => new ActionRowBuilder().addComponents(input)
  );

  modal.addComponents(...rows);
  return modal;
}

module.exports = { createPRModal };
