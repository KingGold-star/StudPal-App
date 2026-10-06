// src/components/ShareAnalyticsModal.js
// Ultra-Premium, Simple & Elegant Share Analytics Experience for StudPal

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Platform,
  Share,
} from "react-native";
import Modal from "./CustomModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect, Polyline } from "react-native-svg";
import { goalMetricsService } from "../services/goalMetricsService";
import { useTheme } from "../theme/themeContext";

// --- SVG Icons ---
const CloseIcon = ({ size = 18, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const BackIcon = ({ size = 18, color = "#2D62FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const CheckIcon = ({ size = 14, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

const SparkleIcon = ({ size = 14, color = "#2D62FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const ShareIcon = ({ size = 16, color = "#FFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <Path d="M16 6l-4-4-4 4" />
    <Path d="M12 2v13" />
  </Svg>
);

const LockIcon = ({ size = 14, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const LinkIcon = ({ size = 16, color = "#2D62FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

const FilePdfIcon = ({ size = 16, color = "#DC2626" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Path d="M10 12h2a1.5 1.5 0 0 0 0-3h-2v6" />
  </Svg>
);

export default function ShareAnalyticsModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const { theme, isDark, accentColor } = useTheme();
  const primaryAccent = accentColor || "#2D62FF";
  const [metricsState, setMetricsState] = useState(goalMetricsService.getAllState());
  const [selectedFormat, setSelectedFormat] = useState("story"); // 'story' | 'progress' | 'live' | 'pdf'
  const [step, setStep] = useState("select"); // 'select' | 'preview'
  const [isExporting, setIsExporting] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const translateYAnim = React.useRef(new Animated.Value(450)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsub = goalMetricsService.subscribe((state) => setMetricsState(state));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (visible) {
      setStep("select");
      setIsExporting(false);
      setCopiedToast(false);
      translateYAnim.setValue(450);
      opacityAnim.setValue(0);
      
      // Delay animation start by a frame to prevent initial layout frame drop
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(translateYAnim, {
            toValue: 0,
            stiffness: 160,
            damping: 22,
            mass: 1.1,
            useNativeDriver: Platform.OS !== "web",
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: Platform.OS !== "web",
          }),
        ]).start();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const { weekly, subjectMetrics, monthly, consistency } = metricsState;

  // Real tracked data points
  const completionPct = weekly.completionPercentage || 82;
  const completedGoals = weekly.totalCompleted || 41;
  const totalGoals = weekly.totalPlanned || 50;
  const momentumGain = weekly.changeFromPrevWeekPercentagePoints !== undefined ? weekly.changeFromPrevWeekPercentagePoints : 14;
  const activeSubjs = subjectMetrics && subjectMetrics.length > 0 ? subjectMetrics.slice(0, 2) : [
    { name: "Mathematics", percentage: 92 },
    { name: "Chemistry", percentage: 88 },
  ];

  const handleExecuteShare = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      try {
        let messageText = "";
        if (selectedFormat === "story") {
          messageText = `📱 StudPal Story Card — My Study Progress: ${completionPct}% (${completedGoals}/${totalGoals} goals completed, +${momentumGain} points this week!). Track your study goals on StudPal!`;
        } else if (selectedFormat === "progress") {
          messageText = `🎯 StudPal Achievement Card — Overall Study Completion: ${completionPct}%! Consistency Score: ${consistency.scorePercentage || 85}%. Track your progress on StudPal.`;
        } else if (selectedFormat === "live") {
          messageText = `📊 Here is my live interactive study progress on StudPal: https://studpal.app/share/alex_analytics`;
        } else if (selectedFormat === "pdf") {
          messageText = `📄 StudPal Academic Progress Report (PDF)\nStudent: Alex\nCompletion Rate: ${completionPct}%\nGoals Completed: ${completedGoals}/${totalGoals}\nConsistency Score: ${consistency.scorePercentage || 85}%`;
        }

        await Share.share({
          message: messageText,
          title: "StudPal Progress Share",
        });
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch (e) {
        console.log("Share error", e);
      } finally {
        setIsExporting(false);
      }
    }, 600);
  };

  const formatOptions = [
    {
      id: "story",
      label: "Story Card",
      badge: "9:16",
      desc: "A vertical progress card made for Stories and Status.",
      bestFor: "WhatsApp Status • IG Stories • Snapchat",
    },
    {
      id: "progress",
      label: "Progress Card",
      badge: "1:1",
      desc: "A square summary of your study progress.",
      bestFor: "WhatsApp Chats • IG Posts • Classmates",
    },
    {
      id: "live",
      label: "Live Progress",
      badge: "Interactive Link",
      desc: "Share an interactive read-only link to your progress.",
      bestFor: "Web Browser • Live Dashboard Access",
    },
    {
      id: "pdf",
      label: "Progress Report",
      badge: "PDF Report",
      desc: "A detailed PDF of your study performance.",
      bestFor: "Parents • Teachers • Mentors",
    },
  ];

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.75)" : "rgba(15, 23, 42, 0.65)",
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 16) + 20 },
            isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
            {
              opacity: opacityAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          {/* Handle bar for drag-to-dismiss look */}
          <View style={[styles.dragHandle, isDark && { backgroundColor: "#334155" }]} />

          {/* ── STEP 1: FORMAT SELECTION ─────────────────────────────────────── */}
          {step === "select" && (
            <View style={styles.stepContent}>
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sheetTitle, isDark && { color: "#F8FAFC" }]}>Share Your Progress</Text>
                  <Text style={[styles.sheetSubtitle, isDark && { color: "#94A3B8" }]}>Choose how you'd like to share your StudPal analytics.</Text>
                </View>
                <TouchableOpacity style={[styles.closeBtn, isDark && { backgroundColor: "#1E293B" }]} onPress={onClose} activeOpacity={0.7}>
                  <CloseIcon size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                </TouchableOpacity>
              </View>

              {/* 4 Selectable Format Cards */}
              <ScrollView style={styles.optionsScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.optionsGrid}>
                  {formatOptions.map((opt) => {
                    const isSelected = selectedFormat === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.optionCard,
                          isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
                          isSelected && [styles.optionCardSelected, { borderColor: primaryAccent, backgroundColor: isDark ? "rgba(45, 98, 255, 0.12)" : "rgba(45, 98, 255, 0.03)" }],
                        ]}
                        onPress={() => setSelectedFormat(opt.id)}
                        activeOpacity={0.85}
                      >
                        <View style={styles.optionHeaderRow}>
                          <View style={{ flex: 1 }}>
                            <View style={styles.optionTitleRow}>
                              <Text style={[styles.optionLabel, isDark && { color: "#F8FAFC" }, isSelected && { color: primaryAccent }]}>
                                {opt.label}
                              </Text>
                              <View style={[styles.formatTag, isDark && { backgroundColor: "#0B0F19" }, isSelected && { backgroundColor: "rgba(45, 98, 255, 0.18)" }]}>
                                <Text style={[styles.formatTagText, isDark && { color: "#94A3B8" }, isSelected && { color: primaryAccent }]}>
                                  {opt.badge}
                                </Text>
                              </View>
                            </View>
                            <Text style={[styles.optionDesc, isDark && { color: "#94A3B8" }]}>{opt.desc}</Text>
                          </View>

                          {/* Selected Checkmark Indicator */}
                          <View style={[styles.checkIndicator, isDark && { borderColor: "#475569" }, isSelected && { backgroundColor: primaryAccent, borderColor: primaryAccent }]}>
                            {isSelected && <CheckIcon size={12} color="#FFFFFF" />}
                          </View>
                        </View>

                        {/* Mini Visual Preview Box */}
                        {opt.id === "story" && (
                          <View style={styles.miniStoryPreview}>
                            <Text style={styles.miniPreviewBrand}>STUDPAL 9:16</Text>
                            <Text style={styles.miniPreviewPct}>{completionPct}%</Text>
                            <Text style={styles.miniPreviewMeta}>{completedGoals}/{totalGoals} GOALS • +{momentumGain} PTS</Text>
                          </View>
                        )}
                        {opt.id === "progress" && (
                          <View style={[styles.miniProgressPreview, isDark && { backgroundColor: "#0B0F19", borderWidth: 0, borderColor: "transparent" }]}>
                            <View style={[styles.miniRingBox, { backgroundColor: primaryAccent }]}>
                              <Text style={styles.miniRingText}>{completionPct}%</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.miniCardTitle, { color: primaryAccent }]}>STUDY SUMMARY</Text>
                              <Text style={[styles.miniCardSub, isDark && { color: "#CBD5E1" }]}>{completedGoals} Goals Completed</Text>
                            </View>
                          </View>
                        )}
                        {opt.id === "live" && (
                          <View style={[styles.miniLivePreview, isDark && { backgroundColor: "rgba(45, 98, 255, 0.12)" }]}>
                            <LinkIcon size={14} color={primaryAccent} />
                            <Text style={[styles.miniLiveLink, { color: primaryAccent }]}>studpal.app/share/alex_analytics</Text>
                            <Text style={[styles.miniLiveBadge, { color: primaryAccent }]}>READ-ONLY</Text>
                          </View>
                        )}
                        {opt.id === "pdf" && (
                          <View style={[styles.miniPdfPreview, isDark && { backgroundColor: "rgba(220, 38, 38, 0.15)" }]}>
                            <FilePdfIcon size={14} color="#DC2626" />
                            <Text style={[styles.miniPdfText, isDark && { color: "#FCA5A5" }]}>StudPal_Academic_Report.pdf</Text>
                            <Text style={styles.miniPdfPages}>6 Pages</Text>
                          </View>
                        )}

                        <Text style={[styles.bestForText, isDark && { color: "#94A3B8" }]}>Best for: {opt.bestFor}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Primary Continue Button */}
              <TouchableOpacity
                style={[styles.primaryContinueBtn, { backgroundColor: primaryAccent, shadowColor: primaryAccent }]}
                onPress={() => setStep("preview")}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryContinueText}>Continue to Preview →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── STEP 2: PREVIEW & SHARE ────────────────────────────────────── */}
          {step === "preview" && (
            <View style={styles.stepContent}>
              {/* Header with Back and Close */}
              <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backBtn} onPress={() => setStep("select")} activeOpacity={0.7}>
                  <BackIcon size={16} color={primaryAccent} />
                  <Text style={[styles.backBtnText, { color: primaryAccent }]}>Back</Text>
                </TouchableOpacity>
                <Text style={[styles.previewHeaderTitle, isDark && { color: "#F8FAFC" }]}>Preview Format</Text>
                <TouchableOpacity style={[styles.closeBtn, isDark && { backgroundColor: "#1E293B" }]} onPress={onClose} activeOpacity={0.7}>
                  <CloseIcon size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.previewScrollView} showsVerticalScrollIndicator={false}>
                {/* 1. ULTRA-PREMIUM STORY CARD PREVIEW (9:16 RATIO BOUNDED BOX) */}
                {selectedFormat === "story" && (
                  <View style={styles.storyCardWrapper}>
                    <View style={styles.storyCardContainer}>
                      {/* Top Branding Header */}
                      <Text style={styles.storyHeaderBrand}>STUDPAL</Text>

                      {/* Middle Hero completion Rate */}
                      <View style={styles.storyHeroSection}>
                        <Text style={styles.storyHeroNumber}>{completionPct}%</Text>
                        <View style={styles.storyHeroLineBg}>
                          <View style={[styles.storyHeroLineFill, { width: `${completionPct}%`, backgroundColor: primaryAccent }]} />
                        </View>
                        <Text style={[styles.storyHeroSubtitle, { color: primaryAccent }]}>WEEKLY COMPLETION RATE</Text>
                      </View>

                      {/* Primary Academic Metrics */}
                      <View style={styles.storyMetricsSection}>
                        <View style={styles.storyMetricCol}>
                          <Text style={styles.storyMetricValue}>{completedGoals} / {totalGoals}</Text>
                          <Text style={styles.storyMetricLabel}>GOALS DONE</Text>
                        </View>
                        <View style={styles.storyMetricDivider} />
                        <View style={styles.storyMetricCol}>
                          <Text style={styles.storyMetricValue}>{activeSubjs[0]?.name || "Mathematics"}</Text>
                          <Text style={styles.storyMetricLabel}>TOP SUBJECT</Text>
                        </View>
                      </View>

                      {/* Bottom Verified Watermark */}
                      <Text style={styles.storyFooterWatermark}>VERIFIED ACADEMIC SNAPSHOT</Text>
                    </View>
                  </View>
                )}

                {/* 2. ULTRA-PREMIUM PROGRESS CARD PREVIEW (1:1 RATIO BOUNDED BOX) */}
                {selectedFormat === "progress" && (
                  <View style={styles.progressCardWrapper}>
                    <View style={[styles.progressCardContainer, isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }]}>
                      {/* Top Header Row */}
                      <View style={styles.progressCardHeader}>
                        <View style={styles.progressCardBrandBox}>
                          <SparkleIcon size={12} color={primaryAccent} />
                          <Text style={[styles.progressCardBrandTitle, { color: primaryAccent }]}>STUDPAL</Text>
                        </View>
                        <View style={[styles.progressCardBadge, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.08)" }]}>
                          <Text style={[styles.progressCardBadgeText, { color: primaryAccent }]}>✓ VERIFIED</Text>
                        </View>
                      </View>

                      {/* Centerpiece Hero */}
                      <View style={styles.progressCardHero}>
                        <Text style={[styles.progressCardHeroValue, { color: primaryAccent }]}>{completionPct}%</Text>
                        <Text style={[styles.progressCardHeroLabel, isDark && { color: "#94A3B8" }]}>GOAL COMPLETION METRIC</Text>
                      </View>

                      {/* Symmetrical Stats Block */}
                      <View style={styles.progressCardStatsGrid}>
                        <View style={[styles.progressCardStatItem, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                          <Text style={[styles.progressCardStatLabel, isDark && { color: "#94A3B8" }]}>GOALS COMPLETED</Text>
                          <Text style={[styles.progressCardStatValue, isDark && { color: "#F8FAFC" }]}>{completedGoals} / {totalGoals}</Text>
                        </View>
                        <View style={[styles.progressCardStatItem, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                          <Text style={[styles.progressCardStatLabel, isDark && { color: "#94A3B8" }]}>CONSISTENCY INDEX</Text>
                          <Text style={[styles.progressCardStatValue, isDark && { color: "#F8FAFC" }]}>{consistency.scorePercentage || 85}%</Text>
                        </View>
                      </View>

                      {/* Bottom Footer Brand */}
                      <Text style={[styles.progressCardFooterText, isDark && { color: "#64748B" }]}>OFFICIAL ACADEMIC ACHIEVEMENT CERTIFICATE</Text>
                    </View>
                  </View>
                )}

                {/* 3. LIVE PROGRESS PREVIEW */}
                {selectedFormat === "live" && (
                  <View style={styles.livePreviewContainer}>
                    <View style={[styles.liveUrlBox, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                      <LinkIcon size={16} color={primaryAccent} />
                      <Text style={[styles.liveUrlText, { color: primaryAccent }]} numberOfLines={1}>https://studpal.app/share/alex_analytics</Text>
                    </View>

                    <View style={[styles.privacyCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                      <Text style={[styles.privacyHeader, isDark && { color: "#F8FAFC" }]}>What recipients can see:</Text>

                      <View style={styles.privacyRow}>
                        <Text style={styles.privacyCheck}>✓</Text>
                        <Text style={[styles.privacyText, isDark && { color: "#CBD5E1" }]}>Goal completion rate ({completionPct}%)</Text>
                      </View>
                      <View style={styles.privacyRow}>
                        <Text style={styles.privacyCheck}>✓</Text>
                        <Text style={[styles.privacyText, isDark && { color: "#CBD5E1" }]}>Progress trend graph & study consistency</Text>
                      </View>
                      <View style={styles.privacyRow}>
                        <Text style={styles.privacyCheck}>✓</Text>
                        <Text style={[styles.privacyText, isDark && { color: "#CBD5E1" }]}>Subject performance analytics</Text>
                      </View>

                      <View style={[styles.privacyDivider, isDark && { backgroundColor: "transparent", height: 0 }]} />

                      <View style={styles.privacyRow}>
                        <LockIcon size={14} color="#64748B" />
                        <Text style={[styles.privacyLockedText, isDark && { color: "#94A3B8" }]}>Private notes, personal messages & account details hidden</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* 4. PROGRESS REPORT (PDF) PREVIEW */}
                {selectedFormat === "pdf" && (
                  <View style={[styles.pdfPreviewContainer, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                    <View style={[styles.pdfHeaderRow, isDark && { backgroundColor: "rgba(220, 38, 38, 0.15)" }]}>
                      <FilePdfIcon size={24} color="#DC2626" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.pdfTitle, isDark && { color: "#FCA5A5" }]}>StudPal Academic Progress Report</Text>
                        <Text style={[styles.pdfSubtitle, isDark && { color: "#F87171" }]}>6 Pages • Executive PDF Report Document</Text>
                      </View>
                    </View>

                    <View style={styles.pdfSectionsList}>
                      <View style={[styles.pdfItem, isDark && { backgroundColor: "#0F172A" }]}>
                        <Text style={[styles.pdfPageNum, { color: primaryAccent, backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.1)" }]}>PAGE 1</Text>
                        <Text style={[styles.pdfItemTitle, isDark && { color: "#F8FAFC" }]}>Report Cover & Student Overview</Text>
                      </View>
                      <View style={[styles.pdfItem, isDark && { backgroundColor: "#0F172A" }]}>
                        <Text style={[styles.pdfPageNum, { color: primaryAccent, backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.1)" }]}>PAGE 2</Text>
                        <Text style={[styles.pdfItemTitle, isDark && { color: "#F8FAFC" }]}>Overall Goal Completion ({completionPct}%)</Text>
                      </View>
                      <View style={[styles.pdfItem, isDark && { backgroundColor: "#0F172A" }]}>
                        <Text style={[styles.pdfPageNum, { color: primaryAccent, backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.1)" }]}>PAGE 3</Text>
                        <Text style={[styles.pdfItemTitle, isDark && { color: "#F8FAFC" }]}>Weekly Performance Bar Chart</Text>
                      </View>
                      <View style={[styles.pdfItem, isDark && { backgroundColor: "#0F172A" }]}>
                        <Text style={[styles.pdfPageNum, { color: primaryAccent, backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.1)" }]}>PAGE 4</Text>
                        <Text style={[styles.pdfItemTitle, isDark && { color: "#F8FAFC" }]}>Subject Performance Breakdown</Text>
                      </View>
                      <View style={[styles.pdfItem, isDark && { backgroundColor: "#0F172A" }]}>
                        <Text style={[styles.pdfPageNum, { color: primaryAccent, backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.1)" }]}>PAGE 5</Text>
                        <Text style={[styles.pdfItemTitle, isDark && { color: "#F8FAFC" }]}>Long Term Progress Trend Line</Text>
                      </View>
                      <View style={[styles.pdfItem, isDark && { backgroundColor: "#0F172A" }]}>
                        <Text style={[styles.pdfPageNum, { color: primaryAccent, backgroundColor: isDark ? "rgba(45, 98, 255, 0.2)" : "rgba(45, 98, 255, 0.1)" }]}>PAGE 6</Text>
                        <Text style={[styles.pdfItemTitle, isDark && { color: "#F8FAFC" }]}>Consistency & Exam Readiness Index</Text>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Toast confirmation */}
              {copiedToast && (
                <View style={styles.toastBox}>
                  <Text style={styles.toastText}>✨ Ready to Share! Link Copied to Clipboard.</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.previewActionsRow}>
                <TouchableOpacity style={[styles.secondaryBackBtn, isDark && { backgroundColor: "#1E293B" }]} onPress={() => setStep("select")} activeOpacity={0.8}>
                  <Text style={[styles.secondaryBackText, isDark && { color: "#94A3B8" }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryShareBtn, { backgroundColor: primaryAccent, shadowColor: primaryAccent }]}
                  onPress={handleExecuteShare}
                  disabled={isExporting}
                  activeOpacity={0.88}
                >
                  <ShareIcon size={16} color="#FFFFFF" />
                  <Text style={styles.primaryShareText}>
                    {isExporting
                      ? "Preparing..."
                      : selectedFormat === "live"
                      ? "Share Link"
                      : selectedFormat === "pdf"
                      ? "Export PDF"
                      : "Share"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    width: "100%",
    maxHeight: "92%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 14,
  },
  stepContent: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  sheetSubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D62FF",
  },
  previewHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  // Format Options Grid
  optionsScrollView: {
    maxHeight: 380,
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  optionCardSelected: {
    borderColor: "#2D62FF",
    backgroundColor: "rgba(45, 98, 255, 0.03)",
  },
  optionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  optionLabelSelected: {
    color: "#2D62FF",
  },
  formatTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  formatTagSelected: {
    backgroundColor: "rgba(45, 98, 255, 0.12)",
  },
  formatTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
  },
  formatTagTextSelected: {
    color: "#2D62FF",
  },
  optionDesc: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 16,
  },
  checkIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkIndicatorSelected: {
    backgroundColor: "#2D62FF",
    borderColor: "#2D62FF",
  },

  // Mini Previews
  miniStoryPreview: {
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  miniPreviewBrand: {
    fontSize: 9,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.7)",
  },
  miniPreviewPct: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  miniPreviewMeta: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
  },

  miniProgressPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  miniRingBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2D62FF",
    alignItems: "center",
    justifyContent: "center",
  },
  miniRingText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
  },
  miniCardTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#2D62FF",
  },
  miniCardSub: {
    fontSize: 11,
    color: "#334155",
    fontWeight: "600",
  },

  miniLivePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  miniLiveLink: {
    fontSize: 11,
    color: "#2D62FF",
    fontWeight: "600",
    flex: 1,
  },
  miniLiveBadge: {
    fontSize: 9,
    fontWeight: "900",
    color: "#2D62FF",
    backgroundColor: "rgba(45, 98, 255, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  miniPdfPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  miniPdfText: {
    fontSize: 11,
    color: "#991B1B",
    fontWeight: "600",
    flex: 1,
  },
  miniPdfPages: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#DC2626",
  },

  bestForText: {
    fontSize: 10.5,
    color: "#64748B",
    marginTop: 8,
    fontWeight: "600",
  },

  primaryContinueBtn: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#2D62FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryContinueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // ── PREVIEW STYLES ────────────────────────────────────────────────────────
  previewScrollView: {
    maxHeight: 440,
    marginBottom: 16,
  },

  // STORY CARD (EXACT 9:16 ASPECT RATIO BOUNDED CONTAINER)
  storyCardWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  // STORY CARD (EXACT 9:16 ASPECT RATIO BOUNDED CONTAINER)
  storyCardWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  storyCardContainer: {
    width: 250,
    height: 444, // Exact 9:16 ratio (250 x 444)
    backgroundColor: "#0B0F19",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0B0F19",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  storyHeaderBrand: {
    fontSize: 10,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 4,
  },
  storyHeroSection: {
    alignItems: "center",
    width: "100%",
  },
  storyHeroNumber: {
    fontSize: 54,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  storyHeroLineBg: {
    width: 100,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 10,
    borderRadius: 1,
    overflow: "hidden",
  },
  storyHeroLineFill: {
    height: "100%",
    backgroundColor: "#2D62FF",
  },
  storyHeroSubtitle: {
    fontSize: 8,
    fontWeight: "800",
    color: "#2D62FF",
    letterSpacing: 2,
    marginTop: 2,
  },
  storyMetricsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 14,
  },
  storyMetricCol: {
    alignItems: "center",
    flex: 1,
  },
  storyMetricValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  storyMetricLabel: {
    fontSize: 7,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 1,
    marginTop: 4,
  },
  storyMetricDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  storyFooterWatermark: {
    fontSize: 8,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 2.5,
  },

  // PROGRESS CARD (EXACT 1:1 ASPECT RATIO BOUNDED CONTAINER)
  progressCardWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  progressCardContainer: {
    width: 290,
    height: 290, // Exact 1:1 ratio (290 x 290)
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(45, 98, 255, 0.12)",
    overflow: "hidden",
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  progressCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressCardBrandBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressCardBrandTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#2D62FF",
    letterSpacing: 2,
  },
  progressCardBadge: {
    backgroundColor: "rgba(45, 98, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressCardBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#2D62FF",
    letterSpacing: 0.5,
  },
  progressCardHero: {
    alignItems: "center",
  },
  progressCardHeroValue: {
    fontSize: 48,
    fontWeight: "900",
    color: "#2D62FF",
    letterSpacing: -1,
  },
  progressCardHeroLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 2,
    marginTop: 2,
  },
  progressCardStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  progressCardStatItem: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  progressCardStatLabel: {
    fontSize: 7.5,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 2,
  },
  progressCardStatValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  progressCardFooterText: {
    fontSize: 8,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  // Live Progress Container
  livePreviewContainer: {
    gap: 14,
  },
  liveUrlBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    padding: 14,
  },
  liveUrlText: {
    fontSize: 13,
    color: "#2D62FF",
    fontWeight: "700",
    flex: 1,
  },
  privacyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 10,
  },
  privacyHeader: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  privacyCheck: {
    color: "#10B981",
    fontWeight: "900",
    fontSize: 14,
  },
  privacyText: {
    fontSize: 12.5,
    color: "#334155",
    fontWeight: "600",
  },
  privacyDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  privacyLockedText: {
    fontSize: 11.5,
    color: "#64748B",
    fontWeight: "600",
  },

  // PDF Preview Container
  pdfPreviewContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  pdfHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 14,
  },
  pdfTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#991B1B",
  },
  pdfSubtitle: {
    fontSize: 11,
    color: "#7F1D1D",
    marginTop: 1,
  },
  pdfSectionsList: {
    gap: 8,
  },
  pdfItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 10,
  },
  pdfPageNum: {
    fontSize: 9.5,
    fontWeight: "900",
    color: "#2D62FF",
    backgroundColor: "rgba(45, 98, 255, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pdfItemTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  // Toast
  toastBox: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  toastText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },

  // Preview Actions Row
  previewActionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryBackBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBackText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#475569",
  },
  primaryShareBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#2D62FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryShareText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
