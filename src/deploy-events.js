const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    const eventHandler = (...args) => event.execute(...args, client);

    event.once
      ? client.once(event.name, eventHandler)
      : client.on(event.name, eventHandler);
  }
};
