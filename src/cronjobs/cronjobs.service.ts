import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BotService } from 'src/app/bot.service';
import { ConnectionsService } from 'src/connections/connections.service';
import { Connection } from 'src/connections/entities/connection.entity';
import { MonitoringService } from 'src/monitoring/monitoring.service';
import { Status } from './entities/status.entity';
import constants from "../common/constants";
import { Log, LogType } from './entities/log.entity';

@Injectable()
export class CronjobsService {

  constructor(private readonly botService: BotService,
    private readonly connectionsService: ConnectionsService,
    private readonly monitoringService: MonitoringService,
    @Inject(constants.STATUS_REPOSITORY)
    private statusRepository: typeof Status,
    @Inject(constants.LOG_REPOSITORY)
    private logRepository: typeof Log
    ) { }

  // @Cron( '0 * * * * *' )
  // openForBusiness()  {
  //     console.log("Delicious cakes is open for business...")
  // }


  // @Cron( '*/15 * * * * *' ) 
  // takingOrders() {
  //     console.log("Delicious cakes is still taking orders")
  // }
  @Interval(300000)
  async monitorChronos() {
    const connections = await this.connectionsService.findAll();

    for (const connection of connections) {
      const splitCreds = connection.connectionString.split(';');
      const databases = await this.monitoringService.getDatabasesReport(splitCreds[0], splitCreds[1], splitCreds[2], splitCreds[3]);

      for (const db of databases) {
        await this.statusRepository.create({oid: db.oid, sessions: db.sessions, idle_in_transaction: db?.idle_in_transaction_time, date: Date.now()});
      }
    }
  }

  @Interval(300000)
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
      console.log(sequelizeConfig);

      const sequelize = new Sequelize(sequelizeConfig);
      await sequelize.query("SELECT 1+1;");
      await sequelize.close();
      await this.logRepository.create({host:  splitCreds[0], message: "Проблем не обнаружено", type: LogType.info, date: Date.now()});
    } catch (error) {

      console.error('Ошибка мониторинга базы данных:', error);

      // let log = await this.logRepository.findOne({ where: { host:  splitCreds[0], message: error.message, date: Date.now()} });
    
      await this.logRepository.create({host:  splitCreds[0], message: error.message.toString(), type: LogType.error, date: Date.now()});
      await this.botService.sendTelegramMessage(`Ошибка в базе данных ${splitCreds[0]}. Хост не прошел HealthCheck.`, connection.user.telegram_chat_id);
    }
  }



}
