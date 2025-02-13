const { CronJob } = require('cron');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_INTEGRATION, SCHEDULE_MESSAGES } = require('../config');
const { translateLanguage } = require('../languages/index');
const { sendErrorToChannel } = require('../utils/send-error');
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
    sendErrorToChannel(
      {
        client,
        commandName: generateIaContent.name,
        user: client.user,
      },
      translateLanguage('sendChannelError.error'),
      error
    );
    return null;
  }
};

/**
 * Schedules a recurring task to generate and log AI content at a specific interval.
 */
const scheduleIaContentLogging = (client) => {
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

module.exports = { scheduleIaContentLogging };
