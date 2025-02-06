import fs from 'fs';
import path from 'path';

const logDir = path.join(import.meta.url, '../log'); // Cambié __dirname por import.meta.url, ya que en módulos ES no tienes acceso a __dirname
const logFilePath = path.join(logDir, 'error.log');

/**
 * Logs an error message to a file with a timestamp.
 *
 * @param {Error} error - The error object to log.
 */
export default function saveErrorLog(error) {
  console.error('Critical error occurred:', error);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const errorMessage = `${new Date().toISOString()} - ${error.stack || error.message}\n`;
  fs.appendFileSync(logFilePath, errorMessage, 'utf8');
}
