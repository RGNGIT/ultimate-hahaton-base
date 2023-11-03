import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Connection } from 'src/connections/entities/connection.entity';

@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiOperation({summary:'Создание пользователя'})
  @ApiResponse({status:200, type: User})
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({summary:'Получить всех пользователей'})
  @ApiResponse({status:200, type: [User]})
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiOperation({summary:'Получить подключения пользователя'})
  @ApiResponse({status:200, type: [Connection]})
  @Get('connections/:id')
  async findAllUserConnections(@Param('id') id: number) {
    return await this.userService.findAllUserConnections(id);
  }

  @ApiOperation({summary:'Получение пользователя по Telegram id'})
  @ApiResponse({status:200, type: User})
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @ApiOperation({summary:'Обновить пользователя? зачем?'})
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({summary:'Удаление пользователя из базы данных'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
