import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  FACEBOOK_PAGE_ACCESS_TOKEN: z.string().min(1),
  FACEBOOK_VERIFY_TOKEN: z.string().min(1),
  FACEBOOK_APP_SECRET: z.string().optional(),
  FACEBOOK_API_VERSION: z.string().default('v23.0'),

  LINE_CHANNEL_ACCESS_TOKEN: z.string().optional(),
  LINE_CHANNEL_SECRET: z.string().optional(),

  GOOGLE_SHEET_ID: z.string().min(1),
  GOOGLE_SHEET_NAME: z.string().default('Product'),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),

  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),

  STORE_MAP_URL: z.string().url(),
  PAYMENT_QR_URL: z.string().url(),
  SHIPPING_CUTOFF_HOUR: z.string().default('14'),
  SHIPPING_CARRIER: z.string().default('Flash Express'),

  RATE_LIMIT_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',

  facebook: {
    pageAccessToken: env.FACEBOOK_PAGE_ACCESS_TOKEN,
    verifyToken: env.FACEBOOK_VERIFY_TOKEN,
    appSecret: env.FACEBOOK_APP_SECRET,
    apiVersion: env.FACEBOOK_API_VERSION,
    graphApiUrl: `https://graph.facebook.com/${env.FACEBOOK_API_VERSION}`,
  },

  line: {
    channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: env.LINE_CHANNEL_SECRET,
  },

  googleSheets: {
    sheetId: env.GOOGLE_SHEET_ID,
    sheetName: env.GOOGLE_SHEET_NAME,
    serviceAccountEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },

  ai: {
    openaiApiKey: env.OPENAI_API_KEY,
    geminiApiKey: env.GEMINI_API_KEY,
  },

  business: {
    storeMapUrl: env.STORE_MAP_URL,
    paymentQrUrl: env.PAYMENT_QR_URL,
    shippingCutoffHour: parseInt(env.SHIPPING_CUTOFF_HOUR, 10),
    shippingCarrier: env.SHIPPING_CARRIER,
    wholesaleMinimum: {
      seafood: 10,
      pork: 5,
    },
  },

  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
} as const;

export type Config = typeof config;
