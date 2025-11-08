import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email({ error: "auth.email_invalid" }),
  password: z.string().min(8, { error: "auth.password_min" }),
})

export type LoginSchema = z.infer<typeof loginSchema>
