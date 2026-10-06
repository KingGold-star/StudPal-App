import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import Svg, { Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";
import ScrollDownAnimatedCard from "./ScrollDownAnimatedCard";
import { useTheme } from "../../theme/themeContext";

const USE_NATIVE = Platform.OS !== "web";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function GoalCompletionDonut({
  percentage = 80,
  completedCount = 4,
  totalCount = 5,
  remainingCount = 1,
  size = 210,
  strokeWidth = 18,
  hasGoals = true,
  delay = 0,
}) {
  const { isDark, accentColor } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const centerScale = useRef(new Animated.Value(0.9)).current;
  const centerOpacity = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    animatedValue.setValue(0);
    centerScale.setValue(0.9);
    centerOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: hasGoals ? Math.min(100, Math.max(0, percentage)) : 0,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE,
      }),
      Animated.timing(centerScale, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE,
      }),
      Animated.timing(centerOpacity, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE,
      }),
    ]).start();
  }, [percentage, hasGoals]);

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
              <LinearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#2D62FF" />
                <Stop offset="100%" stopColor="#60A5FA" />
              </LinearGradient>
              <LinearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#2D62FF" stopOpacity="0.08" />
                <Stop offset="100%" stopColor="#2D62FF" stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Inner Glow Fill */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius - strokeWidth / 2}
                fill="url(#innerGlow)"
              />
              {/* Track Circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={isDark ? "#1E293B" : "#F1F5F9"}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress Circle */}
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#donutGrad)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>

          {/* Center Content Overlay */}
          <Animated.View
            style={[
              styles.centerOverlay,
              {
                opacity: centerOpacity,
                transform: [{ scale: centerScale }],
              },
            ]}
          >
            {hasGoals ? (
              <>
                <Text style={[styles.percentageText, isDark && { color: "#F8FAFC" }]}>{percentage}%</Text>
                <Text style={[styles.centerLabel, isDark && { color: "#94A3B8" }]}>Goal Completion</Text>
              </>
            ) : (
              <>
                <Text style={[styles.noGoalsTitle, isDark && { color: "#94A3B8" }]}>REST DAY</Text>
                <Text style={[styles.noGoalsSub, isDark && { color: "#64748B" }]}>No Goals Planned</Text>
              </>
            )}
          </Animated.View>
        </View>

        {/* Sub-label information below donut */}
        <View style={styles.metaRow}>
          {hasGoals ? (
            <>
              <View style={[styles.metaBadge, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                <View style={[styles.dot, { backgroundColor: accentColor || "#2D62FF" }]} />
                <Text style={[styles.metaText, isDark && { color: "#F8FAFC" }]}>{completedCount} of {totalCount} goals completed</Text>
              </View>
              <View style={[styles.metaBadge, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
                <View style={[styles.dot, { backgroundColor: remainingCount === 0 ? "#10B981" : "#F59E0B" }]} />
                <Text style={[styles.metaText, isDark && { color: "#F8FAFC" }]}>
                  {remainingCount === 0 ? "All goals complete!" : `${remainingCount} goal remaining`}
                </Text>
              </View>
            </>
          ) : (
            <Text style={[styles.neutralMetaText, isDark && { color: "#94A3B8" }]}>No goals scheduled for today. Take a well-deserved rest!</Text>
          )}
        </View>
      </View>
    </ScrollDownAnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  centerOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1.5,
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  noGoalsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#64748B",
    letterSpacing: 1,
  },
  noGoalsSub: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 2,
  },
  metaRow: {
    alignItems: "center",
    gap: 8,
    marginTop: 18,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(45, 98, 255, 0.05)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(45, 98, 255, 0.12)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#1E293B",
  },
  neutralMetaText: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
  },
});
