const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../log');
const logFilePath = path.join(logDir, 'error.log');

/**
 * Logs an error message to a file with a timestamp.
 *
 * @param {Error} error - The error object to log.
 */
function saveErrorLog(error) {
  console.error('Critical error occurred:', error);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const errorMessage = `${new Date().toISOString()} - ${error.stack || error.message}\n`;
  fs.appendFileSync(logFilePath, errorMessage, 'utf8');
}

module.exports = saveErrorLog;
