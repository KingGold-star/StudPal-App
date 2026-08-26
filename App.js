import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import OnboardingScreen from './src/screens/OnboardingScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import AiCoachScreen from './src/screens/AiCoachScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StudyScreen from './src/screens/StudyScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Colors } from './src/theme/colors';
import { gamificationService } from './src/services/gamification/gamificationService';
import { settingsService } from './src/services/settings/settingsService';
import LevelUpModal from './src/components/LevelUpModal';

class ErrorBoundary extends React.Component {
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
            onPress={() => window.location.reload()}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Reload App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Navigation State: 'dashboard', 'subjects', 'aicoach', 'profile', 'study', 'onboarding-1', etc.
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Alex', email: 'alex@studpal.app', avatarUri: null });
  const [selectedRole, setSelectedRole] = useState('student');
  const [showNavDebugger, setShowNavDebugger] = useState(false);
  const [pendingLevelUp, setPendingLevelUp] = useState(null);
  const [appSettings, setAppSettings] = useState(settingsService.getSettingsSync());

  useEffect(() => {
    const unsubscribeGamification = gamificationService.subscribe((gState) => {
      if (gState.pendingLevelUp) {
        setPendingLevelUp(gState.pendingLevelUp);
      }
    });
    const unsubscribeSettings = settingsService.subscribe((s) => {
      setAppSettings(s);
    });
    return () => {
      unsubscribeGamification();
      unsubscribeSettings();
    };
  }, []);

  const handleCloseLevelUpModal = () => {
    setPendingLevelUp(null);
    gamificationService.clearPendingLevelUp();
  };

  const handleUpdateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  // Screen Transitions
  const handleOnboardingNext = (step) => {
    if (step === 1) setCurrentRoute('onboarding-2');
    else if (step === 2) setCurrentRoute('onboarding-3');
    else if (step === 3) setCurrentRoute('role');
  };

  const handleOnboardingBack = (step) => {
    if (step === 3) setCurrentRoute('onboarding-2');
    else if (step === 2) setCurrentRoute('onboarding-1');
  };

  const handleRoleContinue = (role) => {
    setSelectedRole(role);
    setCurrentRoute('auth');
  };

  const handleAuthSuccess = (userData) => {
    setUser({ ...user, ...userData });
    setCurrentRoute('dashboard');
  };

  const handleTabSelect = (tab) => {
    if (tab === 'home') setCurrentRoute('dashboard');
    else if (tab === 'subjects') setCurrentRoute('subjects');
    else if (tab === 'aicoach') setCurrentRoute('aicoach');
    else if (tab === 'study') setCurrentRoute('study');
    else if (tab === 'profile') setCurrentRoute('profile');
  };

  // Render current active screen
  const renderScreen = () => {
    switch (currentRoute) {
      case 'onboarding-1':
        return (
          <OnboardingScreen
            step={1}
            onNext={() => handleOnboardingNext(1)}
            onBack={() => {}}
          />
        );
      case 'onboarding-2':
        return (
          <OnboardingScreen
            step={2}
            onNext={() => handleOnboardingNext(2)}
            onBack={() => handleOnboardingBack(2)}
          />
        );
      case 'onboarding-3':
        return (
          <OnboardingScreen
            step={3}
            onNext={() => handleOnboardingNext(3)}
            onBack={() => handleOnboardingBack(3)}
          />
        );
      case 'role':
        return (
          <RoleSelectionScreen
            onContinue={handleRoleContinue}
            onBack={() => setCurrentRoute('onboarding-3')}
          />
        );
      case 'auth':
        return (
          <AuthScreen
            onAuthSuccess={handleAuthSuccess}
            onBack={() => setCurrentRoute('role')}
          />
        );
      case 'subjects':
        return (
          <SubjectsScreen
            settings={appSettings}
            onSelectTab={handleTabSelect}
            onBack={() => setCurrentRoute('dashboard')}
          />
        );
      case 'aicoach':
        return (
          <AiCoachScreen
            user={user}
            settings={appSettings}
            onSelectTab={handleTabSelect}
            onNavigate={(route) => setCurrentRoute(route)}
            onBack={() => setCurrentRoute('dashboard')}
          />
        );
      case 'study':
        return (
          <StudyScreen
            settings={appSettings}
            onSelectTab={handleTabSelect}
            onNavigate={(route) => setCurrentRoute(route)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            settings={appSettings}
            onUpdateUser={handleUpdateUser}
            onSelectTab={handleTabSelect}
            onNavigate={(route) => setCurrentRoute(route)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            user={user}
            settings={appSettings}
            onUpdateUser={handleUpdateUser}
            onBack={() => setCurrentRoute('profile')}
            onNavigate={(route) => setCurrentRoute(route)}
            onSelectTab={handleTabSelect}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardScreen
            user={user}
            settings={appSettings}
            onBack={() => setCurrentRoute('dashboard')}
            onSelectTab={handleTabSelect}
          />
        );
      case 'schedule':
        return (
          <ScheduleScreen
            user={user}
            settings={appSettings}
            onBack={() => setCurrentRoute('dashboard')}
            onSelectTab={handleTabSelect}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardScreen
            user={user}
            settings={appSettings}
            onUpdateUser={handleUpdateUser}
            onSelectTab={handleTabSelect}
            onNavigate={(route) => setCurrentRoute(route)}
          />
        );
    }
  };

  const isWeb = Platform.OS === 'web';
  const isDark = appSettings?.theme === 'dark';

  const appContent = (
    <SafeAreaProvider>
      <View style={[styles.rootContainer, isDark && { backgroundColor: '#0B0F19' }]}>
        <ExpoStatusBar style={isDark ? 'light' : 'dark'} translucent backgroundColor="transparent" />
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

        {/* Screen Render */}
        <View style={styles.screenWrapper}>{renderScreen()}</View>

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

              <View style={styles.pillsList}>
                {[
                  { id: 'onboarding-1', label: '1. Onboarding 1' },
                  { id: 'onboarding-2', label: '2. Onboarding 2' },
                  { id: 'onboarding-3', label: '3. Onboarding 3' },
                  { id: 'role', label: '4. Role Select' },
                  { id: 'auth', label: '5. Authentication' },
                  { id: 'dashboard', label: '6. Dashboard' },
                  { id: 'subjects', label: '7. Subjects' },
                  { id: 'aicoach', label: '8. Branco' },
                  { id: 'profile', label: '9. Profile' },
                  { id: 'study', label: '10. Study & SRS' },
                  { id: 'leaderboard', label: '11. Leaderboard' },
                  { id: 'schedule', label: '12. Schedule' },
                  { id: 'settings', label: '13. Settings' },
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
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.floatingBadge}
              onPress={() => setShowNavDebugger(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingBadgeText}>Switch Screen</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );

  if (isWeb) {
    return (
      <ErrorBoundary>
        <View style={styles.webDesktopBackground}>
          <View style={styles.deviceFrame}>
            {/* Dynamic Island Notch Removed for visibility */}
            <View style={styles.phoneScreenWrapper}>
              {appContent}
            </View>
          </View>
        </View>
      </ErrorBoundary>
    );
  }

  return <ErrorBoundary>{appContent}</ErrorBoundary>;
}

const styles = StyleSheet.create({
  webDesktopBackground: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  deviceFrame: {
    width: 400,
    height: 840,
    backgroundColor: '#FFFFFF',
    borderRadius: 44,
    borderWidth: 10,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  phoneScreenWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
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
    width: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  floatingBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  pillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
