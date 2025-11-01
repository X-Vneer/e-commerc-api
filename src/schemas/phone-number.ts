import { isValidPhoneNumber, parsePhoneNumberWithError } from "libphonenumber-js"
import { z } from "zod"

export const phoneNumberSchema = z
  .string()
  .refine(
    (value) => {
      return isValidPhoneNumber(value)
    },
    { message: "phone_number_invalid" }
  )
  .transform((value) => {
    return parsePhoneNumberWithError(value).number
  })

export type PhoneNumberSchema = z.infer<typeof phoneNumberSchema>
