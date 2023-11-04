// ssh.service.ts
import { Injectable } from '@nestjs/common';
import { Client } from 'ssh2';

@Injectable()
export class SshService {
  private sshClient = new Client();

  connectAndExecute(host: string, username: string, password: string, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.sshClient.on('ready', () => {
        console.log('SSH Client Ready');
        this.sshClient.exec(command, (err, stream) => {
          if (err) return reject(err);

          let data = '';
          stream.on('close', (code, signal) => {
            console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
            this.sshClient.end();
            resolve(data);
          }).on('data', (chunk) => {
            data += chunk.toString();
          }).stderr.on('data', (chunk) => {
            reject(`STDERR: ${chunk}`);
          });
        });
      })
      .on('error', (err) => {
        reject(`Connection Error: ${err}`);
      })
      .connect({
        host: host,
        port: 22,
        username: username,
        //privateKey: require('fs').readFileSync(privateKeyPath)
        // Для пароля вместо ключа:
        password: password
      });
    });
  }
}
