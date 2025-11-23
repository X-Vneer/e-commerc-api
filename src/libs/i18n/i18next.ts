import i18next from "i18next"
import Backend from "i18next-fs-backend"
import { handle, LanguageDetector } from "i18next-http-middleware"
import path from "node:path"

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "ar"],
    ns: ["translations", "errors"], // namespaces
    defaultNS: "translations",
    backend: {
      loadPath: path.join(__dirname, "../../locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      // detect language from headers (Accept-Language)
      order: ["header"],
      lookupHeader: "accept-language",
    },
    interpolation: { escapeValue: false },
  })

export const t = i18next.t
export default handle(i18next)
