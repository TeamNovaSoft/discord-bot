import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'discord.js';

const loadEvents = async (client: Client) => {
  const eventsPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    await import(`file://${path.join(eventsPath, file)}`)
      .then((eventModule) => {
        const event = eventModule.default || eventModule;
        const eventHandler = (...args: any[]) => event.execute(client, ...args);

        if (event.once) {
          client.once(event.name, eventHandler);
        } else {
          client.on(event.name, eventHandler);
        }
      })
      .catch((err) => console.error(`Error loading event ${file}:`, err));
  }
};

export default loadEvents;
