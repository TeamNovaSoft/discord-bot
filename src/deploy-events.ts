import { REST, Routes, Client } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { DISCORD_SERVER } from './config.ts';

const deployCommands = (client: Client): void => {
  const commands: any[] = [];
  const foldersPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    'commands'
  );
  const commandFolders = fs.readdirSync(foldersPath);

  const token = DISCORD_SERVER.discordToken;
  const clientId = DISCORD_SERVER.discordClientId;
  const guildId = DISCORD_SERVER.discordGuildId;

  commandFolders.forEach((folder) => {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

    commandFiles.forEach(async (file) => {
      try {
        const command = await import(path.join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
          client.commands.set(command.data.name, command);
        } else {
          console.warn(`[WARNING] The command at ${file} is missing required properties.`);
        }
      } catch (err) {
        console.error(`Error loading command ${file}:`, err);
      }
    });
  });

  const rest = new REST().setToken(token);

  const init = async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
      const data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  };

  init();
};

export default deployCommands;
