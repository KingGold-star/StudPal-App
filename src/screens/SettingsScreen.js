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
import BottomNavBar from "../components/BottomNavBar";
import { settingsService, DEFAULT_SETTINGS } from "../services/settings/settingsService";
import { themeService } from "../theme/themeService";
import { gamificationService } from "../services/gamification/gamificationService";
import { calculateUserLevel } from "../services/gamification/levels";
import { Colors } from "../theme/colors";

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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const activeAccentColor = settings.accentColor || Colors.accent || "#6236FF";
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
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <Header
        title="Settings"
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
          { paddingBottom: Math.max(insets.bottom, 16) + 90 },
        ]}
      >
        {/* ── Search Bar ────────────────────────────────────────────────── */}
        <View style={styles.searchBarWrap}>
          <SearchIcon size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search settings, timer, theme, notifications..."
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
            { id: "all", label: "All" },
            { id: "appearance", label: "🎨 Appearance" },
            { id: "study", label: "⏱️ Pomodoro" },
            { id: "aicoach", label: "🤖 Branco" },
            { id: "notifications", label: "🔔 Notifications" },
            { id: "language", label: "🌐 Language" },
            { id: "security", label: "🛡️ Security" },
            { id: "data", label: "💾 Data & Sync" },
            { id: "support", label: "ℹ️ Support" },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── User Profile Hero Card ────────────────────────────────────── */}
        {(!q || q.includes("profile") || q.includes("user") || q.includes("account")) && (
          <View style={styles.userSummaryCard}>
            <View style={styles.userAvatarWrap}>
              {user?.avatarUri || editAvatarUri ? (
                <Image source={{ uri: editAvatarUri || user?.avatarUri }} style={styles.userAvatarImg} />
              ) : (
                <Text style={styles.userAvatarText}>
                  {user?.name ? user.name[0].toUpperCase() : "A"}
                </Text>
              )}
              <TouchableOpacity
                style={styles.avatarCameraBadge}
                onPress={handlePickAvatar}
                activeOpacity={0.85}
              >
                <CameraIcon size={11} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.userNameText}>{user?.name || "Alex Johnson"}</Text>
              <Text style={styles.userEmailText}>{user?.email || "alex.johnson@university.edu"}</Text>
              <View style={styles.userBadgeRow}>
                <View style={styles.levelBadgePill}>
                  <Text style={styles.levelBadgeText}>Level {currentLevel.level} • {currentLevel.title}</Text>
                </View>
                <View style={styles.streakBadgePill}>
                  <Text style={styles.streakBadgeText}>🔥 7-Day Streak</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => setEditProfileModalOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.editProfileBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

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
                <Text style={styles.sectionTitle}>Appearance & Interface</Text>
                <Text style={styles.sectionSubtitle}>Theme, accent palette and visual density</Text>
              </View>
            </View>



            {/* Brand Accent Palette */}
            <Text style={styles.settingLabelText}>Brand Accent Color</Text>
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
                  <TouchableOpacity
                    key={item.color}
                    style={[styles.accentColorDot, { backgroundColor: item.color }, isSelected && styles.accentColorDotSelected]}
                    onPress={() => handleSelectSetting("accentColor", item.color, `Accent color updated to ${item.name}`)}
                    activeOpacity={0.8}
                  >
                    {isSelected && <CheckIcon size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.settingRowDivider} />

            {/* Compact Mode Toggle */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Compact Dashboard Mode</Text>
                <Text style={styles.settingRowSub}>
                  Dense cards layout with tighter margins on the home dashboard
                </Text>
              </View>
              <CustomToggle
                value={settings.compactMode}
                onValueChange={() => handleToggle("compactMode", "Compact mode")}
                activeColor={activeAccentColor}
              />
            </View>

            <View style={styles.settingRowDivider} />

            {/* Haptic Feedback Toggle */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Haptic Touch Feedback</Text>
                <Text style={styles.settingRowSub}>
                  Tactile vibrations on timer clicks, deck flips, and XP rewards
                </Text>
              </View>
              <CustomToggle
                value={settings.hapticFeedback}
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
                <Text style={styles.sectionTitle}>Focus & Pomodoro Timer</Text>
                <Text style={styles.sectionSubtitle}>Intervals, breaks, daily goals and chime sounds</Text>
              </View>
            </View>

            {/* Default Focus Duration */}
            <Text style={styles.settingLabelText}>Default Focus Interval</Text>
            <View style={styles.segmentGrid}>
              {[15, 25, 45, 60].map((dur) => {
                const isSelected = settings.defaultSessionDuration === dur;
                return (
                  <TouchableOpacity
                    key={dur}
                    style={[styles.optionPill, isSelected && styles.optionPillSelectedBlue]}
                    onPress={() => handleSelectSetting("defaultSessionDuration", dur, `Focus duration set to ${dur} min`)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                      {dur}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.settingRowDivider} />

            {/* Short & Long Breaks Grid */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabelText}>Short Break</Text>
                <View style={styles.segmentGrid}>
                  {[3, 5, 10].map((b) => {
                    const isSelected = settings.shortBreakDuration === b;
                    return (
                      <TouchableOpacity
                        key={b}
                        style={[styles.optionPill, isSelected && styles.optionPillSelectedBlue]}
                        onPress={() => handleSelectSetting("shortBreakDuration", b, `Short break set to ${b}m`)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                          {b}m
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabelText}>Long Break</Text>
                <View style={styles.segmentGrid}>
                  {[15, 20, 30].map((b) => {
                    const isSelected = settings.longBreakDuration === b;
                    return (
                      <TouchableOpacity
                        key={b}
                        style={[styles.optionPill, isSelected && styles.optionPillSelectedBlue]}
                        onPress={() => handleSelectSetting("longBreakDuration", b, `Long break set to ${b}m`)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                          {b}m
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Daily Study Goal */}
            <Text style={styles.settingLabelText}>Daily Study Goal</Text>
            <View style={styles.segmentGrid}>
              {[30, 45, 60, 90, 120].map((goal) => {
                const isSelected = settings.dailyStudyGoal === goal;
                return (
                  <TouchableOpacity
                    key={goal}
                    style={[styles.optionPill, isSelected && styles.optionPillSelectedBlue]}
                    onPress={() => handleSelectSetting("dailyStudyGoal", goal, `Daily goal set to ${goal} min`)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                      {goal}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.settingRowDivider} />

            {/* Auto-start Breaks */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Auto-start Breaks</Text>
                <Text style={styles.settingRowSub}>Automatically begin break timer when focus block finishes</Text>
              </View>
              <CustomToggle
                value={settings.autoStartBreaks}
                onValueChange={() => handleToggle("autoStartBreaks", "Auto-start breaks")}
                activeColor={activeAccentColor}
              />
            </View>

            <View style={styles.settingRowDivider} />

            {/* Sound & Tone Selector */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Completion Sound Effects</Text>
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
        {/* 🤖 3. AI COACH & STUDY INTELLIGENCE SECTION                              */}
        {/* ========================================================================= */}
        {shouldShow("aicoach", ["ai", "coach", "tutor", "socratic", "persona", "pdf", "spaced", "srs"]) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: "#F3E8FF" }]}>
                <BotIcon size={18} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Branco Intelligence</Text>
                <Text style={styles.sectionSubtitle}>Tutoring style, explanation depth, and smart algorithms</Text>
              </View>
            </View>

            {/* AI Coach Persona */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => setAiPersonaModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Companion Personality</Text>
                <Text style={styles.settingRowSub}>
                  {settings.aiPersonality === "encouraging"
                    ? "✨ Encouraging & Warm (High Motivation)"
                    : settings.aiPersonality === "rigorous"
                    ? "🎯 Rigorous & Direct (Exam Focus)"
                    : settings.aiPersonality === "socratic"
                    ? "🧠 Socratic Tutor (Guided Questioning)"
                    : "⚡ Concise & Quick (Bullet Summaries)"}
                </Text>
              </View>
              <View style={styles.rowRightPill}>
                <Text style={styles.rowRightPillText}>Change</Text>
                <ChevronRightIcon size={15} color="#6236FF" />
              </View>
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* AI Reasoning Depth */}
            <Text style={styles.settingLabelText}>Explanation Detail Level</Text>
            <View style={styles.themeSegmentContainer}>
              {[
                { id: "fast", label: "⚡ Fast" },
                { id: "balanced", label: "⚖️ Balanced" },
                { id: "detailed", label: "🔬 In-Depth" },
              ].map((item) => {
                const isSelected = settings.aiModelDepth === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.themePill, isSelected && styles.themePillSelectedPurple]}
                    onPress={() => handleSelectSetting("aiModelDepth", item.id, `AI detail set to ${item.label}`)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.themePillText, isSelected && styles.themePillTextSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.settingRowDivider} />

            {/* Spaced Repetition SRS optimization */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>SM-2 Spaced Repetition</Text>
                <Text style={styles.settingRowSub}>
                  Dynamically space flashcard reviews based on your recall accuracy
                </Text>
              </View>
              <CustomToggle
                value={settings.spacedRepetitionSmartIntervals}
                onValueChange={() => handleToggle("spacedRepetitionSmartIntervals", "Smart SRS intervals")}
                activeColor={activeAccentColor}
              />
            </View>
          </View>
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
                <Text style={styles.sectionTitle}>Notifications & Routine</Text>
                <Text style={styles.sectionSubtitle}>Daily study reminders, streak defense and alerts</Text>
              </View>
            </View>

            {/* Study Reminders Toggle + Time Picker */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Daily Study Reminder</Text>
                <Text style={styles.settingRowSub}>Gentle daily push notification to start your focus session</Text>
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
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 16 }}>⏰</Text>
                  <Text style={styles.timePickerLabel}>Reminder Time</Text>
                </View>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>{settings.notificationTime || "20:00"}</Text>
                  <ChevronRightIcon size={14} color="#D97706" />
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.settingRowDivider} />

            {/* Flashcard Due Alerts */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Flashcards Due for Review</Text>
                <Text style={styles.settingRowSub}>Alerts when spaced repetition cards are due</Text>
              </View>
              <CustomToggle
                value={settings.revisionReminders}
                onValueChange={() => handleToggle("revisionReminders", "Flashcard alerts")}
                activeColor={activeAccentColor}
              />
            </View>

            <View style={styles.settingRowDivider} />

            {/* Streak Alerts */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Streak Defense Alert</Text>
                <Text style={styles.settingRowSub}>Evening alert at 9:00 PM if your study streak is at risk</Text>
              </View>
              <CustomToggle
                value={settings.streakAlerts}
                onValueChange={() => handleToggle("streakAlerts", "Streak defense")}
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
                <Text style={styles.sectionTitle}>Language & Region</Text>
                <Text style={styles.sectionSubtitle}>Localization, calendar week start and formats</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => setLangModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>App Interface Language</Text>
                <Text style={styles.settingRowSub}>{settings.language}</Text>
              </View>
              <View style={styles.rowRightPill}>
                <Text style={styles.rowRightPillText}>{settings.language}</Text>
                <ChevronRightIcon size={16} color="#10B981" />
              </View>
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            <Text style={styles.settingLabelText}>First Day of the Week</Text>
            <View style={styles.segmentGrid}>
              {["Monday", "Sunday"].map((day) => {
                const isSelected = settings.firstDayOfWeek === day;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.optionPill, isSelected && styles.optionPillSelectedGreen]}
                    onPress={() => handleSelectSetting("firstDayOfWeek", day, `Week starts on ${day}`)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                <Text style={styles.sectionTitle}>Account & Security</Text>
                <Text style={styles.sectionSubtitle}>Credentials, security logs and authentication</Text>
              </View>
            </View>

            {/* Change Password */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => setPasswordModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Change Account Password</Text>
                <Text style={styles.settingRowSub}>Update your login credentials securely</Text>
              </View>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* 2FA Toggle */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Two-Factor Authentication (2FA)</Text>
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
                <Text style={styles.sectionTitle}>Data & Storage Management</Text>
                <Text style={styles.sectionSubtitle}>Cloud backup, cache size and export archives</Text>
              </View>
            </View>

            {/* Storage Usage Bar */}
            <View style={styles.storageMeterBox}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={styles.storageMeterLabel}>Local Storage Used</Text>
                <Text style={styles.storageMeterVal}>25.7 MB / 500 MB</Text>
              </View>
              <View style={styles.storageTrack}>
                <View style={[styles.storageSegment, { flex: 0.35, backgroundColor: "#6236FF" }]} />
                <View style={[styles.storageSegment, { flex: 0.45, backgroundColor: "#0EA5E9" }]} />
                <View style={[styles.storageSegment, { flex: 0.20, backgroundColor: "#F59E0B" }]} />
              </View>
              <View style={styles.storageLegendRow}>
                <Text style={styles.storageLegendItem}>🟣 Decks (8.4MB)</Text>
                <Text style={styles.storageLegendItem}>🔵 Notes (11.6MB)</Text>
                <Text style={styles.storageLegendItem}>🟡 Cache (5.7MB)</Text>
              </View>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Offline Mode */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.settingRowTitle}>Offline Study Storage</Text>
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
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Cloud Sync Status</Text>
                <Text style={styles.settingRowSub}>
                  Last backup: {new Date(settings.lastSyncedAt || Date.now()).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.syncNowBtn, isSyncing && { opacity: 0.6 }]}
                onPress={handleSyncNow}
                disabled={isSyncing}
                activeOpacity={0.8}
              >
                <Text style={styles.syncNowBtnText}>{isSyncing ? "Syncing..." : "⚡ Sync Now"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRowDivider} />

            {/* Export Data */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={handleExportData}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Export Study Archive</Text>
                <Text style={styles.settingRowSub}>Download all flashcards, notes and XP history in JSON</Text>
              </View>
              <Text style={styles.exportBadge}>Export ↓</Text>
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* Clear Cache Action */}
            <TouchableOpacity
              style={styles.dangerRowBtn}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <Text style={styles.dangerRowBtnText}>🧹 Clear Local Cache (25.7 MB)</Text>
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
                <Text style={styles.sectionTitle}>Help & Support</Text>
                <Text style={styles.sectionSubtitle}>FAQs, bug reports, and app information</Text>
              </View>
            </View>

            {/* FAQ Item */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => setFaqModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Frequently Asked Questions (FAQ)</Text>
                <Text style={styles.settingRowSub}>SRS algorithm, offline mode, XP scoring</Text>
              </View>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* Send Feedback */}
            <TouchableOpacity
              style={styles.settingNavigationRow}
              onPress={() => setFeedbackModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Send Feedback or Bug Report</Text>
                <Text style={styles.settingRowSub}>Help us improve your study experience</Text>
              </View>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.settingRowDivider} />

            {/* Reset All Settings Button */}
            <TouchableOpacity
              style={styles.resetSettingsBtn}
              onPress={handleResetAllSettings}
              activeOpacity={0.7}
            >
              <Text style={styles.resetSettingsBtnText}>↺ Revert All Settings to Defaults</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer info */}
        <View style={styles.appFooterInfo}>
          <View style={styles.footerBrandBadge}>
            <Text style={styles.footerBrandText}>StudPal Pro</Text>
            <View style={styles.upToDatePill}>
              <Text style={styles.upToDateText}>✓ Up to date</Text>
            </View>
          </View>
          <Text style={styles.appFooterVer}>Version 2.5.0 • Build 2026.8</Text>
          <Text style={styles.appFooterCopyright}>Crafted with 💜 for ambitious students worldwide</Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Nav */}
      <BottomNavBar activeTab="profile" onSelectTab={onSelectTab} />

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
      {/* ── MODAL 4: AI COACH PERSONALITY MODAL                                    */}
      {/* ========================================================================= */}
      <Modal visible={isAiPersonaModalOpen} animationType="slide" transparent onRequestClose={() => setAiPersonaModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Select Companion Persona</Text>
              <TouchableOpacity onPress={() => setAiPersonaModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10 }}>
              {[
                {
                  id: "encouraging",
                  emoji: "✨",
                  title: "Encouraging & Motivating",
                  desc: "Warm, positive reinforcement, celebrating micro-wins and building study confidence.",
                },
                {
                  id: "rigorous",
                  emoji: "🎯",
                  title: "Rigorous & Exam-Focused",
                  desc: "Direct, thorough explanations holding you to top standards for competitive exams.",
                },
                {
                  id: "socratic",
                  emoji: "🧠",
                  title: "Socratic Tutor",
                  desc: "Guides you with questions to help you discover solutions yourself rather than giving answers directly.",
                },
                {
                  id: "concise",
                  emoji: "⚡",
                  title: "Concise & Direct",
                  desc: "Brief bulleted summaries, formulas, and high-yield takeaways without extra fluff.",
                },
              ].map((persona) => {
                const isSelected = settings.aiPersonality === persona.id;
                return (
                  <TouchableOpacity
                    key={persona.id}
                    style={[styles.personaOptionCard, isSelected && styles.personaOptionCardSelected]}
                    onPress={() => {
                      handleSelectSetting("aiPersonality", persona.id, `AI Persona set to ${persona.title}`);
                      setAiPersonaModalOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 24 }}>{persona.emoji}</Text>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.personaTitle, isSelected && styles.personaTitleSelected]}>
                        {persona.title}
                      </Text>
                      <Text style={styles.personaDesc}>{persona.desc}</Text>
                    </View>
                    {isSelected && <CheckIcon size={18} color="#6236FF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
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
              <Text style={styles.modalSheetTitle}>Select App Language</Text>
              <TouchableOpacity onPress={() => setLangModalOpen(false)} style={styles.modalCloseBtn}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 8, marginTop: 4 }}>
              {[
                { name: "English (US)", flag: "🇺🇸" },
                { name: "Spanish (Español)", flag: "🇪🇸" },
                { name: "French (Français)", flag: "🇫🇷" },
                { name: "German (Deutsch)", flag: "🇩🇪" },
                { name: "Portuguese (Português)", flag: "🇧🇷" },
                { name: "Japanese (日本語)", flag: "🇯🇵" },
              ].map((lang) => {
                const isSelected = settings.language === lang.name;
                return (
                  <TouchableOpacity
                    key={lang.name}
                    style={[styles.langOptionRow, isSelected && styles.langOptionSelected]}
                    onPress={() => {
                      handleSelectSetting("language", lang.name, "Language updated");
                      setLangModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 18 }}>{lang.flag}</Text>
                    <Text style={[styles.langOptionText, isSelected && styles.langOptionTextSelected]}>
                      {lang.name}
                    </Text>
                    {isSelected && <CheckIcon size={16} color="#6236FF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 14,
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
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
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
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  sectionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },

  settingLabelText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },

  // Theme Segmented Control
  themeSegmentContainer: {
    flexDirection: "row",
    gap: 8,
  },
  themePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 10,
    minHeight: 44,
  },
  themePillSelected: {
    backgroundColor: "#6236FF",
    borderColor: "#6236FF",
  },
  themePillSelectedPurple: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  themePillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  themePillTextSelected: {
    color: "#FFFFFF",
  },

  // Brand Accent Dots
  accentColorsRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
  accentColorDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  accentColorDotSelected: {
    borderWidth: 3,
    borderColor: "#0F172A",
    transform: [{ scale: 1.1 }],
  },

  // Option Grid
  segmentGrid: {
    flexDirection: "row",
    gap: 6,
  },
  optionPill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 10,
    minHeight: 42,
  },
  optionPillSelectedBlue: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  optionPillSelectedGreen: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  optionPillText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#475569",
  },
  optionPillTextSelected: {
    color: "#FFFFFF",
  },

  // Row
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  settingRowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  settingRowSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  settingRowDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },

  settingNavigationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    minHeight: 44,
  },
  rowRightPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rowRightPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },

  // Time Picker Row
  timePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  timePickerLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#92400E",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  timeBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#B45309",
  },

  // Storage Meter Box
  storageMeterBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  storageMeterLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  storageMeterVal: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  storageTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
    flexDirection: "row",
    overflow: "hidden",
    marginVertical: 8,
  },
  storageSegment: {
    height: "100%",
  },
  storageLegendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  storageLegendItem: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },

  // Sync / Action Buttons
  syncNowBtn: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  syncNowBtnText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#0284C7",
  },
  exportBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0EA5E9",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  dangerRowBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerRowBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#EF4444",
  },
  resetSettingsBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resetSettingsBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748B",
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
    padding: 22,
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
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
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
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    gap: 12,
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
  langOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  langOptionTextSelected: {
    fontWeight: "800",
    color: "#6236FF",
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
