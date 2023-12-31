import { Telegraf } from "telegraf";
import { chatGPT } from './chatgpt.js';
import { create } from './notion.js';
import { Loader } from './loader.js';

// Добавьте эту строку для загрузки переменных среды из файла .env
import 'dotenv/config';

// Инициализация бота
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Обработчик команды start
bot.command('start', (ctx) => {
    ctx.reply('Напишіть декілька слів, а я зроблю з них казку');
});

// Обработчик текстовых сообщений
bot.on('text', proccessGPTResponse);

async function proccessGPTResponse(ctx) {
  try {
    // Остальная часть вашего кода остается без изменений...
    const text = ctx.message.text;
    if (!text.trim()) {
      ctx.reply('Текст не может быть пустым');
      return;
    }

    const loader = new Loader(ctx);
    loader.show();

    const response = await chatGPT(text);
    if (!response) {
      loader.hide();
      ctx.reply(`Ошибка с API. ${response}`);
      return;
    }

    // Сохранение текста в Notion и получение URL созданной страницы
    const notionResp = await create(text, response.content, ctx.from.first_name);

    

    // Отправка ответа от OpenAI в чат Telegram
    ctx.reply(response.content);

    // Отправка URL страницы Notion в чат Telegram
    if (notionResp && notionResp.url) {
      ctx.reply(`Ваша страниця в Notion: ${notionResp.url}`);
    } else {
      ctx.reply('Не удалось создать страницу в Notion');
    }

    loader.hide();
  } catch (e) {
    console.log(`Error while processing gpt response:`, e.message);
    loader.hide();
    ctx.reply(`Произошла ошибка: ${e.message}`);
  }
}

// Запуск бота
bot.launch();
console.log('Бот запущен');
