import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import { logger } from './config/logger';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
    throw reason;
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});
