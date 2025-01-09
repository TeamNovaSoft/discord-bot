const moment = require('moment-timezone');
const { scheduleMessages } = require('../schedule-messages');
const fs = require('fs');
const path = require('path');

const directoryTest = './markdown-files';

/**
 * Converts extracted variables to a cron expression.
 * @param {object} variables - Extracted variables from the Markdown file.
 * @returns {string} - A valid cron expression.
 */
const convertToCronExpression = (variables) => {
  const { days = '*', time = '08:00', timezone = 'UTC', channel } = variables;

  const [hour, minute] = time.split(':').map((val) => parseInt(val, 10));

  if (isNaN(hour) || isNaN(minute)) {
    throw new Error('Invalid time format. Expected "HH:mm".');
  }

  const cronExpression = `${minute} ${hour} * * ${days}`;

  if (!moment.tz.zone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  return {
    cronExpression,
    timezone,
    channel,
  };
};

/**
 * Function to search for all Markdown files in a directory.
 * @param {string} directory - Path to the directory to scan.
 * @returns {string[]} - List of Markdown file paths.
 */
const getMarkdownFiles = (directory) => {
  const markdownFiles = [];

  try {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && file.endsWith('.md')) {
        markdownFiles.push(filePath);
      }
    });
  } catch (error) {
    console.error(`Error reading the directory "${directory}":`, error.message);
  }

  return markdownFiles;
};

/**
 * Function to read the content of a Markdown file.
 * @param {string} filePath - Path to the file to read.
 * @returns {string|null} - File content or null if an error occurs.
 */
const readMarkdownFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading the file "${filePath}":`, error.message);
    return null;
  }
};

/**
 * Function to parse a Markdown file with a specific format.
 * @param {string} markdown - Content of the Markdown file.
 * @returns {{variables: object, message: string}|null} - Variables and message, or null if errors occur.
 */
const parseMarkdownSchedule = (markdown) => {
  const lines = markdown.split('\n');
  const variables = {};
  let message = '';
  let isVariableDefinition = false;
  let errorOccurred = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine === '---') {
      isVariableDefinition = !isVariableDefinition;
      continue;
    }

    if (isVariableDefinition) {
      const [key, value] = trimmedLine.split(':').map((str) => str.trim());
      if (!key || value === undefined) {
        console.error(`Syntax error on line: "${line}"`);
        errorOccurred = true;
        continue;
      }
      variables[key] = value;
    } else {
      message += `${line}\n`;
    }
  }

  if (errorOccurred) {
    console.error(
      'Errors found in variable definitions. Please fix them before continuing.'
    );
    return null;
  }

  return { variables, message: message.trim() };
};

/**
 * Main function to process all Markdown files in a directory.
 * @param {string} directory - Path to the directory containing the Markdown files.
 */
const processMarkdownFiles = (client) => {
  const absoluteDirectory = path.resolve(__dirname, directoryTest);
  const markdownFiles = getMarkdownFiles(absoluteDirectory);

  const result = markdownFiles
    .map((filePath) => {
      const content = readMarkdownFile(filePath);
      if (content) {
        const parsedMessages = parseMarkdownSchedule(content);
        if (parsedMessages) {
          return parsedMessages;
        }
      }
      return null;
    })
    .filter(Boolean);

  const messagesArray = Array.isArray(result) ? result : [result];

  scheduleMessages({ client, scheduledMessage: messagesArray });
};

module.exports = { processMarkdownFiles, convertToCronExpression };
