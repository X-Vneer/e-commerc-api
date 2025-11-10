import express from "express"
import validate from "express-zod-safe"

import { authMiddleware } from "../../middlewares/auth.js"
import {
  getMeHandler,
  loginHandler,
  registerHandler,
  updateAddressHandler,
  updateUserDataHandler,
} from "./handlers/index.js"
import { addressSchema, loginSchema, registerSchema, updateUserDataSchema } from "./schemas/index.js"

const router = express.Router()

router.post("/login", validate({ body: loginSchema }), loginHandler)

router.post("/register", validate({ body: registerSchema }), registerHandler)

router.use(authMiddleware)

router.get("/me", getMeHandler)

router.put("/address", validate({ body: addressSchema }), updateAddressHandler)

router.put("/info", validate({ body: updateUserDataSchema }), updateUserDataHandler)

export default router
