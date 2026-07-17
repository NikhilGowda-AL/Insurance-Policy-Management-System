import winston from 'winston';
import { isProduction } from './env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${ts}] ${level}: ${message}${metaString}`;
  })
);

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: isProduction ? combine(timestamp(), errors({ stack: true }), json()) : devFormat,
  transports: [new winston.transports.Console()],
  silent: process.env.NODE_ENV === 'test'
});
