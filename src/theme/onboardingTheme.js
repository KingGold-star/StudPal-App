// src/theme/onboardingTheme.js
// Shared theme utilities and colors for all Onboarding screens

export const getOnboardingTheme = (isDark) => {
  if (isDark) {
    return {
      isDark: true,
      bg: '#0B0F19',
      bgAlt: '#070A12',
      surface: '#0F172A',
      card: '#1E293B',
      cardSelected: 'rgba(45, 98, 255, 0.22)',
      cardSelectedBorder: '#3B82F6',
      border: '#334155',
      borderSubtle: '#1E293B',
      borderHighlight: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      inputBg: '#1E293B',
      inputBorder: '#334155',
      inputText: '#F8FAFC',
      inputPlaceholder: '#64748B',
      accent: '#3B82F6',
      accentDark: '#2563EB',
      accentLight: 'rgba(59, 130, 246, 0.18)',
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
    statusDot: '#10B981',
    barStyle: 'dark-content',
  };
};
