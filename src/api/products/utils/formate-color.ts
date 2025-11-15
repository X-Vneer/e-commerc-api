import type { Prisma } from "@prisma/client"

type ColorWithProduct = Prisma.ColorGetPayload<{
  include: {
    product: {
      include: {
        categories: true
      }
    }
    sizes: {
      include: {
        inventories: {
          include: {
            branch: true
          }
        }
      }
    }
    favorite_by?: {
      select: {
        id: true
      }
    }
  }
}>

type FormattedColorData = {
  id: number
  slug: string
  name: string
  description: string
  main_image_url: string
  price: number
  discount_price?: number
  discount_percentage?: number
  code: string
  product_id: number
  product_name: string
  color_name: string
  is_favorite?: boolean
  categories: Array<{
    id: number
    name_en: string
    name_ar: string
    slug: string
  }>
  sizes: Array<{
    id: number
    code: string
    hip: number
    chest: number
    quantity: number
    inventories: Array<{
      id: number
      branch_id: number
      branch_name: string
      available_quantity: number
    }>
  }>
}

/**
 * Formats color data with product information
 * @param color - Color object with product included
 * @param language - Language code ("ar" or "en")
 * @returns Formatted color data with product information
 */
export function formatColorWithProduct(color: ColorWithProduct, language: "ar" | "en") {
  const name = language === "ar" ? "name_ar" : "name_en"
  const favorite_by = "favorite_by" in color ? color.favorite_by : undefined

  const data: FormattedColorData = {
    id: color.id,
    product_id: color.product.id,
    slug: color.product.slug,
    code: color.product.code,
    name: `${color.product[name]} - ${color[name]}`,
    description: color.product.description_en,
    product_name: color.product[name],
    color_name: color[name],
    main_image_url: color.product.main_image_url,
    price: color.product.price,
    ...(favorite_by !== undefined && {
      is_favorite: Array.isArray(favorite_by) ? favorite_by.length > 0 : false,
    }),
    sizes: color.sizes.map((size) => ({
      id: size.id,
      code: size.size_code,
      hip: size.hip,
      chest: size.chest,
      quantity:
        size.inventories.reduce((acc, inventory) => acc + inventory.amount, 0) -
        size.inventories.reduce((acc, inventory) => acc + inventory.sold, 0),
      inventories: size.inventories.map((inventory) => ({
        id: inventory.id,
        branch_id: inventory.branch_id,
        branch_name: inventory.branch[name],
        available_quantity: inventory.amount - inventory.sold,
      })),
    })),
    categories: color.product.categories,
  }

  return data
}
