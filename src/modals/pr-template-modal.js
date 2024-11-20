const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

function createPRModal(channelId) {
  const modal = new ModalBuilder()
    .setCustomId(`pr-template-modal-${channelId}`)
    .setTitle("PR Review Request");

  const urlInput = new TextInputBuilder()
    .setCustomId("urlInput")
    .setLabel("GitHub PR URL")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const titleInput = new TextInputBuilder()
    .setCustomId("titleInput")
    .setLabel("PR Title")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const overviewInput = new TextInputBuilder()
    .setCustomId("overviewInput")
    .setLabel("Overview")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const testingInput = new TextInputBuilder()
    .setCustomId("testingInput")
    .setLabel("How to Test")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const rows = [urlInput, titleInput, overviewInput, testingInput ].map(
    (input) => new ActionRowBuilder().addComponents(input)
  );

  modal.addComponents(...rows);
  return modal;
}

module.exports = { createPRModal };
