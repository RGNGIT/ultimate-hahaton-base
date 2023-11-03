import { Markup } from 'telegraf'

export function actionButtons(){
    return Markup.inlineKeyboard(
        [
            // Markup.button.webApp('Начать работу',  'https://stas-monitor-bot.netlify.app/'),
            Markup.button.callback('Создать подключение', 'createConn'),
            // Markup.button.callback('Удоли', 'delete'),
        ],
        {
            columns: 1
        }
    );
}

export function statusButton(){
    return Markup.keyboard(
        [
            //Markup.button.webApp('Начать работу',  'https://stas-monitor-bot.netlify.app/'),
            Markup.button.callback('Показать статус', 'status'),
        ],
        {
            
        }
    )
}