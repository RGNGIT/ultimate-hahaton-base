import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { usersProvider } from '../user/providers/user.providers';
import { cronjobProvider } from 'src/cronjobs/entities/providers/cronjobs.providers';
import { connectionProvider } from 'src/connections/providers/connection.providers';
import { SshService } from './ssh.service';

@Module({
  imports: [],
  controllers: [MonitoringController],
  providers: [MonitoringService, SshService, ...usersProvider, ...cronjobProvider, ...connectionProvider],
  exports: [MonitoringService]
})
export class MonitoringModule { }
