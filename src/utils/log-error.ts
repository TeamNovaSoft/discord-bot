import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, 'log');
const logFilePath = path.join(logDir, 'error.log');

/**
 * Logs an error message to a file with a timestamp.
 *
 * @param error - The error object to log.
 */
export default function saveErrorLog(error: Error): void {
  console.error('Critical error occurred:', error);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const errorMessage = `${new Date().toISOString()} - ${error.stack || error.message}\n`;
  fs.appendFileSync(logFilePath, errorMessage, 'utf8');
}
