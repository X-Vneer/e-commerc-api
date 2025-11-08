/* eslint-disable ts/consistent-type-definitions */
import "i18next"

import type errors from "@/locales/en/errors.json"
import type translations from "@/locales/en/translations.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translations"
    resources: {
      translations: typeof translations
      errors: typeof errors
    }
  }
}
