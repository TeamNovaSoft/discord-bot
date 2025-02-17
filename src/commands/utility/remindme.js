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
let reminderCounter = 0;

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

    let timeDiff = reminderDate.getTime() - Date.now();

    if (timeDiff <= 0) {
      reminderDate.setDate(reminderDate.getDate() + 1);
      timeDiff = reminderDate.getTime() - Date.now();
    }

    await this.startReminder(interaction, reminderDate, message, timeDiff);
  },

  async startReminder(interaction, reminderDate, message, timeInMsFromNow) {
    const userId = interaction.user.id;
    const reminderId = ++reminderCounter;

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
        .setCustomId(`set_interval_${reminderId}`)
        .setLabel(translateLanguage('remindme.resetReminder'))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`edit_reminder_${reminderId}`)
        .setLabel(translateLanguage('remindme.editReminder'))
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`delete_reminder_${reminderId}`)
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
      await disableReminderButtons(reply);
      try {
        await interaction.user.send(
          translateLanguage('remindme.reminderMessage').replace(
            '{{message}}',
            message
          )
        );
      } catch (error) {
        console.log(error);
      }
      cancelReminder(activeReminders, userId, reminderId);
    }, timeInMsFromNow);

    const reminderObj = {
      id: reminderId,
      interval,
      timeout,
      reminderDate,
      message,
      timeInMsFromNow,
      reply,
    };

    if (activeReminders.has(userId)) {
      activeReminders.get(userId).push(reminderObj);
    } else {
      activeReminders.set(userId, [reminderObj]);
    }
  },

  async buttonHandler(interaction) {
    if (!interaction.isButton() && !interaction.isModalSubmit()) {
      return;
    }

    const userId = interaction.user.id;
    const customId = interaction.customId;

    const parts = customId.split('_');
    let actionKey = '';
    if (parts.includes('modal')) {
      actionKey = parts.slice(0, 3).join('_');
    } else {
      actionKey = parts.slice(0, 2).join('_');
    }
    const reminderId = parseInt(parts.pop(), 10);

    switch (actionKey) {
      case 'delete_reminder': {
        if (activeReminders.has(userId)) {
          const userReminders = activeReminders.get(userId);
          const reminder = userReminders.find((r) => r.id === reminderId);
          if (reminder) {
            cancelReminder(activeReminders, userId, reminderId);
            await disableReminderButtons(interaction);
            await replyToInteraction(
              interaction,
              translateLanguage('remindme.reminderCanceled'),
              false
            );
          } else {
            await replyToInteraction(
              interaction,
              translateLanguage('remindme.noActiveReminders'),
              true
            );
          }
        } else {
          await replyToInteraction(
            interaction,
            translateLanguage('remindme.noActiveReminders'),
            true
          );
        }
        break;
      }
      case 'set_interval': {
        if (activeReminders.has(userId)) {
          const userReminders = activeReminders.get(userId);
          const reminder = userReminders.find((r) => r.id === reminderId);
          if (reminder) {
            const { message, timeInMsFromNow } = reminder;
            const newReminderDate = new Date(Date.now() + timeInMsFromNow);
            await disableReminderButtons(interaction);
            await resetReminder(
              interaction,
              activeReminders,
              userId,
              reminderId,
              newReminderDate,
              message,
              timeInMsFromNow,
              this.startReminder.bind(this)
            );
          } else {
            await replyToInteraction(
              interaction,
              translateLanguage('remindme.noActiveReminders'),
              true
            );
          }
        } else {
          await replyToInteraction(
            interaction,
            translateLanguage('remindme.noActiveReminders'),
            true
          );
        }
        break;
      }
      case 'edit_reminder': {
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

            await interaction.showModal(modal);
          } else {
            await replyToInteraction(
              interaction,
              translateLanguage('remindme.noActiveReminders'),
              true
            );
          }
        } else {
          await replyToInteraction(
            interaction,
            translateLanguage('remindme.noActiveReminders'),
            true
          );
        }
        break;
      }
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

        if (activeReminders.has(userId)) {
          const userReminders = activeReminders.get(userId);
          const reminder = userReminders.find((r) => r.id === reminderId);
          if (reminder) {
            await disableReminderButtons(reminder.reply);

            cancelReminder(activeReminders, userId, reminderId);

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
          } else {
            await replyToInteraction(
              interaction,
              translateLanguage('remindme.noActiveReminders'),
              true
            );
          }
        } else {
          await replyToInteraction(
            interaction,
            translateLanguage('remindme.noActiveReminders'),
            true
          );
        }
        break;
      }

      default:
        break;
    }
  },
};
