import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  backgroundColor,
  textColor = '#FFFFFF',
  style,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        backgroundColor ? { backgroundColor } : null,
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
    </TouchableOpacity>
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

