import dotenv from 'dotenv';
dotenv.config();

export const firebaseConfig = {
  scheduledCalendarEnabled: process.env.SCHEDULED_CALENDAR_ENABLED === 'true',
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  email: process.env.GOOGLE_EMAIL,
  channelCalendarId: process.env.CHANNEL_CALENDAR_ID,
};
