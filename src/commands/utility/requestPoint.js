const { SlashCommandBuilder } = require('discord.js');
const { DISCORD_CONFIG } = require('../../config');

const discordQaRoleId =
    DISCORD_CONFIG.discordQARoleId || '1203085046769262592';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('request-point')
        .setDescription('Request point in this theads')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('User to search for')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const { options, channel, guild } = interaction;

            if (!channel.isThread()) {
                return await interaction.reply({
                    content: 'Sorry, this is not a thread!',
                    ephemeral: true,
                });
            }
            const user = options.getUser('user') || interaction.user;
            const escapedUserId = `<@${user.id}>`;
            const escapedQaId = `<@&${discordQaRoleId}>`

            const threadLink = `https://discord.com/channels/${guild.id}/${channel.id}`;
            const message = `${escapedQaId} ${escapedUserId} está pidiendo ayuda en este canal: ${threadLink}`;

            const channelSend = await interaction.client.channels.fetch('1270770663048613983');

            if (channelSend) {
                await channelSend.send(message);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while request QA.');
        }
    },
};
