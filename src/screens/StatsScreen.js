// src/screens/StatsScreen.js
// StudPal Full-Screen Personal Study Analytics Dashboard (Stats Tab)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Image,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import BottomNavBar from "../components/BottomNavBar";
import TooltipTouchable from "../components/TooltipTouchable";
import { settingsService } from "../services/settings/settingsService";
import { goalMetricsService } from "../services/goalMetricsService";
import { gamificationService } from "../services/gamification/gamificationService";
import { useTranslation } from "../services/i18n/i18nService";
import { useTheme } from "../theme/themeContext";

// Import Premium Visualization Components
import GoalCompletionDonut from "../components/charts/GoalCompletionDonut";
import GoalBreakdownDonut from "../components/charts/GoalBreakdownDonut";
import WeeklyGoalBarChart from "../components/charts/WeeklyGoalBarChart";
import ProgressTrendChart from "../components/charts/ProgressTrendChart";
import SubjectPerformanceChart from "../components/charts/SubjectPerformanceChart";
import ConsistencyRing from "../components/charts/ConsistencyRing";
import GoalActivityHeatmap from "../components/charts/GoalActivityHeatmap";
import ExamReadinessCard from "../components/charts/ExamReadinessCard";
import NextMilestoneCard from "../components/charts/NextMilestoneCard";
import SubjectDetailModal from "../components/charts/SubjectDetailModal";

