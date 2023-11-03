import { Controller, Get, Param } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Мониторинг баз')
@Controller()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) { }

  @Get('fullReport/:tgId')
  async fullReportList(@Param() tgId) {
    const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
    const {host, port, username, password} = this.monitoringService.splitCreds(credString);

    let fullMetricsReport = await this.monitoringService.getFullMetricsReport(host, port, username, password);

    return fullMetricsReport;
  }

  @Get('dbList/:tgId')
  async databaseList(@Param() tgId) {
    const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
    const {host, port, username, password} = this.monitoringService.splitCreds(credString);

    let partMetricsReport = await this.monitoringService.getDatabasesReport(host, port, username, password);

    return partMetricsReport;
  }

}