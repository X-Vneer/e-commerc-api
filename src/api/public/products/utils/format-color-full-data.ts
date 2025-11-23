import type { ColorFullData } from "@/prisma/products.js"

import { NOT_PLUS_SIZES } from "@/prisma/products.js"

type FormattedColorData = {
  id: number
  slug: string
  name: string
  main_image_url: string
  price: number
  code: string
  product_id: number
  product_name: string
  color_name: string
  categories: {
    id: number
    name: string
    slug: string
  }[]
  other_colors: {
    id: number
    name: string
    image_url: string
  }[]

  has_plus_size: boolean
  is_favorite: boolean
  sizes: {
    id: number
    size_code: string
    is_available: boolean
  }[]
}

/**
 * Formats color data with product information
 * @param color - Color object with product included
 * @param language - Language code ("ar" or "en")
 * @returns Formatted color data with product information
 */
export function formatColorFullData(color: ColorFullData, language: "ar" | "en") {
  const name = language === "ar" ? "name_ar" : "name_en"

  const data: FormattedColorData = {
    id: color.id,
    slug: color.product.slug,
    name: `${color.product[name]} - ${color[name]}`,
    main_image_url: color.product.main_image_url,
    price: color.product.price,
    code: color.product.code,
    product_id: color.product.id,
    product_name: color.product[name],
    color_name: color[name],
    has_plus_size: color.sizes.filter((size) => !NOT_PLUS_SIZES.includes(size.size_code)).length > 0,
    is_favorite: color.favorite_by.length > 0,
    categories: color.product.categories.map((category) => ({
      id: category.id,
      name: category[name],
      slug: category.slug,
    })),
    other_colors: color.product.colors
      .filter((c) => c.id !== color.id)
      .map((c) => ({
        id: c.id,
        name: c[name],
        image_url: c.image,
      })),
    sizes: color.sizes.map((size) => ({
      id: size.id,
      size_code: size.size_code,
      is_available: size.inventories.some((inventory) => inventory.amount > 0),
    })),
  }

  return data
}
