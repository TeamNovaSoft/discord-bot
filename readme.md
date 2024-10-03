# Discord Bot

This project is a Discord bot built with `discord.js`. The bot includes various functionalities such as polls, automated responses, and more. Below are the instructions on how to run the bot and create new commands.

## Requirements

- Node.js (version 20 or higher)
- Yarn (optional, but recommended)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/TeamNovaSoft/discord-bot.git
    ```

2. Navigate to the project directory:
    ```bash
    cd discord-bot
    ```

3. Install the dependencies:
    ```bash
    yarn install
    ```

## Configuration

1. Create a new file called `.env` based on the `.env.example` file in the root of the project with the following keys, filled it with the information of your bot:

    ```
      DISCORD_TOKEN = YOUR_BOT_TOKEN
      DISCORD_CLIENT_ID = YOUR_CLIENT_ID
      DISCORD_GUILD_ID = YOUR_GUILD_ID
    ```

   - **DISCORD_TOKEN**: Your Discord bot's token.
   - **DISCORD_CLIENT_ID**: Your bot's client ID.
   - **DISCORD_GUILD_ID**: The ID of the server (guild) where the commands will be deployed.

To obtain each of these environment variables, you need to have `Developer Mode` enabled in Discord (if it is not already).

Open Discord to enable developer mode and click on the gear icon (User Settings) at the bottom left. Go to `App Settings` and select the `Advanced` option, then look for the `Developer Mode` option and toggle it on. For more details on how to create a Discord bot, you can visit the official Discord guide.

Once `Developer Mode` is enabled, you can follow these steps to obtain Environment Variables:

### 1. Obtain **DISCORD_TOKEN**
- Go to the [Discord Developer Portal](https://discord.com/developers/applications) and log in.
- Create a new application by clicking on “New Application”.
- Name your application and click "Create".
- In the "Bot" section, click on "Add Bot" and confirm.
- Copy the bot token that is generated. This is your **DISCORD_TOKEN**.

### 2. Obtain **DISCORD_CLIENT_ID**
- In the Discord Portal (not Discord Developer Portal), select or click on your user avatar on the bottom part when located on the `@me channel`.
- You will find the option to copy the `Client ID` in the menu called `Copy User ID`. This is your **DISCORD_CLIENT_ID**.

### 3. Obtain **DISCORD_GUILD_ID**
- Open Discord and go to the server from which you want to obtain the ID.
- Right-click on the server name and select `Copy Server ID`. This is your **DISCORD_GUILD_ID**.

You can also follow this documentation for creating a Discord bot: [Discord setting up a bot Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).

## Running the Bot

1. Start the bot with the following command:
    ```bash
    yarn start
    ```

   This will run the bot and connect it to Discord. You should see a message in the console indicating that the bot is ready and logged in.

## [Creating New Commands](docs/creating-commands.md)

For detailed instructions on how to create new commands, see [Creating New Commands](docs/creating-commands.md).