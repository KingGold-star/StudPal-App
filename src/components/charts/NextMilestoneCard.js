import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import { useTheme } from "../../theme/themeContext";

const USE_NATIVE = Platform.OS !== "web";

export default function NextMilestoneCard({
  title = "100 Goals Completed",
  currentCount = 86,
  targetCount = 100,
}) {
  const { isDark, accentColor } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const pct = Math.min(100, Math.round((currentCount / Math.max(1, targetCount)) * 100));
  const remaining = Math.max(0, targetCount - currentCount);

  useEffect(() => {
    animatedWidth.setValue(0);
    Animated.timing(animatedWidth, {
      toValue: pct,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={[styles.iconBox, isDark && { backgroundColor: "#1E293B" }]}>
            <Text style={{ fontSize: 18 }}>💯</Text>
          </View>
          <View>
            <Text style={[styles.milestonePre, { color: accentColor || "#2D62FF" }]}>NEXT MILESTONE</Text>
            <Text style={[styles.milestoneTitle, isDark && { color: "#F8FAFC" }]}>{title}</Text>
          </View>
        </View>
        <Text style={[styles.countText, { color: accentColor || "#2D62FF" }]}>{currentCount} / {targetCount}</Text>
      </View>

      <View style={[styles.trackBg, isDark && { backgroundColor: "#1E293B" }]}>
        <Animated.View style={[styles.trackFill, { width: widthInterpolate, backgroundColor: accentColor || "#2D62FF" }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={[styles.remainingText, isDark && { color: "#94A3B8" }]}>{remaining} goals to go</Text>
        <Text style={[styles.pctText, { color: accentColor || "#2D62FF" }]}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 0,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  milestonePre: {
    fontSize: 9.5,
    fontWeight: "900",
    color: "#2D62FF",
    letterSpacing: 1.2,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 1,
  },
  countText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#2D62FF",
  },
  trackBg: {
    height: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    backgroundColor: "#2D62FF",
    borderRadius: 5,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remainingText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#64748B",
  },
  pctText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#2D62FF",
  },
});
