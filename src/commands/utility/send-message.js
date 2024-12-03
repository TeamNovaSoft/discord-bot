const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send-message')
    .setDescription('Replies with your input!')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of message')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('The description of message')
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The channel to message into')
    ),
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const channel = interaction.options.getChannel('channel');
    const user = interaction.user;
    const userImage = user.displayAvatarURL({ dynamic: true, size: 128 });

    console.log(interaction);

    const embedMessage = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(title)
      .setDescription(description)
      .setAuthor({ name: user?.globalName, iconURL: userImage, url: userImage })
      .setTimestamp();

    if (channel) {
      await channel.send({ embeds: [embedMessage] });
      await interaction.reply({
        content: `Message sent to ${channel.name}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({ embeds: [embedMessage] });
    }
  },
};
