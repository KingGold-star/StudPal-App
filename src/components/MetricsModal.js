import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Animated,
  Easing,
  TextInput,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";
import { goalMetricsService } from "../services/goalMetricsService";
import { gamificationService } from "../services/gamification/gamificationService";
import { useTheme } from "../theme/themeContext";

// Import Chart Components
import GoalCompletionDonut from "./charts/GoalCompletionDonut";
import GoalBreakdownDonut from "./charts/GoalBreakdownDonut";
import WeeklyGoalBarChart from "./charts/WeeklyGoalBarChart";
import ProgressTrendChart from "./charts/ProgressTrendChart";
import SubjectPerformanceChart from "./charts/SubjectPerformanceChart";
import ConsistencyRing from "./charts/ConsistencyRing";
import GoalActivityHeatmap from "./charts/GoalActivityHeatmap";
import ExamReadinessCard from "./charts/ExamReadinessCard";
import NextMilestoneCard from "./charts/NextMilestoneCard";
import SubjectDetailModal from "./charts/SubjectDetailModal";
import ScrollDownAnimatedCard from "./charts/ScrollDownAnimatedCard";
import ShareAnalyticsModal from "./ShareAnalyticsModal";

// Animated Progress Bar Component for Weekly Summary Progress Bar
function AnimatedProgressBar({ completionPercentage = 85 }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    widthAnim.setValue(0);
    Animated.timing(widthAnim, {
      toValue: completionPercentage,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [completionPercentage]);

  const widthPct = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={baseStyles.summaryTrackBg}>
      <Animated.View style={[baseStyles.summaryTrackFill, { width: widthPct }]} />
    </View>
  );
}

