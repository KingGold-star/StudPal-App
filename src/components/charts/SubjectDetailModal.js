import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import GoalCompletionDonut from "./GoalCompletionDonut";
import GoalBreakdownDonut from "./GoalBreakdownDonut";
import WeeklyGoalBarChart from "./WeeklyGoalBarChart";
import { useTheme } from "../../theme/themeContext";

const CloseIcon = ({ size = 20, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export default function SubjectDetailModal({ visible, subject, onClose }) {
  const insets = useSafeAreaInsets();
  const { isDark, accentColor } = useTheme();
  if (!subject) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, isDark && { backgroundColor: "#0B0F19" }]} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[styles.headerRow, isDark && { backgroundColor: "#0B0F19", borderBottomColor: "#1E293B" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 24 }}>{subject.icon}</Text>
            <View>
              <Text style={[styles.subjectPre, { color: accentColor || "#2D62FF" }]}>SUBJECT ANALYTICS</Text>
              <Text style={[styles.subjectName, isDark && { color: "#F8FAFC" }]}>{subject.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.closeBtn, isDark && { backgroundColor: "#1E293B" }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <CloseIcon size={20} color={isDark ? "#94A3B8" : "#475569"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 24 }]} showsVerticalScrollIndicator={false}>
          {/* Section 1: Main Subject Donut */}
          <View style={[styles.sectionCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
            <Text style={[styles.sectionTitle, isDark && { color: "#F8FAFC" }]}>Overall Subject Progress</Text>
            <GoalCompletionDonut
              percentage={subject.percentage}
              completedCount={subject.completed}
              totalCount={subject.planned}
              remainingCount={subject.planned - subject.completed}
              size={180}
              strokeWidth={14}
            />
          </View>

          {/* Section 2: Weekly Subject Bar Chart */}
          <View style={[styles.sectionCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
            <Text style={[styles.sectionTitle, isDark && { color: "#F8FAFC" }]}>Weekly Goal Performance</Text>
            <WeeklyGoalBarChart height={140} />
          </View>

          {/* Section 3: Goal Composition */}
          <View style={[styles.sectionCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
            <Text style={[styles.sectionTitle, isDark && { color: "#F8FAFC" }]}>Goal Composition</Text>
            <GoalBreakdownDonut
              completed={subject.completed}
              remaining={subject.planned - subject.completed}
              total={subject.planned}
              percentage={subject.percentage}
              size={140}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  subjectPre: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2D62FF",
    letterSpacing: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
});
