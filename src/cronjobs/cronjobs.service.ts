import { Injectable, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BotService } from 'src/app/bot.service';
import { ConnectionsService } from 'src/connections/connections.service';
import { Connection } from 'src/connections/entities/connection.entity';

@Injectable()
export class CronjobsService {

  constructor(private readonly botService: BotService,
    private readonly connectionsService: ConnectionsService
  ) { }

  // @Cron( '0 * * * * *' )
  // openForBusiness()  {
  //     console.log("Delicious cakes is open for business...")
  // }


  // @Cron( '*/15 * * * * *' ) 
  // takingOrders() {
  //     console.log("Delicious cakes is still taking orders")
  // }

  @Interval(15000000)
  async monitorDatabases() {
    try {
      console.log('Мониторинг баз данных...');
      const connections = await this.connectionsService.findAll();

      for (const connection of connections) {
        this.checkDatabase(connection);
      }
    } catch (error) {

    }
  }

  private async checkDatabase(connection: Connection) {
    const splitCreds = connection.connectionString.split(';');

    try {
      const sequelizeConfig = {
        dialect: 'postgres' as Dialect,
        host: splitCreds[0],
        port: Number(splitCreds[1]),
        username: splitCreds[2],
        password: splitCreds[3],
        database: 'postgres'
      }

      const sequelize = new Sequelize(sequelizeConfig);
      await sequelize.query("SELECT 1+1;");
      await sequelize.close();
    } catch (error) {
      console.error('Ошибка мониторинга базы данных:', error);
      await this.botService.sendTelegramMessage(`Ошибка в базе данных ${splitCreds[0]}. Хост не прошел HealthCheck.`, connection.user.telegram_chat_id);
    }
  }



}
