import { z } from "zod"

import { phoneNumberSchema } from "@/schemas/phone-number.js"

export const loginSchema = z.object({
  phone: phoneNumberSchema,
  password: z.string().min(8, { message: "auth.password_min" }),
})

export const registerSchema = z.object({
  phone: phoneNumberSchema,
  password: z.string().min(8, { message: "auth.password_min" }),
  name: z.string().min(1, { message: "auth.name_min" }),
  email: z.email({ message: "auth.email_invalid" }),
  region_id: z.coerce.number().min(1, { message: "auth.region_required" }),
  address: z.string().min(1, { message: "auth.address_required" }),
})

export const addressSchema = z
  .object({
    region_id: z.coerce.number().min(1, { message: "auth.region_required" }).optional(),
    address: z.string().min(1, { message: "auth.address_required" }).optional(),
  })
  .refine((data) => data.region_id !== undefined || data.address !== undefined, {
    message: "body_required",
    path: ["root"],
  })

export const updateUserDataSchema = z
  .object({
    name: z.string().min(1, { message: "auth.name_min" }).optional(),
    email: z.email({ message: "auth.email_invalid" }).optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "body_required",
    path: ["root"],
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type AddressSchema = z.infer<typeof addressSchema>
export type UpdateUserDataSchema = z.infer<typeof updateUserDataSchema>
