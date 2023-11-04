import { Markup } from 'telegraf'

export function actionButtons(){
    return Markup.inlineKeyboard(
        [
            // Markup.button.webApp('Создать подключение',  'https://stas-monitor-bot.netlify.app/add'),
            Markup.button.callback('Создать новое подключение', 'upload_doc'),

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
            Markup.button.callback('Создать подключение',  'connect'),
            Markup.button.callback('Мои подключения',  'myConnects'),
            Markup.button.callback('Список голосовых команд',  'voicehelp'),
        ],
        { 
            columns: 3 
        }
    ).resize();
}

export function myConnectsButton(connections){
    const connectionButtons = connections.map((connection) =>
        // Markup.button.callback(`${connection.name}`, `connection_${connection.id}`)
        Markup.button.webApp(`${connection.name}`, `https://stas-monitor-bot.netlify.app/${connection.id}`)
    );
    return Markup.inlineKeyboard(
        [
            ...connectionButtons,
            // Markup.button.webApp('Создать подключение',  'https://stas-monitor-bot.netlify.app/add'),
            Markup.button.callback('Создать новое подключение', 'upload_doc'),

        ],
        {
            columns: 1
        }
    );
}