require('dotenv').config();

const firebaseConfig = {
  scheduledCalendarEnabled: process.env.SCHEDULED_CALENDAR_ENABLED,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  email: process.env.GOOGLE_EMAIL,
  channelCalendarId: process.env.CHANNEL_CALENDAR_ID
};

module.exports = {
  firebaseConfig,
};
