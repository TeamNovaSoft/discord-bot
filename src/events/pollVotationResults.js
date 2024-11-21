const { Events } = require('discord.js');
const { pollResults } = require('../utils/poll-vote');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {

    if (message.author.bot) {
      return;
    }

    if (message.embeds[0]?.data?.type === 'poll_result') await pollResults(message)
  },
};
