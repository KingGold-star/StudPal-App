// src/theme/onboardingTheme.js
// Shared theme utilities and colors for all Onboarding screens

export const getOnboardingTheme = (isDark) => {
  if (isDark) {
    return {
      isDark: true,
      bg: '#080C14',
      bgAlt: '#05070D',
      surface: '#0E1422',
      card: '#121929',
      cardElevated: '#172136',
      cardSelected: 'rgba(37, 99, 235, 0.18)',
      cardSelectedBorder: '#3B82F6',
      border: 'rgba(255, 255, 255, 0.08)',
      borderSubtle: 'rgba(255, 255, 255, 0.04)',
      borderHighlight: 'rgba(255, 255, 255, 0.14)',
      textPrimary: '#FFFFFF',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      inputBg: '#111726',
      inputBorder: 'rgba(255, 255, 255, 0.10)',
      inputText: '#FFFFFF',
      inputPlaceholder: '#64748B',
      accent: '#3B82F6',
      accentDark: '#2563EB',
      accentLight: 'rgba(59, 130, 246, 0.14)',
      buttonPrimary: '#2563EB',
      buttonText: '#FFFFFF',
      iconBoxBg: 'rgba(255, 255, 255, 0.06)',
      statusDot: '#10B981',
      barStyle: 'light-content',
    };
  }

  return {
    isDark: false,
    bg: '#FFFFFF',
    bgAlt: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    cardSelected: '#EFF6FF',
    cardSelectedBorder: '#2563EB',
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    borderHighlight: 'rgba(0, 0, 0, 0.04)',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    inputBg: '#F8FAFC',
    inputBorder: '#E2E8F0',
    inputText: '#0F172A',
    inputPlaceholder: '#94A3B8',
    accent: '#2563EB',
    accentDark: '#1D4ED8',
    accentLight: '#EFF6FF',
    buttonPrimary: '#2563EB',
    buttonText: '#FFFFFF',
    iconBoxBg: '#EFF6FF',
    statusDot: '#10B981',
    barStyle: 'dark-content',
  };
};
