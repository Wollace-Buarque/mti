import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error("❌ Invalid environment variables!")
}

export const env = _env.data