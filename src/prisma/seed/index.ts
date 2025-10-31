import prismaClient from "../index.js"
import { seedEmirates } from "./emirates.js"
import { seedRegions } from "./regions.js"

async function main() {
  await seedEmirates()
  await seedRegions()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })
