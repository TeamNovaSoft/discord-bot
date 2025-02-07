import { CronJob } from 'cron';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_INTEGRATION, SCHEDULE_MESSAGES } from '../config.ts';
import { Client, TextChannel } from 'discord.js';

const genAI = new GoogleGenerativeAI(GEMINI_INTEGRATION.geminiSecret);

/**
 * Generates content using Google Generative AI.
 *
 * @param {object} params
 * @param {Client} params.client - The Discord client instance.
 * @param {string} params.channel - The channel ID where the message will be sent.
 * @param {string[]} params.prompts - The prompts to be used for generating content.
 * @returns {Promise<void>} Resolves when the content is sent to the channel.
 */
const generateIaContent = async ({
  client,
  channel,
  prompts,
}: {
  client: Client;
  channel: string;
  prompts: string[];
}): Promise<void> => {
  try {
    const currentChannel = (await client.channels.fetch(channel)) as TextChannel;
    const randomTemperature = Math.random() * (1.5 - 0.7) + 0.7;

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        candidateCount: 1,
        stopSequences: [],
        maxOutputTokens: 500,
        temperature: randomTemperature,
      },
    });

    const result = await model.generateContent(prompt);
    currentChannel.send(result.response.text());
  } catch (error) {
    console.error(error);
  }
};

/**
 * Schedules a recurring task to generate and log AI content at a specific interval.
 *
 * @param {Client} client - The Discord client instance.
 */
export const scheduleIaContentLogging = (client: Client): void => {
  new CronJob(
    GEMINI_INTEGRATION.scheduleTime,
    () => {
      generateIaContent({
        client,
        channel: GEMINI_INTEGRATION.interactionChannel,
        prompts: GEMINI_INTEGRATION.interactionsPrompts,
      });
    },
    null,
    true,
    SCHEDULE_MESSAGES.timeZone
  ).start();
};
