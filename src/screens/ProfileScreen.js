import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
  Switch,
  Image,
} from "react-native";
import Modal from "../components/CustomModal";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import BottomNavBar from "../components/BottomNavBar";
import { gamificationService } from "../services/gamification/gamificationService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Header & Utility Icons ───────────────────────────────────────────────────
const BellIcon = ({ color = "#1E293B", size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const GearIcon = ({ color = "#1E293B", size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const CameraIcon = ({ size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const SparkleIcon = ({ size = 11, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Path d="M12 1C12 8 16 12 23 12 16 12 12 16 12 23 12 16 8 12 1 12 8 12 12 8 12 1Z" />
  </Svg>
);

const CalendarIcon = ({ size = 13, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const CloseIcon = ({ color = "#64748B", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18" />
    <Path d="M6 6l12 12" />
  </Svg>
);

const QuoteMarksIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.211 1.375.328 2.395 1.492 2.395 2.898 0 1.657-1.343 3-3 3-.842 0-1.849-.494-2.417-1.188zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.211 1.375.328 2.395 1.492 2.395 2.898 0 1.657-1.343 3-3 3-.842 0-1.849-.494-2.417-1.188z" />
  </Svg>
);

const BookIcon = ({ color = "#6236FF", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Svg>
);

const ClockIcon = ({ color = "#10B981", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const TrendIcon = ({ color = "#3B82F6", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

const GoalIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const ChartIcon = ({ size = 20, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 20V10" />
    <Path d="M12 20V4" />
    <Path d="M6 20v-6" />
  </Svg>
);

const BookmarkIcon = ({ size = 20, color = "#F97316" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const DownloadIcon = ({ size = 20, color = "#3B82F6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Path d="M7 10l5 5 5-5" />
    <Path d="M12 15V3" />
  </Svg>
);

const UserSettingsIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const ShieldIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const HelpIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Path d="M12 17h.01" />
  </Svg>
);

const DAILY_QUOTES = [
  "Stay consistent, trust the process, and great things will happen. 💜",
  "Small steps every day lead to massive achievements over time. ✨",
  "Focus on progress, not perfection. Every study session counts! 🚀",
  "Your future self will thank you for the hard work you put in today. 📚",
  "Success is built sequentially, one focused hour at a time. 🌟",
  "Believe in your ability to master any subject with dedication. 💪",
  "The secret to getting ahead is simply getting started. 🎯",
  "Strive for understanding, not just memorization. Knowledge is power! 💡",
];

const getDailyQuoteIndex = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % DAILY_QUOTES.length;
};

const PERIOD_DATA = {
  "This Week": { subjects: "12", studyTime: "14h 32m", avgScore: "82%" },
  "This Month": { subjects: "14", studyTime: "48h 15m", avgScore: "85%" },
  "Semester": { subjects: "18", studyTime: "142h 50m", avgScore: "88%" },
  "All Time": { subjects: "24", studyTime: "310h 20m", avgScore: "86%" },
};

const QUICK_ACCESS = [
  { id: "goals", icon: GoalIcon, label: "My Goals", sub: "Track and achieve your study goals", color: "#6236FF", bg: "#F0EEFF" },
  { id: "stats", icon: ChartIcon, label: "Study Statistics", sub: "Detailed insights into your progress", color: "#10B981", bg: "#E8FDF0" },
  { id: "saved", icon: BookmarkIcon, label: "Saved Topics", sub: "View your bookmarked topics", color: "#F97316", bg: "#FFF3E8" },
  { id: "offline", icon: DownloadIcon, label: "Offline Resources", sub: "Manage your downloaded content", color: "#3B82F6", bg: "#EBF5FF" },
];

const ACCOUNT_ITEMS = [
  { id: "settings", icon: UserSettingsIcon, label: "Account Settings", sub: "Manage your personal information", color: "#6236FF", bg: "#F0EEFF" },
  { id: "privacy", icon: ShieldIcon, label: "Privacy & Security", sub: "Manage your privacy and security", color: "#6236FF", bg: "#F0EEFF" },
  { id: "help", icon: HelpIcon, label: "Help & Support", sub: "Get help and contact support", color: "#6236FF", bg: "#F0EEFF" },
];

export default function ProfileScreen({
  user = { name: "Alex", email: "alex@studpal.app", avatarUri: null },
  onUpdateUser,
  onSelectTab,
  onNavigate,
}) {
  const insets = useSafeAreaInsets();

  const [profileName, setProfileName] = useState(user.name || "Alex");
  const [profileEmail, setProfileEmail] = useState(user.email || "alex@studpal.app");
  const [avatarEmoji, setAvatarEmoji] = useState("👨‍🎓");
  const [avatarBgColor, setAvatarBgColor] = useState("#6236FF");

  const [gamification, setGamification] = useState(gamificationService.getState());

  useEffect(() => {
    const unsubscribe = gamificationService.subscribe((gState) => {
      setGamification(gState);
    });
    return () => unsubscribe();
  }, []);

  const currentLevel = gamification.currentLevel || { level: 1, title: "Beginner" };

  const handlePickAvatarFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library permission to upload a profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (onUpdateUser) {
          onUpdateUser({ avatarUri: uri });
        }
        setAvatarModalOpen(false);
      }
    } catch (e) {
      Alert.alert('Upload Error', 'Could not pick image: ' + e.message);
    }
  };

  const handleTakePhotoFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permission to take a profile photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (onUpdateUser) {
          onUpdateUser({ avatarUri: uri });
        }
        setAvatarModalOpen(false);
      }
    } catch (e) {
      Alert.alert('Camera Error', 'Could not open camera: ' + e.message);
    }
  };

  const handleRemoveProfilePhoto = () => {
    if (onUpdateUser) {
      onUpdateUser({ avatarUri: null });
    }
    setAvatarModalOpen(false);
  };

  const [quoteIndex, setQuoteIndex] = useState(getDailyQuoteIndex());

  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [isPeriodModalOpen, setPeriodModalOpen] = useState(false);

  const [isNotifModalOpen, setNotifModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isGoalsModalOpen, setGoalsModalOpen] = useState(false);
  const [isStatsModalOpen, setStatsModalOpen] = useState(false);
  const [isSavedModalOpen, setSavedModalOpen] = useState(false);
  const [isOfflineModalOpen, setOfflineModalOpen] = useState(false);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  const [goalsList, setGoalsList] = useState([
    { id: "1", text: "Complete Calculus Ch. 4 Derivatives", done: true },
    { id: "2", text: "Study Physics 2 hrs every day this week", done: false },
    { id: "3", text: "Take 3 AI Practice Quizzes", done: true },
    { id: "4", text: "Maintain 85%+ Average Score", done: false },
  ]);
  const [newGoalText, setNewGoalText] = useState("");

  const [savedTopics, setSavedTopics] = useState([
    { id: "1", subject: "Calculus", title: "Implicit Differentiation & Chain Rule", date: "Yesterday" },
    { id: "2", subject: "Physics", title: "Electromagnetic Induction & Faraday's Law", date: "3 days ago" },
    { id: "3", subject: "Organic Chemistry", title: "Nucleophilic Substitution Reactions", date: "1 week ago" },
  ]);

  const [offlineFiles, setOfflineFiles] = useState([
    { id: "1", title: "Calculus_Formula_Sheet.pdf", size: "4.2 MB", type: "PDF" },
    { id: "2", title: "Physics_Exam_Summary.pdf", size: "8.5 MB", type: "PDF" },
    { id: "3", title: "Chemistry_Reaction_Guide.pdf", size: "12.1 MB", type: "PDF" },
  ]);

  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);

  const [notifList, setNotifList] = useState([
    { id: "1", title: "🎉 Daily Study Goal Reached!", body: "You completed 2 hours of focus study today.", time: "10m ago", read: false },
    { id: "2", title: "⚡ Streak Mastered", body: "8 days in a row! Keep up the momentum.", time: "2h ago", read: false },
    { id: "3", title: "🤖 AI Quiz Available", body: "StudPal AI generated 10 new practice questions.", time: "1d ago", read: true },
  ]);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  const handleToggleGoal = (id) => {
    setGoalsList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    setGoalsList((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newGoalText.trim(), done: false },
    ]);
    setNewGoalText("");
  };

  const handleRemoveSavedTopic = (id) => {
    setSavedTopics((prev) => prev.filter((t) => t.id !== id));
    Alert.alert("Removed", "Topic removed from saved bookmarks.");
  };

  const handleDeleteOfflineFile = (id) => {
    setOfflineFiles((prev) => prev.filter((f) => f.id !== id));
    Alert.alert("Deleted", "Offline resource deleted to save space.");
  };

  const handleLogOut = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of StudPal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => Alert.alert("Logged Out", "See you next time! 👋") },
    ]);
  };

  const handleItemPress = (id) => {
    if (id === "goals") setGoalsModalOpen(true);
    else if (id === "stats") setStatsModalOpen(true);
    else if (id === "saved") setSavedModalOpen(true);
    else if (id === "offline") setOfflineModalOpen(true);
    else if (id === "settings") {
      if (onNavigate) onNavigate("settings");
      else setEditProfileModalOpen(true);
    }
    else if (id === "privacy") setPrivacyModalOpen(true);
    else if (id === "help") setHelpModalOpen(true);
  };

  const activeMetrics = PERIOD_DATA[selectedPeriod] || PERIOD_DATA["This Week"];

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top Header ────────────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage your account and track your progress</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setNotifModalOpen(true)}
            activeOpacity={0.7}
          >
            <BellIcon size={20} color="#1E293B" />
            {notifList.some((n) => !n.read) && <View style={styles.notifDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => onNavigate ? onNavigate("settings") : setEditProfileModalOpen(true)}
            activeOpacity={0.7}
          >
            <GearIcon size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}
      >
        {/* ── Profile Hero Card ────────────────────────────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardTop}>
            {/* Avatar with Camera badge */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                style={[styles.avatarCircle, { backgroundColor: avatarBgColor }]}
                onPress={() => setAvatarModalOpen(true)}
                activeOpacity={0.85}
              >
                {user?.avatarUri ? (
                  <Image source={{ uri: user.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={handlePickAvatarFromLibrary}
                activeOpacity={0.85}
              >
                <CameraIcon size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Profile Meta info */}
            <View style={styles.profileMetaInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {profileName}
              </Text>
              <View style={styles.memberTag}>
                <SparkleIcon size={10} color="#6236FF" />
                <Text style={styles.memberTagText}>
                  Level {currentLevel.level} • {currentLevel.title} ({gamification.totalXp.toLocaleString()} XP)
                </Text>
              </View>
              <Text style={styles.emailText} numberOfLines={1}>
                {profileEmail}
              </Text>
              <View style={styles.joinedRow}>
                <CalendarIcon size={12} color="#94A3B8" />
                <Text style={styles.joinedText}>Joined May 2024</Text>
              </View>
            </View>

            {/* Right arrow */}
            <TouchableOpacity
              style={styles.editArrowBtn}
              onPress={() => setEditProfileModalOpen(true)}
              activeOpacity={0.7}
            >
              <ChevronRightIcon size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Motivational Quote Box */}
          <TouchableOpacity
            style={styles.quoteCard}
            onPress={handleNextQuote}
            activeOpacity={0.88}
          >
            <View style={styles.quoteIconBadge}>
              <QuoteMarksIcon size={16} color="#6236FF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quoteText}>
                {DAILY_QUOTES[quoteIndex]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Study Overview Section ───────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Study Overview</Text>
            <TouchableOpacity
              style={styles.filterDropdown}
              onPress={() => setPeriodModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.filterDropdownText}>{selectedPeriod}</Text>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#6236FF" strokeWidth="2.5" strokeLinecap="round">
                <Path d="M6 9l6 6 6-6" />
              </Svg>
            </TouchableOpacity>
          </View>

          <View style={styles.overviewGrid}>
            {/* Stat Item 1: Subjects */}
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: "#F0EEFF" }]}>
                <BookIcon color="#6236FF" size={20} />
              </View>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {activeMetrics.subjects}
              </Text>
              <Text style={styles.statTitle} numberOfLines={1}>
                Subjects
              </Text>
              <Text style={styles.statSubtitle} numberOfLines={1}>
                Learning
              </Text>
            </View>

            {/* Stat Item 2: Study Time */}
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: "#E8FDF0" }]}>
                <ClockIcon color="#10B981" size={20} />
              </View>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {activeMetrics.studyTime}
              </Text>
              <Text style={styles.statTitle} numberOfLines={1}>
                Study Time
              </Text>
              <Text style={styles.statSubtitle} numberOfLines={1}>
                Total
              </Text>
            </View>

            {/* Stat Item 3: Avg. Score */}
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: "#EBF5FF" }]}>
                <TrendIcon color="#3B82F6" size={20} />
              </View>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {activeMetrics.avgScore}
              </Text>
              <Text style={styles.statTitle} numberOfLines={1}>
                Avg. Score
              </Text>
              <Text style={styles.statSubtitle} numberOfLines={1}>
                {selectedPeriod}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Quick Access Section ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.cardGroup}>
            {QUICK_ACCESS.map((item, idx) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={styles.listRow}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.listIconBox, { backgroundColor: item.bg }]}>
                    <item.icon size={19} color={item.color} />
                  </View>
                  <View style={styles.listTextGroup}>
                    <Text style={styles.listRowTitle}>{item.label}</Text>
                    <Text style={styles.listRowSubtitle}>{item.sub}</Text>
                  </View>
                  <ChevronRightIcon size={16} color="#94A3B8" />
                </TouchableOpacity>
                {idx < QUICK_ACCESS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Account Section ──────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.cardGroup}>
            {ACCOUNT_ITEMS.map((item, idx) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={styles.listRow}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.listIconBox, { backgroundColor: item.bg }]}>
                    <item.icon size={19} color={item.color} />
                  </View>
                  <View style={styles.listTextGroup}>
                    <Text style={styles.listRowTitle}>{item.label}</Text>
                    <Text style={styles.listRowSubtitle}>{item.sub}</Text>
                  </View>
                  <ChevronRightIcon size={16} color="#94A3B8" />
                </TouchableOpacity>
                {idx < ACCOUNT_ITEMS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutCardBtn} onPress={handleLogOut} activeOpacity={0.85}>
          <Text style={styles.logoutCardBtnText}>Log Out of StudPal</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar activeTab="profile" onSelectTab={onSelectTab} />

      {/* ── 1. NOTIFICATIONS MODAL SHEET ──────────────────────────────── */}
      <Modal visible={isNotifModalOpen} animationType="slide" transparent onRequestClose={() => setNotifModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotifModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {notifList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.notifCardItem, !item.read && styles.notifUnread]}
                  onPress={() => {
                    setNotifList((prev) =>
                      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                    );
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifItemTitle}>{item.title}</Text>
                    <Text style={styles.notifItemBody}>{item.body}</Text>
                    <Text style={styles.notifItemTime}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalActionBtn}
              onPress={() => {
                setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
                Alert.alert("Marked All as Read", "All notifications updated.");
              }}
            >
              <Text style={styles.modalActionBtnText}>Mark All as Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── 2. EDIT PROFILE MODAL ─────────────────────────────────────── */}
      <Modal visible={isEditProfileModalOpen} animationType="slide" transparent onRequestClose={() => setEditProfileModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditProfileModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalTextInput}
                value={profileName}
                onChangeText={(text) => {
                  setProfileName(text);
                  if (onUpdateUser) onUpdateUser({ name: text });
                }}
                placeholder="Enter your name"
              />
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.modalTextInput}
                value={profileEmail}
                onChangeText={(text) => {
                  setProfileEmail(text);
                  if (onUpdateUser) onUpdateUser({ email: text });
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            <TouchableOpacity
              style={styles.modalActionBtn}
              onPress={() => {
                setEditProfileModalOpen(false);
                gamificationService.recordProfileCompletion();
                Alert.alert("Profile Updated ✨", "Your profile details have been saved (+20 XP).");
              }}
            >
              <Text style={styles.modalActionBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── 3. AVATAR SELECTOR MODAL ──────────────────────────────────── */}
      <Modal visible={isAvatarModalOpen} animationType="fade" transparent onRequestClose={() => setAvatarModalOpen(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.avatarModalCard}>
            <Text style={styles.modalSheetTitle}>Profile Picture</Text>
            
            {/* Device Upload Options */}
            <View style={{ gap: 10, width: '100%', marginVertical: 12 }}>
              <TouchableOpacity
                style={styles.uploadOptionBtnPrimary}
                onPress={handlePickAvatarFromLibrary}
                activeOpacity={0.85}
              >
                <Text style={styles.uploadOptionBtnPrimaryText}>📁 Upload Photo from Device</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOptionBtnSecondary}
                onPress={handleTakePhotoFromCamera}
                activeOpacity={0.85}
              >
                <Text style={styles.uploadOptionBtnSecondaryText}>📸 Take Photo with Camera</Text>
              </TouchableOpacity>

              {user?.avatarUri && (
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={handleRemoveProfilePhoto}
                  activeOpacity={0.85}
                >
                  <Text style={styles.removePhotoBtnText}>🗑️ Remove Custom Photo</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 6 }]}>Or Choose Preset Avatar</Text>
            <View style={styles.avatarGrid}>
              {["👨‍🎓", "👩‍🎓", "🎓", "📚", "⚡", "🎯", "📊", "🏆"].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.avatarChoiceBtn, avatarEmoji === emoji && !user?.avatarUri && styles.avatarChoiceSelected]}
                  onPress={() => {
                    setAvatarEmoji(emoji);
                    if (onUpdateUser) onUpdateUser({ avatarUri: null });
                    setAvatarModalOpen(false);
                  }}
                >
                  <Text style={{ fontSize: 28 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={[styles.modalActionBtn, { marginTop: 16 }]} onPress={() => setAvatarModalOpen(false)}>
              <Text style={styles.modalActionBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── 4. PERIOD FILTER MODAL ────────────────────────────────────── */}
      <Modal visible={isPeriodModalOpen} animationType="fade" transparent onRequestClose={() => setPeriodModalOpen(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.filterModalCard}>
            <Text style={styles.modalSheetTitle}>Select Overview Period</Text>
            {Object.keys(PERIOD_DATA).map((period) => (
              <TouchableOpacity
                key={period}
                style={[styles.periodOptionRow, selectedPeriod === period && styles.periodOptionSelected]}
                onPress={() => {
                  setSelectedPeriod(period);
                  setPeriodModalOpen(false);
                }}
              >
                <Text style={[styles.periodOptionText, selectedPeriod === period && styles.periodOptionTextSelected]}>
                  {period}
                </Text>
                {selectedPeriod === period && <Text style={{ color: "#6236FF", fontWeight: "800" }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ── 5. MY GOALS MODAL ─────────────────────────────────────────── */}
      <Modal visible={isGoalsModalOpen} animationType="slide" transparent onRequestClose={() => setGoalsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>My Study Goals 🎯</Text>
              <TouchableOpacity onPress={() => setGoalsModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              {goalsList.map((item) => (
                <TouchableOpacity key={item.id} style={styles.goalRowItem} onPress={() => handleToggleGoal(item.id)}>
                  <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                    {item.done && <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "900" }}>✓</Text>}
                  </View>
                  <Text style={[styles.goalTextItem, item.done && styles.goalTextDone]}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.addGoalRow}>
              <TextInput
                style={[styles.modalTextInput, { flex: 1, marginBottom: 0 }]}
                placeholder="Add a new study goal..."
                value={newGoalText}
                onChangeText={setNewGoalText}
              />
              <TouchableOpacity style={styles.addGoalBtn} onPress={handleAddGoal}>
                <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 16 }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 6. STUDY STATISTICS MODAL ─────────────────────────────────── */}
      <Modal visible={isStatsModalOpen} animationType="slide" transparent onRequestClose={() => setStatsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Study Statistics 📊</Text>
              <TouchableOpacity onPress={() => setStatsModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsCardDetail}>
              <View style={styles.statsRowDetail}>
                <Text style={styles.statsDetailLabel}>Total Focus Hours</Text>
                <Text style={styles.statsDetailValue}>48h 32m</Text>
              </View>
              <View style={styles.statsRowDetail}>
                <Text style={styles.statsDetailLabel}>Quizzes Completed</Text>
                <Text style={styles.statsDetailValue}>24 Quizzes</Text>
              </View>
              <View style={styles.statsRowDetail}>
                <Text style={styles.statsDetailLabel}>Best Study Day</Text>
                <Text style={styles.statsDetailValue}>Thursday (75 mins)</Text>
              </View>
              <View style={styles.statsRowDetail}>
                <Text style={styles.statsDetailLabel}>Retention Score</Text>
                <Text style={[styles.statsDetailValue, { color: "#10B981" }]}>88% Mastered</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.modalActionBtn} onPress={() => setStatsModalOpen(false)}>
              <Text style={styles.modalActionBtnText}>Close Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── 7. SAVED TOPICS MODAL ─────────────────────────────────────── */}
      <Modal visible={isSavedModalOpen} animationType="slide" transparent onRequestClose={() => setSavedModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Saved Topics 🔖</Text>
              <TouchableOpacity onPress={() => setSavedModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
              {savedTopics.map((item) => (
                <View key={item.id} style={styles.savedTopicCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.savedSubjectBadge}>{item.subject}</Text>
                    <Text style={styles.savedTopicTitle}>{item.title}</Text>
                    <Text style={styles.savedTopicDate}>Bookmarked {item.date}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveSavedTopic(item.id)}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── 8. OFFLINE RESOURCES MODAL ────────────────────────────────── */}
      <Modal visible={isOfflineModalOpen} animationType="slide" transparent onRequestClose={() => setOfflineModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Offline Downloads 📥</Text>
              <TouchableOpacity onPress={() => setOfflineModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              {offlineFiles.map((file) => (
                <View key={file.id} style={styles.offlineFileCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.offlineFileName}>{file.title}</Text>
                    <Text style={styles.offlineFileSize}>{file.size} · {file.type}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteOfflineFile(file.id)}>
                    <Text style={{ fontSize: 14, color: "#EF4444", fontWeight: "700" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── 9. PRIVACY & SECURITY MODAL ───────────────────────────────── */}
      <Modal visible={isPrivacyModalOpen} animationType="slide" transparent onRequestClose={() => setPrivacyModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Privacy & Security 🛡️</Text>
              <TouchableOpacity onPress={() => setPrivacyModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Public Leaderboard Profile</Text>
              <Switch value={publicLeaderboard} onValueChange={setPublicLeaderboard} trackColor={{ true: "#6236FF" }} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Share Study Analytics</Text>
              <Switch value={shareAnalytics} onValueChange={setShareAnalytics} trackColor={{ true: "#6236FF" }} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>App Lock (Biometric / PIN)</Text>
              <Switch value={biometricLock} onValueChange={setBiometricLock} trackColor={{ true: "#6236FF" }} />
            </View>
            <TouchableOpacity style={styles.modalActionBtn} onPress={() => setPrivacyModalOpen(false)}>
              <Text style={styles.modalActionBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── 10. HELP & SUPPORT MODAL ───────────────────────────────────── */}
      <Modal visible={isHelpModalOpen} animationType="slide" transparent onRequestClose={() => setHelpModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Help & Support 💬</Text>
              <TouchableOpacity onPress={() => setHelpModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10, marginVertical: 10 }}>
              <TouchableOpacity
                style={styles.faqCard}
                onPress={() => Alert.alert("StudPal Support", "Email sent to support@studpal.app! We reply within 24 hours.")}
              >
                <Text style={styles.faqTitle}>📧 Contact Support Team</Text>
                <Text style={styles.faqSub}>Direct email support available 24/7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.faqCard}
                onPress={() => Alert.alert("AI Guide", "Branco helps you generate practice quizzes, explain hard topics, and summarize notes.")}
              >
                <Text style={styles.faqTitle}>❓ How does Branco work?</Text>
                <Text style={styles.faqSub}>Learn how to maximize your AI study assistant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#6236FF",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 20,
  },

  profileCard: {
    backgroundColor: "#F3F0FF",
    borderRadius: 24,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#EBE5FF",
  },
  profileCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 34,
  },
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2D62FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 5,
  },
  uploadOptionBtnPrimary: {
    backgroundColor: "#2D62FF",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadOptionBtnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  uploadOptionBtnSecondary: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  uploadOptionBtnSecondaryText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 14,
  },
  removePhotoBtn: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  removePhotoBtnText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 14,
  },
  profileMetaInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  memberTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E8E2FF",
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    marginVertical: 3,
  },
  memberTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6236FF",
  },
  emailText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  joinedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  joinedText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  editArrowBtn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  quoteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quoteIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  quoteText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    lineHeight: 19,
  },

  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterDropdownText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6236FF",
  },

  overviewGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 128,
  },
  statIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
    marginBottom: 2,
    textAlign: "center",
  },
  statTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 1,
    textAlign: "center",
  },
  statSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    color: "#94A3B8",
    textAlign: "center",
  },

  cardGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  listIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  listTextGroup: {
    flex: 1,
  },
  listRowTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  listRowSubtitle: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginLeft: 70,
  },

  logoutCardBtn: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutCardBtnText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#EF4444",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  formGroup: {
    gap: 12,
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  modalTextInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 8,
  },
  modalActionBtn: {
    backgroundColor: "#6236FF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  modalActionBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  notifCardItem: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  notifUnread: {
    backgroundColor: "#F0EEFF",
    borderColor: "#E2D9FF",
  },
  notifItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  notifItemBody: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
  },
  notifItemTime: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
  },

  avatarModalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginVertical: 14,
  },
  avatarChoiceBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  avatarChoiceSelected: {
    borderColor: "#6236FF",
    borderWidth: 2,
    backgroundColor: "#F0EEFF",
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#0F172A",
  },

  filterModalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  periodOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  periodOptionSelected: {
    backgroundColor: "#F0EEFF",
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  periodOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  periodOptionTextSelected: {
    color: "#6236FF",
    fontWeight: "800",
  },

  goalRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  goalTextItem: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
  },
  goalTextDone: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  addGoalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  addGoalBtn: {
    backgroundColor: "#6236FF",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  statsCardDetail: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginVertical: 10,
  },
  statsRowDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsDetailLabel: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  statsDetailValue: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "800",
  },

  savedTopicCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  savedSubjectBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6236FF",
    textTransform: "uppercase",
  },
  savedTopicTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  savedTopicDate: {
    fontSize: 10.5,
    color: "#94A3B8",
    marginTop: 2,
  },

  offlineFileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  offlineFileName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  offlineFileSize: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  faqCard: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  faqSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
