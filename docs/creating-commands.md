# Creating New Commands

To create a new command:

1. Navigate to the `commands` directory and create a new folder for your command (if necessary).

2. Inside this folder, create a new JavaScript file for your command. Here’s a basic structure example:

   ```javascript
   const { SlashCommandBuilder } = require('discord.js');

   module.exports = {
     data: new SlashCommandBuilder()
       .setName('commandname')
       .setDescription('Description of your command'),
     async execute(interaction) {
       // Your command logic here
       await interaction.reply('Response message');
     },
   };
   ```

3. The new command will be automatically loaded the next time you start the bot.
