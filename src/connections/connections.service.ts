import { Injectable, Inject } from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { Connection } from './entities/connection.entity';
import constants from 'src/common/constants';

@Injectable()
export class ConnectionsService {
  constructor(
    @Inject(constants.CONNECTIONS_REPOSITOTY)
    private connectionsRepository: typeof Connection) { }

  create(createConnectionDto: CreateConnectionDto) {
    const conn = this.connectionsRepository.create(createConnectionDto);
    return conn;
  }

  // findAll() {
  //   return `This action returns all connections`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} connection`;
  // }

  // update(id: number, updateConnectionDto: UpdateConnectionDto) {
  //   return `This action updates a #${id} connection`;
  // }

  remove(id: number) {
    return this.connectionsRepository.destroy({where: {id}});
  }
}
