import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../theme/themeContext";
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
import TooltipTouchable from "../components/TooltipTouchable";
import { gamificationService } from "../services/gamification/gamificationService";
import { goalMetricsService } from "../services/goalMetricsService";
import { useTranslation } from "../services/i18n/i18nService";

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

const TargetIcon = ({ size = 20, color = "#2D62FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
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

const ChartIcon = ({ size = 20, color = "#10B981", bgColor = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="13" width="3" height="9" rx="0.5" fill={color} />
    <Rect x="7" y="10" width="3" height="12" rx="0.5" fill={color} />
    <Rect x="12" y="13" width="3" height="9" rx="0.5" fill={color} />
    <Rect x="17" y="6.5" width="3" height="15.5" rx="0.5" fill={color} />
    <Path
      d="M3.5 10 L8.5 6 L13.5 10 L18.5 3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="3.5" cy="10" r="1.6" fill={bgColor} stroke={color} strokeWidth="1.5" />
    <Circle cx="8.5" cy="6" r="1.6" fill={bgColor} stroke={color} strokeWidth="1.5" />
    <Circle cx="13.5" cy="10" r="1.6" fill={bgColor} stroke={color} strokeWidth="1.5" />
    <Circle cx="18.5" cy="3" r="1.6" fill={bgColor} stroke={color} strokeWidth="1.5" />
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

const SearchIcon = ({ size = 16, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const BotIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="10" rx="2" />
    <Circle cx="12" cy="5" r="2" />
    <Path d="M12 7v4" />
    <Path d="M8 16h.01M16 16h.01" />
  </Svg>
);

const MailIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6l-10 7L2 6" />
  </Svg>
);

const FeedbackIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

const ChevronDownIcon = ({ size = 16, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

const CheckCircleIcon = ({ size = 18, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const LockIcon = ({ size = 14, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const ShieldCheckIcon = ({ size = 18, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const GlobeIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const AnalyticsIcon = ({ size = 18, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 20V10M12 20V4M6 20v-6" />
  </Svg>
);

const FingerprintIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4M5 19.5C5.5 18 6 15 6 12c0-.7.1-1.4.3-2M12 10a2 2 0 0 0-2 2c0 3.5 1.5 6.5 2.5 8M17 11.5a14.5 14.5 0 0 1-.5 5.5M12 6a6 6 0 0 1 6 6c0 1.6-.3 3.2-.8 4.6" />
  </Svg>
);

const LogOutIcon = ({ size = 18, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Path d="M16 17l5-5-5-5" />
    <Path d="M21 12H9" />
  </Svg>
);

const switchStyles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: '#6236FF',
  },
  trackInactive: {
    backgroundColor: '#CBD5E1',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
  thumbInactive: {
    alignSelf: 'flex-start',
  },
});

const ToggleSwitch = ({ value, onToggle }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onToggle}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    style={[
      switchStyles.track,
      value ? switchStyles.trackActive : switchStyles.trackInactive,
    ]}
  >
    <View
      style={[
        switchStyles.thumb,
        value ? switchStyles.thumbActive : switchStyles.thumbInactive,
      ]}
    />
  </TouchableOpacity>
);

const HELP_FAQS = [
  {
    id: "1",
    q: "How does StudPal AI assist my learning?",
    a: "StudPal AI acts as your 24/7 personal tutor. It creates step-by-step solutions for challenging problems, generates customized practice quizzes from your lecture notes, and summarizes lengthy study materials into key takeaways.",
    category: "AI & Tutoring",
  },
  {
    id: "2",
    q: "How do I earn XP and level up?",
    a: "You gain XP by completing study goals, reviewing flashcards, and mastering practice quizzes. As your XP grows, your rank title and profile tier advance.",
    category: "Gamification",
  },
  {
    id: "3",
    q: "How does Spaced Repetition work?",
    a: "StudPal calculates the optimal review interval for each topic based on how well you remember it. We automatically schedule quick review reminders right before you're predicted to forget the material.",
    category: "Study Methods",
  },
  {
    id: "4",
    q: "Can I access my study materials offline?",
    a: "Yes! Downloaded PDFs, formula sheets, and cached flashcards remain accessible anytime in your Offline Resources, even without an active internet connection.",
    category: "Offline Mode",
  },
  {
    id: "5",
    q: "How do I change my registered email or password?",
    a: "Navigate to Account Settings from the Profile or Settings screen to update your display name, email address, password, or profile photo.",
    category: "Account",
  },
  {
    id: "6",
    q: "Is my personal study data kept private?",
    a: "Absolutely. All study notes, performance metrics, and uploaded materials are securely encrypted. We never share your academic data with third parties.",
    category: "Privacy & Security",
  },
];

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
  { id: "stats", icon: ChartIcon, label: "Study Statistics", sub: "Detailed insights into your progress", color: "#10B981", bg: "#E8FDF0" },
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
  const { t } = useTranslation();
  const { isDark, accentColor } = useTheme();
  const styles = useMemo(() => getProfileStyles(isDark, accentColor, insets), [isDark, accentColor, insets]);

  const [profileName, setProfileName] = useState(user.name || "Alex");
  const [profileEmail, setProfileEmail] = useState(user.email || "alex@studpal.app");
  const [avatarEmoji, setAvatarEmoji] = useState(user.avatarEmoji || "👨‍🎓");
  const [avatarBgColor, setAvatarBgColor] = useState("#6236FF");

  const [gamification, setGamification] = useState(gamificationService.getState());
  const [goalMetrics, setGoalMetrics] = useState(goalMetricsService.getAllState());

  useEffect(() => {
    const unsubscribeG = gamificationService.subscribe((gState) => {
      setGamification(gState);
    });
    const unsubscribeGoal = goalMetricsService.subscribe((gMetrics) => {
      setGoalMetrics(gMetrics);
    });
    return () => {
      unsubscribeG();
      unsubscribeGoal();
    };
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

  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isGoalsModalOpen, setGoalsModalOpen] = useState(false);
  const [isStatsModalOpen, setStatsModalOpen] = useState(false);
  const [isSavedModalOpen, setSavedModalOpen] = useState(false);
  const [isOfflineModalOpen, setOfflineModalOpen] = useState(false);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [helpTab, setHelpTab] = useState("faqs");
  const [helpSearch, setHelpSearch] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [helpCategory, setHelpCategory] = useState("General Inquiry");
  const [helpMessage, setHelpMessage] = useState("");
  const [isHelpSent, setIsHelpSent] = useState(false);
  const [infoModal, setInfoModal] = useState({
    visible: false,
    emoji: "🚀",
    tag: "SUPPORT TICKET CREATED",
    title: "",
    message: "",
    emailHighlight: "",
    turnaround: "",
    buttonText: "Got it 👍",
  });

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
    setLogoutModalOpen(true);
  };

  const handleConfirmLogOut = () => {
    setLogoutModalOpen(false);
    if (onNavigate) {
      onNavigate("auth");
    } else if (onSelectTab) {
      onSelectTab("dashboard");
    }
  };

  const handleSendHelpMessage = () => {
    const trimmed = helpMessage.trim();
    if (!trimmed) {
      setInfoModal({
        visible: true,
        emoji: "✍️",
        tag: "MESSAGE REQUIRED",
        title: `A quick note, ${profileName}`,
        message: "Please enter your question or feedback before submitting so our team can assist you.",
        emailHighlight: "",
        turnaround: "",
        buttonText: "Got it 👍",
      });
      return;
    }

    const payload = {
      name: profileName,
      email: profileEmail,
      category: helpCategory,
      message: trimmed,
      submittedAt: new Date().toISOString(),
    };

    // Instant UI reset & display personalized support card
    setHelpMessage("");
    setHelpTab("faqs");
    setHelpModalOpen(false);

    setInfoModal({
      visible: true,
      emoji: "🚀",
      tag: "SUPPORT TICKET CREATED",
      title: `Message Received, ${profileName}!`,
      message: `Thanks for reaching out! Our support team has received your ${helpCategory.toLowerCase()} and will send a personal response directly to:`,
      emailHighlight: profileEmail,
      turnaround: "⚡ Typical turnaround: Under 4 hours on weekdays",
      buttonText: "Back to Studying 📚",
    });

    // Fast asynchronous background delivery
    fetch("https://formspree.io/f/mdeodpkp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("Background support submit error:", err);
    });
  };

  const filteredFaqs = HELP_FAQS.filter((faq) => {
    if (!helpSearch.trim()) return true;
    const q = helpSearch.toLowerCase();
    return (
      faq.q.toLowerCase().includes(q) ||
      faq.a.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  });

  const handleItemPress = (id) => {
    if (id === "goals") setGoalsModalOpen(true);
    else if (id === "stats") {
      if (onNavigate) onNavigate("stats");
      else if (onSelectTab) onSelectTab("stats");
      else setStatsModalOpen(true);
    }
    else if (id === "saved") setSavedModalOpen(true);
    else if (id === "offline") setOfflineModalOpen(true);
    else if (id === "settings") {
      if (onNavigate) onNavigate("settings");
      else setEditProfileModalOpen(true);
    }
    else if (id === "privacy") setPrivacyModalOpen(true);
    else if (id === "help") {
      if (onNavigate) onNavigate("help");
      else if (onSelectTab) onSelectTab("help");
      else setHelpModalOpen(true);
    }
  };

  const activeMetrics = PERIOD_DATA[selectedPeriod] || PERIOD_DATA["This Week"];

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0B0F19" : "#FFFFFF"} />

      {/* ── Top Header ────────────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage your account and track your progress</Text>
        </View>
        <View style={styles.headerActions}>
          <TooltipTouchable
            tooltip="Settings"
            style={styles.headerIconBtn}
            onPress={() => onNavigate ? onNavigate("settings") : setEditProfileModalOpen(true)}
            activeOpacity={0.7}
          >
            <GearIcon size={20} color={isDark ? "#F8FAFC" : "#1E293B"} />
          </TooltipTouchable>
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
              <TooltipTouchable
                tooltip="Change Avatar Emoji"
                style={[styles.avatarCircle, { backgroundColor: avatarBgColor }]}
                onPress={() => setAvatarModalOpen(true)}
                activeOpacity={0.85}
              >
                {(user && user.avatarUri) ? (
                  <Image source={{ uri: user.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
                )}
              </TooltipTouchable>
              <TooltipTouchable
                tooltip="Upload Avatar Photo"
                style={styles.cameraBadge}
                onPress={handlePickAvatarFromLibrary}
                activeOpacity={0.85}
              >
                <CameraIcon size={10} color="#FFFFFF" />
              </TooltipTouchable>
            </View>

            {/* Profile Meta info */}
            <View style={styles.profileMetaInfo}>
              <View style={styles.profileNameRow}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profileName}
                </Text>
                <TouchableOpacity
                  style={styles.editArrowBtn}
                  onPress={() => setEditProfileModalOpen(true)}
                  activeOpacity={0.7}
                >
                  <ChevronRightIcon size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={styles.memberTag}>
                <View style={styles.levelChip}>
                  <SparkleIcon size={8} color="#FFFFFF" />
                  <Text style={styles.levelChipText}>LVL {currentLevel.level}</Text>
                </View>
                <Text style={styles.memberTagText}>
                  {currentLevel.title}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.emailText} numberOfLines={1}>
                  {profileEmail}
                </Text>
                <View style={styles.metaDot} />
                <View style={styles.joinedRow}>
                  <CalendarIcon size={11} color="#94A3B8" />
                  <Text style={styles.joinedText}>May 2024</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Motivational Quote Box */}
          <TouchableOpacity
            style={styles.quoteCard}
            onPress={handleNextQuote}
            activeOpacity={0.88}
          >
            <View style={styles.quoteIconBadge}>
              <QuoteMarksIcon size={13} color="#6236FF" />
            </View>
            <View style={styles.quoteContent}>
              <Text style={styles.quoteLabel}>DAILY INSPIRATION</Text>
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
              activeOpacity={0.75}
            >
              <CalendarIcon size={12} color="#6236FF" />
              <Text style={styles.filterDropdownText}>{selectedPeriod}</Text>
              <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M6 9l6 6 6-6" />
              </Svg>
            </TouchableOpacity>
          </View>

          <View style={styles.overviewGrid}>
            {/* Stat Item 1: Goal Completion */}
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" }]}>
                <TargetIcon color="#2563EB" size={18} />
              </View>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {goalMetrics.weekly.completionPercentage}%
              </Text>
              <Text style={styles.statTitle} numberOfLines={1}>
                Goal Completion
              </Text>
              <Text style={styles.statSubtitle} numberOfLines={1}>
                This Week
              </Text>
            </View>

            {/* Stat Item 2: Goals Completed */}
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: "#ECFDF5", borderColor: "#D1FAE5" }]}>
                <BookIcon color="#059669" size={18} />
              </View>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {goalMetrics.monthly.totalCompleted}
              </Text>
              <Text style={styles.statTitle} numberOfLines={1}>
                Goals Completed
              </Text>
              <Text style={styles.statSubtitle} numberOfLines={1}>
                This Month
              </Text>
            </View>

            {/* Stat Item 3: Consistency Score */}
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: "#F5F3FF", borderColor: "#EDE9FE" }]}>
                <TrendIcon color="#7C3AED" size={18} />
              </View>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {goalMetrics.consistency.scorePercentage}%
              </Text>
              <Text style={styles.statTitle} numberOfLines={1}>
                Consistency
              </Text>
              <Text style={styles.statSubtitle} numberOfLines={1}>
                Score
              </Text>
            </View>
          </View>
        </View>

        {/* ── Quick Access Section ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.quickAccess")}</Text>
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
          <Text style={styles.sectionTitle}>{t("profile.account")}</Text>
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
        <TouchableOpacity
          style={styles.logoutCardBtn}
          onPress={handleLogOut}
          activeOpacity={0.7}
        >
          <LogOutIcon size={16} color="#EF4444" />
          <Text style={styles.logoutCardBtnTitle}>{t("profile.logOut")}</Text>
        </TouchableOpacity>
      </ScrollView>


      {/* ── 2. EDIT PROFILE MODAL ─────────────────────────────────────── */}
      <Modal
        visible={isEditProfileModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setEditProfileModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { maxHeight: "90%" }]}>
            {/* Header */}
            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={styles.helpHeaderIconBadge}>
                    <UserSettingsIcon size={16} color="#6236FF" />
                  </View>
                  <Text style={styles.modalSheetTitle}>{t("profile.editProfile")}</Text>
                </View>
                <Text style={styles.helpSheetSubtitle}>
                  Update your display name, photo, and details
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditProfileModalOpen(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingVertical: 10 }}>
              {/* Interactive Avatar Hero */}
              <View style={styles.editAvatarHero}>
                <TouchableOpacity
                  style={[styles.editAvatarCircle, { backgroundColor: avatarBgColor }]}
                  onPress={() => setAvatarModalOpen(true)}
                  activeOpacity={0.85}
                >
                  {(user && user.avatarUri) ? (
                    <Image source={{ uri: user.avatarUri }} style={styles.editAvatarImage} />
                  ) : (
                    <Text style={styles.editAvatarEmoji}>{avatarEmoji}</Text>
                  )}
                  <View style={styles.editCameraBadge}>
                    <CameraIcon size={11} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.changePhotoBtn}
                  onPress={handlePickAvatarFromLibrary}
                  activeOpacity={0.75}
                >
                  <Text style={styles.changePhotoBtnText}>Upload Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Form Inputs with embedded icons */}
              <View style={styles.formGroup}>
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <View style={styles.inputBox}>
                    <UserSettingsIcon size={16} color="#6236FF" />
                    <TextInput
                      style={styles.inputField}
                      value={profileName}
                      onChangeText={(text) => {
                        setProfileName(text);
                        if (onUpdateUser) onUpdateUser({ name: text });
                      }}
                      placeholder="Enter your name"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                {/* Email Address (Read-Only Display) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <View style={[styles.inputBox, styles.inputBoxReadOnly]}>
                    <MailIcon size={16} color="#64748B" />
                    <Text style={styles.readOnlyText} numberOfLines={1}>
                      {profileEmail}
                    </Text>
                    <LockIcon size={13} color="#94A3B8" />
                  </View>
                </View>

                {/* Account Status / Rank Tier info box */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CURRENT RANK & TIER</Text>
                  <View style={styles.tierInfoBox}>
                    <View style={styles.levelChip}>
                      <SparkleIcon size={8} color="#FFFFFF" />
                      <Text style={styles.levelChipText}>LVL {currentLevel.level}</Text>
                    </View>
                    <Text style={styles.tierInfoTitle} numberOfLines={1}>{currentLevel.title}</Text>
                  </View>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={styles.modalActionBtn}
                onPress={() => {
                  if (!profileName.trim()) {
                    setInfoModal({
                      visible: true,
                      emoji: "✍️",
                      tag: "NAME REQUIRED",
                      title: "Name is required",
                      message: "Please provide a display name so we can personalize your experience.",
                      buttonText: "Got it 👍",
                    });
                    return;
                  }
                  setEditProfileModalOpen(false);
                  gamificationService.recordProfileCompletion();
                  if (onUpdateUser) {
                    onUpdateUser({ name: profileName.trim(), email: profileEmail.trim() });
                  }
                  setInfoModal({
                    visible: true,
                    emoji: "✨",
                    tag: "PROFILE SAVED",
                    title: `Looking great, ${profileName.trim()}!`,
                    message: "Your profile information has been successfully updated and saved.",
                    emailHighlight: profileEmail.trim(),
                    turnaround: "✦ Level XP updated in real time",
                    buttonText: "Awesome 🚀",
                  });
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalActionBtnText}>Save Changes ✨</Text>
              </TouchableOpacity>
            </ScrollView>
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

              {(user && user.avatarUri) && (
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
                  style={[styles.avatarChoiceBtn, avatarEmoji === emoji && !(user && user.avatarUri) && styles.avatarChoiceSelected]}
                  onPress={() => {
                    setAvatarEmoji(emoji);
                    if (onUpdateUser) onUpdateUser({ avatarUri: null, avatarEmoji: emoji });
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
      <Modal
        visible={isPrivacyModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPrivacyModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { maxHeight: "88%" }]}>
            {/* Header */}
            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={styles.privacyHeaderIconBadge}>
                    <ShieldIcon size={16} color="#6236FF" />
                  </View>
                  <Text style={styles.modalSheetTitle}>Privacy & Security</Text>
                </View>
                <Text style={styles.privacySheetSubtitle}>
                  Control data visibility, analytics & device app lock
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPrivacyModalOpen(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 6 }}>
              {/* Security Shield Banner */}
              <View style={styles.privacyShieldBanner}>
                <View style={styles.privacyShieldIconWrap}>
                  <ShieldCheckIcon size={20} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.privacyShieldTitle}>End-to-End Privacy</Text>
                    <View style={styles.privacyShieldPill}>
                      <Text style={styles.privacyShieldPillText}>ENCRYPTED</Text>
                    </View>
                  </View>
                  <Text style={styles.privacyShieldSub}>
                    Your notes, study schedule, and AI tutor conversations remain private to your device.
                  </Text>
                </View>
              </View>

              {/* Preference Items */}
              <View style={styles.privacyItemsContainer}>
                {/* 1. Public Leaderboard Profile */}
                <TouchableOpacity
                  style={styles.privacyItemCard}
                  onPress={() => setPublicLeaderboard((prev) => !prev)}
                  activeOpacity={0.75}
                >
                  <View style={styles.privacyItemTop}>
                    <View style={[styles.privacyItemIconBadge, { backgroundColor: "#EEF2FF" }]}>
                      <GlobeIcon size={18} color="#4F46E5" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
                      <Text style={styles.privacyItemTitle}>Public Leaderboard Profile</Text>
                      <Text style={styles.privacyItemDesc}>
                        Show your avatar and study level to peers on the public leaderboard.
                      </Text>
                    </View>
                    <ToggleSwitch
                      value={publicLeaderboard}
                      onToggle={() => setPublicLeaderboard((prev) => !prev)}
                    />
                  </View>
                  <View style={styles.privacyItemStatusRow}>
                    <View style={[styles.privacyStatusBadge, publicLeaderboard ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                      <View style={[styles.statusDot, publicLeaderboard ? styles.statusDotActive : styles.statusDotInactive]} />
                      <Text style={[styles.privacyStatusText, publicLeaderboard ? styles.statusTextActive : styles.statusTextInactive]}>
                        {publicLeaderboard ? "Visible on National Leaderboard" : "Hidden from Public View"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* 2. Share Study Analytics */}
                <TouchableOpacity
                  style={styles.privacyItemCard}
                  onPress={() => setShareAnalytics((prev) => !prev)}
                  activeOpacity={0.75}
                >
                  <View style={styles.privacyItemTop}>
                    <View style={[styles.privacyItemIconBadge, { backgroundColor: "#ECFDF5" }]}>
                      <AnalyticsIcon size={18} color="#059669" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
                      <Text style={styles.privacyItemTitle}>Share Study Analytics</Text>
                      <Text style={styles.privacyItemDesc}>
                        Contribute anonymized study metrics to personalize AI recommendations.
                      </Text>
                    </View>
                    <ToggleSwitch
                      value={shareAnalytics}
                      onToggle={() => setShareAnalytics((prev) => !prev)}
                    />
                  </View>
                  <View style={styles.privacyItemStatusRow}>
                    <View style={[styles.privacyStatusBadge, shareAnalytics ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                      <View style={[styles.statusDot, shareAnalytics ? styles.statusDotActive : styles.statusDotInactive]} />
                      <Text style={[styles.privacyStatusText, shareAnalytics ? styles.statusTextActive : styles.statusTextInactive]}>
                        {shareAnalytics ? "AI Performance Insights Enabled" : "Stored Locally Only"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* 3. App Lock (Biometric / PIN) */}
                <TouchableOpacity
                  style={styles.privacyItemCard}
                  onPress={() => setBiometricLock((prev) => !prev)}
                  activeOpacity={0.75}
                >
                  <View style={styles.privacyItemTop}>
                    <View style={[styles.privacyItemIconBadge, { backgroundColor: "#FFFBEB" }]}>
                      <FingerprintIcon size={18} color="#D97706" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
                      <Text style={styles.privacyItemTitle}>App Lock (Biometric / PIN)</Text>
                      <Text style={styles.privacyItemDesc}>
                        Require Face ID, fingerprint, or device passcode to open StudPal.
                      </Text>
                    </View>
                    <ToggleSwitch
                      value={biometricLock}
                      onToggle={() => setBiometricLock((prev) => !prev)}
                    />
                  </View>
                  <View style={styles.privacyItemStatusRow}>
                    <View style={[styles.privacyStatusBadge, biometricLock ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                      <View style={[styles.statusDot, biometricLock ? styles.statusDotActive : styles.statusDotInactive]} />
                      <Text style={[styles.privacyStatusText, biometricLock ? styles.statusTextActive : styles.statusTextInactive]}>
                        {biometricLock ? "Biometric Protection Active" : "App Lock Disabled"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Zero-tracking Guarantee */}
              <View style={styles.zeroTrackingRow}>
                <LockIcon size={12} color="#64748B" />
                <Text style={styles.zeroTrackingText}>
                  StudPal never sells or shares your academic data with third parties.
                </Text>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.modalActionBtn}
                onPress={() => {
                  setPrivacyModalOpen(false);
                  setInfoModal({
                    visible: true,
                    emoji: "🛡️",
                    tag: "PREFERENCES UPDATED",
                    title: `All set, ${profileName}!`,
                    message: "Your privacy and security preferences have been securely saved and applied.",
                    emailHighlight: profileEmail,
                    turnaround: "🔒 On-device encryption verified",
                    buttonText: "Done 👍",
                  });
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalActionBtnText}>Save Preferences ✨</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── 10. HELP & SUPPORT MODAL ───────────────────────────────────── */}
      <Modal
        visible={isHelpModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setHelpModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { maxHeight: "88%" }]}>
            {/* Header */}
            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={styles.helpHeaderIconBadge}>
                    <HelpIcon size={16} color="#6236FF" />
                  </View>
                  <Text style={styles.modalSheetTitle}>Help & Support</Text>
                </View>
                <Text style={styles.helpSheetSubtitle}>
                  Guides, FAQs, and 24/7 dedicated support
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setHelpModalOpen(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            {/* Quick Support Channels */}
            <View style={styles.quickChannelsRow}>
              {/* Channel 1: Ask AI Coach */}
              <TouchableOpacity
                style={styles.channelCard}
                onPress={() => {
                  setHelpModalOpen(false);
                  if (onNavigate) {
                    onNavigate("aicoach", "I need help understanding how to study with StudPal");
                  } else if (onSelectTab) {
                    onSelectTab("aicoach");
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.channelIconBox, { backgroundColor: "#F0EEFF" }]}>
                  <BotIcon size={16} color="#6236FF" />
                </View>
                <Text style={styles.channelTitle}>AI Coach</Text>
                <Text style={styles.channelSub}>Ask anything 24/7</Text>
              </TouchableOpacity>

              {/* Channel 2: Email Support */}
              <TouchableOpacity
                style={styles.channelCard}
                onPress={() => {
                  setInfoModal({
                    visible: true,
                    emoji: "📬",
                    tag: "DIRECT SUPPORT",
                    title: `We're here for you, ${profileName}!`,
                    message: "You can email our dedicated support desk directly anytime. We review and answer every message personally.",
                    emailHighlight: "support@studpal.app",
                    turnaround: "⚡ Typical response time: Under 4 hours",
                    buttonText: "Understood 👍",
                  });
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.channelIconBox, { backgroundColor: "#EFF6FF" }]}>
                  <MailIcon size={16} color="#2563EB" />
                </View>
                <Text style={styles.channelTitle}>Email</Text>
                <Text style={styles.channelSub}>support@studpal.app</Text>
              </TouchableOpacity>

              {/* Channel 3: Send Ticket / Feedback */}
              <TouchableOpacity
                style={[styles.channelCard, helpTab === "contact" && styles.channelCardActive]}
                onPress={() => setHelpTab("contact")}
                activeOpacity={0.8}
              >
                <View style={[styles.channelIconBox, { backgroundColor: "#ECFDF5" }]}>
                  <FeedbackIcon size={16} color="#059669" />
                </View>
                <Text style={styles.channelTitle}>Feedback</Text>
                <Text style={styles.channelSub}>Report issue / idea</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Switcher: FAQs vs Contact Form */}
            <View style={styles.helpTabNav}>
              <TouchableOpacity
                style={[styles.helpTabBtn, helpTab === "faqs" && styles.helpTabBtnActive]}
                onPress={() => setHelpTab("faqs")}
                activeOpacity={0.8}
              >
                <Text style={[styles.helpTabBtnText, helpTab === "faqs" && styles.helpTabBtnTextActive]}>
                  Frequently Asked Questions ({filteredFaqs.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.helpTabBtn, helpTab === "contact" && styles.helpTabBtnActive]}
                onPress={() => setHelpTab("contact")}
                activeOpacity={0.8}
              >
                <Text style={[styles.helpTabBtnText, helpTab === "contact" && styles.helpTabBtnTextActive]}>
                  Send Message
                </Text>
              </TouchableOpacity>
            </View>

            {helpTab === "faqs" ? (
              <>
                {/* Search Bar */}
                <View style={styles.helpSearchBar}>
                  <SearchIcon size={15} color="#94A3B8" />
                  <TextInput
                    style={styles.helpSearchInput}
                    placeholder="Search topics, questions, features..."
                    placeholderTextColor="#94A3B8"
                    value={helpSearch}
                    onChangeText={setHelpSearch}
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                  />
                  {helpSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setHelpSearch("")}>
                      <CloseIcon size={14} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* FAQ List */}
                <ScrollView
                  style={{ maxHeight: 320 }}
                  contentContainerStyle={{ gap: 8, paddingBottom: 10 }}
                  showsVerticalScrollIndicator={false}
                >
                  {filteredFaqs.length === 0 ? (
                    <View style={styles.helpEmptyState}>
                      <Text style={styles.helpEmptyEmoji}>🔍</Text>
                      <Text style={styles.helpEmptyTitle}>No matching articles</Text>
                      <Text style={styles.helpEmptySub}>
                        Try searching with different keywords or send us a message directly.
                      </Text>
                      <TouchableOpacity
                        style={styles.helpEmptyAction}
                        onPress={() => setHelpTab("contact")}
                      >
                        <Text style={styles.helpEmptyActionText}>Contact Support Team</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    filteredFaqs.map((faq) => {
                      const isExpanded = expandedFaqId === faq.id;
                      return (
                        <TouchableOpacity
                          key={faq.id}
                          style={[styles.faqAccordionCard, isExpanded && styles.faqAccordionCardExpanded]}
                          onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          activeOpacity={0.85}
                        >
                          <View style={styles.faqAccordionHeader}>
                            <View style={{ flex: 1, gap: 4 }}>
                              <View style={styles.faqCategoryBadge}>
                                <Text style={styles.faqCategoryText}>{faq.category}</Text>
                              </View>
                              <Text style={styles.faqQuestionText}>{faq.q}</Text>
                            </View>
                            <View style={[styles.faqChevronWrapper, isExpanded && styles.faqChevronWrapperRotated]}>
                              <ChevronDownIcon size={15} color={isExpanded ? "#6236FF" : "#94A3B8"} />
                            </View>
                          </View>
                          {isExpanded && (
                            <View style={styles.faqAnswerContainer}>
                              <Text style={styles.faqAnswerText}>{faq.a}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })
                  )}
                </ScrollView>
              </>
            ) : (
              /* Contact / Ticket Form */
              <ScrollView
                style={{ maxHeight: 350 }}
                contentContainerStyle={{ gap: 12, paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  <Text style={styles.contactFormLabel}>What can we help you with?</Text>
                  <View style={styles.categoryPillsRow}>
                    {["General Inquiry", "Bug Report", "Feature Request", "Account Help"].map((cat) => {
                      const isSelected = helpCategory === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
                          onPress={() => setHelpCategory(cat)}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextSelected]}>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View>
                  <Text style={styles.contactFormLabel}>Your Message</Text>
                  <TextInput
                    style={styles.contactMessageInput}
                    placeholder="Describe your question, idea, or issue in detail..."
                    placeholderTextColor="#94A3B8"
                    value={helpMessage}
                    onChangeText={setHelpMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <Text style={styles.contactHelperText}>
                    Replies will be sent to your registered email ({profileEmail}).
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.contactSubmitBtn}
                  onPress={handleSendHelpMessage}
                  disabled={isHelpSent}
                  activeOpacity={0.85}
                >
                  <Text style={styles.contactSubmitBtnText}>
                    {isHelpSent ? "Sending..." : "Submit Message 🚀"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ── 11. PERSONALIZED INFO / CONFIRMATION MODAL ────────────────── */}
      <Modal
        visible={infoModal.visible}
        animationType="fade"
        transparent
        onRequestClose={() => setInfoModal((prev) => ({ ...prev, visible: false }))}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            {/* Mascot / Emoji Badge */}
            <View style={styles.infoModalBadge}>
              <Text style={styles.infoModalEmoji}>{infoModal.emoji || "✨"}</Text>
            </View>

            {/* Tag / Pre-title */}
            {infoModal.tag ? (
              <View style={styles.infoModalTag}>
                <SparkleIcon size={9} color="#6236FF" />
                <Text style={styles.infoModalTagText}>{infoModal.tag}</Text>
              </View>
            ) : null}

            {/* Title & Body */}
            <Text style={styles.infoModalTitle}>{infoModal.title}</Text>
            <Text style={styles.infoModalMessage}>{infoModal.message}</Text>

            {/* Email Pill / Highlight if present */}
            {infoModal.emailHighlight ? (
              <View style={styles.infoEmailPill}>
                <MailIcon size={13} color="#6236FF" />
                <Text style={styles.infoEmailPillText}>{infoModal.emailHighlight}</Text>
              </View>
            ) : null}

            {/* Turnaround Note if present */}
            {infoModal.turnaround ? (
              <View style={styles.infoTurnaroundBox}>
                <Text style={styles.infoTurnaroundText}>{infoModal.turnaround}</Text>
              </View>
            ) : null}

            {/* Action Button */}
            <TouchableOpacity
              style={styles.infoModalBtn}
              onPress={() => setInfoModal((prev) => ({ ...prev, visible: false }))}
              activeOpacity={0.85}
            >
              <Text style={styles.infoModalBtnText}>{infoModal.buttonText || "Got it 👍"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── 12. LOG OUT CONFIRMATION MODAL ────────────────────────────── */}
      <Modal
        visible={isLogoutModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setLogoutModalOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.logoutModalCard}>
            {/* Icon badge */}
            <View style={styles.logoutModalIconBadge}>
              <LogOutIcon size={28} color="#EF4444" />
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.logoutModalTitle}>Sign Out of StudPal?</Text>
            <Text style={styles.logoutModalBody}>
              Hey <Text style={{ fontWeight: "700", color: "#0F172A" }}>{profileName}</Text>, your study progress, XP, and AI notes are safely synced to the cloud. You can sign back in anytime.
            </Text>

            {/* Reassurance pill */}
            <View style={styles.logoutSyncPill}>
              <CheckCircleIcon size={14} color="#10B981" />
              <Text style={styles.logoutSyncPillText}>Cloud backup active & up to date</Text>
            </View>

            {/* Actions */}
            <View style={styles.logoutModalActions}>
              <TouchableOpacity
                style={styles.logoutCancelBtn}
                onPress={() => setLogoutModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                onPress={handleConfirmLogOut}
                activeOpacity={0.85}
              >
                <Text style={styles.logoutConfirmBtnText}>Yes, Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const baseProfileStyles = StyleSheet.create({
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
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
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "#F8FAFC",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 31,
  },
  cameraBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
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
    gap: 6,
  },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  memberTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 2.5,
    paddingLeft: 3.5,
    paddingRight: 9,
    gap: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  levelChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  levelChipText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  memberTagText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#1E293B",
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 1,
  },
  emailText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
  },
  joinedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  joinedText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
  },
  editArrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  quoteCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quoteIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  quoteContent: {
    flex: 1,
    gap: 2,
  },
  quoteLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#818CF8",
    letterSpacing: 0.6,
  },
  quoteText: {
    fontSize: 12.5,
    fontWeight: "500",
    color: "#334155",
    lineHeight: 18,
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
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  filterDropdownText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: -0.2,
  },

  overviewGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 132,
  },
  statIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 1,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  statSubtitle: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#94A3B8",
    textAlign: "center",
    letterSpacing: 0.3,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  logoutCardBtnTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EF4444",
  },

  logoutModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  logoutModalIconBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF1F2",
    borderWidth: 2,
    borderColor: "#FFE4E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logoutModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: "center",
  },
  logoutModalBody: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 14,
  },
  logoutSyncPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    marginBottom: 20,
  },
  logoutSyncPillText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#059669",
  },
  logoutModalActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  logoutCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutCancelBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#64748B",
  },
  logoutConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#E11D48",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E11D48",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutConfirmBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
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
    gap: 14,
    marginVertical: 4,
  },
  editAvatarHero: {
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  editAvatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 3,
    borderColor: "#F8FAFC",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  editAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },
  editAvatarEmoji: {
    fontSize: 32,
  },
  editCameraBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 5,
  },
  changePhotoBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#F0EEFF",
    borderRadius: 8,
  },
  changePhotoBtnText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#6236FF",
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 0,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 13.5,
    color: "#0F172A",
    fontWeight: "600",
    padding: 0,
  },
  inputBoxReadOnly: {
    backgroundColor: "#F1F5F9",
    borderWidth: 0,
    borderColor: "transparent",
  },
  readOnlyText: {
    flex: 1,
    fontSize: 13.5,
    color: "#475569",
    fontWeight: "600",
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },
  tierInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tierInfoTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#1E293B",
  },
  tierInfoXp: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  modalTextInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 0,
    borderColor: "transparent",
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
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  modalActionBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14.5,
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

  // ── Privacy & Security Styles ──────────────────────────────────
  privacyHeaderIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F0EEFF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  privacySheetSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  privacyShieldBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 12,
    marginBottom: 14,
  },
  privacyShieldIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  privacyShieldTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  privacyShieldPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  privacyShieldPillText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.5,
  },
  privacyShieldSub: {
    fontSize: 11.5,
    color: "#64748B",
    lineHeight: 16,
    marginTop: 2,
  },
  privacyItemsContainer: {
    gap: 10,
    marginBottom: 12,
  },
  privacyItemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  privacyItemTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  privacyItemIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  privacyItemTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  privacyItemDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 15,
  },
  privacyItemStatusRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  privacyStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: "#F0EEFF",
  },
  statusBadgeInactive: {
    backgroundColor: "#F1F5F9",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotActive: {
    backgroundColor: "#6236FF",
  },
  statusDotInactive: {
    backgroundColor: "#94A3B8",
  },
  privacyStatusText: {
    fontSize: 10.5,
    fontWeight: "700",
  },
  statusTextActive: {
    color: "#6236FF",
  },
  statusTextInactive: {
    color: "#64748B",
  },
  zeroTrackingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    marginBottom: 4,
  },
  zeroTrackingText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    textAlign: "center",
  },
  customSwitchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center",
  },
  customSwitchTrackActive: {
    backgroundColor: "#6236FF",
  },
  customSwitchTrackInactive: {
    backgroundColor: "#E2E8F0",
  },
  customSwitchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  customSwitchThumbActive: {
    alignSelf: "flex-end",
  },
  customSwitchThumbInactive: {
    alignSelf: "flex-start",
  },
  helpHeaderIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  helpSheetSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quickChannelsRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
  },
  channelCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  channelCardActive: {
    backgroundColor: "#F0EEFF",
    borderColor: "#DDD6FE",
  },
  channelIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  channelTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  channelSub: {
    fontSize: 9.5,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    marginTop: 1,
  },
  helpTabNav: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  helpTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  helpTabBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  helpTabBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  helpTabBtnTextActive: {
    color: "#0F172A",
    fontWeight: "700",
  },
  helpSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 10,
  },
  helpSearchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    padding: 0,
  },
  faqAccordionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  faqAccordionCardExpanded: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  faqAccordionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  faqCategoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  faqCategoryText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  faqQuestionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 18,
  },
  faqChevronWrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  faqChevronWrapperRotated: {
    transform: [{ rotate: "180deg" }],
  },
  faqAnswerContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  faqAnswerText: {
    fontSize: 12.5,
    fontWeight: "500",
    color: "#475569",
    lineHeight: 18,
  },
  helpEmptyState: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 6,
  },
  helpEmptyEmoji: {
    fontSize: 28,
  },
  helpEmptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  helpEmptySub: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  helpEmptyAction: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F0EEFF",
    borderRadius: 8,
  },
  helpEmptyActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },
  contactFormLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  categoryPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryPillSelected: {
    backgroundColor: "#F0EEFF",
    borderColor: "#6236FF",
  },
  categoryPillText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#64748B",
  },
  categoryPillTextSelected: {
    color: "#6236FF",
    fontWeight: "700",
  },
  contactMessageInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "transparent",
    padding: 12,
    fontSize: 13,
    color: "#0F172A",
    minHeight: 90,
  },
  contactHelperText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 6,
    fontWeight: "500",
  },
  contactSubmitBtn: {
    backgroundColor: "#6236FF",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  contactSubmitBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  infoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoModalBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0EEFF",
    borderWidth: 2,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  infoModalEmoji: {
    fontSize: 28,
  },
  infoModalTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDE9FE",
    marginBottom: 8,
  },
  infoModalTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6236FF",
    letterSpacing: 0.4,
  },
  infoModalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  infoModalMessage: {
    fontSize: 13.5,
    color: "#475569",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoEmailPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  infoEmailPillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#6236FF",
  },
  infoTurnaroundBox: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    marginBottom: 18,
  },
  infoTurnaroundText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
    textAlign: "center",
  },
  infoModalBtn: {
    width: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  infoModalBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

const getProfileStyles = (isDark, activeAccentColor, insets = { bottom: 0 }) => {
  return {
    ...baseProfileStyles,
    root: [
      baseProfileStyles.root,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    pageHeader: [
      baseProfileStyles.pageHeader,
      isDark && { backgroundColor: "#0B0F19", borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    pageTitle: [
      baseProfileStyles.pageTitle,
      isDark && { color: "#F8FAFC" },
    ],
    pageSubtitle: [
      baseProfileStyles.pageSubtitle,
      isDark && { color: "#94A3B8" },
    ],
    headerIconBtn: [
      baseProfileStyles.headerIconBtn,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    profileCard: [
      baseProfileStyles.profileCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    profileName: [
      baseProfileStyles.profileName,
      isDark && { color: "#F8FAFC" },
    ],
    memberTag: [
      baseProfileStyles.memberTag,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    memberTagText: [
      baseProfileStyles.memberTagText,
      isDark && { color: "#F8FAFC" },
    ],
    editArrowBtn: [
      baseProfileStyles.editArrowBtn,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    quoteCard: [
      baseProfileStyles.quoteCard,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    quoteIconBadge: [
      baseProfileStyles.quoteIconBadge,
      isDark && { backgroundColor: "#1E293B" },
    ],
    quoteText: [
      baseProfileStyles.quoteText,
      isDark && { color: "#CBD5E1" },
    ],
    sectionTitle: [
      baseProfileStyles.sectionTitle,
      isDark && { color: "#F8FAFC" },
    ],
    filterDropdown: [
      baseProfileStyles.filterDropdown,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    filterDropdownText: [
      baseProfileStyles.filterDropdownText,
      isDark && { color: "#F8FAFC" },
    ],
    statCard: [
      baseProfileStyles.statCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    statValue: [
      baseProfileStyles.statValue,
      isDark && { color: "#F8FAFC" },
    ],
    statTitle: [
      baseProfileStyles.statTitle,
      isDark && { color: "#E2E8F0" },
    ],
    cardGroup: [
      baseProfileStyles.cardGroup,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    listRowTitle: [
      baseProfileStyles.listRowTitle,
      isDark && { color: "#F8FAFC" },
    ],
    divider: [
      baseProfileStyles.divider,
      isDark && { backgroundColor: "transparent", height: 0 },
    ],
    logoutCardBtn: [
      baseProfileStyles.logoutCardBtn,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    modalSheetContainer: [
      baseProfileStyles.modalSheetContainer,
      { paddingBottom: Math.max(insets?.bottom || 0, 16) + 20 },
      isDark && { backgroundColor: "#1E293B" },
    ],
    modalSheetTitle: [
      baseProfileStyles.modalSheetTitle,
      isDark && { color: "#F8FAFC" },
    ],
    inputBox: [
      baseProfileStyles.inputBox,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    inputBoxReadOnly: [
      baseProfileStyles.inputBoxReadOnly,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    readOnlyText: [
      baseProfileStyles.readOnlyText,
      isDark && { color: "#94A3B8" },
    ],
    inputField: [
      baseProfileStyles.inputField,
      isDark && { color: "#F8FAFC" },
    ],
    modalTextInput: [
      baseProfileStyles.modalTextInput,
      isDark && { backgroundColor: "#0F172A", color: "#F8FAFC", borderWidth: 0, borderColor: "transparent" },
    ],
    avatarModalCard: [
      baseProfileStyles.avatarModalCard,
      isDark && { backgroundColor: "#1E293B" },
    ],
    avatarChoiceBtn: [
      baseProfileStyles.avatarChoiceBtn,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    filterModalCard: [
      baseProfileStyles.filterModalCard,
      isDark && { backgroundColor: "#1E293B" },
    ],
    periodOptionRow: [
      baseProfileStyles.periodOptionRow,
      isDark && { borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    periodOptionText: [
      baseProfileStyles.periodOptionText,
      isDark && { color: "#F8FAFC" },
    ],
    goalRowItem: [
      baseProfileStyles.goalRowItem,
      isDark && { borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    goalTextItem: [
      baseProfileStyles.goalTextItem,
      isDark && { color: "#F8FAFC" },
    ],
    statsCardDetail: [
      baseProfileStyles.statsCardDetail,
      isDark && { backgroundColor: "#0F172A" },
    ],
    statsDetailLabel: [
      baseProfileStyles.statsDetailLabel,
      isDark && { color: "#94A3B8" },
    ],
    statsDetailValue: [
      baseProfileStyles.statsDetailValue,
      isDark && { color: "#F8FAFC" },
    ],
    savedTopicCard: [
      baseProfileStyles.savedTopicCard,
      isDark && { backgroundColor: "#0F172A" },
    ],
    savedTopicTitle: [
      baseProfileStyles.savedTopicTitle,
      isDark && { color: "#F8FAFC" },
    ],
    offlineFileCard: [
      baseProfileStyles.offlineFileCard,
      isDark && { backgroundColor: "#0F172A" },
    ],
    offlineFileName: [
      baseProfileStyles.offlineFileName,
      isDark && { color: "#F8FAFC" },
    ],
    switchRow: [
      baseProfileStyles.switchRow,
      isDark && { borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    switchLabel: [
      baseProfileStyles.switchLabel,
      isDark && { color: "#F8FAFC" },
    ],
    privacyShieldBanner: [
      baseProfileStyles.privacyShieldBanner,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    privacyShieldTitle: [
      baseProfileStyles.privacyShieldTitle,
      isDark && { color: "#F8FAFC" },
    ],
    privacyShieldSub: [
      baseProfileStyles.privacyShieldSub,
      isDark && { color: "#94A3B8" },
    ],
    privacyItemCard: [
      baseProfileStyles.privacyItemCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    privacyItemTitle: [
      baseProfileStyles.privacyItemTitle,
      isDark && { color: "#F8FAFC" },
    ],
    privacyItemDesc: [
      baseProfileStyles.privacyItemDesc,
      isDark && { color: "#94A3B8" },
    ],
    privacyItemStatusRow: [
      baseProfileStyles.privacyItemStatusRow,
      isDark && { borderTopWidth: 0, borderTopColor: "transparent" },
    ],
    modalCloseBtn: [
      baseProfileStyles.modalCloseBtn,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    channelCard: [
      baseProfileStyles.channelCard,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    channelTitle: [
      baseProfileStyles.channelTitle,
      isDark && { color: "#F8FAFC" },
    ],
    helpTabNav: [
      baseProfileStyles.helpTabNav,
      isDark && { backgroundColor: "#0F172A" },
    ],
    helpTabBtnActive: [
      baseProfileStyles.helpTabBtnActive,
      isDark && { backgroundColor: "#1E293B" },
    ],
    helpTabBtnText: [
      baseProfileStyles.helpTabBtnText,
      isDark && { color: "#94A3B8" },
    ],
    helpTabBtnTextActive: [
      baseProfileStyles.helpTabBtnTextActive,
      isDark && { color: "#F8FAFC" },
    ],
    helpSearchBar: [
      baseProfileStyles.helpSearchBar,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    helpSearchInput: [
      baseProfileStyles.helpSearchInput,
      isDark && { color: "#F8FAFC" },
    ],
    faqAccordionCard: [
      baseProfileStyles.faqAccordionCard,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    faqAccordionCardExpanded: [
      baseProfileStyles.faqAccordionCardExpanded,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    faqCategoryBadge: [
      baseProfileStyles.faqCategoryBadge,
      isDark && { backgroundColor: "#1E293B" },
    ],
    faqCategoryText: [
      baseProfileStyles.faqCategoryText,
      isDark && { color: "#94A3B8" },
    ],
    faqQuestionText: [
      baseProfileStyles.faqQuestionText,
      isDark && { color: "#F8FAFC" },
    ],
    faqAnswerContainer: [
      baseProfileStyles.faqAnswerContainer,
      isDark && { borderTopWidth: 0, borderTopColor: "transparent" },
    ],
    faqAnswerText: [
      baseProfileStyles.faqAnswerText,
      isDark && { color: "#CBD5E1" },
    ],
    helpEmptyTitle: [
      baseProfileStyles.helpEmptyTitle,
      isDark && { color: "#F8FAFC" },
    ],
    helpEmptySub: [
      baseProfileStyles.helpEmptySub,
      isDark && { color: "#94A3B8" },
    ],
    contactFormLabel: [
      baseProfileStyles.contactFormLabel,
      isDark && { color: "#F8FAFC" },
    ],
    categoryPill: [
      baseProfileStyles.categoryPill,
      isDark && { backgroundColor: "#0F172A" },
    ],
    categoryPillText: [
      baseProfileStyles.categoryPillText,
      isDark && { color: "#94A3B8" },
    ],
    contactMessageInput: [
      baseProfileStyles.contactMessageInput,
      isDark && { backgroundColor: "#0F172A", color: "#F8FAFC", borderWidth: 0, borderColor: "transparent" },
    ],
    infoModalCard: [
      baseProfileStyles.infoModalCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    infoModalTitle: [
      baseProfileStyles.infoModalTitle,
      isDark && { color: "#F8FAFC" },
    ],
    infoModalMessage: [
      baseProfileStyles.infoModalMessage,
      isDark && { color: "#94A3B8" },
    ],
    infoEmailPill: [
      baseProfileStyles.infoEmailPill,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    logoutModalCard: [
      baseProfileStyles.logoutModalCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    logoutModalTitle: [
      baseProfileStyles.logoutModalTitle,
      isDark && { color: "#F8FAFC" },
    ],
    logoutModalBody: [
      baseProfileStyles.logoutModalBody,
      isDark && { color: "#94A3B8" },
    ],
    logoutCancelBtn: [
      baseProfileStyles.logoutCancelBtn,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    logoutCancelBtnText: [
      baseProfileStyles.logoutCancelBtnText,
      isDark && { color: "#94A3B8" },
    ],
    notifCardItem: [
      baseProfileStyles.notifCardItem,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    notifItemTitle: [
      baseProfileStyles.notifItemTitle,
      isDark && { color: "#F8FAFC" },
    ],
    notifItemBody: [
      baseProfileStyles.notifItemBody,
      isDark && { color: "#94A3B8" },
    ],
    notifItemTime: [
      baseProfileStyles.notifItemTime,
      isDark && { color: "#64748B" },
    ],
  };
};
