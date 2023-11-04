import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { UserService } from 'src/user/user.service';
import { usersProvider } from '../user/providers/user.providers';
import { cronjobProvider } from 'src/cronjobs/entities/providers/cronjobs.providers';
import { connectionProvider } from 'src/connections/providers/connection.providers';

@Module({
  imports: [],
  controllers: [MonitoringController],
  providers: [MonitoringService,  ...usersProvider, ...cronjobProvider, ...connectionProvider],
  exports: [MonitoringService]
})
export class MonitoringModule { }
