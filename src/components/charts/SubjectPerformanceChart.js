import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from "react-native";
import ScrollDownAnimatedCard from "./ScrollDownAnimatedCard";
import { useTheme } from "../../theme/themeContext";

const USE_NATIVE = Platform.OS !== "web";

export default function SubjectPerformanceChart({
  subjectsData = [
    { id: "english", name: "English Language", color: "#EC4899", bg: "#FDF2F8", planned: 18, completed: 17, percentage: 94, icon: "📖" },
    { id: "chemistry", name: "Chemistry", color: "#F97316", bg: "#FFF3E8", planned: 10, completed: 9, percentage: 90, icon: "🧫" },
    { id: "math", name: "Mathematics", color: "#6236FF", bg: "#F0EEFF", planned: 12, completed: 10, percentage: 83, icon: "⚛️" },
    { id: "biology", name: "Biology", color: "#3B82F6", bg: "#EBF5FF", planned: 10, completed: 8, percentage: 80, icon: "🧬" },
    { id: "physics", name: "Physics", color: "#10B981", bg: "#E8FDF0", planned: 8, completed: 6, percentage: 75, icon: "🧪" },
  ],
  onSelectSubject,
  delay = 0,
}) {
  const { isDark, accentColor } = useTheme();
  const safeSubjects = Array.isArray(subjectsData) ? subjectsData : [];
  const sortedSubjects = [...safeSubjects].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

  const animValuesRef = useRef([]);
  while (animValuesRef.current.length < sortedSubjects.length) {
    animValuesRef.current.push(new Animated.Value(0));
  }

  useEffect(() => {
    sortedSubjects.forEach((s, i) => {
      const anim = animValuesRef.current[i];
      if (!anim || !s) return;
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: s.percentage || 0,
        duration: 1100 + i * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
  }, [subjectsData]);

  return (
    <ScrollDownAnimatedCard delay={delay} duration={1400}>
      <View style={styles.container}>
        {sortedSubjects.map((s, index) => {
          const anim = animValuesRef.current[index] || new Animated.Value(s ? s.percentage : 0);
          const widthPct = anim.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          });

          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.subjectRow, isDark && { borderBottomColor: "#1E293B" }]}
              onPress={() => onSelectSubject && onSelectSubject(s)}
              activeOpacity={0.75}
            >
              <View style={styles.headerRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={[styles.iconBox, { backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : s.bg }]}>
                    <Text style={{ fontSize: 15 }}>{s.icon}</Text>
                  </View>
                  <Text style={[styles.subjectName, isDark && { color: "#F8FAFC" }]}>{s.name}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.ratioText, isDark && { color: "#94A3B8" }]}>{s.completed} / {s.planned} goals</Text>
                  <Text style={[styles.pctText, { color: s.color }]}>{s.percentage}%</Text>
                </View>
              </View>

              {/* Horizontal Bar Track */}
              <View style={[styles.barTrack, isDark && { backgroundColor: "#1E293B" }]}>
                <Animated.View
                  style={[
                    styles.barFill,
                    {
                      width: widthPct,
                      backgroundColor: s.color,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollDownAnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 4,
  },
  subjectRow: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectName: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  ratioText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  pctText: {
    fontSize: 14,
    fontWeight: "900",
  },
  barTrack: {
    height: 9,
    backgroundColor: "#E2E8F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
});
