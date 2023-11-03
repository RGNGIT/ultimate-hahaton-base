import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { botToken } from 'src/config';
import { AppUpdate } from './app.update';


const sessions = new LocalSession({database: 'session_db.json'})

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: botToken,
      middlewares: [sessions.middleware()]
    })
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
