import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";
import { useTheme } from "../../theme/themeContext";

export default function ExamReadinessCard({
  overallScore = 72,
  masteryPct = 70,
  goalPct = 80,
  revisionPct = 65,
  size = 130,
  strokeWidth = 12,
}) {
  const { isDark, accentColor } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - overallScore / 100);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Defs>
              <LinearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#2D62FF" />
                <Stop offset="100%" stopColor="#60A5FA" />
              </LinearGradient>
            </Defs>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={isDark ? "#1E293B" : "#F1F5F9"}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#readinessGrad)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={styles.centerOverlay}>
            <Text style={[styles.scoreText, isDark && { color: "#F8FAFC" }]}>{overallScore}%</Text>
            <Text style={[styles.subText, { color: accentColor || "#2D62FF" }]}>READINESS</Text>
          </View>
        </View>

        <View style={styles.factorsList}>
          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={[styles.factorName, isDark && { color: "#CBD5E1" }]}>Topic Mastery</Text>
              <Text style={[styles.factorPct, isDark && { color: "#F8FAFC" }]}>{masteryPct}%</Text>
            </View>
            <View style={[styles.factorTrackBg, isDark && { backgroundColor: "#1E293B" }]}>
              <View style={[styles.factorTrackFill, { width: `${masteryPct}%`, backgroundColor: accentColor || "#6236FF" }]} />
            </View>
          </View>

          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={[styles.factorName, isDark && { color: "#CBD5E1" }]}>Goal Completion</Text>
              <Text style={[styles.factorPct, isDark && { color: "#F8FAFC" }]}>{goalPct}%</Text>
            </View>
            <View style={[styles.factorTrackBg, isDark && { backgroundColor: "#1E293B" }]}>
              <View style={[styles.factorTrackFill, { width: `${goalPct}%`, backgroundColor: "#2D62FF" }]} />
            </View>
          </View>

          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={[styles.factorName, isDark && { color: "#CBD5E1" }]}>Revision Coverage</Text>
              <Text style={[styles.factorPct, isDark && { color: "#F8FAFC" }]}>{revisionPct}%</Text>
            </View>
            <View style={[styles.factorTrackBg, isDark && { backgroundColor: "#1E293B" }]}>
              <View style={[styles.factorTrackFill, { width: `${revisionPct}%`, backgroundColor: "#10B981" }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  centerOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 8.5,
    fontWeight: "800",
    color: "#2D62FF",
    letterSpacing: 0.8,
  },
  factorsList: {
    flex: 1,
    gap: 12,
  },
  factorItem: {
    gap: 4,
  },
  factorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  factorName: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#475569",
  },
  factorPct: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
  },
  factorTrackBg: {
    height: 7,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  factorTrackFill: {
    height: "100%",
    borderRadius: 4,
  },
});
