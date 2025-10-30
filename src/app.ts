import cors from "cors"
import express from "express"
import { setGlobalErrorHandler } from "express-zod-safe"
import helmet from "helmet"
import morgan from "morgan"

import api from "./api/index.js"
import * as middlewares from "./middlewares.js"

const app = express()

app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use("/api/v1", api)

// global error handler for express-zod-safe
setGlobalErrorHandler((errors, req, res) => {
  const errorObject = Object.create(null)

  for (const error of errors) {
    for (const issue of error.errors.issues) {
      const pathKey = issue.path.join(".")
      errorObject[pathKey] = issue.message
    }
  }

  res.status(422).json({ message: "Validation error", errors: errorObject })
})
app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
