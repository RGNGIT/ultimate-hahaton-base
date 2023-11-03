import { Injectable } from "@nestjs/common";
import { exec } from "child_process";

@Injectable()
export class MonitoringService {
  async getPostgreCredsByTgId(tgId): Promise<string> {
    // Тоже хуйня
    return "animefeet.servebeer.com;5432;postgres;12345678";
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

  async getFullMetricsReport(host, port, username, password): Promise<{} | string> {
    return new Promise((resolve, reject) => {
      exec(`pgmetrics --host=${host} --port=${port} --username=${username} --format=json`, { env: { 'PGPASSWORD': password } }, (err, stdout, stderr) => {
        resolve(JSON.parse(stdout));
        reject(stderr);
        reject(err);
      });
    });
  }
}