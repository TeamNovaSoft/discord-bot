const { Events } = require('discord.js');
const { translateLanguage } = require('../languages');
const { handleModalSubmit } = require('../handlers/modal-submit');

module.exports = {
  name: Events.InteractionCreate,
  async execute(_client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton()) {
      const command = interaction.client.commands.get('remindme');

      if (!command) {
        console.error('No command matching remindme was found.');
        return;
      }

      try {
        await command.buttonHandler(interaction);
      } catch (error) {
        console.error('Error handling button interaction:', error);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: translateLanguage('interaction.errorButton'),
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isModalSubmit()) {
      try {
        if (interaction.customId === 'edit_reminder_modal') {
          const command = interaction.client.commands.get('remindme');

          if (!command) {
            console.error('No command matching remindme was found.');
            return;
          }

          await command.buttonHandler(interaction);
        } else {
          await handleModalSubmit(interaction);
        }
      } catch (error) {
        console.error('Error handling modal submit:', error);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: translateLanguage('interaction.errorSubmission'),
            ephemeral: true,
          });
        }
      }
    }
  },
};
