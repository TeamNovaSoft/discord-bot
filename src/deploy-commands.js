import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { DISCORD_SERVER } from './config.ts';

const deployCommands = (client) => {
  const commands = [];
  const foldersPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    'commands'
  );
  const commandFolders = fs.readdirSync(foldersPath);
  const token = DISCORD_SERVER.discordToken;
  const clientId = DISCORD_SERVER.discordClientId;
  const guildId = DISCORD_SERVER.discordGuildId;

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js')); // Cambiar .js a .ts si usas TypeScript

    for (const file of commandFiles) {
      // Usa import() en lugar de require()
      import(path.join(commandsPath, file))
        .then((command) => {
          if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
          } else {
            console.log(
              `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
            );
          }
        })
        .catch((err) => {
          console.error(`Error loading command ${file}:`, err);
        });
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

export default deployCommands;
