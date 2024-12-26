export default {
  async fetch(request, env, ctx) {
    const TOKEN = env.TELEGRAM_TOKEN; // Использование переменной окружения для токена
    const WEBAPP_URL = 'https://braincoingame.web.app/';
    
    async function sendTelegramMessage(chatId, text, markup) {
      const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          reply_markup: markup,
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }
      return response.json();
    }

    try {
      if (request.method !== 'POST') {
        return new Response('Only POST requests are accepted', { status: 405 });
      }

      const contentType = request.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        return new Response('Content-Type must be application/json', { status: 400 });
      }

      let data;
      const text = await request.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON:', text);
        return new Response('Invalid JSON payload', { status: 400 });
      }

      if (data.message?.text === '/start') {
        const chatId = data.message.chat.id;
        const ref = data.message.text.split(' ')[1] || '';
        
        const markup = {
          inline_keyboard: [[
            {
              text: 'Открыть мини-приложение',
              web_app: {
                url: `${WEBAPP_URL}?ref=${ref}`
              }
            }
          ]]
        };

        await sendTelegramMessage(chatId, 'Привет! Нажми, чтоб запустить', markup);
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Error:', error.message);
      return new Response(error.message, { status: 500 });
    }
  }
};
