import { HttpException, Inject, Injectable } from "@nestjs/common";
import { exec } from "child_process";
import constants from "src/common/constants";
import { Connection } from "src/connections/entities/connection.entity";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class MonitoringService {
  constructor(
    @Inject(constants.USERS_REPOSITORY)
    private usersRepository: typeof User) { }

  async collectDatabaseShortInfos(credStrings) {
    const dbInfos = [];

    for (const credString of credStrings) {
      const { host, port, username, password } = this.splitCreds(credString.connectionString);
      const shortDbsInfo = await this.getDatabasesReport(host, port, username, password);
      const dbInfo = {host, databases: shortDbsInfo};
      dbInfos.push(dbInfo);
    }

    return dbInfos;
  }

  async collectDatabaseFullInfos(credStrings) {
    const dbInfos = [];

    for (const credString of credStrings) {
      const { host, port, username, password } = this.splitCreds(credString.connectionString);
      const fullDbsInfo = await this.getFullMetricsReport(host, port, username, password);
      const dbInfo = {host, info: fullDbsInfo};
      dbInfos.push(dbInfo);
    }

    return dbInfos;
  }

  async getPostgreCredsByTgId(tgId): Promise<{id, connectionString}[]> {
    try {
      const user = await this.findUserByTgId(tgId);
      return user.connectionStrings.map(cs => ({id: cs.id, connectionString: cs.connectionString}));
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
    // Хуйня
    return fullMetricsReport['databases'].map(u => ({ state: "active", ...u }));
  }

  async findUserByTgId(tgId) {
    const user = await this.usersRepository.findOne({ where: [{ telegram_id: tgId }], include: [{ model: Connection }] });
    return user;
  }

  async getFullMetricsReport(host, port, username, password): Promise<{} | string> {
    return new Promise((resolve, reject) => {
      exec(`pgmetrics --host=${host} --port=${port} --username=${username} --format=json`, { env: { 'PGPASSWORD': password } }, (err, stdout, stderr) => {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch(e) {
          reject(e);
        }
        reject(stderr);
        reject(err);
      });
    });
  }
}