import { Markup } from 'telegraf'

export function actionButtons(){
    return Markup.inlineKeyboard(
        [
            Markup.button.webApp('Создать подключение',  'https://stas-monitor-bot.netlify.app/add'),
        ],
        {
            columns: 1
        }
    );
}

export function statusButton(){
    return Markup.keyboard(
        [
            Markup.button.webApp('Показать статус', 'https://stas-monitor-bot.netlify.app/'),
            Markup.button.webApp('Создать новое подключение', 'https://stas-monitor-bot.netlify.app/add'),
        ],
        { columns: 2 }
    ).resize();
}