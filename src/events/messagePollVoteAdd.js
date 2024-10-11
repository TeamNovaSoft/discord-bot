const { Events } = require('discord.js');

module.exports = {
  name: Events.MessagePollVoteRemove,
  async execute(interaction) {
    console.log("I AM IN THE EVENT")
  },
};
