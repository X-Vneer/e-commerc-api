import express from "express"

import auth from "@/api/dashboard/auth/index.js"
import categories from "@/api/dashboard/categories/index.js"
import { authMiddleware } from "@/api/dashboard/middlewares/auth.js"
import products from "@/api/dashboard/products/index.js"
import upload from "@/api/dashboard/upload/index.js"

const router = express.Router()

router.use("/auth", auth)
router.use(authMiddleware)

router.use("/upload", upload)

router.use("/categories", categories)
router.use("/products", products)
// test

export default router
