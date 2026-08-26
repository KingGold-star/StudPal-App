import * as React from 'react';
import { Modal as RNModal, View, StyleSheet, Platform } from 'react-native';

export default function CustomModal({ visible, children, transparent, animationType, onRequestClose, ...props }) {
  if (Platform.OS === 'web') {
    if (!visible) return null;
    return (
      <View style={[StyleSheet.absoluteFill, styles.webModalContainer]}>
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
  webModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
  }
});
