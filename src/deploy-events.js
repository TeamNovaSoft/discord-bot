import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const deployEvents = async (client) => {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const eventPath = path.join(eventsPath, file);
    const event = await import(eventPath);

    const eventHandler = (...args) => event.execute(client, ...args);

    if (event.once) {
      client.once(event.name, eventHandler);
    } else {
      client.on(event.name, eventHandler);
    }
  }
};

export default deployEvents;
