import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Rect,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==========================================
// 1. STUDPAL BRAND LOGO & TOP BADGE
// ==========================================
function StudPalLogo() {
  return (
    <View style={styles.logoRow}>
      <Svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        {/* Graduation Cap Top Diamond */}
        <Path
          d="M 14 3 L 26 9.5 L 14 16 L 2 9.5 Z"
          fill="#2563EB"
        />
        {/* Cap Base / Band */}
        <Path
          d="M 6 12.5 V 19 C 6 22 9.5 24.5 14 24.5 C 18.5 24.5 22 22 22 19 V 12.5 L 14 17 Z"
          fill="#1D4ED8"
        />
        {/* Tassel */}
        <Path
          d="M 23 10.5 V 20.5"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Circle cx="23" cy="21" r="1.5" fill="#2563EB" />
      </Svg>
      <Text style={styles.brandTitle}>StudPal</Text>
    </View>
  );
}

// ==========================================
// 2. CRISP VECTOR ICONS
// ==========================================
function UserOutlineIcon({ size = 19, color = '#7C8BA0' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.9" />
      <Path
        d="M 4 20 C 4 16.5 7.5 14 12 14 C 16.5 14 20 16.5 20 20"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MailOutlineIcon({ size = 19, color = '#7C8BA0' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke={color}
        strokeWidth="1.9"
      />
      <Path
        d="M 3 7 L 12 13 L 21 7"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LockOutlineIcon({ size = 19, color = '#7C8BA0' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2.5"
        stroke={color}
        strokeWidth="1.9"
      />
      <Path
        d="M 8 10 V 7 C 8 4.79 9.79 3 12 3 C 14.21 3 16 4.79 16 7 V 10"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15.5" r="1.2" fill={color} />
    </Svg>
  );
}

function EyeToggleIcon({ visible = false, size = 19, color = '#7C8BA0' }) {
  if (visible) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M 1 12 S 5 4 12 4 S 23 12 23 12 S 19 20 12 20 S 1 12 1 12 Z"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 17.94 17.94 A 10.07 10.07 0 0 1 12 20 C 5 20 1 12 1 12 A 22.8 22.8 0 0 1 6.06 6.06"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 9.9 4.24 A 9.12 9.12 0 0 1 12 4 C 19 4 23 12 23 12 A 23.3 23.3 0 0 1 19.92 16.08"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 1 1 L 23 23"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function GoogleGIcon({ size = 19 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

// ==========================================
// 3. AMBIENT BACKGROUND GLOW & ACCENTS
// ==========================================
function AmbientBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top Left Soft Glow */}
      <View style={styles.topAmbientOrb} />
      
      {/* Bottom Right Soft Polygon Art */}
      <View style={styles.cornerAccentContainer}>
        <Svg width="240" height="240" viewBox="0 0 240 240" fill="none">
          <Defs>
            <LinearGradient id="cornerGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.4" />
              <Stop offset="50%" stopColor="#DBEAFE" stopOpacity="0.65" />
              <Stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.8" />
            </LinearGradient>
          </Defs>
          <Polygon points="0,240 240,95 240,240" fill="url(#cornerGrad)" />
        </Svg>
      </View>
    </View>
  );
}

// ==========================================
// 4. MAIN SCREEN COMPONENT
// ==========================================
export default function OnboardingCreateAccountScreen({
  initialMode = 'signup',
  onContinue,
  onGoogleSignIn,
  onBack,
  defaultUsername = '',
  defaultEmail = '',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [username, setUsername] = useState(defaultUsername);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const googleBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 45,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handlePressIn = (animVal) => {
    Animated.spring(animVal, {
      toValue: 0.975,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = (animVal) => {
    Animated.spring(animVal, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handleSubmit = () => {
    if (onContinue) {
      onContinue({
        username: !isLoginMode ? username.trim() : undefined,
        email: email.trim(),
        password,
        mode: isLoginMode ? 'login' : 'signup',
        method: 'email',
      });
    }
  };

  const handleGoogleAuth = () => {
    if (onGoogleSignIn) {
      onGoogleSignIn({ mode: isLoginMode ? 'login' : 'signup' });
    } else if (onContinue) {
      onContinue({ method: 'google', mode: isLoginMode ? 'login' : 'signup' });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      {/* Ambient background decoration */}
      <AmbientBackdrop />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <Animated.View
              style={[
                styles.contentBlock,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Top Header Row with Logo */}
              <View style={styles.headerRow}>
                <StudPalLogo />
              </View>

              {/* Main Headline Block */}
              <View style={styles.titleSection}>
                {isLoginMode ? (
                  <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
                    Welcome{'\n'}
                    <Text style={styles.mainTitleAccent}>back</Text>
                  </Text>
                ) : (
                  <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
                    Create your{'\n'}
                    <Text style={styles.mainTitleAccent}>account</Text>
                  </Text>
                )}
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {isLoginMode
                    ? 'Log in to access your study hub and saved progress.'
                    : 'Your personalized StudPal is ready to save.'}
                </Text>
              </View>

              {/* Input Fields Section */}
              <View style={styles.formContainer}>
                {/* 1. Username Field (Sign up mode only) */}
                {!isLoginMode && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>USERNAME</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        { backgroundColor: theme.card, borderColor: isUsernameFocused ? '#2563EB' : theme.border },
                        isUsernameFocused && styles.inputWrapperFocused,
                      ]}
                    >
                      <View style={styles.inputIconBox}>
                        <UserOutlineIcon
                          size={19}
                          color={isUsernameFocused ? '#2563EB' : theme.textSecondary}
                        />
                      </View>
                      <TextInput
                        style={[styles.textInput, { color: theme.textPrimary }]}
                        placeholder="e.g. alex_study"
                        placeholderTextColor={theme.textMuted}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => setIsUsernameFocused(true)}
                        onBlur={() => setIsUsernameFocused(false)}
                        selectionColor="#2563EB"
                        cursorColor="#2563EB"
                      />
                    </View>
                  </View>
                )}

                {/* 2. Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>EMAIL ADDRESS</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.card, borderColor: isEmailFocused ? '#2563EB' : theme.border },
                      isEmailFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <View style={styles.inputIconBox}>
                      <MailOutlineIcon
                        size={19}
                        color={isEmailFocused ? '#2563EB' : theme.textSecondary}
                      />
                    </View>
                    <TextInput
                      style={[styles.textInput, { color: theme.textPrimary }]}
                      placeholder="alex@studpal.app"
                      placeholderTextColor={theme.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      selectionColor="#2563EB"
                      cursorColor="#2563EB"
                    />
                  </View>
                </View>

                {/* 2. Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>PASSWORD</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.card, borderColor: isPasswordFocused ? '#2563EB' : theme.border },
                      isPasswordFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <View style={styles.inputIconBox}>
                      <LockOutlineIcon
                        size={19}
                        color={isPasswordFocused ? '#2563EB' : theme.textSecondary}
                      />
                    </View>
                    <TextInput
                      style={[styles.textInput, { color: theme.textPrimary }]}
                      placeholder="Create a password"
                      placeholderTextColor={theme.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      selectionColor="#2563EB"
                      cursorColor="#2563EB"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <EyeToggleIcon
                        visible={showPassword}
                        size={19}
                        color={showPassword ? '#2563EB' : theme.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 3. Primary Action Button */}
                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSubmit}
                    onPressIn={() => handlePressIn(btnScale)}
                    onPressOut={() => handlePressOut(btnScale)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isLoginMode ? 'Log in' : 'Create account'}
                    </Text>
                    <Text style={styles.primaryButtonArrow}>➔</Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* 4. Elegant Minimal Divider */}
                <View style={styles.dividerRow}>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                  <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or continue with</Text>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                </View>

                {/* 5. Google Sign In Card Button */}
                <Animated.View style={{ transform: [{ scale: googleBtnScale }] }}>
                  <TouchableOpacity
                    style={[styles.googleButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={handleGoogleAuth}
                    onPressIn={() => handlePressIn(googleBtnScale)}
                    onPressOut={() => handlePressOut(googleBtnScale)}
                    activeOpacity={0.85}
                  >
                    <GoogleGIcon size={19} />
                    <Text style={[styles.googleButtonText, { color: theme.textPrimary }]}>
                      Continue with Google
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* 6. Already have an account? Log in / Sign up Toggle */}
                <TouchableOpacity
                  style={styles.toggleModeRow}
                  onPress={() => setIsLoginMode(!isLoginMode)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.togglePromptText, { color: theme.textSecondary }]}>
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <Text style={styles.toggleLinkText}>
                      {isLoginMode ? "Sign up" : "Log in"}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ==========================================
// 5. STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 28,
    justifyContent: 'flex-start',
  },
  contentBlock: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B1E48',
    letterSpacing: -0.4,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0A1838',
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  mainTitleAccent: {
    color: '#1D4ED8',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 8,
    letterSpacing: -0.2,
  },
  formContainer: {
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FAFCFF',
    shadowColor: '#2563EB',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  inputIconBox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: 0,
  },
  eyeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  primaryButton: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  primaryButtonArrow: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: Platform.OS === 'ios' ? 1 : 0,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: -0.1,
  },
  googleButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  toggleModeRow: {
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  togglePromptText: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: -0.2,
  },
  toggleLinkText: {
    fontWeight: '800',
    color: '#2563EB',
  },
  topAmbientOrb: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(219, 234, 254, 0.45)',
  },
  cornerAccentContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});
