import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { UserService } from 'src/user/user.service';
import { usersProvider } from '../user/providers/user.providers';

@Module({
  imports: [],
  controllers: [MonitoringController],
  providers: [MonitoringService, ...usersProvider],
  exports: [MonitoringService]
})
export class MonitoringModule { }
