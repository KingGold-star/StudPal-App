// src/components/XpHistoryModal.js

import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "./CustomModal";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../theme/themeContext";

const CloseIcon = ({ size = 20, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const BoltIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const DEFAULT_HISTORY = [
  {
    id: "hist_1",
    activityType: "LEADERSHIP_CHALLENGE",
    xpAmount: 100,
    title: "Leadership Challenge: Host 30m Focus Group",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    icon: "👥",
    bg: "#F0EEFF",
  },
  {
    id: "hist_2",
    activityType: "STUDY_SESSION",
    xpAmount: 50,
    title: "Completed 30m Focus Session",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    icon: "⚡",
    bg: "#FEF3C7",
  },
  {
    id: "hist_3",
    activityType: "TOPIC_MASTERY",
    xpAmount: 75,
    title: "Mastered: Organic Chemistry Flashcards",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    icon: "📚",
    bg: "#ECFDF5",
  },
  {
    id: "hist_4",
    activityType: "ACHIEVEMENT_UNLOCK",
    xpAmount: 120,
    title: "Unlocked: Consistent Learner Badge",
    timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
    icon: "🏆",
    bg: "#EFF6FF",
  },
  {
    id: "hist_5",
    activityType: "DAILY_STREAK",
    xpAmount: 30,
    title: "5-Day Study Streak Bonus",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    icon: "🔥",
    bg: "#FFF7ED",
  },
];

const getActivityIcon = (type) => {
  switch (type) {
    case "STUDY_SESSION": return { icon: "⚡", bg: "#FEF3C7" };
    case "TOPIC_MASTERY": return { icon: "📚", bg: "#ECFDF5" };
    case "ACHIEVEMENT_UNLOCK": return { icon: "🏆", bg: "#EFF6FF" };
    case "LEADERSHIP_CHALLENGE": return { icon: "👥", bg: "#F0EEFF" };
    default: return { icon: "⭐", bg: "#F1F5F9" };
  }
};

export default function XpHistoryModal({ history = [], visible, onClose }) {
  const insets = useSafeAreaInsets();
  const { isDark, accentColor } = useTheme();
  const styles = useMemo(() => getXpHistoryStyles(isDark, accentColor), [isDark, accentColor]);
  if (!visible) return null;

  const displayEvents = (history && history.length > 0) ? history : DEFAULT_HISTORY;
  const totalXpEarned = displayEvents.reduce((acc, curr) => acc + (curr.xpAmount || 0), 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
          {/* Drag Handle Indicator */}
          <View style={styles.dragHandle} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={styles.iconCircle}>
                <BoltIcon size={20} color={accentColor || "#6236FF"} />
              </View>
              <View>
                <Text style={styles.headerTitle}>XP Activity Log</Text>
                <Text style={styles.headerSub}>Detailed breakdown of earned points</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          {/* Quick Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryVal}>+{totalXpEarned} XP</Text>
              <Text style={styles.summaryLbl}>Log Summary</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCol}>
              <Text style={styles.summaryVal}>{displayEvents.length} Events</Text>
              <Text style={styles.summaryLbl}>Recorded</Text>
            </View>
          </View>

          {/* Scrollable Events List */}
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionHeaderTitle}>RECENT ACTIVITY</Text>
            {displayEvents.map((evt) => {
              const dateObj = evt.timestamp ? new Date(evt.timestamp) : new Date();
              const timeFormatted = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dateFormatted = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
              const { icon, bg } = evt.icon ? { icon: evt.icon, bg: evt.bg } : getActivityIcon(evt.activityType);

              return (
                <View key={evt.id || Math.random().toString()} style={styles.eventRow}>
                  <View style={[styles.eventIconCircle, { backgroundColor: bg }]}>
                    <Text style={{ fontSize: 18 }}>{icon}</Text>
                  </View>
                  <View style={styles.eventLeft}>
                    <Text style={styles.eventTitle}>{evt.title}</Text>
                    <Text style={styles.eventMeta}>
                      {dateFormatted} • {timeFormatted}
                    </Text>
                  </View>
                  <View style={styles.xpPill}>
                    <Text style={styles.xpPillText}>+{evt.xpAmount} XP</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const baseStyles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(15, 23, 42, 0.78)",
    justifyContent: "flex-end",
    zIndex: 99999,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "85%",
    width: "100%",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    overflow: "hidden",
  },
  dragHandle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  headerSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  summaryCol: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2E8F0",
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: "900",
    color: "#6236FF",
  },
  summaryLbl: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  listScroll: {
    maxHeight: 380,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#F8FAFC",
    gap: 12,
  },
  eventIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  eventLeft: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  eventMeta: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 3,
  },
  xpPill: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  xpPillText: {
    color: "#6236FF",
    fontWeight: "900",
    fontSize: 12.5,
  },
});

const getXpHistoryStyles = (isDark, accentColor) => {
  if (!isDark) return baseStyles;
  return {
    ...baseStyles,
    sheetContainer: [baseStyles.sheetContainer, { backgroundColor: "#1E293B" }],
    dragHandle: [baseStyles.dragHandle, { backgroundColor: "#334155" }],
    headerRow: [baseStyles.headerRow, { borderBottomWidth: 0, borderColor: "transparent" }],
    headerTitle: [baseStyles.headerTitle, { color: "#F8FAFC" }],
    headerSub: [baseStyles.headerSub, { color: "#94A3B8" }],
    closeBtn: [baseStyles.closeBtn, { backgroundColor: "#0F172A" }],
    summaryCard: [baseStyles.summaryCard, { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" }],
    summaryLbl: [baseStyles.summaryLbl, { color: "#94A3B8" }],
    summaryDivider: [baseStyles.summaryDivider, { backgroundColor: "transparent", width: 0 }],
    eventRow: [baseStyles.eventRow, { borderBottomWidth: 0, borderColor: "transparent" }],
    eventTitle: [baseStyles.eventTitle, { color: "#F8FAFC" }],
    eventMeta: [baseStyles.eventMeta, { color: "#94A3B8" }],
    xpPill: [baseStyles.xpPill, { backgroundColor: "#0F172A" }],
    xpPillText: [baseStyles.xpPillText, accentColor && { color: accentColor }],
    iconCircle: [baseStyles.iconCircle, { backgroundColor: "#0F172A" }],
  };
};
