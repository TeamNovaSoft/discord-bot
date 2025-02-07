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

export type MappedStatusCommandsType = {
  'pr-request-review': string;
  'pr-request-changes': string;
  'pr-approved-by-code-review': string;
  'pr-task-cancelled': string;
  'pr-work-in-progress': string;
  'pr-merged-on-staging': string;
  'pr-merged-in-prod': string;
  'pr-done': string;
};

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

import { Collection } from 'discord.js';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}
