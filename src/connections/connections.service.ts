import { Injectable, Inject } from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { Connection } from './entities/connection.entity';
import constants from 'src/common/constants';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConnectionsService {
  constructor(
    @Inject(constants.CONNECTIONS_REPOSITOTY)
    private connectionsRepository: typeof Connection,
    @Inject(constants.CONNECTIONS_REPOSITOTY)
    private userRepository: typeof User
  ) { }

  async create(dto: CreateConnectionDto) {

    const connectionString = dto.host + ';' + dto.port + ';' + dto.username + ';' + dto.password;
    const user = await this.userRepository.findOne({ where: [{ telegram_id: dto.telegram_id }] });
    const newDto = { ...dto, user_id: user.id };
    const conn = await this.connectionsRepository.create({ connectionString, ...newDto });
    return conn;
  }

  async findAll() {
    const connections = await this.connectionsRepository.findAll({ include: { model: User } });
    return connections;
  }

  async findOne(id: number) {
    const connection = await this.connectionsRepository.findOne({ where: { id } });
    const { host, port, username, password } = this.splitCreds(connection);
    return {
      host,
      port,
      username,
      password,
      name: connection.name,
    };
  }


  splitCreds(credString): { host, port, username, password } {
    const splitCreds = credString.split(';');
    return { host: splitCreds[0], port: splitCreds[1], username: splitCreds[2], password: splitCreds[3] };
  }

  async update(id: number, dto: UpdateConnectionDto) {
    const connectionString = dto.host + ';' + dto.port + ';' + dto.username + ';' + dto.password;
    await this.connectionsRepository.update({ connectionString, ...dto }, { where: { id } });
    const connection = await this.connectionsRepository.findByPk(id);
    return connection;
  }

  async remove(id: number) {
    return await this.connectionsRepository.destroy({ where: { id } });
  }
}