const TrendingUpIcon = ({ size = 14, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

const ShareIcon = ({ size = 16, color = "#FFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <Path d="M16 6l-4-4-4 4" />
    <Path d="M12 2v13" />
  </Svg>
);

export default function StatsScreen({ user, settings, onSelectTab, onNavigate }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [currentSettings, setCurrentSettings] = useState(
    settingsService.getSettingsSync()
  );
  const [metricsState, setMetricsState] = useState(goalMetricsService.getAllState());
  const [gameState, setGameState] = useState(gamificationService.getState());
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  useEffect(() => {
    const unsubSettings = settingsService.subscribe((s) => setCurrentSettings(s));
    const unsubMetrics = goalMetricsService.subscribe((state) => setMetricsState(state));
    const unsubGamification = gamificationService.subscribe((state) => setGameState(state));
    return () => {
      unsubSettings();
      unsubMetrics();
      unsubGamification();
    };
  }, []);

  const { isDark, accentColor: themeAccentColor } = useTheme();
  const accentColor = themeAccentColor || currentSettings?.accentColor || "#6236FF";
  const C = isDark ? DARK : LIGHT;

  const { daily, weekly, monthly, consistency, subjectMetrics, insights } = metricsState;
  const studyTime = goalMetricsService.getStudyTimeMetrics(selectedPeriod);
  const barChartData = goalMetricsService.getBreakdownDataForPeriod(selectedPeriod);

  const handleNavSelect = (tab) => {
    if (tab === "home") {
      if (onNavigate) onNavigate("dashboard");
      else if (onSelectTab) onSelectTab("home");
    } else if (tab === "stats") {
      // Already on stats tab
    } else {
      if (onNavigate) onNavigate(tab);
      else if (onSelectTab) onSelectTab(tab);
    }
  };

  const handleOpenSubjectModal = (subj) => {
    setSelectedSubject(subj);
    setIsSubjectModalOpen(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm at ${weekly.completionPercentage}% study goal completion this week on StudPal! 🎯 Consistency score: ${consistency.scorePercentage}%.`,
      });
    } catch (e) {
      console.log("Error sharing metrics", e);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* ── 🌟 STICKY TOP NAVBAR (Header & Duration Picker Fixed at Top) ── */}
        <View style={[styles.stickyTopNavbar, { backgroundColor: C.bg, borderBottomColor: isDark ? "transparent" : "rgba(226, 232, 240, 0.7)", borderBottomWidth: isDark ? 0 : 1 }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerPretitle}>{t("stats.pretitle", "STUDY ANALYTICS")}</Text>
              <Text style={[styles.headerTitle, { color: C.textPrimary }]}>
                {t("stats.title", "Study Statistics")}
              </Text>
              <Text style={[styles.headerSub, { color: C.textSecondary }]}>
                {t("stats.subtitle", "Track your goal completion and study performance.")}
              </Text>
            </View>
            <View style={styles.headerRightActions}>
              <TooltipTouchable
                tooltip="Profile & Account"
                style={styles.profileBtn}
                onPress={() => (onNavigate ? onNavigate("profile") : onSelectTab && onSelectTab("profile"))}
                activeOpacity={0.8}
              >
                <View style={styles.avatarMini}>
                  {(user && user.avatarUri) ? (
                    <Image source={{ uri: user.avatarUri }} style={styles.avatarImgMini} />
                  ) : (
                    <Text style={{ fontSize: 18 }}>
                      {user?.avatarEmoji || '👨‍🎓'}
                    </Text>
                  )}
                </View>
              </TooltipTouchable>

              <TooltipTouchable
                tooltip="Settings"
                onPress={() => (onNavigate ? onNavigate("settings") : null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.settingsBtn}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 18 }}>⚙️</Text>
              </TooltipTouchable>
            </View>
          </View>

          {/* Period Switcher / Duration Picker */}
          <View style={[styles.periodSwitcher, { backgroundColor: isDark ? "#1E293B" : "#E2E8F0" }]}>
            {[
              { id: "Week", label: t("stats.week", "Week") },
              { id: "Month", label: t("stats.month", "Month") },
              { id: "3 Months", label: t("stats.threeMonths", "3 Months") },
            ].map(({ id, label }) => {
              const isSelected = selectedPeriod === id;
              return (
                <TooltipTouchable
                  key={id}
                  style={[styles.periodTab, isSelected && { backgroundColor: C.card }]}
                  onPress={() => setSelectedPeriod(id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.periodTabText, isSelected && { color: "#2D62FF", fontWeight: "900" }]}>{label}</Text>
                </TooltipTouchable>
              );
            })}
          </View>
        </View>

        {/* ── 📜 SCROLLABLE STATS CONTENT ── */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >

          {/* ── Total Study Time Card (Ultra-Premium Active Study Time) ── */}
          <View style={[styles.studyTimeCard, { backgroundColor: C.card, borderColor: isDark ? "#334155" : "rgba(45, 98, 255, 0.14)" }]}>
            <View style={styles.studyTimeHeaderRow}>
              <Text style={[styles.studyTimePretitle, { color: C.textSecondary }]}>
                {t("stats.totalStudyTime", "TOTAL STUDY TIME")}
              </Text>
              <View style={styles.activeStudyBadge}>
                <View style={styles.activePulseDot} />
                <Text style={styles.activeStudyText}>{t("stats.activeStudyTime", "Active Study Time")}</Text>
              </View>
            </View>

            <View style={styles.studyTimeMainRow}>
              <View style={styles.studyTimeValueGroup}>
                <Text style={[styles.studyTimeValue, { color: C.textPrimary }]}>
                  {studyTime?.totalHours || 12.5}
                </Text>
                <Text style={[styles.studyTimeUnitText, { color: C.textSecondary }]}>
                  {t("stats.hours", "hours")}
                </Text>
              </View>

              <View
                style={[
                  styles.studyTrendBadge,
                  {
                    backgroundColor: (studyTime?.isUp ?? true)
                      ? (isDark ? "rgba(16, 185, 129, 0.18)" : "#ECFDF5")
                      : (isDark ? "rgba(239, 68, 68, 0.18)" : "#FEF2F2"),
                    borderColor: (studyTime?.isUp ?? true)
                      ? (isDark ? "#059669" : "#34D399")
                      : (isDark ? "#DC2626" : "#FCA5A5"),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.studyTrendText,
                    { color: (studyTime?.isUp ?? true) ? (isDark ? "#34D399" : "#059669") : "#DC2626" },
                  ]}
                >
                  {(studyTime?.isUp ?? true) ? "↑" : "↓"} {Math.abs(studyTime?.changePct ?? 16)}% vs {studyTime?.periodLabel || "last week"}
                </Text>
              </View>
            </View>

            {/* Active Study Tool Breakdown Cards (Premium 2x2 Grid) */}
            <View style={[styles.studyBreakdownDivider, { backgroundColor: isDark ? "#334155" : "#F1F5F9" }]} />
            
            <View style={styles.breakdownHeaderRow}>
              <Text style={[styles.breakdownHeaderTitle, { color: C.textSecondary }]}>
                {t("stats.activeBreakdown", "ACTIVE STUDY BREAKDOWN")}
              </Text>
            </View>

            <View style={styles.premiumCardsGrid}>
              {/* Focus Sessions Card */}
              <View style={[styles.premiumCardItem, { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.cardIconBadge, { backgroundColor: isDark ? "#334155" : "#F1F5F9" }]}>
                    <Text style={{ fontSize: 14 }}>⏱️</Text>
                  </View>
                  <Text style={[styles.cardValNum, { color: C.textPrimary }]}>
                    {studyTime?.focusSessionsCount || 88}
                  </Text>
                </View>
                <Text style={[styles.cardLabelSub, { color: C.textSecondary }]}>
                  {t("stats.focusSessions", "Focus Sessions")}
                </Text>
              </View>

              {/* Flashcard Sets Card */}
              <View style={[styles.premiumCardItem, { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.cardIconBadge, { backgroundColor: isDark ? "#334155" : "#F1F5F9" }]}>
                    <Text style={{ fontSize: 14 }}>🎴</Text>
                  </View>
                  <Text style={[styles.cardValNum, { color: C.textPrimary }]}>
                    {studyTime?.reviewsCount || 37}
                  </Text>
                </View>
                <Text style={[styles.cardLabelSub, { color: C.textSecondary }]}>
                  {t("stats.flashcardSets", "Flashcard Sets")}
                </Text>
              </View>

              {/* Quizzes Card */}
              <View style={[styles.premiumCardItem, { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.cardIconBadge, { backgroundColor: isDark ? "#334155" : "#F1F5F9" }]}>
                    <Text style={{ fontSize: 14 }}>📝</Text>
                  </View>
                  <Text style={[styles.cardValNum, { color: C.textPrimary }]}>
                    {studyTime?.quizzesCount || 10}
                  </Text>
                </View>
                <Text style={[styles.cardLabelSub, { color: C.textSecondary }]}>
                  {t("stats.quizzes", "Quizzes")}
                </Text>
              </View>

              {/* Completed Goals Card */}
              <View style={[styles.premiumCardItem, { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.cardIconBadge, { backgroundColor: isDark ? "#334155" : "#F1F5F9" }]}>
                    <Text style={{ fontSize: 14 }}>🎯</Text>
                  </View>
                  <Text style={[styles.cardValNum, { color: C.textPrimary }]}>
                    {studyTime?.goalsCount || 86}
                  </Text>
                </View>
                <Text style={[styles.cardLabelSub, { color: C.textSecondary }]}>
                  {t("stats.goalsDone", "Goals Done")}
                </Text>
              </View>
            </View>
          </View>

          {/* Section 1: Today's Progress */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionPretitle}>{t("stats.dailyAnalytics", "DAILY ANALYTICS")}</Text>
                <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>{t("stats.todaysProgress", "Today's Progress")}</Text>
              </View>
              {daily.hasGoals && (
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{daily.completedGoals}/{daily.totalGoals} {t("stats.completed", "Completed")}</Text>
                </View>
              )}
            </View>

            <GoalCompletionDonut
              percentage={daily.completionPercentage || 0}
              completedCount={daily.completedGoals}
              totalCount={daily.totalGoals}
              remainingCount={daily.remainingGoals}
              hasGoals={daily.hasGoals}
              size={210}
            />
          </View>

          {/* Section 2: Timeframe Breakdown (Week / Month / 3 Months) */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionPretitle}>
                  {selectedPeriod === "Month" ? t("stats.monthlyBreakdown", "MONTHLY BREAKDOWN") : selectedPeriod === "3 Months" ? "SEMESTER BREAKDOWN" : t("stats.weeklyBreakdown", "WEEKLY BREAKDOWN")}
                </Text>
                <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
                  {selectedPeriod === "Month" ? t("stats.thisMonth", "This Month") : selectedPeriod === "3 Months" ? t("stats.pastThreeMonths", "Past 3 Months") : t("stats.thisWeek", "This Week")}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: C.textSecondary }]}>
                  {selectedPeriod === "Month" ? "Your weekly goal completion breakdown." : selectedPeriod === "3 Months" ? "Your monthly goal completion breakdown." : "Your daily goal completion percentage."}
                </Text>
              </View>
              <View style={styles.trendBadge}>
                <TrendingUpIcon size={14} color="#10B981" />
                <Text style={styles.trendText}>+{weekly.changeFromPrevWeekPercentagePoints} points</Text>
              </View>
            </View>

            <WeeklyGoalBarChart dailyData={barChartData} height={190} />

            <View style={[styles.weeklySummaryBox, { backgroundColor: isDark ? "#111827" : "#F8FAFC", borderColor: C.border }]}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>
                  {selectedPeriod === "Month" ? t("stats.thisMonth", "THIS MONTH").toUpperCase() : selectedPeriod === "3 Months" ? t("stats.pastThreeMonths", "PAST 3 MONTHS").toUpperCase() : t("stats.thisWeek", "THIS WEEK").toUpperCase()}
                </Text>
                <Text style={styles.summaryPct}>
                  {selectedPeriod === "Month" ? "82%" : selectedPeriod === "3 Months" ? "79%" : `${weekly.completionPercentage}%`}
                </Text>
              </View>
              <View style={styles.summaryTrackBg}>
                <View style={[styles.summaryTrackFill, { width: selectedPeriod === "Month" ? "82%" : selectedPeriod === "3 Months" ? "79%" : `${weekly.completionPercentage}%` }]} />
              </View>
              <Text style={[styles.summarySubtext, { color: C.textSecondary }]}>
                {selectedPeriod === "Month" ? `${studyTime.goalsCount} goals completed this month` : selectedPeriod === "3 Months" ? `${studyTime.goalsCount} goals completed over 3 months` : `${weekly.totalCompleted} / ${weekly.totalPlanned} goals completed`}
              </Text>
            </View>
          </View>

          {/* Section 3: Progress Trend */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionPretitle}>LONG TERM TREND</Text>
                <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Progress Trend</Text>
                <Text style={[styles.sectionSubtitle, { color: C.textSecondary }]}>Your goal completion over time.</Text>
              </View>
            </View>
            <ProgressTrendChart period={selectedPeriod} height={175} />
          </View>

          {/* Section 4: Subject Performance */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionPretitle}>SUBJECT ANALYTICS</Text>
                <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Subject Performance</Text>
                <Text style={[styles.sectionSubtitle, { color: C.textSecondary }]}>Tap a subject for detailed analytics.</Text>
              </View>
            </View>
            <SubjectPerformanceChart subjectsData={subjectMetrics} onSelectSubject={handleOpenSubjectModal} />
          </View>

          {/* Section 5: Goal Composition Breakdown */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={styles.sectionPretitle}>COMPOSITION</Text>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Goal Breakdown</Text>
            <GoalBreakdownDonut
              completed={monthly.totalCompleted}
              remaining={monthly.totalPlanned - monthly.totalCompleted}
              total={monthly.totalPlanned}
              percentage={monthly.completionPercentage}
              size={160}
            />
          </View>

          {/* Section 6: Study Consistency */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={styles.sectionPretitle}>RELIABILITY</Text>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Study Consistency</Text>
            <ConsistencyRing
              scorePercentage={consistency.scorePercentage}
              successfulDays={consistency.successfulDays}
              activeDays={consistency.activeDays}
              size={150}
            />
          </View>

          {/* Section 7: Activity Heatmap */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={styles.sectionPretitle}>HISTORICAL CALENDAR</Text>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Goal Completion Activity</Text>
            <GoalActivityHeatmap monthName="AUGUST" />
          </View>

          {/* Section 8: Exam Readiness */}
          <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={styles.sectionPretitle}>PREPARATION INDEX</Text>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Exam Readiness</Text>
            <ExamReadinessCard overallScore={72} masteryPct={70} goalPct={80} revisionPct={65} />
          </View>

          {/* Section 9: Next Milestone */}
          <NextMilestoneCard title="100 Goals Completed" currentCount={monthly.totalCompleted} targetCount={100} />

          {/* Share Action Button */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.88}>
            <ShareIcon size={16} color="#FFF" />
            <Text style={styles.shareBtnText}>Share Analytics</Text>
          </TouchableOpacity>

          <View style={{ height: Math.max(insets.bottom, 20) + 100 }} />
        </ScrollView>

        {/* Subject Detail View Modal */}
        <SubjectDetailModal
          visible={isSubjectModalOpen}
          subject={selectedSubject}
          onClose={() => setIsSubjectModalOpen(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const LIGHT = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "rgba(226, 232, 240, 0.8)",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
};

const DARK = {
  bg: "#0B0F19",
  card: "#1E293B",
  border: "#334155",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  stickyTopNavbar: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
    zIndex: 100,
  },
  scrollContent: { paddingHorizontal: 18, paddingTop: 16, gap: 18 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
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
    letterSpacing: -0.5,
  },
  headerSub: { fontSize: 12.5, fontWeight: "500", marginTop: 3 },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileBtn: {
    padding: 3,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2D62FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImgMini: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  avatarTextMini: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  settingsBtn: {
    padding: 8,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    borderRadius: 18,
  },

  periodSwitcher: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  // Total Study Time Card
  studyTimeCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },
  studyTimeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  studyTimePretitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  activeStudyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(45, 98, 255, 0.08)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2D62FF",
  },
  activeStudyText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2D62FF",
  },
  studyTimeMainRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  studyTimeValueGroup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  studyTimeValue: {
    fontSize: 44,
    fontWeight: "900",
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  studyTimeUnitText: {
    fontSize: 16.5,
    fontWeight: "700",
  },
  studyTrendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  studyTrendText: {
    fontSize: 12,
    fontWeight: "900",
  },
  studyBreakdownDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  breakdownHeaderRow: {
    marginBottom: 10,
  },
  breakdownHeaderTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  premiumCardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  premiumCardItem: {
    flex: 1,
    minWidth: "46%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardValNum: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  cardLabelSub: {
    fontSize: 11.5,
    fontWeight: "700",
    marginTop: 8,
  },

  sectionCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
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
  },
  sectionSubtitle: {
    fontSize: 11.5,
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

  weeklySummaryBox: {
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
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
    fontWeight: "600",
    marginTop: 8,
  },

  shareBtn: {
    backgroundColor: "#2D62FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 4,
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14.5,
  },
});
