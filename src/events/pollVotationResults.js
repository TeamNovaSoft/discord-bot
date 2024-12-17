const { Events } = require('discord.js');
const { DISCORD_SERVER } = require('../config');

const tagIds = DISCORD_SERVER.VOTE_POINTS.TAG_IDS;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const { embeds, author, client, channelId } = message;

    if (
      !author.bot ||
      !Array.isArray(embeds[0]?.fields) ||
      embeds[0]?.data?.type !== 'poll_result'
    ) {
      return;
    }

    const userMentionField = embeds[0]?.fields.find(
      (field) => field.name === 'poll_question_text'
    );

    if (userMentionField === undefined) {
      return;
    }

    const parts = userMentionField.value?.split('|').map((part) => part.trim());
    if (!Array.isArray(parts) || !parts[1]) {
      return;
    }

    const userMentioned = `<@${parts[1]}>`;

    const channel = await client.channels.fetch(channelId);

    if (channel) {
      if (embeds[0].fields.length > 3) {
        const finalResult = embeds[0].fields.find(
          (result) => result.name === 'victor_answer_text'
        ).value;

        await Promise.all(
          Array.from({ length: finalResult }).map(async () => {
            await channel.send(
              `<@&${tagIds.boostedPointTagId}> ${userMentioned}`
            );
          })
        );
      } else {
        await channel.send(`The draw is not suported`);
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
