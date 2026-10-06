// src/services/i18n/i18nService.js
import React, { useState, useEffect } from "react";
import { translations } from "./translations.js";
import { settingsService } from "../settings/settingsService.js";

export const SUPPORTED_LANGUAGES = [
  { code: "en", id: "en", name: "English (US)", nativeName: "English", flag: "🇺🇸", tag: "US" },
  { code: "es", id: "es", name: "Spanish (Español)", nativeName: "Español", flag: "🇪🇸", tag: "ES" },
  { code: "fr", id: "fr", name: "French (Français)", nativeName: "Français", flag: "🇫🇷", tag: "FR" },
  { code: "de", id: "de", name: "German (Deutsch)", nativeName: "Deutsch", flag: "🇩🇪", tag: "DE" },
  { code: "pt", id: "pt", name: "Portuguese (Português)", nativeName: "Português", flag: "🇧🇷", tag: "BR" },
  { code: "it", id: "it", name: "Italian (Italiano)", nativeName: "Italiano", flag: "🇮🇹", tag: "IT" },
  { code: "zh", id: "zh", name: "Chinese (中文)", nativeName: "简体中文", flag: "🇨🇳", tag: "CN" },
  { code: "ja", id: "ja", name: "Japanese (日本語)", nativeName: "日本語", flag: "🇯🇵", tag: "JP" },
  { code: "ko", id: "ko", name: "Korean (한국어)", nativeName: "한국어", flag: "🇰🇷", tag: "KR" },
  { code: "ar", id: "ar", name: "Arabic (العربية)", nativeName: "العربية", flag: "🇸🇦", tag: "SA", rtl: true },
  { code: "ru", id: "ru", name: "Russian (Русский)", nativeName: "Русский", flag: "🇷🇺", tag: "RU" },
  { code: "hi", id: "hi", name: "Hindi (हिन्दी)", nativeName: "हिन्दी", flag: "🇮🇳", tag: "IN" },
];

export function normalizeLanguageCode(langOrCode) {
  if (!langOrCode) return "en";
  const str = String(langOrCode).trim().toLowerCase();
  
  // 1. Exact 2-letter code match
  const byExactCode = SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === str);
  if (byExactCode) return byExactCode.code;

  // 2. Exact full display name or native name match
  const byExactName = SUPPORTED_LANGUAGES.find((l) => 
    l.name.toLowerCase() === str || 
    l.nativeName.toLowerCase() === str
  );
  if (byExactName) return byExactName.code;

  // 3. Locale tag or base name match (e.g., "fr-FR", "french", "es_ES")
  const byBaseName = SUPPORTED_LANGUAGES.find((l) => {
    const baseEnglish = l.name.split(" ")[0].toLowerCase();
    const baseNative = l.nativeName.toLowerCase();
    return (
      str.startsWith(l.code.toLowerCase() + "-") ||
      str.startsWith(l.code.toLowerCase() + "_") ||
      str.includes(baseEnglish) ||
      str.includes(baseNative) ||
      baseEnglish.includes(str) ||
      baseNative.includes(str)
    );
  });
  if (byBaseName) return byBaseName.code;

  return "en";
}

export function getLanguageInfo(langOrCode) {
  const code = normalizeLanguageCode(langOrCode);
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

class I18nService {
  constructor() {
    this.listeners = new Set();
    const initialSetting = settingsService.getSettingsSync()?.language;
    this.currentCode = normalizeLanguageCode(initialSetting);

    // Sync automatically whenever settingsService changes language
    settingsService.subscribe((settings) => {
      if (settings?.language) {
        const nextCode = normalizeLanguageCode(settings.language);
        if (nextCode !== this.currentCode) {
          this.currentCode = nextCode;
          this.notify();
        }
      }
    });
  }

  getCurrentLanguageCode() {
    return this.currentCode;
  }

  getCurrentLanguage() {
    return getLanguageInfo(this.currentCode).name;
  }

  getCurrentLanguageInfo() {
    return getLanguageInfo(this.currentCode);
  }

  isRTL() {
    return getLanguageInfo(this.currentCode).rtl === true;
  }

  setLanguage(langOrCode) {
    const info = getLanguageInfo(langOrCode);
    if (info.code !== this.currentCode) {
      this.currentCode = info.code;
      settingsService.updateSetting("language", info.name);
      this.notify();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    try {
      listener(this.currentCode);
    } catch (e) {
      console.error("i18n subscribe error:", e);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentCode);
      } catch (e) {
        console.error("i18n notify error:", e);
      }
    }
  }

  t(keyPath, paramsOrFallback) {
    if (!keyPath) return "";
    const parts = keyPath.split(".");
    
    // 1. Try active language
    let val = translations[this.currentCode];
    for (const part of parts) {
      if (val && typeof val === "object" && part in val) {
        val = val[part];
      } else {
        val = null;
        break;
      }
    }

    // 2. Fallback to English
    if (!val || typeof val !== "string") {
      let enVal = translations["en"];
      for (const part of parts) {
        if (enVal && typeof enVal === "object" && part in enVal) {
          enVal = enVal[part];
        } else {
          enVal = null;
          break;
        }
      }
      val = enVal;
    }

    // 3. Fallback to provided default string or keyPath
    if (!val || typeof val !== "string") {
      if (typeof paramsOrFallback === "string") {
        return paramsOrFallback;
      }
      return parts[parts.length - 1] || keyPath;
    }

    // 4. Interpolate params if object provided
    if (paramsOrFallback && typeof paramsOrFallback === "object") {
      return val.replace(/\{(\w+)\}/g, (_, k) => (k in paramsOrFallback ? paramsOrFallback[k] : ""));
    }

    return val;
  }
}

export const i18nService = new I18nService();

export function useTranslation() {
  const [langCode, setLangCode] = useState(() => i18nService.getCurrentLanguageCode());

  useEffect(() => {
    return i18nService.subscribe((code) => {
      setLangCode(code);
    });
  }, []);

  return {
    t: (keyPath, params) => i18nService.t(keyPath, params),
    currentLanguageCode: langCode,
    currentLanguage: getLanguageInfo(langCode).name,
    currentLanguageInfo: getLanguageInfo(langCode),
    setLanguage: (codeOrName) => i18nService.setLanguage(codeOrName),
    languages: SUPPORTED_LANGUAGES,
    isRTL: getLanguageInfo(langCode).rtl === true,
  };
}
