// telegram-webhook.js

// Убедитесь, что ваш токен и chat_id вставлены сюда
const BOT_TOKEN = '6820348217:AAFDPmu57ZLh70kGbUq76yi7UaoPOXE6uCY'; // Например: 1234567890:AAFb1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6
const CHAT_ID = '6546066178';     // Например: 1234567890

export default async function handler(req, res) {
  // Проверяем, что это POST-запрос
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем данные из тела запроса
    const data = req.body;

    // Формируем сообщение для Telegram
    let message = '📦 *Новая заявка на дистрибуцию*\n\n';
    message += `*Основные артист(-ы):* ${data.artists || 'Не указано'}\n`;
    message += `*Тип релиза:* ${data.releaseType || 'Не указано'}\n`;
    message += `*Название релиза:* ${data.releaseName || 'Не указано'}\n`;
    message += `*Подзаголовок:* ${data.subtitle || 'Не указано'}\n`;
    message += `*Перенос/заливка:* ${data.transfer || 'Не указано'}\n`;
    if (data.upc) message += `*UPC:* ${data.upc}\n`;
    if (data.originalReleaseDate) message += `*Оригинальная дата релиза:* ${data.originalReleaseDate}\n`;
    message += `*Жанр:* ${data.genre || 'Не указано'}\n`;
    message += `*Дата выхода:* ${data.releaseDate || 'Не указано'}\n`;
    message += `*ФИО автора текста:* ${data.lyricist || 'Не указано'}\n`;
    message += `*ФИО автора инструментала:* ${data.composer || 'Не указано'}\n`;
    message += `*Ненормативная лексика:* ${data.profanity || 'Не указано'}\n`;
    message += `*Ссылка на архив:* ${data.archiveLink || 'Не указана'}\n`;
    message += `*Spotify:* ${data.spotifyProfile || 'Не указано'}\n`;
    if (data.spotifyProfileUrl) message += `*Spotify URL:* ${data.spotifyProfileUrl}\n`;
    message += `*Apple Music:* ${data.appleProfile || 'Не указано'}\n`;
    if (data.appleProfileUrl) message += `*Apple Music URL:* ${data.appleProfileUrl}\n`;
    message += `*Telegram:* ${data.telegram || 'Не указано'}\n`;
    message += `*Комментарий:* ${data.comments || 'Не указано'}\n`;

    // Добавляем информацию о треках (если есть)
    if (data['trackName[]'] && Array.isArray(data['trackName[]'])) {
      message += '\n*Треки:*\n';
      for (let i = 0; i < data['trackName[]'].length; i++) {
        const trackNum = i + 1;
        message += `\n*Трек ${trackNum}:*\n`;
        message += `- *Название:* ${data['trackName[]'][i] || 'Не указано'}\n`;
        message += `- *Версия:* ${data['trackVersion[]'] ? data['trackVersion[]'][i] : 'Не указана'}\n`;
        message += `- *ISRC:* ${data['isrc[]'] ? data['isrc[]'][i] : 'Не указан'}\n`;
        message += `- *Артист(ы):* ${data['trackArtist[]'] ? data['trackArtist[]'][i] : 'Не указано'}\n`;
        message += `- *Автор инструментала:* ${data['trackComposer[]'] ? data['trackComposer[]'][i] : 'Не указано'}\n`;
        message += `- *Автор текста:* ${data['trackLyricist[]'] ? data['trackLyricist[]'][i] : 'Не указано'}\n`;
        message += `- *Лексика:* ${data[`trackProfanity${trackNum}`] || 'Не указана'}\n`;
      }
    }

    // URL для отправки сообщения
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // Отправляем POST-запрос к API Telegram
    const telegramResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'MarkdownV2', // Для форматирования
      }),
    });

    // Проверяем, успешен ли ответ от Telegram
    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Ошибка Telegram API:', errorData);
      return res.status(500).json({ error: 'Failed to send message to Telegram', details: errorData });
    }

    // Если всё успешно
    console.log('Сообщение в Telegram отправлено успешно');
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Ошибка в обработчике:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
