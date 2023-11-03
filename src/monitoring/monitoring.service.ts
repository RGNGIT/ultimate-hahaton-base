import { Injectable } from "@nestjs/common";
import { exec } from "child_process";

@Injectable()
export class MonitoringService {
  async getPostgreCredsByTgId(tgId): Promise<string> {
    return "animefeet.servebeer.com;5432;postgres;12345678";
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