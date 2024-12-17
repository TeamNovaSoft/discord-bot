function parseAllowedChannels(channels) {
  if (!channels) {
    return [];
  }

  return channels
    .split(';')
    .filter(Boolean)
    .map((channelData) => {
      const [id, name] = channelData.split(',');

      return { id, name };
    });
}

module.exports = { parseAllowedChannels };
