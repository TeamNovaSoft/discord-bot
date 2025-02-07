const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { translateLanguage } = require('../languages/index');
// remindme-functions.js
const { EmbedBuilder } = require('discord.js');

async function updateCountdownEmbed(reply, reminderDate, message, exactTime) {
  const timeLeft = reminderDate.getTime() - Date.now();
  if (timeLeft <= 0) {
    await reply.user.send(
      translateLanguage('remindme.reminderMessage').replace(
        '{{message}}',
        message
      )
    );
    return;
  }

  const countdown = new Date(timeLeft).toISOString().substr(11, 8);
  const updatedEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(translateLanguage('remindme.reminderUpdatedTitle'))
    .setDescription(
      `**${translateLanguage('remindme.remindingAt')}:** ${exactTime}\n${translateLanguage('remindme.timeLeft')}: ${countdown}`
    )
    .setFooter({ text: translateLanguage('remindme.dmNotice') });

  await reply.edit({ embeds: [updatedEmbed] });
}

function parseDate(timeInput) {
  const fullDatePattern = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/;
  const timeOnlyPattern = /^\d{2}:\d{2}$/;
  let reminderDate;

  if (fullDatePattern.test(timeInput)) {
    const [datePart, timePart] = timeInput.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    reminderDate = new Date(year, month - 1, day, hour, minute);
  } else if (timeOnlyPattern.test(timeInput)) {
    const [hour, minute] = timeInput.split(':').map(Number);
    reminderDate = new Date();
    reminderDate.setHours(hour, minute, 0, 0);
    if (reminderDate.getTime() < Date.now()) {
      return null;
    }
  } else {
    return null;
  }

  return reminderDate;
}

function cancelReminder(activeReminders, userId) {
  if (activeReminders.has(userId)) {
    const { interval, timeout } = activeReminders.get(userId);
    clearInterval(interval);
    clearTimeout(timeout);
    activeReminders.delete(userId);
  }
}

async function replyToInteraction(interaction, message, ephemeral = false) {
  if (!interaction.replied && !interaction.deferred) {
    return interaction.reply({ content: message, ephemeral });
  } else {
    return interaction.followUp({ content: message, ephemeral });
  }
}

function disableReminderButtons(interaction) {
  const disabledRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('disabled_set_interval')
      .setLabel(translateLanguage('remindme.resetReminder'))
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId('disabled_edit_reminder')
      .setLabel(translateLanguage('remindme.editReminder'))
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId('disabled_delete_reminder')
      .setLabel(translateLanguage('remindme.cancelReminder'))
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );

  return interaction.message.edit({ components: [disabledRow] });
}

async function resetReminder(
  interaction,
  activeReminders,
  userId,
  newReminderDate,
  message,
  originalDuration,
  startReminder
) {
  cancelReminder(activeReminders, userId);
  await disableReminderButtons(interaction);
  await startReminder(interaction, newReminderDate, message, originalDuration);
}

function formatReminderDate(reminderDate) {
  return `${String(reminderDate.getDate()).padStart(2, '0')}-${String(reminderDate.getMonth() + 1).padStart(2, '0')}-${reminderDate.getFullYear()} ${String(reminderDate.getHours()).padStart(2, '0')}:${String(reminderDate.getMinutes()).padStart(2, '0')}`;
}

module.exports = {
  parseDate,
  cancelReminder,
  replyToInteraction,
  disableReminderButtons,
  updateCountdownEmbed,
  resetReminder,
  formatReminderDate,
};
