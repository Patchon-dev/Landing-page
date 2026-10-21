import { Fragment, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Portal } from "@skeletonlabs/skeleton-react";
import useMobile from "../hooks/useMobile";
import "./lang-picker.css";

import de from "../../assets/flags/de.svg";
import es from "../../assets/flags/es.svg";
import fr from "../../assets/flags/fr.svg";
import it from "../../assets/flags/it.svg";
import nl from "../../assets/flags/nl.svg";
import pt from "../../assets/flags/pt.svg";
import en from "../../assets/flags/uk.svg";

const flags = {
  de,
  en,
  es,
  fr,
  it,
  nl,
  pt,
};

type Language = keyof typeof flags;

const languageNames: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  nl: "Nederlands",
  pt: "Português",
};

const languageStorageKey = "i18nextLng";

function resolveLanguage(value: string | null): Language | undefined {
  const language = value?.trim().toLowerCase().split(/[-_]/)[0];
  return language && Object.hasOwn(flags, language) ?
      (language as Language)
    : undefined;
}

function preferredLanguage(): Language {
  try {
    const stored = resolveLanguage(
      window.localStorage.getItem(languageStorageKey),
    );
    if (stored) return stored;
  } catch {
    // Language selection still works when browser storage is unavailable.
  }

  return "en";
}

export default function LangPicker() {
  const { t, i18n } = useTranslation();
  const isMobile = useMobile();
  const languageInitialized = useRef(false);

  useEffect(() => {
    if (languageInitialized.current) return;
    languageInitialized.current = true;
    const language = preferredLanguage();
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [i18n]);

  function selectLanguage(value: string) {
    const language = resolveLanguage(value);
    if (!language) return;

    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Apply the selection even when it cannot be saved.
    }
    void i18n.changeLanguage(language);
  }

  const availableLocales = (
    i18n.options.supportedLngs || Object.keys(flags)
  ).filter((lng): lng is Language => lng in flags);

  const lang = (i18n.resolvedLanguage ?? i18n.language).split(
    "-",
  )[0] as Language;

  if (isMobile) {
    return (
      <label className="lang-picker-native">
        <img src={flags[lang]} alt="" className="lang-picker-flag" />
        <select
          aria-label={t("language")}
          value={lang}
          onChange={(event) => selectLanguage(event.target.value)}
        >
          {availableLocales.map((language) => (
            <option key={language} value={language}>
              {languageNames[language]}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <Menu
      positioning={{ placement: "bottom-end", gutter: 6 }}
      onSelect={({ value }) => selectLanguage(value)}
    >
      <Menu.Trigger
        aria-label={`${t("language")}: ${lang.toUpperCase()}`}
        className="lang-picker-trigger"
      >
        <img src={flags[lang]} alt="" className="lang-picker-flag" />
        <span className="uppercase">{lang}</span>
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner className="lang-picker-positioner">
          <Menu.Content className="lang-picker-menu">
            {availableLocales.map((language, index) => (
              <Fragment key={language}>
                {index > 0 && <hr className="lang-picker-divider" />}
                <Menu.OptionItem
                  value={language}
                  type="radio"
                  checked={language === lang}
                  className="lang-picker-item"
                >
                  <img
                    src={flags[language]}
                    alt=""
                    className="lang-picker-flag"
                  />
                  <Menu.ItemText className="uppercase">
                    {language}
                  </Menu.ItemText>
                </Menu.OptionItem>
              </Fragment>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu>
  );
}
