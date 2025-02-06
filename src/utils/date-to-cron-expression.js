/**
 * Converts a date string into a CRON expression.
 *
 * @param {string} dateString - A string representing a date.
 * @returns {string} A CRON expression derived from the provided date.
 *
 * @example
 * dateToCronExpression('2022-01-22T15:30:00');
 * // Returns '30 15 22 1 *'
 *
 * @example
 * dateToCronExpression('2022-01-01T00:00:00');
 * // Returns '0 0 1 1 *'
 */
export default function dateToCronExpression(dateString) {
  const date = new Date(dateString);
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${minutes} ${hours} ${day} ${month} *`;
}
