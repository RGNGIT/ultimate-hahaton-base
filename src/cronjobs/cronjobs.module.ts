import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { BotService } from 'src/app/bot.service';
import { ConnectionsService } from 'src/connections/connections.service';
import { connectionProvider } from 'src/connections/providers/connection.providers';

@Module({
  providers: [CronjobsService, BotService, ConnectionsService, ...connectionProvider]
})
export class CronjobsModule {}
