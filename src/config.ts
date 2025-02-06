import dotenv from 'dotenv';
dotenv.config();
import { parseAllowedChannels } from './csv-parser-allowed-channels.js'
import path from 'path'

export interface DiscordServer {
  discordToken: string | undefined;
  discordClientId: string | undefined;
  discordGuildId: string | undefined;
  botLanguage: string;
  discordAnnouncementsChannel: string | undefined;
  scheduledDiscordEventsEnabled: boolean;
}

export interface MappedStatusCommands {
  'pr-request-review': string;
  'pr-request-changes': string;
  'pr-approved-by-code-review': string;
  'pr-task-cancelled': string;
  'pr-work-in-progress': string;
  'pr-merged-on-staging': string;
  'pr-merged-in-prod': string;
  'pr-done': string;
}

export interface PrTemplate {
  allowedChannels: string[];
}

export interface TimeZone {
  name: string;
  value: string;
}

export interface QAMention {
  discordQARoleId: string | undefined;
  discordQAChannelName: string | undefined;
}

export interface CronScheduleReview {
  scheduleReview: string;
  timeZone: string;
}

export interface RequestPoint {
  discordAdminPointRequestChannel: string | undefined;
  discordAdminTagId: string | undefined;
}

export interface ScheduleMessages {
  timeZone: string | undefined;
  pathMarkdownFolder: string;
}

export interface ScheduleCalendar {
  scheduledCalendarInterval: string;
  timeZone: string;
}

export interface VotePoints {
  ANSWERS: {
    text: string;
    emoji: string;
  }[];
  TAG_IDS: {
    taskCompletedTagId: string;
    addPointTagId: string;
    boostedPointTagId: string;
  };
}

export interface GeminiIntegration {
  scheduledGeminiEnabled: boolean;
  geminiSecret: string | undefined;
  scheduleTime: string | undefined;
  interactionsPrompts: string[] | undefined;
  interactionChannel: string | undefined;
}


const DISCORD_SERVER: DiscordServer = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordGuildId: process.env.DISCORD_GUILD_ID,
  botLanguage: process.env.DISCORD_LANGUAGE || 'en',
  discordAnnouncementsChannel: process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID,
  scheduledDiscordEventsEnabled:
    process.env.SCHEDULED_DISCORD_EVENTS_ENABLED === 'true',
};

const MAPPED_STATUS_COMMANDS: MappedStatusCommands = {
  'pr-request-review': '❗',
  'pr-request-changes': '🔁',
  'pr-approved-by-code-review': '👍',
  'pr-task-cancelled': '🚫',
  'pr-work-in-progress': '👷🏾',
  'pr-merged-on-staging': '🟡',
  'pr-merged-in-prod': '🟢',
  'pr-done': '✅',
};

const PR_TEMPLATE: PrTemplate = {
  allowedChannels: parseAllowedChannels(
    process.env.PR_TEMPLATE_ALLOWED_CHANNELS
  ),
};

const TIME_ZONES: TimeZone[] = [
  { name: 'Argentina (ART)', value: 'America/Argentina/Buenos_Aires' },
  { name: 'Colombia (COT)', value: 'America/Bogota' },
  { name: 'Venezuela (VET)', value: 'America/Caracas' },
];

const QA_MENTION: QAMention = {
  discordQARoleId: process.env.DISCORD_QA_ROLE_ID,
  discordQAChannelName: process.env.DISCORD_QA_CHANNEL_ID,
};

const CRON_SCHEDULE_REVIEW: CronScheduleReview = {
  scheduleReview: process.env.CRON_SCHEDULE_REVIEW || '0 7 * * 1,5',
  timeZone: process.env.TIME_ZONE || 'America/Bogota',
};

const REQUEST_POINT: RequestPoint = {
  discordAdminPointRequestChannel: process.env.ADMIN_POINT_REQUEST_CHANNEL,
  discordAdminTagId: process.env.ADMINISTRATOR_TAG_ID,
};

const SCHEDULE_MESSAGES: ScheduleMessages = {
  timeZone: process.env.TIME_ZONE,
  pathMarkdownFolder: path.join(process.cwd(), '/markdown-files'),
};

const SCHEDULE_CALENDAR: ScheduleCalendar = {
  scheduledCalendarInterval:
    process.env.SCHEDULED_CALENDAR_INTERVAL || '*/20 8-17 * * 1-5',
  timeZone: process.env.TIME_ZONE || 'America/Bogota',
};

const VOTE_POINTS: VotePoints = {
  ANSWERS: [
    { text: '1', emoji: '🥇' },
    { text: '2', emoji: '🥈' },
    { text: '3', emoji: '🥉' },
    { text: '4', emoji: '4️⃣' },
    { text: '5', emoji: '5️⃣' },
    { text: '6', emoji: '6️⃣' },
    { text: '7', emoji: '7️⃣' },
    { text: '8', emoji: '🎱' },
  ],
  TAG_IDS: {
    taskCompletedTagId:
      process.env.TASK_COMPLETED_TAG_ID || '1203085046769262592',
    addPointTagId: process.env.ADD_POINT_TAG_ID || '1258801833191669802',
    boostedPointTagId:
      process.env.ADD_BOOSTED_POINT_TAG_ID || '1263873487953592381',
  },
};

const GEMINI_INTEGRATION: GeminiIntegration = {
  scheduledGeminiEnabled: process.env.SCHEDULED_GEMINI_ENABLED === 'true',
  geminiSecret: process.env.GEMINI_AI_API_KEY,
  scheduleTime: process.env.TIME_BETWEEN_AI_AUTOMATIC_INTERACTION,
  interactionsPrompts: process.env.AI_AUTOMATIC_INTERACTION_PROMPTS?.split(
    ','
  ).map(
    (prompt) =>
      `${prompt}. In the next language: ${DISCORD_SERVER.botLanguage} and a limit of 500 characters`
  ),
  interactionChannel: process.env.AI_AUTOMATIC_INTERACTION_CHANNEL,
};

export {
  DISCORD_SERVER,
  MAPPED_STATUS_COMMANDS,
  TIME_ZONES,
  QA_MENTION,
  REQUEST_POINT,
  SCHEDULE_MESSAGES,
  VOTE_POINTS,
  PR_TEMPLATE,
  SCHEDULE_CALENDAR,
  GEMINI_INTEGRATION,
  CRON_SCHEDULE_REVIEW,
};
