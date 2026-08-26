import React from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { Colors } from '../theme/colors';

const onboardingData = [
  {
    step: 1,
    image: require('../../assets/images/onboarding_hero_1.png'),
    headline1: 'Academic Excellence,',
    headline2: 'Powered by AI',
    subtitle: 'StudPal is your intelligent study environment for deep comprehension, structured revision, and subject mastery.',
    btnLabel: 'Continue',
  },
  {
    step: 2,
    image: require('../../assets/images/onboarding_hero_2.png'),
    headline1: 'Structured Learning,',
    headline2: 'Maximum Retention',
    subtitle: 'Organize coursework, track spaced repetition queues, and accelerate your academic performance.',
    btnLabel: 'Continue',
  },
  {
    step: 3,
    image: require('../../assets/images/onboarding_hero_3.png'),
    headline1: 'Precision Guidance',
    headline2: 'Tailored for You',
    subtitle: 'Get step-by-step problem breakdowns, adaptive quizzes, and instant AI tutor explanations.',
    btnLabel: 'Get Started',
  },
];

export default function OnboardingScreen({ step = 1, onNext, onBack }) {
  const current = onboardingData[step - 1] || onboardingData[0];
  const { height } = useWindowDimensions();

  // Scale hero image dynamically to take upper stage
  const heroMaxHeight = height > 750 ? 350 : 280;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Header onBack={onBack} showBack={step > 1} />

      <View style={styles.container}>
        {/* Immersive Hero Stage */}
        <View style={[styles.heroStage, { maxHeight: heroMaxHeight }]}>
          <Image
            source={current.image}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Executive Headline & Subtitle */}
        <View style={styles.contentArea}>
          <Text style={styles.headline1}>{current.headline1}</Text>
          <Text style={styles.headline2}>{current.headline2}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>
        </View>

        {/* Footer with Minimalist Step Indicators & Action Button */}
        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {[1, 2, 3].map((dot) => (
              <View
                key={dot}
                style={[
                  styles.dot,
                  step === dot ? styles.dotActive : null,
                ]}
              />
            ))}
          </View>

          <PrimaryButton
            title={current.btnLabel}
            onPress={onNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  heroStage: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  contentArea: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  headline1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
    textAlign: 'center',
    lineHeight: 34,
  },
  headline2: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: -0.6,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 340,
    fontWeight: '400',
  },
  footer: {
    width: '100%',
    gap: 18,
    paddingTop: 8,
    paddingBottom: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    width: 24,
    height: 6,
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
});

