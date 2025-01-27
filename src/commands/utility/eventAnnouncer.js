const { SlashCommandBuilder } = require('discord.js');
const { CHANNEL_NAME } = require('../../config'); // Centralizar desde config.js

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce-event')
    .setDescription('Anuncia un nuevo evento en el canal de anuncios')
    .addStringOption((option) =>
      option
        .setName('event-name')
        .setDescription('Nombre del evento')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('event-link')
        .setDescription('Enlace del evento')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('event-description')
        .setDescription('Descripción del evento (opcional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const eventName = interaction.options.getString('event-name');
    const eventLink = interaction.options.getString('event-link');
    const eventDescription =
      interaction.options.getString('event-description') || 'Sin descripción';

    // Centralizar el ID del canal desde la configuración
    const announcementChannelId = CHANNEL_NAME.announcements;

    if (!announcementChannelId) {
      console.error('El ID del canal no está configurado en la configuración.');
      return interaction.reply({
        content:
          'Error: El ID del canal no está configurado en la configuración.',
        ephemeral: true,
      });
    }

    try {
      const announcementChannel = await interaction.guild.channels.fetch(
        announcementChannelId
      );

      if (!announcementChannel || !announcementChannel.isTextBased()) {
        throw new Error(
          'El canal de anuncios no es válido o no soporta texto.'
        );
      }

      await announcementChannel.send({
        content: `📢 **Nuevo Evento:** ${eventName}\n🔗 [Únete al evento aquí](${eventLink})\n📄 Descripción: ${eventDescription}`,
      });

      await interaction.reply({
        content: 'El evento ha sido anunciado correctamente.',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error al obtener el canal o al enviar el mensaje:', error);
      await interaction.reply({
        content:
          'No se pudo anunciar el evento. Verifica que el canal exista y que el bot tenga permisos.',
        ephemeral: true,
      });
    }
  },
};
