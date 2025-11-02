import express from "express"

import { createProductHandler } from "./handlers/index.js"

const router = express.Router()

router.post("/", createProductHandler)

export default router
