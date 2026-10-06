import React from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import TooltipTouchable from './TooltipTouchable';
import { Colors } from '../theme/colors';
import { useTheme } from '../theme/themeContext';

export default function PrimaryButton({
  title,
  tooltip,
  onPress,
  loading = false,
  backgroundColor,
  textColor = '#FFFFFF',
  style,
}) {
  const { isDark, accentColor } = useTheme();
  const effectiveBg = backgroundColor || accentColor || Colors.accent;

  return (
    <TooltipTouchable
      tooltip={tooltip || title}
      style={[
        styles.button,
        { backgroundColor: effectiveBg, shadowColor: effectiveBg },
        isDark && { shadowOpacity: 0.35, shadowRadius: 12 },
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.88}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      )}
    </TooltipTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

