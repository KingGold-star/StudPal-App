import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';

const nameIllustrationDark = require('../../assets/images/name_screen_illustration.png');
const nameIllustrationLight = require('../../assets/images/name_screen_illustration_light.png');

export default function OnboardingNameScreen({ onContinue, initialName = '' }) {
  const { isDark } = useTheme();
  const [name, setName] = useState(initialName);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  // Exact color calibration matching the illustration images
  const topBg = isDark ? '#051026' : '#F8FDFF';
  const botBg = isDark ? '#040E2A' : '#DEEFFF';
  const barStyle = isDark ? 'light-content' : 'dark-content';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#5A6F8C';
  const inputBg = isDark ? 'rgba(9, 21, 58, 0.85)' : '#FFFFFF';
  const inputBorder = isDark ? '#1E2D5A' : '#C7DCF3';
  const inputText = isDark ? '#FFFFFF' : '#0F172A';
  const inputPlaceholder = isDark ? '#64748B' : '#94A3B8';

  const webBgStyle = Platform.OS === 'web' ? {
    backgroundImage: isDark
      ? 'linear-gradient(180deg, #051026 0%, #051026 30%, #040E2A 80%, #040E2A 100%)'
      : 'linear-gradient(180deg, #F8FDFF 0%, #F8FDFF 30%, #DEEFFF 80%, #DEEFFF 100%)',
  } : {};

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 550,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 350);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const handleNext = () => {
    const trimmed = name.trim();
    onContinue(trimmed || 'friend');
  };

  return (
    <View style={[styles.container, { backgroundColor: topBg }, webBgStyle]}>
      <StatusBar barStyle={barStyle} backgroundColor={topBg} translucent />

      {/* 1. Global Full-Bleed Background Gradient */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="screenBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={topBg} />
              <Stop offset="30%" stopColor={topBg} />
              <Stop offset="80%" stopColor={botBg} />
              <Stop offset="100%" stopColor={botBg} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#screenBgGrad)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
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
                        outputRange: [18, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Header Title Section */}
              <View style={styles.headerBlock}>
                <Text style={[styles.subGreeting, { color: textSecondary }]}>first things first</Text>
                <Text style={[styles.mainTitle, { color: textPrimary }]}>Let's make this personal</Text>
              </View>

              {/* Text Input Field */}
              <View style={styles.inputWrapper}>
                <View
                  style={[
                    styles.inputBox,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                    isFocused && { borderColor: '#1200C6', borderWidth: 1.8 },
                  ]}
                >
                  <TextInput
                    ref={inputRef}
                    style={[
                      styles.input,
                      { color: inputText },
                      Platform.OS === 'web' && { outlineStyle: 'none' },
                    ]}
                    placeholder="Enter your name"
                    placeholderTextColor={inputPlaceholder}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleNext}
                    selectionColor="#1200C6"
                    cursorColor="#1200C6"
                  />
                </View>
              </View>

              {/* Seamless Transparent-Feathered Illustration */}
              <View style={styles.illustrationContainer}>
                <Image
                  source={isDark ? nameIllustrationDark : nameIllustrationLight}
                  style={styles.illustrationImage}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          </ScrollView>

          {/* Bottom Continue Button */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.continueButtonText}>continue</Text>
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
    backgroundColor: '#050E26',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 8,
    paddingBottom: 12,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBlock: {
    marginBottom: 12,
    paddingHorizontal: 22,
  },
  subGreeting: {
    fontSize: 19,
    fontWeight: '400',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  inputWrapper: {
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 22,
    width: '100%',
  },
  inputBox: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    fontSize: 17,
    fontWeight: '600',
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%',
  },
  illustrationContainer: {
    flex: 1,
    width: '100%',
    minHeight: 440,
    maxHeight: 580,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    position: 'relative',
    overflow: 'visible',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.18 }],
  },
  footerContainer: {
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 22,
  },
  continueButton: {
    height: 54,
    backgroundColor: '#1200C6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

