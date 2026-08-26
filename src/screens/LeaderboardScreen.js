import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import Svg, { Path, Circle, Rect, Polygon } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import { gamificationService } from "../services/gamification/gamificationService";
import { settingsService } from "../services/settings/settingsService";
import { Colors } from "../theme/colors";
import XpHistoryModal from "../components/XpHistoryModal";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ size = 20, color = "#0F172A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const InfoCircleIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
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

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const LEADERBOARD_LIST = [
  { id: "4", rank: 4, name: "Rachel McCoy", role: "Pro", xp: "1,050", avatar: "👩🏽" },
  { id: "5", rank: 5, name: "David Kim", role: "Level 22", xp: "980", avatar: "👨🏻" },
  { id: "6", rank: 6, name: "You", role: "Emerging Leader", xp: "860", avatar: "😎", isCurrentUser: true },
  { id: "7", rank: 7, name: "Jessica Alba", role: "Level 19", xp: "810", avatar: "👩🏼" },
  { id: "8", rank: 8, name: "Roger Jordan", role: "Level 18", xp: "770", avatar: "👨🏽" },
  { id: "9", rank: 9, name: "Joan Young", role: "Level 17", xp: "720", avatar: "👩🏻" },
];

const ACHIEVEMENTS_DATA = [
  { id: "a1", title: "First Step", description: "Completed your first study session", icon: "🏆", bgTint: "#FFF7ED", status: "unlocked" },
  { id: "a2", title: "7 Day Streak", description: "Studied for 7 days in a row", icon: "🔥", bgTint: "#FEF2F2", status: "unlocked" },
  { id: "a3", title: "Knowledge Seeker", description: "Mastered 10 topics", icon: "📚", bgTint: "#EFF6FF", status: "unlocked" },
  { id: "a4", title: "Focus Master", description: "Completed 10 focus sessions", icon: "🎯", bgTint: "#F0FDF4", status: "unlocked" },
  { id: "a5", title: "Consistency Champion", description: "Study for 30 days in a row", icon: "🔥", bgTint: "#F0EEFF", status: "in_progress", progress: 60, progressText: "18 / 30 days" },
  { id: "a6", title: "Study Legend", description: "Master 100 topics", icon: "👑", bgTint: "#F1F5F9", status: "locked" },
];

