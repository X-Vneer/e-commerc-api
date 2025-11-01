import { z } from "zod/v4"

// Base schema keeps DATABASE_URL and JWT_SECRET optional so that tests can run without them.
const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
})

// eslint-disable-next-line node/no-process-env
const parsed = baseSchema.safeParse(process.env)

if (!parsed.success) {
  // Validation of base keys failed (unlikely). Do not exit in tests.
  const issues = parsed.error.issues.flatMap((issue) => issue.path)
  // eslint-disable-next-line node/no-process-env
  if (process.env.NODE_ENV !== "test") {
    console.error("Missing environment variables:", issues)
    process.exit(1)
  }
}

const envUnsafe = parsed.success
  ? parsed.data
  // eslint-disable-next-line node/no-process-env
  : (process.env as unknown as z.infer<typeof baseSchema>)

// In non-test environments, enforce required secrets and database URL.
if (envUnsafe.NODE_ENV !== "test") {
  const prodSchema = baseSchema.extend({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
  })
  const strict = prodSchema.safeParse(envUnsafe)
  if (!strict.success) {
    console.error(
      "Missing environment variables:",
      strict.error.issues.flatMap((issue) => issue.path)
    )
    process.exit(1)
  }
}

// Export with helpful defaults in test env
export const env = {
  NODE_ENV: envUnsafe.NODE_ENV,
  PORT: envUnsafe.PORT,
  DATABASE_URL: envUnsafe.DATABASE_URL ?? "file:./dev.db",
  JWT_SECRET: envUnsafe.JWT_SECRET ?? "test-secret",
}
