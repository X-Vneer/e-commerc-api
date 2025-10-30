import { z } from "zod"

export const loginSchema = z.object({
  phone: z.string().min(10, { message: "auth.phone_min" }),
  password: z.string().min(8, { message: "auth.password_min" }),
})

export const registerSchema = z.object({
  phone: z.string().min(10, { message: "auth.phone_min" }),
  password: z.string().min(8, { message: "auth.password_min" }),
  name: z.string().min(1, { message: "auth.name_min" }),
  email: z.email({ message: "auth.email_invalid" }),
  region_id: z.string().min(1, { message: "auth.region_required" }),
  address: z.string().min(1, { message: "auth.address_required" }),

})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
