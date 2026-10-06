import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform, ScrollView, BackHandler } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import OnboardingScreen from './src/screens/OnboardingScreen';
import OnboardingQuestionsScreen from './src/screens/OnboardingQuestionsScreen';
import OnboardingValueScreen from './src/screens/OnboardingValueScreen';
import AppLockPreviewScreen from './src/screens/AppLockPreviewScreen';
import OnboardingPartnerScreen from './src/screens/OnboardingPartnerScreen';
import OnboardingNameScreen from './src/screens/OnboardingNameScreen';
import OnboardingGoalScreen from './src/screens/OnboardingGoalScreen';
import OnboardingConsiderScreen from './src/screens/OnboardingConsiderScreen';
import OnboardingPhoneTimeScreen from './src/screens/OnboardingPhoneTimeScreen';
import OnboardingTargetScreen from './src/screens/OnboardingTargetScreen';
import OnboardingCalculationScreen from './src/screens/OnboardingCalculationScreen';
import OnboardingPlanOfferScreen from './src/screens/OnboardingPlanOfferScreen';
import OnboardingSubjectsScreen from './src/screens/OnboardingSubjectsScreen';
import OnboardingConfidenceScreen from './src/screens/OnboardingConfidenceScreen';
import OnboardingDailyStudyTimeScreen from './src/screens/OnboardingDailyStudyTimeScreen';
import OnboardingStudyDaysScreen from './src/screens/OnboardingStudyDaysScreen';
import OnboardingSessionLengthScreen from './src/screens/OnboardingSessionLengthScreen';
import OnboardingStudyTimeOfDayScreen from './src/screens/OnboardingStudyTimeOfDayScreen';
import OnboardingPlanSummaryScreen from './src/screens/OnboardingPlanSummaryScreen';
import OnboardingSystemBuildingScreen from './src/screens/OnboardingSystemBuildingScreen';
import OnboardingFirstSessionIntroScreen from './src/screens/OnboardingFirstSessionIntroScreen';
import OnboardingFirstSessionQuizScreen from './src/screens/OnboardingFirstSessionQuizScreen';
import OnboardingFirstSessionMetricsScreen from './src/screens/OnboardingFirstSessionMetricsScreen';
import OnboardingFirstSessionRewardScreen from './src/screens/OnboardingFirstSessionRewardScreen';
import OnboardingSessionFeedbackScreen from './src/screens/OnboardingSessionFeedbackScreen';
import OnboardingStudyPlanDetailsScreen from './src/screens/OnboardingStudyPlanDetailsScreen';
import OnboardingFirstMilestoneScreen from './src/screens/OnboardingFirstMilestoneScreen';
import OnboardingBuiltSummaryScreen from './src/screens/OnboardingBuiltSummaryScreen';
import OnboardingSeriousnessLevelScreen from './src/screens/OnboardingSeriousnessLevelScreen';
import OnboardingMakeItRealScreen from './src/screens/OnboardingMakeItRealScreen';
import OnboardingReminderPermissionScreen from './src/screens/OnboardingReminderPermissionScreen';
import OnboardingHearAboutUsScreen from './src/screens/OnboardingHearAboutUsScreen';
import OnboardingStudyProtectionScreen from './src/screens/OnboardingStudyProtectionScreen';
import OnboardingPowerBuiltScreen from './src/screens/OnboardingPowerBuiltScreen';
import OnboardingSevenDayRoadmapScreen from './src/screens/OnboardingSevenDayRoadmapScreen';
import OnboardingTrialReminderScreen from './src/screens/OnboardingTrialReminderScreen';
import OnboardingPaywallScreen from './src/screens/OnboardingPaywallScreen';
import OnboardingSaveAccountScreen from './src/screens/OnboardingSaveAccountScreen';
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
import LevelUpModal from './src/components/LevelUpModal';
import BottomNavBar from './src/components/BottomNavBar';
import { ipLocationService } from './src/services/ipLocationService';
import { ThemeProvider, useTheme } from './src/theme/themeContext';
import { TooltipProvider } from './src/context/TooltipContext';
import TooltipTouchable from './src/components/TooltipTouchable';

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

  // Navigation State: 'onboarding', 'dashboard', 'subjects', 'aicoach', etc.
  const [currentRoute, setCurrentRoute] = useState('onboarding');
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    goal: null,
    phoneTime: '4–5 hours',
    targetData: { label: 'In 3 months', days: 90 },
    subjects: ['Mathematics', 'Economics', 'Computer Science'],
    focusSubject: 'Mathematics',
    confidence: 'I understand the basics',
    dailyStudyTime: '1–2 hours',
    studyDays: ['mon', 'wed', 'fri', 'sat'],
    sessionLength: '45 min',
    studyTimeOfDay: 'afternoon',
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

  const handleCloseLevelUpModal = () => {
    setPendingLevelUp(null);
    gamificationService.clearPendingLevelUp();
  };

  const handleUpdateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  const [aiInitialPrompt, setAiInitialPrompt] = useState(null);
  const [srsReturnState, setSrsReturnState] = useState(null);
  const [navHistory, setNavHistory] = useState(['dashboard']);
  const [aiCoachShowHistory, setAiCoachShowHistory] = useState(false);
  const [studyViewState, setStudyViewState] = useState('overview');


  const handleNavigate = (route, params = null) => {
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
      if (currentRoute === 'onboarding-app-ready') {
        setCurrentRoute('onboarding-create-account');
        return true;
      }
      if (currentRoute === 'onboarding-create-account') {
        setCurrentRoute('onboarding-save-account');
        return true;
      }
      if (currentRoute === 'onboarding-save-account') {
        setCurrentRoute('onboarding-paywall');
        return true;
      }
      if (currentRoute === 'onboarding-paywall') {
        setCurrentRoute('onboarding-trial-reminder');
        return true;
      }
      if (currentRoute === 'onboarding-trial-reminder') {
        setCurrentRoute('onboarding-7day-roadmap');
        return true;
      }
      if (currentRoute === 'onboarding-7day-roadmap') {
        setCurrentRoute('onboarding-power-built');
        return true;
      }
      if (currentRoute === 'onboarding-power-built') {
        setCurrentRoute('onboarding-study-protection');
        return true;
      }
      if (currentRoute === 'onboarding-study-protection') {
        setCurrentRoute('onboarding-reminder-permission');
        return true;
      }
      if (currentRoute === 'onboarding-reminder-permission') {
        setCurrentRoute('onboarding-make-it-real');
        return true;
      }
      if (currentRoute === 'onboarding-make-it-real') {
        setCurrentRoute('onboarding-seriousness-level');
        return true;
      }
      if (currentRoute === 'onboarding-seriousness-level') {
        setCurrentRoute('onboarding-built-summary');
        return true;
      }
      if (currentRoute === 'onboarding-built-summary') {
        setCurrentRoute('onboarding-first-milestone');
        return true;
      }
      if (currentRoute === 'onboarding-first-milestone') {
        setCurrentRoute('onboarding-study-plan-details');
        return true;
      }
      if (currentRoute === 'onboarding-study-plan-details') {
        setCurrentRoute('onboarding-session-feedback');
        return true;
      }
      if (currentRoute === 'onboarding-session-feedback') {
        setCurrentRoute('onboarding-first-session-reward');
        return true;
      }
      if (currentRoute === 'onboarding-first-session-reward') {
        setCurrentRoute('onboarding-first-session-metrics');
        return true;
      }
      if (currentRoute === 'onboarding-first-session-metrics') {
        setCurrentRoute('onboarding-first-session-quiz');
        return true;
      }
      if (currentRoute === 'onboarding-first-session-quiz') {
        setCurrentRoute('onboarding-first-session-intro');
        return true;
      }
      if (currentRoute === 'onboarding-first-session-intro') {
        setCurrentRoute('onboarding-system-building');
        return true;
      }
      if (currentRoute === 'onboarding-system-building') {
        setCurrentRoute('onboarding-plan-summary');
        return true;
      }
      if (currentRoute === 'onboarding-plan-summary') {
        setCurrentRoute('onboarding-study-time-of-day');
        return true;
      }
      if (currentRoute === 'onboarding-study-time-of-day') {
        setCurrentRoute('onboarding-session-length');
        return true;
      }
      if (currentRoute === 'onboarding-session-length') {
        setCurrentRoute('onboarding-study-days');
        return true;
      }
      if (currentRoute === 'onboarding-study-days') {
        setCurrentRoute('onboarding-daily-study-time');
        return true;
      }
      if (currentRoute === 'onboarding-daily-study-time') {
        setCurrentRoute('onboarding-confidence');
        return true;
      }
      if (currentRoute === 'onboarding-confidence') {
        setCurrentRoute('onboarding-subjects');
        return true;
      }
      if (currentRoute === 'onboarding-subjects') {
        setCurrentRoute('onboarding-plan-offer');
        return true;
      }
      if (currentRoute === 'onboarding-plan-offer') {
        setCurrentRoute('onboarding-calculation');
        return true;
      }
      if (currentRoute === 'onboarding-calculation') {
        setCurrentRoute('onboarding-target');
        return true;
      }
      if (currentRoute === 'onboarding-target') {
        setCurrentRoute('onboarding-phone-time');
        return true;
      }
      if (currentRoute === 'onboarding-phone-time') {
        setCurrentRoute('onboarding-consider');
        return true;
      }
      if (currentRoute === 'onboarding-consider') {
        setCurrentRoute('onboarding-goal');
        return true;
      }
      if (currentRoute === 'onboarding-goal') {
        setCurrentRoute('onboarding-name');
        return true;
      }
      if (currentRoute === 'onboarding-name') {
        setCurrentRoute('onboarding-partner');
        return true;
      }
      if (currentRoute === 'onboarding-partner') {
        setCurrentRoute('onboarding-lock');
        return true;
      }
      if (currentRoute === 'onboarding-lock') {
        setCurrentRoute('onboarding-hear-about-us');
        return true;
      }
      if (currentRoute === 'onboarding-hear-about-us') {
        setCurrentRoute('onboarding-solution');
        return true;
      }
      if (currentRoute === 'onboarding-solution') {
        setCurrentRoute('onboarding-problem');
        return true;
      }
      if (currentRoute === 'onboarding-problem') {
        setCurrentRoute('onboarding');
        return true;
      }

      // 5. Navigate back in history stack if more than one screen visited
      if (navHistory.length > 1) {
        handleBackNavigation();
        return true;
      }

      // 6. If on any non-dashboard screen (and not onboarding), return to dashboard
      if (currentRoute !== 'dashboard' && currentRoute !== 'onboarding') {
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
        return (
          <OnboardingScreen
            onContinue={() => {
              setCurrentRoute('onboarding-problem');
            }}
          />
        );
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
              setCurrentRoute('onboarding-hear-about-us');
            }}
          />
        );
      case 'onboarding-hear-about-us':
        return (
          <OnboardingHearAboutUsScreen
            initialSelection={onboardingData.referralSource || 'youtube'}
            onContinue={(source) => {
              setOnboardingData((prev) => ({ ...prev, referralSource: source }));
              setCurrentRoute('onboarding-lock');
            }}
            onBack={() => setCurrentRoute('onboarding-solution')}
          />
        );
      case 'onboarding-lock':
        return (
          <AppLockPreviewScreen
            onContinue={() => {
              setCurrentRoute('onboarding-partner');
            }}
            onBack={() => setCurrentRoute('onboarding-hear-about-us')}
          />
        );
      case 'onboarding-partner':
        return (
          <OnboardingPartnerScreen
            onContinue={() => {
              setCurrentRoute('onboarding-name');
            }}
            onBack={() => setCurrentRoute('onboarding-lock')}
          />
        );
      case 'onboarding-name':
        return (
          <OnboardingNameScreen
            initialName={onboardingData.name || (user.name !== 'Alex' ? user.name : '')}
            onContinue={(enteredName) => {
              const cleanName = enteredName || 'friend';
              setOnboardingData((prev) => ({ ...prev, name: cleanName }));
              setUser((prev) => ({ ...prev, name: cleanName }));
              setCurrentRoute('onboarding-goal');
            }}
            onBack={() => setCurrentRoute('onboarding-partner')}
          />
        );
      case 'onboarding-goal':
        return (
          <OnboardingGoalScreen
            onContinue={(goalData) => {
              setOnboardingData((prev) => ({ ...prev, goal: goalData }));
              setCurrentRoute('onboarding-consider');
            }}
            onBack={() => setCurrentRoute('onboarding-name')}
          />
        );
      case 'onboarding-consider':
        return (
          <OnboardingConsiderScreen
            userName={onboardingData.name || user.name}
            onContinue={() => {
              setCurrentRoute('onboarding-phone-time');
            }}
            onBack={() => setCurrentRoute('onboarding-goal')}
          />
        );
      case 'onboarding-phone-time':
        return (
          <OnboardingPhoneTimeScreen
            initialValue={onboardingData.phoneTime || '4–5 hours'}
            onContinue={(time) => {
              setOnboardingData((prev) => ({ ...prev, phoneTime: time }));
              setCurrentRoute('onboarding-target');
            }}
            onBack={() => setCurrentRoute('onboarding-consider')}
          />
        );
      case 'onboarding-target':
        return (
          <OnboardingTargetScreen
            initialValue={onboardingData.targetData?.label || 'In 3 months'}
            onContinue={(targetObj) => {
              setOnboardingData((prev) => ({ ...prev, targetData: targetObj }));
              setCurrentRoute('onboarding-calculation');
            }}
            onBack={() => setCurrentRoute('onboarding-phone-time')}
          />
        );
      case 'onboarding-calculation':
        return (
          <OnboardingCalculationScreen
            userName={onboardingData.name || user.name}
            phoneTime={onboardingData.phoneTime || '4–5 hours'}
            targetData={onboardingData.targetData || { label: 'In 3 months', days: 90 }}
            goal={onboardingData.goal}
            onContinue={() => {
              setCurrentRoute('onboarding-plan-offer');
            }}
            onBack={() => setCurrentRoute('onboarding-target')}
          />
        );
      case 'onboarding-plan-offer':
        return (
          <OnboardingPlanOfferScreen
            onContinue={() => {
              setCurrentRoute('onboarding-subjects');
            }}
            onBack={() => setCurrentRoute('onboarding-calculation')}
          />
        );
      case 'onboarding-subjects':
        return (
          <OnboardingSubjectsScreen
            initialSelected={onboardingData.subjects}
            onContinue={(selected) => {
              const cleanSelected = Array.isArray(selected) && selected.length > 0 ? selected : ['Mathematics', 'Economics', 'Computer Science'];
              setOnboardingData((prev) => ({
                ...prev,
                subjects: cleanSelected,
                focusSubject: cleanSelected[0],
              }));
              setUser((prev) => ({
                ...prev,
                subjects: cleanSelected,
                enrolledSubjectIds: cleanSelected,
              }));
              studyService.syncUserSubjects(cleanSelected);
              setCurrentRoute('onboarding-confidence');
            }}
            onBack={() => setCurrentRoute('onboarding-plan-offer')}
          />
        );
      case 'onboarding-confidence': {
        const currentSubject =
          Array.isArray(onboardingData.subjects) && onboardingData.subjects.length > 0
            ? onboardingData.subjects[0]
            : 'Mathematics';
        return (
          <OnboardingConfidenceScreen
            subject={currentSubject}
            initialConfidence={onboardingData.confidence}
            onContinue={(conf) => {
              setOnboardingData((prev) => ({
                ...prev,
                confidence: conf,
                focusSubject: currentSubject,
              }));
              setCurrentRoute('onboarding-daily-study-time');
            }}
            onBack={() => setCurrentRoute('onboarding-subjects')}
          />
        );
      }
      case 'onboarding-daily-study-time':
        return (
          <OnboardingDailyStudyTimeScreen
            initialTime={onboardingData.dailyStudyTime}
            onContinue={(time) => {
              setOnboardingData((prev) => ({ ...prev, dailyStudyTime: time }));
              setCurrentRoute('onboarding-study-days');
            }}
            onBack={() => setCurrentRoute('onboarding-confidence')}
          />
        );
      case 'onboarding-study-days':
        return (
          <OnboardingStudyDaysScreen
            initialDays={onboardingData.studyDays}
            onContinue={(days) => {
              setOnboardingData((prev) => ({ ...prev, studyDays: days }));
              setCurrentRoute('onboarding-session-length');
            }}
            onBack={() => setCurrentRoute('onboarding-daily-study-time')}
          />
        );
      case 'onboarding-session-length':
        return (
          <OnboardingSessionLengthScreen
            initialLength={onboardingData.sessionLength}
            onContinue={(length) => {
              setOnboardingData((prev) => ({ ...prev, sessionLength: length }));
              setCurrentRoute('onboarding-study-time-of-day');
            }}
            onBack={() => setCurrentRoute('onboarding-study-days')}
          />
        );
      case 'onboarding-study-time-of-day':
        return (
          <OnboardingStudyTimeOfDayScreen
            initialTimeOfDay={onboardingData.studyTimeOfDay}
            onContinue={(timeOfDay) => {
              setOnboardingData((prev) => ({ ...prev, studyTimeOfDay: timeOfDay }));
              setCurrentRoute('onboarding-plan-summary');
            }}
            onBack={() => setCurrentRoute('onboarding-session-length')}
          />
        );
      case 'onboarding-plan-summary':
        return (
          <OnboardingPlanSummaryScreen
            userName={onboardingData.name || user.name}
            targetData={onboardingData.targetData}
            focusSubject={
              onboardingData.focusSubject ||
              (Array.isArray(onboardingData.subjects) && onboardingData.subjects.length > 0
                ? onboardingData.subjects[0]
                : 'Mathematics')
            }
            subjects={onboardingData.subjects}
            confidence={onboardingData.confidence}
            dailyStudyTime={onboardingData.dailyStudyTime}
            studyTimeOfDay={onboardingData.studyTimeOfDay}
            onContinue={() => {
              setCurrentRoute('onboarding-system-building');
            }}
            onBack={() => setCurrentRoute('onboarding-study-time-of-day')}
          />
        );
      case 'onboarding-system-building':
        return (
          <OnboardingSystemBuildingScreen
            userName={onboardingData.name || user.name}
            onboardingData={onboardingData}
            onContinue={() => {
              setCurrentRoute('onboarding-first-session-intro');
            }}
            onBack={() => setCurrentRoute('onboarding-plan-summary')}
          />
        );
      case 'onboarding-first-session-intro': {
        const currentSubject =
          onboardingData.focusSubject ||
          (Array.isArray(onboardingData.subjects) && onboardingData.subjects.length > 0
            ? onboardingData.subjects[0]
            : 'Mathematics');
        return (
          <OnboardingFirstSessionIntroScreen
            subject={currentSubject}
            onContinue={() => setCurrentRoute('onboarding-first-session-quiz')}
            onBack={() => setCurrentRoute('onboarding-system-building')}
          />
        );
      }
      case 'onboarding-first-session-quiz': {
        const currentSubject =
          onboardingData.focusSubject ||
          (Array.isArray(onboardingData.subjects) && onboardingData.subjects.length > 0
            ? onboardingData.subjects[0]
            : 'Mathematics');
        return (
          <OnboardingFirstSessionQuizScreen
            subject={currentSubject}
            onContinue={(sessionData) => {
              if (sessionData) {
                setOnboardingData((prev) => ({
                  ...prev,
                  firstSessionDuration: sessionData.elapsedSeconds,
                  firstSessionIncorrectCount: sessionData.incorrectCount,
                  firstSessionTotalQuestions: sessionData.totalQuestions || 3,
                }));
              }
              setCurrentRoute('onboarding-first-session-metrics');
            }}
            onBack={() => setCurrentRoute('onboarding-first-session-intro')}
          />
        );
      }
      case 'onboarding-first-session-metrics': {
        const currentSubject =
          onboardingData.focusSubject ||
          (Array.isArray(onboardingData.subjects) && onboardingData.subjects.length > 0
            ? onboardingData.subjects[0]
            : 'Mathematics');
        return (
          <OnboardingFirstSessionMetricsScreen
            userName={onboardingData.name || user.name}
            subject={currentSubject}
            goal={onboardingData.goal}
            secondsStudied={onboardingData.firstSessionDuration}
            incorrectCount={onboardingData.firstSessionIncorrectCount}
            totalQuestions={onboardingData.firstSessionTotalQuestions}
            onContinue={() => setCurrentRoute('onboarding-first-session-reward')}
            onBack={() => setCurrentRoute('onboarding-first-session-quiz')}
          />
        );
      }
      case 'onboarding-first-session-reward':
        return (
          <OnboardingFirstSessionRewardScreen
            goal={onboardingData.goal}
            onContinue={() => {
              setCurrentRoute('onboarding-session-feedback');
            }}
            onBack={() => setCurrentRoute('onboarding-first-session-metrics')}
          />
        );
      case 'onboarding-session-feedback':
        return (
          <OnboardingSessionFeedbackScreen
            initialSelection={onboardingData.sessionFeedback || 'about_right'}
            onContinue={(feedback) => {
              setOnboardingData((prev) => ({ ...prev, sessionFeedback: feedback }));
              setCurrentRoute('onboarding-study-plan-details');
            }}
            onBack={() => setCurrentRoute('onboarding-first-session-reward')}
          />
        );
      case 'onboarding-study-plan-details': {
        const currentSubject =
          onboardingData.focusSubject ||
          (Array.isArray(onboardingData.subjects) && onboardingData.subjects.length > 0
            ? onboardingData.subjects[0]
            : 'Mathematics');
        return (
          <OnboardingStudyPlanDetailsScreen
            goal={onboardingData.goal}
            targetData={onboardingData.targetData}
            focusSubject={currentSubject}
            dailyStudyTime={onboardingData.dailyStudyTime}
            studyTimeOfDay={onboardingData.studyTimeOfDay}
            studyDays={onboardingData.studyDays}
            onContinue={() => setCurrentRoute('onboarding-first-milestone')}
            onBack={() => setCurrentRoute('onboarding-session-feedback')}
          />
        );
      }
      case 'onboarding-first-milestone':
        return (
          <OnboardingFirstMilestoneScreen
            targetData={onboardingData.targetData}
            studyDays={onboardingData.studyDays}
            dailyStudyTime={onboardingData.dailyStudyTime}
            goal={onboardingData.goal}
            completedSessions={1}
            milestoneSessions={1}
            milestonePercent={10}
            onContinue={() => setCurrentRoute('onboarding-built-summary')}
            onBack={() => setCurrentRoute('onboarding-study-plan-details')}
          />
        );
      case 'onboarding-built-summary': {
        const currentSubject =
          onboardingData.focusSubject ||
          (Array.isArray(onboardingData.subjects) && onboardingData.subjects.length > 0
            ? onboardingData.subjects[0]
            : 'Mathematics');
        return (
          <OnboardingBuiltSummaryScreen
            goal={onboardingData.goal}
            targetData={onboardingData.targetData}
            subjects={onboardingData.subjects}
            focusSubject={currentSubject}
            dailyStudyTime={onboardingData.dailyStudyTime}
            studyDays={onboardingData.studyDays}
            milestonePercent="20%"
            onContinue={() => setCurrentRoute('onboarding-seriousness-level')}
            onBack={() => setCurrentRoute('onboarding-first-milestone')}
          />
        );
      }
      case 'onboarding-seriousness-level':
        return (
          <OnboardingSeriousnessLevelScreen
            initialSelection={onboardingData.seriousness || 'priority'}
            onContinue={(seriousness) => {
              setOnboardingData((prev) => ({ ...prev, seriousness }));
              setCurrentRoute('onboarding-make-it-real');
            }}
            onBack={() => setCurrentRoute('onboarding-built-summary')}
          />
        );
      case 'onboarding-make-it-real':
        return (
          <OnboardingMakeItRealScreen
            onContinue={() => {
              setCurrentRoute('onboarding-reminder-permission');
            }}
            onBack={() => setCurrentRoute('onboarding-seriousness-level')}
          />
        );
      case 'onboarding-reminder-permission':
        return (
          <OnboardingReminderPermissionScreen
            onContinue={(enabled) => {
              setOnboardingData((prev) => ({ ...prev, remindersEnabled: enabled }));
              setCurrentRoute('onboarding-study-protection');
            }}
            onSkip={() => {
              setOnboardingData((prev) => ({ ...prev, remindersEnabled: false }));
              setCurrentRoute('onboarding-study-protection');
            }}
            onBack={() => setCurrentRoute('onboarding-make-it-real')}
          />
        );
      case 'onboarding-study-protection':
        return (
          <OnboardingStudyProtectionScreen
            onContinue={(enabled) => {
              setOnboardingData((prev) => ({ ...prev, focusProtectionEnabled: enabled }));
              setCurrentRoute('onboarding-power-built');
            }}
            onSkip={() => {
              setOnboardingData((prev) => ({ ...prev, focusProtectionEnabled: false }));
              setCurrentRoute('onboarding-power-built');
            }}
            onBack={() => setCurrentRoute('onboarding-reminder-permission')}
          />
        );
      case 'onboarding-power-built':
        return (
          <OnboardingPowerBuiltScreen
            onContinue={() => {
              setCurrentRoute('onboarding-7day-roadmap');
            }}
            onBack={() => setCurrentRoute('onboarding-study-protection')}
          />
        );
      case 'onboarding-7day-roadmap':
        return (
          <OnboardingSevenDayRoadmapScreen
            onContinue={() => {
              setCurrentRoute('onboarding-trial-reminder');
            }}
            onBack={() => setCurrentRoute('onboarding-power-built')}
          />
        );
      case 'onboarding-trial-reminder':
        return (
          <OnboardingTrialReminderScreen
            onContinue={() => {
              setCurrentRoute('onboarding-paywall');
            }}
            onBack={() => setCurrentRoute('onboarding-7day-roadmap')}
          />
        );
      case 'onboarding-paywall':
        return (
          <OnboardingPaywallScreen
            onContinue={(selectedPlan) => {
              setCurrentRoute('onboarding-save-account');
            }}
            onBack={() => setCurrentRoute('onboarding-trial-reminder')}
          />
        );
      case 'onboarding-save-account':
        return (
          <OnboardingSaveAccountScreen
            userName={onboardingData.name || user.name || 'Alex'}
            onContinue={() => {
              if (onboardingData.name && onboardingData.name.trim()) {
                setUser((prev) => ({
                  ...prev,
                  name: onboardingData.name.trim(),
                }));
              }
              setCreateAccountMode('signup');
              setCurrentRoute('onboarding-create-account');
            }}
            onLogin={() => {
              if (onboardingData.name && onboardingData.name.trim()) {
                setUser((prev) => ({
                  ...prev,
                  name: onboardingData.name.trim(),
                }));
              }
              setCreateAccountMode('login');
              setCurrentRoute('onboarding-create-account');
            }}
            onBack={() => setCurrentRoute('onboarding-paywall')}
          />
        );
      case 'onboarding-create-account':
        return (
          <OnboardingCreateAccountScreen
            initialMode={createAccountMode}
            defaultUsername={onboardingData.name || (user.name !== 'Alex' ? user.name : '')}
            defaultEmail={user.email || ''}
            onContinue={(accData) => {
              setUser((prev) => ({
                ...prev,
                ...(accData?.username ? { name: accData.username } : {}),
                ...(accData?.email ? { email: accData.email } : {}),
              }));
              setCurrentRoute('onboarding-app-ready');
            }}
            onGoogleSignIn={() => {
              setCurrentRoute('onboarding-app-ready');
            }}
            onBack={() => setCurrentRoute('onboarding-save-account')}
          />
        );
      case 'onboarding-app-ready':
        return (
          <OnboardingAppReadyScreen
            userName={user.name || onboardingData.name || 'Alex'}
            subjects={onboardingData.subjects || user.subjects || ['Mathematics', 'Physics', 'Chemistry', 'English']}
            onContinue={() => {
              setCurrentRoute('dashboard');
              setNavHistory(['dashboard']);
            }}
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
    <SafeAreaProvider initialMetrics={Platform.OS === 'web' ? webFrameMetrics : initialWindowMetrics}>
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
                  { id: 'onboarding', label: '1. Onboarding (Hey)' },
                  { id: 'onboarding-problem', label: '2. Onboarding (Questions)' },
                  { id: 'onboarding-solution', label: '3. Onboarding (Value Prop)' },
                  { id: 'onboarding-hear-about-us', label: '4. Hear About Us' },
                  { id: 'onboarding-lock', label: '5. Onboarding (App Lock)' },
                  { id: 'onboarding-partner', label: '6. Onboarding (Study Partner)' },
                  { id: 'onboarding-name', label: '7. Onboarding (Name Input)' },
                  { id: 'onboarding-goal', label: '8. Onboarding (Goal)' },
                  { id: 'onboarding-consider', label: '9. Onboarding (Consider)' },
                  { id: 'onboarding-phone-time', label: '10. Onboarding (Phone Time)' },
                  { id: 'onboarding-target', label: '11. Onboarding (Target)' },
                  { id: 'onboarding-calculation', label: '12. Onboarding (Calculation)' },
                  { id: 'onboarding-plan-offer', label: '13. Onboarding (Plan Offer)' },
                  { id: 'onboarding-subjects', label: '14. Onboarding (Subjects)' },
                  { id: 'onboarding-confidence', label: '15. Onboarding (Confidence)' },
                  { id: 'onboarding-daily-study-time', label: '16. Onboarding (Daily Time)' },
                  { id: 'onboarding-study-days', label: '17. Onboarding (Study Days)' },
                  { id: 'onboarding-session-length', label: '18. Onboarding (Session Length)' },
                  { id: 'onboarding-study-time-of-day', label: '19. Onboarding (Time of Day)' },
                  { id: 'onboarding-plan-summary', label: '20. Onboarding (Plan Summary)' },
                  { id: 'onboarding-system-building', label: '21. Onboarding (Building System)' },
                  { id: 'onboarding-first-session-intro', label: '22. First Session (Intro)' },
                  { id: 'onboarding-first-session-quiz', label: '23. First Session (Quiz)' },
                  { id: 'onboarding-first-session-metrics', label: '24. First Session (Metrics)' },
                  { id: 'onboarding-first-session-reward', label: '25. First Session (Reward)' },
                  { id: 'onboarding-session-feedback', label: '26. Session Feedback' },
                  { id: 'onboarding-study-plan-details', label: '27. Study Plan Details' },
                  { id: 'onboarding-first-milestone', label: '28. First Milestone' },
                  { id: 'onboarding-built-summary', label: '29. What We Built' },
                  { id: 'onboarding-seriousness-level', label: '30. Seriousness Level' },
                  { id: 'onboarding-make-it-real', label: '31. Make It Real' },
                  { id: 'onboarding-reminder-permission', label: '32. Reminders' },
                  { id: 'onboarding-study-protection', label: '33. Study Protection' },
                  { id: 'onboarding-power-built', label: '34. Power Behind It' },
                  { id: 'onboarding-7day-roadmap', label: '35. 7-Day Transformation' },
                  { id: 'onboarding-trial-reminder', label: '36. Free Trial Reminder' },
                  { id: 'onboarding-paywall', label: '37. Paywall / Checkout' },
                  { id: 'onboarding-save-account', label: '38. Save Account' },
                  { id: 'onboarding-create-account', label: '39. Create Account' },
                  { id: 'dashboard', label: '40. Dashboard' },
                  { id: 'community', label: '41. Community' },
                  { id: 'subjects', label: '42. Subjects (Workspace)' },
                  { id: 'aicoach', label: '43. Branco' },
                  { id: 'schedule', label: '44. Schedule' },
                  { id: 'profile', label: '45. Profile' },
                  { id: 'study', label: '46. Study & SRS' },
                  { id: 'leaderboard', label: '47. Leaderboard' },
                  { id: 'settings', label: '48. Settings' },
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
    backgroundColor: '#FFFFFF',
  },
  screenWrapper: {
    flex: 1,
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
