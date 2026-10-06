// src/components/WelcomeInsightsModal.js
// Pixel-perfect Premium Pop-Up Info Card displaying performance insights on app launch

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from "react-native";
import Modal from "./CustomModal";
import Svg, { Path, Circle, Rect, Polyline } from "react-native-svg";
import { goalMetricsService } from "../services/goalMetricsService";
import { useTheme } from "../theme/themeContext";

// --- SVG Icons matching reference design ---
const CloseIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const SparkleIcon = ({ size = 14, color = "#2D62FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const CheckIcon = ({ size = 14, color = "#2D62FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

const TrophyIcon = ({ size = 32, color = "#2563EB" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <Path d="M4 22h16" />
    <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </Svg>
);

const LineChartIcon = ({ size = 22, color = "#2563EB" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <Polyline points="17 6 23 6 23 12" />
  </Svg>
);

const RocketIcon = ({ size = 22, color = "#059669" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <Path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
  </Svg>
);

const TargetIcon = ({ size = 22, color = "#7C3AED" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const LightbulbIcon = ({ size = 22, color = "#D97706" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18h6" />
    <Path d="M10 22h4" />
    <Path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.6 2.95 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
  </Svg>
);

const GradCapIcon = ({ size = 18, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <Path d="M6 12v5c3 3 9 3 12 0v-5" />
  </Svg>
);

export default function WelcomeInsightsModal({ visible, onClose }) {
  const { theme, isDark, accentColor } = useTheme();
  const [metricsState, setMetricsState] = useState(goalMetricsService.getAllState());
  const scaleAnim = React.useRef(new Animated.Value(0.92)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsub = goalMetricsService.subscribe((state) => setMetricsState(state));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.92);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const { weekly, subjectMetrics, monthly } = metricsState;

  // 1. Peak Performance Day
  let peakDayText = "Complete your first study goal to establish your peak day!";
  if (weekly && weekly.totalCompleted > 0 && weekly.bestDay) {
    const rawDay = weekly.bestDay;
    const formattedDay = rawDay.endsWith("s") ? rawDay : `${rawDay}s`;
    peakDayText = `You complete the most goals on ${formattedDay}.`;
  }

  // 2. Weekly Momentum
  let momentumText = `Your weekly goal completion rate is currently at ${weekly ? weekly.completionPercentage : 0}% this week.`;
  if (weekly && weekly.changeFromPrevWeekPercentagePoints !== undefined) {
    const pts = weekly.changeFromPrevWeekPercentagePoints;
    if (pts > 0) {
      momentumText = `Your weekly goal completion improved by ${pts} percentage points this week.`;
    } else if (pts < 0) {
      momentumText = `Your weekly goal completion shifted by ${pts} percentage points compared to last week.`;
    }
  }

  // 3. Monthly / Weekly Progress
  const completedGoalsCount = (weekly && weekly.totalCompleted !== undefined) ? weekly.totalCompleted : (monthly ? monthly.totalCompleted : 0);
  const completionRatePct = (weekly && weekly.completionPercentage !== undefined) ? weekly.completionPercentage : (monthly ? monthly.completionPercentage : 0);
  const progressText = `You've completed ${completedGoalsCount} study goals this week with an overall completion rate of ${completionRatePct}%.`;

  // 4. Focus Recommendation
  let focusText = "All scheduled subjects are on track! Great job maintaining study balance.";
  const activeSubjects = subjectMetrics ? subjectMetrics.filter((s) => s.planned > 0) : [];
  if (activeSubjects.length > 0) {
    const sorted = [...activeSubjects].sort((a, b) => a.percentage - b.percentage);
    const lowest = sorted[0];
    if (lowest) {
      focusText = `${lowest.name} is currently your lowest goal-completion subject (${lowest.percentage}%).`;
    }
  }

  const primaryAccent = accentColor || "#2563EB";

  const cardItems = [
    {
      id: "peak_day",
      IconComponent: LineChartIcon,
      iconColor: primaryAccent,
      iconBg: isDark ? "rgba(37, 99, 235, 0.16)" : "#EFF6FF",
      checkBg: isDark ? "rgba(37, 99, 235, 0.16)" : "#EFF6FF",
      checkColor: primaryAccent,
      title: "Peak Performance Day",
      text: peakDayText,
    },
    {
      id: "weekly_momentum",
      IconComponent: RocketIcon,
      iconColor: "#10B981",
      iconBg: isDark ? "rgba(16, 185, 129, 0.16)" : "#ECFDF5",
      checkBg: isDark ? "rgba(16, 185, 129, 0.16)" : "#ECFDF5",
      checkColor: "#10B981",
      title: "Weekly Momentum",
      text: momentumText,
    },
    {
      id: "monthly_progress",
      IconComponent: TargetIcon,
      iconColor: "#8B5CF6",
      iconBg: isDark ? "rgba(139, 92, 246, 0.16)" : "#F5F3FF",
      checkBg: isDark ? "rgba(139, 92, 246, 0.16)" : "#F5F3FF",
      checkColor: "#8B5CF6",
      title: "Monthly Progress",
      text: progressText,
    },
    {
      id: "focus_recommendation",
      IconComponent: LightbulbIcon,
      iconColor: "#F59E0B",
      iconBg: isDark ? "rgba(245, 158, 11, 0.16)" : "#FFFBEB",
      checkBg: isDark ? "rgba(245, 158, 11, 0.16)" : "#FFFBEB",
      checkColor: "#F59E0B",
      title: "Focus Recommendation",
      text: focusText,
    },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation?.()}
          style={{ width: "100%", alignItems: "center" }}
        >
          <Animated.View
            style={[
              styles.cardContainer,
              isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Top Header Row with Badge and Close */}
            <View style={styles.headerRow}>
              <View style={[styles.badgePill, isDark && { backgroundColor: "rgba(37, 99, 235, 0.18)" }]}>
                <SparkleIcon size={14} color={primaryAccent} />
                <Text style={[styles.badgeText, { color: primaryAccent }]}>PERFORMANCE SNAPSHOT</Text>
              </View>
              <TouchableOpacity style={[styles.closeBtn, isDark && { backgroundColor: "#1E293B" }]} onPress={onClose} activeOpacity={0.7}>
                <CloseIcon size={18} color={isDark ? "#94A3B8" : "#64748B"} />
              </TouchableOpacity>
            </View>

            {/* Center Trophy Celebration Header */}
            <View style={styles.trophySection}>
              <View style={styles.trophySparkleWrap}>
                <View style={[styles.miniSparkle, { top: -4, left: 4 }]}>
                  <SparkleIcon size={11} color="#A5B4FC" />
                </View>
                <View style={[styles.miniSparkle, { top: -6, right: 6 }]}>
                  <SparkleIcon size={11} color="#A5B4FC" />
                </View>
                <View style={[styles.miniSparkle, { bottom: 4, left: -6 }]}>
                  <SparkleIcon size={10} color="#818CF8" />
                </View>
                <View style={[styles.miniSparkle, { bottom: 6, right: -4 }]}>
                  <SparkleIcon size={10} color="#818CF8" />
                </View>

                <View style={[styles.trophyCircle, isDark && { backgroundColor: "#1E293B" }]}>
                  <TrophyIcon size={26} color={primaryAccent} />
                </View>
              </View>

              <Text style={[styles.headlineText, isDark && { color: "#F8FAFC" }]}>Congratulations! 🥳</Text>
              <Text style={[styles.subtextText, isDark && { color: "#94A3B8" }]}>Here are your personalized study insights for today:</Text>
            </View>

            {/* 4 Insight Cards List */}
            <ScrollView
              style={styles.cardsScrollView}
              contentContainerStyle={styles.cardsList}
              showsVerticalScrollIndicator={false}
            >
              {cardItems.map((item) => {
                const IconComp = item.IconComponent;
                return (
                  <View key={item.id} style={[styles.insightCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                    {/* Left Rounded Tinted Icon Box */}
                    <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                      <IconComp size={19} color={item.iconColor} />
                    </View>

                    {/* Middle Content */}
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, isDark && { color: "#93C5FD" }]}>{item.title}</Text>
                      <Text style={[styles.cardText, isDark && { color: "#CBD5E1" }]}>{item.text}</Text>
                    </View>

                    {/* Right Checkmark Circle Badge */}
                    <View style={[styles.checkCircle, { backgroundColor: item.checkBg }]}>
                      <CheckIcon size={11} color={item.checkColor} />
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Action Button */}
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: primaryAccent }]} onPress={onClose} activeOpacity={0.88}>
              <View style={styles.btnRow}>
                <GradCapIcon size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Let's Study!</Text>
                <Text style={{ fontSize: 16 }}>🚀</Text>
              </View>
            </TouchableOpacity>

            {/* Footer Encouragement Subtext */}
            <Text style={[styles.footerText, isDark && { color: "#94A3B8" }]}>💙 Keep going! You're doing great.</Text>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(10, 15, 30, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    zIndex: 99999,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 365,
    maxHeight: "96%",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#2563EB",
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  trophySection: {
    alignItems: "center",
    marginBottom: 10,
  },
  trophySparkleWrap: {
    position: "relative",
    marginBottom: 6,
  },
  trophyCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  miniSparkle: {
    position: "absolute",
    zIndex: 2,
  },
  headlineText: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtextText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    fontWeight: "500",
  },
  cardsScrollView: {
    width: "100%",
    marginBottom: 12,
    flexGrow: 0,
  },
  cardsList: {
    gap: 8,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#F1F5F9",
    padding: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 1,
  },
  cardText: {
    fontSize: 11.5,
    color: "#475569",
    lineHeight: 15,
    fontWeight: "500",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtn: {
    width: "100%",
    height: 44,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "800",
  },
  footerText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});
