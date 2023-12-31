import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { botToken } from 'src/config';
import { BotUpdate } from './bot.update';
import { UserModule } from 'src/user/user.module';
import { ConnectionsModule } from 'src/connections/connections.module';
import { RouterModule } from '@nestjs/core';
import path from 'src/common/path';
import { MonitoringModule } from 'src/monitoring/monitoring.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsModule } from 'src/cronjobs/cronjobs.module';
import { BotService } from './bot.service';
import { ConnectionWizardScene } from './scenes/scene.wizard';
import { MyScene } from './scenes/scene';
import { SQLCommandScene } from './scenes/scene.command';
import { CommandWizardScene } from './scenes/scene.wizard_command';
import { SshService } from 'src/monitoring/ssh.service';



const sessions = new LocalSession({ database: 'session_db.json' })


@Module({

  imports: [
    UserModule,
    ConnectionsModule,
    MonitoringModule,
    CronjobsModule,
    RouterModule.register([{
      path: path.API_REQUEST,
      children: [{
        path: path.USER_MODULE,
        module: UserModule
      },
      {
        path: path.CONNECTIONS_MODULE,
        module: ConnectionsModule
      },
      {
        path: path.MONITORING_MODULE,
        module: MonitoringModule
      }
      ]
    }]),
    TelegrafModule.forRoot({
      token: botToken,
      middlewares: [sessions.middleware()],
      //  include: [BotService, ConnectionWizardScene],
      
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [AppService, BotUpdate, BotService, MyScene, ConnectionWizardScene, SQLCommandScene, CommandWizardScene, SshService],
})
export class AppModule { }
