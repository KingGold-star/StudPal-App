import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import Svg, { Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";
import ScrollDownAnimatedCard from "./ScrollDownAnimatedCard";
import { useTheme } from "../../theme/themeContext";

const USE_NATIVE = Platform.OS !== "web";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ConsistencyRing({
  scorePercentage = 84,
  successfulDays = 21,
  activeDays = 25,
  size = 150,
  strokeWidth = 14,
  delay = 0,
}) {
  const { isDark, accentColor } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: scorePercentage,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE,
    }).start();
  }, [scorePercentage]);

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
              <LinearGradient id="consistencyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#6236FF" />
                <Stop offset="100%" stopColor="#A855F7" />
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
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#consistencyGrad)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={styles.centerOverlay}>
            <Text style={[styles.scoreText, isDark && { color: "#F8FAFC" }]}>{scorePercentage}%</Text>
            <Text style={[styles.subText, isDark && { color: "#94A3B8" }]}>CONSISTENCY</Text>
          </View>
        </View>

        <View style={[styles.calloutCard, isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }]}>
          <Text style={[styles.descriptionText, isDark && { color: "#CBD5E1" }]}>
            Completed planned goals on <Text style={[styles.highlightText, { color: accentColor || "#6236FF" }]}>{successfulDays} of {activeDays}</Text> active study days.
          </Text>
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
  scoreText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#6236FF",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  calloutCard: {
    backgroundColor: "rgba(98, 54, 255, 0.05)",
    borderColor: "rgba(98, 54, 255, 0.12)",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    maxWidth: 280,
  },
  descriptionText: {
    fontSize: 12.5,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
  },
  highlightText: {
    color: "#0F172A",
    fontWeight: "800",
  },
});
