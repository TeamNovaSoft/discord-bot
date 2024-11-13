require("dotenv").config();

const DISCORD_CONFIG = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordGuildId: process.env.DISCORD_GUILD_ID
}

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
      text: "1",
      emoji: "🥇"
    },
    {
      text: "2",
      emoji: "🥈"
    },
    {
      text: '3',
      emoji: '🥉'
    },
    {
      text: '4',
      emoji: '4️⃣'
    },
    {
      text: '5',
      emoji: '5️⃣'
    },
    {
      text: '6',
      emoji: '6️⃣'
    },
    {
      text: '7',
      emoji: '7️⃣',
    },
    {
      text: '8',
      emoji: '🎱'
    }
  ]

const CronTimes = {
  channelMessageId: process.env.CHANNEL_MESSAGE_ID,
  cronMorning : process.env.CRON_MORNING,
  cronNoon: process.env.CRON_NOON,
  cronEvening: process.env.CRON_EVENING,
  grettingMorning: process.env.GREETING_MORNING,
  greetingNoon: process.env.GREETING_NOON,
  greetingEvening: process.env.GREETING_EVENING,
  timeZone: process.env.TIME_ZONE
}

module.exports = {
    MAPPED_STATUS_COMMANDS,
    VOTE_POINTS_ANSWERS,
    DISCORD_CONFIG,
    CronTimes
}
