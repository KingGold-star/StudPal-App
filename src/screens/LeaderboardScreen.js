import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  Animated,
} from "react-native";
import Svg, { Path, Circle, Rect, Polygon } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import CustomModal from "../components/CustomModal";
import TooltipTouchable from "../components/TooltipTouchable";
import { gamificationService } from "../services/gamification/gamificationService";
import { settingsService } from "../services/settings/settingsService";
import { ipLocationService } from "../services/ipLocationService";
import { useTranslation } from "../services/i18n/i18nService";
import { Colors } from "../theme/colors";
import { useTheme } from "../theme/themeContext";
import XpHistoryModal from "../components/XpHistoryModal";
import { getCountryLeaderboardData } from "../services/gamification/countryLeaderboardData";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ size = 20, color = "#0F172A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const GlobeMiniIcon = ({ size = 11, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const CheckIcon = ({ size = 16, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const InfoCircleIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
  </Svg>
);

const RefreshIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 4v6h-6" />
    <Path d="M1 20v-6h6" />
    <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Svg>
);

const TrophyTabIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <Path d="M4 22h16" />
    <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </Svg>
);

const MedalTabIcon = ({ size = 16, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="8" r="7" />
    <Path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
  </Svg>
);

const StarIcon = ({ size = 14, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

const UsersIcon = ({ size = 22, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const HandshakeIcon = ({ size = 22, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L7 13" />
    <Path d="M14 14.5L16 17" />
    <Path d="M7 16.5L4 13.5" />
    <Path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
  </Svg>
);

const TargetIcon = ({ size = 22, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const LockMiniIcon = ({ size = 12, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
    <Path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);

const CheckCircleIcon = ({ size = 24, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="12" />
    <Path d="M7 12.5l3 3 7-7" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockCircleIcon = ({ size = 24, color = "#F1F5F9", iconColor = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="12" />
    <Rect x="8" y="11" width="8" height="6" rx="1.5" fill="none" stroke={iconColor} strokeWidth="1.5" />
    <Path d="M9.5 11V8.5a2.5 2.5 0 0 1 5 0V11" fill="none" stroke={iconColor} strokeWidth="1.5" />
  </Svg>
);

const ClockIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const SearchIcon = ({ size = 16, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const ChevronRightIcon = ({ size = 18, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const CloseIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18" />
    <Path d="M6 6l12 12" />
  </Svg>
);

const SparklesIcon = ({ size = 14, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5z" />
  </Svg>
);

const CircularProgress = ({ size = 40, progress = 60, color = "#6236FF" }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle stroke="#F1F5F9" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" />
        <Circle stroke={color} cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      <Text style={{ fontSize: 10, fontWeight: '800', color }}>{progress}%</Text>
    </View>
  );
};

const getTierBadge = (requiredProgress = 1) => {
  if (requiredProgress >= 100) return { label: "LEGENDARY", color: "#D97706", bg: "#FEF3C7" };
  if (requiredProgress >= 50) return { label: "GOLD", color: "#F59E0B", bg: "#FEF3C7" };
  if (requiredProgress >= 10) return { label: "SILVER", color: "#6366F1", bg: "#EEF2FF" };
  return { label: "BRONZE", color: "#8B5CF6", bg: "#F3E8FF" };
};

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const LEADERBOARD_LIST = [
  { id: "4", rank: 4, name: "Rachel McCoy", role: "Pro", xp: "1,050", avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
  { id: "5", rank: 5, name: "David Kim", role: "Level 22", xp: "980", avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: "6", rank: 6, name: "You", role: "Emerging Leader", xp: "860", isCurrentUser: true, avatarUri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
  { id: "7", rank: 7, name: "Jessica Alba", role: "Level 19", xp: "810", avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
  { id: "8", rank: 8, name: "Roger Jordan", role: "Level 18", xp: "770", avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
];

const ACHIEVEMENTS_DATA = [
  { id: "a1", title: "First Step", description: "Completed your first study session", icon: "🏆", bgTint: "#FFF7ED", status: "unlocked" },
  { id: "a2", title: "Goal Builder", description: "Completed 10 study goals", icon: "📊", bgTint: "#EFF6FF", status: "unlocked" },
  { id: "a3", title: "Knowledge Seeker", description: "Mastered 10 topics", icon: "📚", bgTint: "#EFF6FF", status: "unlocked" },
  { id: "a4", title: "Focus Master", description: "Completed 10 focus sessions", icon: "🎯", bgTint: "#F0FDF4", status: "unlocked" },
  { id: "a5", title: "Consistent Learner", description: "Maintain 80%+ goal completion", icon: "👑", bgTint: "#F0EEFF", status: "in_progress", progress: 84, progressText: "84% Consistency" },
  { id: "a6", title: "Century", description: "Complete 100 study goals", icon: "💯", bgTint: "#F1F5F9", status: "locked" },
];

const LEADERSHIP_CHALLENGES = [
  { id: "c1", title: "Host a 30m Focus Group", subtitle: "Lead a study room with 2+ peers", xp: 100, icon: "👥", bg: "#F0EEFF", metric: "1 / 1 Completed", readyToClaim: true },
  { id: "c2", title: "Answer 3 Classmate Questions", subtitle: "Help fellow students in AI Study Coach", xp: 75, icon: "🤝", bg: "#ECFDF5", metric: "2 / 3 Answered", readyToClaim: false },
  { id: "c3", title: "Share a Study Deck", subtitle: "Publish flashcards for your subject", xp: 50, icon: "📚", bg: "#EFF6FF", metric: "0 / 1 Published", readyToClaim: false },
  { id: "c4", title: "Top 5 Weekly Streak", subtitle: "Maintain study momentum for 5 days", xp: 120, icon: "⚡", bg: "#FFF7ED", metric: "4 / 5 Days", readyToClaim: false },
];

export default function LeaderboardScreen({
  user = { name: "Alex", avatarUri: null },
  settings = null,
  onUpdateUser,
  onBack,
  onSelectTab,
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [gamification, setGamification] = useState(gamificationService.getState());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [claimedChallenges, setClaimedChallenges] = useState({});
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState("This Week");
  const [currentSettings, setCurrentSettings] = useState(settingsService.getSettingsSync());
  const [scrollY, setScrollY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Country Code strictly tracked by IP address (defaults to cached IP code or "NG")
  const [ipCountryCode, setIpCountryCode] = useState(() => (user?.countryCode || ipLocationService.getCountryCode() || "NG").toUpperCase());

  useEffect(() => {
    // Subscribe to IP location updates
    const unsubIp = ipLocationService.subscribe((code) => {
      if (code && typeof code === "string" && code.length === 2) {
        const upper = code.toUpperCase();
        setIpCountryCode(upper);
        if (onUpdateUser && (!user?.countryCode || user.countryCode !== upper)) {
          onUpdateUser({ countryCode: upper });
        }
      }
    });
    return () => unsubIp();
  }, []);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    // Spin the icon one full rotation
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
    // Re-fetch latest gamification state
    const fresh = gamificationService.getState();
    setGamification(fresh);
    setTimeout(() => setRefreshing(false), 750);
  };

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    const unsubscribe = gamificationService.subscribe((newState) => {
      setGamification(newState);
    });
    const unsubSettings = settingsService.subscribe((s) => {
      setCurrentSettings(s);
    });
    return () => {
      unsubscribe();
      unsubSettings();
    };
  }, []);

  const { isDark, accentColor: themeAccentColor } = useTheme();
  const accentColor = themeAccentColor || (currentSettings && currentSettings.accentColor) || Colors.accent || "#6236FF";
  const styles = useMemo(() => getLeaderboardStyles(isDark, accentColor), [isDark, accentColor]);
  const { currentLevel = { level: 1, title: 'Scholar' }, nextLevel, breakdown = {} } = gamification || {};

  const handleClaimChallenge = (challenge) => {
    if (claimedChallenges[challenge.id]) return;
    gamificationService.awardXp(
      "LEADERSHIP_CHALLENGE",
      challenge.xp,
      `Completed: ${challenge.title}`,
      `challenge_${challenge.id}`
    );
    setClaimedChallenges((prev) => ({ ...prev, [challenge.id]: true }));
  };

  const getSundayCountdown = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const daysUntilSunday = day === 0 ? 7 : 7 - day;
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntilSunday);
    target.setHours(23, 59, 59, 0);
    const diff = Math.max(0, Math.floor((target - now) / 1000));
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${d}d ${h}h ${m}m ${String(s).padStart(2, '0')}s`;
  };

  const [resetCountdown, setResetCountdown] = React.useState(getSundayCountdown());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setResetCountdown(getSundayCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Country Leaderboard Data (strictly grouping by detected IP country code)
  const countryBoard = useMemo(() => {
    return getCountryLeaderboardData({
      countryCode: ipCountryCode,
      timeframe: leaderboardTimeframe,
      user,
      userTotalXp: gamification.totalXp,
      userHomeCountry: ipCountryCode,
    });
  }, [ipCountryCode, leaderboardTimeframe, user, gamification.totalXp]);

  const countryFullName = useMemo(() => {
    try {
      if (typeof Intl !== "undefined" && Intl.DisplayNames) {
        const dn = new Intl.DisplayNames(["en"], { type: "region" });
        const name = dn.of(ipCountryCode);
        if (name) return name;
      }
    } catch (e) {}
    return countryBoard?.country || "Nigeria";
  }, [ipCountryCode, countryBoard?.country]);

  const currentUserIndex = countryBoard.standings.findIndex((item) => item.isCurrentUser);
  const userRank = currentUserIndex !== -1 ? countryBoard.standings[currentUserIndex].rank : 6;
  const peerTrio = currentUserIndex !== -1
    ? [
        countryBoard.standings[Math.max(0, currentUserIndex - 1)],
        countryBoard.standings[currentUserIndex],
        countryBoard.standings[Math.min(countryBoard.standings.length - 1, currentUserIndex + 1)],
      ].filter(Boolean)
    : countryBoard.standings.slice(0, 3);
  const showStickyPeerBar = userRank > 3 && scrollY > 250;

  const renderLeaderboard = () => (
    <View style={styles.sectionContainer}>
      {/* ── Country League Scope Banner ── */}
      <View style={styles.countryLeagueBanner}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <View style={styles.bannerCodeBadge}>
            <Text style={styles.bannerCodeBadgeText}>{ipCountryCode}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={styles.countryLeagueBannerTitle}>
                {ipCountryCode} Board
              </Text>
              <View style={styles.countryOnlyBadge}>
                <LockMiniIcon size={10} color={accentColor} />
                <Text style={styles.countryOnlyBadgeText}>National Only</Text>
              </View>
            </View>
            <Text style={styles.countryLeagueBannerSub}>
              Only grouping scholars residing in {countryFullName}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Top Hero Card: Country Podium ── */}
      <View style={styles.heroCard}>
        {/* Header row */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.heroMainTitle}>{ipCountryCode} League</Text>
            <Text style={styles.heroSubTitle}>Top 3 Scholars in {countryFullName}</Text>
          </View>
          <View style={styles.countdownBadge}>
            <ClockIcon size={13} color="#6366F1" />
            <Text style={styles.countdownBadgeText}>{resetCountdown}</Text>
          </View>
        </View>

        {/* Podium Stand — three columns */}
        <View style={styles.podiumRow}>

          {/* #2 */}
          <View style={[styles.podiumCol, { marginTop: 28 }]}>
            <View style={styles.podiumAvatarRing2}>
              <Image
                source={{ uri: countryBoard.podium.p2.avatarUri }}
                style={styles.podiumAvatarImg2}
              />
            </View>
            <Text style={styles.podiumUserName} numberOfLines={1}>{countryBoard.podium.p2.name}</Text>
            <View style={[styles.podiumCityBadge, isDark && { backgroundColor: "#334155" }]}>
              <Text style={[styles.podiumCityText, isDark && { color: "#CBD5E1" }]} numberOfLines={1}>{countryBoard.podium.p2.city}</Text>
            </View>
            <Text style={styles.podiumXpSmall}>{countryBoard.podium.p2.xpFormatted}</Text>
            <View style={[styles.podiumPlinth, { height: 54, backgroundColor: isDark ? "rgba(148, 163, 184, 0.2)" : "#DDE3EF", borderWidth: isDark ? 1 : 0, borderColor: "rgba(148, 163, 184, 0.35)" }]}>
              <Text style={[styles.podiumPlinthNum, { color: isDark ? "#CBD5E1" : "#64748B" }]}>2</Text>
            </View>
          </View>

          {/* #1 — centre, taller */}
          <View style={styles.podiumCol}>
            <Text style={styles.podiumCrown}>👑</Text>
            <View style={styles.podiumAvatarRing1}>
              <Image
                source={{ uri: countryBoard.podium.p1.avatarUri }}
                style={styles.podiumAvatarImg1}
              />
            </View>
            <Text style={styles.podiumUserName} numberOfLines={1}>{countryBoard.podium.p1.name}</Text>
            <View style={[styles.podiumCityBadge, { backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : "#FEF3C7" }]}>
              <Text style={[styles.podiumCityText, { color: isDark ? "#FBBF24" : "#D97706" }]} numberOfLines={1}>{countryBoard.podium.p1.city}</Text>
            </View>
            <Text style={[styles.podiumXpSmall, { color: "#D97706", fontWeight: "800" }]}>{countryBoard.podium.p1.xpFormatted}</Text>
            <View style={[styles.podiumPlinth, { height: 76, backgroundColor: isDark ? `${accentColor}33` : "#D9D0F7", borderWidth: isDark ? 1 : 0, borderColor: `${accentColor}66` }]}>
              <Text style={[styles.podiumPlinthNum, { color: isDark ? (accentColor || "#818CF8") : "#6236FF" }]}>1</Text>
            </View>
          </View>

          {/* #3 */}
          <View style={[styles.podiumCol, { marginTop: 44 }]}>
            <View style={styles.podiumAvatarRing3}>
              <Image
                source={{ uri: countryBoard.podium.p3.avatarUri }}
                style={styles.podiumAvatarImg2}
              />
            </View>
            <Text style={styles.podiumUserName} numberOfLines={1}>{countryBoard.podium.p3.name}</Text>
            <View style={[styles.podiumCityBadge, isDark && { backgroundColor: "#334155" }]}>
              <Text style={[styles.podiumCityText, isDark && { color: "#CBD5E1" }]} numberOfLines={1}>{countryBoard.podium.p3.city}</Text>
            </View>
            <Text style={styles.podiumXpSmall}>{countryBoard.podium.p3.xpFormatted}</Text>
            <View style={[styles.podiumPlinth, { height: 40, backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : "#F5DEB3", borderWidth: isDark ? 1 : 0, borderColor: "rgba(245, 158, 11, 0.35)" }]}>
              <Text style={[styles.podiumPlinthNum, { color: isDark ? "#FBBF24" : "#D97706" }]}>3</Text>
            </View>
          </View>

        </View>
      </View>

      {/* ── Your Rank Card ── */}
      <View style={styles.yourRankCard}>
        <View style={[styles.yourRankAccentBar, { backgroundColor: accentColor }]} />
        <View style={{ flex: 1, gap: 10 }}>
          <View style={styles.yourRankTopRow}>
            <View style={styles.yourRankAvatarWrap}>
              {(user && user.avatarUri) ? (
                <Image source={{ uri: user.avatarUri }} style={{ width: 42, height: 42, borderRadius: 21 }} />
              ) : (
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: accentColor, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20 }}>
                    {user?.avatarEmoji || '👨‍🎓'}
                  </Text>
                </View>
              )}
              <View style={[styles.yourRankBadge, isDark && { backgroundColor: `${accentColor}25`, borderWidth: 1, borderColor: `${accentColor}55` }]}>
                <Text style={[styles.yourRankBadgeText, isDark && { color: accentColor || "#818CF8" }]}>
                  {`#${userRank || 6}`}
                </Text>
              </View>
            </View>

            <View style={styles.yourRankInfoGroup}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.yourRankName}>{(user && user.name) ? `${user.name} (You)` : 'You'}</Text>
                <View style={[styles.homePillTag, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5" }]}>
                  <Text style={[styles.homePillTagText, { color: "#10B981" }]}>{ipCountryCode}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Text style={styles.yourRankXpText}>
                  <Text style={{ fontWeight: '900', color: accentColor }}>{gamification.totalXp.toLocaleString()}</Text> XP
                </Text>
                <StarIcon size={12} color="#F59E0B" />
                <Text style={{ fontSize: 11, color: isDark ? "#94A3B8" : "#64748B" }}>
                  • Rank #{userRank || 6} in {countryFullName}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.yourRankDivider, isDark && { backgroundColor: '#334155' }]} />
        </View>
      </View>

      {/* ── Leadership Rankings Section (Country-Exclusive) ── */}
      <View style={styles.rankingsContainer}>
        <View style={styles.rankingsHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rankingsHeaderTitle}>
              {ipCountryCode} Standings
            </Text>
            <Text style={styles.countryGroupingNote}>
              Only grouping scholars residing in {countryFullName}
            </Text>
          </View>
        </View>

        <View style={styles.rankingsList}>
          {countryBoard.standings.map((item) => (
            <View
              key={item.id}
              style={[
                styles.rankingItemRow,
                item.isCurrentUser && (isDark ? { backgroundColor: `${accentColor}22`, borderColor: accentColor } : styles.rankingItemRowActive),
              ]}
            >
              <Text style={[styles.rankingNumberText, item.isCurrentUser && styles.rankingNumberActive]} numberOfLines={1}>
                #{item.rank}
              </Text>
              <View style={styles.rankingAvatarBg}>
                {item.isCurrentUser && user && user.avatarUri ? (
                  <Image source={{ uri: user.avatarUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                ) : item.isCurrentUser ? (
                  <Text style={{ fontSize: 18 }}>{user?.avatarEmoji || '👨‍🎓'}</Text>
                ) : item.avatarUri ? (
                  <Image source={{ uri: item.avatarUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                ) : (
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B' }}>
                    {item.name.substring(0, 2).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.rankingDetails}>
                <Text style={styles.rankingNameText} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <Text style={styles.rankingRoleText}>{item.role}</Text>
                  {item.city ? (
                    <View style={[styles.cityMiniTag, isDark && { backgroundColor: "#334155" }]}>
                      <Text style={[styles.cityMiniTagText, isDark && { color: "#CBD5E1" }]}>{item.city}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.rankingXpRight}>
                <Text style={[styles.rankingXpValText, item.isCurrentUser && styles.rankingXpValActive]}>
                  {item.xpFormatted}
                </Text>
                <StarIcon size={14} color="#F59E0B" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── Balanced XP Activities Breakdown ── */}
      <View style={styles.xpBreakdownCard}>
        <Text style={styles.xpBreakdownTitle}>{t("leaderboard.howXpIsEarned", "How XP is Earned")}</Text>

        {[
          { emoji: "🎴", label: "SRS Flashcards",   desc: "Spaced repetition reviews",    xp: "+10 XP",  accent: "#6366F1" },
          { emoji: "⏱️", label: "Focus Sessions",    desc: "25-minute deep work blocks",   xp: "+50 XP",  accent: "#D97706" },
          { emoji: "🤖", label: "AI Conversations",  desc: "Deep AI study coach sessions", xp: "+100 XP", accent: "#10B981" },
        ].map(({ emoji, label, desc, xp, accent }) => (
          <View key={label} style={styles.activityRowItem}>
            <View style={[styles.activityAccentBar, { backgroundColor: accent }]} />
            <Text style={styles.activityEmoji}>{emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>{label}</Text>
              <Text style={styles.activityDesc}>{desc}</Text>
            </View>
            <Text style={[styles.activityXpVal, { color: accent }]}>{xp}</Text>
          </View>
        ))}
      </View>
      {/* Bottom spacer — clears the sticky peer bar */}
      <View style={{ height: 24 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0B0F19" : "#FFFFFF"} />

      {/* ── Sticky Top App Bar Container ───────────────────────── */}
      <View style={styles.stickyHeaderContainer}>
        <View style={styles.topHeaderBar}>
          <View style={styles.headerTitleGroup}>
            <TooltipTouchable tooltip="Back" style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <ChevronLeftIcon size={22} color={isDark ? "#F8FAFC" : "#0F172A"} />
            </TooltipTouchable>
            <View>
              <Text style={styles.screenMainTitle}>{t("leaderboard.title", "Leaderboard")}</Text>
              <Text style={styles.screenSubTitle}>
                {ipCountryCode} League
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={styles.countryCodeBadge}>
              <View style={styles.countryCodeIconCircle}>
                <GlobeMiniIcon size={11} color={accentColor} />
              </View>
              <Text style={styles.countryCodeBadgeText}>
                {ipCountryCode}
              </Text>
              <View style={styles.liveBeaconDotWrapper}>
                <View style={styles.liveBeaconGlow} />
                <View style={styles.liveBeaconCore} />
              </View>
            </View>

            <TooltipTouchable
              tooltip="Refresh Leaderboard"
              style={styles.infoIconButton}
              activeOpacity={0.7}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
                <RefreshIcon size={20} color={refreshing ? "#C4B5FD" : (isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF"))} />
              </Animated.View>
            </TooltipTouchable>
          </View>
        </View>

        {/* ── Sticky Timeframe Selector ── */}
        <View style={styles.stickyTimeframeBar}>
          {[
            { id: "Today", label: t("leaderboard.today", "Today") },
            { id: "This Week", label: t("leaderboard.thisWeek", "This Week") },
            { id: "This Month", label: t("leaderboard.thisMonth", "This Month") },
          ].map(({ id, label }) => (
            <TooltipTouchable
              key={id}
              style={[styles.timeframePill, leaderboardTimeframe === id && [styles.timeframePillActive, { backgroundColor: accentColor }]]}
              onPress={() => setLeaderboardTimeframe(id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeframePillText,
                  leaderboardTimeframe === id && styles.timeframePillTextActive,
                ]}
              >
                {label}
              </Text>
            </TooltipTouchable>
          ))}
        </View>
      </View>

      {/* ── Main Scroll Content ────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 20) + 110 },
        ]}
      >
        {renderLeaderboard()}
      </ScrollView>

      {/* ── Contextual Sticky Peer Bar (Only shown when scrolled past top section & userRank > 3) ── */}
      {showStickyPeerBar && (
        <View style={styles.stickyPeerContainer}>
          <View style={styles.stickyPeerTrioRow}>
            {peerTrio.map((peer) => (
              <View
                key={peer.id}
                style={[
                  styles.stickyPeerItem,
                  peer.isCurrentUser && [styles.stickyPeerItemActive, { borderColor: accentColor }, isDark && { backgroundColor: `${accentColor}25` }],
                ]}
              >
                <Text style={[styles.stickyPeerRankNum, peer.isCurrentUser && { color: accentColor }]}>
                  #{peer.rank}
                </Text>
                <Image
                  source={{ uri: (peer.isCurrentUser && user?.avatarUri) ? user.avatarUri : (peer.avatarUri || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80") }}
                  style={styles.stickyPeerAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.stickyPeerNameText} numberOfLines={1}>
                    {peer.isCurrentUser ? "You" : (peer.name ? peer.name.split(" ")[0] : "Scholar")}
                  </Text>
                  <Text style={[styles.stickyPeerXpText, peer.isCurrentUser && { color: accentColor }]}>
                    {peer.xpFormatted || `${(peer.rawXp || peer.baseXp || 0).toLocaleString()} XP`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── XP History Modal ── */}
      <XpHistoryModal
        history={gamification.xpHistory || []}
        visible={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* ── Leadership Challenges Modal Sheet ── */}
      <CustomModal
        visible={isChallengesOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsChallengesOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalSheetContent}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 24 }}>⚡</Text>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: "900", color: isDark ? "#F8FAFC" : "#0F172A" }}>Leadership Challenges</Text>
                    <Text style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B" }}>Complete activities to earn XP and level up</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsChallengesOpen(false)}>
                  <CloseIcon size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12, marginTop: 8 }}>
                {LEADERSHIP_CHALLENGES.map((ch) => {
                  const isClaimed = claimedChallenges[ch.id];

                  return (
                    <View key={ch.id} style={styles.challengeItemCard}>
                      <View style={[styles.challengeIconBg, { backgroundColor: isDark ? `${ch.bg}25` : ch.bg }]}>
                        <Text style={{ fontSize: 24 }}>{ch.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={styles.challengeTitle}>{ch.title}</Text>
                          <Text style={{ fontSize: 12, fontWeight: "900", color: isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF") }}>+{ch.xp} XP</Text>
                        </View>
                        <Text style={styles.challengeSub}>{ch.subtitle}</Text>
                        <Text style={styles.challengeMetric}>{ch.metric}</Text>
                      </View>
                      <View style={{ marginLeft: 8 }}>
                        {isClaimed ? (
                          <View style={styles.claimedPill}>
                            <Text style={styles.claimedPillText}>Claimed ✓</Text>
                          </View>
                        ) : ch.readyToClaim ? (
                          <TouchableOpacity
                            style={[styles.claimBtn, { backgroundColor: accentColor }]}
                            onPress={() => handleClaimChallenge(ch)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.claimBtnText}>Claim</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.inProgPill}>
                            <Text style={styles.inProgPillText}>In Progress</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const baseLeaderboardStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  stickyHeaderContainer: {
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  topHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: "#FFFFFF",
  },
  stickyTimeframeBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
    backgroundColor: "#FFFFFF",
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  screenMainTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  screenSubTitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  infoIconButton: {
    padding: 6,
  },

  // Segmented Tabs
  segmentedTabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  segmentedControlBg: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  segmentTabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 16,
    gap: 6,
  },
  segmentTabBtnActive: {
    backgroundColor: "#6236FF",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  segmentTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionContainer: {
    gap: 16,
  },

  // ── Hero Podium Card ──
  heroCard: {
    backgroundColor: "#FAFBFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: "#EBEBF5",
    overflow: "hidden",
  },
  heroMainTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  heroSubTitle: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },
  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    gap: 0,
    marginTop: 4,
  },
  podiumCol: {
    flex: 1,
    alignItems: "center",
  },
  podiumCrown: {
    fontSize: 18,
    marginBottom: -4,
    textAlign: "center",
  },
  podiumAvatarRing1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "#F59E0B",
    overflow: "hidden",
    marginBottom: 6,
  },
  podiumAvatarRing2: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#94A3B8",
    overflow: "hidden",
    marginBottom: 6,
  },
  podiumAvatarRing3: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#D97706",
    overflow: "hidden",
    marginBottom: 6,
  },
  podiumAvatarImg1: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  podiumAvatarImg2: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  podiumUserName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  podiumXpSmall: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
    marginTop: 1,
    marginBottom: 8,
  },
  podiumPlinth: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 4,
  },
  podiumPlinthNum: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    opacity: 0.12,
  },

  // ── Your Rank Card ──
  yourRankCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    gap: 16,
  },
  yourRankTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  yourRankAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#6236FF",
  },
  yourRankBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#6236FF",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  yourRankBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  yourRankInfoGroup: {
    flex: 1,
  },
  yourRankName: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
  },
  roleTag: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6236FF",
  },
  yourRankXpText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "600",
  },
  yourRankDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  yourRankBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  yourRankTargetText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    flex: 1,
  },
  yourRankProgressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 140,
  },
  yourRankProgressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#F0EEFF",
    borderRadius: 4,
    overflow: "hidden",
  },
  yourRankProgressFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 4,
  },

  // ── Rankings Container ──
  rankingsContainer: {
    gap: 16,
  },
  rankingsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankingsHeaderTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  dropdownButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dropdownButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  rankingsList: {
    gap: 10,
  },
  rankingItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  rankingItemRowActive: {
    backgroundColor: "#FDF4FF",
    borderColor: "#6236FF",
    borderWidth: 2,
    shadowColor: "#6236FF",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  rankingNumberText: {
    minWidth: 36,
    fontSize: 14,
    fontWeight: "900",
    color: "#64748B",
    textAlign: "center",
  },
  rankingNumberActive: {
    color: "#6236FF",
  },
  rankingAvatarBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  rankingDetails: {
    flex: 1,
  },
  rankingNameText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  rankingRoleText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  rankingRoleActive: {
    color: "#6236FF",
    fontWeight: "800",
  },
  rankingXpRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rankingXpValText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#64748B",
  },
  rankingXpValActive: {
    color: "#6236FF",
    fontWeight: "900",
  },

  // ── Earn XP Card ──
  earnCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 20,
  },
  earnCardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  earnItemsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  earnItemCol: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  earnIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  earnItemLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    lineHeight: 16,
  },
  earnActionButton: {
    backgroundColor: "#6236FF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  earnActionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  // ── Achievements Specific Styles ──
  achHeroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  achProgressStatsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 12,
    marginBottom: 8,
  },
  achHeroProgressTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    width: "90%",
    overflow: "hidden",
  },
  achHeroProgressFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 4,
  },

  quickStatsRow: {
    flexDirection: "row",
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quickStatVal: {
    fontSize: 18,
    fontWeight: "900",
  },
  quickStatLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    marginTop: 2,
  },

  filterPillsRow: {
    gap: 10,
    paddingBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  filterPillActive: {
    backgroundColor: "#6236FF",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  achCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 4,
  },
  achCardIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  achCardBody: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 6,
  },
  achHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 2,
  },
  achBadgesGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  xpPill: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  xpPillText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#6236FF",
  },
  achCardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    flexShrink: 1,
  },
  achCardDesc: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 6,
    lineHeight: 18,
  },
  achUnlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F4F0FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  achUnlockedText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6236FF",
  },
  achLockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  achLockedText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
  },
  achProgressWrap: {
    width: "100%",
    marginTop: 4,
  },
  achProgressText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6236FF",
  },
  achProgressBarTrack: {
    height: 5,
    backgroundColor: "#F0EEFF",
    borderRadius: 2.5,
    width: "100%",
    overflow: "hidden",
  },
  achProgressBarFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 2.5,
  },
  achRightCol: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingLeft: 4,
    minWidth: 32,
  },

  // ── Search & Filter Styles ──
  searchBarBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    padding: 0,
  },
  quickStatCardActive: {
    borderColor: "#6236FF",
    borderWidth: 1.5,
    backgroundColor: "#F4F0FF",
  },
  miniTierPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  miniTierText: {
    fontSize: 8.5,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  // ── Empty State ──
  emptyStateBox: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  emptyStateSub: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  emptyResetBtn: {
    marginTop: 8,
    backgroundColor: "#6236FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  emptyResetText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  // ── Achievement Detail Modal Sheet ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    padding: 0,
  },
  modalSheetContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    width: "100%",
    height: "100%",
    paddingTop: 56, // Safe area for top
    paddingBottom: 32, // Safe area for bottom
  },
  modalSheetContent: {
    padding: 24,
    gap: 18,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tierPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tierPillText: {
    fontSize: 10.5,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalHeroIconBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  modalIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
  modalCategoryText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6236FF",
    marginTop: 4,
  },
  modalLoreBox: {
    backgroundColor: "#FDF4FF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2D9FF",
    gap: 8,
  },
  modalDescText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 20,
  },
  modalLoreSub: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    fontWeight: "600",
  },
  modalProgressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  modalProgressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalProgressTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  modalProgressVal: {
    fontSize: 13,
    fontWeight: "900",
  },
  modalProgressTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  modalProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  modalRewardsBox: {
    gap: 12,
  },
  modalRewardsTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  modalRewardRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalRewardItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 6,
  },
  modalRewardText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
  modalActionButton: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  modalActionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  // ── Timeframe Pills ──
  timeframeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  timeframePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  timeframePillActive: {
    backgroundColor: "#6236FF",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timeframePillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  timeframePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  // ── Podium Upgrades ──
  heroHeaderTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  crownGlowWrap: {
    marginBottom: -8,
    zIndex: 20,
  },
  honorRoleTag: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 4,
  },
  honorRoleText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#D97706",
  },
  podiumXpPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 8,
  },
  podiumUserXpText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
  },

  // ── Your Rank Upgrades ──
  yourRankAccentBar: {
    position: "absolute",
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    backgroundColor: "#6236FF",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  xpLogBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F0EEFF",
  },

  // ── Leadership Challenge Sheet Items ──
  challengeItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  challengeIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  challengeSub: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  challengeMetric: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#6236FF",
    marginTop: 4,
  },
  claimBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  claimBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  claimedPill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  claimedPillText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "900",
  },
  inProgPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  inProgPillText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Reset Countdown Badge ──
  countdownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  countdownBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },

  // ── Balanced XP Activities Breakdown ──
  xpBreakdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginTop: 8,
    gap: 2,
  },
  xpBreakdownTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  activityRowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  activityAccentBar: {
    width: 3,
    height: 32,
    borderRadius: 4,
  },
  activityEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  activityDesc: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
    fontWeight: "400",
  },
  activityXpVal: {
    fontSize: 13,
    fontWeight: "800",
  },

  // ── Contextual Sticky Peer Bar (Bottom) ──
  stickyPeerContainer: {
    position: "absolute",
    bottom: 82,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 90,
  },
  stickyPeerTrioRow: {
    flexDirection: "row",
    gap: 6,
  },
  stickyPeerItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  stickyPeerItemActive: {
    backgroundColor: "#F0EEFF",
    borderWidth: 1.5,
    borderColor: "#6236FF",
  },
  stickyPeerRankNum: {
    fontSize: 11,
    fontWeight: "900",
    color: "#64748B",
  },
  stickyPeerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  stickyPeerNameText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  stickyPeerXpText: {
    fontSize: 9.5,
    fontWeight: "900",
    color: "#64748B",
    marginTop: 1,
  },

  // ── Country Grouping & Scope Styles (Premium Card & Badge) ──
  countryCodeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 6,
    paddingRight: 9,
    paddingVertical: 4.5,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "rgba(99, 102, 241, 0.22)",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  countryCodeIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  countryCodeBadgeText: {
    fontSize: 12.5,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 1.2,
  },
  liveBeaconDotWrapper: {
    width: 8,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  liveBeaconGlow: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(16, 185, 129, 0.35)",
  },
  liveBeaconCore: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  bannerCodeBadge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#F5F3FF",
    borderWidth: 1.5,
    borderColor: "rgba(99, 102, 241, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerCodeBadgeText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#6236FF",
    letterSpacing: 0.8,
  },
  countryLeagueBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: "rgba(99, 102, 241, 0.16)",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  countryLeagueBannerTitle: {
    fontSize: 15.5,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  countryLeagueBannerSub: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  countryOnlyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 6.5,
    paddingVertical: 2.5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  countryOnlyBadgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  podiumCityBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  podiumCityText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#64748B",
    textAlign: "center",
  },
  homePillTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  homePillTagText: {
    fontSize: 11,
    fontWeight: "800",
  },
  cityMiniTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  cityMiniTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  countryGroupingNote: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
});

