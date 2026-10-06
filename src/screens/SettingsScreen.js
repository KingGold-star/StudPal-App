// src/screens/SettingsScreen.js

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/Header";
import Modal from "../components/CustomModal";
import TooltipTouchable from "../components/TooltipTouchable";
import BottomNavBar from "../components/BottomNavBar";
import { settingsService, DEFAULT_SETTINGS } from "../services/settings/settingsService";
import { themeService } from "../theme/themeService";
import { gamificationService } from "../services/gamification/gamificationService";
import { calculateUserLevel } from "../services/gamification/levels";
import { Colors } from "../theme/colors";
import { useTranslation, SUPPORTED_LANGUAGES } from "../services/i18n/i18nService";
import { SUPPORTED_COUNTRIES } from "../services/gamification/countryLeaderboardData";
import { ipLocationService } from "../services/ipLocationService";
import { useTheme } from "../theme/themeContext";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const SearchIcon = ({ size = 18, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const SunIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="5" />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </Svg>
);

const MoonIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

const MonitorIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <Path d="M8 21h8M12 17v4" />
  </Svg>
);

const PaletteIcon = ({ size = 18, color = "#EC4899" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="13.5" cy="6.5" r=".5" fill={color} />
    <Circle cx="17.5" cy="10.5" r=".5" fill={color} />
    <Circle cx="8.5" cy="7.5" r=".5" fill={color} />
    <Circle cx="6.5" cy="12.5" r=".5" fill={color} />
    <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
  </Svg>
);

const ClockIcon = ({ size = 18, color = "#2563EB" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const BellIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const BotIcon = ({ size = 18, color = "#8B5CF6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="10" rx="2" />
    <Circle cx="12" cy="5" r="2" />
    <Path d="M12 7v4M8 16h.01M16 16h.01" />
  </Svg>
);

const GlobeIcon = ({ size = 18, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const ShieldIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const DatabaseIcon = ({ size = 18, color = "#0EA5E9" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="5" r="3" />
    <Path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <Path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </Svg>
);

const HelpIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </Svg>
);

const ChevronRightIcon = ({ size = 18, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const CheckIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const CloseIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const CameraIcon = ({ size = 13, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const SyncIcon = ({ size = 13, color = "#0284C7" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 4v6h-6" />
    <Path d="M1 20v-6h6" />
    <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Svg>
);

const DownloadIcon = ({ size = 13, color = "#0284C7" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Path d="M7 10l5 5 5-5" />
    <Path d="M12 15V3" />
  </Svg>
);

const TrashIcon = ({ size = 14, color = "#E11D48" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Path d="M10 11v6M14 11v6" />
  </Svg>
);

const ResetIcon = ({ size = 15, color = "#475569" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
  </Svg>
);

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "How does the Spaced Repetition (SRS) algorithm work?",
    a: "StudPal uses an enhanced SM-2 spaced repetition algorithm. When you review flashcards or study cards, it adapts interval scheduling based on your rating to optimize long-term memory retention before you forget.",
  },
  {
    q: "Can I use StudPal completely offline?",
    a: "Yes! Enable 'Offline Storage Cache' under Data & Sync. Your flashcard decks, study summaries, and notes will be saved locally and sync back to the cloud once you reconnect.",
  },
  {
    q: "How do Pomodoro Cycles and XP work?",
    a: "Every completed 25-minute Pomodoro session earns you 50 XP. Completing a full 4-cycle study block awards bonus badges and levels up your scholar rank on the leaderboard.",
  },
  {
    q: "How does Branco handle my uploaded documents?",
    a: "Your study PDFs and lecture notes are processed securely in an isolated sandbox. Branco extracts key concepts, generates practice quizzes, and never shares your notes with third parties.",
  },
];

// ─── Executive Custom Toggle Component ───────────────────────────────────────
const CustomToggle = ({ value, onValueChange, activeColor }) => {
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const trackBg = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#CBD5E1", activeColor || "#6236FF"],
  });

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onValueChange}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={{
          width: 48,
          height: 28,
          borderRadius: 14,
          backgroundColor: trackBg,
          justifyContent: "center",
          paddingHorizontal: 2,
        }}
      >
        <Animated.View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            transform: [{ translateX }],
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SettingsScreen({ user = {}, onUpdateUser, onBack, onNavigate, onSelectTab }) {
  const insets = useSafeAreaInsets();
  const { t, currentLanguageCode, setLanguage } = useTranslation();
  const { isDark, accentColor: themeAccent, setTheme } = useTheme();
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, hapticFeedback: true, autoStartBreaks: true });
  const activeAccentColor = settings.accentColor || themeAccent || Colors.accent || "#6236FF";
  const styles = useMemo(() => getStyles(isDark, activeAccentColor, insets), [isDark, activeAccentColor, insets]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || "Alex Johnson");
  const [editEmail, setEditEmail] = useState(user?.email || "alex.johnson@university.edu");
  const [editMajor, setEditMajor] = useState(user?.major || "Computer Science & Math");
  const [editAvatarUri, setEditAvatarUri] = useState(user?.avatarUri || null);

  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isTimePickerModalOpen, setTimePickerModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("20");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const [ipCountryCode, setIpCountryCode] = useState(() => (user?.countryCode || ipLocationService.getCountryCode() || "NG").toUpperCase());

  useEffect(() => {
    const unsubIp = ipLocationService.subscribe((code) => {
      if (code && typeof code === "string" && code.length === 2) {
        setIpCountryCode(code.toUpperCase());
      }
    });
    return () => unsubIp();
  }, []);
  const [isAiPersonaModalOpen, setAiPersonaModalOpen] = useState(false);
  const [isFaqModalOpen, setFaqModalOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("Feature Suggestion");

  const currentLevel = calculateUserLevel({ totalXp: user?.xp || 380 }).current;

  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3200);
  };

  // Load saved settings
  useEffect(() => {
    let mounted = true;
    (async () => {
      const loaded = await settingsService.getSettings();
      if (mounted) {
        if (loaded.hapticFeedback !== true) {
          loaded.hapticFeedback = true;
          await settingsService.updateSetting("hapticFeedback", true);
        }
        if (loaded.autoStartBreaks !== true) {
          loaded.autoStartBreaks = true;
          await settingsService.updateSetting("autoStartBreaks", true);
        }
        setSettings(loaded);
        if (loaded.notificationTime) {
          const parts = loaded.notificationTime.split(":");
          if (parts.length === 2) {
            setSelectedHour(parts[0]);
            setSelectedMinute(parts[1]);
          }
        }
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Setting update handlers
  const handleToggle = async (key, toastLabel) => {
    const updatedValue = !settings[key];
    const newSettings = await settingsService.updateSetting(key, updatedValue);
    setSettings(newSettings);
    if (toastLabel) {
      showToast(`${toastLabel} ${updatedValue ? "enabled" : "disabled"}`);
    }
  };

  const handleSelectSetting = async (key, val, toastLabel) => {
    const newSettings = await settingsService.updateSetting(key, val);
    setSettings(newSettings);
    if (key === "accentColor") {
      await themeService.setAccentColor(val);
    }
    if (key === "theme") {
      await setTheme(val);
    }
    if (toastLabel) {
      showToast(`${toastLabel}`);
    }
  };

  // Avatar Picker
  const handlePickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Needed", "Please grant photo library access to change your profile avatar.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setEditAvatarUri(uri);
        if (onUpdateUser) {
          onUpdateUser({ avatarUri: uri });
        }
        showToast("Profile avatar updated! 📸");
      }
    } catch (e) {
      console.warn("Avatar pick error:", e);
    }
  };

  // Save Profile Edit
  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert("Required Field", "Please enter a valid display name.");
      return;
    }
    if (onUpdateUser) {
      onUpdateUser({
        name: editName.trim(),
        email: editEmail.trim(),
        major: editMajor.trim(),
        avatarUri: editAvatarUri,
      });
    }
    setEditProfileModalOpen(false);
    showToast("Profile details saved successfully! ✨");
  };

  // Password modal submit
  const handleChangePasswordSubmit = async () => {
    if (!oldPassword) {
      Alert.alert("Error", "Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match.");
      return;
    }

    const res = await settingsService.verifyAndChangePassword(oldPassword, newPassword);
    if (!res.success) {
      Alert.alert("Authentication Error", res.error || "Current password is incorrect.");
      return;
    }

    setPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password updated securely! 🔒");
  };

  // Save Reminder Time
  const handleSaveReminderTime = async () => {
    const formatted = `${selectedHour.padStart(2, "0")}:${selectedMinute.padStart(2, "0")}`;
    await handleSelectSetting("notificationTime", formatted);
    setTimePickerModalOpen(false);
    showToast(`Daily study reminder set to ${formatted} ⏰`);
  };

  // Clear cache handler
  const handleClearCache = () => {
    const doClear = async () => {
      const res = await settingsService.clearCache();
      showToast(`🧹 Freed ${res.freedMb} of local cache!`);
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to clear 25.7 MB of temporary cached files?")) {
        doClear();
      }
    } else {
      Alert.alert("Clear Local Storage Cache", "Are you sure you want to clear 25.7 MB of cached study assets?", [
        { text: "Cancel", style: "cancel" },
        { text: "Clear Cache", style: "destructive", onPress: doClear },
      ]);
    }
  };

  // Manual Cloud Sync
  const handleSyncNow = async () => {
    setIsSyncing(true);
    const now = new Date();
    const formatted = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    await settingsService.updateSetting("lastSyncedAt", now.toISOString());
    setSettings((prev) => ({ ...prev, lastSyncedAt: now.toISOString() }));
    setTimeout(() => {
      setIsSyncing(false);
      showToast(`⚡ Cloud backup synced at ${formatted}!`);
    }, 600);
  };

  // Export Study Data
  const handleExportData = () => {
    showToast("📦 Exporting study notes & flashcards (JSON)...");
    const payload = settingsService.exportStudyData(user);
    setTimeout(() => {
      showToast("✓ Study archive downloaded to device!");
    }, 800);
  };

  // Reset all settings
  const handleResetAllSettings = () => {
    Alert.alert(
      "Reset All Settings",
      "Are you sure you want to revert all settings to their original defaults?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Defaults",
          style: "destructive",
          onPress: async () => {
            const res = await settingsService.resetSettings();
            setSettings(res);
            showToast("Settings reverted to defaults ↺");
          },
        },
      ]
    );
  };

  // Submit Feedback
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert("Feedback required", "Please write a brief note before submitting.");
      return;
    }
    await settingsService.saveFeedback(feedbackType, feedbackText.trim());
    setFeedbackModalOpen(false);
    setFeedbackText("");
    showToast("Thank you! Your feedback was sent to the StudPal team. 💌");
  };

  // Navigation back handler
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate("profile");
    }
  };

  // Filter sections by search or active category
  const q = searchQuery.toLowerCase().trim();
  const shouldShow = (categoryName, keywords = []) => {
    if (activeCategory !== "all" && activeCategory !== categoryName) return false;
    if (!q) return true;
    const matchCategory = categoryName.toLowerCase().includes(q);
    const matchKeyword = keywords.some((k) => k.toLowerCase().includes(q));
    return matchCategory || matchKeyword;
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <Header
        title={t("settings.title")}
        showBack={true}
        onBack={handleBack}
      />

      {/* ── Toast Banner ────────────────────────────────────────────────── */}
      {toastMessage !== "" && (
        <View style={styles.floatingToast}>
          <Text style={styles.floatingToastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 110 },
        ]}
      >
        {/* ── Search Bar ────────────────────────────────────────────────── */}
        <View style={styles.searchBarWrap}>
          <SearchIcon size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("settings.searchPlaceholder")}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <CloseIcon size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Horizontal Category Jump Pills ────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsRow}
        >
          {[
            { id: "all", label: t("common.viewAll") },
            { id: "appearance", label: `🎨 ${t("settings.appearance")}` },
            { id: "study", label: `⏱️ ${t("settings.studyFocus")}` },
            { id: "focus", label: `🎯 ${t("nav.focusMode")}` },
            { id: "notifications", label: `🔔 ${t("settings.notifications")}` },
            { id: "language", label: `🌐 ${t("settings.languageRegion")}` },
            { id: "security", label: `🛡️ ${t("settings.accountSecurity")}` },
            { id: "data", label: `💾 ${t("settings.dataStorage")}` },
            { id: "support", label: `ℹ️ ${t("profile.helpCenter")}` },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TooltipTouchable
                key={cat.id}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TooltipTouchable>
            );
          })}
        </ScrollView>


        {/* ========================================================================= */}
        {/* 🎨 1. APPEARANCE & INTERFACE SECTION                                     */}
        {/* ========================================================================= */}
        {shouldShow("appearance", ["theme", "dark", "light", "color", "accent", "compact", "font"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#F0EEFF" }]}>
                <MoonIcon size={18} color="#6236FF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t("settings.appearance")}</Text>
                <Text style={styles.sectionSubtitle}>{t("settings.appearanceSub")}</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderDivider} />

            {/* Interface Theme (Light / Dark / System) */}
            <View style={styles.settingGroup}>
              <View style={styles.settingGroupHeader}>
                <Text style={styles.settingGroupLabel}>{t("settings.theme") || "INTERFACE THEME"}</Text>
                <View style={[styles.activeValBadge, { backgroundColor: activeAccentColor + "15" }]}>
                  <Text style={[styles.activeValBadgeText, { color: activeAccentColor }]}>
                    {settings.theme === "dark" ? (t("settings.themeDark") || "Dark") : settings.theme === "light" ? (t("settings.themeLight") || "Light") : (t("settings.themeSystem") || "System")}
                  </Text>
                </View>
              </View>
              <View style={styles.segmentedControlWrap}>
                {[
                  { key: "light", label: t("settings.themeLight") || "Light", icon: SunIcon },
                  { key: "dark", label: t("settings.themeDark") || "Dark", icon: MoonIcon },
                  { key: "system", label: t("settings.themeSystem") || "System", icon: MonitorIcon },
                ].map(({ key, label, icon: IconComponent }) => {
                  const isSelected = (settings.theme || "system") === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                      onPress={() => handleSelectSetting("theme", key, `Theme set to ${label}`)}
                      activeOpacity={0.8}
                    >
                      <IconComponent size={15} color={isSelected ? activeAccentColor : "#64748B"} />
                      <Text style={[styles.segmentBtnText, isSelected && [styles.segmentBtnTextActive, { color: activeAccentColor }]]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Brand Accent Palette */}
            <View style={styles.settingGroup}>
              <View style={styles.settingGroupHeader}>
                <Text style={styles.settingGroupLabel}>{t("settings.accentColor") || "PRIMARY ACCENT HUE"}</Text>
                <View style={[styles.activeValBadge, { backgroundColor: activeAccentColor + "15" }]}>
                  <Text style={[styles.activeValBadgeText, { color: activeAccentColor }]}>
                    {[
                      { color: "#6236FF", name: "Violet" },
                      { color: "#2563EB", name: "Royal Blue" },
                      { color: "#10B981", name: "Emerald" },
                      { color: "#F59E0B", name: "Amber" },
                      { color: "#EC4899", name: "Rose" },
                    ].find((i) => i.color === settings.accentColor)?.name || "Violet"}
                  </Text>
                </View>
              </View>
              <View style={styles.accentColorsRow}>
                {[
                  { color: "#6236FF", name: "StudPal Violet" },
                  { color: "#2563EB", name: "Royal Blue" },
                  { color: "#10B981", name: "Emerald Mint" },
                  { color: "#F59E0B", name: "Amber Gold" },
                  { color: "#EC4899", name: "Berry Rose" },
                ].map((item) => {
                  const isSelected = settings.accentColor === item.color;
                  return (
                    <TooltipTouchable
                      key={item.color}
                      tooltip={item.name}
                      style={[styles.accentColorDot, { backgroundColor: item.color }, isSelected && styles.accentColorDotSelected]}
                      onPress={() => handleSelectSetting("accentColor", item.color, `Accent color updated to ${item.name}`)}
                      activeOpacity={0.8}
                    >
                      {isSelected && <CheckIcon size={14} color="#FFFFFF" />}
                    </TooltipTouchable>
                  );
                })}
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Haptic Feedback Toggle */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.hapticTouch")}</Text>
                <Text style={styles.settingRowSub}>
                  {t("settings.hapticTouchSub")}
                </Text>
              </View>
              <CustomToggle
                value={settings.hapticFeedback !== false}
                onValueChange={() => handleToggle("hapticFeedback", "Haptic feedback")}
                activeColor={activeAccentColor}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* ⏱️ 2. STUDY & FOCUS PREFERENCES SECTION                                  */}
        {/* ========================================================================= */}
        {shouldShow("study", ["pomodoro", "timer", "duration", "break", "goal", "sound", "bell"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#EFF6FF" }]}>
                <ClockIcon size={18} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t("settings.studyFocus")}</Text>
                <Text style={styles.sectionSubtitle}>{t("settings.studyFocusSub")}</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderDivider} />

            {/* Default Focus Duration */}
            <View style={styles.settingGroup}>
              <View style={styles.settingGroupHeader}>
                <Text style={styles.settingGroupLabel}>{t("settings.focusDuration") || "FOCUS INTERVAL DURATION"}</Text>
                <View style={[styles.activeValBadge, { backgroundColor: activeAccentColor + "15" }]}>
                  <Text style={[styles.activeValBadgeText, { color: activeAccentColor }]}>
                    {settings.defaultSessionDuration || 25} min
                  </Text>
                </View>
              </View>
              <View style={styles.segmentedControlWrap}>
                {[15, 25, 45].map((dur) => {
                  const isSelected = settings.defaultSessionDuration === dur;
                  return (
                    <TouchableOpacity
                      key={dur}
                      style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                      onPress={() => handleSelectSetting("defaultSessionDuration", dur, `Focus duration set to ${dur} min`)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.segmentBtnText, isSelected && [styles.segmentBtnTextActive, { color: activeAccentColor }]]}>
                        {dur} min
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Short Break Grid */}
            <View style={styles.settingGroup}>
              <View style={styles.settingGroupHeader}>
                <Text style={styles.settingGroupLabel}>{t("settings.shortBreak") || "SHORT BREAK LENGTH"}</Text>
                <View style={[styles.activeValBadge, { backgroundColor: activeAccentColor + "15" }]}>
                  <Text style={[styles.activeValBadgeText, { color: activeAccentColor }]}>
                    {settings.shortBreakDuration || 5} min
                  </Text>
                </View>
              </View>
              <View style={styles.segmentedControlWrap}>
                {[3, 5, 10].map((b) => {
                  const isSelected = settings.shortBreakDuration === b;
                  return (
                    <TouchableOpacity
                      key={b}
                      style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                      onPress={() => handleSelectSetting("shortBreakDuration", b, `Short break set to ${b}m`)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.segmentBtnText, isSelected && [styles.segmentBtnTextActive, { color: activeAccentColor }]]}>
                        {b} min
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Daily Study Goal */}
            <View style={styles.settingGroup}>
              <View style={styles.settingGroupHeader}>
                <Text style={styles.settingGroupLabel}>{t("settings.dailyGoal") || "DAILY STUDY TARGET"}</Text>
                <View style={[styles.activeValBadge, { backgroundColor: activeAccentColor + "15" }]}>
                  <Text style={[styles.activeValBadgeText, { color: activeAccentColor }]}>
                    {settings.dailyStudyGoal || 60} min
                  </Text>
                </View>
              </View>
              <View style={styles.segmentedControlWrap}>
                {[30, 60, 90].map((goal) => {
                  const isSelected = settings.dailyStudyGoal === goal;
                  return (
                    <TouchableOpacity
                      key={goal}
                      style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                      onPress={() => handleSelectSetting("dailyStudyGoal", goal, `Daily goal set to ${goal} min`)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.segmentBtnText, isSelected && [styles.segmentBtnTextActive, { color: activeAccentColor }]]}>
                        {goal} min
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Auto-start Breaks */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.autoBreaks")}</Text>
                <Text style={styles.settingRowSub}>{t("settings.autoBreaksSub")}</Text>
              </View>
              <CustomToggle
                value={settings.autoStartBreaks !== false}
                onValueChange={() => handleToggle("autoStartBreaks", "Auto-start breaks")}
                activeColor={activeAccentColor}
              />
            </View>

            <View style={styles.settingRowDivider} />

            {/* Sound & Tone Selector */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.soundEffects")}</Text>
                <Text style={styles.settingRowSub}>Play joyful chime on session finish and XP level-up</Text>
              </View>
              <CustomToggle
                value={settings.soundEffects}
                onValueChange={() => handleToggle("soundEffects", "Sound effects")}
                activeColor={activeAccentColor}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* 🎯 3. FOCUS MODE SECTION                                                 */}
        {/* ========================================================================= */}
        {shouldShow("focus", ["focus", "block", "restrict", "distraction"]) && (
          <TouchableOpacity 
            style={[styles.sectionCard, styles.actionNavCard]} 
            activeOpacity={0.78}
            onPress={() => {
              if (onNavigate) {
                onNavigate('focus-mode');
              }
            }}
          >
            <View style={styles.actionNavCardContent}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#FCE7F3" }]}>
                <ShieldIcon size={18} color="#EC4899" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Focus Mode Settings</Text>
                <Text style={styles.sectionSubtitle}>Manage app restrictions, timetable automation, and strict mode.</Text>
              </View>
              <View style={styles.actionNavPill}>
                <ChevronRightIcon size={16} color="#EC4899" />
              </View>
            </View>
          </TouchableOpacity>
        )}


        {/* ========================================================================= */}
        {/* 🔔 4. NOTIFICATIONS SECTION                                               */}
        {/* ========================================================================= */}
        {shouldShow("notifications", ["notification", "reminder", "alarm", "streak", "time", "bell", "alert"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#FFF7ED" }]}>
                <BellIcon size={18} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t("settings.notifications")}</Text>
                <Text style={styles.sectionSubtitle}>{t("settings.notificationsSub")}</Text>
              </View>
            </View>
            <View style={styles.sectionHeaderDivider} />

            {/* Study Reminders Toggle + Time Picker */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.dailyReminders")}</Text>
                <Text style={styles.settingRowSub}>{t("settings.dailyRemindersSub")}</Text>
              </View>
              <CustomToggle
                value={settings.studyReminders}
                onValueChange={() => handleToggle("studyReminders", "Study reminders")}
                activeColor={activeAccentColor}
              />
            </View>

            {settings.studyReminders && (
              <TouchableOpacity
                style={styles.timePickerRow}
                onPress={() => setTimePickerModalOpen(true)}
                activeOpacity={0.75}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={styles.timePickerIconWrap}>
                    <ClockIcon size={15} color="#64748B" />
                  </View>
                  <Text style={styles.timePickerLabel}>{t("settings.reminderTime")}</Text>
                </View>
                <View style={styles.timeBadge}>
                  <Text style={[styles.timeBadgeText, { color: activeAccentColor || '#2563EB' }]}>
                    {settings.notificationTime || "20:00"}
                  </Text>
                  <ChevronRightIcon size={13} color={activeAccentColor || '#2563EB'} />
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.settingRowDivider} />

            {/* Flashcard Due Alerts */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.streakAlerts")}</Text>
                <Text style={styles.settingRowSub}>Alerts when spaced repetition cards are due</Text>
              </View>
              <CustomToggle
                value={settings.revisionReminders}
                onValueChange={() => handleToggle("revisionReminders", "Flashcard alerts")}
                activeColor={activeAccentColor}
              />
            </View>

            <View style={styles.settingRowDivider} />

            {/* Goal Progress Alerts */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Goal Progress Alert</Text>
                <Text style={styles.settingRowSub}>Evening alert at 9:00 PM to encourage completing remaining daily goals</Text>
              </View>
              <CustomToggle
                value={settings.streakAlerts}
                onValueChange={() => handleToggle("streakAlerts", "Goal progress alerts")}
                activeColor={activeAccentColor}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* 🌐 5. LANGUAGE & REGIONAL SECTION                                         */}
        {/* ========================================================================= */}
        {shouldShow("language", ["language", "region", "english", "spanish", "week", "format"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#ECFDF5" }]}>
                <GlobeIcon size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t("settings.languageRegion")}</Text>
                <Text style={styles.sectionSubtitle}>{t("settings.languageRegionSub")}</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderDivider} />

            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => setLangModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.appLanguage")}</Text>
                <Text style={styles.settingRowSub}>12 languages supported • Native translation</Text>
              </View>
              <View style={[styles.rowRightPill, { backgroundColor: "#ECFDF5" }]}>
                <Text style={[styles.rowRightPillText, { color: "#059669" }]}>{settings.language}</Text>
                <ChevronRightIcon size={15} color="#059669" />
              </View>
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            <View style={styles.settingNavigationRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Country Code</Text>
                <Text style={styles.settingRowSub}>Tracked by IP address • National Leaderboard</Text>
              </View>
              <View style={[styles.rowRightPill, { backgroundColor: "#EEF2FF" }]}>
                <Text style={[styles.rowRightPillText, { color: activeAccentColor, fontWeight: "800", letterSpacing: 0.8 }]}>
                  {ipCountryCode}
                </Text>
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            <View style={styles.settingGroup}>
              <View style={styles.settingGroupHeader}>
                <Text style={styles.settingGroupLabel}>{t("settings.firstDay") || "FIRST DAY OF THE WEEK"}</Text>
                <View style={[styles.activeValBadge, { backgroundColor: activeAccentColor + "15" }]}>
                  <Text style={[styles.activeValBadgeText, { color: activeAccentColor }]}>
                    {settings.firstDayOfWeek === "Sunday" ? (t("settings.sunday") || "Sunday") : (t("settings.monday") || "Monday")}
                  </Text>
                </View>
              </View>
              <View style={styles.segmentedControlWrap}>
                {[
                  { key: "Monday", label: t("settings.monday") || "Monday" },
                  { key: "Sunday", label: t("settings.sunday") || "Sunday" },
                ].map(({ key, label }) => {
                  const isSelected = settings.firstDayOfWeek === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                      onPress={() => handleSelectSetting("firstDayOfWeek", key, `Week starts on ${label}`)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.segmentBtnText, isSelected && [styles.segmentBtnTextActive, { color: activeAccentColor }]]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* 🛡️ 6. ACCOUNT & SECURITY SECTION                                         */}
        {/* ========================================================================= */}
        {shouldShow("security", ["password", "account", "security", "login", "2fa", "privacy"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#F0EEFF" }]}>
                <ShieldIcon size={18} color="#6236FF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t("settings.accountSecurity")}</Text>
                <Text style={styles.sectionSubtitle}>{t("settings.accountSecuritySub")}</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderDivider} />

            {/* Change Password */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => setPasswordModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Change Account Password</Text>
                <Text style={styles.settingRowSub}>Update your login credentials securely</Text>
              </View>
              <View style={styles.navChevronCircle}>
                <ChevronRightIcon size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* 2FA Toggle */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.twoFactor")}</Text>
                <Text style={styles.settingRowSub}>Require verification code on new device sign-ins</Text>
              </View>
              <CustomToggle
                value={settings.twoFactorEnabled}
                onValueChange={() => handleToggle("twoFactorEnabled", "Two-factor auth")}
                activeColor={activeAccentColor}
              />
            </View>

            <View style={styles.settingRowDivider} />

            {/* Email Security Alerts */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Security Email Alerts</Text>
                <Text style={styles.settingRowSub}>Get notified when account changes or logins occur</Text>
              </View>
              <CustomToggle
                value={settings.emailNotifications}
                onValueChange={() => handleToggle("emailNotifications", "Security emails")}
                activeColor={activeAccentColor}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* 💾 7. DATA, STORAGE & CLOUD SYNC SECTION                                  */}
        {/* ========================================================================= */}
        {shouldShow("data", ["data", "storage", "sync", "backup", "cache", "export", "offline"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#E0F2FE" }]}>
                <DatabaseIcon size={18} color="#0EA5E9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t("settings.dataStorage")}</Text>
                <Text style={styles.sectionSubtitle}>{t("settings.dataStorageSub")}</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderDivider} />

            {/* Storage Usage Widget */}
            <View style={styles.storageMeterBox}>
              <View style={styles.storageMeterHeader}>
                <View>
                  <Text style={styles.storageMeterTitle}>Local Storage Quota</Text>
                  <Text style={styles.storageMeterSub}>25.7 MB used of 500 MB capacity</Text>
                </View>
                <View style={styles.storageFreeBadge}>
                  <Text style={styles.storageFreeBadgeText}>95% Free</Text>
                </View>
              </View>

              {/* Quota Progress Bar: Shows Used Space vs Free Track */}
              <View style={styles.storageTrack}>
                <View style={{ width: "26%", flexDirection: "row", height: "100%" }}>
                  <View style={[styles.storageSegment, { flex: 8.4, backgroundColor: "#6366F1" }]} />
                  <View style={styles.storageSegmentGap} />
                  <View style={[styles.storageSegment, { flex: 11.6, backgroundColor: "#0EA5E9" }]} />
                  <View style={styles.storageSegmentGap} />
                  <View style={[styles.storageSegment, { flex: 5.7, backgroundColor: "#F59E0B" }]} />
                </View>
                <View style={{ flex: 1, backgroundColor: isDark ? "#334155" : "#E2E8F0" }} />
              </View>

              {/* 3-Column Stats Row with Hairline Dividers */}
              <View style={styles.storageMetricsRow}>
                <View style={styles.storageMetricCol}>
                  <View style={styles.storageMetricHeader}>
                    <View style={[styles.storageDot, { backgroundColor: "#6366F1" }]} />
                    <Text style={styles.storageMetricName}>Decks</Text>
                  </View>
                  <Text style={styles.storageMetricVal}>8.4 MB</Text>
                  <Text style={styles.storageMetricPct}>33% of used</Text>
                </View>

                <View style={styles.storageMetricDivider} />

                <View style={styles.storageMetricCol}>
                  <View style={styles.storageMetricHeader}>
                    <View style={[styles.storageDot, { backgroundColor: "#0EA5E9" }]} />
                    <Text style={styles.storageMetricName}>Notes</Text>
                  </View>
                  <Text style={styles.storageMetricVal}>11.6 MB</Text>
                  <Text style={styles.storageMetricPct}>45% of used</Text>
                </View>

                <View style={styles.storageMetricDivider} />

                <View style={styles.storageMetricCol}>
                  <View style={styles.storageMetricHeader}>
                    <View style={[styles.storageDot, { backgroundColor: "#F59E0B" }]} />
                    <Text style={styles.storageMetricName}>Cache</Text>
                  </View>
                  <Text style={styles.storageMetricVal}>5.7 MB</Text>
                  <Text style={styles.storageMetricPct}>22% of used</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Offline Mode */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.offlineMode")}</Text>
                <Text style={styles.settingRowSub}>Keep active decks & notes downloaded for offline study</Text>
              </View>
              <CustomToggle
                value={settings.offlineMode}
                onValueChange={() => handleToggle("offlineMode", "Offline cache")}
                activeColor={activeAccentColor}
              />
            </View>

            <View style={styles.settingRowDivider} />

            {/* Force Cloud Sync */}
            <View style={styles.settingNavigationRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>{t("settings.cloudSync")}</Text>
                <Text style={styles.settingRowSub}>
                  Last backup: {new Date(settings.lastSyncedAt || Date.now()).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.actionPillBtn, isSyncing && { opacity: 0.6 }]}
                onPress={handleSyncNow}
                disabled={isSyncing}
                activeOpacity={0.8}
              >
                <SyncIcon size={13} color={isDark ? "#38BDF8" : "#0284C7"} />
                <Text style={styles.actionPillBtnText}>{isSyncing ? "Syncing..." : "Sync Now"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Export Data */}
            <View style={styles.settingNavigationRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Export Study Archive</Text>
                <Text style={styles.settingRowSub}>Download all flashcards, notes and XP history in JSON</Text>
              </View>
              <TouchableOpacity
                style={styles.actionPillBtn}
                onPress={handleExportData}
                activeOpacity={0.8}
              >
                <DownloadIcon size={13} color={isDark ? "#38BDF8" : "#0284C7"} />
                <Text style={styles.actionPillBtnText}>Export JSON</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Clear Cache Action */}
            <TouchableOpacity
              style={styles.clearCacheBtn}
              onPress={handleClearCache}
              activeOpacity={0.82}
            >
              <TrashIcon size={16} color="#FFFFFF" />
              <Text style={styles.clearCacheBtnText}>{t("settings.clearCache") || "Clear Cached Documents"}</Text>
              <View style={styles.clearCacheDot} />
              <Text style={styles.clearCacheSizeText}>25.7 MB</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* ℹ️ 8. ABOUT, SUPPORT & RESET SECTION                                      */}
        {/* ========================================================================= */}
        {shouldShow("support", ["support", "faq", "help", "about", "feedback", "reset", "version", "terms"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#F1F5F9" }]}>
                <HelpIcon size={18} color="#475569" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t("profile.helpCenter")}</Text>
                <Text style={styles.sectionSubtitle}>FAQs, bug reports, and app information</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderDivider} />

            {/* FAQ Item */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => {
                if (onNavigate) onNavigate("help");
                else setFaqModalOpen(true);
              }}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Frequently Asked Questions (FAQ)</Text>
                <Text style={styles.settingRowSub}>SRS algorithm, offline mode, XP scoring</Text>
              </View>
              <View style={styles.navChevronCircle}>
                <ChevronRightIcon size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* Send Feedback */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => {
                if (onNavigate) onNavigate("help");
                else setFeedbackModalOpen(true);
              }}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Send Feedback or Bug Report</Text>
                <Text style={styles.settingRowSub}>Help us improve your study experience</Text>
              </View>
              <View style={styles.navChevronCircle}>
                <ChevronRightIcon size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* Reset All Settings Button */}
            <TouchableOpacity
              style={styles.resetSettingsBtn}
              onPress={handleResetAllSettings}
              activeOpacity={0.8}
            >
              <ResetIcon size={15} color={isDark ? "#94A3B8" : "#475569"} />
              <Text style={styles.resetSettingsBtnText}>{t("settings.resetDefaults")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ========================================================================= */}
      {/* ── MODAL 1: EDIT PROFILE MODAL                                            */}
      {/* ========================================================================= */}
      <Modal visible={isEditProfileModalOpen} animationType="slide" transparent onRequestClose={() => setEditProfileModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Edit Profile Info</Text>
              <TouchableOpacity onPress={() => setEditProfileModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarEditRow}>
              <TouchableOpacity style={styles.modalAvatarCircle} onPress={handlePickAvatar} activeOpacity={0.85}>
                {editAvatarUri ? (
                  <Image source={{ uri: editAvatarUri }} style={styles.modalAvatarImg} />
                ) : (
                  <Text style={styles.modalAvatarLetter}>{editName ? editName[0].toUpperCase() : "A"}</Text>
                )}
                <View style={styles.modalAvatarBadge}>
                  <CameraIcon size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.avatarHintTitle}>Change Avatar Photo</Text>
                <Text style={styles.avatarHintSub}>Upload a square photo from your device library</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Your full name"
                placeholderTextColor="#94A3B8"
                value={editName}
                onChangeText={setEditName}
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="student@university.edu"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={editEmail}
                onChangeText={setEditEmail}
              />

              <Text style={styles.inputLabel}>Major / Academic Focus</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Computer Science, Pre-Med"
                placeholderTextColor="#94A3B8"
                value={editMajor}
                onChangeText={setEditMajor}
              />
            </View>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleSaveProfile} activeOpacity={0.88}>
              <Text style={styles.modalActionBtnText}>Save Profile Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================================= */}
      {/* ── MODAL 2: CHANGE PASSWORD MODAL                                         */}
      {/* ========================================================================= */}
      <Modal visible={isPasswordModalOpen} animationType="slide" transparent onRequestClose={() => setPasswordModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setPasswordModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter current password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
              />

              <Text style={styles.inputLabel}>New Password (Min 6 Characters)</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="At least 6 characters"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Re-enter new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.showPassRow}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.showPassText}>{showPassword ? "🙈 Hide Passwords" : "👁️ Show Passwords"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleChangePasswordSubmit} activeOpacity={0.88}>
              <Text style={styles.modalActionBtnText}>Update Password Securely</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================================= */}
      {/* ── MODAL 3: REMINDER TIME PICKER MODAL                                    */}
      {/* ========================================================================= */}
      <Modal visible={isTimePickerModalOpen} animationType="fade" transparent onRequestClose={() => setTimePickerModalOpen(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.timePickerCard}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Set Daily Study Reminder</Text>
              <TouchableOpacity onPress={() => setTimePickerModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubDesc}>Choose the time you'd like StudPal to remind you to study each day.</Text>

            <View style={styles.timePickersRow}>
              {/* Hour Column */}
              <View style={styles.timePickCol}>
                <Text style={styles.timeColHeader}>Hour</Text>
                <ScrollView style={{ maxHeight: 160 }} showsVerticalScrollIndicator={false}>
                  {["07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"].map((h) => {
                    const isSelected = selectedHour === h;
                    return (
                      <TouchableOpacity
                        key={h}
                        style={[styles.timeItemBtn, isSelected && styles.timeItemBtnSelected]}
                        onPress={() => setSelectedHour(h)}
                      >
                        <Text style={[styles.timeItemText, isSelected && styles.timeItemTextSelected]}>{h}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <Text style={{ fontSize: 24, fontWeight: "800", color: "#64748B", alignSelf: "center" }}>:</Text>

              {/* Minute Column */}
              <View style={styles.timePickCol}>
                <Text style={styles.timeColHeader}>Minute</Text>
                <ScrollView style={{ maxHeight: 160 }} showsVerticalScrollIndicator={false}>
                  {["00", "15", "30", "45"].map((m) => {
                    const isSelected = selectedMinute === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[styles.timeItemBtn, isSelected && styles.timeItemBtnSelected]}
                        onPress={() => setSelectedMinute(m)}
                      >
                        <Text style={[styles.timeItemText, isSelected && styles.timeItemTextSelected]}>{m}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleSaveReminderTime} activeOpacity={0.88}>
              <Text style={styles.modalActionBtnText}>Save Reminder Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* ========================================================================= */}
      {/* ── MODAL 5: LANGUAGE SELECTOR MODAL                                       */}
      {/* ========================================================================= */}
      <Modal visible={isLangModalOpen} animationType="fade" transparent onRequestClose={() => setLangModalOpen(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.langModalCard}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>{t("settings.selectLanguage")}</Text>
              <TouchableOpacity onPress={() => setLangModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.langScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = settings.language === lang.name || currentLanguageCode === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.langOptionRow, isSelected && styles.langOptionSelected]}
                    onPress={() => {
                      handleSelectSetting("language", lang.name, `Language updated to ${lang.name}`);
                      setLanguage(lang.code);
                      setLangModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.langFlagTag}>
                      <Text style={{ fontSize: 20 }}>{lang.flag}</Text>
                      <View style={styles.langTagBadge}>
                        <Text style={styles.langTagBadgeText}>{lang.tag}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 4 }}>
                      <Text style={[styles.langOptionText, isSelected && styles.langOptionTextSelected]}>
                        {lang.name}
                      </Text>
                      <Text style={styles.langOptionSub}>{lang.nativeName}</Text>
                    </View>
                    {isSelected && <CheckIcon size={18} color={activeAccentColor} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>


      {/* ========================================================================= */}
      {/* ── MODAL 6: FAQ MODAL                                                     */}
      {/* ========================================================================= */}
      <Modal visible={isFaqModalOpen} animationType="slide" transparent onRequestClose={() => setFaqModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { maxHeight: "85%" }]}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Frequently Asked Questions</Text>
              <TouchableOpacity onPress={() => setFaqModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {FAQ_ITEMS.map((item, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.faqCard}
                    onPress={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.faqCardHeader}>
                      <Text style={styles.faqQuestionText}>{item.q}</Text>
                      <Text style={{ fontSize: 14, color: "#6236FF", fontWeight: "800" }}>
                        {isExpanded ? "▲" : "▼"}
                      </Text>
                    </View>
                    {isExpanded && <Text style={styles.faqAnswerText}>{item.a}</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* ── MODAL 7: FEEDBACK / BUG REPORT MODAL                                   */}
      {/* ========================================================================= */}
      <Modal visible={isFeedbackModalOpen} animationType="slide" transparent onRequestClose={() => setFeedbackModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Send Feedback & Ideas</Text>
              <TouchableOpacity onPress={() => setFeedbackModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.feedbackTypePillsRow}>
              {["Feature Suggestion", "Bug Report", "General Praise"].map((type) => {
                const isSelected = feedbackType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.feedbackPill, isSelected && styles.feedbackPillActive]}
                    onPress={() => setFeedbackType(type)}
                  >
                    <Text style={[styles.feedbackPillText, isSelected && styles.feedbackPillTextActive]}>{type}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Your Message</Text>
              <TextInput
                style={[styles.modalTextInput, { height: 100, textAlignVertical: "top" }]}
                placeholder="Tell us what we can improve or what you loved..."
                placeholderTextColor="#94A3B8"
                multiline
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
            </View>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleSubmitFeedback} activeOpacity={0.88}>
              <Text style={styles.modalActionBtnText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const baseStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 20,
  },

  // Floating Toast
  floatingToast: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 36,
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: "rgba(15, 23, 42, 0.94)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  floatingToastText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // Search Bar
  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },

  // Category Pills
  categoryPillsRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryPillActive: {
    backgroundColor: "#6236FF",
    borderColor: "#6236FF",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryPillText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748B",
  },
  categoryPillTextActive: {
    color: "#FFFFFF",
  },

  // User Summary Card
  userSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  userAvatarWrap: {
    position: "relative",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#6236FF",
  },
  avatarCameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#6236FF",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userNameText: {
    fontSize: 16.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  userEmailText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  userBadgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  levelBadgePill: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6236FF",
  },
  streakBadgePill: {
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  editProfileBtn: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  editProfileBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
  },

  // Section Card
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  sectionHeaderDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 14,
  },
  sectionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 17,
  },

  // Action Navigation Card (Focus Mode)
  actionNavCard: {
    paddingVertical: 18,
  },
  actionNavCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  actionNavPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
  },

  // Setting Group (Label + Active Badge + Segmented Control)
  settingGroup: {
    gap: 8,
    marginVertical: 2,
  },
  settingGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingGroupLabel: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  activeValBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  activeValBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
  },

  // Unified Segmented Control Track
  segmentedControlWrap: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 13,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  segmentBtnTextActive: {
    fontWeight: "800",
  },

  // Brand Accent Dots
  accentColorsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  accentColorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  accentColorDotSelected: {
    borderWidth: 3.5,
    borderColor: "#0F172A",
    transform: [{ scale: 1.12 }],
  },

  // Setting Row (Toggles & Simple Inputs)
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    minHeight: 46,
  },
  settingRowTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 20,
  },
  settingRowSub: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 17,
  },
  settingRowDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },

  // Navigation Rows (Language, Password, FAQ, Feedback)
  settingNavigationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    minHeight: 48,
  },
  navChevronCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  rowRightPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 11,
  },
  rowRightPillText: {
    fontSize: 12.5,
    fontWeight: "700",
  },

  // Time Picker Row (Calm & Un-alarming)
  timePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
  },
  timePickerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#EDF2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  timePickerLabel: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#334155",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  timeBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },

  // Storage Meter Box
  storageMeterBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  storageMeterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  storageMeterTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  storageMeterSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  storageFreeBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  storageFreeBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.2,
  },
  storageTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 14,
  },
  storageSegment: {
    height: "100%",
  },
  storageSegmentGap: {
    width: 2,
    backgroundColor: "#FFFFFF",
  },
  storageMetricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  storageMetricCol: {
    flex: 1,
    alignItems: "center",
  },
  storageMetricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  storageDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  storageMetricName: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#64748B",
  },
  storageMetricVal: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  storageMetricPct: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 1.5,
  },
  storageMetricDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E2E8F0",
  },

  // Action Buttons (Sync & Export)
  actionPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 12,
    paddingVertical: 7.5,
    borderRadius: 10,
  },
  actionPillBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0284C7",
  },

  // Clear Cache Action Button
  clearCacheBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#E11D48",
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    shadowColor: "#E11D48",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 4,
  },
  clearCacheBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  clearCacheDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  clearCacheSizeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
  },
  resetSettingsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  resetSettingsBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#334155",
    letterSpacing: 0.1,
  },

  // App Footer
  appFooterInfo: {
    alignItems: "center",
    marginVertical: 14,
    gap: 4,
  },
  footerBrandBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerBrandText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  upToDatePill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  upToDateText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  appFooterVer: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  appFooterCopyright: {
    fontSize: 11,
    color: "#CBD5E1",
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  modalSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 36,
    gap: 16,
  },
  modalSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  modalSubDesc: {
    fontSize: 13,
    color: "#64748B",
    marginTop: -8,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalAvatarCircle: {
    position: "relative",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  modalAvatarLetter: {
    fontSize: 22,
    fontWeight: "800",
    color: "#6236FF",
  },
  modalAvatarBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#6236FF",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHintTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  avatarHintSub: {
    fontSize: 11.5,
    color: "#64748B",
  },
  formGroup: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalTextInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
  },
  showPassRow: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  showPassText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#6236FF",
  },
  modalActionBtn: {
    backgroundColor: "#6236FF",
    borderRadius: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalActionBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // Time Picker Card
  timePickerCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  timePickersRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 8,
  },
  timePickCol: {
    alignItems: "center",
    width: 90,
  },
  timeColHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    marginBottom: 6,
  },
  timeItemBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 2,
  },
  timeItemBtnSelected: {
    backgroundColor: "#6236FF",
  },
  timeItemText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  timeItemTextSelected: {
    color: "#FFFFFF",
  },

  // AI Persona Card
  personaOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
  },
  personaOptionCardSelected: {
    backgroundColor: "#F0EEFF",
    borderColor: "#8B5CF6",
  },
  personaTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  personaTitleSelected: {
    color: "#6236FF",
  },
  personaDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },

  // Language Modal
  langModalCard: {
    width: "100%",
    maxWidth: 350,
    maxHeight: "82%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  langScroll: {
    maxHeight: 400,
  },
  langOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  langOptionSelected: {
    backgroundColor: "#F0EEFF",
    borderColor: "#C7D2FE",
  },
  langFlagTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  langTagBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  langTagBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  langOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  langOptionTextSelected: {
    fontWeight: "800",
    color: "#6236FF",
  },
  langOptionSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },

  // FAQ Card
  faqCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  faqCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  faqAnswerText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
  },

  // Feedback Pills
  feedbackTypePillsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  feedbackPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  feedbackPillActive: {
    backgroundColor: "#6236FF",
    borderColor: "#6236FF",
  },
  feedbackPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  feedbackPillTextActive: {
    color: "#FFFFFF",
  },
});

