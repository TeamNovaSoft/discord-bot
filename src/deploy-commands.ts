import { REST, Routes, Client } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { DISCORD_SERVER } from './config.ts';

interface Command {
  data: {
    name: string;
    toJSON: () => object;
  };
  execute: (...args: any[]) => void;
}

const deployCommands = async(client: Client) => {
  const commands: object[] = [];
  const foldersPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    'commands'
  );
  const commandFolders = fs.readdirSync(foldersPath);
  const token: string = DISCORD_SERVER.discordToken;
  const clientId: string = DISCORD_SERVER.discordClientId;
  const guildId: string = DISCORD_SERVER.discordGuildId;

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      await import(path.join(commandsPath, file))
        .then((command: { default: Command }) => {
          if ('data' in command.default && 'execute' in command.default) {
            commands.push(command.default.data.toJSON());
            (client as any).commands.set(command.default.data.name, command.default);
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

      const data = (await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      )) as any[];

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
