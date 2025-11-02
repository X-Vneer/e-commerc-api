import express from "express"

import { createProductHandler, getProductsHandler } from "./handlers/index.js"

const router = express.Router()

router.get("/", getProductsHandler)

router.post("/", createProductHandler)

export default router