const getStyles = (isDark, activeAccentColor, insets = { bottom: 0 }) => {
  return {
    ...baseStyles,
    root: [baseStyles.root, isDark && { backgroundColor: "#0B0F19" }],
    searchBarWrap: [baseStyles.searchBarWrap, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    searchInput: [baseStyles.searchInput, isDark && { color: "#F8FAFC" }],
    categoryPill: [baseStyles.categoryPill, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    categoryPillActive: [baseStyles.categoryPillActive, { backgroundColor: activeAccentColor, borderColor: activeAccentColor, shadowColor: activeAccentColor }],
    categoryPillText: [baseStyles.categoryPillText, isDark && { color: "#94A3B8" }],
    userSummaryCard: [baseStyles.userSummaryCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    userAvatarWrap: [baseStyles.userAvatarWrap, isDark && { backgroundColor: "#0F172A" }],
    userNameText: [baseStyles.userNameText, isDark && { color: "#F8FAFC" }],
    userEmailText: [baseStyles.userEmailText, isDark && { color: "#94A3B8" }],
    editProfileBtn: [baseStyles.editProfileBtn, isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    editProfileBtnText: [baseStyles.editProfileBtnText, isDark && { color: "#F8FAFC" }],
    sectionCard: [baseStyles.sectionCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    sectionHeaderDivider: [baseStyles.sectionHeaderDivider, isDark && { backgroundColor: "transparent", height: 0 }],
    sectionTitle: [baseStyles.sectionTitle, isDark && { color: "#F8FAFC" }],
    sectionSubtitle: [baseStyles.sectionSubtitle, isDark && { color: "#94A3B8" }],
    settingGroupLabel: [baseStyles.settingGroupLabel, isDark && { color: "#94A3B8" }],
    segmentedControlWrap: [baseStyles.segmentedControlWrap, isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    segmentBtnActive: [baseStyles.segmentBtnActive, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    segmentBtnText: [baseStyles.segmentBtnText, isDark && { color: "#94A3B8" }],
    settingRowTitle: [baseStyles.settingRowTitle, isDark && { color: "#F8FAFC" }],
    settingRowSub: [baseStyles.settingRowSub, isDark && { color: "#94A3B8" }],
    settingRowDivider: [baseStyles.settingRowDivider, isDark && { backgroundColor: "transparent", height: 0 }],
    navChevronCircle: [baseStyles.navChevronCircle, isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    timePickerRow: [baseStyles.timePickerRow, isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    timePickerIconWrap: [baseStyles.timePickerIconWrap, isDark && { backgroundColor: "#1E293B" }],
    timePickerLabel: [baseStyles.timePickerLabel, isDark && { color: "#F8FAFC" }],
    timeBadge: [baseStyles.timeBadge, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    storageMeterBox: [baseStyles.storageMeterBox, isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    storageMeterTitle: [baseStyles.storageMeterTitle, isDark && { color: "#F8FAFC" }],
    storageMeterSub: [baseStyles.storageMeterSub, isDark && { color: "#94A3B8" }],
    storageFreeBadge: [baseStyles.storageFreeBadge, isDark && { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.3)" }],
    storageFreeBadgeText: [baseStyles.storageFreeBadgeText, isDark && { color: "#34D399" }],
    storageTrack: [baseStyles.storageTrack, isDark && { backgroundColor: "#334155" }],
    storageSegmentGap: [baseStyles.storageSegmentGap, isDark && { backgroundColor: "#0F172A" }],
    storageMetricsRow: [baseStyles.storageMetricsRow, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    storageMetricName: [baseStyles.storageMetricName, isDark && { color: "#94A3B8" }],
    storageMetricVal: [baseStyles.storageMetricVal, isDark && { color: "#F8FAFC" }],
    storageMetricPct: [baseStyles.storageMetricPct, isDark && { color: "#64748B" }],
    storageMetricDivider: [baseStyles.storageMetricDivider, isDark && { backgroundColor: "transparent", width: 0 }],
    actionPillBtn: [baseStyles.actionPillBtn, isDark && { backgroundColor: "rgba(14, 165, 233, 0.15)", borderColor: "rgba(14, 165, 233, 0.3)" }],
    actionPillBtnText: [baseStyles.actionPillBtnText, isDark && { color: "#38BDF8" }],
    clearCacheBtn: [
      baseStyles.clearCacheBtn,
      isDark && {
        backgroundColor: "#BE123C",
        borderColor: "transparent",
        borderWidth: 0,
        shadowColor: "#000000",
        shadowOpacity: 0.35,
      },
    ],
    resetSettingsBtn: [
      baseStyles.resetSettingsBtn,
      isDark && {
        backgroundColor: "#1E293B",
        borderWidth: 0,
        borderColor: "transparent",
        shadowColor: "#000000",
        shadowOpacity: 0.25,
      },
    ],
    resetSettingsBtnText: [baseStyles.resetSettingsBtnText, isDark && { color: "#F8FAFC" }],
    footerBrandText: [baseStyles.footerBrandText, isDark && { color: "#F8FAFC" }],
    modalSheetContainer: [
      baseStyles.modalSheetContainer,
      { paddingBottom: Math.max(insets?.bottom || 0, 16) + 20 },
      isDark && { backgroundColor: "#0F172A" }
    ],
    modalSheetTitle: [baseStyles.modalSheetTitle, isDark && { color: "#F8FAFC" }],
    modalSubDesc: [baseStyles.modalSubDesc, isDark && { color: "#94A3B8" }],
    modalCloseBtn: [baseStyles.modalCloseBtn, isDark && { backgroundColor: "#1E293B" }],
    avatarEditRow: [baseStyles.avatarEditRow, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    avatarHintTitle: [baseStyles.avatarHintTitle, isDark && { color: "#F8FAFC" }],
    avatarHintSub: [baseStyles.avatarHintSub, isDark && { color: "#94A3B8" }],
    inputLabel: [baseStyles.inputLabel, isDark && { color: "#CBD5E1" }],
    modalTextInput: [baseStyles.modalTextInput, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent", color: "#F8FAFC" }],
    timePickerCard: [baseStyles.timePickerCard, isDark && { backgroundColor: "#0F172A" }],
    timeItemText: [baseStyles.timeItemText, isDark && { color: "#F8FAFC" }],
    personaOptionCard: [baseStyles.personaOptionCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    personaTitle: [baseStyles.personaTitle, isDark && { color: "#F8FAFC" }],
    personaDesc: [baseStyles.personaDesc, isDark && { color: "#94A3B8" }],
    langModalCard: [baseStyles.langModalCard, isDark && { backgroundColor: "#0F172A" }],
    langOptionRow: [baseStyles.langOptionRow, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    langOptionText: [baseStyles.langOptionText, isDark && { color: "#F8FAFC" }],
    langOptionSub: [baseStyles.langOptionSub, isDark && { color: "#94A3B8" }],
    faqCard: [baseStyles.faqCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    faqQuestionText: [baseStyles.faqQuestionText, isDark && { color: "#F8FAFC" }],
    faqAnswerText: [baseStyles.faqAnswerText, isDark && { color: "#CBD5E1", borderTopWidth: 0, borderTopColor: "transparent" }],
    feedbackPill: [baseStyles.feedbackPill, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    feedbackPillText: [baseStyles.feedbackPillText, isDark && { color: "#94A3B8" }],
  };
};
