import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  cookieName: string;
  cookieMaxAgeMs: number;
  defaultAdminName: string;
  defaultAdminEmail: string;
  defaultAdminPassword: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
}

function get(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env: EnvConfig = {
  nodeEnv: get('NODE_ENV', 'development'),
  port: Number(get('PORT', '5000')),
  clientUrl: get('CLIENT_URL', 'http://localhost:3000'),
  mongoUri: get('MONGO_URI', 'mongodb://127.0.0.1:27017/insurance_policy_management'),
  jwtSecret: get('JWT_SECRET', 'dev_secret_change_me'),
  jwtExpiresIn: get('JWT_EXPIRES_IN', '15m'),
  cookieName: get('COOKIE_NAME', 'ipms_token'),
  cookieMaxAgeMs: Number(get('COOKIE_MAX_AGE_MS', '900000')),
  defaultAdminName: get('DEFAULT_ADMIN_NAME', 'Super Admin'),
  defaultAdminEmail: get('DEFAULT_ADMIN_EMAIL', 'admin@ipms.local'),
  defaultAdminPassword: get('DEFAULT_ADMIN_PASSWORD', 'Admin@12345'),
  rateLimitWindowMs: Number(get('RATE_LIMIT_WINDOW_MS', '900000')),
  rateLimitMax: Number(get('RATE_LIMIT_MAX', '300'))
};

export const isProduction = env.nodeEnv === 'production';
export const isTest = env.nodeEnv === 'test';
