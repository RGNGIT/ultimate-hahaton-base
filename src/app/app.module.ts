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


const sessions = new LocalSession({ database: 'session_db.json' })

@Module({

  imports: [
    UserModule,
    ConnectionsModule,
    RouterModule.register([{
      path: path.API_REQUEST,
      children: [{
        path: path.USER_MODULE,
        module: UserModule
      },
      {
        path: path.CONNECTIONS_MODULE,
        module: ConnectionsModule
      }
      ]
    }]),
    TelegrafModule.forRoot({
      token: botToken,
      middlewares: [sessions.middleware()]
    }),
  ],
  providers: [AppService, BotUpdate],
})
export class AppModule { }
