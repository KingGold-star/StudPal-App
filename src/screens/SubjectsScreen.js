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
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import { gamificationService } from "../services/gamification/gamificationService";
import { settingsService } from "../services/settings/settingsService";

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

const FlameIcon = ({ color = "#F97316", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.87-1.67-2.5-2.5-4-.83 1.5-2.5 2.13-2.5 4z" />
    <Path d="M12 2c.67 2 2.8 4.2 3.5 6 1 2.5.5 5.5-1.5 7.5a6.5 6.5 0 0 1-10-3.5c-.3-1.5 0-3 1-4.5.8-1.2 2-2.5 3-4C9.5 4.5 11 3 12 2z" />
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

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function SubjectsScreen({ onSelectTab, onNavigate }) {
  const insets = useSafeAreaInsets();
  const [currentSettings, setCurrentSettings] = useState(settingsService.getSettingsSync());

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setCurrentSettings(s));
    return () => unsub();
  }, []);

  const accentColor = currentSettings?.accentColor || Colors.accent || "#6236FF";

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState("All Subjects");
  const [sortOption, setSortOption] = useState("Progress");

  // Data States
  const [subjectsList, setSubjectsList] = useState(INITIAL_SUBJECTS);

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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top Page Header ───────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Subjects</Text>
          <Text style={styles.pageSubtitle}>Manage your subjects and track mastery</Text>
        </View>
        <TouchableOpacity
          style={[styles.plusBtn, { backgroundColor: accentColor, shadowColor: accentColor }]}
          onPress={() => setAddModalOpen(true)}
          activeOpacity={0.85}
        >
          <PlusIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
            placeholder="Search subjects..."
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
                <FolderIcon size={20} color="#6236FF" />
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
            <View style={[styles.overallFill, { width: `${overallAvgMastery}%` }]} />
          </View>

          {/* 4 Overview Stat Items */}
          <View style={styles.overallStatsRow}>
            <View style={styles.statCol}>
              <BookIcon color="#6236FF" size={15} />
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
              <FlameIcon color="#F97316" size={15} />
              <Text style={styles.statColVal}>8</Text>
              <Text style={styles.statColLab}>Day Streak</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <ClockIcon color="#3B82F6" size={15} />
              <Text style={styles.statColVal}>14h 32m</Text>
              <Text style={styles.statColLab}>Study Time</Text>
            </View>
          </View>
        </View>

        {/* ── Filter Pills Bar ────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
          {[
            { id: "All Subjects", label: "All Subjects", Icon: GridIcon, activeColor: "#6236FF", activeBg: "#F0EEFF" },
            { id: "Learning", label: "Learning", Icon: LearningBookIcon, activeColor: "#10B981", activeBg: "#E8FDF0" },
            { id: "Review", label: "Review", Icon: ReviewClockIcon, activeColor: "#F97316", activeBg: "#FFF3E8" },
            { id: "Mastered", label: "Mastered", Icon: MasteredStarIcon, activeColor: "#3B82F6", activeBg: "#EBF5FF" },
          ].map((tab) => {
            const isActive = activeTabFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.pillBtn,
                  isActive && { backgroundColor: tab.activeBg, borderColor: tab.activeBg },
                ]}
                onPress={() => setActiveTabFilter(tab.id)}
                activeOpacity={0.75}
              >
                <tab.Icon size={15} color={isActive ? tab.activeColor : "#64748B"} />
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
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#6236FF" strokeWidth="2.5" strokeLinecap="round">
              <Path d="M6 9l6 6 6-6" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* ── Your Subjects Grouped Card List ──────────────────────────── */}
        <View style={styles.subjectsGroupCard}>
          {filteredSubjects.map((item, idx) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.subjectRow}
                onPress={() => setSelectedSubjectDetail(item)}
                activeOpacity={0.75}
              >
                {/* Subject Icon Box */}
                <View style={[styles.subjectIconBox, { backgroundColor: item.bg }]}>
                  <Text style={{ fontSize: 20 }}>{item.iconEmoji}</Text>
                </View>

                {/* Subject Name & Meta info */}
                <View style={styles.subjectMetaGroup}>
                  <View style={styles.subjectTitleRow}>
                    <Text style={styles.subjectNameText} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={[styles.masteryPctText, { color: item.color }]}>
                        {item.mastery}%
                      </Text>
                      <Text style={styles.masterySubLabel}>Mastery</Text>
                    </View>
                  </View>

                  <Text style={styles.subjectSubText} numberOfLines={1}>
                    {item.topicsCount} topics • {item.lastStudied}
                  </Text>

                  {/* Subject Mini Progress Bar */}
                  <View style={styles.miniTrack}>
                    <View
                      style={[
                        styles.miniFill,
                        { width: `${item.mastery}%`, backgroundColor: item.color },
                      ]}
                    />
                  </View>
                </View>

                {/* 3-Dots Action Button */}
                <TouchableOpacity
                  style={styles.optionsBtn}
                  onPress={() => setSelectedOptionsMenuSubject(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MoreVerticalIcon size={18} color="#94A3B8" />
                </TouchableOpacity>
              </TouchableOpacity>

              {idx < filteredSubjects.length - 1 && <View style={styles.rowDivider} />}
            </React.Fragment>
          ))}

          {filteredSubjects.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32, marginBottom: 6 }}>🔍</Text>
              <Text style={styles.emptyTitle}>No Subjects Found</Text>
              <Text style={styles.emptySub}>Try adjusting your search or tab filter.</Text>
            </View>
          )}
        </View>

        {/* ── "Add New Subject" Bottom Card ───────────────────────────── */}
        <TouchableOpacity
          style={styles.addCardBtn}
          onPress={() => setAddModalOpen(true)}
          activeOpacity={0.85}
        >
          <View style={styles.addCardIconBox}>
            <StarIcon color="#6236FF" size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addCardTitle}>Add New Subject</Text>
            <Text style={styles.addCardSubtitle}>Create a new subject to start learning</Text>
          </View>
          <ChevronRightIcon color="#6236FF" size={18} />
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar activeTab="subjects" onSelectTab={onSelectTab} />

      {/* ── 1. ADD NEW SUBJECT MODAL ──────────────────────────────────── */}
      <Modal visible={isAddModalOpen} animationType="slide" transparent onRequestClose={() => setAddModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Add New Subject</Text>
              <TouchableOpacity onPress={() => setAddModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Subject Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Organic Chemistry, Microeconomics"
                placeholderTextColor="#94A3B8"
                value={newSubjectName}
                onChangeText={setNewSubjectName}
              />

              <Text style={styles.inputLabel}>Estimated Topics Count</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="15"
                placeholderTextColor="#94A3B8"
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
            {selectedSubjectDetail && (
              <>
                <View style={styles.modalSheetHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View>
                      <Text style={styles.modalSheetTitle}>{selectedSubjectDetail.name}</Text>
                      <Text style={{ fontSize: 12, color: "#64748B" }}>
                        {selectedSubjectDetail.topicsCount} Topics • {selectedSubjectDetail.mastery}% Overall Mastery
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedSubjectDetail(null)}>
                    <CloseIcon size={18} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputLabel, { marginTop: 10, marginBottom: 8 }]}>Topics Breakdown & SRS Status</Text>

                <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
                  {selectedSubjectDetail.topics.map((t) => (
                    <View key={t.id} style={styles.topicDrawerCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.topicDrawerName}>{t.name}</Text>
                        <View style={styles.topicDrawerMeta}>
                          <Text style={{ fontSize: 11, color: "#64748B" }}>Mastery: {t.mastery}%</Text>
                          <Text style={[styles.topicBadgeText, t.status === "Mastered" ? { color: "#10B981" } : { color: "#6236FF" }]}>
                            ● {t.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => {
                    setSelectedSubjectDetail(null);
                    if (onSelectTab) onSelectTab("aicoach");
                  }}
                >
                  <Text style={styles.modalActionBtnText}>Start AI Practice Session</Text>
                </TouchableOpacity>
              </>
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
                style={[styles.sortOptionRow, sortOption === opt && styles.sortOptionSelected]}
                onPress={() => {
                  setSortOption(opt);
                  setSortModalOpen(false);
                }}
              >
                <Text style={[styles.sortOptionText, sortOption === opt && styles.sortOptionTextSelected]}>
                  {opt}
                </Text>
                {sortOption === opt && <Text style={{ color: "#6236FF", fontWeight: "800" }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ── 4. SUBJECT 3-DOTS OPTIONS MENU MODAL ──────────────────────── */}
      <Modal visible={!!selectedOptionsMenuSubject} animationType="fade" transparent onRequestClose={() => setSelectedOptionsMenuSubject(null)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.sortModalCard}>
            {selectedOptionsMenuSubject && (
              <>
                <Text style={styles.modalSheetTitle}>{selectedOptionsMenuSubject.name} Options</Text>
                <TouchableOpacity
                  style={styles.sortOptionRow}
                  onPress={() => {
                    const s = selectedOptionsMenuSubject;
                    setSelectedOptionsMenuSubject(null);
                    setSelectedSubjectDetail(s);
                  }}
                >
                  <Text style={styles.sortOptionText}>View Topics Breakdown</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sortOptionRow}
                  onPress={() => {
                    setSelectedOptionsMenuSubject(null);
                    if (onSelectTab) onSelectTab("study");
                  }}
                >
                  <Text style={styles.sortOptionText}>Start Flashcard Review</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sortOptionRow}
                  onPress={() => handleDeleteSubject(selectedOptionsMenuSubject.id, selectedOptionsMenuSubject.name)}
                >
                  <Text style={[styles.sortOptionText, { color: "#EF4444" }]}>Delete Subject</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
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
    borderWidth: 1,
    borderColor: "#F1F5F9",
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
    fontWeight: "500",
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
    color: "#64748B",
    fontWeight: "500",
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

  // Subjects Group Card
  subjectsGroupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  subjectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectMetaGroup: {
    flex: 1,
    gap: 4,
  },
  subjectTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subjectNameText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  masteryPctText: {
    fontSize: 15,
    fontWeight: "800",
  },
  masterySubLabel: {
    fontSize: 9.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  subjectSubText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  miniTrack: {
    height: 3.5,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 2,
  },
  miniFill: {
    height: "100%",
    borderRadius: 2,
  },
  optionsBtn: {
    padding: 6,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginLeft: 74,
  },

  // Add Subject Card
  addCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F0FF",
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#EBE5FF",
  },
  addCardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  addCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#6236FF",
  },
  addCardSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },

  emptyContainer: {
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
  emojiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 4,
  },
  emojiChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emojiChipSelected: {
    borderColor: "#6236FF",
    borderWidth: 2,
    backgroundColor: "#F0EEFF",
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

  // Sort & Options Modal
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

  // Topic Drawer Item
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
