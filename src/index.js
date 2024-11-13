const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("./deploy-commands");
const { DISCORD_CONFIG } = require('./config');
const { sendMorningGreeting, sendNoonGreeting, sendEveningGreeting } = require("./cron/cron-messages");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessagePolls, GatewayIntentBits.DirectMessagePolls] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const token = DISCORD_CONFIG.discordToken;

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, event.execute);
  } else {
    client.on(event.name, event.execute);
  }
}

console.log(sendMorningGreeting(client));
console.log(sendNoonGreeting(client));
console.log(sendEveningGreeting(client));

client.login(token);
