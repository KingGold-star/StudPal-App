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
  ActivityIndicator,
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
import { authService } from '../services/supabase/authService';
import { COUNTRY_CODES, findCountryByCode } from '../constants/countryCodes';
import { ipLocationService } from '../services/ipLocationService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==========================================
// 1. STUDPAL BRAND LOGO & TOP BADGE
// ==========================================
function StudPalLogo({ isDark }) {
  return (
    <View style={styles.brandRow}>
      <View
        style={[
          styles.brandIconBox,
          {
            backgroundColor: isDark ? 'rgba(37, 99, 235, 0.16)' : '#EFF6FF',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
          },
        ]}
      >
        <Svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          {/* Graduation Cap Top Diamond */}
          <Path
            d="M 14 3 L 26 9.5 L 14 16 L 2 9.5 Z"
            fill="#3B82F6"
          />
          {/* Cap Base / Band */}
          <Path
            d="M 6 12.5 V 19 C 6 22 9.5 24.5 14 24.5 C 18.5 24.5 22 22 22 19 V 12.5 L 14 17 Z"
            fill="#2563EB"
          />
          {/* Tassel */}
          <Path
            d="M 23 10.5 V 20.5"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Circle cx="23" cy="21" r="1.5" fill="#3B82F6" />
        </Svg>
      </View>
      <Text style={[styles.brandTitle, { color: isDark ? '#FFFFFF' : '#0B1E48' }]}>StudPal</Text>
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

function PhoneOutlineIcon({ size = 18, color = '#7C8BA0' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MailCheckOutlineIcon({ size = 18, color = '#7C8BA0' }) {
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
      <Path
        d="M 9.5 13.5 L 11.5 15.5 L 15 12"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronDownIcon({ size = 13, color = '#7C8BA0', isOpen = false }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
    >
      <Path
        d="M 6 9 L 12 15 L 18 9"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchOutlineIcon({ size = 14, color = '#7C8BA0' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Path d="M 20 20 L 16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CheckmarkIcon({ size = 13, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 5 13 L 9.5 17.5 L 19 6.5"
        stroke={color}
        strokeWidth="2.4"
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

function AppleIcon({ size = 19, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 814 1000">
      <Path
        fill={color}
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
      />
    </Svg>
  );
}

// ==========================================
// 3. AMBIENT BACKGROUND GLOW & ACCENTS
// ==========================================
function AmbientBackdrop({ isDark }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.ambientGlowContainer}>
        <Svg width={SCREEN_WIDTH} height={320} viewBox={`0 0 ${SCREEN_WIDTH} 320`} fill="none">
          <Defs>
            <LinearGradient id="ambientAura" x1="0.5" y1="0" x2="0.5" y2="1">
              <Stop
                offset="0%"
                stopColor={isDark ? '#2563EB' : '#93C5FD'}
                stopOpacity={isDark ? 0.2 : 0.25}
              />
              <Stop
                offset="60%"
                stopColor={isDark ? '#1D4ED8' : '#DBEAFE'}
                stopOpacity={isDark ? 0.05 : 0.08}
              />
              <Stop
                offset="100%"
                stopColor={isDark ? '#070E1E' : '#FFFFFF'}
                stopOpacity={0}
              />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_WIDTH} height={320} fill="url(#ambientAura)" />
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
  onAppleSignIn,
  onBack,
  defaultFirstName = '',
  defaultLastName = '',
  defaultPhoneNumber = '',
  defaultUsername = '',
  defaultEmail = '',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (defaultPhoneNumber && defaultPhoneNumber.startsWith('+')) {
      const match = COUNTRY_CODES.find((c) => defaultPhoneNumber.startsWith(c.dialCode));
      if (match) return match;
    }
    const detectedCode = ipLocationService?.getCountryCode?.() || 'NG';
    return findCountryByCode(detectedCode);
  });
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (defaultPhoneNumber && defaultPhoneNumber.startsWith('+')) {
      const match = COUNTRY_CODES.find((c) => defaultPhoneNumber.startsWith(c.dialCode));
      if (match) {
        return defaultPhoneNumber.slice(match.dialCode.length).trim();
      }
    }
    return defaultPhoneNumber || '';
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const phoneInputRef = useRef(null);

  const [username, setUsername] = useState(defaultUsername);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const filteredCountries = React.useMemo(() => {
    if (!countrySearchQuery.trim()) return COUNTRY_CODES;
    const q = countrySearchQuery.toLowerCase().trim();
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearchQuery]);

  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const googleBtnScale = useRef(new Animated.Value(1)).current;
  const appleBtnScale = useRef(new Animated.Value(1)).current;

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

  // Override browser autofill background shades so inputs remain seamless
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'studpal-account-autofill-fix';
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      const bg = isDark ? '#0F1A30' : '#FFFFFF';
      const textColor = isDark ? '#F8FAFC' : '#0F172A';
      styleTag.textContent = `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px ${bg} inset !important;
          box-shadow: 0 0 0 1000px ${bg} inset !important;
          -webkit-text-fill-color: ${textColor} !important;
          background-color: transparent !important;
          transition: background-color 5000000s ease-in-out 0s !important;
        }
        input {
          background-color: transparent !important;
        }
      `;
    }
  }, [isDark]);

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

  const handleSubmit = async () => {
    setErrorMessage('');

    // Sign-up exclusive field validation
    if (!isLoginMode) {
      if (!firstName.trim()) {
        setErrorMessage('Please enter your first name.');
        return;
      }
      if (!lastName.trim()) {
        setErrorMessage('Please enter your last name.');
        return;
      }
      if (!username.trim()) {
        setErrorMessage('Please enter a username.');
        return;
      }
      const digitsOnly = phoneNumber.replace(/[^0-9]/g, '');
      if (!digitsOnly) {
        setErrorMessage('Please enter your mobile phone number.');
        return;
      }
      if (digitsOnly.length < 5) {
        setErrorMessage('Please enter a valid mobile number.');
        return;
      }
    }

    // Email validation
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Confirm Password validation (Sign-up mode only)
    if (!isLoginMode) {
      if (!confirmPassword) {
        setErrorMessage('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    if (onContinue) {
      setIsLoading(true);
      try {
        const fullName = !isLoginMode ? `${firstName.trim()} ${lastName.trim()}`.trim() : undefined;
        const formattedPhone = !isLoginMode && phoneNumber.trim()
          ? `${selectedCountry.dialCode} ${phoneNumber.trim()}`
          : undefined;
        const result = await onContinue({
          firstName: !isLoginMode ? firstName.trim() : undefined,
          lastName: !isLoginMode ? lastName.trim() : undefined,
          fullName,
          phoneNumber: formattedPhone,
          countryCode: selectedCountry?.code,
          dialCode: selectedCountry?.dialCode,
          username: !isLoginMode ? username.trim() : undefined,
          email: email.trim(),
          password,
          mode: isLoginMode ? 'login' : 'signup',
          method: 'email',
        });
        if (result && result.error) {
          setErrorMessage(result.error.message || 'Authentication error.');
        }
      } catch (err) {
        setErrorMessage(err.message || 'An error occurred during authentication.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) return;
    setIsResending(true);
    setResendStatus('');
    try {
      const res = await authService.resendConfirmationEmail(email.trim());
      if (res?.error) {
        if (res.error.message && res.error.message.includes('rate limit')) {
          setResendStatus('Email rate limit reached (3/hr limit). Please disable "Confirm email" in Supabase Dashboard.');
        } else {
          setResendStatus(res.error.message || 'Unable to resend email.');
        }
      } else {
        setResendStatus('Verification link resent! Check your inbox or spam folder.');
      }
    } catch (e) {
      setResendStatus('Error resending confirmation.');
    } finally {
      setIsResending(false);
    }
  };

  const handleContinueOffline = async () => {
    setIsLoading(true);
    try {
      const fullName = !isLoginMode ? `${firstName.trim()} ${lastName.trim()}`.trim() : (username.trim() || email.split('@')[0]);
      const formattedPhone = !isLoginMode && phoneNumber.trim()
        ? `${selectedCountry.dialCode} ${phoneNumber.trim()}`
        : undefined;
      await onContinue({
        firstName: !isLoginMode ? firstName.trim() : undefined,
        lastName: !isLoginMode ? lastName.trim() : undefined,
        fullName,
        phoneNumber: formattedPhone,
        countryCode: selectedCountry?.code,
        dialCode: selectedCountry?.dialCode,
        username: !isLoginMode ? username.trim() : (username.trim() || email.split('@')[0]),
        email: email.trim(),
        password,
        mode: isLoginMode ? 'login' : 'signup',
        method: 'email',
        forceOffline: true,
      });
    } catch (e) {
      setErrorMessage(e.message || 'Could not start offline mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (onGoogleSignIn) {
      onGoogleSignIn({ mode: isLoginMode ? 'login' : 'signup' });
    } else if (onContinue) {
      onContinue({ method: 'google', mode: isLoginMode ? 'login' : 'signup' });
    }
  };

  const handleAppleAuth = () => {
    if (onAppleSignIn) {
      onAppleSignIn({ mode: isLoginMode ? 'login' : 'signup' });
    } else if (onContinue) {
      onContinue({ method: 'apple', mode: isLoginMode ? 'login' : 'signup' });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      {/* Ambient background decoration */}
      <AmbientBackdrop isDark={isDark} />

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
              {/* Main Headline Block */}
              <View style={styles.titleSection}>
                {isLoginMode ? (
                  <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
                    Welcome{' '}
                    <Text style={[styles.mainTitleAccent, { color: isDark ? '#60A5FA' : '#2563EB' }]}>back</Text>
                  </Text>
                ) : (
                  <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
                    Create your{' '}
                    <Text style={[styles.mainTitleAccent, { color: isDark ? '#60A5FA' : '#2563EB' }]}>account</Text>
                  </Text>
                )}
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {isLoginMode
                    ? 'Log in to access your study hub and saved progress.'
                    : 'Your personalized study system is ready.'}
                </Text>
              </View>

              {/* Input Fields Section */}
              <View style={styles.formContainer}>
                {!!errorMessage && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                    {errorMessage.toLowerCase().includes('email not confirmed') && (
                      <View style={styles.errorActionCol}>
                        <TouchableOpacity
                          style={styles.resendBtn}
                          onPress={handleResendConfirmation}
                          disabled={isResending}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.resendBtnText}>
                            {isResending ? 'Resending...' : '✉️ Resend Confirmation Email'}
                          </Text>
                        </TouchableOpacity>
                        {!!resendStatus && (
                          <Text style={styles.resendStatusText}>{resendStatus}</Text>
                        )}
                        <TouchableOpacity
                          style={styles.offlineFallbackBtn}
                          onPress={handleContinueOffline}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.offlineFallbackBtnText}>⚡ Continue to Study (Offline Mode)</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {errorMessage.toLowerCase().includes('rate limit') && (
                      <View style={styles.errorActionCol}>
                        <TouchableOpacity
                          style={styles.offlineFallbackBtn}
                          onPress={handleContinueOffline}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.offlineFallbackBtnText}>⚡ Continue to Study (Offline Mode)</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                {/* 1. First Name & Last Name (Sign up mode only) */}
                {!isLoginMode && (
                  <View style={styles.nameRow}>
                    <View style={styles.halfInputGroupLeft}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>First Name</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          {
                            backgroundColor: isFirstNameFocused
                              ? (isDark ? 'rgba(30, 58, 138, 0.22)' : '#FAFCFF')
                              : (isDark ? 'rgba(255, 255, 255, 0.04)' : theme.card),
                            borderColor: isFirstNameFocused
                              ? '#3B82F6'
                              : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                          },
                          isFirstNameFocused && styles.inputWrapperFocused,
                        ]}
                      >
                        <View style={styles.inputIconBox}>
                          <UserOutlineIcon
                            size={18}
                            color={isFirstNameFocused ? '#3B82F6' : theme.textSecondary}
                          />
                        </View>
                        <TextInput
                          style={[styles.textInput, { color: theme.textPrimary }]}
                          placeholder="First name"
                          placeholderTextColor={theme.textMuted}
                          value={firstName}
                          onChangeText={setFirstName}
                          autoCapitalize="words"
                          autoCorrect={false}
                          onFocus={() => setIsFirstNameFocused(true)}
                          onBlur={() => setIsFirstNameFocused(false)}
                          selectionColor="#3B82F6"
                          cursorColor="#3B82F6"
                        />
                      </View>
                    </View>

                    <View style={styles.halfInputGroupRight}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Last Name</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          {
                            backgroundColor: isLastNameFocused
                              ? (isDark ? 'rgba(30, 58, 138, 0.22)' : '#FAFCFF')
                              : (isDark ? 'rgba(255, 255, 255, 0.04)' : theme.card),
                            borderColor: isLastNameFocused
                              ? '#3B82F6'
                              : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                          },
                          isLastNameFocused && styles.inputWrapperFocused,
                        ]}
                      >
                        <View style={styles.inputIconBox}>
                          <UserOutlineIcon
                            size={18}
                            color={isLastNameFocused ? '#3B82F6' : theme.textSecondary}
                          />
                        </View>
                        <TextInput
                          style={[styles.textInput, { color: theme.textPrimary }]}
                          placeholder="Last name"
                          placeholderTextColor={theme.textMuted}
                          value={lastName}
                          onChangeText={setLastName}
                          autoCapitalize="words"
                          autoCorrect={false}
                          onFocus={() => setIsLastNameFocused(true)}
                          onBlur={() => setIsLastNameFocused(false)}
                          selectionColor="#3B82F6"
                          cursorColor="#3B82F6"
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* 2. Username Field (Sign up mode only) */}
                {!isLoginMode && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Username</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: isUsernameFocused
                            ? (isDark ? 'rgba(30, 58, 138, 0.22)' : '#FAFCFF')
                            : (isDark ? 'rgba(255, 255, 255, 0.04)' : theme.card),
                          borderColor: isUsernameFocused
                            ? '#3B82F6'
                            : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                        },
                        isUsernameFocused && styles.inputWrapperFocused,
                      ]}
                    >
                      <View style={styles.inputIconBox}>
                        <UserOutlineIcon
                          size={18}
                          color={isUsernameFocused ? '#3B82F6' : theme.textSecondary}
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
                        selectionColor="#3B82F6"
                        cursorColor="#3B82F6"
                      />
                    </View>
                  </View>
                )}

                {/* 3. Phone Number Field with Country Code Dropdown */}
                {!isLoginMode && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        styles.phoneInputWrapper,
                        {
                          backgroundColor: isPhoneFocused
                            ? (isDark ? 'rgba(30, 58, 138, 0.22)' : '#FAFCFF')
                            : (isDark ? 'rgba(255, 255, 255, 0.04)' : theme.card),
                          borderColor: (isPhoneFocused || isCountryDropdownOpen)
                            ? '#3B82F6'
                            : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                        },
                        (isPhoneFocused || isCountryDropdownOpen) && styles.inputWrapperFocused,
                      ]}
                    >
                      {/* Collapsible Country Selector Trigger */}
                      <TouchableOpacity
                        style={[
                          styles.countryPickerTrigger,
                          {
                            borderRightColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
                          },
                        ]}
                        onPress={() => {
                          setIsCountryDropdownOpen(!isCountryDropdownOpen);
                          setCountrySearchQuery('');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.countryFlagEmoji}>{selectedCountry.flag}</Text>
                        <Text style={[styles.countryDialCodeText, { color: theme.textPrimary }]}>
                          {selectedCountry.dialCode}
                        </Text>
                        <ChevronDownIcon
                          size={12}
                          color={isCountryDropdownOpen ? '#3B82F6' : theme.textSecondary}
                          isOpen={isCountryDropdownOpen}
                        />
                      </TouchableOpacity>

                      {/* Original Mobile Number TextInput */}
                      <TextInput
                        ref={phoneInputRef}
                        style={[styles.textInput, styles.phoneTextInput, { color: theme.textPrimary }]}
                        placeholder="Mobile number"
                        placeholderTextColor={theme.textMuted}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => {
                          setIsPhoneFocused(true);
                          setIsCountryDropdownOpen(false);
                        }}
                        onBlur={() => setIsPhoneFocused(false)}
                        selectionColor="#3B82F6"
                        cursorColor="#3B82F6"
                      />
                    </View>

                    {/* Collapsible Country Code Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <View
                        style={[
                          styles.countryDropdownMenu,
                          {
                            backgroundColor: isDark ? '#0C1935' : '#FFFFFF',
                            borderColor: isDark ? 'rgba(59, 130, 246, 0.35)' : '#BFDBFE',
                            shadowColor: isDark ? '#000000' : '#1E3A8A',
                          },
                        ]}
                      >
                        {/* Search Bar inside dropdown */}
                        <View
                          style={[
                            styles.dropdownSearchRow,
                            {
                              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                            },
                          ]}
                        >
                          <SearchOutlineIcon size={14} color={theme.textSecondary} />
                          <TextInput
                            style={[styles.dropdownSearchInput, { color: theme.textPrimary }]}
                            placeholder="Search country or code..."
                            placeholderTextColor={theme.textMuted}
                            value={countrySearchQuery}
                            onChangeText={setCountrySearchQuery}
                            autoCapitalize="none"
                            autoCorrect={false}
                            selectionColor="#3B82F6"
                          />
                          {!!countrySearchQuery && (
                            <TouchableOpacity
                              onPress={() => setCountrySearchQuery('')}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Text style={[styles.clearSearchText, { color: theme.textMuted }]}>✕</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {/* Scrollable list of countries */}
                        <ScrollView
                          style={styles.dropdownScrollView}
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={true}
                        >
                          {filteredCountries.length === 0 ? (
                            <View style={styles.emptyDropdownNotice}>
                              <Text style={[styles.emptyDropdownText, { color: theme.textMuted }]}>
                                No country found
                              </Text>
                            </View>
                          ) : (
                            filteredCountries.map((item) => {
                              const isSelected = item.code === selectedCountry.code;
                              return (
                                <TouchableOpacity
                                  key={item.code}
                                  style={[
                                    styles.dropdownItemRow,
                                    isSelected && {
                                      backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF',
                                    },
                                  ]}
                                  onPress={() => {
                                    setSelectedCountry(item);
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearchQuery('');
                                    phoneInputRef.current?.focus();
                                  }}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.dropdownItemFlag}>{item.flag}</Text>
                                  <Text
                                    style={[
                                      styles.dropdownItemName,
                                      { color: isSelected ? (isDark ? '#60A5FA' : '#2563EB') : theme.textPrimary },
                                      isSelected && { fontWeight: '700' },
                                    ]}
                                    numberOfLines={1}
                                  >
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dropdownItemDialCode,
                                      { color: isSelected ? (isDark ? '#93C5FD' : '#2563EB') : theme.textSecondary },
                                    ]}
                                  >
                                    {item.dialCode}
                                  </Text>
                                  {isSelected && (
                                    <View style={styles.dropdownCheckmarkBox}>
                                      <CheckmarkIcon size={13} color={isDark ? '#60A5FA' : '#2563EB'} />
                                    </View>
                                  )}
                                </TouchableOpacity>
                              );
                            })
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}

                {/* 4. Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email address</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: isEmailFocused
                          ? (isDark ? 'rgba(30, 58, 138, 0.22)' : '#FAFCFF')
                          : (isDark ? 'rgba(255, 255, 255, 0.04)' : theme.card),
                        borderColor: isEmailFocused
                          ? '#3B82F6'
                          : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                      },
                      isEmailFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <View style={styles.inputIconBox}>
                      <MailOutlineIcon
                        size={18}
                        color={isEmailFocused ? '#3B82F6' : theme.textSecondary}
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
                      selectionColor="#3B82F6"
                      cursorColor="#3B82F6"
                    />
                  </View>
                </View>

                {/* 5. Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: isPasswordFocused
                          ? (isDark ? 'rgba(30, 58, 138, 0.22)' : '#FAFCFF')
                          : (isDark ? 'rgba(255, 255, 255, 0.04)' : theme.card),
                        borderColor: isPasswordFocused
                          ? '#3B82F6'
                          : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                      },
                      isPasswordFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <View style={styles.inputIconBox}>
                      <LockOutlineIcon
                        size={18}
                        color={isPasswordFocused ? '#3B82F6' : theme.textSecondary}
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
                      selectionColor="#3B82F6"
                      cursorColor="#3B82F6"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <EyeToggleIcon
                        visible={showPassword}
                        size={18}
                        color={showPassword ? '#3B82F6' : theme.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 6. Confirm Password Field (Sign up mode only) */}
                {!isLoginMode && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Confirm Password</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: isConfirmPasswordFocused
                            ? (isDark ? 'rgba(30, 58, 138, 0.22)' : '#FAFCFF')
                            : (isDark ? 'rgba(255, 255, 255, 0.04)' : theme.card),
                          borderColor: isConfirmPasswordFocused
                            ? '#3B82F6'
                            : (isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border),
                        },
                        isConfirmPasswordFocused && styles.inputWrapperFocused,
                      ]}
                    >
                      <View style={styles.inputIconBox}>
                        <LockOutlineIcon
                          size={18}
                          color={isConfirmPasswordFocused ? '#3B82F6' : theme.textSecondary}
                        />
                      </View>
                      <TextInput
                        style={[styles.textInput, { color: theme.textPrimary }]}
                        placeholder="Re-enter your password"
                        placeholderTextColor={theme.textMuted}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => setIsConfirmPasswordFocused(true)}
                        onBlur={() => setIsConfirmPasswordFocused(false)}
                        selectionColor="#3B82F6"
                        cursorColor="#3B82F6"
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <EyeToggleIcon
                          visible={showConfirmPassword}
                          size={18}
                          color={showConfirmPassword ? '#3B82F6' : theme.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* 4. Primary Action Button */}
                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                  <TouchableOpacity
                    style={[styles.primaryButton, isLoading && { opacity: 0.8 }]}
                    onPress={handleSubmit}
                    onPressIn={() => !isLoading && handlePressIn(btnScale)}
                    onPressOut={() => !isLoading && handlePressOut(btnScale)}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>
                          {isLoginMode ? 'Log in' : 'Create account'}
                        </Text>
                        <Text style={styles.primaryButtonArrow}>➔</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* 5. Elegant Minimal Divider */}
                <View style={styles.dividerRow}>
                  <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border }]} />
                  <Text style={[styles.dividerText, { color: isDark ? '#64748B' : theme.textSecondary }]}>or continue with</Text>
                  <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border }]} />
                </View>

                {/* 6. Direct Social Auth Buttons (Google & Apple) */}
                <View style={styles.socialButtonsContainer}>
                  <Animated.View style={[styles.socialBtnWrapper, { transform: [{ scale: googleBtnScale }] }]}>
                    <TouchableOpacity
                      style={[
                        styles.socialButton,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.09)' : '#E2E8F0',
                        },
                      ]}
                      onPress={handleGoogleAuth}
                      onPressIn={() => handlePressIn(googleBtnScale)}
                      onPressOut={() => handlePressOut(googleBtnScale)}
                      activeOpacity={0.85}
                    >
                      <GoogleGIcon size={18} />
                      <Text
                        style={[styles.socialButtonText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                        numberOfLines={1}
                      >
                        Google
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View style={[styles.socialBtnWrapper, { transform: [{ scale: appleBtnScale }] }]}>
                    <TouchableOpacity
                      style={[
                        styles.socialButton,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#000000',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.09)' : '#000000',
                        },
                      ]}
                      onPress={handleAppleAuth}
                      onPressIn={() => handlePressIn(appleBtnScale)}
                      onPressOut={() => handlePressOut(appleBtnScale)}
                      activeOpacity={0.85}
                    >
                      <AppleIcon size={18} color="#FFFFFF" />
                      <Text
                        style={[
                          styles.socialButtonText,
                          { color: '#FFFFFF' },
                        ]}
                        numberOfLines={1}
                      >
                        Apple
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>

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
    marginBottom: 18,
    marginTop: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  titleSection: {
    marginBottom: 18,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0A1838',
    letterSpacing: -0.6,
    lineHeight: 33,
  },
  mainTitleAccent: {
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 6,
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  formContainer: {
    marginTop: 0,
  },
  inputGroup: {
    marginBottom: 13,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  halfInputGroupLeft: {
    flex: 1,
    marginRight: 6,
  },
  halfInputGroupRight: {
    flex: 1,
    marginLeft: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: -0.1,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    borderColor: '#3B82F6',
    shadowColor: '#2563EB',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIconBox: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 14.5,
    fontWeight: '500',
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  phoneInputWrapper: {
    paddingLeft: 4,
    paddingRight: 14,
  },
  countryPickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 8,
    paddingRight: 10,
    marginRight: 8,
    borderRightWidth: 1.2,
    gap: 6,
  },
  countryFlagEmoji: {
    fontSize: 18,
  },
  countryDialCodeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  phoneTextInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 2,
  },
  countryDropdownMenu: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  dropdownSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 6,
    gap: 8,
  },
  dropdownSearchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearSearchText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
  },
  dropdownItemFlag: {
    fontSize: 18,
  },
  dropdownItemName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  dropdownItemDialCode: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  dropdownCheckmarkBox: {
    marginLeft: 4,
  },
  emptyDropdownNotice: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDropdownText: {
    fontSize: 13,
    fontWeight: '500',
  },
  eyeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  primaryButton: {
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  primaryButtonArrow: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: Platform.OS === 'ios' ? 1 : 0,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialBtnWrapper: {
    flex: 1,
  },
  socialButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  toggleModeRow: {
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  togglePromptText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: -0.2,
  },
  toggleLinkText: {
    fontWeight: '700',
    color: '#2563EB',
  },
  ambientGlowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    overflow: 'hidden',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  errorActionCol: {
    marginTop: 10,
    alignItems: 'center',
    gap: 8,
  },
  resendBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  resendBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resendStatusText: {
    color: '#B91C1C',
    fontSize: 11.5,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  offlineFallbackBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 4,
  },
  offlineFallbackBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
