// src/components/QuizPerformanceScreen.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Animated,
  Easing,
  Platform,
} from "react-native";
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../theme/colors";

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ size = 20, color = "#0F172A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const TrophyIcon = ({ size = 24, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <Path d="M4 22h16" />
    <Path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34" />
    <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </Svg>
);

const SparkleIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

const AlertTriangleIcon = ({ size = 20, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Line x1="12" y1="9" x2="12" y2="13" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

const ClockIcon = ({ size = 18, color = "#3B82F6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const ZapIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const BrainIcon = ({ size = 20, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
    <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
  </Svg>
);

const NotebookIcon = ({ size = 20, color = "#F97316" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <Line x1="8" y1="7" x2="16" y2="7" />
    <Line x1="8" y1="11" x2="14" y2="11" />
  </Svg>
);

const RotateCcwIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 4v6h6" />
    <Path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </Svg>
);

const ShareIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Svg>
);

const LightbulbIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18h6" />
    <Path d="M10 22h4" />
    <Path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z" />
  </Svg>
);

const CheckIcon = ({ size = 14, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const CrossIcon = ({ size = 14, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

export default function QuizPerformanceScreen({
  quizResult,
  activeQuiz,
  user = { name: "Alex" },
  isDark = false,
  accentColor = "#2D62FF",
  t = (key) => key,
  onStartReviewSession,
  onOpenNotes,
  onRetakeQuiz,
  onBackToHub,
  onBackToQuizSelect,
}) {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all' | 'correct' | 'wrong'

  // Safe translation helper ensuring fallback is used if key is missing or unresolved
  const safeT = (key, fallback) => {
    try {
      const cleanKey = key.startsWith("study.") ? key.replace("study.", "") : key;
      const prefixedKey = `study.${cleanKey}`;
      const transPrefixed = typeof t === "function" ? t(prefixedKey) : null;
      if (transPrefixed && transPrefixed !== prefixedKey && transPrefixed !== cleanKey) {
        return transPrefixed;
      }
      const transDirect = typeof t === "function" ? t(cleanKey) : null;
      if (transDirect && transDirect !== cleanKey && transDirect !== prefixedKey) {
        return transDirect;
      }
    } catch (e) {}
    return fallback;
  };

  // Animation values
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const scoreScaleAnim = useRef(new Animated.Value(0.75)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scoreScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // Compute stats safely
  const score = quizResult?.score ?? 0;
  const correctCount = quizResult?.correctCount ?? 0;
  const totalQuestions = quizResult?.totalQuestions ?? (activeQuiz?.questions?.length || 5);
  const incorrectCount = Math.max(0, totalQuestions - correctCount);
  const durationSeconds = quizResult?.durationSeconds ?? 45;
  const topicName = quizResult?.topicName || activeQuiz?.topicName || "Quiz Topic";
  const questions = quizResult?.questions || activeQuiz?.questions || [];
  const answers = quizResult?.answers || {};
  const xpEarned = quizResult?.xpEarned || (score >= 95 ? 60 : score >= 85 ? 50 : score >= 70 ? 35 : 20);
  const previousMastery = quizResult?.previousMastery ?? 50;
  const newMastery = quizResult?.newMastery ?? Math.min(100, Math.max(20, Math.round(previousMastery * 0.7 + score * 0.3)));
  const masteryDelta = quizResult?.masteryDelta !== undefined ? quizResult.masteryDelta : (newMastery - previousMastery);

  // Time formatted
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const formattedDuration = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  const avgSecondsPerQ = Math.round(durationSeconds / Math.max(1, totalQuestions));

  // Determine performance tier
  const isFlawless = score === 100;
  const isHighPerformance = score >= 80;
  const isPassing = score >= 60;

  const tierTheme = useMemo(() => {
    if (isFlawless) {
      return {
        badge: "Flawless Mastery 🏆",
        letterGrade: "A+",
        accent: "#10B981",
        gradientStart: "#10B981",
        gradientEnd: "#059669",
        greeting: `Flawless Performance, ${user?.name || "Scholar"}! 🏆`,
        subtitle: `You mastered every single question on ${topicName}. Outstanding precision!`,
        pillBg: "rgba(16, 185, 129, 0.12)",
        pillBorder: "rgba(16, 185, 129, 0.28)",
      };
    } else if (isHighPerformance) {
      return {
        badge: "Distinction 🌟",
        letterGrade: "A",
        accent: "#2D62FF",
        gradientStart: "#2D62FF",
        gradientEnd: "#6366F1",
        greeting: `Outstanding Work, ${user?.name || "Scholar"}! 🌟`,
        subtitle: `You scored ${score}% on ${topicName}. Strong command of core concepts!`,
        pillBg: "rgba(45, 98, 255, 0.12)",
        pillBorder: "rgba(45, 98, 255, 0.28)",
      };
    } else if (isPassing) {
      return {
        badge: "Proficient 🎯",
        letterGrade: "B",
        accent: "#F59E0B",
        gradientStart: "#F59E0B",
        gradientEnd: "#D97706",
        greeting: `Solid Progress, ${user?.name || "Scholar"}! 🎯`,
        subtitle: `You passed with ${score}%. A targeted review of missed items will lock this in.`,
        pillBg: "rgba(245, 158, 11, 0.12)",
        pillBorder: "rgba(245, 158, 11, 0.28)",
      };
    } else {
      return {
        badge: "Needs Review 📚",
        letterGrade: "C-",
        accent: "#EF4444",
        gradientStart: "#EF4444",
        gradientEnd: "#B91C1C",
        greeting: `Valuable Practice, ${user?.name || "Scholar"}! 💪`,
        subtitle: `You scored ${score}%. StudPal has prioritized targeted flashcards to master this.`,
        pillBg: "rgba(239, 68, 68, 0.12)",
        pillBorder: "rgba(239, 68, 68, 0.28)",
      };
    }
  }, [score, isFlawless, isHighPerformance, isPassing, user?.name, topicName]);

  // AI Diagnostic insights
  const aiDiagnosis = useMemo(() => {
    const wrongIndices = [];
    const correctIndices = [];
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctIndices.push(idx + 1);
      } else {
        wrongIndices.push(idx + 1);
      }
    });

    let nailedMessage = "";
    if (correctIndices.length === totalQuestions) {
      nailedMessage = `Complete recall across all ${totalQuestions} questions. Core formulas and conceptual bounds applied with zero hesitation.`;
    } else if (correctIndices.length > 0) {
      nailedMessage = `Demonstrated solid command on Question ${correctIndices.join(", ")}. Strong conceptual foundation.`;
    } else {
      nailedMessage = "Gained direct exposure to exam-style problem formats and trap options.";
    }

    let reviewMessage = "";
    if (wrongIndices.length > 0) {
      reviewMessage = `Review Question ${wrongIndices.join(", ")}. Look out for specific distractors and edge cases highlighted in the explanations below.`;
    } else {
      reviewMessage = "No weak spots detected! You're ready to test yourself on advanced topics or progress to the next chapter.";
    }

    let srsMessage = "";
    if (wrongIndices.length > 0) {
      srsMessage = `StudPal Spaced Repetition has promoted ${wrongIndices.length} related flashcard${wrongIndices.length > 1 ? "s" : ""} to HIGH PRIORITY for immediate review within 24 hours.`;
    } else {
      srsMessage = `Topic mastery boosted to ${newMastery}%. Review intervals have been expanded according to the Ebbinghaus forgetting curve.`;
    }

    return {
      nailed: nailedMessage,
      review: reviewMessage,
      srs: srsMessage,
    };
  }, [questions, answers, totalQuestions, newMastery]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.map((q, idx) => {
      const isCorrect = answers[idx] === q.correctIndex;
      const userChoice = answers[idx] !== undefined ? answers[idx] : null;
      return {
        ...q,
        index: idx,
        isCorrect,
        userChoice,
      };
    }).filter((q) => {
      if (selectedFilter === "correct") return q.isCorrect;
      if (selectedFilter === "wrong") return !q.isCorrect;
      return true;
    });
  }, [questions, answers, selectedFilter]);

  // Handle native share
  const handleSharePerformance = async () => {
    try {
      await Share.share({
        title: `StudPal Quiz Performance: ${topicName}`,
        message: `🎉 I just scored ${score}% (${correctCount}/${totalQuestions}) on "${topicName}" in StudPal!\n⚡ Earned +${xpEarned} XP and grew my mastery to ${newMastery}%!\n📚 Studying smart with Spaced Repetition. #StudPal`,
      });
    } catch (error) {
      console.warn("Share error:", error);
    }
  };

  // Circular gauge calculations
  const gaugeSize = 136;
  const strokeWidth = 11;
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* ── TOP NAV BAR ────────────────────────────────────────────── */}
      <View style={[styles.navBar, isDark && styles.navBarDark]}>
        <TouchableOpacity
          style={[styles.backBtn, isDark && styles.backBtnDark]}
          onPress={onBackToQuizSelect || onBackToHub}
          activeOpacity={0.8}
        >
          <ChevronLeftIcon size={20} color={isDark ? "#F8FAFC" : "#0F172A"} />
        </TouchableOpacity>

        <View style={styles.navCenterBox}>
          <View style={[styles.navTopicPill, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.15)" : "rgba(45, 98, 255, 0.08)" }]}>
            <SparkleIcon size={12} color={accentColor} />
            <Text style={[styles.navTopicText, { color: accentColor }]} numberOfLines={1}>
              {topicName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.shareBtn, isDark && styles.shareBtnDark]}
          onPress={handleSharePerformance}
          activeOpacity={0.8}
        >
          <ShareIcon size={18} color={isDark ? "#94A3B8" : "#475569"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 80 },
        ]}
      >
        <Animated.View
          style={[
            styles.animatedContent,
            {
              opacity: entranceAnim,
              transform: [
                {
                  translateY: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* ── HERO CELEBRATION CARD ──────────────────────────────────── */}
          <View style={[styles.heroCard, isDark && styles.heroCardDark]}>
            {/* Score Ring Gauge */}
            <Animated.View
              style={[
                styles.gaugeContainer,
                { transform: [{ scale: scoreScaleAnim }] },
              ]}
            >
              <Svg width={gaugeSize} height={gaugeSize} style={styles.gaugeSvg}>
                <Defs>
                  <LinearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={tierTheme.gradientStart} />
                    <Stop offset="100%" stopColor={tierTheme.gradientEnd} />
                  </LinearGradient>
                </Defs>
                {/* Background Track */}
                <Circle
                  cx={gaugeSize / 2}
                  cy={gaugeSize / 2}
                  r={radius}
                  stroke={isDark ? "#334155" : "#E2E8F0"}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Active Progress */}
                <Circle
                  cx={gaugeSize / 2}
                  cy={gaugeSize / 2}
                  r={radius}
                  stroke="url(#scoreGrad)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform={`rotate(-90 ${gaugeSize / 2} ${gaugeSize / 2})`}
                />
              </Svg>

              <View style={styles.gaugeInnerLabel}>
                <Text style={[styles.gaugeScoreNumber, isDark && { color: "#F8FAFC" }]}>
                  {score}%
                </Text>
                <View style={[styles.gradeBadge, { backgroundColor: tierTheme.pillBg }]}>
                  <Text style={[styles.gradeBadgeText, { color: tierTheme.accent }]}>
                    {tierTheme.letterGrade}
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Performance Title & Personalized Greeting */}
            <View style={[styles.tierPill, { backgroundColor: tierTheme.pillBg, borderColor: tierTheme.pillBorder }]}>
              <Text style={[styles.tierPillText, { color: tierTheme.accent }]}>
                {tierTheme.badge}
              </Text>
            </View>

            <Text style={[styles.heroGreeting, isDark && { color: "#F8FAFC" }]}>
              {tierTheme.greeting}
            </Text>

            <Text style={[styles.heroSubtitle, isDark && { color: "#94A3B8" }]}>
              {tierTheme.subtitle}
            </Text>
          </View>

          {/* ── 4 BENTO PERFORMANCE METRIC CARDS ───────────────────────── */}
          <View style={styles.bentoContainer}>
            {/* Row 1: Accuracy & XP Gained */}
            <View style={styles.bentoRow}>
              {/* Accuracy Card */}
              <View style={[styles.bentoCard, isDark && styles.bentoCardDark]}>
                <View style={styles.bentoTopRow}>
                  <View style={[styles.bentoIconWrap, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5" }]}>
                    <CheckCircleIcon size={18} color="#10B981" />
                  </View>
                  <Text style={[styles.bentoMetricPill, isDark && { backgroundColor: "#0F172A", color: "#94A3B8" }]} numberOfLines={1}>
                    {correctCount}/{totalQuestions}
                  </Text>
                </View>
                <Text style={[styles.bentoMainVal, isDark && { color: "#F8FAFC" }]} numberOfLines={1}>
                  {score}%
                </Text>
                <Text style={[styles.bentoLabel, isDark && { color: "#94A3B8" }]} numberOfLines={1}>
                  {safeT("accuracy", "Accuracy")}
                </Text>
                {/* Mini Segmented Bar */}
                <View style={styles.miniSegmentBar}>
                  {questions.map((q, idx) => {
                    const isRight = answers[idx] === q.correctIndex;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.miniSegmentItem,
                          {
                            backgroundColor: isRight ? "#10B981" : "#EF4444",
                            flex: 1,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              {/* XP Gained Card */}
              <View style={[styles.bentoCard, isDark && styles.bentoCardDark]}>
                <View style={styles.bentoTopRow}>
                  <View style={[styles.bentoIconWrap, { backgroundColor: isDark ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB" }]}>
                    <ZapIcon size={18} color="#F59E0B" />
                  </View>
                  <Text style={[styles.bentoMetricPill, { backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#D97706" }]} numberOfLines={1}>
                    {score >= 85 ? "Bonus ⚡" : "Earned"}
                  </Text>
                </View>
                <Text style={[styles.bentoMainVal, isDark && { color: "#F8FAFC" }]} numberOfLines={1}>
                  +{xpEarned} XP
                </Text>
                <Text style={[styles.bentoLabel, isDark && { color: "#94A3B8" }]} numberOfLines={1}>
                  {safeT("xpEarned", "XP Gained")}
                </Text>
                <Text style={[styles.bentoSubnote, isDark && { color: "#64748B" }]} numberOfLines={1}>
                  {score >= 70 ? "Accuracy bonus" : "Practice XP"}
                </Text>
              </View>
            </View>

            {/* Row 2: Time Spent & Topic Mastery */}
            <View style={styles.bentoRow}>
              {/* Time / Pacing Card */}
              <View style={[styles.bentoCard, isDark && styles.bentoCardDark]}>
                <View style={styles.bentoTopRow}>
                  <View style={[styles.bentoIconWrap, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF" }]}>
                    <ClockIcon size={18} color="#3B82F6" />
                  </View>
                  <Text style={[styles.bentoMetricPill, isDark && { backgroundColor: "#0F172A", color: "#94A3B8" }]} numberOfLines={1}>
                    ~{avgSecondsPerQ}s/q
                  </Text>
                </View>
                <Text style={[styles.bentoMainVal, isDark && { color: "#F8FAFC" }]} numberOfLines={1}>
                  {formattedDuration}
                </Text>
                <Text style={[styles.bentoLabel, isDark && { color: "#94A3B8" }]} numberOfLines={1}>
                  {safeT("timeSpent", "Time Spent")}
                </Text>
                <Text style={[styles.bentoSubnote, isDark && { color: "#64748B" }]} numberOfLines={1}>
                  {avgSecondsPerQ <= 20 ? "⚡ Swift recall" : "🧠 Deliberate"}
                </Text>
              </View>

              {/* Topic Mastery Growth Card */}
              <View style={[styles.bentoCard, isDark && styles.bentoCardDark]}>
                <View style={styles.bentoTopRow}>
                  <View style={[styles.bentoIconWrap, { backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "#F5F3FF" }]}>
                    <TrophyIcon size={18} color="#8B5CF6" />
                  </View>
                  <Text
                    style={[
                      styles.bentoMetricPill,
                      {
                        backgroundColor: masteryDelta >= 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                        color: masteryDelta >= 0 ? "#10B981" : "#EF4444",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {masteryDelta >= 0 ? `+${masteryDelta}%` : `${masteryDelta}%`}
                  </Text>
                </View>
                <Text style={[styles.bentoMainVal, isDark && { color: "#F8FAFC" }]} numberOfLines={1}>
                  {newMastery}%
                </Text>
                <Text style={[styles.bentoLabel, isDark && { color: "#94A3B8" }]} numberOfLines={1}>
                  {safeT("topicMastery", "Topic Mastery")}
                </Text>
                {/* Mastery Progress Bar */}
                <View style={[styles.masteryProgressTrack, isDark && { backgroundColor: "#334155" }]}>
                  <View
                    style={[
                      styles.masteryProgressFill,
                      { width: `${Math.min(100, Math.max(5, newMastery))}%`, backgroundColor: accentColor },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* ── AI DIAGNOSTIC & COACH INSIGHTS ─────────────────────────── */}
          <View style={[styles.aiCard, isDark && styles.aiCardDark]}>
            <View style={styles.aiCardHeaderRow}>
              <View style={[styles.aiIconBubble, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.1)" }]}>
                <SparkleIcon size={18} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.aiCardHeaderTitle, isDark && { color: "#F8FAFC" }]}>
                  {safeT("aiInsightsTitle", "StudPal AI Diagnostic")}
                </Text>
                <Text style={[styles.aiCardHeaderSub, isDark && { color: "#94A3B8" }]}>
                  Personalized analysis for {user?.name || "you"}
                </Text>
              </View>
            </View>

            {/* Strengths */}
            <View style={styles.aiInsightBlock}>
              <View style={styles.aiInsightTitleRow}>
                <CheckCircleIcon size={16} color="#10B981" />
                <Text style={[styles.aiInsightSectionTitle, { color: "#10B981" }]}>
                  {safeT("whatYouNailed", "What You Nailed")}
                </Text>
              </View>
              <Text style={[styles.aiInsightBody, isDark && { color: "#CBD5E1" }]}>
                {aiDiagnosis.nailed}
              </Text>
            </View>

            {/* Growth / Concept Review */}
            {incorrectCount > 0 && (
              <View style={[styles.aiInsightBlock, styles.aiInsightBlockBordered, isDark && { borderColor: "#334155" }]}>
                <View style={styles.aiInsightTitleRow}>
                  <AlertTriangleIcon size={16} color="#EF4444" />
                  <Text style={[styles.aiInsightSectionTitle, { color: "#EF4444" }]}>
                    {safeT("conceptsToReview", "Concepts to Review")}
                  </Text>
                </View>
                <Text style={[styles.aiInsightBody, isDark && { color: "#CBD5E1" }]}>
                  {aiDiagnosis.review}
                </Text>
              </View>
            )}

            {/* SRS Adaptive Strategy */}
            <View style={[styles.aiInsightBlock, styles.aiInsightBlockBordered, isDark && { borderColor: "#334155" }]}>
              <View style={styles.aiInsightTitleRow}>
                <BrainIcon size={16} color={accentColor} />
                <Text style={[styles.aiInsightSectionTitle, { color: accentColor }]}>
                  {safeT("srsAdaptiveStrategy", "SRS Adaptive Strategy")}
                </Text>
              </View>
              <Text style={[styles.aiInsightBody, isDark && { color: "#CBD5E1" }]}>
                {aiDiagnosis.srs}
              </Text>
            </View>
          </View>

          {/* ── QUESTION-BY-QUESTION REVIEW SECTION ───────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && { color: "#F8FAFC" }]}>
              Question Breakdown
            </Text>
            <Text style={[styles.sectionSubtitle, isDark && { color: "#94A3B8" }]}>
              Detailed analysis of your answers and expert explanations
            </Text>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === "all" && [styles.filterPillActive, { backgroundColor: accentColor, borderColor: accentColor }],
                isDark && selectedFilter !== "all" && styles.filterPillDark,
              ]}
              onPress={() => setSelectedFilter("all")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === "all" ? styles.filterPillTextActive : isDark && { color: "#94A3B8" },
                ]}
              >
                All ({totalQuestions})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === "correct" && [styles.filterPillActive, { backgroundColor: "#10B981", borderColor: "#10B981" }],
                isDark && selectedFilter !== "correct" && styles.filterPillDark,
              ]}
              onPress={() => setSelectedFilter("correct")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === "correct" ? styles.filterPillTextActive : isDark && { color: "#94A3B8" },
                ]}
              >
                Correct ({correctCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === "wrong" && [styles.filterPillActive, { backgroundColor: "#EF4444", borderColor: "#EF4444" }],
                isDark && selectedFilter !== "wrong" && styles.filterPillDark,
              ]}
              onPress={() => setSelectedFilter("wrong")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === "wrong" ? styles.filterPillTextActive : isDark && { color: "#94A3B8" },
                ]}
              >
                Review ({incorrectCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Question Review Cards List */}
          <View style={styles.questionsReviewList}>
            {filteredQuestions.map((q) => {
              const userOptText = q.userChoice !== null ? q.options[q.userChoice] : "No Answer";
              const correctOptText = q.options[q.correctIndex];
              const userLetter = q.userChoice !== null ? String.fromCharCode(65 + q.userChoice) : "-";
              const correctLetter = String.fromCharCode(65 + q.correctIndex);

              return (
                <View
                  key={q.index}
                  style={[
                    styles.questionReviewCard,
                    isDark && styles.questionReviewCardDark,
                    q.isCorrect ? styles.questionCardBorderCorrect : styles.questionCardBorderWrong,
                  ]}
                >
                  {/* Card Header Row */}
                  <View style={styles.questionCardTopRow}>
                    <View style={styles.questionNumberRow}>
                      <View
                        style={[
                          styles.statusIconCircle,
                          { backgroundColor: q.isCorrect ? "#10B981" : "#EF4444" },
                        ]}
                      >
                        {q.isCorrect ? <CheckIcon size={12} /> : <CrossIcon size={12} />}
                      </View>
                      <Text style={[styles.questionNumberText, isDark && { color: "#F8FAFC" }]}>
                        Question {q.index + 1}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor: q.isCorrect
                            ? (isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5")
                            : (isDark ? "rgba(239, 68, 68, 0.15)" : "#FEF2F2"),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          { color: q.isCorrect ? "#10B981" : "#EF4444" },
                        ]}
                      >
                        {q.isCorrect ? "Correct ✓" : "Needs Review ✗"}
                      </Text>
                    </View>
                  </View>

                  {/* Question Prompt */}
                  <Text style={[styles.questionPromptText, isDark && { color: "#F8FAFC" }]}>
                    {q.question}
                  </Text>

                  {/* Answers Display */}
                  <View style={styles.optionsReviewBox}>
                    {/* User's Choice */}
                    <View
                      style={[
                        styles.optionRow,
                        q.isCorrect ? styles.optionRowCorrect : styles.optionRowWrong,
                        isDark && (q.isCorrect ? { backgroundColor: "rgba(16, 185, 129, 0.12)" } : { backgroundColor: "rgba(239, 68, 68, 0.12)" }),
                      ]}
                    >
                      <View
                        style={[
                          styles.optionLetterBadge,
                          { backgroundColor: q.isCorrect ? "#10B981" : "#EF4444" },
                        ]}
                      >
                        <Text style={styles.optionLetterBadgeText}>{userLetter}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.optionRowLabel, { color: q.isCorrect ? "#059669" : "#DC2626" }]}>
                          {safeT("yourAnswer", "Your Answer")}
                        </Text>
                        <Text style={[styles.optionRowText, isDark && { color: "#F8FAFC" }]}>
                          {userOptText}
                        </Text>
                      </View>
                    </View>

                    {/* True Correct Answer (if user got it wrong) */}
                    {!q.isCorrect && (
                      <View
                        style={[
                          styles.optionRow,
                          styles.optionRowCorrect,
                          isDark && { backgroundColor: "rgba(16, 185, 129, 0.12)" },
                        ]}
                      >
                        <View style={[styles.optionLetterBadge, { backgroundColor: "#10B981" }]}>
                          <Text style={styles.optionLetterBadgeText}>{correctLetter}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.optionRowLabel, { color: "#059669" }]}>
                            {safeT("correctAnswer", "Correct Answer")}
                          </Text>
                          <Text style={[styles.optionRowText, isDark && { color: "#F8FAFC" }]}>
                            {correctOptText}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Explanation Callout */}
                  {q.explanation ? (
                    <View style={[styles.explanationBox, isDark && styles.explanationBoxDark]}>
                      <View style={styles.explanationHeaderRow}>
                        <LightbulbIcon size={15} color="#F59E0B" />
                        <Text style={[styles.explanationHeading, isDark && { color: "#FCD34D" }]}>
                          Key Concept & Explanation
                        </Text>
                      </View>
                      <Text style={[styles.explanationText, isDark && { color: "#CBD5E1" }]}>
                        {q.explanation}
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>

          {/* ── ACTION HUB DOCK (PREMIUM CTAs) ─────────────────────────── */}
          <View style={[styles.actionsCard, isDark && styles.actionsCardDark]}>
            <Text style={[styles.actionsCardTitle, isDark && { color: "#F8FAFC" }]}>
              Recommended Next Steps
            </Text>

            {/* Primary Action: Spaced Repetition Practice */}
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: accentColor, shadowColor: accentColor }]}
              onPress={() => onStartReviewSession && onStartReviewSession(quizResult?.subjectId, quizResult?.topicId)}
              activeOpacity={0.88}
            >
              <BrainIcon size={20} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>
                {incorrectCount > 0
                  ? safeT("reviewSrsFlashcards", "Strengthen Weak Spots in Flashcards")
                  : safeT("practiceTopicFlashcards", "Practice Flashcards on Topic")}
              </Text>
            </TouchableOpacity>

            {/* Secondary Action: Topic Notes */}
            <TouchableOpacity
              style={[
                styles.secondaryActionBtn,
                { borderColor: "#F97316", backgroundColor: isDark ? "rgba(249, 115, 22, 0.12)" : "#FFF7ED" },
              ]}
              onPress={() => onOpenNotes && onOpenNotes(quizResult?.subjectId, quizResult?.topicId)}
              activeOpacity={0.88}
            >
              <NotebookIcon size={18} color="#EA580C" />
              <Text style={[styles.secondaryActionBtnText, { color: "#EA580C" }]}>
                {safeT("openTopicNotes", "Review Topic Notes")}
              </Text>
            </TouchableOpacity>

            {/* Tertiary Action: Retake Quiz */}
            <TouchableOpacity
              style={[
                styles.secondaryActionBtn,
                isDark ? { backgroundColor: "#0F172A", borderColor: "#334155" } : { backgroundColor: "#F8FAFC", borderColor: "#CBD5E1" },
              ]}
              onPress={() => onRetakeQuiz && onRetakeQuiz(activeQuiz)}
              activeOpacity={0.88}
            >
              <RotateCcwIcon size={18} color={isDark ? "#94A3B8" : "#475569"} />
              <Text style={[styles.secondaryActionBtnText, isDark && { color: "#CBD5E1" }]}>
                {safeT("retakeQuiz", "Retake Quiz (Shuffled)")}
              </Text>
            </TouchableOpacity>

            {/* Return to Hub */}
            <TouchableOpacity
              style={styles.backLinkBtn}
              onPress={onBackToHub}
              activeOpacity={0.7}
            >
              <Text style={[styles.backLinkText, isDark && { color: "#94A3B8" }]}>
                {safeT("backToStudyHub", "Return to Study Hub")}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  containerDark: {
    backgroundColor: "#0B0F19",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  navBarDark: {
    backgroundColor: "#0F172A",
    borderBottomColor: "#1E293B",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnDark: {
    backgroundColor: "#1E293B",
  },
  navCenterBox: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  navTopicPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  navTopicText: {
    fontSize: 13,
    fontWeight: "700",
  },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtnDark: {
    backgroundColor: "#1E293B",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
  },
  animatedContent: {
    width: "100%",
    gap: 16,
  },

  // Hero Card
  heroCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
    overflow: "hidden",
  },
  heroCardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    shadowOpacity: 0.25,
  },
  gaugeContainer: {
    width: 136,
    height: 136,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  gaugeSvg: {
    position: "absolute",
  },
  gaugeInnerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeScoreNumber: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1,
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  tierPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  tierPillText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  heroGreeting: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },

  // Bento Grid (2 Rows x 2 Columns - 100% fluid & responsive)
  bentoContainer: {
    width: "100%",
    gap: 12,
  },
  bentoRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  bentoCardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  bentoTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bentoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bentoMetricPill: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    color: "#475569",
  },
  bentoMainVal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  bentoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
  },
  bentoSubnote: {
    fontSize: 10,
    color: "#94A3B8",
    lineHeight: 13,
  },
  miniSegmentBar: {
    flexDirection: "row",
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
    gap: 2,
    width: "100%",
    marginTop: 4,
  },
  miniSegmentItem: {
    height: "100%",
    borderRadius: 2,
  },
  masteryProgressTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
    marginTop: 4,
  },
  masteryProgressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // AI Diagnostic Card
  aiCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
    overflow: "hidden",
  },
  aiCardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  aiCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  aiIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  aiCardHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  aiCardHeaderSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  aiInsightBlock: {
    gap: 4,
  },
  aiInsightBlockBordered: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  aiInsightTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aiInsightSectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  aiInsightBody: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
    paddingLeft: 22,
  },

  // Section Header
  sectionHeader: {
    marginTop: 8,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },

  // Filter Pills
  filterPillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  filterPillDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  filterPillActive: {
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },

  // Questions Review List
  questionsReviewList: {
    gap: 12,
  },
  questionReviewCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    gap: 12,
    overflow: "hidden",
  },
  questionReviewCardDark: {
    backgroundColor: "#1E293B",
  },
  questionCardBorderCorrect: {
    borderColor: "rgba(16, 185, 129, 0.35)",
  },
  questionCardBorderWrong: {
    borderColor: "rgba(239, 68, 68, 0.35)",
  },
  questionCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: "800",
  },
  questionPromptText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    lineHeight: 22,
  },
  optionsReviewBox: {
    gap: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionRowCorrect: {
    backgroundColor: "#ECFDF5",
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  optionRowWrong: {
    backgroundColor: "#FEF2F2",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  optionLetterBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  optionRowLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  optionRowText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  explanationBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  explanationBoxDark: {
    backgroundColor: "#0F172A",
    borderColor: "#334155",
  },
  explanationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  explanationHeading: {
    fontSize: 12,
    fontWeight: "800",
    color: "#B45309",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  explanationText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },

  // Actions Card
  actionsCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  actionsCardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  actionsCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  primaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  secondaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },
  backLinkBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  backLinkText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
});
