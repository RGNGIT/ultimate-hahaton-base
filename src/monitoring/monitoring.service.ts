import { HttpException, Inject, Injectable } from "@nestjs/common";
import { exec } from "child_process";
import constants from "src/common/constants";
import { Connection } from "src/connections/entities/connection.entity";
import { Status } from "src/cronjobs/entities/status.entity";
import { User } from "src/user/entities/user.entity";
import { Dialect, Sequelize } from "sequelize";
import { Log } from "src/cronjobs/entities/log.entity";
import { SshService } from "./ssh.service";
import { SshCommandDto } from "./commands/ssh.commands.dto";

@Injectable()
export class MonitoringService {
  constructor(
    @Inject(constants.USERS_REPOSITORY)
    private usersRepository: typeof User,
    @Inject(constants.CONNECTIONS_REPOSITOTY)
    private connectionsRepository: typeof Connection,
    @Inject(constants.STATUS_REPOSITORY)
    private statusRepository: typeof Status,
    @Inject(constants.LOG_REPOSITORY)
    private logRepository: typeof Log,
    private readonly sshService: SshService,
  ) { }

  async collectDatabaseShortInfos(credStrings) {
    const dbInfos = [];

    for (const credString of credStrings) {
      const { host, port, username, password } = this.splitCreds(credString.connectionString);
      let shortDbsInfo = await this.getDatabasesReport(host, port, username, password);
      let status = 'OK';
      let connection = { id: credString.id, name: credString.name };

      if (shortDbsInfo == 'error') {
        status = 'ERROR';
        shortDbsInfo = [];
      }

      const dbInfo = { host, status, connection, databases: shortDbsInfo, logs: await this.fetchHostLogs(host) };
      dbInfos.push(dbInfo);
    }

    return dbInfos;
  }

  async collectDatabaseFullInfos(credStrings) {
    try {
      const dbInfos = [];

      for (const credString of credStrings) {
        const { host, port, username, password } = this.splitCreds(credString.connectionString);
        const fullDbsInfo = JSON.parse(await this.getFullMetricsReport(host, port, username, password) as string);
        const dbInfo = { host, info: fullDbsInfo, logs: await this.fetchHostLogs(host) };
        dbInfos.push(dbInfo);
      }

      return dbInfos;
    } catch {
      return 'error';
    }
  }

  async getPostgreCredsByTgId(tgId): Promise<{ id, connectionString }[]> {
    try {
      const user = await this.findUserByTgId(tgId);
      return user.connectionStrings.map(cs => ({ id: cs.id, name: cs.name, connectionString: cs.connectionString }));
    } catch {
      throw new HttpException('User seems to has no hosts', 404);
    }
  }

  async getPostgreCredsByHost(tgId: string, myhost: string): Promise<string> {
    try {

      const user = await this.findUserByTgId(tgId);
      const connects = user.connectionStrings.map(cs => ({ connectionString: cs.connectionString }));

      for (let item of connects) {
        const { host } = this.splitCreds(item.connectionString);
        if (host == myhost)
          return item.connectionString;
      }

      // const conn =  await this.connectionsRepository.findOne({where: {tgId}});

    } catch {
      throw new HttpException('User seems to has no hosts', 404);
    }
  }

  splitCreds(credString): { host, port, username, password } {
    const splitCreds = credString.split(';');
    return { host: splitCreds[0], port: splitCreds[1], username: splitCreds[2], password: splitCreds[3] };
  }

  async fetchHostLogs(host) {
    const logs = await this.logRepository.findAll({ where: [{ host }], order: [['date', 'ASC']] });
    let snapLogs = [];

    let i = 0;
    for (const log of logs) {
      if (i == 20)
        break;

      snapLogs.push(log);
      i++;
    }

    return snapLogs;
  }

  async getDatabasesReport(host, port, username, password) {
    try {
      let fullMetricsReport = JSON.parse(await this.getFullMetricsReport(host, port, username, password) as string);
      let tablespace = fullMetricsReport['tablespaces'].find(f => f.name == 'pg_default');
      let backends = fullMetricsReport['backends'];
      fullMetricsReport = fullMetricsReport['databases'].map(u => ({ state: "active", tablespace, backends, ...u }));

      for (const db of fullMetricsReport as Array<any>) {
        db.charts = await this.findChartsByOid(db.oid);
      }
      // fullMetricsReport[1].state = 'degraded';
      return fullMetricsReport as Array<any>;
    } catch(e) {
      console.log(e);
      return 'error';
    }
  }

  async findUserByTgId(tgId) {
    const user = await this.usersRepository.findOne({ where: [{ telegram_id: tgId }], include: [{ model: Connection }] });
    return user;
  }

  findDbByOid(databases, oid) {
    for (const host of databases) {
      for (const db of host.databases) {
        if (db.oid == oid) {
          db.hostLogs = host.logs;
          return db;
        }
      }
    }

    return null;
  }

  async findChartsByOid(oid) {
    const statuses = await this.statusRepository.findAll({ where: [{ oid }], order: [['date', 'ASC']] });
    let sessions: { value, date }[] = [];
    let trans_idle: { value, date }[] = [];

    let i = 0;
    for (const status of statuses) {
      if (i == 20) break;
      sessions.push({ value: status.sessions, date: status.date });

      if (status.idle_in_transaction)
        trans_idle.push({ value: status.idle_in_transaction, date: status.date });

      i++;
    }

    return { sessions, trans_idle };
  }

  async getFullMetricsReport(host, port, username, password): Promise<{} | string> {
    return new Promise((resolve, reject) => {
      exec(`pgmetrics --host=${host} --port=${port} --username=${username} --format=json`, { env: { 'PGPASSWORD': password } }, (err, stdout, stderr) => {
        try {
          resolve(stdout);
        } catch (e) {
          reject(e);
        }
        reject(stderr);
        reject(err);
      });
    });
  }

  async restartPG(credStrings) {
    const splitCreds = this.splitCreds(credStrings);

    const sequelizeConfig = {
      dialect: 'postgres' as Dialect,
      host: splitCreds.host,
      port: Number(splitCreds.port),
      username: splitCreds.username,
      password: splitCreds.password,
      // database: database
    }

    const sequelize = new Sequelize(sequelizeConfig);
    const result = await sequelize.query("SELECT pg_reload_conf()");
    await sequelize.close();
    return result;
  }


  async executeCommand(host: string, port: number, username: string, password: string,  command: string) {

    const sequelizeConfig = {
      dialect: 'postgres' as Dialect,
      host,
      port,
      username,
      password,
      // database: database
    }
  
    const sequelize = new Sequelize(sequelizeConfig);
    const result = await sequelize.query(`${command}`);
    console.log(result)
    await sequelize.close();
    return result;
  }


  async executeSsh(dto: SshCommandDto){
    // const host = "194.113.233.98";
    // const username = "root";
    // const password = "6H6J6R9gL8PQ";
    // const command = "uptime";

    // {
    //   "host": "194.113.233.98",
    //   "username": "root",
    //   "password": "6H6J6R9gL8PQ",
    //   "command": "uptime"
    // }
  try {
      const output = await this.sshService.connectAndExecute(dto.host, dto.username, dto.password, dto.command);
      return { message: `Command ${dto.command} successfully executed`, output: output };
    } catch (error) {
      console.log(error);
      // Handle error appropriately
      return { message: error };
    }
  }
}


