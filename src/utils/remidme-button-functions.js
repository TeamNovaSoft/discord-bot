const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { translateLanguage } = require('../languages');
const {
  parseDate,
  disableReminderButtons,
  cancelReminder,
  replyToInteraction,
  formatReminderDate,
} = require('./remindme-functions');

/**
 * Maneja la acción de eliminar un recordatorio.
 */
async function handleDeleteReminder(
  interaction,
  userId,
  reminderId,
  activeReminders
) {
  if (activeReminders.has(userId)) {
    const userReminders = activeReminders.get(userId);
    const reminder = userReminders.find((r) => r.id === reminderId);
    if (reminder) {
      cancelReminder(activeReminders, userId, reminderId);
      await disableReminderButtons(interaction);
      return replyToInteraction(
        interaction,
        translateLanguage('remindme.reminderCanceled'),
        false
      );
    }
  }
  return replyToInteraction(
    interaction,
    translateLanguage('remindme.noActiveReminders'),
    true
  );
}

/**
 * Maneja la acción de reiniciar el intervalo del recordatorio.
 */
async function handleSetInterval(
  interaction,
  userId,
  reminderId,
  activeReminders,
  startReminder
) {
  if (activeReminders.has(userId)) {
    const userReminders = activeReminders.get(userId);
    const reminder = userReminders.find((r) => r.id === reminderId);
    if (reminder) {
      const { message, timeInMsFromNow } = reminder;
      const newReminderDate = new Date(Date.now() + timeInMsFromNow);
      await disableReminderButtons(interaction);
      return startReminder(
        interaction,
        newReminderDate,
        message,
        timeInMsFromNow
      );
    }
  }
  return replyToInteraction(
    interaction,
    translateLanguage('remindme.noActiveReminders'),
    true
  );
}

/**
 * Maneja la acción de editar el recordatorio (abre el modal).
 */
async function handleEditReminder(
  interaction,
  userId,
  reminderId,
  activeReminders
) {
  if (activeReminders.has(userId)) {
    const userReminders = activeReminders.get(userId);
    const reminder = userReminders.find((r) => r.id === reminderId);
    if (reminder) {
      const { reminderDate, message } = reminder;
      const formattedTime = formatReminderDate(reminderDate);
      const modal = new ModalBuilder()
        .setCustomId(`edit_reminder_modal_${reminderId}`)
        .setTitle(translateLanguage('remindme.editReminderTitle'));
      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('time_input')
            .setLabel(translateLanguage('remindme.newTimeLabel'))
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(formattedTime)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('message_input')
            .setLabel(translateLanguage('remindme.newMessageLabel'))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setValue(message)
        )
      );
      return interaction.showModal(modal);
    }
  }
  return replyToInteraction(
    interaction,
    translateLanguage('remindme.noActiveReminders'),
    true
  );
}

async function updateReminder(
  interaction,
  userId,
  reminderId,
  activeReminders,
  startReminder,
  newReminderDate,
  newMessage
) {
  const reminder = activeReminders.get(userId).find((r) => r.id === reminderId);
  await disableReminderButtons(reminder.reply);
  cancelReminder(activeReminders, userId, reminderId);
  await startReminder(
    interaction,
    newReminderDate,
    newMessage,
    newReminderDate.getTime() - Date.now()
  );

  const updatedResponse = {
    content: translateLanguage('remindme.reminderUpdated'),
    ephemeral: true,
  };

  return !interaction.replied && !interaction.deferred
    ? interaction.reply(updatedResponse)
    : interaction.followUp(updatedResponse);
}
async function handleEditReminderModal(
  interaction,
  userId,
  reminderId,
  activeReminders,
  startReminder
) {
  const newTimeInput = interaction.fields.getTextInputValue('time_input');
  const newMessage = interaction.fields.getTextInputValue('message_input');
  const newReminderDate = parseDate(newTimeInput);
  if (!newReminderDate) {
    return replyToInteraction(
      interaction,
      translateLanguage('remindme.invalidFormat'),
      true
    );
  }
  if (!activeReminders.has(userId)) {
    return replyToInteraction(
      interaction,
      translateLanguage('remindme.noActiveReminders'),
      true
    );
  }
  const reminder = activeReminders.get(userId).find((r) => r.id === reminderId);
  if (!reminder) {
    return replyToInteraction(
      interaction,
      translateLanguage('remindme.noActiveReminders'),
      true
    );
  }
  await updateReminder(
    interaction,
    userId,
    reminderId,
    activeReminders,
    startReminder,
    newReminderDate,
    newMessage
  );
}

module.exports = {
  handleDeleteReminder,
  handleSetInterval,
  handleEditReminder,
  handleEditReminderModal,
};
