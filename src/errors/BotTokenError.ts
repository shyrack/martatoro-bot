export class BotTokenError extends Error {
  constructor() {
    super(
      'No valid bot token could be found. Please set an environment variable with the name "MARTATORO_BOT_TOKEN" and the value of your token.'
    );
  }
}
