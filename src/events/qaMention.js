const { Events } = require("discord.js");
const { DISCORD_CONFIG } = require("../config");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const mentionedRoles = message.mentions.roles;

    if (!mentionedRoles.has(DISCORD_CONFIG.discordQARoleId)) return;

    const qaRequestChannel = message.guild.channels.cache.find(channel => channel.name === DISCORD_CONFIG.discordQAChannelName);

    if (!qaRequestChannel) {
      return await message.reply({ content: `Sorry, the channel: #${DISCORD_CONFIG.discordQAChannelName} for QA requests was not found!`, ephemeral: true });
    };

    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
    qaRequestChannel.send(`The role @qa has been mentioned and a review has been requested. [Check message](${messageLink})`);
  },
};
