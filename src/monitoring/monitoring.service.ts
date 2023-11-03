import { HttpException, Inject, Injectable } from "@nestjs/common";
import { exec } from "child_process";
import constants from "src/common/constants";
import { Connection } from "src/connections/entities/connection.entity";
import { Status } from "src/cronjobs/entities/status.entity";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class MonitoringService {
  constructor(
    @Inject(constants.USERS_REPOSITORY)
    private usersRepository: typeof User,
    @Inject(constants.STATUS_REPOSITORY)
    private statusRepository: typeof Status
  ) { }

  async collectDatabaseShortInfos(credStrings) {
    const dbInfos = [];

    for (const credString of credStrings) {
      const { host, port, username, password } = this.splitCreds(credString.connectionString);
      const shortDbsInfo = await this.getDatabasesReport(host, port, username, password);
      const dbInfo = { host, databases: shortDbsInfo };
      dbInfos.push(dbInfo);
    }

    return dbInfos;
  }

  async collectDatabaseFullInfos(credStrings) {
    const dbInfos = [];

    for (const credString of credStrings) {
      const { host, port, username, password } = this.splitCreds(credString.connectionString);
      const fullDbsInfo = await this.getFullMetricsReport(host, port, username, password);
      const dbInfo = { host, info: fullDbsInfo };
      dbInfos.push(dbInfo);
    }

    return dbInfos;
  }

  async getPostgreCredsByTgId(tgId): Promise<{ id, connectionString }[]> {
    try {
      const user = await this.findUserByTgId(tgId);
      return user.connectionStrings.map(cs => ({ id: cs.id, connectionString: cs.connectionString }));
    } catch {
      throw new HttpException('User seems to has no hosts', 404);
    }
  }

  splitCreds(credString): { host, port, username, password } {
    const splitCreds = credString.split(';');
    return { host: splitCreds[0], port: splitCreds[1], username: splitCreds[2], password: splitCreds[3] };
  }

  async getDatabasesReport(host, port, username, password) {
    let fullMetricsReport = await this.getFullMetricsReport(host, port, username, password);
    let tablespace = fullMetricsReport['tablespaces'].find(f => f.name == 'pg_default');
    // Хуйня
    fullMetricsReport = fullMetricsReport['databases'].map(u => ({ state: "active", tablespace, ...u }));

    for (const db of fullMetricsReport as Array<any>) {
      db.charts = await this.findChartsByOid(db.oid);
    }
    // fullMetricsReport[1].state = 'degraded';
    return fullMetricsReport as Array<any>;
  }

  async findUserByTgId(tgId) {
    const user = await this.usersRepository.findOne({ where: [{ telegram_id: tgId }], include: [{ model: Connection }] });
    return user;
  }

  findDbByOid(databases, oid) {
    for (const host of databases) {
      for (const db of host.databases) {
        if (db.oid == oid) return db;
      }
    }

    return null;
  }

  async findChartsByOid(oid) {
    const statuses = await this.statusRepository.findAll({ where: [{ oid }], order: [['date', 'ASC']] });
    let sessions: { value, date }[] = [];
    let trans_idle: { value, date }[] = [];

    for (const status of statuses) {
      sessions.push({ value: status.sessions, date: status.date });

      if (status.idle_in_transaction)
        trans_idle.push({ value: status.idle_in_transaction, date: status.date });
    }

    return { sessions, trans_idle };
  }

  async getFullMetricsReport(host, port, username, password): Promise<{} | string> {
    return new Promise((resolve, reject) => {
      exec(`pgmetrics --host=${host} --port=${port} --username=${username} --format=json`, { env: { 'PGPASSWORD': password } }, (err, stdout, stderr) => {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          reject(e);
        }
        reject(stderr);
        reject(err);
      });
    });
  }
}