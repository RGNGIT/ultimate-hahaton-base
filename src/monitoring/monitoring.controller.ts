import { Controller, Get, Param } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";

@Controller()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) { }
  // Фул постгре репорты по всем хостам юзера, к оторым подъебан юзер (таблица connections)
  @Get('fullReports/:tgId')
  async fullReportList(@Param('tgId') tgId) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseFullInfos(credStrings);
  }
  // Hепорты онли по БД по всем хостам юзера, к оторым подъебан юзер (таблица connections)
  @Get('fullHostsDbList/:tgId')
  async databaseList(@Param('tgId') tgId) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseShortInfos(credStrings);
  }
  // Все хосты юзера из таблицы connections
  @Get('usersHosts/:tgId')
  async hostsList(@Param('tgId') tgId) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return credStrings.map(cs => ({id: cs.id, host: cs.connectionString.split(';')[0]}));
  }

} 