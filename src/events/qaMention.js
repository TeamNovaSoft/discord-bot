const { Events } = require('discord.js');
const { DISCORD_CONFIG } = require('../config');
const { pollResults } = require('../utils/poll-vote');

const boostedPointTagId =
      process.env.ADD_BOOSTED_POINT_TAG_ID || '1263873487953592381';

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {

    if (message.embeds[0]?.data?.type === 'poll_result') {
      pollResults(message)
    }

    if (message.author.bot) {
      return;
    }

    const mentionedRoles = message.mentions.roles;

    if (!mentionedRoles.has(DISCORD_CONFIG.discordQARoleId)) {
      return;
    }

    const qaRequestChannel = message.guild.channels.cache.find(
      (channel) => channel.name === DISCORD_CONFIG.discordQAChannelName
    );

    if (!qaRequestChannel) {
      return await message.reply({
        content: `Sorry, the channel: #${DISCORD_CONFIG.discordQAChannelName} for QA requests was not found!`,
        ephemeral: true,
      });
    }

    const qaRole = mentionedRoles.get(DISCORD_CONFIG.discordQARoleId);
    const qaRoleIdRef = `<@&${qaRole.id}>`;
    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

    qaRequestChannel.send(`
      The role ${qaRoleIdRef} has been mentioned and a review has been requested. [Check message](${messageLink}).
      > ${message.content}.\n\nPlease create a thread on this message to send your report.  
    `);
  },
};
