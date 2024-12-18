const { Events } = require('discord.js');
const { tagIds } = require('../config');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const { embeds, author, client, channelId } = message;

    if (!author.bot || !embeds || embeds[0]?.data?.type !== 'poll_result') {
      return;
    }

    const userMentionField = embeds[0]?.fields.find(
      (field) => field.name === 'poll_question_text'
    );
    const parts = userMentionField?.value.split('|').map((part) => part.trim());
    const userMentioned = `<@${parts[1]}>`;

    const pollMeta = embeds[0]?.data?.meta;
    const pointType = pollMeta?.pointType || 'normal';
    const selectedTagId =
      pointType === 'boosted' ? tagIds.boostedPointTagId : tagIds.addPointTagId;

    console.log('Point Type:', pointType);
    console.log('Selected Tag ID:', selectedTagId);

    const finalResultField = embeds[0]?.fields.find(
      (field) => field.name === 'victor_answer_text'
    );
    const finalResult = parseInt(finalResultField?.value || '0', 10);

    const channel = await client.channels.fetch(channelId);

    if (channel) {
      if (finalResult > 0) {
        await Promise.all(
          Array.from({ length: finalResult }).map(async () => {
            await channel.send(`<@&${selectedTagId}> ${userMentioned}`);
          })
        );
      } else {
        await channel.send(
          `The draw is not supported or no points were awarded.`
        );
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
