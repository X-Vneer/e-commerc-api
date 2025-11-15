import type { NextFunction, Request, Response } from "express"

import type ErrorResponse from "@/interfaces/error-response.js"

import { env } from "@/env.js"

/**
 * Type guard to check if error is a Prisma known request error
 */
function isPrismaKnownRequestError(error: unknown): error is { code: string; meta?: { target?: string[] } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("P")
  )
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  // Handle Prisma known request errors
  if (isPrismaKnownRequestError(err)) {
    let statusCode = 500
    let message = "Internal server error"

    const t = (req as { t?: (key: string, opts?: { ns?: string }) => string }).t

    switch (err.code) {
      case "P2002": {
        // Unique constraint violation
        statusCode = 409
        message = t ? t("conflict", { ns: "errors" }) : "Conflict"
        break
      }
      case "P2025": {
        // Record not found
        statusCode = 404
        // Try to determine the resource type from the error or context
        // For now, use generic "not_found", but we could enhance this
        message = t ? t("not_found", { ns: "errors" }) : "Not found"
        break
      }
      case "P2003": {
        // Foreign key constraint violation
        statusCode = 400
        message = t ? t("bad_request", { ns: "errors" }) : "Bad request"
        break
      }
      case "P2014": {
        // Required relation violation
        statusCode = 400
        message = t ? t("bad_request", { ns: "errors" }) : "Bad request"
        break
      }
      default: {
        statusCode = 500
        message = t ? t("internal_server_error", { ns: "errors" }) : "Internal server error"
      }
    }

    res.status(statusCode).json({
      message,
      ...(env.NODE_ENV !== "production" && {
        stack: err instanceof Error ? err.stack : undefined,
      }),
    })
    return
  }

  // Handle other errors
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  const errorMessage = err instanceof Error ? err.message : "Internal server error"
  const errorStack = err instanceof Error ? err.stack : undefined

  res.status(statusCode)
  res.json({
    message: errorMessage,
    stack: env.NODE_ENV === "production" ? "🥞" : errorStack,
  })
}
