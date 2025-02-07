export function parseAllowedChannels(channels?: string) {
  if (typeof channels !== 'string') {
    return [];
  }

  return channels
    .split(';')
    .filter(Boolean)
    .map((channelData) => {
      const [id, name] = channelData.split(',');
      return { name: name, value: id };
    });
}
