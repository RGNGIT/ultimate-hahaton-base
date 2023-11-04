import { Body, Controller, Get, HttpException, Param, Post, Query } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Мониторинг баз')
@Controller()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) { }
  // Фул постгре репорты по всем хостам юзера, к которым подъебан юзер (таблица connections)
  @ApiOperation({ summary: 'Полные отчеты по всем подключениям пользователя' })
  @ApiResponse({ status: 200 })
  @Post('fullReports/:tgId')
  async fullReportList(@Param('tgId') tgId: string) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseFullInfos(credStrings);
  }
  // Hепорты онли по БД по всем хостам юзера, к оторым подъебан юзер (таблица connections)
  @ApiOperation({ summary: 'Отчеты по базам данных по всем подключениям пользователя' })
  @ApiResponse({ status: 200 })
  @Post('fullHostsDbList/:tgId')
  async databaseList(@Param('tgId') tgId: string) {
    console.log("Я тута " + tgId);
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return this.monitoringService.collectDatabaseShortInfos(credStrings);
  }
  @ApiOperation({ summary: 'Отчеты по одной бд по имени' })
  @ApiResponse({ status: 200 })
  @Post('databaseReport/:tgId')
  async databaseReport(@Param('tgId') tgId: string, @Query('oid') oid) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    const databases = await this.monitoringService.collectDatabaseShortInfos(credStrings);
    const database = this.monitoringService.findDbByOid(databases, oid);

    if (!database)
      throw new HttpException('No such db', 404);

    return database;
  }
  // Все хосты юзера из таблицы connectionshttps://176a-95-71-189-217.ngrok-free.app/api/monitoring/fullHostsDbList/592957413
  @ApiOperation({ summary: 'Все подключения пользователя' })
  @ApiResponse({ status: 200 })
  @Post('usersHosts/:tgId')
  async hostsList(@Param('tgId') tgId: string) {
    const credStrings = await this.monitoringService.getPostgreCredsByTgId(tgId);
    return credStrings.map(cs => ({ id: cs.id, host: cs.connectionString.split(';')[0] }));
  }


    // Все хосты юзера из таблицы connections
    @ApiOperation({ summary: 'Перезапуск бд' })
    @ApiResponse({ status: 200 })
    @Post('database/:tgId')
    async reloadDB(@Param('tgId') tgId: string, @Body('host') host: string   ) {
      const credStrings = await this.monitoringService.getPostgreCredsByHost(tgId, host);

      return  await this.monitoringService.restartPG(credStrings);
    }
  
  

} 