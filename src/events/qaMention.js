const { Events } = require('discord.js');
const { QA_MENTION } = require('../config');
const { translateLanguage } = require('../languages');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
      if (!message?.author?.bot || !message.guild) {
        return;
      }

      const mentionedRoles = message.mentions.roles;

      if (!mentionedRoles?.has(QA_MENTION.discordQARoleId)) {
        return;
      }

      const qaRequestChannel = message.guild.channels.cache.find(
        (channel) => channel.name === QA_MENTION.discordQAChannelName
      );

      if (!qaRequestChannel) {
        return await message.reply({
          content: translateLanguage('qaChannelNotFound', {
            channelName: QA_MENTION.discordQAChannelName,
          }),
          ephemeral: true,
        });
      }

      const qaRole = mentionedRoles.get(QA_MENTION.discordQARoleId);
      const qaRoleIdRef = `<@&${qaRole.id}>`;
      const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

      await qaRequestChannel.send(
        translateLanguage('qaMention.qaRequest', {
          role: qaRoleIdRef,
          link: messageLink,
          content: message.content,
        })
      );
    } catch (error) {
      console.error('Error processing the mention:', error);

      if (message.reply) {
        await message.reply({
          content: translateLanguage('qaMention.errorProcessingMention'),
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
