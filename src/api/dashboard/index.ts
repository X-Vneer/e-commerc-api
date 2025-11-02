import express from "express"

import auth from "./auth/index.js"
import categories from "./categories/index.js"
import { authMiddleware } from "./middlewares/auth.js"
import products from "./products/index.js"
import upload from "./upload/index.js"

const router = express.Router()

router.use("/auth", auth)
router.use(authMiddleware)

router.use("/upload", upload)

router.use("/categories", categories)
router.use("/products", products)

export default router
