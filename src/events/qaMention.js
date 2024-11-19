const { Events } = require('discord.js');
const { DISCORD_CONFIG } = require('../config');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const { embeds } = message;
    console.log('embeds!: ', embeds);
    console.log('type!: ', embeds[0]?.type);

    if (embeds.length < 0) {

      const userMentionField = embeds[0].fields.find(field => field.name === 'poll_question_text');
      let userMentioned

      const parts = userMentionField?.value.split('|').map(part => part.trim());

      if (parts.length === 2) {
        const userId = parts[1];
        userMentioned = `<@${userId}>`;
      } else {
        console.error('The format of field "poll_question_text" is not valid');
      }

      const channel = await message.client.channels.fetch(message.channelId);

      if (channel) {
        const resultsMessage = embeds[0].fields
          .map(result => `**${result.name}**: ${result.value}`)
          .join('\n');

        await channel.send(`The poll is finished. Results ${userMentioned}:\n${resultsMessage}`);
      } else {
        console.error('Channel not found:', message.channelId);
      }
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
