import FtpClient from 'ftp';
import constants from 'src/common/constants';
import fs from 'fs';
import { cdnConfig } from 'src/config';

class FtpService {
  private config = cdnConfig;

  private client = new FtpClient();

  public async upload(key) {
    return new Promise((resolve, reject) => {
      this.client.on('ready', () => {
        this.client.put(`${constants.CDN_STORAGE}/${key}`, `files/hahaton/${key}`, (err) => {
          if (err) reject(err);
          resolve("OK");
          this.client.end();
        });
      });
      this.client.connect(this.config);
    });
  }

  public async read(key) {
    return new Promise((resolve, reject) => {
      this.client.on('ready', () => {
        this.client.get(`files/hahaton/${key}`, (err, stream) => {
          if (err) reject(err);
          try {
            stream.once('close', () => { this.client.end(); resolve("OK"); });
            stream.pipe(fs.createWriteStream(`${constants.CDN_STORAGE}/${key}`));
          } catch (streamErr) {
            reject(streamErr);
          }
        });
      });
      this.client.connect(this.config);
    });
  }
}

export default FtpService;