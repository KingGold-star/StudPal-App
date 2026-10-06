import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Header from '../components/Header';
import { settingsService } from '../services/settings/settingsService';
import { useTranslation } from '../services/i18n/i18nService';
import { useTheme } from '../theme/themeContext';

// Icons
const ShieldIcon = ({ size = 24, color = '#6236FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const AppIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <Path d="M9 9h6M9 15h6" />
  </Svg>
);

const ClockIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const LockIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const BellIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const ChevronRightIcon = ({ size = 18, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export default function FocusModeScreen({ user, settings, onBack, onNavigate }) {
  const { t } = useTranslation();
  const { isDark, accentColor: contextAccent } = useTheme();
  const insets = useSafeAreaInsets();
  const accentColor = settings?.accentColor || contextAccent || '#6236FF';
  const [localSettings, setLocalSettings] = useState(settings);
  const styles = useMemo(() => getFocusStyles(isDark, accentColor), [isDark, accentColor]);

  const handleToggle = async (key) => {
    const newValue = !localSettings[key];
    setLocalSettings((prev) => ({ ...prev, [key]: newValue }));
    await settingsService.updateSetting(key, newValue);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <Header title={t("focusMode.title", "Focus Mode")} showBack={true} onBack={onBack} />
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIconBox}>
            <ShieldIcon size={40} color={accentColor} />
          </View>
          <Text style={styles.heroTitle}>{t("focusMode.heroTitle", "Stay Focused")}</Text>
          <Text style={styles.heroSubtitle}>{t("focusMode.heroSubtitle", "Block distracting apps and notifications during your study sessions.")}</Text>
        </View>

        <View style={styles.sectionContainer}>
          {/* Master Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContent}>
              <Text style={styles.settingTitle}>{t("focusMode.enable", "Enable Focus Mode")}</Text>
              <Text style={styles.settingDesc}>{t("focusMode.enableSub", "Turn on app blocking globally")}</Text>
            </View>
            <Switch
              value={localSettings?.focusModeEnabled || false}
              onValueChange={() => handleToggle('focusModeEnabled')}
              trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: accentColor }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* App Restrictions */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <AppIcon color={isDark ? '#94A3B8' : '#64748B'} />
            </View>
            <View style={styles.settingTextContent}>
              <Text style={styles.settingTitle}>{t("focusMode.restrictedApps", "Restricted Apps")}</Text>
              <Text style={styles.settingDesc}>{t("focusMode.restrictedAppsSub", "Select apps to block")}</Text>
            </View>
            <View style={styles.rowRightBadge}>
              <Text style={styles.badgeText}>0 {t("focusMode.selected", "Selected")}</Text>
              <ChevronRightIcon color={isDark ? '#64748B' : '#94A3B8'} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Timetable Sync */}
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <ClockIcon color={isDark ? '#94A3B8' : '#64748B'} />
            </View>
            <View style={styles.settingTextContent}>
              <Text style={styles.settingTitle}>{t("focusMode.timetableSync", "Timetable Automation")}</Text>
              <Text style={styles.settingDesc}>{t("focusMode.timetableSyncSub", "Auto-activate during classes")}</Text>
            </View>
            <Switch
              value={localSettings?.focusModeTimetableSync || false}
              onValueChange={() => handleToggle('focusModeTimetableSync')}
              trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: accentColor }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Strict Mode */}
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <LockIcon color={isDark ? '#94A3B8' : '#64748B'} />
            </View>
            <View style={styles.settingTextContent}>
              <Text style={styles.settingTitle}>{t("focusMode.strictMode", "Strict Mode")}</Text>
              <Text style={styles.settingDesc}>{t("focusMode.strictModeSub", "Cannot disable until session ends")}</Text>
            </View>
            <Switch
              value={localSettings?.focusModeStrictMode || false}
              onValueChange={() => handleToggle('focusModeStrictMode')}
              trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: accentColor }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Notification Preferences */}
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <BellIcon color={isDark ? '#94A3B8' : '#64748B'} />
            </View>
            <View style={styles.settingTextContent}>
              <Text style={styles.settingTitle}>Notification Preferences</Text>
              <Text style={styles.settingDesc}>Mute non-essential alerts</Text>
            </View>
            <Switch
              value={localSettings?.focusModeMuteNotifications || false}
              onValueChange={() => handleToggle('focusModeMuteNotifications')}
              trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: accentColor }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.permissionsCard}>
          <Text style={styles.permissionsTitle}>Required Permissions</Text>
          <Text style={styles.permissionsDesc}>
            To block apps, StudPal requires 'Usage Access' and 'Display Over Other Apps' permissions.
          </Text>
          <TouchableOpacity style={[styles.permissionsBtn, { backgroundColor: accentColor }]}>
            <Text style={styles.permissionsBtnText}>Check Permissions</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const baseStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 10,
  },
  heroIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingTextContent: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  rowRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6236FF',
  },
  permissionsCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  permissionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9A3412',
    marginBottom: 6,
  },
  permissionsDesc: {
    fontSize: 13,
    color: '#C2410C',
    lineHeight: 18,
    marginBottom: 12,
  },
  permissionsBtn: {
    backgroundColor: '#F97316',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  permissionsBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

const getFocusStyles = (isDark, accentColor) => {
  if (!isDark) return baseStyles;
  return {
    ...baseStyles,
    root: [baseStyles.root, { backgroundColor: '#0B0F19' }],
    heroTitle: [baseStyles.heroTitle, { color: '#F8FAFC' }],
    heroSubtitle: [baseStyles.heroSubtitle, { color: '#94A3B8' }],
    heroIconBox: [baseStyles.heroIconBox, { backgroundColor: '#1E293B' }],
    sectionContainer: [baseStyles.sectionContainer, { backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1 }],
    iconContainer: [baseStyles.iconContainer, { backgroundColor: '#0F172A' }],
    settingTitle: [baseStyles.settingTitle, { color: '#F8FAFC' }],
    settingDesc: [baseStyles.settingDesc, { color: '#94A3B8' }],
    divider: [baseStyles.divider, { backgroundColor: '#334155' }],
    badgeText: [baseStyles.badgeText, { color: accentColor || '#2D62FF' }],
    permissionsCard: [baseStyles.permissionsCard, { backgroundColor: '#1E1B18', borderColor: '#432616' }],
    permissionsTitle: [baseStyles.permissionsTitle, { color: '#FDBA74' }],
    permissionsDesc: [baseStyles.permissionsDesc, { color: '#FED7AA' }],
  };
};
