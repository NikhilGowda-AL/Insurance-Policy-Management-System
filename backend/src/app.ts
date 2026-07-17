import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';
import { isProduction } from './config/env';
import { logger } from './config/logger';

const app: Application = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiRateLimiter);

if (!isProduction) {
  app.use(morgan('dev', { stream: { write: (message) => logger.debug(message.trim()) } }));
}

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
