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
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_MAIL_FROM_NAME,
  PORTAL_URL,
  CDN_HOST,
  CDN_PORT,
  CDN_USERNAME,
  CDN_PASSWORD,
  JWT_SECRET,
  JWT_ACCESS_TIME,
  JWT_REFRESH_TIME,
  JWT_RESET_TIME,
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

export const smtpConfig = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE === "true",
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  },
  ignoreTLS: false,
  mailfrom: SMTP_MAIL_FROM_NAME,
  user: SMTP_USERNAME
}

export const portalUrl = PORTAL_URL;

export const hashKey = API_HASH_KEY;

export const cdnConfig = {
  host: CDN_HOST,
  port: CDN_PORT,
  user: CDN_USERNAME,
  password: CDN_PASSWORD
}
export const jwtConfig ={
  jwtSecret: JWT_SECRET,
  accessTime: JWT_ACCESS_TIME,
  refreshTime: JWT_REFRESH_TIME,
  resetTime: JWT_RESET_TIME,
}

export const apiPort = PORT;