export default function LeaderboardScreen({ user = { name: "Alex", avatarUri: null }, onBack, onSelectTab }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("leaderboard"); // 'leaderboard' or 'achievements'
  const [filter, setFilter] = useState("All");
  const [gamification, setGamification] = useState(gamificationService.getState());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(settingsService.getSettingsSync());

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

  const accentColor = currentSettings?.accentColor || Colors.accent || "#6236FF";

  const filters = ["All", "Study", "Consistency", "Mastery", "Leadership"];

  const currentLevel = gamification.currentLevel || { level: 1, title: "Beginner", requiredXp: 0 };
  const nextLevel = gamification.nextLevel;
  const breakdown = gamification.breakdown || {};
  const allAchievements = Object.values(gamification.achievements || {});

  const unlockedCount = allAchievements.filter((a) => a.status === "unlocked").length;
  const inProgressCount = allAchievements.filter((a) => a.status === "in_progress").length;
  const lockedCount = allAchievements.filter((a) => a.status === "locked").length;
  const totalCount = allAchievements.length || 1;
  const overallUnlockedPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = allAchievements.filter((a) => {
    if (filter === "All") return true;
    return a.category === filter;
  });

  const renderLeaderboard = () => (
    <View style={styles.sectionContainer}>
      {/* ── Top Hero Podium Card ── */}
      <View style={styles.heroCard}>
        <Text style={styles.heroCapsText}>LEADERSHIP HONORS</Text>
        <Text style={styles.heroMainTitle}>Top Student Leaders</Text>
        <Text style={styles.heroSubTitle}>
          Earn XP, complete academic challenges, and rise through the rankings.
        </Text>

        {/* Podium Stand */}
        <View style={styles.podiumRow}>
          {/* #2 Rank Column */}
          <View style={styles.podiumCol}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarCircle, { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F1F5F9' }]}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#64748B' }}>SM</Text>
              </View>
              <View style={[styles.rankBadgePill, { backgroundColor: "#94A3B8" }]}>
                <Text style={styles.rankBadgeText}>#2</Text>
              </View>
            </View>
            <Text style={styles.podiumUserName}>Sarah M.</Text>
            <Text style={styles.podiumUserXp}>1,280 XP</Text>
            <View style={[styles.podiumBlock, { height: 70, backgroundColor: "#F1F5F9" }]}>
              <Text style={styles.podiumNumText}>2</Text>
            </View>
          </View>

          {/* #1 Rank Column (Center & Taller) */}
          <View style={styles.podiumCol}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarCircle, { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: "#2D62FF", backgroundColor: '#EEF2FF' }]}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#2D62FF' }}>AK</Text>
              </View>
              <View style={[styles.rankBadgePill, { backgroundColor: "#2D62FF" }]}>
                <Text style={styles.rankBadgeText}>#1</Text>
              </View>
            </View>
            <Text style={styles.podiumUserName}>Alex K.</Text>
            <Text style={styles.podiumUserRole}>Honor Roll</Text>
            <Text style={styles.podiumUserXp}>1,450 XP</Text>
            <View style={[styles.podiumBlock, { height: 95, backgroundColor: "rgba(45, 98, 255, 0.12)" }]}>
              <Text style={styles.podiumNumText}>1</Text>
            </View>
          </View>

          {/* #3 Rank Column */}
          <View style={styles.podiumCol}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarCircle, { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F1F5F9' }]}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#64748B' }}>MP</Text>
              </View>
              <View style={[styles.rankBadgePill, { backgroundColor: "#D97706" }]}>
                <Text style={styles.rankBadgeText}>#3</Text>
              </View>
            </View>
            <Text style={styles.podiumUserName}>Michael P.</Text>
            <Text style={styles.podiumUserXp}>1,190 XP</Text>
            <View style={[styles.podiumBlock, { height: 55, backgroundColor: "#F1F5F9" }]}>
              <Text style={styles.podiumNumText}>3</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Your Rank Card ── */}
      <View style={styles.yourRankCard}>
        <View style={styles.yourRankTopRow}>
          <View style={styles.yourRankAvatarWrap}>
            {user?.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={{ width: 44, height: 44, borderRadius: 22 }} />
            ) : (
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#2D62FF', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFFFFF' }}>
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </Text>
              </View>
            )}
            <View style={styles.yourRankBadge}>
              <Text style={styles.yourRankBadgeText}>#6</Text>
            </View>
          </View>

          <View style={styles.yourRankInfoGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.yourRankName}>{user?.name ? `${user.name} (You)` : 'You'}</Text>
              <View style={styles.roleTag}>
                <Text style={styles.roleTagText}>Level {currentLevel.level} • {currentLevel.title}</Text>
              </View>
            </View>
            <Text style={styles.yourRankXpText}><Text style={{ fontWeight: '800', color: '#6236FF' }}>{gamification.totalXp}</Text> XP</Text>
          </View>
        </View>

        <View style={styles.yourRankDivider} />

        <View style={styles.yourRankBottomRow}>
          <Text style={styles.yourRankTargetText}>
            {nextLevel
              ? `Only ${breakdown.xpRemaining} XP to reach Level ${nextLevel.level}!`
              : 'Maximum Level Reached!'}
          </Text>
          <TouchableOpacity onPress={() => setIsHistoryOpen(true)} activeOpacity={0.7}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#6236FF" }}>View XP Log →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Leadership Rankings Section ── */}
      <View style={styles.rankingsContainer}>
        <View style={styles.rankingsHeaderRow}>
          <Text style={styles.rankingsHeaderTitle}>Leadership Rankings</Text>
          <TouchableOpacity style={styles.dropdownButton} activeOpacity={0.7}>
            <Text style={styles.dropdownButtonText}>This Week ⌄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rankingsList}>
          {LEADERBOARD_LIST.map((item) => (
            <View
              key={item.id}
              style={[
                styles.rankingItemRow,
                item.isCurrentUser && styles.rankingItemRowActive,
              ]}
            >
              <Text style={[styles.rankingNumberText, item.isCurrentUser && styles.rankingNumberActive]}>
                {item.rank}
              </Text>
              <View style={styles.rankingAvatarBg}>
                {item.isCurrentUser && user?.avatarUri ? (
                  <Image source={{ uri: user.avatarUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                ) : (
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>{item.name.substring(0, 2).toUpperCase()}</Text>
                )}
              </View>
              <View style={styles.rankingDetails}>
                <Text style={styles.rankingNameText}>{item.isCurrentUser && user?.name ? `${user.name} (You)` : item.name}</Text>
                <Text style={[styles.rankingRoleText, item.isCurrentUser && styles.rankingRoleActive]}>
                  {item.role}
                </Text>
              </View>
              <View style={styles.rankingXpRight}>
                <Text style={[styles.rankingXpValText, item.isCurrentUser && styles.rankingXpValActive]}>
                  {item.isCurrentUser ? `${gamification.totalXp} XP` : `${item.xp} XP`}
                </Text>
                <StarIcon size={14} color="#F59E0B" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── How to Earn Leadership XP Card ── */}
      <View style={styles.earnCard}>
        <Text style={styles.earnCardTitle}>How to Earn Leadership XP</Text>

        <View style={styles.earnItemsRow}>
          <View style={styles.earnItemCol}>
            <View style={[styles.earnIconCircle, { backgroundColor: '#F0EEFF' }]}>
              <UsersIcon size={20} color="#6236FF" />
            </View>
            <Text style={styles.earnItemLabel}>Lead a{"\n"}Study Group</Text>
          </View>

          <View style={styles.earnItemCol}>
            <View style={[styles.earnIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <HandshakeIcon size={20} color="#10B981" />
            </View>
            <Text style={styles.earnItemLabel}>Help Other{"\n"}Students</Text>
          </View>

          <View style={styles.earnItemCol}>
            <View style={[styles.earnIconCircle, { backgroundColor: '#FFF7ED' }]}>
              <TargetIcon size={20} color="#F59E0B" />
            </View>
            <Text style={styles.earnItemLabel}>Complete{"\n"}Challenges</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.earnActionButton, { backgroundColor: accentColor }]} activeOpacity={0.8}>
          <Text style={styles.earnActionButtonText}>View Leadership Challenges →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.sectionContainer}>
      {/* ── Top Level & Achievement Hero Banner ── */}
      <View style={styles.heroCard}>
        <View style={styles.achHeroContent}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <View style={{ backgroundColor: "#6236FF", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: "900", color: "#FFFFFF" }}>LEVEL {currentLevel.level}</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#6236FF" }}>{currentLevel.title}</Text>
            </View>
            
            <Text style={styles.heroMainTitle}>Your Achievement Journey</Text>
            <Text style={styles.heroSubTitle}>
              {nextLevel
                ? `${gamification.totalXp.toLocaleString()} / ${nextLevel.requiredXp.toLocaleString()} XP (${breakdown.xpRemaining} XP until Level ${nextLevel.level})`
                : `${gamification.totalXp.toLocaleString()} Total XP (Max Level Reached)`}
            </Text>

            <View style={styles.achProgressStatsRow}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#6236FF' }}>{unlockedCount}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569' }}>/ {totalCount} Unlocked</Text>
            </View>

            <View style={styles.achHeroProgressTrack}>
              <View style={[styles.achHeroProgressFill, { width: `${breakdown.percent || overallUnlockedPercent}%` }]} />
            </View>
            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
              {totalCount - unlockedCount} achievements remaining
            </Text>
          </View>
          <TouchableOpacity
            style={{ width: 64, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => setIsHistoryOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 44 }}>🏆</Text>
            <Text style={{ fontSize: 10, fontWeight: "800", color: "#6236FF", marginTop: 2 }}>XP Log</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Next Level Requirements Checklist ── */}
      {nextLevel && breakdown.checklist && (
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: "#0F172A" }}>
              Next Level Requirements (Level {nextLevel.level} — {nextLevel.title})
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#6236FF" }}>{breakdown.percent}%</Text>
          </View>

          <View style={{ gap: 6 }}>
            {breakdown.checklist.map((item) => (
              <View key={item.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 13, color: item.met ? "#10B981" : "#94A3B8", fontWeight: "800" }}>
                    {item.met ? "✓" : "✕"}
                  </Text>
                  <Text style={{ fontSize: 12.5, fontWeight: "600", color: item.met ? "#0F172A" : "#64748B" }}>
                    {item.label}
                  </Text>
                </View>
                <Text style={{ fontSize: 11.5, fontWeight: "700", color: item.met ? "#10B981" : "#6236FF" }}>
                  {item.current} / {item.target}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── Quick Stats Row ── */}
      <View style={styles.quickStatsRow}>
        <View style={styles.quickStatCard}>
          <View style={[styles.quickStatIcon, { backgroundColor: '#F0EEFF' }]}>
            <TrophyTabIcon size={14} color="#6236FF" />
          </View>
          <View>
            <Text style={[styles.quickStatVal, { color: '#6236FF' }]}>{unlockedCount}</Text>
            <Text style={styles.quickStatLabel}>Unlocked</Text>
          </View>
        </View>

        <View style={styles.quickStatCard}>
          <View style={[styles.quickStatIcon, { backgroundColor: '#FFF7ED' }]}>
            <ClockIcon size={14} color="#F59E0B" />
          </View>
          <View>
            <Text style={[styles.quickStatVal, { color: '#F59E0B' }]}>{inProgressCount}</Text>
            <Text style={styles.quickStatLabel}>In Progress</Text>
          </View>
        </View>

        <View style={styles.quickStatCard}>
          <View style={[styles.quickStatIcon, { backgroundColor: '#F1F5F9' }]}>
            <LockMiniIcon size={14} color="#64748B" />
          </View>
          <View>
            <Text style={[styles.quickStatVal, { color: '#64748B' }]}>{lockedCount}</Text>
            <Text style={styles.quickStatLabel}>Locked</Text>
          </View>
        </View>
      </View>

      {/* ── Filter Pills ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterPillText, filter === f && styles.filterPillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Achievement Cards List ── */}
      <View style={{ gap: 12 }}>
        {filteredAchievements.map((ach) => {
          const isUnlocked = ach.status === "unlocked";
          const isInProgress = ach.status === "in_progress";
          const isLocked = ach.status === "locked";
          const progressPercent = Math.round((ach.currentProgress / Math.max(1, ach.requiredProgress)) * 100);

          return (
            <View key={ach.id} style={[styles.achCard, isLocked && { opacity: 0.85 }]}>
              <View style={[styles.achCardIconBg, { backgroundColor: ach.bgTint || "#F1F5F9" }]}>
                <Text style={{ fontSize: 24 }}>{ach.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={styles.achCardTitle}>{ach.name}</Text>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: "#6236FF" }}>+{ach.xpReward} XP</Text>
                </View>
                <Text style={styles.achCardDesc}>{ach.description}</Text>

                {isUnlocked && (
                  <View style={styles.achUnlockedBadge}>
                    <StarIcon size={11} color="#6236FF" />
                    <Text style={styles.achUnlockedText}>
                      Unlocked {ach.unlockDate ? `• ${new Date(ach.unlockDate).toLocaleDateString()}` : ''}
                    </Text>
                  </View>
                )}

                {isInProgress && (
                  <View style={{ width: '90%', marginTop: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#6236FF', marginBottom: 3 }}>
                      {ach.currentProgress} / {ach.requiredProgress}
                    </Text>
                    <View style={styles.achProgressBarTrack}>
                      <View style={[styles.achProgressBarFill, { width: `${progressPercent}%` }]} />
                    </View>
                  </View>
                )}

                {isLocked && (
                  <View style={styles.achLockedBadge}>
                    <LockMiniIcon size={11} color="#64748B" />
                    <Text style={styles.achLockedText}>
                      {ach.isFeatureLocked ? "Feature challenge coming soon" : `Reach ${ach.requiredProgress} to unlock`}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ marginLeft: 8 }}>
                {isUnlocked && <CheckCircleIcon />}
                {isInProgress && <CircularProgress size={38} progress={progressPercent} color="#6236FF" />}
                {isLocked && <LockCircleIcon />}
              </View>
            </View>
          );
        })}
      </View>

      <XpHistoryModal
        history={gamification.xpHistory || []}
        visible={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top App Bar ────────────────────────────────────────── */}
      <View style={styles.topHeaderBar}>
        <View style={styles.headerTitleGroup}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <ChevronLeftIcon size={22} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.screenMainTitle}>Leadership</Text>
            <Text style={styles.screenSubTitle}>Lead, inspire, and grow together</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.infoIconButton} activeOpacity={0.7}>
          <InfoCircleIcon size={20} color="#6236FF" />
        </TouchableOpacity>
      </View>

      {/* ── Segmented Tab Switcher ────────────────────────────── */}
      <View style={styles.segmentedTabsContainer}>
        <View style={styles.segmentedControlBg}>
          <TouchableOpacity
            style={[styles.segmentTabBtn, activeTab === "achievements" && [styles.segmentTabBtnActive, { backgroundColor: accentColor, shadowColor: accentColor }]]}
            onPress={() => setActiveTab("achievements")}
            activeOpacity={0.8}
          >
            {activeTab === "achievements" && <MedalTabIcon size={16} color="#FFFFFF" />}
            <Text style={[styles.segmentTabText, activeTab === "achievements" && styles.segmentTabTextActive]}>
              Achievements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentTabBtn, activeTab === "leaderboard" && [styles.segmentTabBtnActive, { backgroundColor: accentColor, shadowColor: accentColor }]]}
            onPress={() => setActiveTab("leaderboard")}
            activeOpacity={0.8}
          >
            {activeTab === "leaderboard" && <TrophyTabIcon size={16} color="#FFFFFF" />}
            <Text style={[styles.segmentTabText, activeTab === "leaderboard" && styles.segmentTabTextActive]}>
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Scroll Content ────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
      >
        {activeTab === "leaderboard" ? renderLeaderboard() : renderAchievements()}
      </ScrollView>

      {/* ── Bottom Navigation Bar ─────────────────────────────── */}
      <BottomNavBar activeTab="home" onSelectTab={onSelectTab} />
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
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
    backgroundColor: "#FDF4FF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3E8FF",
  },
  heroCapsText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6236FF",
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroMainTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroSubTitle: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 16,
  },
  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    marginTop: 4,
  },
  podiumCol: {
    flex: 1,
    alignItems: "center",
  },
  crownIconText: {
    fontSize: 20,
    marginBottom: -6,
    zIndex: 10,
  },
  avatarWrapper: {
    alignItems: "center",
    position: "relative",
    marginBottom: 6,
  },
  avatarCircle: {
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  rankBadgePill: {
    position: "absolute",
    bottom: -6,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  rankBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  podiumUserName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },
  podiumUserRole: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6236FF",
    marginTop: 1,
  },
  podiumUserXp: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 2,
    marginBottom: 6,
  },
  podiumBlock: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  podiumNumText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#C4B5FD",
    opacity: 0.6,
  },

  // ── Your Rank Card ──
  yourRankCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  yourRankTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  yourRankAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  yourRankBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#6236FF",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  yourRankBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  yourRankInfoGroup: {
    flex: 1,
  },
  yourRankName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  roleTag: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6236FF",
  },
  yourRankXpText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
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
    fontSize: 11,
    color: "#64748B",
    flex: 1,
  },
  yourRankProgressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 120,
  },
  yourRankProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#F0EEFF",
    borderRadius: 3,
    overflow: "hidden",
  },
  yourRankProgressFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 3,
  },

  // ── Rankings Container ──
  rankingsContainer: {
    gap: 12,
  },
  rankingsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankingsHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  dropdownButton: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dropdownButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },
  rankingsList: {
    gap: 8,
  },
  rankingItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 12,
  },
  rankingItemRowActive: {
    backgroundColor: "#FDF4FF",
    borderColor: "#E2D9FF",
    borderWidth: 1.5,
  },
  rankingNumberText: {
    width: 20,
    fontSize: 14,
    fontWeight: "800",
    color: "#64748B",
    textAlign: "center",
  },
  rankingNumberActive: {
    color: "#6236FF",
  },
  rankingAvatarBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  rankingDetails: {
    flex: 1,
  },
  rankingNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  rankingRoleText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  rankingRoleActive: {
    color: "#6236FF",
    fontWeight: "700",
  },
  rankingXpRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rankingXpValText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  rankingXpValActive: {
    color: "#6236FF",
    fontWeight: "800",
  },

  // ── Earn XP Card ──
  earnCard: {
    backgroundColor: "#FDF4FF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3E8FF",
    gap: 16,
  },
  earnCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  earnItemsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  earnItemCol: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  earnIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  earnItemLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "center",
    lineHeight: 14,
  },
  earnActionButton: {
    backgroundColor: "#6236FF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  earnActionButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
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
    gap: 4,
    marginTop: 8,
    marginBottom: 6,
  },
  achHeroProgressTrack: {
    height: 6,
    backgroundColor: "#E2D9FF",
    borderRadius: 3,
    width: "85%",
  },
  achHeroProgressFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 3,
  },

  quickStatsRow: {
    flexDirection: "row",
    gap: 10,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickStatVal: {
    fontSize: 15,
    fontWeight: "900",
  },
  quickStatLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#64748B",
  },

  filterPillsRow: {
    gap: 8,
    paddingBottom: 2,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  filterPillActive: {
    backgroundColor: "#6236FF",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  achCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 12,
  },
  achCardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  achCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  achCardDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 6,
  },
  achUnlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  achUnlockedText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6236FF",
  },
  achLockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  achLockedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  achProgressBarTrack: {
    height: 5,
    backgroundColor: "#F0EEFF",
    borderRadius: 2.5,
    width: "100%",
  },
  achProgressBarFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 2.5,
  },
});
