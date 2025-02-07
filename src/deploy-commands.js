import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { DISCORD_SERVER } from './config.ts';
import { fileURLToPath } from 'node:url';

export default async (client) => {
  const commands = [];
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);
  const token = DISCORD_SERVER.discordToken;
  const clientId = DISCORD_SERVER.discordClientId;
  const guildId = DISCORD_SERVER.discordGuildId;

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = await import(path.join(commandsPath, file));
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  const rest = new REST().setToken(token);

  const init = async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  };

  init();
};
