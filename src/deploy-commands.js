const { REST, Routes } = require('discord.js');
const { DISCORD_SERVER } = require('./config');

const pingCommand = require('./commands/utility/ping');
const assingMeTaskCommand = require('./commands/utility/assignMeTaskThread');
const changeStatusCommand = require('./commands/utility/changeStatus');
const convertTimeCommand = require('./commands/utility/convert-time');
const myPointsCommand = require('./commands/utility/my-points');
const prTemplateCommand = require('./commands/utility/pr-template');
const remindMeCommand = require('./commands/utility/remindme');
const requestPointCommand = require('./commands/utility/requestPoint');
const searchCodeCommand = require('./commands/utility/search-code-review');
const searchMyPointsCommand = require('./commands/utility/search-my-points');
const sendMessageCommand = require('./commands/utility/send-message');
const serverCommand = require('./commands/utility/server');
const userCommand = require('./commands/utility/user');
const votePointsCommand = require('./commands/utility/vote-points');

module.exports = (client) => {
  const commands = [];

  const commandList = [
    pingCommand,
    assingMeTaskCommand,
    changeStatusCommand,
    convertTimeCommand,
    myPointsCommand,
    prTemplateCommand,
    remindMeCommand,
    requestPointCommand,
    searchCodeCommand,
    searchMyPointsCommand,
    sendMessageCommand,
    serverCommand,
    userCommand,
    votePointsCommand,
  ]; // Agrega más comandos aquí

  for (const command of commandList) {
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command ${command} is missing a required "data" or "execute" property.`
      );
    }
  }

  deployCommands(
    commands,
    DISCORD_SERVER.discordToken,
    DISCORD_SERVER.discordClientId,
    DISCORD_SERVER.discordGuildId
  );
};

function deployCommands(commands, token, clientId, guildId) {
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
}
