// ssh.service.ts
import { Injectable } from '@nestjs/common';
import { Client } from 'ssh2';

@Injectable()
export class SshService {
  private sshClient = new Client();

  private async checkOS(host: string, username: string, privateKeyPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.sshClient.on('ready', () => {
        this.sshClient.exec('uname -s', (err, stream) => {
          if (err) {
            // Пробуем определить Windows, если uname не доступен
            this.sshClient.exec('ver', (err, stream) => {
              if (err) return reject(err);
              stream.on('data', (data) => resolve('Windows')).stderr.on('data', (data) => reject(data));
            });
          } else {
            stream.on('data', (data) => resolve(data.toString().trim())).stderr.on('data', (data) => reject(data));
          }
        });
      }).on('error', (err) => {
        reject(`Connection Error: ${err}`);
      }).connect({
        host: host,
        port: 22,
        username: username,
        privateKey: require('fs').readFileSync(privateKeyPath)
      });
    });
  }


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
