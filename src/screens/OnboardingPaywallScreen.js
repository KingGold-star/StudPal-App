import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { ipLocationService } from '../services/ipLocationService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==========================================
// 1. LAUREL WREATH BADGE (HIGH-RES AUTHENTIC ASSET)
// ==========================================
function LaurelWreathBadge() {
  return (
    <View style={styles.laurelWrapper}>
      <Image
        source={require('../../assets/images/paywall_laurel_badge.png')}
        style={styles.laurelImage}
        resizeMode="contain"
      />
    </View>
  );
}

// ==========================================
// 2. VALUE PROP OUTLINE ICONS
// ==========================================
function LockFeatureIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="10" width="16" height="11" rx="2.5" stroke="#FFFFFF" strokeWidth="2.2" />
      <Path d="M 8 10 L 8 7 C 8 4.79 9.79 3 12 3 C 14.21 3 16 4.79 16 7 L 16 10" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function CommunityFeatureIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="8" r="4" stroke="#FFFFFF" strokeWidth="2.2" />
      <Path d="M 3 20 C 3 16.7 5.7 14 9 14 C 12.3 14 15 16.7 15 20" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M 16 9 C 17.66 9 19 7.66 19 6 C 19 4.34 17.66 3 16 3" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M 18 14 C 19.8 14.6 21 16.2 21 18.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function BookFeatureIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 4 19.5 C 4 17.5 6 16 8.5 16 H 20 V 4 H 8.5 C 6 4 4 5.5 4 7.5 V 19.5 Z"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <Path
        d="M 4 7.5 C 4 5.5 6 4 8.5 4 H 20"
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />
    </Svg>
  );
}

function SproutFeatureIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 21 V 11"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path
        d="M 12 11 C 12 7.5 14.5 5 18 5 C 18 8.5 15.5 11 12 11 Z"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <Path
        d="M 12 14 C 12 11.5 10 9.5 7 9.5 C 7 12 9 14 12 14 Z"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ==========================================
