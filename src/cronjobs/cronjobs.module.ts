import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { BotService } from 'src/app/bot.service';
import { ConnectionsService } from 'src/connections/connections.service';
import { connectionProvider } from 'src/connections/providers/connection.providers';
import { MonitoringService } from 'src/monitoring/monitoring.service';
import { cronjobProvider } from './entities/providers/cronjobs.providers';
import { SshService } from 'src/monitoring/ssh.service';

@Module({
  imports: [],
  providers: [CronjobsService, MonitoringService, BotService, ConnectionsService, SshService,  ...connectionProvider, ...cronjobProvider]
})
export class CronjobsModule {}
