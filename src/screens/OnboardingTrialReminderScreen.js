import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Easing,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { ipLocationService } from '../services/ipLocationService';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// ==========================================
// EXACT NOTIFICATION BELL WITH BADGE GRAPHIC
// ==========================================
function NotificationBellGraphic({ size = 230 }) {
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth bell chime ringing animation: ring, settle, stop for 1.5s, then repeat
    const ringSequence = Animated.loop(
      Animated.sequence([
        // 1. Initial tilt left
        Animated.timing(ringAnim, {
          toValue: -15,
          duration: 150,
          easing: Easing.out(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        // 2. Swing right
        Animated.timing(ringAnim, {
          toValue: 15,
          duration: 170,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        // 3. Swing left
        Animated.timing(ringAnim, {
          toValue: -11,
          duration: 160,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        // 4. Swing right
        Animated.timing(ringAnim, {
          toValue: 11,
          duration: 150,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        // 5. Dampening left
        Animated.timing(ringAnim, {
          toValue: -6,
          duration: 140,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        // 6. Dampening right
        Animated.timing(ringAnim, {
          toValue: 6,
          duration: 130,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        // 7. Micro settle left
        Animated.timing(ringAnim, {
          toValue: -2,
          duration: 120,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        // 8. Return to center rest
        Animated.timing(ringAnim, {
          toValue: 0,
          duration: 110,
          easing: Easing.out(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),

        // Explicit 1.5 seconds pause before ringing again
        Animated.delay(1500),
      ])
    );

    ringSequence.start();
    return () => ringSequence.stop();
  }, [ringAnim]);

  const rotate = ringAnim.interpolate({
    inputRange: [-180, 180],
    outputRange: ['-180deg', '180deg'],
  });

  const pivotOffset = size * 0.32;

  return (
    <Animated.View
      style={[
        styles.bellContainer,
        {
          transform: [
            { translateY: -pivotOffset },
            { rotate },
            { translateY: pivotOffset },
          ],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
        {/* 1. Bell Clapper (Bottom Center, layered behind bell body) */}
        <Circle
          cx="80"
          cy="124"
          r="14"
          fill="#C5D5D4"
        />

        {/* 2. Top Knob / Loop Handle */}
        <Path
          d="M 70 34 
             C 70 18 90 18 90 34 Z"
          fill="#D9E4E3"
        />

        {/* 3. Main Bell Silhouette Dome & Flared Skirt (Taller, elegant silhouette) */}
        <Path
          d="M 80 26 
             C 58 26 45 42 43 68 
             C 41 86 43 102 33 114 
             C 29 119 34 124 44 124 
             L 116 124 
             C 126 124 131 119 127 114 
             C 117 102 119 86 117 68 
             C 115 42 102 26 80 26 Z"
          fill="#D9E4E3"
        />

        {/* 4. Small Circular Red Notification Badge on Top Right */}
        <Circle
          cx="112"
          cy="40"
          r="16"
          fill="#DC2626"
        />

        {/* 5. Scaled White Number "1" inside Badge */}
        <SvgText
          x="112"
          y="45.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="15"
          fontWeight="bold"
        >
          1
        </SvgText>
      </Svg>
    </Animated.View>
  );
}

// ==========================================
// MAIN SCREEN COMPONENT
// ==========================================
export default function OnboardingTrialReminderScreen({ onContinue, onBack }) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [countryCode, setCountryCode] = useState(ipLocationService.getCountryCode() || 'NG');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    const unsubscribe = ipLocationService.subscribe((code) => {
      if (code) setCountryCode(code);
    });
    return () => unsubscribe();
  }, [fadeAnim]);

  // Dynamic Localized Pricing
  const isNigeria = countryCode === 'NG';
  const priceSubtext = isNigeria
    ? 'just NGN33,000.00 per year (NGN634.61/week)'
    : 'just $39.99 per year ($0.77/week)';

  const handleClaimTrial = () => {
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Top Navigation Bar with Accessible Back Arrow */}
        <View style={styles.topNavBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M 15 19 L 8 12 L 15 5"
                stroke={theme.textPrimary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.mainBody, { opacity: fadeAnim }]}>
            {/* Header Titles */}
            <View style={styles.headerSection}>
              <Text style={[styles.headline, { color: theme.textPrimary }]}>
                we'll send you a reminder before your free trial ends
              </Text>
              <Text style={[styles.subHeadline, { color: theme.textSecondary }]}>
                zero surprises. we will send a notification on day 5 before any charge happens.
              </Text>
            </View>

            {/* Notification Bell Graphic matching exact reference */}
            <View style={styles.graphicSection}>
              <NotificationBellGraphic size={230} />
            </View>

            {/* Trust Reassurance Cards */}
            <View style={styles.trustCardsContainer}>
              <View style={[styles.trustCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.trustIconWrap, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <Path
                      d="M 10 2 L 17 5 C 17 12 13.5 16.5 10 18.5 C 6.5 16.5 3 12 3 5 Z"
                      fill={isDark ? '#1E293B' : '#EFF6FF'}
                      stroke="#2563EB"
                      strokeWidth="1.6"
                    />
                    <Path
                      d="M 7 10 L 9 12 L 13 8"
                      stroke="#2563EB"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <View style={styles.trustTextCol}>
                  <Text style={[styles.trustTitle, { color: theme.textPrimary }]}>no commitment</Text>
                  <Text style={[styles.trustSubtitle, { color: theme.textSecondary }]}>cancel anytime in 1 tap directly in settings</Text>
                </View>
              </View>

              <View style={[styles.trustCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.trustIconWrap, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <Path
                      d="M 10 3 C 7.5 3 5.5 5 5.5 8 C 5.5 11 4.5 12.5 3.5 14 L 16.5 14 C 15.5 12.5 14.5 11 14.5 8 C 14.5 5 12.5 3 10 3 Z"
                      fill={isDark ? '#1E293B' : '#EFF6FF'}
                      stroke="#2563EB"
                      strokeWidth="1.6"
                    />
                    <Path d="M 8.5 14 C 8.5 15.5 9.2 16.5 10 16.5 C 10.8 16.5 11.5 15.5 11.5 14" stroke="#2563EB" strokeWidth="1.6" />
                  </Svg>
                </View>
                <View style={styles.trustTextCol}>
                  <Text style={[styles.trustTitle, { color: theme.textPrimary }]}>friendly reminder</Text>
                  <Text style={[styles.trustSubtitle, { color: theme.textSecondary }]}>we'll notify you 2 days before the trial finishes</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom CTA & Guarantee Section */}
        <View style={[styles.bottomSection, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
          {/* Guarantee Row */}
          <View style={styles.guaranteeRow}>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M 2.5 8.5 L 6.5 12.5 L 13.5 4"
                stroke={theme.textPrimary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.guaranteeText, { color: theme.textPrimary }]}>No Payment Due Now</Text>
          </View>

          {/* Primary CTA Button (StudPal Electric Blue Brand Color) */}
          <TouchableOpacity
            style={styles.primaryTrialButton}
            onPress={handleClaimTrial}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryTrialButtonText}>continue for FREE</Text>
          </TouchableOpacity>

          {/* Localized Price Subtext */}
          <Text style={[styles.priceSubtext, { color: theme.textSecondary }]}>{priceSubtext}</Text>
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
  },
  topNavBar: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  mainBody: {
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 6,
  },
  headline: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 31,
    marginBottom: 8,
  },
  subHeadline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.2,
    maxWidth: 320,
  },
  graphicSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  bellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    height: 230,
  },
  trustCardsContainer: {
    width: '100%',
    gap: 10,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  trustIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTextCol: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  trustSubtitle: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#64748B',
    letterSpacing: -0.1,
    lineHeight: 17,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  guaranteeText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  primaryTrialButton: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 8,
  },
  primaryTrialButtonText: {
    color: '#FFFFFF',
    fontSize: 17.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  priceSubtext: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: -0.15,
    textAlign: 'center',
  },
});

