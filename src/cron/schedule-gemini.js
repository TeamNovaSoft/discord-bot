const { CronJob } = require('cron');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  GEMINI_CONFIG,
  SCHEDULE_MESSAGES,
  MEMES_AND_OTHERS_THINGS,
  DISCORD_SERVER,
} = require('../config');

const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.genimiSecret);

/**
 * Generates content using Google Generative AI.
 *
 * @returns {Promise<string>} The generated content as a string.
 */
const generateIaContent = async (client) => {
  try {
    const currentChannel = await client.channels.fetch(MEMES_AND_OTHERS_THINGS);
    const randomTemperature = Math.random() * (1.5 - 0.7) + 0.7;
    const promptConfig = `In the next language: ${DISCORD_SERVER.botLanguage} and a limit of 200 characters`;
    const prompts = [
      `Tell me a joke about programmers. ${promptConfig}`,
      `What's a funny story involving developers?. ${promptConfig}`,
      `Share a humorous programming anecdote. ${promptConfig}`,
    ];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        candidateCount: 1,
        stopSequences: [],
        maxOutputTokens: 200,
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
