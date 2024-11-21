const { tagIds } = require("../config");

const pollResults = async (message) => {
  const { embeds } = message;

  const userMentionField = embeds[0].fields.find(field => field.name === 'poll_question_text');
  const parts = userMentionField?.value.split('|').map(part => part.trim());

  const userMentioned = `<@${parts[1]}>`;

  const channel = await message.client.channels.fetch(message.channelId);

  if (channel) {
    if (embeds[0].fields.length > 3) {
      let finalResult = embeds[0].fields
        .find(result => result.name === 'victor_answer_text').value

      await Promise.all(Array.from({ length: finalResult })
        .map(async () => {
          await channel.send(`<@&${tagIds.boostedPointTagId}> ${userMentioned}`);
        }));
    } else {
      await channel.send(`The draw is not suported`);
    }

  } else {
    return console.error('Channel not found:', message.channelId);
  }
}

module.exports = { pollResults }
