import type MessageResponse from "./message-response.js"

type ErrorResponse = {
  stack?: string
  errors?: Record<string, string>
} & MessageResponse
export default ErrorResponse
