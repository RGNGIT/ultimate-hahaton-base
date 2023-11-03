import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import { usersProvider } from './providers/user.providers';

@Module({
  imports: [SequelizeModule],
  controllers: [UserController],
  providers: [UserService, ...usersProvider],
})
export class UserModule {}
