import express from "express"
import validate from "express-zod-safe"

import { loginHandler, registerHandler } from "./handlers/index.js"
import { loginSchema, registerSchema } from "./schemas/index.js"

const router = express.Router()

router.post("/login", validate({ body: loginSchema }), loginHandler)

router.post("/register", validate({ body: registerSchema }), registerHandler)

export default router
