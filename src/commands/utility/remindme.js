const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

const {
  parseDate,
  cancelReminder,
  replyToInteraction,
  disableReminderButtons,
  updateCountdownEmbed,
  resetReminder,
  formatReminderDate,
} = require('../../utils/remindme-functions');
const { translateLanguage } = require('../../languages/index');

const activeReminders = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription(translateLanguage('remindme.commandDescription'))
    .addStringOption((option) =>
      option
        .setName('time')
        .setDescription(translateLanguage('remindme.timeOptionDescription'))
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription(translateLanguage('remindme.messageOptionDescription'))
        .setRequired(true)
    ),

  async execute(interaction) {
    const timeInput = interaction.options.getString('time');
    const message = interaction.options.getString('message');
    const reminderDate = parseDate(timeInput);

    if (!reminderDate) {
      return replyToInteraction(
        interaction,
        translateLanguage('remindme.invalidFormat'),
        true
      );
    }

    const timeDiff = reminderDate.getTime() - Date.now();
    if (timeDiff <= 0) {
      return replyToInteraction(
        interaction,
        translateLanguage('remindme.timeInFuture'),
        true
      );
    }

    await this.startReminder(interaction, reminderDate, message, timeDiff);
  },

  async startReminder(interaction, reminderDate, message, originalDuration) {
    const userId = interaction.user.id;

    cancelReminder(activeReminders, userId);

    const exactTime = `<t:${Math.floor(reminderDate.getTime() / 1000)}:F>`;
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(translateLanguage('remindme.reminderCreatedTitle'))
      .setDescription(
        `**${translateLanguage('remindme.remindingAt')}:** ${exactTime}\n⏳ **${translateLanguage('remindme.updatingCountdown')}**`
      )
      .setFooter({ text: translateLanguage('remindme.dmNotice') });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('set_interval')
        .setLabel(translateLanguage('remindme.resetReminder'))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('edit_reminder')
        .setLabel(translateLanguage('remindme.editReminder'))
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('delete_reminder')
        .setLabel(translateLanguage('remindme.cancelReminder'))
        .setStyle(ButtonStyle.Danger)
    );

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const interval = setInterval(
      () => updateCountdownEmbed(reply, reminderDate, message, exactTime),
      1000
    );
    const timeout = setTimeout(async () => {
      await interaction.user.send(
        translateLanguage('remindme.reminderMessage').replace(
          '{{message}}',
          message
        )
      );
      cancelReminder(activeReminders, userId);
    }, originalDuration);

    activeReminders.set(userId, {
      interval,
      timeout,
      reminderDate,
      message,
      originalDuration,
    });
  },

  async buttonHandler(interaction) {
    if (!interaction.isButton() && !interaction.isModalSubmit()) {
      return;
    }

    const userId = interaction.user.id;

    switch (interaction.customId) {
      case 'delete_reminder': {
        const userId = interaction.user.id;
        cancelReminder(activeReminders, userId);

        await disableReminderButtons(interaction);
        await replyToInteraction(
          interaction,
          translateLanguage('remindme.reminderCanceled'),
          false
        );
        break;
      }

      case 'set_interval':
        if (activeReminders.has(userId)) {
          const { message, originalDuration } = activeReminders.get(userId);
          const newReminderDate = new Date(Date.now() + originalDuration);

          await disableReminderButtons(interaction);
          await resetReminder(
            interaction,
            activeReminders,
            userId,
            newReminderDate,
            message,
            originalDuration,
            this.startReminder
          );
        } else {
          await replyToInteraction(
            interaction,
            translateLanguage('remindme.noActiveReminders'),
            true
          );
        }
        break;

      case 'edit_reminder':
        if (activeReminders.has(userId)) {
          const { reminderDate, message } = activeReminders.get(userId);
          const formattedTime = formatReminderDate(reminderDate);

          const modal = new ModalBuilder()
            .setCustomId('edit_reminder_modal')
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

          await interaction.showModal(modal);
        } else {
          await replyToInteraction(
            interaction,
            translateLanguage('remindme.noActiveReminders'),
            true
          );
        }
        break;

      case 'edit_reminder_modal': {
        const newTimeInput = interaction.fields.getTextInputValue('time_input');
        const newMessage =
          interaction.fields.getTextInputValue('message_input');
        const newReminderDate = parseDate(newTimeInput);

        if (!newReminderDate) {
          return replyToInteraction(
            interaction,
            translateLanguage('remindme.invalidFormat'),
            true
          );
        }

        await disableReminderButtons(interaction);
        cancelReminder(activeReminders, userId);

        await this.startReminder(
          interaction,
          newReminderDate,
          newMessage,
          newReminderDate.getTime() - Date.now()
        );

        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: translateLanguage('remindme.reminderUpdated'),
            ephemeral: true,
          });
        } else {
          await interaction.followUp({
            content: translateLanguage('remindme.reminderUpdated'),
            ephemeral: true,
          });
        }
        break;
      }
    }
  },
};
