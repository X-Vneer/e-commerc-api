import cors from "cors"
import express from "express"
import { setGlobalErrorHandler } from "express-zod-safe"
import helmet from "helmet"
import morgan from "morgan"

import api from "./api/index.js"
import i18next, { t } from "./libs/i18next.js"
import * as middlewares from "./middlewares/index.js"

const app = express()

app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(i18next)

app.use("/api/v1", api)

// global error handler for express-zod-safe
setGlobalErrorHandler((errors, req, res) => {
  const errorObject = Object.create(null)

  for (const error of errors) {
    for (const issue of error.errors.issues) {
      const pathKey = issue.path.join(".")
      // translate message keys from schemas using request language
      errorObject[pathKey || "root"] = t(issue.message, {
        ns: "errors",
        defaultValue: issue.message,
      })
        ? req.t(issue.message, { ns: "errors", defaultValue: issue.message })
        : issue.message
    }
  }

  const topLevelMessage = req.t("validation_error", { ns: "errors" })
  res.status(422).json({ message: topLevelMessage, errors: errorObject })
})
app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
