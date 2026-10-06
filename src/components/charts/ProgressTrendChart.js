import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line, G, Text as SvgText } from "react-native-svg";
import ScrollDownAnimatedCard from "./ScrollDownAnimatedCard";
import { useTheme } from "../../theme/themeContext";

export default function ProgressTrendChart({
  period = "Month",
  dataPoints,
  height = 190,
  delay = 0,
}) {
  const { isDark, accentColor } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const clipAnim = useRef(new Animated.Value(0)).current;

  // Default data points based on period if not explicitly supplied
  const defaultDataMap = {
    "Week": [
      { label: "Mon", value: 55, fullLabel: "Monday" },
      { label: "Tue", value: 65, fullLabel: "Tuesday" },
      { label: "Wed", value: 72, fullLabel: "Wednesday" },
      { label: "Thu", value: 68, fullLabel: "Thursday" },
      { label: "Fri", value: 85, fullLabel: "Friday" },
      { label: "Sat", value: 90, fullLabel: "Saturday" },
      { label: "Sun", value: 82, fullLabel: "Sunday" },
    ],
    "Month": [
      { label: "W1", value: 61, fullLabel: "Week 1" },
      { label: "W2", value: 68, fullLabel: "Week 2" },
      { label: "W3", value: 74, fullLabel: "Week 3" },
      { label: "W4", value: 82, fullLabel: "Week 4" },
    ],
    "3 Months": [
      { label: "Jun", value: 58, fullLabel: "June" },
      { label: "Jul", value: 72, fullLabel: "July" },
      { label: "Aug", value: 85, fullLabel: "August" },
    ],
  };

  const chartData = dataPoints || defaultDataMap[period] || defaultDataMap["Month"];
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    if (containerWidth > 0) {
      clipAnim.setValue(0);
      Animated.timing(clipAnim, {
        toValue: 100,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [containerWidth, period]);

  // Keep selected point in sync if period/data changes
  const activePoint = (selectedPoint && chartData.find((p) => p.label === selectedPoint.label)) || chartData[chartData.length - 1];

  const paddingLeft = 12;
  const paddingRight = 12;
  const paddingTop = 20;
  const paddingBottom = 34;

  const chartW = containerWidth > 0 ? containerWidth : 300;
  const usableW = Math.max(10, chartW - paddingLeft - paddingRight);
  const usableH = Math.max(10, height - paddingTop - paddingBottom);

  // Calculate dynamic scale for smooth curve visualization
  const rawValues = chartData.map((d) => d.value);
  const minVal = Math.max(0, Math.min(...rawValues) - 15);
  const maxVal = Math.min(100, Math.max(...rawValues) + 15);
  const valRange = Math.max(1, maxVal - minVal);

  const points = chartData.map((item, i) => {
    const x = paddingLeft + (i / Math.max(1, chartData.length - 1)) * usableW;
    const y = paddingTop + (1 - (item.value - minVal) / valRange) * usableH;
    return { ...item, x, y };
  });

  // Construct smooth cubic Bezier path
  let dPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    dPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  const areaBaselineY = height - paddingBottom;
  const areaPath = `${dPath} L ${points[points.length - 1].x} ${areaBaselineY} L ${points[0].x} ${areaBaselineY} Z`;

  const animatedWidth = clipAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, chartW],
  });

  return (
    <ScrollDownAnimatedCard delay={delay} duration={1400}>
      <View
        style={styles.container}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - containerWidth) > 1) {
            setContainerWidth(w);
          }
        }}
      >
        {/* Floating Dark Glass Tooltip */}
        {activePoint && (
          <View style={[
            styles.tooltipContainer,
            isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }
          ]}>
            <Text style={[styles.tooltipLabel, { color: accentColor || "#60A5FA" }]}>
              {(activePoint.fullLabel || activePoint.label).toUpperCase()}
            </Text>
            <Text style={styles.tooltipValue}>{activePoint.value}% goal completion</Text>
          </View>
        )}

        {/* SVG Container */}
        <View style={[styles.svgWrapper, { height }]}>
          {containerWidth > 0 && (
            <Animated.View
              style={{
                width: animatedWidth,
                overflow: "hidden",
                height: height,
              }}
            >
              <Svg width={chartW} height={height}>
                <Defs>
                  <LinearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={accentColor || "#2D62FF"} stopOpacity="0.28" />
                    <Stop offset="80%" stopColor={accentColor || "#2D62FF"} stopOpacity="0.04" />
                    <Stop offset="100%" stopColor={accentColor || "#2D62FF"} stopOpacity="0.0" />
                  </LinearGradient>
                  <LinearGradient id="trendStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor="#3B82F6" />
                    <Stop offset="50%" stopColor={accentColor || "#2D62FF"} />
                    <Stop offset="100%" stopColor="#1D4ED8" />
                  </LinearGradient>
                </Defs>

                {/* Grid lines */}
                <Line x1={paddingLeft} y1={paddingTop} x2={chartW - paddingRight} y2={paddingTop} stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9"} strokeWidth="1" strokeDasharray="4 4" />
                <Line x1={paddingLeft} y1={paddingTop + usableH / 2} x2={chartW - paddingRight} y2={paddingTop + usableH / 2} stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9"} strokeWidth="1" strokeDasharray="4 4" />
                <Line x1={paddingLeft} y1={areaBaselineY} x2={chartW - paddingRight} y2={areaBaselineY} stroke={isDark ? "#334155" : "#E2E8F0"} strokeWidth="1" />

                {/* Glowing Area Gradient Fill */}
                <Path d={areaPath} fill="url(#trendAreaGrad)" />

                {/* Bezier Line */}
                <Path d={dPath} fill="none" stroke="url(#trendStrokeGrad)" strokeWidth="3.5" strokeLinecap="round" />

                {/* Data Point Circles */}
                {points.map((pt, idx) => {
                  const isSelected = activePoint && activePoint.label === pt.label;
                  return (
                    <G key={idx}>
                      {isSelected && (
                        <G>
                          {/* Vertical Guideline */}
                          <Line x1={pt.x} y1={paddingTop} x2={pt.x} y2={areaBaselineY} stroke={accentColor || "#2D62FF"} strokeWidth="1.5" strokeDasharray="3 3" opacity={0.5} />
                          {/* Pulse Glow */}
                          <Circle cx={pt.x} cy={pt.y} r="13" fill={isDark ? "rgba(45, 98, 255, 0.3)" : "rgba(45, 98, 255, 0.18)"} />
                        </G>
                      )}
                      <Circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6.5 : 4.5}
                        fill={isSelected ? (accentColor || "#2D62FF") : (isDark ? "#0B0F19" : "#FFFFFF")}
                        stroke={accentColor || "#2D62FF"}
                        strokeWidth={isSelected ? 3 : 2.5}
                      />
                      {/* Label below axis */}
                      <SvgText
                        x={pt.x}
                        y={height - 10}
                        fontSize="11"
                        fontWeight={isSelected ? "800" : "600"}
                        fill={isSelected ? (accentColor || "#2D62FF") : (isDark ? "#94A3B8" : "#64748B")}
                        textAnchor="middle"
                      >
                        {pt.label}
                      </SvgText>
                    </G>
                  );
                })}
              </Svg>
            </Animated.View>
          )}

          {/* Transparent Interactive Overlay for Tapping Data Points */}
          {containerWidth > 0 && (
            <View style={[StyleSheet.absoluteFill, styles.touchOverlay]}>
              {points.map((pt) => {
                const itemW = usableW / Math.max(1, chartData.length - 1);
                return (
                  <TouchableOpacity
                    key={pt.label}
                    style={{
                      position: "absolute",
                      left: Math.max(0, pt.x - itemW / 2),
                      top: 0,
                      width: Math.max(36, itemW),
                      height: height,
                    }}
                    onPress={() => setSelectedPoint(pt)}
                    activeOpacity={0.7}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollDownAnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 4,
  },
  tooltipContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tooltipLabel: {
    color: "#60A5FA",
    fontSize: 9.5,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tooltipValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },
  svgWrapper: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  touchOverlay: {
    pointerEvents: "box-none",
  },
});
