import { Injectable, Inject } from '@nestjs/common';
import UpdateUserDto from './dto/update-user.dto';
import CreateUserDto from './dto/create-user.dto';
import constants from 'src/common/constants';
import { User } from './entities/user.entity';


@Injectable()
export class UserService {
  constructor(
    @Inject(constants.USERS_REPOSITORY)
    private usersRepository: typeof User){}

      create(createUserDto: CreateUserDto) {
        return 'This action adds a new connection';
      }
    
      findAll() {
        return `This action returns all connections`;
      }
    
      findOne(id: number) {
        return `This action returns a #${id} connection`;
      }
    
      update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} connection`;
      }
    
      remove(id: number) {
        return `This action removes a #${id} connection`;
      }


}
