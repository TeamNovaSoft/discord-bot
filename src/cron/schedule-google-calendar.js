const { CronJob } = require('cron');
const { listEvents } = require('../../calendar');
const { EmbedBuilder } = require('discord.js');

const channelId = '1306251153855610922';

/**
 * Schedules a notification to be sent when an event starts.
 *
 * @param {Object} event - The event object containing details about the event.
 * @param {string} event.summary - The name or description of the event.
 * @param {Object} event.start - The start date object for the event.
 * @param {string} event.start.dateTime - The date and time (ISO string) when the event starts.
 * @param {string} timeZone - The timezone to use for scheduling the notification.
 */
const scheduleEventNotification = async ({ client, event, timeZone }) => {
  if (!client || !event || !event.start || !event.start.dateTime || !timeZone) {
    return console.log(
      'Error: Missing one or more required parameters (client, event, event.start.dateTime, or timeZone).'
    );
  }

  // Convert event start date to a cron expression
  const dateToCronExpression = (dateString) => {
    const date = new Date(dateString);
    const minutes = date.getUTCMinutes();
    const hours = date.getUTCHours();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are 0-indexed in JavaScript.
    return `${minutes} ${hours} ${day} ${month} *`; // Format: min hour day month day_of_week
  };

  const cronExpression = dateToCronExpression(event.start.dateTime);

  console.log(
    `Scheduling notification for event "${event.summary}" with cron: ${cronExpression}`
  );

  // Schedule the cron job
  new CronJob(
    cronExpression,
    async () => {
      const currentChannel = await client.channels.cache.get(channelId);
      // Crear un embed con los detalles del mensaje
      const embed = new EmbedBuilder()
        .setColor('#0099ff') // Color del embed
        .setTitle('📅 ¡Recordatorio de reunión!')
        .setDescription('Hola! Estamos reunidos en **Planeación de tareas**.')
        .addFields({
          name: 'Enlace de la reunión:',
          value: '[Haz clic aquí](https://meet.google.com/eqv-qjph-zjm)',
          inline: false,
        })
        .setTimestamp(new Date('2024-11-21T11:56:00Z')) // Hora del evento
        .setFooter({
          text: 'Meet remember APP',
          iconURL: 'https://example.com/icon.png',
        }); // Cambia el iconURL por tu ícono si lo necesitas

      if (currentChannel) {
        currentChannel.send({ embeds: [embed] });
      } else {
        console.log('Channel not found or client not ready.');
      }
    },
    null,
    true,
    timeZone
  ).start();
};

/**
 * Schedules multiple notifications for a list of events.
 *
 * @param {Array<{summary: string, start: {dateTime: string}}>} events - List of event objects.
 * @param {string} timeZone - The timezone to use for scheduling the notifications.
 */
const scheduleEventNotifications = async (client, events, timeZone) => {
  const events2 = await listEvents();
  console.log(events2);

  const events3 = [...events, ...events2];

  if (!Array.isArray(events3) || events.length === 0 || !timeZone) {
    return console.log(
      'Error: Missing or invalid parameters (events array or timeZone).'
    );
  }

  events3.forEach((event) => {
    scheduleEventNotification({ client, event, timeZone });
  });
};

module.exports = { scheduleEventNotifications };
