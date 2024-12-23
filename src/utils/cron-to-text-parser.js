/**
 * Converts a cron expression string into a human-readable text description.
 *
 * @param {string} cronString - The cron expression string to convert.
 * Example: '*\/20 8-17 * * 1-5'.
 *
 * @returns {string} - A human-readable description of the cron schedule.
 * Example: "Calendar event collector scheduled to run from Monday to Friday, 8 AM to 5 PM every 20 minutes (Colombia time)."
 */
function convertCronToText(cronString) {
  const cronParts = cronString.split(' ');
  const minute = cronParts[0];
  const hour = cronParts[1];
  const dayOfWeek = cronParts[4];

  const daysOfWeek = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    0: 'Sunday',
  };

  const readableDays = dayOfWeek
    .split('-')
    .map((day) => daysOfWeek[day])
    .join(' to ');

  return `Calendar event collector scheduled to run from ${readableDays}, ${hour.replace('-', ' AM to ')} PM each ${minute.split('/')[1]} minutes (Colombia time).`;
}

module.exports = convertCronToText;
