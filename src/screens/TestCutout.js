import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function TestSVG() {
  return (
    <View style={{ flex: 1, backgroundColor: '#e0e0e0', justifyContent: 'flex-end' }}>
      <View style={styles.navContainer}>
        {/* Notch Cutout SVG */}
        <View style={styles.notchContainer}>
          <Svg width="120" height="50" viewBox="0 0 120 50">
            <Path 
              d="M0 0 C 30 0, 30 45, 60 45 C 90 45, 90 0, 120 0 L 120 50 L 0 50 Z" 
              fill="#FFFFFF" 
            />
          </Svg>
        </View>

        {/* Center Button */}
        <View style={styles.centerButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    height: 70,
    backgroundColor: '#FFFFFF', // Wait, if the bar is white, the notch will just blend in. But the notch SVG handles the center part.
    // If the bar is white, the center part of the bar needs to be transparent!
    flexDirection: 'row',
  },
  notchContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -60,
    zIndex: 1,
  },
  centerButton: {
    position: 'absolute',
    top: -25,
    left: '50%',
    marginLeft: -29,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6236FF',
  }
});
