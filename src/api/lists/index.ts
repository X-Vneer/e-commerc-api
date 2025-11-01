import express from "express"

import { getEmiratesHandler, getRegionsHandler, getSizesHandler } from "./handlers/index.js"

const router = express.Router()

router.get("/emirates", getEmiratesHandler)
router.get("/regions", getRegionsHandler)
router.get("/sizes", getSizesHandler)

export default router
