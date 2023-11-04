import { Inject, Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { ConnectionsService } from 'src/connections/connections.service';
import { CreateConnectionDto } from 'src/connections/dto/create-connection.dto';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class BotService{
    constructor(@InjectBot() private readonly bot: Telegraf<Context>,
    private readonly connectionsService: ConnectionsService) {}



    async sendTelegramMessage(message: string, chatId: string) {
        // ID чата, куда вы хотите отправлять уведомления
        
        try {
          await this.bot.telegram.sendMessage(chatId, message);
        } catch (error) {
          console.error('Ошибка при отправке сообщения в Telegram:', error);
        }
    }

    async parseConnectionString(str: string, tg_id: string){
      const splitCreds =  str.split(';');

      const createConnectionDto:CreateConnectionDto = {
        host: splitCreds[0], 
        port: splitCreds[1], 
        username: splitCreds[2], 
        password: splitCreds[3],
        telegram_id: tg_id,
        name: `${splitCreds[2]}@${splitCreds[0]}`
      };

      const result = await this.connectionsService.create(createConnectionDto);
      return result;
    }

}