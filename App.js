import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform, ScrollView, BackHandler, Alert, Linking } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import OnboardingQuestionsScreen from './src/screens/OnboardingQuestionsScreen';
import OnboardingValueScreen from './src/screens/OnboardingValueScreen';
import AppLockPreviewScreen from './src/screens/AppLockPreviewScreen';
import OnboardingGoalScreen from './src/screens/OnboardingGoalScreen';
import OnboardingSubjectsScreen from './src/screens/OnboardingSubjectsScreen';
import OnboardingStudyRoutineScreen from './src/screens/OnboardingStudyRoutineScreen';
import OnboardingTargetScreen from './src/screens/OnboardingTargetScreen';
import OnboardingPomodoroScreen from './src/screens/OnboardingPomodoroScreen';
import OnboardingSystemBuildingScreen from './src/screens/OnboardingSystemBuildingScreen';
import OnboardingStudyPlanDetailsScreen from './src/screens/OnboardingStudyPlanDetailsScreen';
import OnboardingMakeItRealScreen from './src/screens/OnboardingMakeItRealScreen';
import OnboardingHearAboutUsScreen from './src/screens/OnboardingHearAboutUsScreen';
import OnboardingStudyProtectionScreen from './src/screens/OnboardingStudyProtectionScreen';
import OnboardingPowerBuiltScreen from './src/screens/OnboardingPowerBuiltScreen';
import OnboardingTrialReminderScreen from './src/screens/OnboardingTrialReminderScreen';
import OnboardingPaywallScreen from './src/screens/OnboardingPaywallScreen';
import OnboardingCreateAccountScreen from './src/screens/OnboardingCreateAccountScreen';
import OnboardingAppReadyScreen from './src/screens/OnboardingAppReadyScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import AiCoachScreen from './src/screens/AiCoachScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StudyScreen from './src/screens/StudyScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatsScreen from './src/screens/StatsScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import FocusModeScreen from './src/screens/FocusModeScreen';
import HelpScreen from './src/screens/HelpScreen';
import { Colors } from './src/theme/colors';
import { gamificationService } from './src/services/gamification/gamificationService';
import { settingsService } from './src/services/settings/settingsService';
import { studyService } from './src/services/studyService';
import { timetableService } from './src/services/timetable';
import LevelUpModal from './src/components/LevelUpModal';
import BottomNavBar from './src/components/BottomNavBar';
import { ipLocationService } from './src/services/ipLocationService';
import { ThemeProvider, useTheme } from './src/theme/themeContext';
import { TooltipProvider } from './src/context/TooltipContext';
import TooltipTouchable from './src/components/TooltipTouchable';
import {
  authService,
  profileService,
  gamificationSupabaseService,
  studySupabaseService,
  settingsSupabaseService,
  isSupabaseConfigured,
} from './src/services/supabase';
import { offlineSyncService } from './src/services/offlineSyncService';
import { networkService } from './src/services/networkService';

