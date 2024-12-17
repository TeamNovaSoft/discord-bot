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
  botLanguage: process.env.DISCORD_LANGUAGE || 'en',
  VOTE_POINTS: {
    ANSWERS: [
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
    ],
    TAG_IDS: {
      taskCompletedTagId:
        process.env.TASK_COMPLETED_TAG_ID || '1203085046769262592',
      addPointTagId: process.env.ADD_POINT_TAG_ID || '1258801833191669802',
      boostedPointTagId:
        process.env.ADD_BOOSTED_POINT_TAG_ID || '1263873487953592381',
    },
  },
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

const TIME_ZONES = [
  { name: 'Argentina (ART)', value: 'America/Argentina/Buenos_Aires' },
  { name: 'Colombia (COT)', value: 'America/Bogota' },
  { name: 'Venezuela (VET)', value: 'America/Caracas' },
];

const cronTimes = {
  messageTimes: process.env.SCHEDULED_MESSAGES
    ? csvParser(process.env.SCHEDULED_MESSAGES)
    : [],
  timeZone: process.env.TIME_ZONE,
};

module.exports = {
  MAPPED_STATUS_COMMANDS,
  DISCORD_CONFIG,
  TIME_ZONES,
  cronTimes,
};
