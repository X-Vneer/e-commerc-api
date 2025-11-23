import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

import { env } from "@/env.js"
import { PrismaClient } from "@/generated/client.js"

const adapter = new PrismaMariaDb({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  connectionLimit: 5,
})
const prismaClient = new PrismaClient({ adapter })

export default prismaClient
