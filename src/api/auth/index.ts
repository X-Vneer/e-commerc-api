import express from "express"
import validate from "express-zod-safe"

import { authMiddleware } from "../../middlewares/auth.js"
import { getMeHandler, loginHandler, registerHandler } from "./handlers/index.js"
import { loginSchema, registerSchema } from "./schemas/index.js"

const router = express.Router()

router.post("/login", validate({ body: loginSchema }), loginHandler)

router.post("/register", validate({ body: registerSchema }), registerHandler)

router.use(authMiddleware)

router.get("/me", getMeHandler)
export default router
