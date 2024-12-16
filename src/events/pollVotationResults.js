const { Events } = require('discord.js');
const { tagIds } = require('../config');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const { embeds, author, client, channelId } = message;

    if (author.bot && embeds[0]?.data?.type !== 'poll_result') {
      return;
    }

    const userMentionField = embeds[0]?.fields.find(
      (field) => field.name === 'poll_question_text'
    );
    const parts = userMentionField?.value.split('|').map((part) => part.trim());
    const userMentioned = `<@${parts[1]}>`;

    const channel = await client.channels.fetch(channelId);

    if (channel) {
      if (embeds[0].fields.length > 3) {
        const finalResult = embeds[0].fields.find(
          (result) => result.name === 'victor_answer_text'
        ).value;

        const pointTag = embeds[0]?.fields.some((field) =>
          field.name.includes('boosted')
        )
          ? tagIds.boostedPointTagId
          : tagIds.addPointTagId;

        await Promise.all(
          Array.from({ length: finalResult }).map(async () => {
            await channel.send(`<@&${pointTag}> ${userMentioned}`);
          })
        );
      } else {
        await channel.send(`The draw is not supported.`);
      }
    } else {
      console.error(`Channel not found: ${channelId}`);
      await message.reply({
        content: `Channel not found: ${channelId}`,
        ephemeral: true,
      });
    }
  },
};
