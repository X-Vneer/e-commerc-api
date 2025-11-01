import prismaClient from "../index.js"
// import { seedCategories } from "./categories.js"
import { seedEmirates } from "./emirates.js"
import { seedRegions } from "./regions.js"
import { seedSizes } from "./sizes.js"

async function main() {
  await seedEmirates()
  await seedRegions()
  await seedSizes()
  // await seedCategories()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })
