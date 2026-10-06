// src/theme/themeService.js

import { Appearance } from "react-native";
import { settingsService } from "../services/settings/settingsService";
import { Colors } from "./colors";

const LISTENERS = new Set();
let currentAccentColor = "#6236FF"; // Default StudPal Violet

export const hexToRgba = (hex, opacity = 0.1) => {
  if (!hex) return `rgba(98, 54, 255, ${opacity})`;
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const themeService = {
  getAccentColor() {
    return currentAccentColor;
  },

  getLightTint(opacity = 0.12) {
    return hexToRgba(currentAccentColor, opacity);
  },

  isDarkMode(themePreference) {
    const pref = themePreference || settingsService.getSettingsSync()?.theme || 'system';
    if (pref === 'dark') return true;
    if (pref === 'light') return false;
    const systemScheme = Appearance.getColorScheme() || 'light';
    return systemScheme === 'dark';
  },

  getEffectiveTheme() {
    const pref = settingsService.getSettingsSync()?.theme || 'system';
    return this.isDarkMode(pref) ? 'dark' : 'light';
  },

  async init() {
    try {
      const settings = await settingsService.getSettings();
      if (settings && settings.accentColor) {
        currentAccentColor = settings.accentColor;
        Colors.accent = currentAccentColor;
        Colors.brandColor = currentAccentColor;
        Colors.link = currentAccentColor;
        Colors.accentLight = hexToRgba(currentAccentColor, 0.1);
      }
    } catch (e) {
      console.warn("Unable to load theme accent color:", e);
    }
    return currentAccentColor;
  },

  async setAccentColor(color) {
    currentAccentColor = color;
    Colors.accent = color;
    Colors.brandColor = color;
    Colors.link = color;
    Colors.accentLight = hexToRgba(color, 0.1);

    await settingsService.updateSetting("accentColor", color);

    LISTENERS.forEach((listener) => {
      try {
        listener(color);
      } catch (e) {
        console.error("Theme listener error:", e);
      }
    });
    return color;
  },

  subscribe(listener) {
    LISTENERS.add(listener);
    listener(currentAccentColor);
    return () => LISTENERS.delete(listener);
  },
};

