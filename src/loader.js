export class Loader {
  icons = [
    '🕐', '🕑', '🕒',
    '🕓', '🕔', '🕕',
    '🕖', '🕗', '🕘',
    '🕙', '🕚', '🕛',
  ];
  interval = null;
  message = null;

  constructor(ctx) {
    this.ctx = ctx;
  }

  async show() {
    try {
      let index = 0;
      this.message = await this.ctx.reply(this.icons[index]);
      console.log(`Message sent with ID: ${this.message.message_id}, Chat ID: ${this.ctx.chat.id}, User Name: ${this.ctx.from.first_name}, Username: ${this.ctx.from.username}`);

      this.interval = setInterval(async () => {
        index = index < this.icons.length - 1 ? index + 1 : 0;
        try {
          await this.ctx.telegram.editMessageText(
            this.ctx.chat.id,
            this.message.message_id,
            null,
            this.icons[index]
          );
        } catch (error) {
          console.error(`Error editing message: ${error}. Chat ID: ${this.ctx.chat.id}, User Name: ${this.ctx.from.first_name}, Username: ${this.ctx.from.username}`);
          clearInterval(this.interval);
        }
      }, 1500);
    } catch (error) {
      console.error(`Error sending message: ${error}. Chat ID: ${this.ctx.chat.id}, User Name: ${this.ctx.from.first_name}, Username: ${this.ctx.from.username}`);
    }
  }

  hide() {
    try {
      if (this.message) {
        this.ctx.telegram.deleteMessage(this.ctx.chat.id, this.message.message_id);
      }
      clearInterval(this.interval);
    } catch (error) {
      console.error(`Error hiding loader: ${error}. Chat ID: ${this.ctx.chat.id}, User Name: ${this.ctx.from.first_name}, Username: ${this.ctx.from.username}`);
    }
  }
}
