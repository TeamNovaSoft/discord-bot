const { Events } = require('discord.js');
const { DISCORD_SERVER } = require('../config');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) {
      return;
    }

    const mentionedRoles = message.mentions.roles;

    if (!mentionedRoles.has(DISCORD_SERVER.discordQARoleId)) {
      return;
    }

    const qaRequestChannel = message.guild.channels.cache.find(
      (channel) => channel.name === DISCORD_SERVER.discordQAChannelName
    );

    if (!qaRequestChannel) {
      return await message.reply({
        content: `Sorry, the channel: #${DISCORD_SERVER.discordQAChannelName} for QA requests was not found!`,
        ephemeral: true,
      });
    }

    const qaRole = mentionedRoles.get(DISCORD_SERVER.discordQARoleId);
    const qaRoleIdRef = `<@&${qaRole.id}>`;
    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

    qaRequestChannel.send(`
      The role ${qaRoleIdRef} has been mentioned and a review has been requested. [Check message](${messageLink}).
      > ${message.content}.\n\nPlease create a thread on this message to send your report.  
    `);
  },
};
