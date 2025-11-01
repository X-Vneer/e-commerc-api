/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable ts/consistent-type-definitions */
// express.d.ts
import * as express from "express"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}
