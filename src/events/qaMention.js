const { Events } = require('discord.js');
const { QA_MENTION } = require('../config');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
      if (!message || !message.author || message.author.bot) {
        return;
      }

      const mentionedRoles = message.mentions.roles;

      if (!mentionedRoles || !mentionedRoles.has(QA_MENTION.discordQARoleId)) {
        return;
      }

      if (!message.guild) {
        return;
      }

      const qaRequestChannel = message.guild.channels.cache.find(
        (channel) => channel.name === QA_MENTION.discordQAChannelName
      );

      if (!qaRequestChannel) {
        return await message.reply({
          content: `Sorry, the channel: #${QA_MENTION.discordQAChannelName} for QA requests was not found!`,
          ephemeral: true,
        });
      }

      const qaRole = mentionedRoles.get(QA_MENTION.discordQARoleId);
      const qaRoleIdRef = `<@&${qaRole.id}>`;
      const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

      await qaRequestChannel.send(`
        The role ${qaRoleIdRef} has been mentioned and a review has been requested. [Check message](${messageLink}).
        > ${message.content}.\n\nPlease create a thread on this message to send your report.
      `);
    } catch (error) {
      console.error('Error processing the mention:', error);

      if (message.reply) {
        await message.reply({
          content:
            'An error occurred while processing your request. Please try again later.',
          ephemeral: true,
        });
      } else {
        console.error(
          'Could not send the reply due to an error in message.reply.'
        );
      }
    }
  },
};
