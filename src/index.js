require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { DISCORD_CONFIG, cronTimes } = require('./config');
const { scheduleMessages } = require('./cron/schedule-messages');
const deployEvents = require('./deploy-events');
const deployCommands = require('./deploy-commands');
const {
  scheduleCalendarNotifications,
} = require('./cron/schedule-google-calendar');
const { firebaseConfig } = require('../firebase-config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.DirectMessagePolls,
  ],
});

client.commands = new Collection();
const token = DISCORD_CONFIG.discordToken;

deployCommands(client);
deployEvents(client);

scheduleMessages(client, cronTimes.messageTimes);
if (firebaseConfig.scheduledCalendarEnabled) {
  scheduleCalendarNotifications(client);
}

client.login(token);