// Hide all web scrollbars globally and ensure full-height container with universal button bounce
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'studpal-global-web-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      html, body, #root {
        height: 100% !important;
        min-height: 100vh !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
        width: 0px !important;
        height: 0px !important;
        background: transparent !important;
      }
      * {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      input, textarea {
        outline: none !important;
        border-style: none !important;
        border-width: 0px !important;
        background-color: transparent !important;
      }
      /* Clean universal autofill override to eliminate abnormal browser blue/yellow boxes */
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus,
      textarea:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
        box-shadow: 0 0 0 1000px #ffffff inset !important;
        -webkit-text-fill-color: #0F172A !important;
        transition: background-color 5000000s ease-in-out 0s !important;
      }

      /* Screen backgrounds and full layout containers MUST NEVER bounce or scale */
      html, body, #root,
      [data-no-bounce],
      [data-no-bounce]:active,
      [data-no-bounce="true"],
      [data-no-bounce="true"]:active,
      .no-bounce-bg,
      .no-bounce-bg:active,
      [role="button"][data-no-bounce],
      [role="button"][data-no-bounce]:active,
      [role="button"].no-bounce-bg,
      [role="button"].no-bounce-bg:active,
      [role="main"],
      [role="region"],
      [role="dialog"],
      [role="document"],
      [role="feed"],
      [role="tabpanel"],
      [role="textbox"],
      div[style*="height: 100%"],
      div[style*="height:100%"],
      div[style*="min-height: 100%"],
      div[style*="min-height:100%"] {
        transform: none !important;
        transition: none !important;
      }

      /* Scale down and bounce back on click ONLY for actual buttons, options, and interactive controls */
      button:not([data-no-bounce]):not(.no-bounce-bg),
      [role="button"]:not(input):not(textarea):not([data-no-bounce]):not(.no-bounce-bg),
      a:not([data-no-bounce]):not(.no-bounce-bg),
      .btn-next,
      .btn-icon-back,
      .role-card,
      .social-btn,
      .goal-card,
      [data-testid*="button"],
      [data-testid*="Button"],
      [data-testid*="btn"],
      [data-testid*="Btn"],
      [data-testid*="card"],
      [data-testid*="Card"],
      [data-testid*="option"],
      [data-testid*="Option"] {
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease, box-shadow 0.2s ease !important;
        will-change: transform;
        transform-origin: center center;
      }

      button:not([data-no-bounce]):not(.no-bounce-bg):active,
      [role="button"]:not(input):not(textarea):not([data-no-bounce]):not(.no-bounce-bg):active,
      a:not([data-no-bounce]):not(.no-bounce-bg):active,
      .btn-next:active,
      .btn-icon-back:active,
      .role-card:active,
      .social-btn:active,
      .goal-card:active,
      [data-testid*="button"]:active,
      [data-testid*="Button"]:active,
      [data-testid*="btn"]:active,
      [data-testid*="Btn"]:active,
      [data-testid*="card"]:active,
      [data-testid*="Card"]:active,
      [data-testid*="option"]:active,
      [data-testid*="Option"]:active {
        transform: scale(0.92) !important;
        transition: transform 0.08s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#FEF2F2', padding: 24, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#991B1B', marginBottom: 12 }}>App Crashed 🚨</Text>
          <ScrollView style={{ width: '100%', maxHeight: 400, backgroundColor: '#FFF5F5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5' }}>
            <Text style={{ fontSize: 13, color: '#7F1D1D', fontFamily: 'monospace' }}>
              {this.state.error && this.state.error.toString()}
            </Text>
            <Text style={{ fontSize: 11, color: '#7F1D1D', marginTop: 10, fontFamily: 'monospace' }}>
              {this.state.error && this.state.error.stack}
            </Text>
          </ScrollView>
          <TouchableOpacity 
            style={{ marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#EF4444', borderRadius: 8 }}
            onPress={() => {
              if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
                window.location.reload();
              } else {
                this.setState({ hasError: false, error: null });
              }
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { isDark, colors, settings: appSettings } = useTheme();

  // Navigation State: 'onboarding-problem', 'dashboard', 'subjects', 'aicoach', etc.
  const [currentRoute, setCurrentRoute] = useState('onboarding-problem');
  const [onboardingData, setOnboardingData] = useState({
    name: 'Alex',
    goal: null,
    phoneTime: '4–5 hours',
    targetData: { label: 'In 3 months', days: 90 },
    subjects: ['Mathematics', 'Economics', 'Computer Science'],
    focusSubject: 'Mathematics',
    confidence: 'I understand the basics',
    dailyStudyTime: '1–2 hours',
    studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    sessionLength: '45 min',
    studyTime: 'night',
    studyTimeOfDay: 'night',
    usePomodoro: true,
    learningPreferences: {
      personalizedStudyPlans: true,
      advancedSpacedRepetition: true,
      aiStudyCompanion: true,
      practiceQuizzes: true,
      studyCommunity: true,
      progressInsights: true,
    },
  });
  const [user, setUser] = useState({
    name: 'Alex',
    email: '',
    avatarUri: null,
    avatarEmoji: '👨‍🎓',
    country: 'Nigeria',
    countryCode: ipLocationService.getCountryCode() || 'NG',
    subjects: ['Mathematics', 'Economics', 'Computer Science'],
    enrolledSubjectIds: ['Mathematics', 'Economics', 'Computer Science'],
  });
  const [showNavDebugger, setShowNavDebugger] = useState(false);
  const [pendingLevelUp, setPendingLevelUp] = useState(null);
  const [createAccountMode, setCreateAccountMode] = useState('signup');

  // Synchronize study service with initial subjects
  useEffect(() => {
    const initSubjects = onboardingData.subjects || user.subjects || ['Mathematics', 'Economics', 'Computer Science'];
    studyService.syncUserSubjects(initSubjects);
  }, []);

  useEffect(() => {
    const unsubIp = ipLocationService.subscribe((code) => {
      if (code && typeof code === 'string' && code.length === 2) {
        const upper = code.toUpperCase();
        setUser((prev) => (prev.countryCode !== upper ? { ...prev, countryCode: upper } : prev));
      }
    });
    const unsubscribeGamification = gamificationService.subscribe((gState) => {
      if (gState.pendingLevelUp) {
        setPendingLevelUp(gState.pendingLevelUp);
      }
    });
    return () => {
      unsubIp();
      unsubscribeGamification();
    };
  }, []);

  // Supabase Auth and Session Synchronization
  useEffect(() => {
    let mounted = true;

    async function checkInitialSupabaseSession() {
      try {
        // 1. Immediately hydrate local cached profile and onboarding if available (100% offline-ready)
        const cachedProfile = await offlineSyncService.getCachedLocalProfile();
        if (cachedProfile && mounted) {
          setUser((prev) => ({
            ...prev,
            ...cachedProfile,
          }));
          setCurrentRoute('dashboard');
          setNavHistory(['dashboard']);
        }

        const cachedOnboarding = await offlineSyncService.getCachedLocalOnboarding();
        if (cachedOnboarding && mounted) {
          setOnboardingData((prev) => ({
            ...prev,
            ...cachedOnboarding,
          }));
        }

        // 2. If offline, don't stall on network requests
        if (!networkService.isOnline()) {
          console.log('[App] Operating offline, initialized from local cache.');
          return;
        }

        // 3. Online: sync session and profile from Supabase
        const { data } = await authService.getSession();
        const session = data?.session;
        if (session?.user && mounted) {
          const profile = await profileService.getProfile(session.user.id);
          const updatedUser = {
            id: session.user.id,
            name: profile?.full_name || profile?.username || session.user.user_metadata?.full_name || session.user.user_metadata?.username || (cachedProfile?.name || 'Alex'),
            email: session.user.email || cachedProfile?.email || '',
            avatarUri: profile?.avatar_url || cachedProfile?.avatarUri || null,
            avatarEmoji: profile?.avatar_emoji || cachedProfile?.avatarEmoji || '👨‍🎓',
            country: profile?.country || cachedProfile?.country || 'Nigeria',
            countryCode: profile?.country_code || cachedProfile?.countryCode || 'NG',
            subjects: profile?.subjects || cachedProfile?.subjects || ['Mathematics', 'Economics', 'Computer Science'],
            enrolledSubjectIds: profile?.subjects || cachedProfile?.enrolledSubjectIds || ['Mathematics', 'Economics', 'Computer Science'],
          };
          setUser((prev) => ({
            ...prev,
            ...updatedUser,
          }));
          await offlineSyncService.cacheLocalProfile(updatedUser);

          const remoteOnboarding = await profileService.getOnboardingData(session.user.id);
          if (remoteOnboarding && mounted) {
            const updatedOnboarding = {
              name: remoteOnboarding.name || cachedOnboarding?.name || 'Alex',
              goal: remoteOnboarding.goal || cachedOnboarding?.goal || '',
              subjects: remoteOnboarding.subjects || cachedOnboarding?.subjects || ['Mathematics', 'Economics', 'Computer Science'],
            };
            setOnboardingData((prev) => ({
              ...prev,
              ...updatedOnboarding,
            }));
            await offlineSyncService.cacheLocalOnboarding(updatedOnboarding);
          }

          const remoteSettings = await settingsSupabaseService.getUserSettings(session.user.id);
          if (remoteSettings) {
            settingsService.updateSettings(remoteSettings);
          }

          // Trigger queue processing for any pending offline actions
          offlineSyncService.processQueue().catch(() => {});

          setCurrentRoute('dashboard');
          setNavHistory(['dashboard']);
        }
      } catch (err) {
        console.warn('[App] Supabase session check notice:', err);
      }
    }

    checkInitialSupabaseSession();

    const { data: authSub } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' && mounted) {
        setUser({
          name: 'Alex',
          email: '',
          avatarUri: null,
          avatarEmoji: '👨‍🎓',
          country: 'Nigeria',
          countryCode: ipLocationService.getCountryCode() || 'NG',
          subjects: ['Mathematics', 'Economics', 'Computer Science'],
          enrolledSubjectIds: ['Mathematics', 'Economics', 'Computer Science'],
        });
        setCurrentRoute('onboarding-create-account');
        setCreateAccountMode('login');
      } else if (event === 'SIGNED_IN' && session?.user && mounted) {
        const profile = await profileService.getProfile(session.user.id);
        const signedInUser = {
          id: session.user.id,
          name: profile?.full_name || profile?.username || session.user.user_metadata?.full_name || 'Alex',
          email: session.user.email || '',
          avatarUri: profile?.avatar_url || null,
          avatarEmoji: profile?.avatar_emoji || '👨‍🎓',
          country: profile?.country || 'Nigeria',
          countryCode: profile?.country_code || 'NG',
        };
        setUser((prev) => ({
          ...prev,
          ...signedInUser,
        }));
        await offlineSyncService.cacheLocalProfile(signedInUser);
        offlineSyncService.processQueue().catch(() => {});
        setCurrentRoute('dashboard');
        setNavHistory(['dashboard']);
      }
    });

    // Deep linking for mobile OAuth redirect callbacks
    let linkingSub = null;
    if (Platform.OS !== 'web') {
      Linking.getInitialURL().then((url) => {
        if (url) authService.handleOpenUrl(url);
      }).catch(() => {});
      linkingSub = Linking.addEventListener('url', ({ url }) => {
        if (url) authService.handleOpenUrl(url);
      });
    }

    return () => {
      mounted = false;
      if (authSub?.subscription?.unsubscribe) {
        authSub.subscription.unsubscribe();
      }
      if (linkingSub?.remove) {
        linkingSub.remove();
      }
    };
  }, []);

  const handleCloseLevelUpModal = () => {
    setPendingLevelUp(null);
    gamificationService.clearPendingLevelUp();
  };

  const handleUpdateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      // Cache locally immediately (100% offline)
      offlineSyncService.cacheLocalProfile(next);

      if (next.id) {
        const profilePayload = {
          full_name: next.name,
          avatar_url: next.avatarUri,
          avatar_emoji: next.avatarEmoji,
          country: next.country,
          country_code: next.countryCode,
        };

        if (networkService.isOnline()) {
          profileService.updateProfile(next.id, profilePayload);
        } else {
          // Enqueue for background sync when connection is restored
          offlineSyncService.enqueueAction('PROFILE_UPDATE', profilePayload);
        }
      }
      return next;
    });
  };

  const [aiInitialPrompt, setAiInitialPrompt] = useState(null);
  const [srsReturnState, setSrsReturnState] = useState(null);
  const [navHistory, setNavHistory] = useState(['dashboard']);
  const [aiCoachShowHistory, setAiCoachShowHistory] = useState(false);
  const [studyViewState, setStudyViewState] = useState('overview');

  const handleNavigate = (route, params = null) => {
    if (route === 'auth') {
      setCreateAccountMode('login');
      setCurrentRoute('onboarding-create-account');
      return;
    }
    if (route === 'aicoach' && params) {
      setAiInitialPrompt(params);
    }
    if (route === 'study' && params) {
      setSrsReturnState(params);
    }
    setNavHistory((prev) => {
      if (prev[prev.length - 1] === route) return prev;
      return [...prev, route];
    });
    setCurrentRoute(route);
  };

  const handleBackNavigation = () => {
    setNavHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentRoute('dashboard');
        return ['dashboard'];
      }
      const newStack = [...prev];
      newStack.pop();
      const targetRoute = newStack[newStack.length - 1] || 'dashboard';
      if (targetRoute === 'aicoach') {
        setAiCoachShowHistory(true);
      }
      setCurrentRoute(targetRoute);
      return newStack;
    });
  };

  const handleBackFromResourcesOrLibrary = () => {
    setAiCoachShowHistory(true);
    setNavHistory((prev) => {
      const newStack = [...prev];
      newStack.pop();
      const targetRoute = newStack[newStack.length - 1];
      const nextRoute = (targetRoute && targetRoute !== 'resources' && targetRoute !== 'library')
        ? targetRoute
        : 'aicoach';
      setCurrentRoute(nextRoute);
      return targetRoute ? newStack : ['dashboard', 'aicoach'];
    });
  };

  // Native mobile back button handling (hardware button and gesture back)
  useEffect(() => {
    const onHardwareBackPress = () => {
      // 1. Dismiss nav debugger if open
      if (showNavDebugger) {
        setShowNavDebugger(false);
        return true;
      }

      // 2. Dismiss pending level-up celebration modal
      if (pendingLevelUp) {
        handleCloseLevelUpModal();
        return true;
      }

      // 3. Handle special sub-screen returns
      if (currentRoute === 'resources' || currentRoute === 'library') {
        handleBackFromResourcesOrLibrary();
        return true;
      }

      // 4. Handle onboarding sequence back steps
      if (currentRoute === 'onboarding-paywall') {
        setCurrentRoute('onboarding-trial-reminder');
        return true;
      }
      if (currentRoute === 'onboarding-trial-reminder') {
        setCurrentRoute('onboarding-study-protection');
        return true;
      }
      if (currentRoute === 'onboarding-study-protection') {
        setCurrentRoute('onboarding-make-it-real');
        return true;
      }
      if (currentRoute === 'onboarding-make-it-real') {
        setCurrentRoute('onboarding-system-building');
        return true;
      }
      if (currentRoute === 'onboarding-system-building') {
        setCurrentRoute('onboarding-pomodoro');
        return true;
      }
      if (currentRoute === 'onboarding-pomodoro') {
        setCurrentRoute('onboarding-target');
        return true;
      }
      if (currentRoute === 'onboarding-target') {
        setCurrentRoute('onboarding-study-routine');
        return true;
      }
      if (currentRoute === 'onboarding-study-routine') {
        setCurrentRoute('onboarding-subjects');
        return true;
      }
      if (currentRoute === 'onboarding-subjects') {
        setCurrentRoute('onboarding-goal');
        return true;
      }
      if (currentRoute === 'onboarding-goal') {
        setCurrentRoute('onboarding-hear-about-us');
        return true;
      }
      if (currentRoute === 'onboarding-hear-about-us') {
        setCurrentRoute('onboarding-create-account');
        return true;
      }
      if (currentRoute === 'onboarding-create-account') {
        setCurrentRoute('onboarding-lock');
        return true;
      }
      if (currentRoute === 'onboarding-lock') {
        setCurrentRoute('onboarding-solution');
        return true;
      }
      if (currentRoute === 'onboarding-solution') {
        setCurrentRoute('onboarding-problem');
        return true;
      }
      if (currentRoute === 'onboarding-problem' || currentRoute === 'onboarding') {
        return false;
      }

      // 5. Navigate back in history stack if more than one screen visited
      if (navHistory.length > 1) {
        handleBackNavigation();
        return true;
      }

      // 6. If on any non-dashboard screen (and not onboarding), return to dashboard
      if (currentRoute !== 'dashboard' && currentRoute !== 'onboarding' && currentRoute !== 'onboarding-problem') {
        setCurrentRoute('dashboard');
        setNavHistory(['dashboard']);
        return true;
      }

      // 7. On root dashboard or onboarding screen: return false to allow native OS behavior (exit/minimize)
      return false;
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBackPress
    );

    return () => {
      backSubscription.remove();
    };
  }, [
    navHistory,
    currentRoute,
    showNavDebugger,
    pendingLevelUp,
  ]);

  const handleTabSelect = (tab, params = null) => {
    let targetRoute = 'dashboard';
    if (tab === 'home') targetRoute = 'dashboard';
    else if (tab === 'community') targetRoute = 'community';
    else if (tab === 'aicoach') targetRoute = 'aicoach';
    else if (tab === 'schedule') targetRoute = 'schedule';
    else if (tab === 'profile') targetRoute = 'profile';
    else if (tab === 'stats' || tab === 'metrics') targetRoute = 'stats';
    else if (tab === 'subjects') targetRoute = 'subjects';
    else if (tab === 'study') targetRoute = 'study';
    else if (tab === 'help') targetRoute = 'help';

    handleNavigate(targetRoute, params);
  };

  // Render current active screen
  const renderScreen = () => {
    switch (currentRoute) {
      case 'onboarding':
      case 'onboarding-problem':
        return (
          <OnboardingQuestionsScreen
            onContinue={() => {
              setCurrentRoute('onboarding-solution');
            }}
          />
        );
      case 'onboarding-solution':
        return (
          <OnboardingValueScreen
            onContinue={() => {
              setCurrentRoute('onboarding-lock');
            }}
          />
        );
      case 'onboarding-lock':
        return (
          <AppLockPreviewScreen
            onContinue={() => {
              setCurrentRoute('onboarding-create-account');
            }}
            onBack={() => setCurrentRoute('onboarding-solution')}
          />
        );
      case 'onboarding-save-account':
      case 'onboarding-create-account':
        return (
          <OnboardingCreateAccountScreen
            initialMode={createAccountMode}
            defaultFirstName={user.firstName || ''}
            defaultLastName={user.lastName || ''}
            defaultPhoneNumber={user.phoneNumber || ''}
            defaultUsername={onboardingData.name || (user.name !== 'Alex' ? user.name : '')}
            defaultEmail={user.email || ''}
            onContinue={async (accData) => {
              if (accData?.mode === 'signup') {
                const preferredName = accData.firstName || accData.username || onboardingData.name || user.name;
                const computedFullName = accData.fullName || (accData.firstName && accData.lastName ? `${accData.firstName} ${accData.lastName}` : (accData.username || onboardingData.name));
                const signUpResult = await authService.signUp({
                  email: accData.email,
                  password: accData.password,
                  username: accData.username,
                  fullName: computedFullName,
                  metadata: {
                    firstName: accData.firstName,
                    lastName: accData.lastName,
                    fullName: computedFullName,
                    phoneNumber: accData.phoneNumber,
                    country: accData.countryCode || user.country,
                    countryCode: accData.countryCode || user.countryCode,
                  },
                });

                if (signUpResult.error && !accData?.forceOffline) {
                  return { error: signUpResult.error };
                }

                const data = signUpResult.data;
                const userId = data?.user?.id || 'local_user_' + Date.now();
                const newUser = {
                  ...user,
                  id: userId,
                  name: preferredName,
                  firstName: accData?.firstName || user.firstName,
                  lastName: accData?.lastName || user.lastName,
                  phoneNumber: accData?.phoneNumber || user.phoneNumber,
                  countryCode: accData?.countryCode || user.countryCode,
                  username: accData?.username || user.username,
                  email: accData?.email || user.email,
                };
                setUser(newUser);
                await offlineSyncService.cacheLocalProfile(newUser);
                await offlineSyncService.cacheLocalOnboarding({
                  ...onboardingData,
                  name: preferredName,
                  firstName: accData.firstName,
                  lastName: accData.lastName,
                  phoneNumber: accData.phoneNumber,
                  countryCode: accData.countryCode || user.countryCode,
                });

                if (userId && data?.session) {
                  await profileService.saveOnboardingData(userId, {
                    ...onboardingData,
                    name: preferredName,
                    firstName: accData.firstName,
                    lastName: accData.lastName,
                    phoneNumber: accData.phoneNumber,
                  });
                  await studySupabaseService.syncUserSubjects(
                    userId,
                    onboardingData.subjects || user.subjects
                  );
                  await gamificationSupabaseService.syncProgress(
                    userId,
                    gamificationService.getState()
                  );
                } else {
                  // Enqueue sync for when the session is confirmed or back online
                  offlineSyncService.enqueueAction('USER_SUBJECTS', onboardingData.subjects || user.subjects);
                }

                setCurrentRoute('onboarding-hear-about-us');
                return {
                  success: true,
                  emailConfirmationPending: signUpResult.emailConfirmationPending,
                  isLocalFallback: signUpResult.isLocalFallback,
                };
              } else {
                // Login mode
                const loginResult = await authService.signIn({
                  email: accData.email,
                  password: accData.password,
                });

                if (loginResult.error) {
                  return { error: loginResult.error, isEmailNotConfirmed: loginResult.isEmailNotConfirmed };
                }

                const data = loginResult.data;
                const userId = data?.user?.id;
                if (userId) {
                  let profile = null;
                  if (data?.session) {
                    profile = await profileService.getProfile(userId);
                  }
                  const loggedInUser = {
                    ...user,
                    id: userId,
                    name: profile?.full_name || profile?.username || data.user.user_metadata?.full_name || data.user.user_metadata?.username || user.name,
                    email: data.user.email || user.email,
                    avatarUri: profile?.avatar_url || user.avatarUri,
                    country: profile?.country || user.country,
                  };
                  setUser(loggedInUser);
                  await offlineSyncService.cacheLocalProfile(loggedInUser);
                  if (data?.session) {
                    const remoteSettings = await settingsSupabaseService.getUserSettings(userId);
                    if (remoteSettings) {
                      settingsService.updateSettings(remoteSettings);
                    }
                  }
                }

                setCurrentRoute('dashboard');
                setNavHistory(['dashboard']);
                return { success: true };
              }
            }}
            onGoogleSignIn={async () => {
              const res = await authService.signInWithGoogle();
              if (res?.error) {
                const msg = res.error.message || 'Unable to start Google sign in.';
                if (msg.includes('Unsupported provider') || msg.includes('not enabled')) {
                  Alert.alert(
                    'Google Sign-In',
                    'Google sign-in is not yet enabled in your Supabase project.\n\nPlease enable the Google provider in your Supabase Dashboard:\nAuthentication → Providers → Google'
                  );
                } else {
                  Alert.alert('Google Sign-In', msg);
                }
              } else {
                setCurrentRoute('onboarding-hear-about-us');
              }
            }}
            onAppleSignIn={async () => {
              const res = await authService.signInWithApple();
              if (res?.error) {
                const msg = res.error.message || 'Unable to start Apple sign in.';
                if (msg.includes('Unsupported provider') || msg.includes('not enabled')) {
                  Alert.alert(
                    'Apple Sign-In',
                    'Apple sign-in is not yet enabled in your Supabase project.\n\nPlease enable the Apple provider in your Supabase Dashboard:\nAuthentication → Providers → Apple'
                  );
                } else {
                  Alert.alert('Apple Sign-In', msg);
                }
              } else {
                setCurrentRoute('onboarding-hear-about-us');
              }
            }}
            onBack={() => setCurrentRoute('onboarding-lock')}
          />
        );
      case 'onboarding-hear-about-us':
        return (
          <OnboardingHearAboutUsScreen
            initialSelection={onboardingData.referralSource || 'youtube'}
            onContinue={(source) => {
              setOnboardingData((prev) => ({ ...prev, referralSource: source }));
              setCurrentRoute('onboarding-goal');
            }}
            onBack={() => setCurrentRoute('onboarding-create-account')}
          />
        );
      case 'onboarding-partner':
      case 'onboarding-name':
      case 'onboarding-goal':
        return (
          <OnboardingGoalScreen
            onContinue={(goalData) => {
              setOnboardingData((prev) => ({ ...prev, goal: goalData }));
              setCurrentRoute('onboarding-subjects');
            }}
            onBack={() => setCurrentRoute('onboarding-hear-about-us')}
          />
        );
      case 'onboarding-subjects':
        return (
          <OnboardingSubjectsScreen
            initialSelected={onboardingData.subjects || ['Mathematics', 'English', 'Science']}
            onContinue={(selectedSubjects) => {
              setOnboardingData((prev) => ({
                ...prev,
                subjects: selectedSubjects,
                focusSubject: selectedSubjects[0] || 'Mathematics',
              }));
              studyService.syncUserSubjects(selectedSubjects);
              setCurrentRoute('onboarding-study-routine');
            }}
            onBack={() => setCurrentRoute('onboarding-goal')}
          />
        );
      case 'onboarding-study-days':
      case 'onboarding-study-time-of-day':
      case 'onboarding-study-routine':
        return (
          <OnboardingStudyRoutineScreen
            initialTime={onboardingData.studyTime || 'night'}
            initialDays={onboardingData.studyDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
            onContinue={(routineData) => {
              setOnboardingData((prev) => ({
                ...prev,
                studyTime: routineData.availableTime,
                studyDays: routineData.studyDays,
              }));
              setCurrentRoute('onboarding-target');
            }}
            onBack={() => setCurrentRoute('onboarding-subjects')}
          />
        );
      case 'onboarding-target':
        return (
          <OnboardingTargetScreen
            initialValue={
              typeof onboardingData.targetData === 'string'
                ? onboardingData.targetData
                : onboardingData.targetData?.label || 'In 3 months'
            }
            onContinue={(targetObj) => {
              setOnboardingData((prev) => ({
                ...prev,
                targetData: targetObj,
              }));
              setCurrentRoute('onboarding-pomodoro');
            }}
            onBack={() => setCurrentRoute('onboarding-study-routine')}
          />
        );
      case 'onboarding-pomodoro':
        return (
          <OnboardingPomodoroScreen
            initialValue={onboardingData.usePomodoro ?? true}
            onContinue={(usePomodoro, optionObj) => {
              setOnboardingData((prev) => ({
                ...prev,
                usePomodoro,
                sessionLength: usePomodoro ? '25 min' : '45 min',
              }));
              setCurrentRoute('onboarding-system-building');
            }}
            onBack={() => setCurrentRoute('onboarding-target')}
          />
        );
      case 'onboarding-confidence':
      case 'onboarding-daily-study-time':
      case 'onboarding-session-length':
      case 'onboarding-plan-summary':
      case 'onboarding-system-building':
        return (
          <OnboardingSystemBuildingScreen
            userName={onboardingData.name || user.name}
            onboardingData={onboardingData}
            onContinue={() => {
              setCurrentRoute('onboarding-make-it-real');
            }}
            onBack={() => setCurrentRoute('onboarding-pomodoro')}
          />
        );
      case 'onboarding-first-milestone':
      case 'onboarding-built-summary':
      case 'onboarding-seriousness-level':
      case 'onboarding-make-it-real':
        return (
          <OnboardingMakeItRealScreen
            onContinue={() => {
              setCurrentRoute('onboarding-study-protection');
            }}
            onBack={() => setCurrentRoute('onboarding-system-building')}
          />
        );
      case 'onboarding-reminder-permission':
      case 'onboarding-study-protection':
        return (
          <OnboardingStudyProtectionScreen
            onContinue={(enabled) => {
              setOnboardingData((prev) => ({ ...prev, focusProtectionEnabled: enabled }));
              setCurrentRoute('onboarding-trial-reminder');
            }}
            onSkip={() => {
              setOnboardingData((prev) => ({ ...prev, focusProtectionEnabled: false }));
              setCurrentRoute('onboarding-trial-reminder');
            }}
            onBack={() => setCurrentRoute('onboarding-make-it-real')}
          />
        );
      case 'onboarding-7day-roadmap':
      case 'onboarding-trial-reminder':
        return (
          <OnboardingTrialReminderScreen
            onContinue={() => {
              setCurrentRoute('onboarding-paywall');
            }}
            onBack={() => setCurrentRoute('onboarding-study-protection')}
          />
        );
      case 'onboarding-paywall':
        return (
          <OnboardingPaywallScreen
            onContinue={(selectedPlan) => {
              timetableService.getOrGenerateTimetable(user, onboardingData).catch(() => {});
              setCurrentRoute('dashboard');
              setNavHistory(['dashboard']);
            }}
            onBack={() => setCurrentRoute('onboarding-trial-reminder')}
          />
        );
      case 'community':
        return (
          <CommunityScreen
            user={user}
            settings={appSettings}
            onSelectTab={handleTabSelect}
            onNavigate={handleNavigate}
          />
        );
      case 'subjects':
        return (
          <SubjectsScreen
            user={user}
            userSubjects={onboardingData.subjects || user.subjects}
            settings={appSettings}
            onSelectTab={handleTabSelect}
            onNavigate={handleNavigate}
            onBack={handleBackNavigation}
          />
        );
      case 'aicoach':
        return (
          <AiCoachScreen
            user={user}
            userSubjects={onboardingData.subjects || user.subjects}
            settings={appSettings}
            initialPrompt={aiInitialPrompt}
            onClearInitialPrompt={() => setAiInitialPrompt(null)}
            initialShowHistory={aiCoachShowHistory}
            onClearInitialShowHistory={() => setAiCoachShowHistory(false)}
            onSelectTab={handleTabSelect}
            onNavigate={handleNavigate}
            onBack={handleBackNavigation}
          />
        );
      case 'study':
        return (
          <StudyScreen
            user={user}
            userSubjects={onboardingData.subjects || user.subjects}
            settings={appSettings}
            onSelectTab={handleTabSelect}
            onNavigate={handleNavigate}
            initialSrsState={srsReturnState}
            onClearInitialSrsState={() => setSrsReturnState(null)}
            onViewStateChange={(vs) => setStudyViewState(vs)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            settings={appSettings}
            onUpdateUser={handleUpdateUser}
            onSelectTab={handleTabSelect}
            onNavigate={handleNavigate}
          />
        );
      case 'stats':
      case 'metrics':
        return (
          <StatsScreen
            user={user}
            settings={appSettings}
            onSelectTab={handleTabSelect}
            onNavigate={handleNavigate}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            user={user}
            settings={appSettings}
            onUpdateUser={handleUpdateUser}
            onBack={handleBackNavigation}
            onNavigate={handleNavigate}
            onSelectTab={handleTabSelect}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardScreen
            user={user}
            settings={appSettings}
            onUpdateUser={handleUpdateUser}
            onBack={handleBackNavigation}
            onSelectTab={handleTabSelect}
          />
        );
      case 'schedule':
        return (
          <ScheduleScreen
            user={user}
            settings={appSettings}
            onBack={handleBackNavigation}
            onSelectTab={handleTabSelect}
          />
        );
      case 'resources':
        return (
          <ResourcesScreen
            settings={appSettings}
            onBack={handleBackFromResourcesOrLibrary}
            onNavigate={handleNavigate}
          />
        );
      case 'library':
        return (
          <LibraryScreen
            user={user}
            settings={appSettings}
            onBack={handleBackFromResourcesOrLibrary}
            onNavigate={handleNavigate}
          />
        );
      case 'focus-mode':
        return (
          <FocusModeScreen
            user={user}
            settings={appSettings}
            onBack={handleBackNavigation}
            onNavigate={handleNavigate}
          />
        );
      case 'help':
        return (
          <HelpScreen
            user={user}
            settings={appSettings}
            onBack={handleBackNavigation}
            onNavigate={handleNavigate}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardScreen
            user={user}
            userSubjects={onboardingData.subjects || user.subjects}
            settings={appSettings}
            onUpdateUser={handleUpdateUser}
            onSelectTab={handleTabSelect}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  const isWeb = Platform.OS === 'web';

  const ROUTES_WITH_BOTTOM_BAR = [
    'dashboard',
    'community',
    'schedule',
    'profile',
    'subjects',
    'study',
    'stats',
    'metrics',
    'settings',
    'leaderboard',
    'resources',
    'library',
  ];

  const getActiveTabForRoute = (route) => {
    switch (route) {
      case 'dashboard':
        return 'home';
      case 'community':
        return 'community';
      case 'aicoach':
        return 'aicoach';
      case 'schedule':
        return 'schedule';
      case 'profile':
        return 'profile';
      case 'study':
        return 'study';
      case 'stats':
      case 'metrics':
        return 'stats';
      default:
        return 'none';
    }
  };

  const webFrameMetrics = {
    insets: { top: 44, bottom: 24, left: 0, right: 0 },
    frame: { x: 0, y: 0, width: 390, height: 844 },
  };

  const appContent = (
    <SafeAreaProvider
      style={{ flex: 1, width: '100%', height: '100%' }}
      initialMetrics={Platform.OS === 'web' ? webFrameMetrics : initialWindowMetrics}
    >
      <View style={[styles.rootContainer, isDark && { backgroundColor: '#0B0F19' }]}>
        <ExpoStatusBar style={isDark ? 'light' : 'dark'} translucent backgroundColor="transparent" />
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

        {/* Screen Render - Glitch-free and rock-solid */}
        <View style={styles.screenWrapper}>
          {renderScreen()}
        </View>

        {/* Persistent Static Bottom Navigation Bar (Visible across main app screens, hidden in full-screen note-editor) */}
        {ROUTES_WITH_BOTTOM_BAR.includes(currentRoute) && !(currentRoute === 'study' && studyViewState === 'note-editor') && (
          <BottomNavBar
            key="bottom-nav-bar-v2"
            activeTab={getActiveTabForRoute(currentRoute)}
            onSelectTab={handleTabSelect}
          />
        )}

        {/* Level Up Celebration Modal */}
        <LevelUpModal
          levelInfo={pendingLevelUp}
          visible={!!pendingLevelUp}
          onClose={handleCloseLevelUpModal}
        />

        {/* Floating Quick Screen Switcher (Collapsed by default, tap to open) */}
        <View style={styles.floatingNavContainer} pointerEvents="box-none">
          {showNavDebugger ? (
            <View style={styles.floatingBar}>
              <View style={styles.floatingBarHeader}>
                <Text style={styles.floatingBarTitle}>Nav Debugger</Text>
                <TouchableOpacity
                  onPress={() => setShowNavDebugger(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.floatingBarClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.pillsScrollView}
                contentContainerStyle={styles.pillsList}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                bounces={true}
              >
                {[
                  { id: 'onboarding-problem', label: '1. Onboarding (Questions)' },
                  { id: 'onboarding-solution', label: '2. Onboarding (Value Prop)' },
                  { id: 'onboarding-lock', label: '3. Onboarding (App Lock)' },
                  { id: 'onboarding-create-account', label: '4. Create Account' },
                  { id: 'onboarding-hear-about-us', label: '5. Hear About Us' },
                  { id: 'onboarding-goal', label: '6. Onboarding (Goal)' },
                  { id: 'onboarding-subjects', label: '7. Onboarding (Subjects)' },
                  { id: 'onboarding-study-routine', label: '8. Onboarding (Study Routine)' },
                  { id: 'onboarding-target', label: '9. Onboarding (Target)' },
                  { id: 'onboarding-pomodoro', label: '10. Onboarding (Pomodoro)' },
                  { id: 'onboarding-system-building', label: '11. Building System' },
                  { id: 'onboarding-make-it-real', label: '12. Make It Real' },
                  { id: 'onboarding-study-protection', label: '13. Study Protection' },
                  { id: 'onboarding-trial-reminder', label: '14. Free Trial Reminder' },
                  { id: 'onboarding-paywall', label: '15. Paywall / Checkout' },
                  { id: 'dashboard', label: '16. Dashboard' },
                  { id: 'community', label: '17. Community' },
                  { id: 'subjects', label: '18. Subjects (Workspace)' },
                  { id: 'aicoach', label: '19. Nia' },
                  { id: 'schedule', label: '20. Schedule' },
                  { id: 'profile', label: '21. Profile' },
                  { id: 'study', label: '22. Study & SRS' },
                  { id: 'leaderboard', label: '23. Leaderboard' },
                  { id: 'settings', label: '24. Settings' },
                ].map((item) => {
                  const isActive = currentRoute === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.routePill, isActive && styles.routePillActive]}
                      onPress={() => {
                        setCurrentRoute(item.id);
                        setShowNavDebugger(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.routePillText,
                          isActive && styles.routePillTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            <TooltipTouchable
              tooltip="Screen Switcher"
              style={styles.floatingBadge}
              onPress={() => setShowNavDebugger(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingBadgeText}>Switch Screen</Text>
            </TooltipTouchable>
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );

  if (isWeb) {
    return (
      <ErrorBoundary>
        <View style={[styles.webDesktopBackground, isDark && { backgroundColor: '#06080F' }]}>
          <View style={[styles.deviceFrame, isDark && { backgroundColor: '#1E293B', shadowColor: '#000000' }]}>
            {/* Dynamic Island Notch Removed for visibility */}
            <View style={[styles.phoneScreenWrapper, isDark && { backgroundColor: '#0B0F19' }]}>
              {appContent}
            </View>
          </View>
        </View>
      </ErrorBoundary>
    );
  }

  return <ErrorBoundary>{appContent}</ErrorBoundary>;
}

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  webDesktopBackground: {
    flex: 1,
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    boxSizing: 'border-box',
  },
  deviceFrame: {
    width: '100%',
    maxWidth: 420,
    height: 860,
    maxHeight: '96vh',
    backgroundColor: '#0F172A',
    borderRadius: 44,
    padding: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 20,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  phoneScreenWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    overflow: 'hidden',
    position: 'relative',
  },
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  screenWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: 84,
    right: 14,
    zIndex: 9999,
    maxHeight: '80%',
  },
  floatingBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  floatingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  floatingBar: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 12,
    width: 270,
    maxHeight: 460,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    display: 'flex',
    flexDirection: 'column',
  },
  floatingBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingBarTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  floatingBarClose: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '800',
    padding: 2,
  },
  pillsScrollView: {
    maxHeight: 390,
    flexGrow: 0,
    flexShrink: 1,
  },
  pillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingBottom: 8,
  },
  routePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  routePillActive: {
    backgroundColor: Colors.accent,
  },
  routePillText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  routePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
