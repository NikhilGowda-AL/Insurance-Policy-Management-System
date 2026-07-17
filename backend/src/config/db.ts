import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error', { error });
});
