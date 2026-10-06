import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import TooltipTouchable from './TooltipTouchable';
import { useTheme } from '../theme/themeContext';
import { Colors } from '../theme/colors';

const ChevronLeftIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const LogoMarkIcon = ({ size = 24, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function Header({ onBack, showBack = false, title = 'StudPal', showDot = true }) {
  const { isDark, accentColor } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sideSlot}>
        {showBack && (
          <TooltipTouchable
            tooltip="Back"
            style={[styles.backButton, isDark && { backgroundColor: '#1E293B', borderWidth: 1.2, borderColor: 'rgba(255, 255, 255, 0.09)' }]}
            onPress={onBack}
            activeOpacity={0.75}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeftIcon size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TooltipTouchable>
        )}
      </View>

      <View style={styles.logoGroup}>
        <LogoMarkIcon size={22} color={accentColor} />
        <Text style={[styles.logoTitle, isDark && { color: '#F8FAFC' }]}>
          {title}
          {showDot && <Text style={[styles.logoDot, { color: accentColor }]}>.</Text>}
        </Text>
      </View>

      <View style={styles.sideSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 6 : 2,
    marginBottom: 4,
  },
  sideSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  logoDot: {
    color: Colors.accent,
    fontSize: 22,
  },
});

