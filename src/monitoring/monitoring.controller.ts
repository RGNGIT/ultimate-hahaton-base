import { Controller, Get, Param } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";

@Controller()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) { }

  @Get('fullReports/:tgId')
  async fullReportList(@Param('tgId') tgId) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseFullInfos(credStrings);
  }

  @Get('fullHostsDbList/:tgId')
  async databaseList(@Param('tgId') tgId) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseShortInfos(credStrings);
  }

  @Get('usersHosts/:tgId')
  async hostsList(@Param('tgId') tgId) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return credStrings.map(cs => ({id: cs.id, host: cs.connectionString.split(';')[0]}));
  }

}