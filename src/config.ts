import { Dialect } from "sequelize";

require('dotenv').config();

const {
  SQ_DIALECT,
  SQ_HOST,
  SQ_PORT,
  SQ_USERNAME,
  SQ_PASSWORD,
  SQ_DB,
  API_HASH_KEY,
  PORTAL_URL,
  CDN_HOST,
  CDN_PORT,
  CDN_USERNAME,
  CDN_PASSWORD,
  TELEGRAM_BOT_TOKEN,
  PORT
} = process.env;

export const botToken = TELEGRAM_BOT_TOKEN;

export const sequelizeConfig = {
  dialect: SQ_DIALECT as Dialect,
  host: SQ_HOST,
  port: Number(SQ_PORT),
  username: SQ_USERNAME,
  password: SQ_PASSWORD,
  database: SQ_DB
}

export const portalUrl = PORTAL_URL;

export const hashKey = API_HASH_KEY;

export const cdnConfig = {
  host: CDN_HOST,
  port: CDN_PORT,
  user: CDN_USERNAME,
  password: CDN_PASSWORD
}


export const apiPort = PORT;