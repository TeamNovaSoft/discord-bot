require('dotenv').config();
const csvParser = require('./utils/csv-parser');

const DISCORD_CONFIG = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordGuildId: process.env.DISCORD_GUILD_ID,
  discordQARoleId: process.env.DISCORD_QA_ROLE_ID,
  discordQAChannelName: process.env.DISCORD_QA_CHANNEL_ID,
  discordAdminPointRequestChannel: process.env.ADMIN_POINT_REQUEST_CHANNEL,
  discordAdminTagId: process.env.ADMINISTRATOR_TAG_ID,
};

const MAPPED_STATUS_COMMANDS = {
  'pr-no-merge': '🚫',
  'pr-sos': '🆘',
  'pr-draft': '🚧',
  'pr-reviewing': '👀',
  'pr-request-changes': '🔁',
  'pr-request-review': '❗',
  'pr-working-in-fixes': '🧑‍🔧',
  'pr-approved-by-code-review': '👍',
  'pr-merged-in-dev': '✅',
};

const VOTE_POINTS_ANSWERS = [
  {
    text: '1',
    emoji: '🥇',
  },
  {
    text: '2',
    emoji: '🥈',
  },
  {
    text: '3',
    emoji: '🥉',
  },
  {
    text: '4',
    emoji: '4️⃣',
  },
  {
    text: '5',
    emoji: '5️⃣',
  },
  {
    text: '6',
    emoji: '6️⃣',
  },
  {
    text: '7',
    emoji: '7️⃣',
  },
  {
    text: '8',
    emoji: '🎱',
  },
];

const cronTimes = {
  messageTimes: process.env.SCHEDULED_MESSAGES
    ? csvParser(process.env.SCHEDULED_MESSAGES)
    : [],
  timeZone: process.env.TIME_ZONE,
};

module.exports = {
  MAPPED_STATUS_COMMANDS,
  VOTE_POINTS_ANSWERS,
  DISCORD_CONFIG,
  cronTimes,
};
