import { translateLanguage } from '../languages/index.ts';

/**
 * Converts a cron expression string into a human-readable text description.
 *
 * @param {string} cronString - The cron expression string to convert.
 * Example: '*\/20 8-17 * * 1-5'.
 *
 * @returns {string} - A human-readable description of the cron schedule.
 * Example: "Calendar event collector scheduled to run from Monday to Friday, 8 AM to 5 PM every 20 minutes (Colombia time)."
 */
export default function convertCronToText(cronString: string): string {
  const cronParts: string[] = cronString.split(' ');
  const minute: string = cronParts[0];
  const hour: string = cronParts[1];
  const dayOfWeek: string = cronParts[4];

  const daysOfWeek: Record<number, string> = {
    1: translateLanguage('calendarSchedules.monday'),
    2: translateLanguage('calendarSchedules.tuesday'),
    3: translateLanguage('calendarSchedules.wednesday'),
    4: translateLanguage('calendarSchedules.thursday'),
    5: translateLanguage('calendarSchedules.friday'),
    6: translateLanguage('calendarSchedules.saturday'),
    0: translateLanguage('calendarSchedules.sunday'),
  };

  const hoursRange: string = `${hour.replace('-', ` AM ${translateLanguage('calendarSchedules.to')} `)} PM`;

  const readableDays: string = dayOfWeek
    .split('-')
    .map((day) => daysOfWeek[parseInt(day, 10)] || day)
    .join(` ${translateLanguage('calendarSchedules.to')} `);

  return translateLanguage('calendarSchedules.calendarEventCollector', {
    readableDays,
    hoursRange,
    eachMinute: minute.includes('/') ? minute.split('/')[1] : minute,
  });
}
