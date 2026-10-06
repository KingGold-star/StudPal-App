import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Animated,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Polygon } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// Custom Crisp Vector Icons for each goal category
function CapIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <Path d="M6 12v5c3 3 9 3 12 0v-5" />
    </Svg>
  );
}

function UniversityIcon({ size = 22, color = '#7C3AED' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 10l10-6 10 6v2H2z" />
      <Path d="M4 12v7M9 12v7M15 12v7M20 12v7M2 19h20v2H2z" />
    </Svg>
  );
}

function ChartIcon({ size = 22, color = '#059669' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 20V10M12 20V4M6 20v-6" />
    </Svg>
  );
}

function BookIcon({ size = 22, color = '#E11D48' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Svg>
  );
}

function TargetIcon({ size = 22, color = '#4F46E5' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Circle cx="12" cy="12" r="6" />
      <Circle cx="12" cy="12" r="2" />
    </Svg>
  );
}

function BulbIcon({ size = 22, color = '#D97706' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18h6M10 22h4" />
      <Path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </Svg>
  );
}

const GOALS = [
  { id: 'exam', label: 'Pass upcoming\nexams', icon: CapIcon, bg: '#EFF6FF', color: '#2563EB' },
  { id: 'grades', label: 'Improve my\ngrades', icon: ChartIcon, bg: '#ECFDF5', color: '#059669' },
  { id: 'college', label: 'Prepare for\nuniversity', icon: UniversityIcon, bg: '#F5F3FF', color: '#7C3AED' },
  { id: 'learn', label: 'Learn a new\nsubject', icon: BookIcon, bg: '#FFF1F2', color: '#E11D48' },
  { id: 'habits', label: 'Build daily\nstudy habits', icon: TargetIcon, bg: '#EEF2FF', color: '#4F46E5' },
  { id: 'other', label: 'Other', icon: BulbIcon, bg: '#FEF3C7', color: '#D97706' },
];

export default function OnboardingGoalScreen({ onContinue }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedGoal, setSelectedGoal] = useState('grades');
  const [otherText, setOtherText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const otherInputRef = useRef(null);

  const isReady =
    (selectedGoal !== null && selectedGoal !== 'other') ||
    (selectedGoal === 'other' && otherText.trim().length > 0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 550,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (selectedGoal === 'other') {
      const timer = setTimeout(() => {
        otherInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedGoal]);

  const handleNext = () => {
    if (!isReady) return;
    const matchedGoal = GOALS.find((g) => g.id === selectedGoal);
    const goalData = {
      id: selectedGoal,
      selectedGoal,
      label: selectedGoal === 'other' ? (otherText.trim() || 'Other') : matchedGoal?.label?.replace('\n', ' ') || selectedGoal,
      title: selectedGoal === 'other' ? (otherText.trim() || 'Other') : matchedGoal?.label?.replace('\n', ' ') || selectedGoal,
      customGoal: selectedGoal === 'other' ? otherText.trim() : null,
    };
    onContinue(goalData);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.animatedWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [18, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Question Header */}
              <Text style={[styles.title, { color: theme.textPrimary }]}>what are you walking towards?</Text>

              {/* 2x3 Grid of Goal Cards */}
              <View style={styles.grid}>
                {GOALS.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  const IconComp = goal.icon;
                  return (
                    <TouchableOpacity
                      key={goal.id}
                      style={[
                        styles.goalCard,
                        {
                          backgroundColor: isSelected ? theme.cardSelected : theme.card,
                          borderColor: isSelected ? theme.cardSelectedBorder : theme.border,
                        },
                      ]}
                      onPress={() => setSelectedGoal(goal.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : goal.bg }]}>
                        <IconComp size={20} color={goal.color} />
                      </View>

                      <View style={styles.labelWrapper}>
                        <Text style={[styles.goalLabel, { color: theme.textPrimary }]} numberOfLines={2}>
                          {goal.label}
                        </Text>
                      </View>

                      <View style={styles.radioOuter}>
                        {isSelected ? (
                          <View style={[styles.radioFilled, { backgroundColor: theme.cardSelectedBorder }]} />
                        ) : (
                          <View style={[styles.radioEmpty, { borderColor: theme.border }]} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom Input Field - Shows ONLY when "Other" is selected */}
              {selectedGoal === 'other' && (
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={otherInputRef}
                    style={[
                      styles.otherInput,
                      {
                        backgroundColor: theme.inputBg,
                        borderColor: theme.inputBorder,
                        borderWidth: 1.5,
                        color: theme.inputText,
                      },
                    ]}
                    placeholder="type your goal here..."
                    placeholderTextColor={theme.inputPlaceholder}
                    value={otherText}
                    onChangeText={setOtherText}
                    returnKeyType="done"
                    onSubmitEditing={handleNext}
                    autoCapitalize="sentences"
                    selectionColor={theme.accent}
                    cursorColor={theme.accent}
                  />
                </View>
              )}
            </Animated.View>
          </ScrollView>

          {/* Bottom Action Button - Fully colored when ready */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                isReady ? styles.nextButtonActive : styles.nextButtonInactive,
              ]}
              onPress={isReady ? handleNext : null}
              disabled={!isReady}
              activeOpacity={isReady ? 0.85 : 1}
            >
              <Text style={[styles.nextButtonText, isReady && styles.nextButtonTextActive]}>
                next ➔
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  animatedWrapper: {
    paddingTop: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalCard: {
    width: '48%',
    minHeight: 64,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  goalCardSelected: {
    borderColor: '#1200C6',
    backgroundColor: '#F5F3FF',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  labelWrapper: {
    flex: 1,
    paddingRight: 4,
  },
  goalLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 14,
  },
  radioOuter: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioEmpty: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  radioFilled: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1200C6',
  },
  inputContainer: {
    marginTop: 18,
  },
  otherInput: {
    height: 52,
    backgroundColor: '#EEEEEE',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  footerContainer: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  nextButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonInactive: {
    backgroundColor: '#C4C2EE',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonActive: {
    backgroundColor: '#1200C6',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.2,
  },
  nextButtonTextActive: {
    color: '#FFFFFF',
  },
});
