var crypto = require('crypto');
var algorithm = 'aes256';
import { hashKey } from "src/config";

export function encrypt(data) {
  const cipher = crypto.createCipher(algorithm, hashKey);
  return (cipher.update(data, 'utf8', 'hex') + cipher.final('hex')) as string;
}

export function decrypt(data) {
  const decipher = crypto.createDecipher(algorithm, hashKey);
  return (decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')) as string;
}