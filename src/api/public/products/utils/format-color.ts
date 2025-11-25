import type { ColorWithProductAndPlusSizesAndFavoriteBy } from "@/prisma/products"

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
  has_plus_size: boolean
  is_favorite: boolean
  is_featured: boolean
}

/**
 * Formats color data with product information
 * @param color - Color object with product included
 * @param language - Language code ("ar" or "en")
 * @returns Formatted color data with product information
 */
export function formatColorWithProduct(color: ColorWithProductAndPlusSizesAndFavoriteBy, language: "ar" | "en") {
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
    has_plus_size: color.sizes.map((size) => size.size_code).length > 0,
    is_favorite: color.favorite_by.length > 0,
    is_featured: color.product.is_featured,
    categories: color.product.categories.map((category) => ({
      id: category.id,
      name: category[name],
      slug: category.slug,
    })),
  }

  return data
}
