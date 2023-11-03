import { Injectable, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression, Interval  } from '@nestjs/schedule';
import { BotService } from 'src/app/bot.service';
import { ConnectionsService } from 'src/connections/connections.service';
import { Connection } from 'src/connections/entities/connection.entity';

@Injectable()
export class CronjobsService {

    constructor(private readonly botService: BotService,
        private readonly connectionsService: ConnectionsService
        ){}

    // @Cron( '0 * * * * *' )
    // openForBusiness()  {
    //     console.log("Delicious cakes is open for business...")
    // }


    // @Cron( '*/15 * * * * *' ) 
    // takingOrders() {
    //     console.log("Delicious cakes is still taking orders")
    // }

    @Interval(1500000)
    async monitorDatabases() {
        try {
          // Здесь должен быть ваш код для мониторинга баз данных
          console.log('Мониторинг баз данных...');
          const connections =  await this.connectionsService.findAll();

          for (const connection of connections) {
            this.checkDatabase(connection);
          } 

    
        } catch (error) {
            
          // Здесь можно отправить сообщение об ошибке через бота в Telegram
          
        }
      }

      private async checkDatabase(connection: Connection) {
        try {
          // Логика проверки базы данных
          if(connection.id == 1)
            throw new ForbiddenException('Forbidden');

        } catch (error) {
          console.error('Ошибка мониторинга базы данных:', error);

          await this.botService.sendTelegramMessage(`Ошибка в базе данных: ${error.message}`, connection.user.telegram_chat_id);
        }
      }


      
}
