const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Carga las credenciales descargadas
const credentialsPath = path.join(__dirname, 'google-keys.json');

// Verifica que el archivo exista y sea válido
if (!fs.existsSync(credentialsPath)) {
  throw new Error('El archivo de credenciales no existe. Verifica la ruta.');
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

async function listEvents(calendarId = 'yoelferreyra24@gmail.com') {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const response = await calendar.events.list({
    calendarId,
    timeMin: startOfMonth,
    timeMax: endOfMonth,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items;
}

module.exports = { listEvents };