const getLeaderboardStyles = (isDark, activeAccentColor) => {
  if (!isDark && activeAccentColor === "#6236FF") return baseLeaderboardStyles;
  return {
    ...baseLeaderboardStyles,
    root: [
      baseLeaderboardStyles.root,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    stickyHeaderContainer: [
      baseLeaderboardStyles.stickyHeaderContainer,
      isDark && { backgroundColor: "#0B0F19", borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    topHeaderBar: [
      baseLeaderboardStyles.topHeaderBar,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    backButton: [
      baseLeaderboardStyles.backButton,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    infoIconButton: [
      baseLeaderboardStyles.infoIconButton,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent", borderRadius: 18 },
    ],
    screenMainTitle: [
      baseLeaderboardStyles.screenMainTitle,
      isDark && { color: "#F8FAFC" },
    ],
    screenSubTitle: [
      baseLeaderboardStyles.screenSubTitle,
      isDark && { color: "#94A3B8" },
    ],
    stickyTimeframeBar: [
      baseLeaderboardStyles.stickyTimeframeBar,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    timeframePill: [
      baseLeaderboardStyles.timeframePill,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    timeframePillText: [
      baseLeaderboardStyles.timeframePillText,
      isDark && { color: "#94A3B8" },
    ],
    segmentedTabsContainer: [
      baseLeaderboardStyles.segmentedTabsContainer,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    segmentedControlBg: [
      baseLeaderboardStyles.segmentedControlBg,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    segmentTabText: [
      baseLeaderboardStyles.segmentTabText,
      isDark && { color: "#94A3B8" },
    ],
    heroCard: [
      baseLeaderboardStyles.heroCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    heroMainTitle: [
      baseLeaderboardStyles.heroMainTitle,
      isDark && { color: "#F8FAFC" },
    ],
    heroSubTitle: [
      baseLeaderboardStyles.heroSubTitle,
      isDark && { color: "#94A3B8" },
    ],
    podiumUserName: [
      baseLeaderboardStyles.podiumUserName,
      isDark && { color: "#F8FAFC" },
    ],
    podiumXpSmall: [
      baseLeaderboardStyles.podiumXpSmall,
      isDark && { color: "#94A3B8" },
    ],
    yourRankCard: [
      baseLeaderboardStyles.yourRankCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    yourRankName: [
      baseLeaderboardStyles.yourRankName,
      isDark && { color: "#F8FAFC" },
    ],
    yourRankXp: [
      baseLeaderboardStyles.yourRankXp,
      isDark && { color: "#94A3B8" },
    ],
    yourRankXpText: [
      baseLeaderboardStyles.yourRankXpText,
      isDark && { color: "#94A3B8" },
    ],
    yourRankBadge: [
      baseLeaderboardStyles.yourRankBadge,
      isDark && { backgroundColor: `${activeAccentColor}25`, borderWidth: 1, borderColor: `${activeAccentColor}55` },
    ],
    yourRankBadgeText: [
      baseLeaderboardStyles.yourRankBadgeText,
      isDark && { color: activeAccentColor || "#818CF8" },
    ],
    yourRankDivider: [
      baseLeaderboardStyles.yourRankDivider,
      isDark && { backgroundColor: "#334155" },
    ],
    rankingsHeaderTitle: [
      baseLeaderboardStyles.rankingsHeaderTitle,
      isDark && { color: "#F8FAFC" },
    ],
    rankingItemRow: [
      baseLeaderboardStyles.rankingItemRow,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    rankingNumberText: [
      baseLeaderboardStyles.rankingNumberText,
      isDark && { color: "#94A3B8" },
    ],
    rankingAvatarBg: [
      baseLeaderboardStyles.rankingAvatarBg,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    rankingNameText: [
      baseLeaderboardStyles.rankingNameText,
      isDark && { color: "#F8FAFC" },
    ],
    rankingXpValText: [
      baseLeaderboardStyles.rankingXpValText,
      isDark && { color: "#94A3B8" },
    ],
    xpBreakdownCard: [
      baseLeaderboardStyles.xpBreakdownCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    xpBreakdownTitle: [
      baseLeaderboardStyles.xpBreakdownTitle,
      isDark && { color: "#F8FAFC" },
    ],
    activityRowItem: [
      baseLeaderboardStyles.activityRowItem,
      isDark && { borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    activityTitle: [
      baseLeaderboardStyles.activityTitle,
      isDark && { color: "#F8FAFC" },
    ],
    activityDesc: [
      baseLeaderboardStyles.activityDesc,
      isDark && { color: "#94A3B8" },
    ],
    stickyPeerContainer: [
      baseLeaderboardStyles.stickyPeerContainer,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    stickyPeerItem: [
      baseLeaderboardStyles.stickyPeerItem,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    stickyPeerRankNum: [
      baseLeaderboardStyles.stickyPeerRankNum,
      isDark && { color: "#94A3B8" },
    ],
    stickyPeerNameText: [
      baseLeaderboardStyles.stickyPeerNameText,
      isDark && { color: "#F8FAFC" },
    ],
    stickyPeerXpText: [
      baseLeaderboardStyles.stickyPeerXpText,
      isDark && { color: "#94A3B8" },
    ],
    modalBackdrop: [
      baseLeaderboardStyles.modalBackdrop,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    modalSheetContainer: [
      baseLeaderboardStyles.modalSheetContainer,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    modalCloseBtn: [
      baseLeaderboardStyles.modalCloseBtn,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    challengeItemCard: [
      baseLeaderboardStyles.challengeItemCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    challengeTitle: [
      baseLeaderboardStyles.challengeTitle,
      isDark && { color: "#F8FAFC" },
    ],
    challengeSub: [
      baseLeaderboardStyles.challengeSub,
      isDark && { color: "#94A3B8" },
    ],
    inProgPill: [
      baseLeaderboardStyles.inProgPill,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    inProgPillText: [
      baseLeaderboardStyles.inProgPillText,
      isDark && { color: "#94A3B8" },
    ],
    claimedPill: [
      baseLeaderboardStyles.claimedPill,
      isDark && { backgroundColor: "rgba(16, 185, 129, 0.15)" },
    ],
    claimedPillText: [
      baseLeaderboardStyles.claimedPillText,
      isDark && { color: "#34D399" },
    ],
    countryCodeBadge: [
      baseLeaderboardStyles.countryCodeBadge,
      isDark && {
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        borderColor: "rgba(129, 140, 248, 0.35)",
        shadowColor: "#000000",
        shadowOpacity: 0.3,
      },
    ],
    countryCodeBadgeText: [
      baseLeaderboardStyles.countryCodeBadgeText,
      isDark && { color: "#F8FAFC" },
    ],
    countryCodeIconCircle: [
      baseLeaderboardStyles.countryCodeIconCircle,
      isDark && { backgroundColor: `${activeAccentColor}28` },
    ],
    bannerCodeBadge: [
      baseLeaderboardStyles.bannerCodeBadge,
      isDark && {
        backgroundColor: `${activeAccentColor}22`,
        borderColor: `${activeAccentColor}55`,
        shadowColor: "#000000",
      },
    ],
    bannerCodeBadgeText: [
      baseLeaderboardStyles.bannerCodeBadgeText,
      { color: activeAccentColor },
    ],
    countryLeagueBanner: [
      baseLeaderboardStyles.countryLeagueBanner,
      isDark && {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
        shadowColor: "#000000",
      },
    ],
    countryLeagueBannerTitle: [
      baseLeaderboardStyles.countryLeagueBannerTitle,
      isDark && { color: "#F8FAFC" },
    ],
    countryLeagueBannerSub: [
      baseLeaderboardStyles.countryLeagueBannerSub,
      isDark && { color: "#94A3B8" },
    ],
    countryOnlyBadge: [
      baseLeaderboardStyles.countryOnlyBadge,
      isDark && {
        backgroundColor: `${activeAccentColor}25`,
        borderColor: `${activeAccentColor}44`,
      },
    ],
    countryOnlyBadgeText: [
      baseLeaderboardStyles.countryOnlyBadgeText,
      { color: activeAccentColor },
    ],
    countryGroupingNote: [
      baseLeaderboardStyles.countryGroupingNote,
      isDark && { color: "#94A3B8" },
    ],
  };
};

