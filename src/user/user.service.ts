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
    private usersRepository: typeof User){}

      async create(createUserDto: CreateUserDto): Promise<User>  {
        // Проверяем, существует ли пользователь
        let user = await this.usersRepository.findOne({ where: { telegram_id: createUserDto.telegram_id } });
    
        // Если пользователь существует, возвращаем его
        if (user) return user;
    
        // Если нет, создаем нового пользователя
        user = await this.usersRepository.create(createUserDto);
        return user;
      }

      async findAllUserConnections(id: number): Promise<Connection[]>{
        const user = await this.usersRepository.findOne({where: {id}, include: {model: Connection}});
        return user.connectionStrings;
      }


      findAll() {
        return `This action returns all connections`;
      }
    
      async findOne(telegram_id: string) {
        return await this.usersRepository.findOne({where: {telegram_id}});
      }
    
      update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} connection`;
      }
    
      remove(id: number) {
        return `This action removes a #${id} connection`;
      }


}
