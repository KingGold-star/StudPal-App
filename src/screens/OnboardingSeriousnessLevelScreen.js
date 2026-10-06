import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const SERIOUSNESS_OPTIONS = [
  { id: 'exploring', label: "I'm just exploring" },
  { id: 'consistent', label: "I'd like to become more consistent" },
  { id: 'priority', label: "I'm ready to make studying a priority" },
  { id: 'committed', label: "I'm fully committed" },
];

export default function OnboardingSeriousnessLevelScreen({
  onContinue,
  onBack,
  initialSelection = 'priority',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [selectedId, setSelectedId] = useState(initialSelection);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fadeAnim]);

  const handleSelect = (id) => {
    if (isTransitioning) return;
    setSelectedId(id);
    setIsTransitioning(true);

    timerRef.current = setTimeout(() => {
      if (onContinue) {
        onContinue(id);
      }
    }, 220);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    if (onContinue) {
      onContinue(selectedId || 'priority');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Top Section */}
          <View style={styles.topSection}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              how seriously do{'\n'}you want to work{'\n'}toward this goal?
            </Text>

            {/* Options List */}
            <View style={styles.optionsList}>
              {SERIOUSNESS_OPTIONS.map((opt) => {
                const isSelected = selectedId === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? theme.cardSelected : theme.card,
                        borderColor: isSelected ? theme.cardSelected : theme.border,
                      },
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => handleSelect(opt.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        {
                          borderColor: isSelected ? '#FFFFFF' : theme.border,
                          backgroundColor: isSelected ? '#FFFFFF' : (isDark ? '#0B0F19' : '#FFFFFF'),
                        },
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <View style={[styles.radioInnerDot, { backgroundColor: theme.accent }]} />}
                    </View>

                    <Text
                      style={[
                        styles.optionLabel,
                        { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bottom Footer Button */}
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={[styles.footerButtonText, { color: theme.textPrimary }]}>tap to continue ➔</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: 10,
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    fontSize: 29,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 38,
    textAlign: 'center',
    letterSpacing: -0.7,
    marginBottom: 44,
  },
  optionsList: {
    width: '100%',
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 15,
    paddingHorizontal: 18,
    width: '100%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionCardSelected: {
    backgroundColor: '#1200C6',
    borderColor: '#1200C6',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  radioCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.6,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioCircleSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  radioInnerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1200C6',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.2,
    flex: 1,
  },
  optionLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footerButton: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  footerButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
});
