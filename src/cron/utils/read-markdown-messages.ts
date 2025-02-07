import { scheduleMessages } from '../schedule-messages.js';
import fs from 'fs';
import path from 'path';
import { SCHEDULE_MESSAGES } from '../../config.ts';

/**
 * Function to search for all Markdown files in a directory.
 * @param directory - Path to the directory to scan.
 * @returns List of Markdown file paths.
 */
const getMarkdownFiles = (directory: string): string[] => {
  const markdownFiles: string[] = [];

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
    console.error(
      `Error reading the directory "${directory}":`,
      (error as Error).message
    );
  }

  return markdownFiles;
};

/**
 * Function to read the content of a Markdown file.
 * @param filePath - Path to the file to read.
 * @returns File content or null if an error occurs.
 */
const readMarkdownFile = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading the file "${filePath}":`, (error as Error).message);
    return null;
  }
};

interface ParsedSchedule {
  variables: Record<string, string>;
  message: string;
}

/**
 * Function to parse a Markdown file with a specific format.
 * @param markdown - Content of the Markdown file.
 * @returns Variables and message, or null if errors occur.
 */
const parseMarkdownSchedule = (markdown: string): ParsedSchedule | null => {
  const lines = markdown.split('\n');
  const variables: Record<string, string> = {};
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
 * @param client - Client object.
 */
export const processMarkdownFiles = (client: unknown): void => {
  const absoluteDirectory = path.resolve(SCHEDULE_MESSAGES.pathMarkdownFolder);
  const markdownFiles = getMarkdownFiles(absoluteDirectory);

  const messagesArray = markdownFiles
    .map((filePath) => {
      const content = readMarkdownFile(filePath);
      if (content) {
        return parseMarkdownSchedule(content);
      }
      return null;
    })
    .filter((msg): msg is ParsedSchedule => msg !== null);

  scheduleMessages({ client, messages: messagesArray });
};
