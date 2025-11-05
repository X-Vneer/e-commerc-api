import prismaClient from "../index.js"
import { seedCategories } from "./categories.js"
import { seedEmirates } from "./emirates.js"
import { seedProducts } from "./products.js"
import { seedRegions } from "./regions.js"
import { seedSizes } from "./sizes.js"
import { seedUsers } from "./users.js"

async function main() {
  await seedEmirates()
  await seedRegions()
  await seedSizes()
  await seedCategories()
  await seedUsers()
  await seedProducts()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })
