import express from "express"

import {
  getCategoriesHandler,
  getEmiratesHandler,
  getRegionsHandler,
  getSizesHandler,
} from "./handlers/index.js"

const router = express.Router()

router.get("/emirates", getEmiratesHandler)
router.get("/regions", getRegionsHandler)
router.get("/sizes", getSizesHandler)

router.get("/categories", getCategoriesHandler)
export default router
