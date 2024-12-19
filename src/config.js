require('dotenv').config();
const csvParser = require('./utils/csv-parser');
const { parseAllowedChannels } = require('./csv-parser-allowed-channels');

const DISCORD_SERVER = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordGuildId: process.env.DISCORD_GUILD_ID,
  botLanguage: process.env.DISCORD_LANGUAGE || 'en',
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

const PR_TEMPLATE = {
  allowedChannels: parseAllowedChannels(
    process.env.PR_TEMPLATE_ALLOWED_CHANNELS
  ),
};

const TIME_ZONES = [
  { name: 'Argentina (ART)', value: 'America/Argentina/Buenos_Aires' },
  { name: 'Colombia (COT)', value: 'America/Bogota' },
  { name: 'Venezuela (VET)', value: 'America/Caracas' },
];

const QA_MENTION = {
  discordQARoleId: process.env.DISCORD_QA_ROLE_ID,
  discordQAChannelName: process.env.DISCORD_QA_CHANNEL_ID,
};

const REQUEST_POINT = {
  discordAdminPointRequestChannel: process.env.ADMIN_POINT_REQUEST_CHANNEL,
  discordAdminTagId: process.env.ADMINISTRATOR_TAG_ID,
};

const SCHEDULE_MESSAGES = {
  messageTimes: process.env.SCHEDULED_MESSAGES
    ? csvParser(process.env.SCHEDULED_MESSAGES)
    : [],
  timeZone: process.env.TIME_ZONE,
};

const VOTE_POINTS = {
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
};

module.exports = {
  DISCORD_SERVER,
  MAPPED_STATUS_COMMANDS,
  TIME_ZONES,
  QA_MENTION,
  REQUEST_POINT,
  SCHEDULE_MESSAGES,
  VOTE_POINTS,
  PR_TEMPLATE,
};
