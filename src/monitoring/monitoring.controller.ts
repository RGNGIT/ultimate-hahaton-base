import { Controller, Get, Param } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Мониторинг баз')
@Controller()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) { }
  // Фул постгре репорты по всем хостам юзера, к которым подъебан юзер (таблица connections)
  @ApiOperation({summary:'Полные отчеты по всем подключениям пользователя'})
  @ApiResponse({status:200})
  @Get('fullReports/:tgId')
  async fullReportList(@Param('tgId') tgId: string) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseFullInfos(credStrings);
  }
  // Hепорты онли по БД по всем хостам юзера, к оторым подъебан юзер (таблица connections)
  @ApiOperation({summary:'Отчеты по базам данных по всем подключениям пользователя'})
  @ApiResponse({status:200})
  @Get('fullHostsDbList/:tgId')
  async databaseList(@Param('tgId') tgId: string) {
    console.log("Я тута " + tgId);
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseShortInfos(credStrings);
  }
  // Все хосты юзера из таблицы connections
  @ApiOperation({summary:'Все подключения пользователя'})
  @ApiResponse({status:200})
  @Get('usersHosts/:tgId')
  async hostsList(@Param('tgId') tgId: string) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return credStrings.map(cs => ({id: cs.id, host: cs.connectionString.split(';')[0]}));
  }

} 