const pingCommand = require('../ping');

jest.mock('../../../languages', () => ({
  translateLanguage: jest.fn((key) => {
    if (key === 'ping.description') {
      return 'Ping command description';
    }
    return key;
  }),
  keyTranslations: jest.fn((key) => {
    if (key === 'ping.description') {
      return {
        'en-US': 'Ping command description',
        'es-ES': 'Descripción del comando Ping',
      };
    }
    return {};
  }),
}));

describe('Ping command', () => {
  test('should have the correct name and description', () => {
    const commandJSON = pingCommand.data.toJSON();
    expect(commandJSON.name).toBe('ping');
    expect(commandJSON.description).toBe('Ping command description');
  });

  test('command snapshot', () => {
    const commandJSON = pingCommand.data.toJSON();
    expect(commandJSON).toMatchSnapshot();
  });

  test('should respond with "Pong!" when executed', async () => {
    const interaction = {
      reply: jest.fn().mockResolvedValue(true),
    };

    await pingCommand.execute(interaction);
    expect(interaction.reply).toHaveBeenCalledWith('Pong!');
  });
});
