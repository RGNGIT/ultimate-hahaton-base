import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from './entities/connection.entity';

@ApiTags('Соединения с базами данных')
@Controller()
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}


  @ApiOperation({summary:'Создание подключения'})
  @ApiResponse({status:200, type: Connection})
  @Post()
  async create(@Body() createConnectionDto: CreateConnectionDto) {
    return await this.connectionsService.create(createConnectionDto);
  }

  @ApiOperation({summary:'Получить все подключения'})
  @ApiResponse({status:200, type: [Connection]})
  @Get()
  async findAll() {
    return await this.connectionsService.findAll();
  }

  @ApiOperation({summary:'Инфо о подключении'})
  @ApiResponse({status:200})
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.connectionsService.findOne(+id);
  }

  @ApiOperation({summary:'Изменить строку подключения'})
  @ApiResponse({status:200, type: Connection})
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateConnectionDto: UpdateConnectionDto) {
    return await this.connectionsService.update(+id, updateConnectionDto);
  }

  @ApiOperation({summary:'Удалить подключение'})
  @ApiResponse({status:200})
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.connectionsService.remove(+id);
  }
}
