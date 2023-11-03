import { Inject, Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class BotService{
    constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}



    async sendTelegramMessage(message: string, chatId: string) {
        // ID чата, куда вы хотите отправлять уведомления
        
        try {
          await this.bot.telegram.sendMessage(chatId, message);
        } catch (error) {
          console.error('Ошибка при отправке сообщения в Telegram:', error);
        }
    }

}