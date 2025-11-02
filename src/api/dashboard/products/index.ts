import express from "express"
import validate from "express-zod-safe"

import { paginationParamsSchema } from "../../../schemas/pagination-params.js"
import { createProductHandler, getProductsHandler } from "./handlers/index.js"
import { createProductSchema } from "./schemas/index.js"

const router = express.Router()

router.get("/", validate({ query: paginationParamsSchema }), getProductsHandler)

router.post("/", validate({ body: createProductSchema }), createProductHandler)

export default router
