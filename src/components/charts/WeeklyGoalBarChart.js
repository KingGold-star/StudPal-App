import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from "react-native";
import ScrollDownAnimatedCard from "./ScrollDownAnimatedCard";
import { useTheme } from "../../theme/themeContext";

export default function WeeklyGoalBarChart({
  dailyData = [
    { dayName: "Mon", planned: 4, completed: 4, percentage: 100, hasGoals: true },
    { dayName: "Tue", planned: 5, completed: 4, percentage: 80, hasGoals: true },
    { dayName: "Wed", planned: 4, completed: 2, percentage: 50, hasGoals: true },
    { dayName: "Thu", planned: 4, completed: 3, percentage: 75, hasGoals: true },
    { dayName: "Fri", planned: 5, completed: 5, percentage: 100, hasGoals: true },
    { dayName: "Sat", planned: 3, completed: 2, percentage: 67, hasGoals: true },
    { dayName: "Sun", planned: 0, completed: 0, percentage: 0, hasGoals: false },
  ],
  height = 190,
  delay = 0,
}) {
  const { isDark, accentColor } = useTheme();
  const safeData = Array.isArray(dailyData) && dailyData.length > 0 ? dailyData : [];
  const [selectedDay, setSelectedDay] = useState(safeData[1] || safeData[0] || null);
  const animValuesRef = useRef([]);

  // Sync selectedDay if data changes
  useEffect(() => {
    setSelectedDay((prev) => {
      if (!prev) return safeData[1] || safeData[0] || null;
      const found = safeData.find((d) => d && d.dayName === prev.dayName);
      return found || safeData[1] || safeData[0] || null;
    });
  }, [dailyData]);

  // Ensure we have an Animated.Value for every item
  while (animValuesRef.current.length < safeData.length) {
    animValuesRef.current.push(new Animated.Value(0));
  }

  useEffect(() => {
    safeData.forEach((item, i) => {
      const anim = animValuesRef.current[i];
      if (!anim || !item) return;
      anim.setValue(0);
      const targetPct = item.hasGoals ? (item.percentage || 0) : 6;
      Animated.timing(anim, {
        toValue: targetPct,
        duration: 1200 + i * 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
  }, [dailyData]);

  return (
    <ScrollDownAnimatedCard delay={delay} duration={1400}>
      <View style={styles.container}>
        {/* Floating Dark Glass Interactive Tooltip */}
        {selectedDay && (
          <View style={[
            styles.tooltipContainer,
            isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }
          ]}>
            <Text style={[styles.tooltipDay, { color: accentColor || "#60A5FA" }]}>
              {selectedDay.dayName ? selectedDay.dayName.toUpperCase() : ""}
            </Text>
            <Text style={styles.tooltipStats}>
              {selectedDay.hasGoals
                ? `${selectedDay.completed} of ${selectedDay.planned} goals • ${selectedDay.percentage}% completion`
                : "No goals scheduled"}
            </Text>
          </View>
        )}

        {/* Main Bar Chart Container */}
        <View style={[styles.chartBody, { height }]}>
          {/* Y-Axis Grid Lines */}
          <View style={styles.gridOverlay}>
            {[100, 75, 50, 25, 0].map((val) => (
              <View key={val} style={styles.gridLineRow}>
                <Text style={[styles.yAxisLabel, isDark && { color: "#64748B" }]}>{val}%</Text>
                <View style={[styles.gridLineDashed, isDark && { backgroundColor: "rgba(255, 255, 255, 0.08)" }]} />
              </View>
            ))}
          </View>

          {/* Bars Row */}
          <View style={styles.barsRow}>
            {safeData.map((item, index) => {
              const isSelected = selectedDay && item && selectedDay.dayName === item.dayName;
              const anim = animValuesRef.current[index] || new Animated.Value(item && item.hasGoals ? item.percentage : 6);
              const barHeightPct = anim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              });

              const barColor = !item.hasGoals
                ? (isDark ? "#1E293B" : "#E2E8F0")
                : isSelected
                ? (accentColor || "#2D62FF")
                : item.percentage === 100
                ? (accentColor || "#3B82F6")
                : item.percentage >= 70
                ? "#60A5FA"
                : "#93C5FD";

              return (
                <TouchableOpacity
                  key={item.dayName}
                  style={styles.barColumn}
                  onPress={() => setSelectedDay(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.barTrack}>
                    <Animated.View
                      style={[
                        styles.barFill,
                        {
                          height: barHeightPct,
                          backgroundColor: barColor,
                        },
                        isSelected && [styles.barFillSelected, { shadowColor: accentColor || "#2D62FF" }],
                      ]}
                    />
                  </View>

                  <View style={[
                    styles.xBadge,
                    isSelected && [styles.xBadgeSelected, { backgroundColor: accentColor || "#2D62FF" }]
                  ]}>
                    <Text style={[
                      styles.xLabel,
                      isDark && { color: "#94A3B8" },
                      isSelected && styles.xLabelSelected
                    ]}>
                      {item.dayName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollDownAnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  tooltipContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignSelf: "center",
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  tooltipDay: {
    color: "#60A5FA",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tooltipStats: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
    marginTop: 2,
  },
  chartBody: {
    position: "relative",
    justifyContent: "flex-end",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  gridLineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  yAxisLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#94A3B8",
    width: 24,
    textAlign: "right",
  },
  gridLineDashed: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 30,
    paddingRight: 4,
    height: "100%",
  },
  barColumn: {
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    flex: 1,
  },
  barTrack: {
    height: "78%",
    width: "72%",
    maxWidth: 36,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    borderRadius: 16,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 16,
  },
  barFillSelected: {
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
  xBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 8,
  },
  xBadgeSelected: {
    backgroundColor: "#2D62FF",
  },
  xLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  xLabelSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
