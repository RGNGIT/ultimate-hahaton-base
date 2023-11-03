import { Injectable, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression, Interval  } from '@nestjs/schedule';
import { BotService } from 'src/app/bot.service';
import { ConnectionsService } from 'src/connections/connections.service';

@Injectable()
export class CronjobsService {

    constructor(private readonly botService: BotService,
        private readonly connectionsService: ConnectionsService
        ){}

    @Cron( '0 * * * * *' )
    openForBusiness()  {
        console.log("Delicious cakes is open for business...")
    }


    @Cron( '*/15 * * * * *' ) 
    takingOrders() {
        console.log("Delicious cakes is still taking orders")
    }

    @Interval(15000)
    async monitorDatabases() {
        try {
          // Здесь должен быть ваш код для мониторинга баз данных
          console.log('Мониторинг баз данных...');
    
          throw new ForbiddenException('Forbidden');
        } catch (error) {
            
          console.error('Ошибка мониторинга базы данных:', error);
          // Здесь можно отправить сообщение об ошибке через бота в Telegram
          this.botService.sendTelegramMessage(`Ошибка в базе данных: ${error.message}`, "592957413" );
        }
      }


      
}
