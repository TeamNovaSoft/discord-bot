const { CronJob } = require('cron');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_CONFIG, SCHEDULE_MESSAGES } = require('../config');

const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.geminiSecret);

/**
 * Generates content using Google Generative AI.
 *
 * @returns {Promise<string>} The generated content as a string.
 */
const generateIaContent = async (client) => {
  try {
    const currentChannel = await client.channels.fetch(
      GEMINI_CONFIG.channelForJokes
    );
    const randomTemperature = Math.random() * (1.5 - 0.7) + 0.7;

    const prompt =
      GEMINI_CONFIG.JOKES_PROMPTS[
        Math.floor(Math.random() * GEMINI_CONFIG.JOKES_PROMPTS.length)
      ];

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
const scheduleIaContentLogging = (client) => {
  new CronJob(
    GEMINI_CONFIG.scheduleTime,
    () => {
      generateIaContent(client);
    },
    null,
    true,
    SCHEDULE_MESSAGES.timeZone
  ).start();
};

module.exports = { scheduleIaContentLogging };
