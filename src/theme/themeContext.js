// src/theme/themeContext.js

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { settingsService } from '../services/settings/settingsService';
import { themeService, hexToRgba } from './themeService';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // System color scheme from React Native
  const systemColorScheme = useColorScheme() || Appearance.getColorScheme() || 'light';
  const [appSettings, setAppSettings] = useState(() => settingsService.getSettingsSync());
  const [accentColor, setAccentColor] = useState(() => themeService.getAccentColor());
  const [systemScheme, setSystemScheme] = useState(systemColorScheme);

  // Listen to system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setSystemScheme(colorScheme);
      }
    });
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  // Subscribe to settingsService updates
  useEffect(() => {
    const unsubSettings = settingsService.subscribe((newSettings) => {
      setAppSettings(newSettings);
      if (newSettings?.accentColor && newSettings.accentColor !== accentColor) {
        setAccentColor(newSettings.accentColor);
      }
    });

    const unsubTheme = themeService.subscribe((color) => {
      setAccentColor(color);
    });

    return () => {
      unsubSettings();
      unsubTheme();
    };
  }, [accentColor]);

  // Determine effective theme mode and isDark
  const themePreference = appSettings?.theme || 'system'; // 'light' | 'dark' | 'system'

  const isDark = useMemo(() => {
    if (themePreference === 'dark') return true;
    if (themePreference === 'light') return false;
    return systemScheme === 'dark';
  }, [themePreference, systemScheme]);

  const activeAccent = accentColor || appSettings?.accentColor || '#6236FF';

  // Semantic color tokens dynamically computed based on isDark and accentColor
  const colors = useMemo(() => {
    if (isDark) {
      return {
        isDark: true,
        theme: themePreference,
        accent: activeAccent,
        accentLight: hexToRgba(activeAccent, 0.18),
        accentMedium: hexToRgba(activeAccent, 0.28),
        accentBorder: hexToRgba(activeAccent, 0.4),

        // Backgrounds
        background: '#0B0F19',
        backgroundAlt: '#070A12',
        surface: '#0F172A',
        card: '#1E293B',
        cardSecondary: '#0F172A',
        cardElevated: '#243247',
        headerBg: '#0B0F19',
        navBg: '#0F172A',

        // Typography
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textMuted: '#64748B',
        textInverse: '#0F172A',

        // Borders & Dividers
        border: '#334155',
        borderSubtle: '#1E293B',
        borderHighlight: 'rgba(255, 255, 255, 0.08)',
        divider: '#334155',

        // Charts & Metrics
        chartTrack: '#1E293B',
        chartGrid: 'rgba(255, 255, 255, 0.08)',

        // Form Inputs
        inputBg: '#1E293B',
        inputBorder: '#334155',
        inputText: '#F8FAFC',
        inputPlaceholder: '#64748B',

        // Badges & States
        success: '#10B981',
        successBg: 'rgba(16, 185, 129, 0.16)',
        successBorder: 'rgba(16, 185, 129, 0.3)',
        warning: '#F59E0B',
        warningBg: 'rgba(245, 158, 11, 0.16)',
        warningBorder: 'rgba(245, 158, 11, 0.3)',
        error: '#EF4444',
        errorBg: 'rgba(239, 68, 68, 0.16)',
        errorBorder: 'rgba(239, 68, 68, 0.3)',
        info: '#38BDF8',
        infoBg: 'rgba(56, 189, 248, 0.16)',

        // Modals & Overlays
        modalOverlay: 'rgba(0, 0, 0, 0.75)',
        modalSheet: '#0F172A',
        modalSheetHeader: '#1E293B',
      };
    }

    return {
      isDark: false,
      theme: themePreference,
      accent: activeAccent,
      accentLight: hexToRgba(activeAccent, 0.08),
      accentMedium: hexToRgba(activeAccent, 0.16),
      accentBorder: hexToRgba(activeAccent, 0.25),

      // Backgrounds
      background: '#F8FAFC',
      backgroundAlt: '#F1F5F9',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      cardSecondary: '#F8FAFC',
      cardElevated: '#FFFFFF',
      headerBg: '#F8FAFC',
      navBg: '#FFFFFF',

      // Typography
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      textMuted: '#94A3B8',
      textInverse: '#FFFFFF',

      // Borders & Dividers
      border: '#E2E8F0',
      borderSubtle: '#F1F5F9',
      divider: '#E2E8F0',

      // Form Inputs
      inputBg: '#FFFFFF',
      inputBorder: '#CBD5E1',
      inputText: '#0F172A',
      inputPlaceholder: '#94A3B8',

      // Badges & States
      success: '#10B981',
      successBg: '#ECFDF5',
      successBorder: '#A7F3D0',
      warning: '#F59E0B',
      warningBg: '#FFFBEB',
      warningBorder: '#FDE68A',
      error: '#EF4444',
      errorBg: '#FEF2F2',
      errorBorder: '#FECACA',
      info: '#0284C7',
      infoBg: '#F0F9FF',

      // Modals & Overlays
      modalOverlay: 'rgba(15, 23, 42, 0.6)',
      modalSheet: '#FFFFFF',
      modalSheetHeader: '#F8FAFC',
    };
  }, [isDark, themePreference, activeAccent]);

  const setTheme = useCallback(async (newTheme) => {
    await settingsService.updateSetting('theme', newTheme);
  }, []);

  const setAccent = useCallback(async (newAccent) => {
    await themeService.setAccentColor(newAccent);
  }, []);

  const toggleTheme = useCallback(async () => {
    const nextTheme = isDark ? 'light' : 'dark';
    await settingsService.updateSetting('theme', nextTheme);
  }, [isDark]);

  const contextValue = useMemo(() => ({
    isDark,
    theme: themePreference,
    systemScheme,
    colors,
    accentColor: activeAccent,
    setTheme,
    setAccentColor: setAccent,
    toggleTheme,
    settings: appSettings,
  }), [isDark, themePreference, systemScheme, colors, activeAccent, setTheme, setAccent, toggleTheme, appSettings]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if used outside provider
    const sys = Appearance.getColorScheme() || 'light';
    const settings = settingsService.getSettingsSync();
    const pref = settings?.theme || 'system';
    const isDark = pref === 'dark' || (pref === 'system' && sys === 'dark');
    const accent = settings?.accentColor || '#6236FF';
    return {
      isDark,
      theme: pref,
      systemScheme: sys,
      accentColor: accent,
      colors: {
        isDark,
        accent,
        background: isDark ? '#0B0F19' : '#F8FAFC',
        surface: isDark ? '#0F172A' : '#FFFFFF',
        card: isDark ? '#1E293B' : '#FFFFFF',
        cardSecondary: isDark ? '#0F172A' : '#F8FAFC',
        border: isDark ? '#334155' : '#E2E8F0',
        borderHighlight: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
        chartTrack: isDark ? '#1E293B' : '#F1F5F9',
        chartGrid: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        textPrimary: isDark ? '#F8FAFC' : '#0F172A',
        textSecondary: isDark ? '#94A3B8' : '#64748B',
        textMuted: isDark ? '#64748B' : '#94A3B8',
        inputBg: isDark ? '#1E293B' : '#FFFFFF',
        inputBorder: isDark ? '#334155' : '#CBD5E1',
        inputText: isDark ? '#F8FAFC' : '#0F172A',
        inputPlaceholder: isDark ? '#64748B' : '#94A3B8',
        headerBg: isDark ? '#0B0F19' : '#F8FAFC',
        navBg: isDark ? '#0F172A' : '#FFFFFF',
      },
      setTheme: async (t) => settingsService.updateSetting('theme', t),
      setAccentColor: async (c) => themeService.setAccentColor(c),
      toggleTheme: async () => settingsService.updateSetting('theme', isDark ? 'light' : 'dark'),
      settings,
    };
  }
  return context;
}
