import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

// Dynamic SVG Pie Chart that computes exact wedge coordinates for any percentage
function MilestonePieChart({ percentage = 10, size = 210, isDark = false }) {
  const radius = 90;
  const center = 100;

  // Clamp percentage between 1 and 99 for clean sector rendering
  const clampedPercent = Math.max(1, Math.min(99, percentage));
  
  // Angle calculations: 0% starts at top (12 o'clock, -90 deg)
  const startAngle = -Math.PI / 2;
  const sweepAngle = (clampedPercent / 100) * 2 * Math.PI;
  const endAngle = startAngle + sweepAngle;

  const x0 = center + radius * Math.cos(startAngle);
  const y0 = center + radius * Math.sin(startAngle);
  const x1 = center + radius * Math.cos(endAngle);
  const y1 = center + radius * Math.sin(endAngle);

  const largeArcFlag = clampedPercent > 50 ? 1 : 0;
  const pathData = `M ${center} ${center} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;

  // Position the label inside the sector center
  const midAngle = startAngle + sweepAngle / 2;
  const labelRadius = radius * 0.60;
  const labelX = center + labelRadius * Math.cos(midAngle);
  const labelY = center + labelRadius * Math.sin(midAngle) + 4.5;

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* Background Ring / Circle */}
      <Circle cx={center} cy={center} r={radius} fill={isDark ? '#1E293B' : '#F1F5F9'} />

      {/* Active Brand Blue Wedge */}
      <Path d={pathData} fill="#1200C6" />

      {/* Percentage Label */}
      <SvgText
        x={labelX.toFixed(1)}
        y={labelY.toFixed(1)}
        fill="#FFFFFF"
        fontSize="14"
        fontWeight="800"
        textAnchor="middle"
      >
        {clampedPercent}%
      </SvgText>
    </Svg>
  );
}

export default function OnboardingFirstMilestoneScreen({
  onContinue,
  onBack,
  targetData = { label: 'In 3 months', days: 90 },
  studyDays = ['mon', 'wed', 'fri', 'sat'],
  dailyStudyTime = '45 min',
  goal = null,
  completedSessions = 1,
  milestoneSessions = 1,
  milestonePercent = 10,
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const resolvedMilestoneSessions = typeof milestoneSessions === 'number' ? milestoneSessions : 1;
  const displayPercent = typeof milestonePercent === 'number' ? milestonePercent : 10;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.bg }]}
      onPress={onContinue}
      activeOpacity={0.98}
    >
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Top Section */}
          <View style={styles.topSection}>
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>
              your first{'\n'}milestone
            </Text>

            {/* 10% Pie Chart */}
            <Animated.View
              style={[
                styles.chartContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <MilestonePieChart percentage={displayPercent} size={210} isDark={isDark} />
            </Animated.View>

            {/* Milestone Data Details */}
            <View style={styles.textDetailsSection}>
              <Text style={[styles.headlineText, { color: theme.textPrimary }]}>
                your first milestone is{'\n'}
                <Text style={[styles.highlightText, { color: theme.textPrimary }]}>
                  {resolvedMilestoneSessions} {resolvedMilestoneSessions === 1 ? 'study session' : 'study sessions'}.
                </Text>
              </Text>
              <Text style={[styles.subtextNote, { color: theme.textSecondary }]}>
                small progress adds up.
              </Text>
            </View>
          </View>

          {/* Bottom Footer Button */}
          <TouchableOpacity
            style={styles.footerButton}
            onPress={onContinue}
            activeOpacity={0.7}
          >
            <Text style={[styles.footerButtonText, { color: theme.textPrimary }]}>tap to continue ➔</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: 10,
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 42,
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 44,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  textDetailsSection: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headlineText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  highlightText: {
    color: '#0F172A',
  },
  subtextNote: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  footerButton: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  footerButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
});
