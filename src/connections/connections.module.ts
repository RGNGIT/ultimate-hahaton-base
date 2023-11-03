import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { connectionProvider } from './providers/connection.providers';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [SequelizeModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService, ...connectionProvider],
  exports: [ConnectionsService]
})
export class ConnectionsModule {}
