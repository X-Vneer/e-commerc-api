import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"

import { env } from "@/env.js"
import { PrismaClient } from "@/generated/client.js"

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const prismaClient = new PrismaClient({ adapter })

export default prismaClient
