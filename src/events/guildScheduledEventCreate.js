const { ChannelType, Events } = require('discord.js');
const { LISTEN_NEW_EVENTS_REPORT_CHANNEL } = require('../config');
const { translateLanguage } = require('../languages/index');

module.exports = {
  name: Events.GuildScheduledEventCreate,
  once: false,
  async execute(client, event) {
    try {
      const channel = await client.channels.fetch(
        LISTEN_NEW_EVENTS_REPORT_CHANNEL.announcements
      );

      if (!channel || channel.type !== ChannelType.GuildText) {
        console.error(translateLanguage('errors.announcementChannelNotFound'));
        return;
      }
      const linkEvent = translateLanguage('eventCreated.linkEvent');

      const eventMessage =
        `**${translateLanguage('eventCreated.announcementTitle').trim()}**\n` +
        `**${translateLanguage('eventCreated.eventNameLabel').trim()}**: ${event.name.trim()}\n` +
        `**${translateLanguage('eventCreated.eventDescriptionLabel').trim()}**: ${event.description ? event.description.trim() : translateLanguage('eventCreated.noDescription').trim()}\n\n` +
        `${translateLanguage('eventCreated.joinEvent', { url: `[${linkEvent}](${event.url})` }).trim()}`;

      await channel.send(eventMessage);
      console.log(translateLanguage('eventCreated.messageSent'));
    } catch (error) {
      console.error(translateLanguage('eventCreated.discordEventError'), error);
    }
  },
};