// MAIN SCREEN COMPONENT
// ==========================================
export default function OnboardingPaywallScreen({ onContinue, onBack }) {
  const [selectedPlan, setSelectedPlan] = useState('trial'); // 'trial' or 'week'
  const [countryCode, setCountryCode] = useState(ipLocationService.getCountryCode() || 'NG');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    const unsubscribe = ipLocationService.subscribe((code) => {
      if (code) setCountryCode(code);
    });
    return () => unsubscribe();
  }, [fadeAnim]);

  // Dynamic Localized Pricing
  const isNigeria = countryCode === 'NG';
  const renewalSubtext = isNigeria
    ? 'Subscription renews at NGN33,000.00/yr (~NGN634.61/week)'
    : 'Subscription renews at $39.99/yr (~$0.77/week)';
  const weeklyPriceText = isNigeria ? 'NGN4,500.00' : '$9.99';

  const btnScale = useRef(new Animated.Value(1)).current;
  const trialCardScale = useRef(new Animated.Value(1)).current;
  const weekCardScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(btnScale, {
      toValue: 0.94,
      useNativeDriver: Platform.OS !== 'web',
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnScale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 25,
      bounciness: 8,
    }).start();
  };

  const handleCardPressIn = (scaleAnim) => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: Platform.OS !== 'web',
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handleCardPressOut = (scaleAnim) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 25,
      bounciness: 8,
    }).start();
  };

  const handleSelectPlanAndContinue = (planKey, scaleAnim) => {
    setSelectedPlan(planKey);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 30,
        bounciness: 6,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      if (onContinue) {
        onContinue(planKey);
      }
    });
  };

  const handlePressContinue = () => {
    if (onContinue) {
      onContinue(selectedPlan);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* 1. Global Full-Bleed Background Canvas Gradient */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bgScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#08005A" stopOpacity="1" />
              <Stop offset="28%" stopColor="#0E0099" stopOpacity="1" />
              <Stop offset="65%" stopColor="#1200C6" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1800DE" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgScreenGrad)" />
        </Svg>
      </View>

      {/* 2. Top Centered Hero Image Layer with Seamless Dissolve */}
      <View style={styles.heroImageWrapper} pointerEvents="none">
        <Image
          source={require('../../assets/images/paywall_student_hero.jpg')}
          style={styles.heroImageCentered}
          resizeMode="cover"
        />

        {/* Continuous Full-Height Dissolve Mask */}
        <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="heroContinuousFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#060042" stopOpacity="0.15" />
              <Stop offset="18%" stopColor="#0E0099" stopOpacity="0.0" />
              <Stop offset="30%" stopColor="#0E0099" stopOpacity="0.35" />
              <Stop offset="42%" stopColor="#0E0099" stopOpacity="0.82" />
              <Stop offset="50%" stopColor="#0E0099" stopOpacity="1.0" />
              <Stop offset="72%" stopColor="#1200C6" stopOpacity="1.0" />
              <Stop offset="100%" stopColor="#1800DE" stopOpacity="1.0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroContinuousFade)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Top Navigation Bar with Back Arrow */}
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
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Main Content Body */}
        <Animated.View style={[styles.mainBody, { opacity: fadeAnim }]}>
          {/* 1. Laurel Wreath Award Badge */}
          <View style={styles.badgesRow}>
            <LaurelWreathBadge />
          </View>

          {/* 2. Headline Overlaying the Horizon */}
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>
              become who you were{'\n'}made to be
            </Text>
          </View>

          {/* 3. Feature Proposition List */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <LockFeatureIcon />
              </View>
              <Text style={styles.featureText}>block your apps until you study</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <CommunityFeatureIcon />
              </View>
              <Text style={styles.featureText}>talk and study with 500k+ students</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <BookFeatureIcon />
              </View>
              <Text style={styles.featureText}>read and master topics every day</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <SproutFeatureIcon />
              </View>
              <Text style={styles.featureText}>raise a focus streak that grows in rank</Text>
            </View>
          </View>

          {/* 4. Plan Selection Cards Stack */}
          <View style={styles.planCardsContainer}>
            {/* Option 1: Free 3 Days Trial (Selected State) */}
            <Animated.View style={{ width: '100%', transform: [{ scale: trialCardScale }] }}>
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === 'trial' && styles.planCardActive,
                ]}
                onPress={() => handleSelectPlanAndContinue('trial', trialCardScale)}
                onPressIn={() => handleCardPressIn(trialCardScale)}
                onPressOut={() => handleCardPressOut(trialCardScale)}
                activeOpacity={0.92}
              >
                <View style={styles.planLeftCol}>
                  <Text style={styles.planTitle}>Free</Text>
                  <Text style={styles.planSubtitle}>3 days</Text>
                </View>
                <View style={styles.noPaymentPill}>
                  <Text style={styles.noPaymentPillText}>No Payment Now</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Option 2: 1 Week */}
            <Animated.View style={{ width: '100%', transform: [{ scale: weekCardScale }] }}>
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === 'week' && styles.planCardActive,
                ]}
                onPress={() => handleSelectPlanAndContinue('week', weekCardScale)}
                onPressIn={() => handleCardPressIn(weekCardScale)}
                onPressOut={() => handleCardPressOut(weekCardScale)}
                activeOpacity={0.92}
              >
                <View style={styles.planLeftCol}>
                  <Text style={styles.planTitle}>1 week</Text>
                  <Text style={styles.planSubtitle}>{weeklyPriceText}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* 5. Subscription Renewal Terms */}
          <Text style={styles.renewalSubtext}>{renewalSubtext}</Text>

          {/* 6. Primary Action CTA Button with Tactile Spring Press Animation */}
          <Animated.View style={{ width: '100%', transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePressContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.92}
            >
              <Text style={styles.primaryButtonText}>Continue  ›</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 7. Footer Restore Purchases Link */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0099',
  },
  heroImageWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroImageCentered: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: Math.max(400, Math.round(SCREEN_HEIGHT * 0.54)),
    alignSelf: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topNavBar: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBody: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'ios' ? 10 : 14,
    justifyContent: 'flex-end',
  },
  badgesRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  laurelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: -54,
    marginBottom: -8,
  },
  laurelImage: {
    width: 245,
    height: 104,
  },
  headlineContainer: {
    marginBottom: 12,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.7,
    lineHeight: 36,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  featuresList: {
    gap: 10,
    marginBottom: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  featureIconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.15,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  planCardsContainer: {
    width: '100%',
    gap: 9,
    marginBottom: 10,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.15)' }
      : {}),
  },
  planCardActive: {
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 7,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.35), 0px 2px 6px rgba(0, 0, 0, 0.2)' }
      : {}),
  },
  planLeftCol: {
    justifyContent: 'center',
  },
  planTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  planSubtitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: -0.1,
  },
  noPaymentPill: {
    backgroundColor: '#1200C6',
    borderRadius: 10,
    paddingVertical: 6.5,
    paddingHorizontal: 12,
  },
  noPaymentPillText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  renewalSubtext: {
    fontSize: 11.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.88)',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: -0.1,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 6,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 5px 16px rgba(0, 0, 0, 0.3), 0px 2px 5px rgba(0, 0, 0, 0.18)' }
      : {}),
  },
  primaryButtonText: {
    color: '#1200C6',
    fontSize: 17.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  restoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  restoreText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: -0.1,
  },
});
