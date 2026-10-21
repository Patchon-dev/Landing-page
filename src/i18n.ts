// Load bundled translations on demand; English is the default and fallback.
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./lib/locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    lng: "en",
    fallbackLng: "en",
    defaultNS: "translation",
    supportedLngs: ["en", "de", "fr", "es", "nl", "it", "pt"],
  });

export default i18next;
