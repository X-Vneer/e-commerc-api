import { z } from "zod"

export const loginSchema = z.object({
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export const registerSchema = z.object({
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  name: z.string().min(1, { message: "Name must be at least 1 character long" }),
  email: z.email({ message: "Invalid email address" }),
  region_id: z.string().min(1, { message: "Region is required" }),
  address: z.string().min(1, { message: "Address is required" }),

})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
