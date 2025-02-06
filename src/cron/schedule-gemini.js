import { CronJob } from 'cron';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_INTEGRATION, SCHEDULE_MESSAGES } from '../config.ts';

const genAI = new GoogleGenerativeAI(GEMINI_INTEGRATION.geminiSecret);

/**
 * Generates content using Google Generative AI.
 *
 * @returns {Promise<string>} The generated content as a string.
 */
const generateIaContent = async ({ client, channel, prompts }) => {
  try {
    const currentChannel = await client.channels.fetch(channel);
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
    return null;
  }
};

/**
 * Schedules a recurring task to generate and log AI content at a specific interval.
 */
export const scheduleIaContentLogging = (client) => {
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
