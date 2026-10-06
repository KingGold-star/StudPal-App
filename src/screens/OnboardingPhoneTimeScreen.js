import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const TIME_OPTIONS = [
  'Less than 2 hours',
  '2–3 hours',
  '3–4 hours',
  '4–5 hours',
  '5–6 hours',
  '6+ hours',
];

export default function OnboardingPhoneTimeScreen({ onContinue, onBack, initialValue = '4–5 hours' }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedOption, setSelectedOption] = useState(initialValue);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 550,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  const handleNext = () => {
    if (selectedOption && onContinue) {
      onContinue(selectedOption);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
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
            {/* Header Question Block */}
            <View style={styles.headerBlock}>
              <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
                how many hours a day are{'\n'}you on your phone?
              </Text>
            </View>

            {/* Options List */}
            <View style={styles.optionsList}>
              {TIME_OPTIONS.map((option) => {
                const isSelected = selectedOption === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? theme.cardSelected : theme.card,
                        borderColor: isSelected ? theme.cardSelectedBorder : theme.border,
                      },
                    ]}
                    onPress={() => setSelectedOption(option)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: isSelected ? theme.accent : theme.textPrimary },
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>

                    {/* Radio Indicator */}
                    <View
                      style={[
                        styles.radioCircle,
                        { borderColor: isSelected ? theme.accent : theme.border },
                        isSelected && { backgroundColor: theme.accent },
                      ]}
                    >
                      {isSelected && (
                        <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M20 6L9 17L4 12"
                            stroke="#FFFFFF"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Next Button */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedOption ? styles.nextButtonActive : styles.nextButtonInactive,
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
            disabled={!selectedOption}
          >
            <View style={styles.buttonContentRow}>
              <Text style={styles.nextButtonText}>next</Text>
              <Text style={styles.arrowIcon}>➔</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerBlock: {
    marginBottom: 28,
    marginTop: 8,
  },
  mainTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EAEFF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  optionCardSelected: {
    backgroundColor: '#EBEBFA',
    borderColor: '#D4D4F4',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
    letterSpacing: -0.2,
  },
  optionTextSelected: {
    color: '#1200C6',
    fontWeight: '600',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioCircleSelected: {
    backgroundColor: '#1200C6',
    borderColor: '#1200C6',
  },
  footerContainer: {
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
  },
  nextButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#1200C6',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonInactive: {
    backgroundColor: '#A59DE7',
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  arrowIcon: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
