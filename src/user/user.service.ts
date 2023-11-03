import { Injectable, Inject } from '@nestjs/common';
import UpdateUserDto from './dto/update-user.dto';
import CreateUserDto from './dto/create-user.dto';
import constants from 'src/common/constants';
import { User } from './entities/user.entity';
import { Connection } from 'src/connections/entities/connection.entity';


@Injectable()
export class UserService {
  constructor(
    @Inject(constants.USERS_REPOSITORY)
    private usersRepository: typeof User) { }

      async create(createUserDto: CreateUserDto): Promise<User>  {
        // Проверяем, существует ли пользователь
        let user = await this.usersRepository.findOne({ where: { telegram_id: createUserDto.telegram_id } });
    
        // Если пользователь существует, возвращаем его
        if (user) return user;
    
        // Если нет, создаем нового пользователя
        user = await this.usersRepository.create(createUserDto);
        return user;
      }

  async findAllUserConnections(id: number): Promise<Connection[]> {
    const user = await this.usersRepository.findOne({ where: { id }, include: { model: Connection } });
    return user.connectionStrings;
  }

      async findAll() {
        return await this.usersRepository.findAll({ include: {model: Connection}});
      }
    
      async findOne(telegram_id: string) {
        return await this.usersRepository.findOne({where: {telegram_id}});
      }
    
      async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.update(updateUserDto, { where: { id } });
        return user;
      }
    
      async remove(id: number) {
        const user = await this.usersRepository.destroy({ where: { id } });
        return user;
      }


}
