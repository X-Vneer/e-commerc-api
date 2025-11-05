export function slugify(text: string): string {
  if (!text) {
    return ""
  }

  // 1. Normalize Arabic/Unicode characters
  let slug = text.normalize("NFKD")

  // 2. Convert to lowercase
  slug = slug.toLowerCase()

  // 3. Remove accents, diacritics, non-letter/number characters (except Arabic)
  slug = slug
    .replace(/[^\w\u0600-\u06FF\s-]+/g, "") // keep letters, numbers, Arabic, spaces, hyphens
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove duplicate hyphens
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens

  return slug
}
