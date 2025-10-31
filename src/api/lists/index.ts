import express from "express"

import { getEmiratesHandler, getRegionsHandler } from "./handlers/index.js"

const router = express.Router()

router.get("/emirates", getEmiratesHandler)
router.get("/regions", getRegionsHandler)

export default router
