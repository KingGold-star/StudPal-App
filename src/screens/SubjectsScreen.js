import React, { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import Modal from "../components/CustomModal";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import TooltipTouchable from "../components/TooltipTouchable";
import { gamificationService } from "../services/gamification/gamificationService";
import { settingsService } from "../services/settings/settingsService";
import { studyService } from "../services/studyService";
import { useTranslation } from "../services/i18n/i18nService";
import { Colors } from "../theme/colors";
import { useTheme } from "../theme/themeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const SearchIcon = ({ color = "#94A3B8", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const PlusIcon = ({ color = "#FFFFFF", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14" />
    <Path d="M5 12h14" />
  </Svg>
);

const CloseIcon = ({ color = "#64748B", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18" />
    <Path d="M6 6l12 12" />
  </Svg>
);

const FolderIcon = ({ color = "#6236FF", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Svg>
);

const ChevronLeftIcon = ({ color = "#0F172A", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const ChevronRightIcon = ({ color = "#94A3B8", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const MoreVerticalIcon = ({ color = "#94A3B8", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="1" />
    <Circle cx="12" cy="5" r="1" />
    <Circle cx="12" cy="19" r="1" />
  </Svg>
);

const MoreHorizontalIcon = ({ color = "#94A3B8", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="1" />
    <Circle cx="5" cy="12" r="1" />
    <Circle cx="19" cy="12" r="1" />
  </Svg>
);

// ─── CIRCULAR PROGRESS RING ──────────────────────────────────────────────────
const CircularProgressRing = ({ percentage = 0, size = 48, strokeWidth = 4, color = "#6236FF", trackColor, textColor }) => {
  const { isDark } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  const finalTrackColor = trackColor || (isDark ? "rgba(255, 255, 255, 0.12)" : "#E2E8F0");
  const finalTextColor = textColor || (isDark ? "#F8FAFC" : "#1E293B");

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finalTrackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={{ position: "absolute", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 11, fontWeight: "800", color: finalTextColor }}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

// Stat Icons
const BookIcon = ({ color = "#6236FF", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Svg>
);

const CheckCircleIcon = ({ color = "#10B981", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

const TargetIcon = ({ color = "#2D62FF", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const ClockIcon = ({ color = "#3B82F6", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const StarIcon = ({ color = "#6236FF", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

// Filter Pills Icons
const GridIcon = ({ color = "#6236FF", size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="14" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
  </Svg>
);

const LearningBookIcon = ({ color = "#10B981", size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Svg>
);

const ReviewClockIcon = ({ color = "#F97316", size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const MasteredStarIcon = ({ color = "#3B82F6", size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

// ─── INITIAL SUBJECTS DATA ───────────────────────────────────────────────────
const INITIAL_SUBJECTS = [
  {
    id: "math",
    name: "Mathematics",
    topicsCount: 28,
    lastStudied: "Last studied today",
    mastery: 85,
    status: "Learning",
    iconEmoji: "⚛️",
    color: "#6236FF",
    bg: "#F0EEFF",
    topics: [
      { id: "m1", name: "Limits & Continuity", mastery: 95, status: "Mastered" },
      { id: "m2", name: "Derivatives & Chain Rule", mastery: 88, status: "Learning" },
      { id: "m3", name: "Integration by Parts", mastery: 72, status: "Review" },
      { id: "m4", name: "Differential Equations", mastery: 85, status: "Mastered" },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    topicsCount: 24,
    lastStudied: "Last studied yesterday",
    mastery: 76,
    status: "Learning",
    iconEmoji: "🧪",
    color: "#10B981",
    bg: "#E8FDF0",
    topics: [
      { id: "p1", name: "Kinematics & Motion", mastery: 90, status: "Mastered" },
      { id: "p2", name: "Newton's Laws & Dynamics", mastery: 82, status: "Learning" },
      { id: "p3", name: "Electromagnetism & Flux", mastery: 65, status: "Review" },
      { id: "p4", name: "Thermodynamics", mastery: 70, status: "Learning" },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    topicsCount: 22,
    lastStudied: "Last studied 2 days ago",
    mastery: 68,
    status: "Review",
    iconEmoji: "🧫",
    color: "#F97316",
    bg: "#FFF3E8",
    topics: [
      { id: "c1", name: "Atomic Structure & Bonding", mastery: 85, status: "Mastered" },
      { id: "c2", name: "Stoichiometry & Reactions", mastery: 74, status: "Learning" },
      { id: "c3", name: "Organic Chemistry Mechanisms", mastery: 55, status: "Review" },
      { id: "c4", name: "Chemical Equilibrium", mastery: 60, status: "Review" },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    topicsCount: 18,
    lastStudied: "Last studied today",
    mastery: 80,
    status: "Learning",
    iconEmoji: "🧬",
    color: "#3B82F6",
    bg: "#EBF5FF",
    topics: [
      { id: "b1", name: "Cellular Respiration & ATP", mastery: 88, status: "Mastered" },
      { id: "b2", name: "Genetics & DNA Replication", mastery: 80, status: "Learning" },
      { id: "b3", name: "Ecology & Ecosystems", mastery: 75, status: "Learning" },
    ],
  },
  {
    id: "english",
    name: "English Language",
    topicsCount: 16,
    lastStudied: "Last studied 3 days ago",
    mastery: 62,
    status: "Review",
    iconEmoji: "📖",
    color: "#EC4899",
    bg: "#FDF2F8",
    topics: [
      { id: "e1", name: "Grammar & Syntax Rules", mastery: 75, status: "Learning" },
      { id: "e2", name: "Essays & Argumentation", mastery: 60, status: "Review" },
      { id: "e3", name: "Literary Devices & Analysis", mastery: 50, status: "Review" },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    topicsCount: 20,
    lastStudied: "Last studied yesterday",
    mastery: 90,
    status: "Mastered",
    iconEmoji: "💻",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    topics: [
      { id: "cs1", name: "Data Structures & Algorithms", mastery: 94, status: "Mastered" },
      { id: "cs2", name: "Object-Oriented Programming", mastery: 92, status: "Mastered" },
      { id: "cs3", name: "Database Design & SQL", mastery: 85, status: "Learning" },
    ],
  },
];

// Helper to map study service subjects to SubjectsScreen format
const mapStudySubjectsToView = (studySubjects) => {
  if (!Array.isArray(studySubjects) || studySubjects.length === 0) return INITIAL_SUBJECTS;
  return studySubjects.map((s) => {
    const topics = s.topics || [];
    const avgMastery = topics.length > 0
      ? Math.round(topics.reduce((acc, t) => acc + (t.mastery || 70), 0) / topics.length)
      : (s.mastery || 75);
    const status = s.status || (avgMastery >= 85 ? "Mastered" : avgMastery < 70 ? "Review" : "Learning");
    return {
      id: s.id,
      name: s.name,
      topicsCount: s.topicsCount || (topics.length ? topics.length * 4 : 16),
      lastStudied: s.lastStudied || "Last studied today",
      mastery: avgMastery,
      status,
      iconEmoji: s.iconEmoji || "📚",
      color: s.color || "#6236FF",
      bg: s.bg || "#F0EEFF",
      topics: topics.map((t) => ({
        id: t.id,
        name: t.name,
        mastery: t.mastery || 75,
        status: (t.mastery || 75) >= 85 ? "Mastered" : (t.mastery || 75) < 70 ? "Review" : "Learning",
      })),
    };
  });
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function SubjectsScreen({ user, userSubjects, settings, onSelectTab, onNavigate, onBack }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [currentSettings, setCurrentSettings] = useState(settings || settingsService.getSettingsSync());

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setCurrentSettings(s));
    return () => unsub();
  }, []);

  const { isDark, accentColor: themeAccentColor } = useTheme();
  const accentColor = themeAccentColor || (currentSettings && currentSettings.accentColor) || Colors.accent || "#6236FF";
  const styles = useMemo(() => getSubjectsStyles(isDark, accentColor), [isDark, accentColor]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState("All Subjects");
  const [sortOption, setSortOption] = useState("Progress");

  // Dynamic Subjects List synchronized with user's selected subjects
  const [subjectsList, setSubjectsList] = useState(() => {
    const activeSubjs = userSubjects || user?.subjects;
    if (Array.isArray(activeSubjs) && activeSubjs.length > 0) {
      studyService.syncUserSubjects(activeSubjs);
    }
    return mapStudySubjectsToView(studyService.getSubjects());
  });

  useEffect(() => {
    const activeSubjs = userSubjects || user?.subjects;
    if (Array.isArray(activeSubjs) && activeSubjs.length > 0) {
      studyService.syncUserSubjects(activeSubjs);
      setSubjectsList(mapStudySubjectsToView(studyService.getSubjects()));
    }
  }, [userSubjects, user?.subjects]);

  // Modals Visibility
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSortModalOpen, setSortModalOpen] = useState(false);
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);
  const [selectedOptionsMenuSubject, setSelectedOptionsMenuSubject] = useState(null);

  // Add Subject Form State
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCategory, setNewSubjectCategory] = useState("Learning");
  const [newSubjectTopicsCount, setNewSubjectTopicsCount] = useState("15");
  const [newSubjectEmoji, setNewSubjectEmoji] = useState("📚");

  // Calculate Overall Progress Stats
  const totalSubjectsCount = subjectsList.length;
  const overallAvgMastery = Math.round(
    subjectsList.reduce((acc, s) => acc + s.mastery, 0) / (totalSubjectsCount || 1)
  );
  const totalTopicsLearned = subjectsList.reduce((acc, s) => acc + s.topicsCount, 0);

  // Filter & Sort Logic
  const filteredSubjects = useMemo(() => {
    return subjectsList
      .filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTabFilter === "All Subjects") return matchesSearch;
        if (activeTabFilter === "Learning") return matchesSearch && s.status === "Learning";
        if (activeTabFilter === "Review") return matchesSearch && (s.status === "Review" || s.mastery < 70);
        if (activeTabFilter === "Mastered") return matchesSearch && (s.status === "Mastered" || s.mastery >= 85);
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortOption === "Progress") return b.mastery - a.mastery;
        if (sortOption === "Name (A-Z)") return a.name.localeCompare(b.name);
        if (sortOption === "Topics Count") return b.topicsCount - a.topicsCount;
        return 0;
      });
  }, [subjectsList, searchQuery, activeTabFilter, sortOption]);

  const handleAddSubjectSubmit = () => {
    if (!newSubjectName.trim()) {
      Alert.alert("Subject Name Required", "Please enter a valid subject name.");
      return;
    }
    const newSubject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      topicsCount: parseInt(newSubjectTopicsCount) || 12,
      lastStudied: "Added just now",
      mastery: 50,
      status: newSubjectCategory,
      iconEmoji: newSubjectEmoji || "📚",
      color: "#6236FF",
      bg: "#F0EEFF",
      topics: [
        { id: "t1", name: "Introduction & Foundations", mastery: 50, status: "Learning" },
        { id: "t2", name: "Core Principles & Formulas", mastery: 40, status: "Learning" },
      ],
    };
    setSubjectsList([newSubject, ...subjectsList]);
    setAddModalOpen(false);
    setNewSubjectName("");
    gamificationService.awardXp("ADD_SUBJECT", 10, `Added Subject: ${newSubject.name}`, `add_subject_${newSubject.id}`);
    Alert.alert("Subject Created! 🎉", `${newSubject.name} has been added to your curriculum.`);
  };

  const handleDeleteSubject = (id, name) => {
    setSelectedOptionsMenuSubject(null);
    Alert.alert("Delete Subject", `Are you sure you want to remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setSubjectsList((prev) => prev.filter((s) => s.id !== id));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0B0F19" : "#FFFFFF"} />

      {/* ── Top Page Header ───────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <TooltipTouchable
          tooltip="Back to Study"
          style={styles.backBtn}
          onPress={() => {
            if (onNavigate) onNavigate("study");
            else if (onBack) onBack();
            else if (onSelectTab) onSelectTab("study");
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeftIcon size={22} color={isDark ? "#F8FAFC" : "#0F172A"} />
        </TooltipTouchable>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.pageTitle}>{t("subjects.title")}</Text>
          <Text style={styles.pageSubtitle}>Manage your workspace & track topic mastery</Text>
        </View>
        <TooltipTouchable
          tooltip="Add New Subject"
          style={[styles.plusBtn, { backgroundColor: accentColor, shadowColor: accentColor }]}
          onPress={() => setAddModalOpen(true)}
          activeOpacity={0.85}
        >
          <PlusIcon size={20} color="#FFFFFF" />
        </TooltipTouchable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}
      >
        {/* ── Search Bar Input ────────────────────────────────────────── */}
        <View style={styles.searchBarContainer}>
          <SearchIcon size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("subjects.searchSubjects")}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <CloseIcon size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Overall Progress Hero Card ───────────────────────────────── */}
        <View style={styles.overallCard}>
          <View style={styles.overallTopRow}>
            <View style={styles.overallTitleGroup}>
              <View style={styles.folderIconBox}>
                <FolderIcon size={20} color={isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF")} />
              </View>
              <View>
                <Text style={styles.overallTitle}>Overall Progress</Text>
                <Text style={styles.overallSubtitle}>Across all subjects</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.overallPctText}>{overallAvgMastery}%</Text>
              <Text style={styles.overallPctLabel}>Average Mastery</Text>
            </View>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.overallTrack}>
            <View style={[styles.overallFill, { width: `${overallAvgMastery}%`, backgroundColor: accentColor }]} />
          </View>

          {/* 4 Overview Stat Items */}
          <View style={styles.overallStatsRow}>
            <View style={styles.statCol}>
              <BookIcon color={isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF")} size={15} />
              <Text style={styles.statColVal}>{totalSubjectsCount}</Text>
              <Text style={styles.statColLab}>Subjects</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <CheckCircleIcon color="#10B981" size={15} />
              <Text style={styles.statColVal}>{totalTopicsLearned}</Text>
              <Text style={styles.statColLab}>Topics Learned</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <TargetIcon color={isDark ? "#60A5FA" : "#2D62FF"} size={15} />
              <Text style={styles.statColVal}>78%</Text>
              <Text style={styles.statColLab}>Goal Completion</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <ClockIcon color={isDark ? "#38BDF8" : "#3B82F6"} size={15} />
              <Text style={styles.statColVal}>14h 32m</Text>
              <Text style={styles.statColLab}>Study Time</Text>
            </View>
          </View>
        </View>

        {/* ── Filter Pills Bar ────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
          {[
            { id: "All Subjects", label: "All Subjects", Icon: GridIcon, activeColor: accentColor || "#6236FF", activeBg: "#F0EEFF", darkBg: `${accentColor || "#6236FF"}25` },
            { id: "Learning", label: "Learning", Icon: LearningBookIcon, activeColor: "#10B981", activeBg: "#E8FDF0", darkBg: "rgba(16, 185, 129, 0.2)" },
            { id: "Review", label: "Review", Icon: ReviewClockIcon, activeColor: "#F97316", activeBg: "#FFF3E8", darkBg: "rgba(249, 115, 22, 0.2)" },
            { id: "Mastered", label: "Mastered", Icon: MasteredStarIcon, activeColor: "#3B82F6", activeBg: "#EBF5FF", darkBg: "rgba(59, 130, 246, 0.2)" },
          ].map((tab) => {
            const isActive = activeTabFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.pillBtn,
                  isActive && (isDark
                    ? { backgroundColor: tab.darkBg, borderColor: tab.activeColor }
                    : { backgroundColor: tab.activeBg, borderColor: tab.activeBg }
                  ),
                ]}
                onPress={() => setActiveTabFilter(tab.id)}
                activeOpacity={0.75}
              >
                <tab.Icon size={15} color={isActive ? tab.activeColor : (isDark ? "#94A3B8" : "#64748B")} />
                <Text style={[styles.pillText, isActive && { color: tab.activeColor, fontWeight: "800" }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Section Header & Sort Option ────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Subjects ({filteredSubjects.length})</Text>
          <TouchableOpacity
            style={styles.sortDropdownBtn}
            onPress={() => setSortModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.sortDropdownText}>Sort by: {sortOption}</Text>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF")} strokeWidth="2.5" strokeLinecap="round">
              <Path d="M6 9l6 6 6-6" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* ── Your Subjects Grid ──────────────────────────────────────── */}
        <View style={styles.gridContainer}>
          {filteredSubjects.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridCard}
              onPress={() => setSelectedSubjectDetail(item)}
              activeOpacity={0.8}
            >
              {/* Top Row: Progress Ring & 3-Dots Menu */}
              <View style={styles.gridCardTopRow}>
                <CircularProgressRing
                  percentage={item.mastery}
                  color={item.color}
                  size={48}
                  strokeWidth={4}
                />
                <TouchableOpacity
                  style={styles.gridOptionsBtn}
                  onPress={() => setSelectedOptionsMenuSubject(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MoreHorizontalIcon size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Subject Title & Meta */}
              <View style={styles.gridCardBody}>
                <Text style={styles.gridSubjectName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.gridSubjectSubText}>
                  {item.topicsCount} flashcards
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {filteredSubjects.length === 0 && (
            <View style={styles.emptyContainerGrid}>
              <Text style={{ fontSize: 32, marginBottom: 6 }}>🔍</Text>
              <Text style={styles.emptyTitle}>No Subjects Found</Text>
              <Text style={styles.emptySub}>Try adjusting your search or tab filter.</Text>
            </View>
          )}
        </View>

        {/* ── "Add New Subject" Dashed Bottom Card ───────────────────────────── */}
        <TouchableOpacity
          style={styles.addDashedCardBtn}
          onPress={() => setAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <PlusIcon size={18} color={isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF")} />
          <Text style={styles.addDashedCardText}>Add New Subject</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Nested Screen - Access via Home Header Back Button */}

      {/* ── 1. ADD NEW SUBJECT MODAL ──────────────────────────────────── */}
      <Modal visible={isAddModalOpen} animationType="slide" transparent onRequestClose={() => setAddModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.dragHandle} />
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Add New Subject</Text>
              <TouchableOpacity onPress={() => setAddModalOpen(false)} style={styles.closeBtnCircle}>
                <CloseIcon size={18} color={isDark ? "#94A3B8" : "#64748B"} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Subject Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Organic Chemistry, Microeconomics"
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                value={newSubjectName}
                onChangeText={setNewSubjectName}
              />

              <Text style={styles.inputLabel}>Estimated Topics Count</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="15"
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                keyboardType="numeric"
                value={newSubjectTopicsCount}
                onChangeText={setNewSubjectTopicsCount}
              />
            </View>

            <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: accentColor }]} onPress={handleAddSubjectSubmit}>
              <Text style={styles.modalActionBtnText}>Create Subject</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── 2. SUBJECT TOPICS MASTERY DRAWER MODAL ────────────────────── */}
      <Modal visible={!!selectedSubjectDetail} animationType="slide" transparent onRequestClose={() => setSelectedSubjectDetail(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.dragHandle} />
            {selectedSubjectDetail && (
              <View>
                <View style={styles.modalSheetHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View>
                      <Text style={styles.modalSheetTitle}>{selectedSubjectDetail.name}</Text>
                      <Text style={styles.modalSheetSub}>
                        {selectedSubjectDetail.topicsCount} Topics • {selectedSubjectDetail.mastery}% Overall Mastery
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedSubjectDetail(null)} style={styles.closeBtnCircle}>
                    <CloseIcon size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputLabel, { marginTop: 10, marginBottom: 8 }]}>Topics Breakdown & SRS Status</Text>

                <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
                  {selectedSubjectDetail.topics.map((t) => (
                    <View key={t.id} style={styles.topicDrawerCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.topicDrawerName}>{t.name}</Text>
                        <View style={styles.topicDrawerMeta}>
                          <Text style={{ fontSize: 11, color: isDark ? "#94A3B8" : "#64748B" }}>Mastery: {t.mastery}%</Text>
                          <Text style={[styles.topicBadgeText, t.status === "Mastered" ? { color: "#10B981" } : { color: isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF") }]}>
                            ● {t.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.modalActionBtn, { backgroundColor: accentColor }]}
                  onPress={() => {
                    setSelectedSubjectDetail(null);
                    if (onSelectTab) onSelectTab("aicoach");
                  }}
                >
                  <Text style={styles.modalActionBtnText}>Start AI Practice Session</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ── 3. SORT SELECTOR MODAL ────────────────────────────────────── */}
      <Modal visible={isSortModalOpen} animationType="fade" transparent onRequestClose={() => setSortModalOpen(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.sortModalCard}>
            <Text style={styles.modalSheetTitle}>Sort Subjects By</Text>
            {["Progress", "Name (A-Z)", "Topics Count"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.sortOptionRow,
                  sortOption === opt && (isDark ? { backgroundColor: `${accentColor}25`, borderWidth: 1, borderColor: `${accentColor}55` } : styles.sortOptionSelected),
                ]}
                onPress={() => {
                  setSortOption(opt);
                  setSortModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === opt && { color: isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF"), fontWeight: "800" },
                  ]}
                >
                  {opt}
                </Text>
                {sortOption === opt && <Text style={{ color: isDark ? (accentColor || "#818CF8") : (accentColor || "#6236FF"), fontWeight: "800" }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ── 4. SUBJECT 3-DOTS OPTIONS MENU MODAL ──────────────────────── */}
      <Modal visible={!!selectedOptionsMenuSubject} animationType="slide" transparent onRequestClose={() => setSelectedOptionsMenuSubject(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.dragHandle} />
            
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={styles.modalSheetTitle}>
                  {selectedOptionsMenuSubject?.name} Options
                </Text>
                <Text style={styles.modalSheetSub}>
                  Manage subject topics, flashcards, or settings
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedOptionsMenuSubject(null)} style={styles.closeBtnCircle}>
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12, marginTop: 4 }}>
              {/* Option 1: View Topics Breakdown */}
              <TouchableOpacity
                style={styles.actionCardTileOption}
                onPress={() => {
                  const s = selectedOptionsMenuSubject;
                  setSelectedOptionsMenuSubject(null);
                  setSelectedSubjectDetail(s);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.actionCardIconBadgeOption, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.18)' : (selectedOptionsMenuSubject?.color || '#6236FF') + '1A' }]}>
                  <Text style={{ fontSize: 18 }}>📊</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionCardTitleOption}>
                    View Topics Breakdown
                  </Text>
                  <Text style={styles.actionCardSubOption}>
                    Inspect detailed syllabus & topic mastery
                  </Text>
                </View>
                <ChevronRightIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>

              {/* Option 2: Start Flashcard Review */}
              <TouchableOpacity
                style={styles.actionCardTileOption}
                onPress={() => {
                  const sName = selectedOptionsMenuSubject?.name;
                  setSelectedOptionsMenuSubject(null);
                  if (onSelectTab) onSelectTab("study");
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.actionCardIconBadgeOption, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.18)' : 'rgba(245, 158, 11, 0.14)' }]}>
                  <Text style={{ fontSize: 18 }}>⚡</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionCardTitleOption}>
                    Start Flashcard Review
                  </Text>
                  <Text style={styles.actionCardSubOption}>
                    Practice active recall with smart flashcards
                  </Text>
                </View>
                <ChevronRightIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>

              {/* Option 3: Delete Subject */}
              <TouchableOpacity
                style={[
                  styles.actionCardTileOption,
                  isDark ? { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.35)' } : { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }
                ]}
                onPress={() => {
                  const s = selectedOptionsMenuSubject;
                  setSelectedOptionsMenuSubject(null);
                  if (s) handleDeleteSubject(s.id, s.name);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.actionCardIconBadgeOption, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionCardTitleOption, { color: '#EF4444' }]}>
                    Delete Subject
                  </Text>
                  <Text style={[styles.actionCardSubOption, isDark ? { color: '#FCA5A5' } : { color: '#B91C1C' }]}>
                    Permanently remove subject & track history
                  </Text>
                </View>
                <ChevronRightIcon size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const baseSubjectsStyles = StyleSheet.create({
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#334155",
    marginTop: 2,
    fontWeight: "600",
  },
  plusBtn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#6236FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 18,
  },

  // Search Bar
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },

  // Overall Progress Card
  overallCard: {
    backgroundColor: "#F3F0FF",
    borderRadius: 24,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "#EBE5FF",
  },
  overallTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overallTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  folderIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E8E2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  overallTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  overallSubtitle: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },
  overallPctText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#6236FF",
    letterSpacing: -0.5,
  },
  overallPctLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  overallTrack: {
    height: 8,
    backgroundColor: "#E2D9FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  overallFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 4,
  },
  overallStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  statCol: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statColVal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  statColLab: {
    fontSize: 9.5,
    fontWeight: "500",
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2D9FF",
  },

  // Filter Pills Bar
  pillsRow: {
    gap: 10,
    paddingVertical: 2,
  },
  pillBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sortDropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 8,
    gap: 4,
  },
  sortDropdownText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6236FF",
  },

  // Subjects Grid Layout
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    width: "100%",
  },
  gridCard: {
    width: "48%",
    minHeight: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: "space-between",
  },
  gridCardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  gridOptionsBtn: {
    padding: 4,
    marginRight: -4,
    marginTop: -2,
  },
  gridCardBody: {
    marginTop: 22,
    gap: 4,
  },
  gridSubjectName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
    lineHeight: 21,
  },
  gridSubjectSubText: {
    fontSize: 12.5,
    color: "#94A3B8",
    fontWeight: "500",
  },

  // Add Subject Dashed Card
  addDashedCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "transparent",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#475569",
    borderStyle: "dashed",
    marginTop: 6,
  },
  addDashedCardText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  emptyContainerGrid: {
    width: "100%",
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  emptySub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

  // Modals
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
    paddingBottom: 40,
    maxHeight: "85%",
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
  modalSheetSub: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 16,
  },
  closeBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 14,
  },
  modalActionBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  actionCardTileOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  actionCardIconBadgeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCardTitleOption: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  actionCardSubOption: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 2,
  },
  sortModalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 6,
  },
  sortOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  sortOptionSelected: {
    backgroundColor: "#F0EEFF",
  },
  sortOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  sortOptionTextSelected: {
    color: "#6236FF",
    fontWeight: "800",
  },
  topicDrawerCard: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  topicDrawerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  topicDrawerMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  topicBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});

const getSubjectsStyles = (isDark, activeAccentColor) => {
  if (!isDark && activeAccentColor === "#6236FF") return baseSubjectsStyles;
  return {
    ...baseSubjectsStyles,
    root: [
      baseSubjectsStyles.root,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    pageHeader: [
      baseSubjectsStyles.pageHeader,
      isDark && { backgroundColor: "#0B0F19", borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    backBtn: [
      baseSubjectsStyles.backBtn,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    pageTitle: [
      baseSubjectsStyles.pageTitle,
      isDark && { color: "#F8FAFC" },
    ],
    pageSubtitle: [
      baseSubjectsStyles.pageSubtitle,
      isDark && { color: "#94A3B8" },
    ],
    searchBarContainer: [
      baseSubjectsStyles.searchBarContainer,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    searchInput: [
      baseSubjectsStyles.searchInput,
      isDark && { color: "#F8FAFC" },
    ],
    overallCard: [
      baseSubjectsStyles.overallCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    folderIconBox: [
      baseSubjectsStyles.folderIconBox,
      isDark && { backgroundColor: `${activeAccentColor || "#6236FF"}22`, borderWidth: 1, borderColor: `${activeAccentColor || "#6236FF"}44` },
    ],
    overallTitle: [
      baseSubjectsStyles.overallTitle,
      isDark && { color: "#F8FAFC" },
    ],
    overallSubtitle: [
      baseSubjectsStyles.overallSubtitle,
      isDark && { color: "#94A3B8" },
    ],
    overallPctText: [
      baseSubjectsStyles.overallPctText,
      { color: isDark ? (activeAccentColor || "#818CF8") : (activeAccentColor || "#6236FF") },
    ],
    overallPctLabel: [
      baseSubjectsStyles.overallPctLabel,
      isDark && { color: "#94A3B8" },
    ],
    overallTrack: [
      baseSubjectsStyles.overallTrack,
      isDark && { backgroundColor: "#334155" },
    ],
    overallFill: [
      baseSubjectsStyles.overallFill,
      { backgroundColor: activeAccentColor || "#6236FF" },
    ],
    statColVal: [
      baseSubjectsStyles.statColVal,
      isDark && { color: "#F8FAFC" },
    ],
    statColLab: [
      baseSubjectsStyles.statColLab,
      isDark && { color: "#94A3B8" },
    ],
    statDivider: [
      baseSubjectsStyles.statDivider,
      isDark && { backgroundColor: "#334155" },
    ],
    pillBtn: [
      baseSubjectsStyles.pillBtn,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    pillText: [
      baseSubjectsStyles.pillText,
      isDark && { color: "#94A3B8" },
    ],
    sectionTitle: [
      baseSubjectsStyles.sectionTitle,
      isDark && { color: "#F8FAFC" },
    ],
    sortDropdownText: [
      baseSubjectsStyles.sortDropdownText,
      { color: isDark ? (activeAccentColor || "#818CF8") : (activeAccentColor || "#6236FF") },
    ],
    gridCard: [
      baseSubjectsStyles.gridCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    gridSubjectName: [
      baseSubjectsStyles.gridSubjectName,
      isDark && { color: "#F8FAFC" },
    ],
    gridSubjectSubText: [
      baseSubjectsStyles.gridSubjectSubText,
      isDark && { color: "#94A3B8" },
    ],
    addDashedCardBtn: [
      baseSubjectsStyles.addDashedCardBtn,
      isDark && { borderColor: "#475569", backgroundColor: "rgba(255, 255, 255, 0.02)" },
    ],
    addDashedCardText: [
      baseSubjectsStyles.addDashedCardText,
      isDark && { color: "#CBD5E1" },
    ],
    emptyTitle: [
      baseSubjectsStyles.emptyTitle,
      isDark && { color: "#F8FAFC" },
    ],
    emptySub: [
      baseSubjectsStyles.emptySub,
      isDark && { color: "#94A3B8" },
    ],
    modalOverlay: [
      baseSubjectsStyles.modalOverlay,
      isDark && { backgroundColor: "rgba(0, 0, 0, 0.75)" },
    ],
    modalOverlayCenter: [
      baseSubjectsStyles.modalOverlayCenter,
      isDark && { backgroundColor: "rgba(0, 0, 0, 0.75)" },
    ],
    modalSheetContainer: [
      baseSubjectsStyles.modalSheetContainer,
      isDark && { backgroundColor: "#0F172A", borderTopWidth: 0, borderTopColor: "transparent" },
    ],
    modalSheetTitle: [
      baseSubjectsStyles.modalSheetTitle,
      isDark && { color: "#F8FAFC" },
    ],
    modalSheetSub: [
      baseSubjectsStyles.modalSheetSub,
      isDark && { color: "#94A3B8" },
    ],
    dragHandle: [
      baseSubjectsStyles.dragHandle,
      isDark && { backgroundColor: "#334155" },
    ],
    closeBtnCircle: [
      baseSubjectsStyles.closeBtnCircle,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    inputLabel: [
      baseSubjectsStyles.inputLabel,
      isDark && { color: "#94A3B8" },
    ],
    modalTextInput: [
      baseSubjectsStyles.modalTextInput,
      isDark && { backgroundColor: "#1E293B", color: "#F8FAFC", borderWidth: 0, borderColor: "transparent" },
    ],
    actionCardTileOption: [
      baseSubjectsStyles.actionCardTileOption,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    actionCardTitleOption: [
      baseSubjectsStyles.actionCardTitleOption,
      isDark && { color: "#F8FAFC" },
    ],
    actionCardSubOption: [
      baseSubjectsStyles.actionCardSubOption,
      isDark && { color: "#94A3B8" },
    ],
    sortModalCard: [
      baseSubjectsStyles.sortModalCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    sortOptionText: [
      baseSubjectsStyles.sortOptionText,
      isDark && { color: "#F8FAFC" },
    ],
    topicDrawerCard: [
      baseSubjectsStyles.topicDrawerCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    topicDrawerName: [
      baseSubjectsStyles.topicDrawerName,
      isDark && { color: "#F8FAFC" },
    ],
  };
};
