const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { createPRModal } = require("../../modals/pr-template-modal");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pr-template")
    .setDescription("Create a formatted PR review request")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Select channel to send the PR review request")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText),
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const modal = createPRModal(channel.id);
    await interaction.showModal(modal);
  },
};
