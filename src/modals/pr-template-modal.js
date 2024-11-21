const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

function createPRModal(channelId) {
  const modal = new ModalBuilder()
    .setCustomId(`pr-template-modal-${channelId}`)
    .setTitle('PR Review Request');

  const urlInput = new TextInputBuilder()
    .setCustomId('urlInput')
    .setLabel('GitHub PR URL')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const titleInput = new TextInputBuilder()
    .setCustomId('titleInput')
    .setLabel('PR Title')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const overviewInput = new TextInputBuilder()
    .setCustomId('overviewInput')
    .setLabel('Overview')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);
    .setMinLength(50);

  const howToTestInput = new TextInputBuilder()
    .setCustomId('howToTestInput')
    .setLabel('How to Test')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);
    .setMinLength(50);

  const rows = [urlInput, titleInput, overviewInput, howToTestInput].map(
    (input) => new ActionRowBuilder().addComponents(input)
  );

  modal.addComponents(...rows);
  return modal;
}

module.exports = { createPRModal };
