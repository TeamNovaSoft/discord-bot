# Creating New Commands

Para crear un nuevo comando:

1. Navega al directorio `commands` y crea una nueva carpeta para tu comando (si es necesario).

2. Dentro de esta carpeta, crea un nuevo archivo JavaScript para tu comando. Aquí tienes un ejemplo básico de estructura:
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

3. El nuevo comando se cargará automáticamente la próxima vez que inicies el bot.
