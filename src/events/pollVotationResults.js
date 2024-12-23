const { Events } = require('discord.js');
const { VOTE_POINTS } = require('../config');

const tagIds = VOTE_POINTS.TAG_IDS;
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const { embeds, author, client, channelId } = message;

    if (
      !author.bot ||
      !embeds ||
      !Array.isArray(embeds[0]?.fields) ||
      embeds[0]?.data?.type !== 'poll_result'
    ) {
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
      const isBoostedPoint = parts[0].toLowerCase().includes('boosted');
      const selectedTagId = isBoostedPoint
        ? tagIds.boostedPointTagId
        : tagIds.addPointTagId;

      if (embeds[0]?.fields.length <= 3) {
        return await client.channels.fetch(channelId).then((channel) => {
          if (channel) {
            return channel.send(`The draw is not supported.`);
          }
        });
      }

      const finalResultField = embeds[0]?.fields.find(
        (field) => field.name === 'victor_answer_text'
      );
      const finalResult = parseInt(finalResultField?.value || '0', 10);

      if (!finalResult || isNaN(finalResult)) {
        return await message.reply(
          `The result was not valid or no points were awarded.`
        );
      }

      const channel = await client.channels.fetch(channelId);

      if (!channel) {
        return await message.reply(`Could not find the channel: ${channelId}`);
      }

      await Promise.all(
        Array.from({ length: finalResult }).map(async () => {
          await channel.send(`<@&${selectedTagId}> ${userMentioned}`);
        })
      );
    } catch {
      await message.reply({
        content: 'An error occurred while processing the poll result.',
        ephemeral: true,
      });
    }
  },
};