const CloseIcon = ({ size = 20, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = "#2D62FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="12" />
    <Path d="M7 12.5l3 3 7-7" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CircleIcon = ({ size = 20, color = "#CBD5E1" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
  </Svg>
);

const ShareIcon = ({ size = 16, color = "#FFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <Path d="M16 6l-4-4-4 4" />
    <Path d="M12 2v13" />
  </Svg>
);

const SparkleIcon = ({ size = 14, color = "#FFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const TrendingUpIcon = ({ size = 14, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

export default function MetricsModal({ visible, onClose, inline = false, onSharePress }) {
  const insets = useSafeAreaInsets();
  const { isDark, accentColor } = useTheme();
  const styles = useMemo(() => getMetricsStyles(isDark, accentColor), [isDark, accentColor]);
  const [metricsState, setMetricsState] = useState(goalMetricsService.getAllState());
  const [gameState, setGameState] = useState(gamificationService.getState());
  const [selectedPeriod, setSelectedPeriod] = useState("Week"); // 'Week' | 'Month' | '3 Months'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    goalMetricsService.addGoal({
      title: newGoalTitle.trim(),
      subjectId: "math",
      subjectName: "Mathematics",
      category: "Practice",
    });
    setNewGoalTitle("");
  };

  useEffect(() => {
    const unsubMetrics = goalMetricsService.subscribe((state) => {
      setMetricsState(state);
    });
    const unsubGamification = gamificationService.subscribe((state) => {
      setGameState(state);
    });
    return () => {
      unsubMetrics();
      unsubGamification();
    };
  }, []);

  const { daily, weekly, monthly, consistency, subjectMetrics, insights } = metricsState;

  const handleToggleGoal = (goalId, goalTitle) => {
    const updated = goalMetricsService.toggleGoalCompletion(goalId);
    if (updated && updated.completed) {
      gamificationService.recordGoalCompletion(goalTitle, `goal_${goalId}`);
      if (daily.completedGoals + 1 === daily.totalGoals && daily.totalGoals > 0) {
        gamificationService.recordPerfectDayBonus();
      }
    }
  };

  const handleOpenSubjectModal = (subj) => {
    setSelectedSubject(subj);
    setIsSubjectModalOpen(true);
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = () => {
    if (onSharePress) {
      onSharePress();
    } else {
      setIsShareModalOpen(true);
    }
  };

  const renderHeader = () => (
    <View style={[styles.headerRow, inline && styles.inlineHeaderRow]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>See how your study goals are progressing.</Text>
      </View>
      {!inline && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <CloseIcon size={20} color={isDark ? '#94A3B8' : '#475569'} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderBody = () => (
    <View style={{ width: '100%', gap: 16 }}>
      {/* Period Switcher Segmented Control */}
      <View style={styles.periodSwitcher}>
        {["Week", "Month", "3 Months"].map((p) => {
          const isSelected = selectedPeriod === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, isSelected && styles.periodTabSelected]}
              onPress={() => setSelectedPeriod(p)}
              activeOpacity={0.8}
            >
              <Text style={[styles.periodTabText, isSelected && styles.periodTabTextSelected]}>{p}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── SECTION 1 — TODAY'S PROGRESS (LARGE ANIMATED DONUT) ─────────────── */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionPretitle}>DAILY ANALYTICS</Text>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
          </View>
          {daily.hasGoals && (
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>{daily.completedGoals}/{daily.totalGoals} Completed</Text>
            </View>
          )}
        </View>

        <GoalCompletionDonut
          percentage={daily.completionPercentage || 0}
          completedCount={daily.completedGoals}
          totalCount={daily.totalGoals}
          remainingCount={daily.remainingGoals}
          hasGoals={daily.hasGoals}
          size={250}
          strokeWidth={22}
        />

        {/* Today's Checklist */}
        {daily.hasGoals && (
          <View style={styles.goalsChecklist}>
            {daily.goals.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.goalItemRow, g.completed && styles.goalItemDone]}
                onPress={() => handleToggleGoal(g.id, g.title)}
                activeOpacity={0.8}
              >
                {g.completed ? <CheckCircleIcon size={20} color="#2D62FF" /> : <CircleIcon size={20} color="#94A3B8" />}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.goalTitle, g.completed && styles.goalTitleDone]}>{g.title}</Text>
                  <Text style={styles.goalMeta}>{g.subjectName} • {g.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Add Goal Input */}
        <View style={styles.addGoalRow}>
          <TextInput
            style={styles.addGoalInput}
            placeholder="+ Add a new study goal to track live..."
            placeholderTextColor="#94A3B8"
            value={newGoalTitle}
            onChangeText={setNewGoalTitle}
            onSubmitEditing={handleAddGoal}
          />
          <TouchableOpacity style={styles.addGoalBtn} onPress={handleAddGoal} activeOpacity={0.8}>
            <Text style={styles.addGoalBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── SECTION 2 — THIS WEEK (7-DAY VERTICAL BAR CHART) ────────────────── */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionPretitle}>WEEKLY BREAKDOWN</Text>
            <Text style={styles.sectionTitle}>This Week</Text>
            <Text style={styles.sectionSubtitle}>Your daily goal completion percentage.</Text>
          </View>
          <View style={styles.trendBadge}>
            <TrendingUpIcon size={14} color="#10B981" />
            <Text style={styles.trendText}>+{weekly.changeFromPrevWeekPercentagePoints} points</Text>
          </View>
        </View>

        <WeeklyGoalBarChart dailyData={weekly.dailyBreakdown} height={240} />

        {/* Weekly Summary Progress Bar */}
        <View style={styles.weeklySummaryBox}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>THIS WEEK</Text>
            <Text style={styles.summaryPct}>{weekly.completionPercentage}%</Text>
          </View>
          <AnimatedProgressBar completionPercentage={weekly.completionPercentage} />
          <Text style={styles.summarySubtext}>{weekly.totalCompleted} / {weekly.totalPlanned} goals completed</Text>
        </View>
      </View>

      {/* ── SECTION 3 — PROGRESS TREND (LINE CHART) ────────────────────────── */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionPretitle}>LONG TERM TREND</Text>
            <Text style={styles.sectionTitle}>Progress Trend</Text>
            <Text style={styles.sectionSubtitle}>Your goal completion over time.</Text>
          </View>
        </View>
        <ProgressTrendChart
          period={selectedPeriod}
          dataPoints={metricsState.trendData ? metricsState.trendData[selectedPeriod] : undefined}
          height={230}
        />
      </View>

      {/* ── SECTION 4 — SUBJECT PERFORMANCE (HORIZONTAL BAR CHART) ──────────── */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionPretitle}>SUBJECT ANALYTICS</Text>
            <Text style={styles.sectionTitle}>Subject Performance</Text>
            <Text style={styles.sectionSubtitle}>Tap a subject for detailed analytics.</Text>
          </View>
        </View>
        <SubjectPerformanceChart subjectsData={subjectMetrics} onSelectSubject={handleOpenSubjectModal} />
      </View>

      {/* ── SECTION 5 — GOAL BREAKDOWN (DONUT CHART) ───────────────────────── */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionPretitle}>COMPOSITION</Text>
        <Text style={styles.sectionTitle}>Goal Breakdown</Text>
        <GoalBreakdownDonut
          completed={monthly.totalCompleted}
          remaining={monthly.totalPlanned - monthly.totalCompleted}
          total={monthly.totalPlanned}
          percentage={monthly.completionPercentage}
          size={220}
          strokeWidth={20}
        />
      </View>

      {/* ── SECTION 6 — CONSISTENCY (CIRCULAR PROGRESS RING) ────────────────── */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionPretitle}>RELIABILITY</Text>
        <Text style={styles.sectionTitle}>Study Consistency</Text>
        <ConsistencyRing
          scorePercentage={consistency.scorePercentage}
          successfulDays={consistency.successfulDays}
          activeDays={consistency.activeDays}
          size={210}
          strokeWidth={18}
        />
      </View>

      {/* ── SECTION 7 — ACTIVITY HEATMAP (CALENDAR VISUALIZATION) ──────────── */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionPretitle}>HISTORICAL CALENDAR</Text>
        <Text style={styles.sectionTitle}>Goal Completion Activity</Text>
        <GoalActivityHeatmap monthName="AUGUST" />
      </View>

      {/* ── SECTION 8 — EXAM READINESS VISUALIZATION ───────────────────────── */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionPretitle}>PREPARATION INDEX</Text>
        <Text style={styles.sectionTitle}>Exam Readiness</Text>
        <ExamReadinessCard overallScore={72} masteryPct={70} goalPct={80} revisionPct={65} size={170} strokeWidth={16} />
      </View>

      {/* ── SECTION 9 — NEXT MILESTONE PROGRESS ────────────────────────────── */}
      <NextMilestoneCard title="100 Goals Completed" currentCount={monthly.totalCompleted} targetCount={100} />



      {/* Share Action */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.88}>
        <View style={styles.shareIconCircle}>
          <ShareIcon size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.shareBtnText}>Share Analytics</Text>
        <SparkleIcon size={14} color="rgba(255, 255, 255, 0.85)" />
      </TouchableOpacity>
    </View>
  );

  if (inline) {
    return (
      <View style={styles.inlineRoot}>
        {renderHeader()}
        <View style={styles.inlineContentContainer}>
          {renderBody()}
        </View>
        <SubjectDetailModal
          visible={isSubjectModalOpen}
          subject={selectedSubject}
          onClose={() => setIsSubjectModalOpen(false)}
        />
        <ShareAnalyticsModal
          visible={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {renderHeader()}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 24 }]} showsVerticalScrollIndicator={false}>
          {renderBody()}
        </ScrollView>

        <SubjectDetailModal
          visible={isSubjectModalOpen}
          subject={selectedSubject}
          onClose={() => setIsSubjectModalOpen(false)}
        />
        <ShareAnalyticsModal
          visible={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </SafeAreaView>
    </Modal>
  );
}

const baseStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerPretitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#2D62FF",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    padding: 9,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    gap: 18,
  },

  // Period Switcher
  periodSwitcher: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    padding: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  periodTabSelected: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  periodTabTextSelected: {
    color: "#2D62FF",
    fontWeight: "900",
  },

  // Section Cards
  sectionCard: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  sectionPretitle: {
    fontSize: 9.5,
    fontWeight: "900",
    color: "#2D62FF",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: "rgba(45, 98, 255, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#2D62FF",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#059669",
  },

  // Today's Checklist
  goalsChecklist: {
    gap: 10,
    marginTop: 16,
  },
  goalItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  goalItemDone: {
    backgroundColor: "rgba(45, 98, 255, 0.04)",
    borderColor: "rgba(45, 98, 255, 0.12)",
  },
  goalTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  goalTitleDone: {
    textDecorationLine: "line-through",
    color: "#64748B",
  },
  goalMeta: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  // Weekly Summary Box
  weeklySummaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  summaryPct: {
    fontSize: 14,
    fontWeight: "900",
    color: "#2D62FF",
  },
  summaryTrackBg: {
    height: 9,
    backgroundColor: "#E2E8F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  summaryTrackFill: {
    height: "100%",
    backgroundColor: "#2D62FF",
    borderRadius: 5,
  },
  summarySubtext: {
    fontSize: 11.5,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 8,
  },

  // Insights Grid
  insightsGrid: {
    gap: 12,
    marginTop: 12,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: "#F0F7FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  insightTitleText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0369A1",
  },
  insightBodyText: {
    fontSize: 12,
    color: "#334155",
    marginTop: 2,
    lineHeight: 16,
  },

  // Share action
  shareBtn: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 18,
    marginTop: 14,
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.28)",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 8,
  },
  shareIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15.5,
    letterSpacing: 0.4,
  },

  // Inline container styles
  inlineRoot: {
    width: "100%",
    marginBottom: 8,
  },
  inlineHeaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  inlineContentContainer: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    gap: 16,
  },

  // Add Goal Quick Bar
  addGoalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 0,
    borderColor: "transparent",
  },
  addGoalInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    paddingVertical: 8,
  },
  addGoalBtn: {
    backgroundColor: "#2D62FF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addGoalBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});

const getMetricsStyles = (isDark, accentColor) => {
  if (!isDark) return baseStyles;
  return {
    ...baseStyles,
    safeArea: [baseStyles.safeArea, { backgroundColor: "#0B0F19" }],
    headerRow: [baseStyles.headerRow, { backgroundColor: "#1E293B", borderBottomWidth: 0, borderBottomColor: "transparent" }],
    headerTitle: [baseStyles.headerTitle, { color: "#F8FAFC" }],
    headerSubtitle: [baseStyles.headerSubtitle, { color: "#94A3B8" }],
    closeBtn: [baseStyles.closeBtn, { backgroundColor: "#0F172A" }],
    periodSwitcher: [baseStyles.periodSwitcher, { backgroundColor: "#0F172A" }],
    periodTabSelected: [baseStyles.periodTabSelected, { backgroundColor: "#1E293B" }],
    periodTabText: [baseStyles.periodTabText, { color: "#94A3B8" }],
    periodTabTextSelected: [baseStyles.periodTabTextSelected, { color: accentColor || "#2D62FF" }],
    sectionTitle: [baseStyles.sectionTitle, { color: "#F8FAFC" }],
    sectionSubtitle: [baseStyles.sectionSubtitle, { color: "#94A3B8" }],
    goalItemRow: [baseStyles.goalItemRow, { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    goalTitle: [baseStyles.goalTitle, { color: "#F8FAFC" }],
    goalTitleDone: [baseStyles.goalTitleDone, { color: "#64748B" }],
    goalMeta: [baseStyles.goalMeta, { color: "#94A3B8" }],
    weeklySummaryBox: [baseStyles.weeklySummaryBox, { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }],
    summaryLabel: [baseStyles.summaryLabel, { color: "#94A3B8" }],
    summaryTrackBg: [baseStyles.summaryTrackBg, { backgroundColor: "#0F172A" }],
    summarySubtext: [baseStyles.summarySubtext, { color: "#94A3B8" }],
    insightItem: [baseStyles.insightItem, { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    insightTitleText: [baseStyles.insightTitleText, { color: "#38BDF8" }],
    insightBodyText: [baseStyles.insightBodyText, { color: "#CBD5E1" }],
    addGoalRow: [baseStyles.addGoalRow, { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    addGoalInput: [baseStyles.addGoalInput, { color: "#F8FAFC" }],
  };
};
