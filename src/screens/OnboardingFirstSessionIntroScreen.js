import React, { useEffect, useRef } from 'react';
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
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import aiQuizGeneratorService from '../services/aiQuizGeneratorService.js';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

function DocumentIcon({ size = 20, color = '#64748B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth="2" />
      <Path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function ClockIcon({ size = 20, color = '#64748B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function OnboardingFirstSessionIntroScreen({
  onContinue,
  onBack,
  subject = 'Mathematics',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pre-warm AI research questions in background instantly
    if (subject) {
      aiQuizGeneratorService.preloadQuestions(subject);
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim, subject]);

  const displaySubject = subject && typeof subject === 'string' && subject.trim()
    ? subject.trim()
    : 'Mathematics';

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
          {/* Header Title */}
          <View style={styles.headerSection}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              let's try your first{'\n'}section
            </Text>
          </View>

          {/* Subject Overview Card */}
          <View style={[styles.subjectCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <Text style={[styles.subjectNameText, { color: theme.textPrimary }]}>{displaySubject}</Text>

            <View style={styles.metaList}>
              <View style={styles.metaRow}>
                <DocumentIcon size={18} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>3 questions</Text>
              </View>

              <View style={styles.metaRow}>
                <ClockIcon size={18} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>~5 minutes</Text>
              </View>
            </View>
          </View>

          {/* Bottom Prompt and Action Button */}
          <View style={styles.bottomSection}>
            <Text style={[styles.readyText, { color: theme.textPrimary }]}>ready?</Text>

            <TouchableOpacity
              style={styles.startButton}
              onPress={onContinue}
              activeOpacity={0.88}
            >
              <Text style={styles.startButtonText}>start session ➔</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 10,
  },
  headerSection: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  subjectCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 22,
    marginTop: -40,
  },
  subjectNameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  metaList: {
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#334155',
    letterSpacing: -0.2,
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  readyText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  startButton: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
