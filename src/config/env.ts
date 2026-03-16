import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MAX_RETRIES: z.coerce.number().default(3)
});

export const env = envSchema.parse(process.env);
