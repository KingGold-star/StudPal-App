import * as React from 'react';
import { Modal as RNModal, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/themeContext';

export default function CustomModal({ visible, children, transparent, animationType, onRequestClose, ...props }) {
  let isDark = false;
  try {
    const themeContext = useTheme();
    isDark = themeContext?.isDark;
  } catch (e) {
    // Fallback if rendered outside ThemeProvider
  }

  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (visible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [visible]);

  if (Platform.OS === 'web') {
    if (!visible) return null;
    return (
      <View style={[
        styles.webModalOverlay,
        !transparent && { backgroundColor: isDark ? '#0B0F19' : '#FFFFFF' }
      ]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onRequestClose}
        />
        {children}
      </View>
    );
  }
  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onRequestClose}
      {...props}
    >
      {children}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  webModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'none',
  }
});
