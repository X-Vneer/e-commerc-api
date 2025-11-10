import express from "express"

import { getProductsHandler } from "./handlers/index.js"

const router = express.Router()

router.get("/", getProductsHandler)

export default router
