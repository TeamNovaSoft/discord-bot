const { Events } = require('discord.js');
const { VOTE_POINTS } = require('../config');

const tagIds = VOTE_POINTS.TAG_IDS;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const { embeds, author, client, channelId } = message;

    if (!author.bot || !embeds || embeds[0]?.data?.type !== 'poll_result') {
      return;
    }

    try {
      const questionField = embeds[0]?.fields.find(
        (field) => field.name === 'poll_question_text'
      );

      if (!questionField) {
        return;
      }

      const parts = questionField.value.split('|').map((part) => part.trim());
      if (!parts || parts.length < 2) {
        return;
      }

      const userMentioned = `<@${parts[1]}>`;
      const pointType = parts[0].toLowerCase().includes('boosted')
        ? 'boosted'
        : 'normal';

      const selectedTagId =
        pointType === 'boosted'
          ? tagIds.boostedPointTagId
          : tagIds.addPointTagId;

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
            `The result was not valid or no points were awarded.`
          );
        }
      } else {
        await message.reply({
          content: `Could not find the channel: ${channelId}`,
          ephemeral: true,
        });
      }
    } catch {
      await message.reply({
        content: 'An error occurred while processing the poll result.',
        ephemeral: true,
      });
    }
  },
};
