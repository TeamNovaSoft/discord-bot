/**
 * Parses a CSV string into an array of objects containing cron time and message.
 *
 * @param {string} csvString - The CSV string where each entry is separated by semicolons (`;`) and contains `cronTime,message`.
 * @returns {Array<{channel: string, datetime: string, message: string}>} An array of objects, each containing `cronTime` and `message` properties.
 */
function dateToCronExpression(dateString) {
  const date = new Date(dateString);
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${minutes} ${hours} ${day} ${month} *`;
}

module.exports = dateToCronExpression;
