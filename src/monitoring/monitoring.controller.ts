import { Controller, Get, Param } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";

@Controller()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) { }

  @Get('dbList/:tgId')
  async databaseList(@Param() tgId) {
    const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
    const splitCreds = credString.split(';');

    let fullMetricsReport = await this.monitoringService.getFullMetricsReport(splitCreds[0], splitCreds[1], splitCreds[2], splitCreds[3]);

    fullMetricsReport = fullMetricsReport['databases'].map(u => ({state: "active", ...u}));

    return fullMetricsReport;
  }
}