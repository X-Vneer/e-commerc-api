export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = Array<JsonValue>
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray | Date

/**
 * Recursively removes any object keys that end with the provided suffix(es).
 * - Works with nested objects and arrays.
 * - Returns a new structure without mutating the input.
 * @param value - The object/array to process
 * @param suffix - A string or array of strings to match against key endings (default: ["_ar", "_en"])
 */
export function removeKeysWithSuffix<T extends JsonValue>(
  value: T,
  suffix: string | string[] = ["_ar", "_en"]
): T {
  if (value === null) return value

  const suffixes = Array.isArray(suffix) ? suffix : [suffix]
  const matchesSuffix = (key: string): boolean => suffixes.some((s) => key.endsWith(s))

  if (value instanceof Date) return value

  if (Array.isArray(value)) {
    const cleaned = (value as JsonArray).map((item) =>
      removeKeysWithSuffix(item as JsonValue, suffixes)
    ) as JsonArray
    return cleaned as T
  }

  if (typeof value === "object") {
    const inputObj = value as JsonObject
    const result: JsonObject = {}
    for (const [key, val] of Object.entries(inputObj)) {
      if (matchesSuffix(key)) continue
      result[key] = removeKeysWithSuffix(val as JsonValue, suffixes)
    }
    return result as T
  }

  return value
}

/**
 * Recursively renames keys that end with the provided suffix(es) by removing the suffix.
 * Example: { name_ar: "X" } -> { name: "X" }
 * - Does not overwrite an existing base key; if a collision occurs, keeps the existing base key.
 */
export function unsuffixKeys<T extends JsonValue>(
  value: T,
  suffix: string | string[] = ["_ar", "_en"]
): T {
  if (value === null) return value

  const suffixes = Array.isArray(suffix) ? suffix : [suffix]
  const getBaseKey = (key: string): string | null => {
    for (const s of suffixes) {
      if (key.endsWith(s)) return key.slice(0, -s.length)
    }
    return null
  }

  if (value instanceof Date) return value

  if (Array.isArray(value)) {
    const cleaned = (value as JsonArray).map((item) =>
      unsuffixKeys(item as JsonValue, suffixes)
    ) as JsonArray
    return cleaned as T
  }

  if (typeof value === "object") {
    const inputObj = value as JsonObject
    const result: JsonObject = {}
    for (const [key, val] of Object.entries(inputObj)) {
      const processed = unsuffixKeys(val as JsonValue, suffixes)
      const base = getBaseKey(key)
      if (base) {
        if (!(base in result)) result[base] = processed
        // if base already exists, keep existing base value and drop suffixed one
      } else {
        result[key] = processed
      }
    }
    return result as T
  }

  return value
}

export function stripArabicKeys<T extends JsonValue>(value: T): T {
  return removeKeysWithSuffix(value, "_ar")
}

export function stripLangKeys<T extends JsonValue>(value: T): T {
  return removeKeysWithSuffix(value, ["_ar", "_en"])
}

export default unsuffixKeys
