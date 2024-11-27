const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { googleConfig } = require('./firebase-config');

const credentialsPath = path.join(__dirname, 'google-keys.json');

if (!fs.existsSync(credentialsPath)) {
  throw new Error('El archivo de credenciales no existe. Verifica la ruta.');
}

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: googleConfig.scopes,
});

const calendar = google.calendar({ version: 'v3', auth });

async function listEvents() {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const response = await calendar.events.list({
    calendarId: googleConfig.email,
    timeMin: startOfMonth,
    timeMax: endOfMonth,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items;
  return events.map(event => {
    return {
      summary: event.summary,
      start: {dateTime: event.start.dateTime, timeZone: event.start.timeZone},
      end: {dateTime: event.end.dateTime, timeZone: event.end.timeZone},
      hangoutLink: event.hangoutLink
    };
  });
}

module.exports = { listEvents };
