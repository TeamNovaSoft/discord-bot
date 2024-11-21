/**
 * Parses a CSV string into an array of objects containing cron time and message.
 *
 * @param {string} csvString - The CSV string where each entry is separated by semicolons (`;`) and contains `cronTime,message`.
 * @returns {Array<{channel: string, datetime: string, message: string}>} An array of objects, each containing `cronTime` and `message` properties.
 */
function csvParser(csvString) {
  return csvString.split(';').map((entry) => {
    const [channel, datetime, message] = entry.split(',');
    return {
      channel,
      datetime,
      message,
    };
  });
}

module.exports = csvParser;
