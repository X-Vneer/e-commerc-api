import type { Prisma } from "@prisma/client"

import prismaClient from "@/prisma"

export async function getOrCreateCart(userId: string, tx?: Prisma.TransactionClient) {
  const client = tx ?? prismaClient
  const cart = await client.cart.upsert({
    where: { user_id: userId },
    create: { user_id: userId },
    update: {},
  })

  return cart
}
