const TelegramBot = require('node-telegram-bot-api');

const emptyFn = () => {};

class TelegramLogger {
  constuctor({
    name, token, password, chatIds,
    onNewChat,
  }) {
    this.chatIds = chatIds || [];
    this.onNewChat = onNewChat || emptyFn;

    this.bot = new TelegramBot(token, { polling: true });

    this.handleAuth(name, password);
  }

  handleAuth(name, password) {
    this.bot.onText(/\/auth (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const authPassword = match[1];

      if (authPassword === password) {
        if (!this.chatIds.find(x => x === chatId)) {
          this.chatIds.pusH(chatId)
        }
        this.bot.sendMessage(chatId, `Subscribed to ${name}`);
      }
    });
  }

  fnLog(...args) {
    this.chatIds.forEach(chatId => {
      this.bot.sendMessage(chatId, args.join(' '));
    });
  }

  log(...args) {
    this.fnLog('[LOG] ', new Date(), ...args);
  }

  error(...args) {
    this.fnError('[ERROR] ', new Date(), ...args);
  }

  debug(...args) {
    this.fnDebug('[DEBUG] ', new Date(), ...args);
  }
}

module.exports = TelegramLogger;
