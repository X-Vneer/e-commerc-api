import type { Request, Response } from "express"
import type { ValidatedRequest } from "express-zod-safe"

import prismaClient from "@/prisma"

import type { addToCartSchema } from "../schemas/index.js"

import { getOrCreateCart } from "../services/index.js"

export async function getCartHandler(req: Request, res: Response) {
  const userId = req.userId!
  // Use getOrCreateCart to ensure cart always exists
  await getOrCreateCart(userId)

  // Fetch cart with all related data
  const cartWithItems = await prismaClient.cart.findUnique({
    where: {
      user_id: userId,
    },
    include: {
      items: {
        where: {
          // Filter out items from inactive products
          color: {
            product: {
              is_active: true,
            },
          },
        },
        include: {
          color: {
            include: {
              product: true,
              // Include sizes to get size information
              sizes: {
                include: {
                  size: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      },
    },
  })

  res.json({
    message: req.t("cart_fetched_successfully", { ns: "translations" }),
    data: cartWithItems,
  })
}

export async function addToCartHandler(req: ValidatedRequest<{ body: typeof addToCartSchema }>, res: Response) {
  const { color_id, size_code, quantity } = req.body

  // Use transaction to ensure data consistency
  const result = await prismaClient.$transaction(async (tx) => {
    // Check if the color exists and product is active
    const color = await tx.color.findFirst({
      where: {
        id: color_id,
        product: {
          is_active: true, // Only allow adding active products
        },
      },
      include: {
        product: {
          select: {
            is_active: true,
          },
        },
        sizes: {
          where: {
            size_code,
          },
        },
      },
    })

    if (!color) {
      res.status(404).json({ message: req.t("color_not_found", { ns: "translations" }) })
      return null
    }

    if (!color.product.is_active) {
      res.status(422).json({ message: req.t("product_inactive", { ns: "translations" }) })
      return null
    }

    if (!color.sizes.length) {
      res.status(404).json({ message: req.t("size_not_found", { ns: "translations" }) })
      return null
    }

    // Calculate available inventory using database aggregation (more efficient)
    const productSizeId = color.sizes[0].id
    const inventoryAggregate = await tx.productInventory.aggregate({
      where: {
        product_size_id: productSizeId,
      },
      _sum: {
        amount: true,
      },
    })
    const availableInventory = inventoryAggregate._sum.amount ?? 0

    // Get or create cart (using transaction client)
    const cart = await getOrCreateCart(req.userId!, tx)

    // Check if item already exists in cart
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cart_id_color_id_size_code: {
          cart_id: cart.id,
          color_id,
          size_code,
        },
      },
    })

    // Calculate the new total quantity
    const currentQuantity = existingItem?.quantity ?? 0
    const newQuantity = currentQuantity + quantity

    // Validate inventory after considering existing cart quantity
    if (newQuantity > availableInventory) {
      res.status(422).json({ message: req.t("not-enough-inventory", { ns: "translations" }) })
      return null
    }

    // Upsert cart item
    const item = await tx.cartItem.upsert({
      where: {
        cart_id_color_id_size_code: {
          cart_id: cart.id,
          color_id,
          size_code,
        },
      },
      update: {
        quantity: newQuantity,
      },
      create: {
        cart_id: cart.id,
        color_id,
        size_code,
        quantity,
      },
    })

    return item
  })

  // If transaction returned null, an error was already sent
  if (!result) {
    res.status(400).json({ message: req.t("bad_request", { ns: "errors" }) })
    return
  }

  res.json({
    message: req.t("item_added_to_cart_successfully", { ns: "translations" }),
    data: result,
  })
}
