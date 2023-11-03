import { Markup } from 'telegraf'

export function actionButtons(){
    return Markup.keyboard(
        [
            Markup.button.callback('Список дел', 'list'),
            Markup.button.callback('Редактировать', 'edit'),
            Markup.button.callback('Удоли', 'delete'),
        ],
        {
            columns: 1
        }
    );
}