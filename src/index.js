require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { DISCORD_CONFIG, cronTimes } = require('./config');
const { scheduleMessages } = require('./cron/schedule-messages');
const deployEvents = require('./deploy-events');
const deployCommands = require('./deploy-commands');
const {
  scheduleEventNotifications,
} = require('./cron/schedule-google-calendar');

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
const events = [
  {
    summary: 'Meeting with Team',
    start: { dateTime: '2024-11-26T12:10:00Z' },
  },
  {
    summary: 'Project Deadline',
    start: { dateTime: '2024-11-26T18:00:00Z' },
  },
];

const timeZone = 'America/Argentina/Buenos_Aires';

scheduleEventNotifications(client, events, timeZone);

client.login(token);
