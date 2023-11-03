import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';

@Module({
  imports: [],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: []
})
export class MonitoringModule { }
