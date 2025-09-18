import dotenv from 'dotenv';
dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

export const config = {
  env: process.env.NODE_ENV || 'development',
  isDev,
  port: process.env.PORT || (isDev ? 3000 : 8080),
  host: process.env.HOST || (isDev ? '127.0.0.1' : '0.0.0.0'),
  logger: isDev,
};