import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import Svg, { Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";
import ScrollDownAnimatedCard from "./ScrollDownAnimatedCard";
import { useTheme } from "../../theme/themeContext";

const USE_NATIVE = Platform.OS !== "web";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function GoalBreakdownDonut({
  completed = 86,
  remaining = 24,
  total = 110,
  percentage = 78,
  size = 160,
  strokeWidth = 16,
  delay = 0,
}) {
  const { isDark, accentColor } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const completedPct = total > 0 ? (completed / total) * 100 : 78;

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: completedPct,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE,
    }).start();
  }, [completedPct]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <ScrollDownAnimatedCard delay={delay} duration={1400}>
      <View style={styles.container}>
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Defs>
              <LinearGradient id="breakdownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#2D62FF" />
                <Stop offset="100%" stopColor="#3B82F6" />
              </LinearGradient>
            </Defs>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Background Circle (Remaining) */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={isDark ? "#1E293B" : "#E2E8F0"}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Foreground Arc (Completed) */}
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#breakdownGrad)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={styles.centerOverlay}>
            <Text style={[styles.pctText, isDark && { color: "#F8FAFC" }]}>{percentage}%</Text>
            <Text style={[styles.subText, isDark && { color: "#94A3B8" }]}>{completed} / {total}</Text>
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={[
            styles.legendChip,
            isDark
              ? { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }
              : { backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" }
          ]}>
            <View style={[styles.legendDot, { backgroundColor: accentColor || "#2D62FF" }]} />
            <Text style={[styles.legendLabel, isDark && { color: "#CBD5E1" }]}>Completed</Text>
            <Text style={[styles.legendVal, { color: accentColor || "#2D62FF" }]}>{completed}</Text>
          </View>

          <View style={[
            styles.legendChip,
            isDark
              ? { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }
              : { backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }
          ]}>
            <View style={[styles.legendDot, { backgroundColor: "#94A3B8" }]} />
            <Text style={[styles.legendLabel, isDark && { color: "#CBD5E1" }]}>Remaining</Text>
            <Text style={[styles.legendVal, isDark ? { color: "#94A3B8" } : { color: "#64748B" }]}>{remaining}</Text>
          </View>
        </View>
      </View>
    </ScrollDownAnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
  },
  centerOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pctText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 1,
  },
  legendRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  legendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  legendVal: {
    fontSize: 13,
    fontWeight: "800",
  },
});
