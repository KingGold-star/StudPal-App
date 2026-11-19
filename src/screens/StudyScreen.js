import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Animated,
  Easing,
} from "react-native";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import TooltipTouchable from "../components/TooltipTouchable";
import Modal from "../components/CustomModal";
import QuizPerformanceScreen from "../components/QuizPerformanceScreen";
import { gamificationService } from "../services/gamification/gamificationService";
import { studyService } from "../services/studyService";
import { settingsService } from "../services/settings/settingsService";
import { voiceRecordingService } from "../services/voiceRecordingService";
import { useTranslation, normalizeLanguageCode } from "../services/i18n/i18nService";
import { Colors } from "../theme/colors";
import { useTheme } from "../theme/themeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ size = 20, color = "#0F172A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const ChevronDownIcon = ({ size = 14, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

const TactilePressable = ({ onPress, style, children, activeScale = 0.94, ...props }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: activeScale,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={style}
      {...props}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const FolderIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Svg>
);

const BrainIcon = ({ size = 22, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04" />
    <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04" />
  </Svg>
);

const TargetIcon = ({ size = 22, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const NotebookIcon = ({ size = 22, color = "#F97316" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <Path d="M8 7h8" />
    <Path d="M8 11h6" />
  </Svg>
);

const SparkleIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1C12 8 16 12 23 12 16 12 12 16 12 23 12 16 8 12 1 12 8 12 12 8 12 1Z" />
  </Svg>
);

const PlayIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M8 5v14l11-7z" />
  </Svg>
);

const PauseIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </Svg>
);

const RotateCcwIcon = ({ size = 16, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 4v6h6" />
    <Path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </Svg>
);

const VolumeIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </Svg>
);

const LightbulbIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18h6" />
    <Path d="M10 22h4" />
    <Path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.59 2.96 1.5 4 .76.76 1.23 1.52 1.41 2.5h6.18z" />
  </Svg>
);

const BookmarkIcon = ({ size = 18, color = "#64748B", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const SearchIcon = ({ size = 18, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const PlusIcon = ({ size = 18, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14" />
    <Path d="M5 12h14" />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

const AlertTriangleIcon = ({ size = 20, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Path d="M12 9v4" />
    <Path d="M12 17h.01" />
  </Svg>
);

const EditIcon = ({ size = 16, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

const TrashIcon = ({ size = 16, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const CloseIcon = ({ color = "#64748B", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const CheckIcon = ({ size = 15, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const PinIcon = ({ size = 14, color = "#6236FF", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="17" x2="12" y2="22" />
    <Path d="M5 17h14v-2l-2-2V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8l-2 2v2z" />
  </Svg>
);

const InfoIcon = ({ size = 14, color = "#3B82F6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="16" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
);

const MicIcon = ({ color = "#FFFFFF", size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2a3.2 3.2 0 0 0-3.2 3.2v6.6a3.2 3.2 0 0 0 6.4 0V5.2A3.2 3.2 0 0 0 12 2z" fill={color} />
    <Path d="M19 10.5v1a7 7 0 0 1-14 0v-1" strokeWidth="2.2" />
    <Line x1="12" y1="18.5" x2="12" y2="22" strokeWidth="2.2" />
    <Line x1="7.5" y1="22" x2="16.5" y2="22" strokeWidth="2.2" />
  </Svg>
);

const StopSquareIcon = ({ color = "#FFFFFF", size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="4" fill={color} />
  </Svg>
);

const PostIcon = ({ color = "#FFFFFF", size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 2L11 13" />
    <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

// ── Formatting Toolbar Icons ────────────────────────────────────────────────
const UndoIcon = ({ size = 16, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 14L4 9l5-5" />
    <Path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
  </Svg>
);

const RedoIcon = ({ size = 16, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 14l5-5-5-5" />
    <Path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
  </Svg>
);

const BoldIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <Path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </Svg>
);

const ItalicIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="4" x2="10" y2="4" />
    <Line x1="14" y1="20" x2="5" y2="20" />
    <Line x1="15" y1="4" x2="9" y2="20" />
  </Svg>
);

const StrikethroughIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 4H9a3 3 0 0 0-2.83 4M6 12h12M14 12c.5 0 3 .5 3 4a4 4 0 0 1-4 4H7" />
  </Svg>
);

const HeadingIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 6v12M20 6v12M4 12h16" />
  </Svg>
);

const BulletListIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="9" y1="6" x2="20" y2="6" />
    <Line x1="9" y1="12" x2="20" y2="12" />
    <Line x1="9" y1="18" x2="20" y2="18" />
    <Circle cx="4" cy="6" r="1.5" fill={color} />
    <Circle cx="4" cy="12" r="1.5" fill={color} />
    <Circle cx="4" cy="18" r="1.5" fill={color} />
  </Svg>
);

const NumberListIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="10" y1="6" x2="21" y2="6" />
    <Line x1="10" y1="12" x2="21" y2="12" />
    <Line x1="10" y1="18" x2="21" y2="18" />
    <Path d="M4 7V4h1M4 14h2M4 11h2v3H4" />
  </Svg>
);

const ChecklistIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

const FormulaIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19L9 5l4 14 3-7h4" />
  </Svg>
);

const CodeIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  </Svg>
);

const QuoteIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8zM15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8z" />
  </Svg>
);

const HighlightIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 11l-6 6v3h3l6-6" />
    <Path d="M22 7l-3-3a2 2 0 0 0-2.83 0L10.5 9.67l5.83 5.83L22 9.83a2 2 0 0 0 0-2.83z" />
  </Svg>
);

const DividerIcon = ({ size = 15, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="3" y1="12" x2="21" y2="12" strokeDasharray="3 3" />
  </Svg>
);

const KeyboardDismissIcon = ({ size = 16, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="4" width="20" height="12" rx="2" />
    <Line x1="6" y1="8" x2="6.01" y2="8" strokeWidth="2.5" />
    <Line x1="10" y1="8" x2="10.01" y2="8" strokeWidth="2.5" />
    <Line x1="14" y1="8" x2="14.01" y2="8" strokeWidth="2.5" />
    <Line x1="18" y1="8" x2="18.01" y2="8" strokeWidth="2.5" />
    <Line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="2.5" />
    <Line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="2.5" />
    <Line x1="9" y1="12" x2="15" y2="12" strokeWidth="2" />
    <Path d="M10 19l2 2 2-2" />
  </Svg>
);

// ── Markdown Parser & Real-Time Formatted Note Renderer ──────────────────────
const parseInlineMarkdown = (text, isDark, accentColor) => {
  if (!text) return null;
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|==[^=]+==|\$[^$]+\$|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold (**text**)
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <Text key={idx} style={{ fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    // Italic (*text*)
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <Text key={idx} style={{ fontStyle: 'italic', color: isDark ? '#F1F5F9' : '#1E293B' }}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    // Strikethrough (~~text~~)
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <Text key={idx} style={{ textDecorationLine: 'line-through', opacity: 0.65, color: isDark ? '#94A3B8' : '#64748B' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    // Highlight (==text==)
    if (part.startsWith('==') && part.endsWith('==') && part.length >= 4) {
      return (
        <Text
          key={idx}
          style={{
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.28)' : '#FEF3C7',
            color: isDark ? '#FDE68A' : '#92400E',
            fontWeight: '700',
            borderRadius: 3,
            paddingHorizontal: 3,
          }}
        >
          {part.slice(2, -2)}
        </Text>
      );
    }
    // Math Formula ($formula$)
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      const cleanFormula = part.slice(1, -1).replace(/^\$+\s*|\s*\$+$/g, '').trim();
      return (
        <Text
          key={idx}
          style={{
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            color: accentColor || '#2D62FF',
            fontWeight: '700',
            backgroundColor: (accentColor || '#2D62FF') + '15',
            borderRadius: 4,
            paddingHorizontal: 4,
          }}
        >
          {`$ ${cleanFormula} $`}
        </Text>
      );
    }
    // Inline Code (`code`)
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <Text
          key={idx}
          style={{
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            color: isDark ? '#E2E8F0' : '#334155',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: 4,
            paddingHorizontal: 4,
          }}
        >
          {part.slice(1, -1)}
        </Text>
      );
    }

    return <Text key={idx}>{part}</Text>;
  });
};

const markdownToHtml = (md) => {
  if (!md) return '<p><br></p>';
  const lines = md.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) { html += '</ul>'; inUl = false; }
    if (inOl) { html += '</ol>'; inOl = false; }
  };

  const formatInline = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/==(.+?)==/g, '<mark>$1</mark>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>')
      .replace(/\$([^\$]+)\$/g, (_, math) => {
        const clean = math.replace(/^\$+\s*|\s*\$+$/g, '').trim();
        return clean ? `<span class="studpal-formula">$ ${clean} $</span>` : '';
      });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      closeLists();
      html += '<p><br></p>';
      continue;
    }

    if (trimmed.startsWith('# ')) {
      closeLists();
      html += '<h1>' + formatInline(trimmed.slice(2)) + '</h1>';
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeLists();
      html += '<h2>' + formatInline(trimmed.slice(3)) + '</h2>';
      continue;
    }
    if (trimmed.startsWith('### ')) {
      closeLists();
      html += '<h3>' + formatInline(trimmed.slice(4)) + '</h3>';
      continue;
    }

    // Check task checklist
    const taskMatch = trimmed.match(/^[-*+]\s*\[([ xX])\]\s*(.*)$/);
    if (taskMatch) {
      closeLists();
      const checked = taskMatch[1].toLowerCase() === 'x';
      let content = taskMatch[2].trim();
      let headingLevel = 0;
      if (content.startsWith('### ')) {
        headingLevel = 3;
        content = content.slice(4).trim();
      } else if (content.startsWith('## ')) {
        headingLevel = 2;
        content = content.slice(3).trim();
      } else if (content.startsWith('# ')) {
        headingLevel = 1;
        content = content.slice(2).trim();
      }
      const textHtml = formatInline(content) || '<br>';
      const tag = headingLevel > 0 ? `h${headingLevel}` : 'span';
      const headingClass = headingLevel > 0 ? ` studpal-task-h${headingLevel}` : '';
      const dataHeading = headingLevel > 0 ? ` data-heading="${headingLevel}"` : '';

      html += `<div class="studpal-task-item${headingClass}${checked ? ' is-checked' : ''}" data-checked="${checked ? 'true' : 'false'}"${dataHeading}><span class="studpal-task-checkbox" contenteditable="false"></span><${tag} class="studpal-task-text">${textHtml}</${tag}></div>`;
      continue;
    }

    // Bullet list
    if (/^[-*+]\s+/.test(trimmed)) {
      if (inOl) { html += '</ol>'; inOl = false; }
      if (!inUl) { html += '<ul>'; inUl = true; }
      html += '<li>' + formatInline(trimmed.replace(/^[-*+]\s+/, '')) + '</li>';
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (!inOl) { html += '<ol>'; inOl = true; }
      html += '<li>' + formatInline(trimmed.replace(/^\d+\.\s+/, '')) + '</li>';
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      closeLists();
      html += '<blockquote>' + formatInline(trimmed.slice(2)) + '</blockquote>';
      continue;
    }

    closeLists();
    html += '<p>' + formatInline(line) + '</p>';
  }

  closeLists();
  return html;
};

const htmlToMarkdown = (html) => {
  if (!html) return '';

  let text = html;

  // Replace task items first to preserve headings inside task items
  text = text.replace(/<div[^>]*class="[^"]*studpal-task-item[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (match, inner) => {
    const isChecked = /data-checked="true"/i.test(match) || /class="[^"]*is-checked[^"]*"/i.test(match) || /checked/i.test(inner);
    let itemContent = inner;
    itemContent = itemContent.replace(/<span[^>]*class="[^"]*studpal-task-checkbox[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '');
    itemContent = itemContent.replace(/<input[^>]*>/gi, '');

    let headingPrefix = '';
    const h1Match = itemContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h2Match = itemContent.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const h3Match = itemContent.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (h1Match || /data-heading="1"/i.test(match) || /studpal-task-h1/i.test(match)) {
      headingPrefix = '# ';
      if (h1Match) itemContent = h1Match[1];
    } else if (h2Match || /data-heading="2"/i.test(match) || /studpal-task-h2/i.test(match)) {
      headingPrefix = '## ';
      if (h2Match) itemContent = h2Match[1];
    } else if (h3Match || /data-heading="3"/i.test(match) || /studpal-task-h3/i.test(match)) {
      headingPrefix = '### ';
      if (h3Match) itemContent = h3Match[1];
    }

    itemContent = itemContent.replace(/<\/?(?:span|h[1-3])[^>]*class="[^"]*studpal-task-text[^"]*"[^>]*>/gi, '');
    itemContent = itemContent.replace(/<br\s*[\/]?>/gi, '').trim();
    return `- [${isChecked ? 'x' : ' '}] ${headingPrefix}${itemContent}\n`;
  });

  // Replace block tags - single newline per block
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');

  // Replace ordered list items
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, p1) => {
    let idx = 1;
    return p1.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
      return `${idx++}. ${item.trim()}\n`;
    });
  });

  // Replace unordered list items
  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, p1) => {
    return p1.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
      return `- ${item.trim()}\n`;
    });
  });

  // Empty paragraphs -> single newline (handles empty lines without runaway multiplication)
  text = text.replace(/<p[^>]*>\s*(?:<br\s*[\/]?>|&nbsp;|\u200B)?\s*<\/p>/gi, '\n');
  // Content paragraphs -> line with single newline
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n');
  text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');
  text = text.replace(/<br\s*[\/]?>/gi, '\n');

  // Inlines
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  text = text.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');
  text = text.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
  text = text.replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~');
  text = text.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '==$1==');
  text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  text = text.replace(/<span[^>]*class="[^"]*studpal-formula[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, (_, inner) => {
    const clean = inner.replace(/<[^>]+>/g, '').replace(/^\$+\s*|\s*\$+$/g, '').trim();
    return clean ? `$ ${clean} $` : '';
  });
  text = text.replace(/<u[^>]*>(.*?)<\/u>/gi, '__STUDPAL_U_START__$1__STUDPAL_U_END__');

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, '');

  text = text.replace(/__STUDPAL_U_START__/g, '<u>').replace(/__STUDPAL_U_END__/g, '</u>');

  // Decode entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&nbsp;/g, ' ');

  // Strip trailing newline only if it's the very end of the string
  if (text.endsWith('\n')) {
    text = text.slice(0, -1);
  }

  return text;
};

const FormattedMarkdownView = ({
  content = '',
  isDark = true,
  accentColor = '#2D62FF',
  onToggleTask,
  selectable = true,
}) => {
  if (!content) {
    return (
      <Text style={{ color: isDark ? '#475569' : '#94A3B8', fontStyle: 'italic', fontSize: 15, paddingVertical: 12 }}>
        Empty note canvas. Switch to Edit to write...
      </Text>
    );
  }

  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBlockBuffer = [];
  const elements = [];

  lines.forEach((line, lineIdx) => {
    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        const codeText = codeBlockBuffer.join('\n');
        elements.push(
          <View
            key={`code-${lineIdx}`}
            style={{
              backgroundColor: isDark ? '#0B0F19' : '#F1F5F9',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
              borderWidth: 1,
              borderRadius: 10,
              padding: 12,
              marginVertical: 6,
            }}
          >
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                fontSize: 13,
                color: isDark ? '#E2E8F0' : '#1E293B',
                lineHeight: 20,
              }}
              selectable={selectable}
            >
              {codeText}
            </Text>
          </View>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      elements.push(
        <View
          key={`hr-${lineIdx}`}
          style={{
            height: 1,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
            marginVertical: 12,
          }}
        />
      );
      return;
    }

    // Heading 1 (# ...)
    if (line.startsWith('# ')) {
      elements.push(
        <Text
          key={`h1-${lineIdx}`}
          style={{
            fontSize: 24,
            fontWeight: '900',
            color: isDark ? '#F8FAFC' : '#0F172A',
            letterSpacing: -0.5,
            marginTop: lineIdx === 0 ? 2 : 14,
            marginBottom: 6,
          }}
          selectable={selectable}
        >
          {parseInlineMarkdown(line.slice(2), isDark, accentColor)}
        </Text>
      );
      return;
    }

    // Heading 2 (## ...)
    if (line.startsWith('## ')) {
      elements.push(
        <Text
          key={`h2-${lineIdx}`}
          style={{
            fontSize: 19,
            fontWeight: '800',
            color: isDark ? '#F8FAFC' : '#0F172A',
            letterSpacing: -0.3,
            marginTop: 12,
            marginBottom: 4,
          }}
          selectable={selectable}
        >
          {parseInlineMarkdown(line.slice(3), isDark, accentColor)}
        </Text>
      );
      return;
    }

    // Heading 3 (### ...)
    if (line.startsWith('### ')) {
      elements.push(
        <Text
          key={`h3-${lineIdx}`}
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: isDark ? '#E2E8F0' : '#1E293B',
            marginTop: 10,
            marginBottom: 4,
          }}
          selectable={selectable}
        >
          {parseInlineMarkdown(line.slice(4), isDark, accentColor)}
        </Text>
      );
      return;
    }

    // Blockquote (> ...)
    if (line.startsWith('> ')) {
      elements.push(
        <View
          key={`quote-${lineIdx}`}
          style={{
            borderLeftWidth: 3,
            borderLeftColor: accentColor || '#2D62FF',
            backgroundColor: (accentColor || '#2D62FF') + (isDark ? '18' : '0A'),
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 6,
            marginVertical: 5,
          }}
        >
          <Text
            style={{
              fontSize: 14.5,
              fontStyle: 'italic',
              color: isDark ? '#E2E8F0' : '#334155',
              lineHeight: 22,
            }}
            selectable={selectable}
          >
            {parseInlineMarkdown(line.slice(2), isDark, accentColor)}
          </Text>
        </View>
      );
      return;
    }

    // Task Checklist (- [ ] or - [x])
    const taskMatch = line.match(/^[-*+]\s*\[([ xX])\]\s*(.*)$/);
    if (taskMatch) {
      const isChecked = taskMatch[1].toLowerCase() === 'x';
      let rawContent = (taskMatch[2] || '').trim();
      let headingStyle = null;
      let checkboxMarginTop = 2;

      if (rawContent.startsWith('### ')) {
        headingStyle = { fontSize: 17, fontWeight: '700', lineHeight: 24, color: isDark ? '#E2E8F0' : '#334155' };
        rawContent = rawContent.slice(4).trim();
        checkboxMarginTop = 3;
      } else if (rawContent.startsWith('## ')) {
        headingStyle = { fontSize: 20, fontWeight: '700', lineHeight: 28, color: isDark ? '#F1F5F9' : '#1E293B', letterSpacing: -0.3 };
        rawContent = rawContent.slice(3).trim();
        checkboxMarginTop = 5;
      } else if (rawContent.startsWith('# ')) {
        headingStyle = { fontSize: 24, fontWeight: '800', lineHeight: 32, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: -0.5 };
        rawContent = rawContent.slice(2).trim();
        checkboxMarginTop = 6;
      }

      elements.push(
        <TouchableOpacity
          key={`task-${lineIdx}`}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            marginVertical: headingStyle ? 5 : 3,
            paddingVertical: 2,
          }}
          onPress={() => onToggleTask && onToggleTask(lineIdx)}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 1.5,
              borderColor: isChecked ? (accentColor || '#2D62FF') : (isDark ? '#64748B' : '#94A3B8'),
              backgroundColor: isChecked ? (accentColor || '#2D62FF') : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: checkboxMarginTop,
            }}
          >
            {isChecked && <CheckIcon size={12} color="#FFFFFF" />}
          </View>
          <Text
            style={[
              {
                flex: 1,
                fontSize: 15,
                lineHeight: 22,
                color: isChecked ? (isDark ? '#64748B' : '#94A3B8') : (isDark ? '#F8FAFC' : '#0F172A'),
                textDecorationLine: isChecked ? 'line-through' : 'none',
              },
              headingStyle,
              isChecked && {
                textDecorationLine: 'line-through',
                opacity: 0.55,
                color: isDark ? '#64748B' : '#94A3B8',
              },
            ]}
            selectable={selectable}
          >
            {parseInlineMarkdown(rawContent, isDark, accentColor)}
          </Text>
        </TouchableOpacity>
      );
      return;
    }

    // Bullet List (- ... or * ...)
    if (/^[-*+]\s+/.test(line)) {
      const itemText = line.replace(/^[-*+]\s+/, '');
      elements.push(
        <View
          key={`bullet-${lineIdx}`}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            marginVertical: 2,
            paddingLeft: 4,
          }}
        >
          <Text style={{ fontSize: 16, color: accentColor || '#2D62FF', lineHeight: 22 }}>•</Text>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 22,
              color: isDark ? '#F8FAFC' : '#1E293B',
            }}
            selectable={selectable}
          >
            {parseInlineMarkdown(itemText, isDark, accentColor)}
          </Text>
        </View>
      );
      return;
    }

    // Numbered List (1. ...)
    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <View
          key={`num-${lineIdx}`}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            marginVertical: 2,
            paddingLeft: 4,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: accentColor || '#2D62FF', lineHeight: 22, minWidth: 16 }}>
            {numMatch[1]}.
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 22,
              color: isDark ? '#F8FAFC' : '#1E293B',
            }}
            selectable={selectable}
          >
            {parseInlineMarkdown(numMatch[2], isDark, accentColor)}
          </Text>
        </View>
      );
      return;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<View key={`empty-${lineIdx}`} style={{ height: 8 }} />);
      return;
    }

    // Standard Paragraph
    elements.push(
      <Text
        key={`p-${lineIdx}`}
        style={{
          fontSize: 15.5,
          lineHeight: 24,
          color: isDark ? '#E2E8F0' : '#1E293B',
          marginVertical: 2,
        }}
        selectable={selectable}
      >
        {parseInlineMarkdown(line, isDark, accentColor)}
      </Text>
    );
  });

  return <View style={{ gap: 2 }}>{elements}</View>;
};


// ─── MAIN STUDY SCREEN COMPONENT ─────────────────────────────────────────────
export default function StudyScreen({
  user = { name: "Alex" },
  onSelectTab,
  onNavigate,
  initialSrsState,
  onClearInitialSrsState,
  onViewStateChange,
}) {
  const { t, currentLanguageCode } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentSettings, setCurrentSettings] = useState(settingsService.getSettingsSync());

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setCurrentSettings(s));
    return () => unsub();
  }, []);

  const { isDark, accentColor: themeAccentColor } = useTheme();
  const accentColor = themeAccentColor || (currentSettings && currentSettings.accentColor) || Colors.accent || "#2D62FF";
  const styles = useMemo(() => getStudyStyles(isDark, accentColor), [isDark, accentColor]);
  const currentLang = normalizeLanguageCode(currentSettings?.language || currentLanguageCode || "en");

  // ── INTERNAL NAVIGATION & CONTEXT STATE ────────────────────────────────────
  // viewState: 'overview' | 'review' | 'quiz' | 'notes' | 'note-editor'
  const [viewState, setViewState] = useState("overview");

  useEffect(() => {
    if (typeof onViewStateChange === 'function') {
      onViewStateChange(viewState);
    }
  }, [viewState]);

  // Context filters passed between features
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // ── REFRESH TRIGGER ────────────────────────────────────────────────────────
  const [dataVersion, setDataVersion] = useState(0);
  const refreshData = () => setDataVersion((v) => v + 1);

  // ── SRS REVIEW STATE ───────────────────────────────────────────────────────
  const [cards, setCards] = useState(() => studyService.getCardsForReview(null, null, normalizeLanguageCode(settingsService.getSettingsSync()?.language || "en")));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [easyCount, setEasyCount] = useState(0);

  // Silent SRS Response Time & Session Duration Tracker (Background)
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState(0);
  const cardStartTimeRef = useRef(Date.now());
  const cardResponseTimesRef = useRef([]);

  useEffect(() => {
    let interval = null;
    if (viewState === "review" && !isSessionComplete) {
      interval = setInterval(() => {
        setSessionElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, isSessionComplete]);

  // SRS Card 3D Flip, Shimmer & Bottom Bar Animation State
  const cardFlipAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  const [isFlippedState, setIsFlippedState] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlipCardAnimation = () => {
    if (isFlipping) return;
    setIsFlipping(true);

    const toVal = isFlippedState ? 0 : 1;
    const flipDuration = 1000; // Slower, smooth and deliberate 3D card reveal (1000ms)
    const midPoint = flipDuration / 2;

    // Bright glass sheen light reflection - glides smoothly across the glass surface
    shineAnim.setValue(0);
    Animated.timing(shineAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Smooth, slow 3D glass flip animation
    Animated.timing(cardFlipAnim, {
      toValue: toVal,
      duration: flipDuration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsFlipping(false);
    });

    // Toggle content state & animate bottom bar crossfade smoothly at edge-on midpoint
    setTimeout(() => {
      setIsFlippedState(!isFlippedState);
      setIsFlipped(!isFlippedState);
      Animated.timing(bottomBarAnim, {
        toValue: toVal,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, midPoint);
  };

  const frontInterpolate = cardFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = cardFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const shineTranslate = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-480, 480],
  });

  const shineOpacity = shineAnim.interpolate({
    inputRange: [0, 0.1, 0.5, 0.9, 1],
    outputRange: [0, 0.95, 1.0, 0.95, 0],
  });

  const shineSurfaceOpacity = shineAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 0.45, 0.75, 0.45, 0],
  });

  // Smooth Crossfade & Slide Interpolations for Bottom Tools vs Rating Bar
  const bottomToolsOpacity = bottomBarAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
  });

  const bottomToolsTranslateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const bottomRatingOpacity = bottomBarAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });

  const bottomRatingTranslateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });


  // Smooth Card Switch Transition (Next Question Motion)
  const cardNextAnim = useRef(new Animated.Value(1)).current;

  const cardNextTranslateX = cardNextAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [35, 0],
  });

  const cardNextOpacity = cardNextAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.4, 1],
  });

  const cardNextScale = cardNextAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  // Start SRS Review Session
  const [isQuizTargetedSession, setIsQuizTargetedSession] = useState(false);
  const handleStartReviewSession = (subjId = null, topId = null, initialIndex = 0, filterQuizMissedOnly = false) => {
    const sessionCards = studyService.getCardsForReview(subjId, topId, currentLang, { filterQuizMissedOnly });
    setCards(sessionCards);
    setIsQuizTargetedSession(Boolean(filterQuizMissedOnly));
    const validIdx = Math.min(Math.max(0, initialIndex), Math.max(0, (sessionCards.length || 1) - 1));
    setCurrentIndex(validIdx);
    setIsFlipped(false);
    setIsFlippedState(false);
    cardFlipAnim.setValue(0);
    shineAnim.setValue(0);
    bottomBarAnim.setValue(0);
    cardNextAnim.setValue(1);
    setShowHint(false);
    setIsBookmarked(false);
    setIsSessionComplete(false);
    setXpEarned(0);
    setCardsReviewed(0);
    setEasyCount(0);
    setSessionElapsedSeconds(0);
    cardStartTimeRef.current = Date.now();
    cardResponseTimesRef.current = [];
    setSelectedSubjectId(subjId);
    setSelectedTopicId(topId);
    setViewState("review");
  };

  useEffect(() => {
    setCards(studyService.getCardsForReview(selectedSubjectId, selectedTopicId, currentLang));
  }, [currentLang, selectedSubjectId, selectedTopicId]);

  useEffect(() => {
    if (initialSrsState && initialSrsState.viewState === "review") {
      handleStartReviewSession(
        initialSrsState.subjectId || null,
        initialSrsState.topicId || null,
        initialSrsState.currentIndex || 0
      );
      if (onClearInitialSrsState) {
        onClearInitialSrsState();
      }
    }
  }, [initialSrsState]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleAskBrancoForHint = () => {
    if (!currentCard) return;

    const questionText = currentCard.question || "";
    const hintText = currentCard.hint || "";
    const categoryText = currentCard.category || "";

    const promptMessage = `Hey Branco! Can you give me a bigger hint or clearer explanation for this ${categoryText ? categoryText + ' ' : ''}flashcard question?\n\nQuestion: "${questionText}"${hintText ? `\n(Current hint: "${hintText}")` : ''}`;

    const payload = {
      prompt: promptMessage,
      srsReturnState: {
        viewState: "review",
        subjectId: selectedSubjectId,
        topicId: selectedTopicId,
        currentIndex: currentIndex,
        questionText: questionText,
      },
    };

    if (onNavigate) {
      onNavigate("aicoach", payload);
    } else if (onSelectTab) {
      onSelectTab("aicoach", payload);
    }
  };

  const handleSM2Rating = (ratingType, xpAmount) => {
    // Record background response time for SRS algorithm insights
    const responseTimeMs = Date.now() - cardStartTimeRef.current;
    if (currentCard) {
      cardResponseTimesRef.current.push({
        cardId: currentCard.id,
        responseTimeMs,
        responseTimeSec: Math.round(responseTimeMs / 1000),
        rating: ratingType,
      });

      // ── KNOWLEDGE CROSS-TALK: INVENTORY CARD RATING & NOTIFY QUIZ ENGINE ──
      studyService.recordCardRating({
        cardId: currentCard.id,
        rating: ratingType,
        responseTimeMs,
        cardObj: currentCard,
      });
    }
    cardStartTimeRef.current = Date.now();

    setXpEarned((prev) => prev + xpAmount);
    setCardsReviewed((prev) => prev + 1);
    if (ratingType === "Easy") setEasyCount((prev) => prev + 1);

    // Fast, crisp card exit & bottom bar crossfade animation (100ms)
    Animated.parallel([
      Animated.timing(cardNextAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(bottomBarAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsFlipped(false);
      setIsFlippedState(false);
      cardFlipAnim.setValue(0);
      shineAnim.setValue(0);
      setShowHint(false);
      setIsBookmarked(false);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        // Snappy entrance of new question card from right (150ms)
        cardNextAnim.setValue(0);
        Animated.timing(cardNextAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      } else {
        setIsSessionComplete(true);
        gamificationService.recordFlashcardReview(cardsReviewed + 1);
        refreshData();
      }
    });
  };

  const handleAudioListen = () => {
    if (currentCard) {
      Alert.alert("🔊 Audio Pronunciation", `Reading card: "${currentCard.question}"`);
    }
  };

  // ── QUIZ STATE ─────────────────────────────────────────────────────────────
  // quizSubState: 'select' | 'active' | 'results'
  const [quizSubState, setQuizSubState] = useState("select");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [isQuizAnswerChecked, setIsQuizAnswerChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionIndex: optionIndex }
  const [quizScoreResult, setQuizScoreResult] = useState(null);
  const quizStartTimeRef = useRef(Date.now());

  const handleStartQuiz = (subjId = null, topId = null) => {
    setSelectedSubjectId(subjId);
    setSelectedTopicId(topId);
    setQuizSubState("select");
    setViewState("quiz");
  };

  const shuffleQuizEngineData = (quizObj) => {
    if (!quizObj || !quizObj.questions) return quizObj;

    const shuffledQuestions = quizObj.questions.map((q) => {
      const correctText = q.options[q.correctIndex];
      const optionsCopy = [...q.options];
      for (let i = optionsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
      }
      const newCorrectIndex = optionsCopy.indexOf(correctText);

      return {
        ...q,
        options: optionsCopy,
        correctIndex: newCorrectIndex,
      };
    });

    return {
      ...quizObj,
      questions: shuffledQuestions,
    };
  };

  const handleLaunchQuizEngine = (quizObj) => {
    const randomizedQuiz = shuffleQuizEngineData(quizObj);
    // Prioritize questions connected to flashcard struggles so they are tested first
    if (randomizedQuiz && Array.isArray(randomizedQuiz.questions)) {
      randomizedQuiz.questions.sort((a, b) => (b.flashcardBridge ? 1 : 0) - (a.flashcardBridge ? 1 : 0));
    }
    setActiveQuiz(randomizedQuiz);
    setQuizQuestionIndex(0);
    setQuizSelectedOption(null);
    setIsQuizAnswerChecked(false);
    setQuizAnswers({});
    setQuizScoreResult(null);
    quizStartTimeRef.current = Date.now();
    setQuizSubState("active");
  };

  const handleOptionSelect = (optionIndex) => {
    if (isQuizAnswerChecked) return;
    setQuizSelectedOption(optionIndex);
    setQuizAnswers((prev) => ({ ...prev, [quizQuestionIndex]: optionIndex }));
  };

  const handleCheckOrNextQuizQuestion = () => {
    if (!activeQuiz || quizSelectedOption === null) return;

    if (!isQuizAnswerChecked) {
      // Phase 1: Reveal answer feedback
      setIsQuizAnswerChecked(true);
    } else {
      // Phase 2: Move to next question or submit quiz
      setIsQuizAnswerChecked(false);
      if (quizQuestionIndex < activeQuiz.questions.length - 1) {
        const nextIdx = quizQuestionIndex + 1;
        setQuizQuestionIndex(nextIdx);
        setQuizSelectedOption(quizAnswers[nextIdx] !== undefined ? quizAnswers[nextIdx] : null);
      } else {
        // Submit Quiz
        let correct = 0;
        activeQuiz.questions.forEach((q, idx) => {
          if (quizAnswers[idx] === q.correctIndex) {
            correct += 1;
          }
        });
        const total = activeQuiz.questions.length;
        const scorePct = Math.round((correct / total) * 100);
        const durationSeconds = quizStartTimeRef.current
          ? Math.max(5, Math.round((Date.now() - quizStartTimeRef.current) / 1000))
          : 45;

        // Calculate XP reward
        let xpGained = 20;
        if (scorePct >= 95) xpGained += 40;
        else if (scorePct >= 85) xpGained += 30;
        else if (scorePct >= 70) xpGained += 15;

        // Safely award XP via gamification service
        try {
          if (typeof gamificationService.recordQuizCompletion === "function") {
            gamificationService.recordQuizCompletion(correct, total);
          } else if (typeof gamificationService.awardXp === "function") {
            gamificationService.awardXp("QUIZ_COMPLETED", xpGained, `Completed Practice Quiz (${scorePct}%)`);
          } else if (typeof gamificationService.addXp === "function") {
            gamificationService.addXp(xpGained, "Quiz Attempt");
          }
        } catch (e) {
          console.warn("Gamification error during quiz completion:", e);
        }

        // Record in service & adjust topic mastery/SRS priorities
        const resultObj = studyService.recordQuizAttempt({
          quizId: activeQuiz.id,
          subjectId: activeQuiz.subjectId,
          topicId: activeQuiz.topicId,
          topicName: activeQuiz.topicName,
          score: scorePct,
          correctCount: correct,
          totalQuestions: total,
          durationSeconds,
          answers: { ...quizAnswers },
          questions: activeQuiz.questions,
          xpEarned: xpGained,
        });

        setQuizScoreResult(resultObj);
        setQuizSubState("results");
        refreshData();
      }
    }
  };

  // ── NOTES & NOTE EDITOR STATE ────────────────────────────────────────────────
  const [notesSearch, setNotesSearch] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isClassificationModalOpen, setIsClassificationModalOpen] = useState(false);
  const [noteFormTitle, setNoteFormTitle] = useState("");
  const [noteFormSubjectId, setNoteFormSubjectId] = useState("math");
  const [noteFormTopicId, setNoteFormTopicId] = useState("m1");
  const [noteFormContent, setNoteFormContent] = useState("");
  const [noteEditorMode, setNoteEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [contentSelection, setContentSelection] = useState({ start: 0, end: 0 });
  const contentInputRef = useRef(null);
  const contentEditableRef = useRef(null);
  const isTypingRef = useRef(false);
  const savedRangeRef = useRef(null);
  const lastCheckboxToggleRef = useRef(0);
  const loadedNoteKeyRef = useRef(null);
  const lastBackspaceTimeRef = useRef(0);
  const [isSavingSuccess, setIsSavingSuccess] = useState(false);
  const [activeMenuNoteId, setActiveMenuNoteId] = useState(null);
  const saveBtnScale = useRef(new Animated.Value(1)).current;
  const [noteForDetailModal, setNoteForDetailModal] = useState(null);
  const [isFormatTrayOpen, setIsFormatTrayOpen] = useState(false);



  // ── Note Undo / Redo History Stack ──
  const [historyStack, setHistoryStack] = useState(() => [""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyStackRef = useRef([""]);
  const historyIndexRef = useRef(0);
  const isHistoryActionRef = useRef(false);
  const typingHistoryTimerRef = useRef(null);

  const commitHistory = useCallback((textToCommit) => {
    if (textToCommit === null || textToCommit === undefined) return;
    const stack = historyStackRef.current;
    const idx = historyIndexRef.current;

    if (stack[idx] === textToCommit) return;

    const trimmed = stack.slice(0, idx + 1);
    trimmed.push(textToCommit);
    if (trimmed.length > 50) {
      trimmed.shift();
    }

    const newIdx = trimmed.length - 1;
    historyStackRef.current = trimmed;
    historyIndexRef.current = newIdx;
    setHistoryStack(trimmed);
    setHistoryIndex(newIdx);
  }, []);

  const pushHistory = useCallback((newText, immediate = false) => {
    if (isHistoryActionRef.current) {
      isHistoryActionRef.current = false;
      return;
    }

    if (immediate) {
      if (typingHistoryTimerRef.current) {
        clearTimeout(typingHistoryTimerRef.current);
        typingHistoryTimerRef.current = null;
      }
      commitHistory(newText);
    } else {
      if (typingHistoryTimerRef.current) {
        clearTimeout(typingHistoryTimerRef.current);
      }
      typingHistoryTimerRef.current = setTimeout(() => {
        commitHistory(newText);
        typingHistoryTimerRef.current = null;
      }, 400);
    }
  }, [commitHistory]);

  // Real-time selection tracking for contentEditable on Web
  const handleSelectChange = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && contentEditableRef.current) {
        const range = sel.getRangeAt(0);
        if (contentEditableRef.current.contains(range.commonAncestorContainer)) {
          if (!range.collapsed || document.activeElement === contentEditableRef.current) {
            savedRangeRef.current = range.cloneRange();
          }
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const handleDocSelectionChange = () => {
        try {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0 && contentEditableRef.current) {
            const range = sel.getRangeAt(0);
            if (contentEditableRef.current.contains(range.commonAncestorContainer)) {
              if (!range.collapsed || document.activeElement === contentEditableRef.current) {
                savedRangeRef.current = range.cloneRange();
              }
            }
          }
        } catch (e) {}
      };
      document.addEventListener('selectionchange', handleDocSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleDocSelectionChange);
      };
    }
  }, []);

  const syncEditorContent = useCallback((immediate = false) => {
    if (contentEditableRef.current) {
      const md = htmlToMarkdown(contentEditableRef.current.innerHTML);
      setNoteFormContent(md);
      pushHistory(md, immediate);
    }
  }, [pushHistory]);

  const handleContentInput = useCallback(() => {
    handleSelectChange();
    syncEditorContent(false);
  }, [handleSelectChange, syncEditorContent]);

  const handleTaskEnter = useCallback((taskItem, range, sel) => {
    const textSpan = taskItem.querySelector('.studpal-task-text') || taskItem;
    const rawText = textSpan.textContent || '';
    const trimmedText = rawText.replace(/\u200B/g, '').trim();

    // 1. If empty item, pressing Enter exits checklist mode (converts to normal paragraph)
    if (trimmedText === '') {
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      taskItem.parentNode.replaceChild(p, taskItem);
      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
      syncEditorContent();
      return true;
    }

    // 2. Extract trailing content after caret to put in the next task item
    let trailingFrag = document.createDocumentFragment();
    if (textSpan.contains(range.endContainer) || range.endContainer === textSpan) {
      try {
        const extractRange = document.createRange();
        extractRange.setStart(range.endContainer, range.endOffset);
        extractRange.setEnd(textSpan, textSpan.childNodes.length);
        trailingFrag = extractRange.extractContents();
      } catch (err) {
        trailingFrag = document.createDocumentFragment();
      }
    }

    const newTaskItem = document.createElement('div');
    newTaskItem.className = 'studpal-task-item';
    newTaskItem.setAttribute('data-checked', 'false');

    const newCheckbox = document.createElement('span');
    newCheckbox.className = 'studpal-task-checkbox';
    newCheckbox.setAttribute('contenteditable', 'false');
    newTaskItem.appendChild(newCheckbox);

    const newSpan = document.createElement('span');
    newSpan.className = 'studpal-task-text';
    const hasTrailing = trailingFrag && trailingFrag.textContent && trailingFrag.textContent.replace(/\u200B/g, '').trim().length > 0;
    if (hasTrailing) {
      newSpan.appendChild(trailingFrag);
    } else {
      newSpan.innerHTML = '<br>';
    }
    newTaskItem.appendChild(newSpan);

    // If textSpan in current item was emptied by extraction, provide <br>
    const currentRemaining = (textSpan.textContent || '').replace(/\u200B/g, '').trim();
    if (currentRemaining === '') {
      textSpan.innerHTML = '<br>';
    }

    if (taskItem.nextSibling) {
      taskItem.parentNode.insertBefore(newTaskItem, taskItem.nextSibling);
    } else {
      taskItem.parentNode.appendChild(newTaskItem);
    }

    // Position cursor cleanly in the new item's text
    const newRange = document.createRange();
    if (hasTrailing && newSpan.firstChild) {
      newRange.setStart(newSpan.firstChild, 0);
    } else {
      newRange.setStart(newSpan, 0);
    }
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();

    syncEditorContent();
    return true;
  }, [syncEditorContent]);

  const handleTaskBackspace = useCallback((taskItem, range, sel) => {
    const textSpan = taskItem.querySelector('.studpal-task-text') || taskItem;
    const rawText = textSpan.textContent || '';
    const trimmedText = rawText.replace(/\u200B/g, '').trim();

    // If text is selected across nodes, let browser delete selection normally
    if (!range.collapsed) {
      return false;
    }

    // 1. If task item has no text: remove it and place cursor at end of previous item
    if (trimmedText === '') {
      const prev = taskItem.previousElementSibling;
      if (prev) {
        taskItem.remove();
        const prevTarget = prev.querySelector?.('.studpal-task-text') || prev;
        const newRange = document.createRange();
        if (prevTarget.firstChild && prevTarget.firstChild.nodeType === 1 && prevTarget.firstChild.tagName === 'BR') {
          newRange.setStart(prevTarget, 0);
          newRange.collapse(true);
        } else {
          newRange.selectNodeContents(prevTarget);
          newRange.collapse(false);
        }
        sel.removeAllRanges();
        sel.addRange(newRange);
        savedRangeRef.current = newRange.cloneRange();
      } else {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        taskItem.parentNode.replaceChild(p, taskItem);
        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        savedRangeRef.current = newRange.cloneRange();
      }
      syncEditorContent();
      return true;
    }

    // 2. If task item has text but caret is at the very beginning (offset 0):
    // Convert task item back to a normal paragraph (removes circle, keeps text)
    let isAtStart = false;
    if (range.startContainer === textSpan && range.startOffset === 0) {
      isAtStart = true;
    } else if (range.startContainer === textSpan.firstChild && range.startOffset === 0) {
      isAtStart = true;
    } else if (textSpan.contains(range.startContainer)) {
      try {
        const checkRange = document.createRange();
        checkRange.setStart(textSpan, 0);
        checkRange.setEnd(range.startContainer, range.startOffset);
        if (checkRange.toString().replace(/\u200B/g, '').length === 0) {
          isAtStart = true;
        }
      } catch (e) {}
    }

    if (isAtStart) {
      const isH1 = taskItem.classList.contains('studpal-task-h1') || taskItem.getAttribute('data-heading') === '1' || (textSpan.tagName && textSpan.tagName.toUpperCase() === 'H1');
      const isH2 = taskItem.classList.contains('studpal-task-h2') || taskItem.getAttribute('data-heading') === '2' || (textSpan.tagName && textSpan.tagName.toUpperCase() === 'H2');
      const isH3 = taskItem.classList.contains('studpal-task-h3') || taskItem.getAttribute('data-heading') === '3' || (textSpan.tagName && textSpan.tagName.toUpperCase() === 'H3');

      const targetTag = isH1 ? 'h1' : isH2 ? 'h2' : isH3 ? 'h3' : 'p';
      const replacement = document.createElement(targetTag);
      replacement.innerHTML = textSpan.innerHTML || '<br>';
      taskItem.parentNode.replaceChild(replacement, taskItem);
      const newRange = document.createRange();
      newRange.setStart(replacement, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
      syncEditorContent();
      return true;
    }

    return false;
  }, [syncEditorContent]);

  const toggleTaskItem = useCallback((checkboxEl) => {
    const taskItem = checkboxEl.closest?.('.studpal-task-item');
    if (!taskItem) return;
    lastCheckboxToggleRef.current = Date.now();
    const isChecked = taskItem.getAttribute('data-checked') === 'true' || taskItem.classList.contains('is-checked');
    const nextChecked = !isChecked;
    taskItem.setAttribute('data-checked', nextChecked ? 'true' : 'false');
    if (nextChecked) {
      taskItem.classList.add('is-checked');
    } else {
      taskItem.classList.remove('is-checked');
    }
    syncEditorContent();
  }, [syncEditorContent]);

  const handleEditorPointerDown = useCallback((e) => {
    const checkboxEl = e.target && (
      (e.target.classList?.contains('studpal-task-checkbox') && e.target) ||
      e.target.closest?.('.studpal-task-checkbox')
    );
    if (checkboxEl) {
      e.preventDefault();
      e.stopPropagation();
      toggleTaskItem(checkboxEl);
    }
  }, [toggleTaskItem]);

  const handleEditorClick = useCallback((e) => {
    handleSelectChange();

    const checkboxEl = e.target && (
      (e.target.classList?.contains('studpal-task-checkbox') && e.target) ||
      e.target.closest?.('.studpal-task-checkbox')
    );

    if (checkboxEl) {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (lastCheckboxToggleRef.current && (now - lastCheckboxToggleRef.current < 350)) {
        return;
      }
      toggleTaskItem(checkboxEl);
      return;
    }

    if (e.target && e.target.type === 'checkbox') {
      const isChecked = e.target.checked;
      const taskItem = e.target.closest && e.target.closest('.studpal-task-item');
      if (taskItem) {
        taskItem.setAttribute('data-checked', isChecked ? 'true' : 'false');
        if (isChecked) taskItem.classList.add('is-checked');
        else taskItem.classList.remove('is-checked');
        syncEditorContent(true);
      }
    }
  }, [handleSelectChange, toggleTaskItem, syncEditorContent]);

  const handleUndo = useCallback(() => {
    // If there is an active typing timer, flush current content to history first
    if (typingHistoryTimerRef.current) {
      clearTimeout(typingHistoryTimerRef.current);
      typingHistoryTimerRef.current = null;
      if (contentEditableRef.current) {
        const currentMd = htmlToMarkdown(contentEditableRef.current.innerHTML);
        commitHistory(currentMd);
      }
    }

    const currIdx = historyIndexRef.current;
    if (currIdx <= 0) return;

    const newIdx = currIdx - 1;
    const targetText = historyStackRef.current[newIdx] ?? "";

    isHistoryActionRef.current = true;
    historyIndexRef.current = newIdx;
    setHistoryIndex(newIdx);
    setNoteFormContent(targetText);

    if (Platform.OS === 'web' && contentEditableRef.current) {
      const editor = contentEditableRef.current;
      editor.innerHTML = markdownToHtml(targetText);
      try {
        editor.focus({ preventScroll: true });
        const sel = window.getSelection();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
          savedRangeRef.current = range.cloneRange();
        }
      } catch (e) {}
    }
  }, [commitHistory]);

  const handleRedo = useCallback(() => {
    const currIdx = historyIndexRef.current;
    const stack = historyStackRef.current;
    if (currIdx >= stack.length - 1) return;

    const newIdx = currIdx + 1;
    const targetText = stack[newIdx] ?? "";

    isHistoryActionRef.current = true;
    historyIndexRef.current = newIdx;
    setHistoryIndex(newIdx);
    setNoteFormContent(targetText);

    if (Platform.OS === 'web' && contentEditableRef.current) {
      const editor = contentEditableRef.current;
      editor.innerHTML = markdownToHtml(targetText);
      try {
        editor.focus({ preventScroll: true });
        const sel = window.getSelection();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
          savedRangeRef.current = range.cloneRange();
        }
      } catch (e) {}
    }
  }, []);

  const handleEditorKeyDown = useCallback((e) => {
    if (typeof window === 'undefined') return;

    const isMod = e.metaKey || e.ctrlKey;
    if (isMod && e.key && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
      return;
    }
    if (isMod && e.key && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      handleRedo();
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      let node = range.startContainer;
      while (node && node !== contentEditableRef.current && (!node.classList || !node.classList.contains('studpal-task-item'))) {
        node = node.parentNode;
      }

      if (node && node.classList && node.classList.contains('studpal-task-item')) {
        e.preventDefault();
        handleTaskEnter(node, range, sel);
        return;
      }
    }

    if (e.key === 'Backspace') {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      let node = range.startContainer;
      while (node && node !== contentEditableRef.current && (!node.classList || !node.classList.contains('studpal-task-item'))) {
        node = node.parentNode;
      }

      if (node && node.classList && node.classList.contains('studpal-task-item')) {
        lastBackspaceTimeRef.current = Date.now();
        if (handleTaskBackspace(node, range, sel)) {
          e.preventDefault();
          return;
        }
      }
    }
  }, [handleTaskEnter, handleTaskBackspace, handleUndo, handleRedo]);

  const handleBeforeInput = useCallback((e) => {
    if (e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak') {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      let node = range.startContainer;
      while (node && node !== contentEditableRef.current && (!node.classList || !node.classList.contains('studpal-task-item'))) {
        node = node.parentNode;
      }

      if (node && node.classList && node.classList.contains('studpal-task-item')) {
        e.preventDefault();
        handleTaskEnter(node, range, sel);
      }
    } else if (e.inputType === 'deleteContentBackward') {
      if (Date.now() - lastBackspaceTimeRef.current < 100) {
        return;
      }
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      let node = range.startContainer;
      while (node && node !== contentEditableRef.current && (!node.classList || !node.classList.contains('studpal-task-item'))) {
        node = node.parentNode;
      }

      if (node && node.classList && node.classList.contains('studpal-task-item')) {
        lastBackspaceTimeRef.current = Date.now();
        if (handleTaskBackspace(node, range, sel)) {
          e.preventDefault();
        }
      }
    }
  }, [handleTaskEnter, handleTaskBackspace]);

  const currentNoteKey = editingNote ? `note_${editingNote.id}` : `new_note`;

  const setEditorRef = useCallback((node) => {
    contentEditableRef.current = node;
    if (node && loadedNoteKeyRef.current !== currentNoteKey) {
      loadedNoteKeyRef.current = currentNoteKey;
      node.innerHTML = markdownToHtml(noteFormContent || '');
    }
  }, [currentNoteKey, noteFormContent]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Clean up any stray task elements accidentally inserted outside the editor
      try {
        const strayItems = document.querySelectorAll('.studpal-task-item:not(.studpal-editable-preview .studpal-task-item)');
        strayItems.forEach(item => item.remove());
      } catch (e) {}

      const editor = contentEditableRef.current;
      if (!editor) return;

      try {
        editor.removeEventListener('beforeinput', handleBeforeInput);
        editor.addEventListener('beforeinput', handleBeforeInput);
      } catch (err) {}

      return () => {
        try {
          editor.removeEventListener('beforeinput', handleBeforeInput);
        } catch (err) {}
      };
    }
  }, [handleBeforeInput, viewState]);

  // ── Voice Dictation State ──
  const [isNoteRecording, setIsNoteRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const speechRecognitionRef = useRef(null);
  const isRecordingActiveRef = useRef(false);
  const uncommittedTranscriptRef = useRef('');
  const sessionFinalTranscriptRef = useRef('');
  const speechSilenceTimerRef = useRef(null);
  const contentSelectionRef = useRef({ start: 0, end: 0 });
  const [dictationInterimPreview, setDictationInterimPreview] = useState('');

  // Helper to commit dictated text into the active note editor immediately
  const commitDictatedTextToNote = useCallback((textToAdd) => {
    if (!textToAdd || !textToAdd.trim()) return;
    const cleanText = textToAdd.trim();

    if (Platform.OS === 'web' && contentEditableRef.current) {
      let inserted = false;
      const editor = contentEditableRef.current;

      // 1. Try savedRangeRef first if valid and within contentEditable
      if (savedRangeRef.current && editor.contains(savedRangeRef.current.commonAncestorContainer)) {
        try {
          const range = savedRangeRef.current;
          range.deleteContents();
          const textNode = document.createTextNode(` ${cleanText} `);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          savedRangeRef.current = range.cloneRange();
          inserted = true;
        } catch (e) {
          inserted = false;
        }
      }

      // 2. Try current window selection if within contentEditable
      if (!inserted) {
        try {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(` ${cleanText} `);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            savedRangeRef.current = range.cloneRange();
            inserted = true;
          }
        } catch (e) {
          inserted = false;
        }
      }

      // 3. Fallback: append to the last paragraph or create new paragraph at end
      if (!inserted) {
        try {
          const lastChild = editor.lastElementChild;
          if (lastChild && (lastChild.tagName === 'P' || lastChild.tagName === 'DIV')) {
            const textNode = document.createTextNode(` ${cleanText} `);
            lastChild.appendChild(textNode);
            const newRange = document.createRange();
            newRange.selectNodeContents(lastChild);
            newRange.collapse(false);
            savedRangeRef.current = newRange.cloneRange();
          } else {
            const p = document.createElement('p');
            p.textContent = cleanText;
            editor.appendChild(p);
            const newRange = document.createRange();
            newRange.selectNodeContents(p);
            newRange.collapse(false);
            savedRangeRef.current = newRange.cloneRange();
          }
        } catch (e) {
          editor.innerHTML = (editor.innerHTML || '') + ` <p>${cleanText}</p>`;
        }
      }

      const md = htmlToMarkdown(editor.innerHTML);
      setNoteFormContent(md);
      pushHistory(md);
    } else {
      setNoteFormContent((prev) => {
        const text = prev || '';
        const { start = text.length, end = text.length } = contentSelectionRef.current || {};
        let newText;
        if (typeof start === 'number' && start >= 0 && start <= text.length) {
          const before = text.slice(0, start);
          const after = text.slice(end);
          const spaceBefore = before.length > 0 && !/\s$/.test(before) ? ' ' : '';
          const spaceAfter = after.length > 0 && !/^\s/.test(after) ? ' ' : '';
          newText = before + spaceBefore + cleanText + spaceAfter + after;
        } else {
          const spaceBefore = text.length > 0 && !/\s$/.test(text) ? ' ' : '';
          newText = text + spaceBefore + cleanText;
        }
        pushHistory(newText);
        return newText;
      });
    }
  }, [pushHistory]);

  useEffect(() => {
    if (isNoteRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.35, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => {
        loop.stop();
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      };
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingSeconds(0);
      pulseAnim.setValue(1);
    }
  }, [isNoteRecording]);

  const formattedRecordingTime = useMemo(() => {
    const mins = Math.floor(recordingSeconds / 60);
    const secs = recordingSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [recordingSeconds]);

  const currentFormattedDate = useMemo(() => {
    const d = editingNote?.updatedAt ? new Date(editingNote.updatedAt) : new Date();
    try {
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${month}/${day}/${year}, ${hours}:${mins}`;
    } catch (e) {
      return 'Today, 12:00';
    }
  }, [editingNote]);

  useEffect(() => {
    return () => {
      isRecordingActiveRef.current = false;
      if (speechSilenceTimerRef.current) {
        clearTimeout(speechSilenceTimerRef.current);
        speechSilenceTimerRef.current = null;
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.abort(); } catch (e) {}
        speechRecognitionRef.current = null;
      }
      try { voiceRecordingService.stopRecording(); } catch (e) {}
    };
  }, []);

  const handleToggleNoteVoiceDictation = async () => {
    if (isNoteRecording) {
      isRecordingActiveRef.current = false;

      // 1. Clear any pending speech pause timer
      if (speechSilenceTimerRef.current) {
        clearTimeout(speechSilenceTimerRef.current);
        speechSilenceTimerRef.current = null;
      }

      // 2. Immediately transcribe any pending uncommitted speech upon pause
      const pendingText = uncommittedTranscriptRef.current;
      if (pendingText && pendingText.trim()) {
        commitDictatedTextToNote(pendingText.trim());
        uncommittedTranscriptRef.current = '';
        sessionFinalTranscriptRef.current = '';
      }

      // 3. Stop speech recognition cleanly
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
        speechRecognitionRef.current = null;
      }

      // 4. Stop hardware audio recording
      try {
        await voiceRecordingService.stopRecording();
      } catch (e) {}

      setIsNoteRecording(false);
      setDictationInterimPreview('');
      return;
    }

    isRecordingActiveRef.current = true;
    uncommittedTranscriptRef.current = '';
    sessionFinalTranscriptRef.current = '';
    setDictationInterimPreview('');
    setIsNoteRecording(true);

    // 1. High-fidelity audio recording capture in background
    try {
      await voiceRecordingService.startRecording();
    } catch (err) {
      console.warn('[NoteVoiceDictation] Audio recording notice:', err);
    }

    // 2. High-sensitivity continuous speech-to-text recognition with instant pause finalization
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.maxAlternatives = 3;
          recognition.lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en-US';

          recognition.onresult = (event) => {
            if (!isRecordingActiveRef.current) return;

            let interim = '';
            let newlyFinalized = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const transcript = event.results[i][0]?.transcript || '';
              if (event.results[i].isFinal) {
                newlyFinalized += transcript;
              } else {
                interim += transcript;
              }
            }

            if (newlyFinalized) {
              sessionFinalTranscriptRef.current = (sessionFinalTranscriptRef.current + ' ' + newlyFinalized).trim();
            }

            const currentPhrase = (sessionFinalTranscriptRef.current + ' ' + interim).trim();
            if (currentPhrase) {
              uncommittedTranscriptRef.current = currentPhrase;
              setDictationInterimPreview(currentPhrase);
            }

            // Immediately transcribe after user pauses speaking (450ms silence detection)
            if (speechSilenceTimerRef.current) {
              clearTimeout(speechSilenceTimerRef.current);
              speechSilenceTimerRef.current = null;
            }

            if (currentPhrase.length > 0 && isRecordingActiveRef.current) {
              const pauseDelay = currentPhrase.length > 30 || /[.?!]$/.test(currentPhrase) ? 420 : 520;
              speechSilenceTimerRef.current = setTimeout(() => {
                if (!isRecordingActiveRef.current) return;
                const textToCommit = uncommittedTranscriptRef.current;
                if (textToCommit && textToCommit.trim()) {
                  commitDictatedTextToNote(textToCommit.trim());
                  uncommittedTranscriptRef.current = '';
                  sessionFinalTranscriptRef.current = '';
                  setDictationInterimPreview('');

                  // Clean restart recognition session to eliminate repetition across turns
                  try {
                    recognition.abort();
                  } catch (e) {}
                }
              }, pauseDelay);
            }
          };

          recognition.onerror = (event) => {
            console.log('[NoteVoiceDictation] Recognition notice:', event?.error);
            if (event?.error === 'not-allowed') {
              isRecordingActiveRef.current = false;
              setIsNoteRecording(false);
              setDictationInterimPreview('');
              Alert.alert('Microphone Access', 'Please allow microphone access in your browser settings.');
            }
          };

          recognition.onend = () => {
            // Auto-reconnect so speech recognition never cuts out while recording is active
            if (isRecordingActiveRef.current) {
              try {
                recognition.start();
              } catch (e) {
                setTimeout(() => {
                  if (isRecordingActiveRef.current && speechRecognitionRef.current) {
                    try { speechRecognitionRef.current.start(); } catch (err) {}
                  }
                }, 100);
              }
            } else {
              // Finalize any pending transcript on end
              const remaining = uncommittedTranscriptRef.current;
              if (remaining && remaining.trim()) {
                commitDictatedTextToNote(remaining.trim());
                uncommittedTranscriptRef.current = '';
                sessionFinalTranscriptRef.current = '';
                setDictationInterimPreview('');
              }
              setIsNoteRecording(false);
            }
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
          return;
        } catch (err) {
          console.warn('[NoteVoiceDictation] Web speech init error:', err);
        }
      }
    }
  };

  const handleToggleTaskCheckbox = (lineIdx) => {
    const lines = (noteFormContent || '').split('\n');
    if (lines[lineIdx] !== undefined) {
      if (lines[lineIdx].includes('- [ ]')) {
        lines[lineIdx] = lines[lineIdx].replace('- [ ]', '- [x]');
      } else if (lines[lineIdx].includes('- [x]')) {
        lines[lineIdx] = lines[lineIdx].replace('- [x]', '- [ ]');
      }
      const updated = lines.join('\n');
      setNoteFormContent(updated);
      pushHistory(updated, true);
    }
  };

  const executeFormatCommand = (cmd, val = null) => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const editor = contentEditableRef.current;
      if (!editor) return;

      const sel = window.getSelection();

      // Ensure styleWithCSS produces clean semantic HTML tags
      try {
        document.execCommand('styleWithCSS', false, false);
      } catch (e) {}

      // Clean up any stray task elements accidentally inserted outside the editor
      try {
        const strayItems = document.querySelectorAll('.studpal-task-item:not(.studpal-editable-preview .studpal-task-item)');
        strayItems.forEach(item => item.remove());
      } catch (e) {}

      // Helper to verify a range is strictly inside the editor
      const isRangeInsideEditor = (r) => {
        if (!r || !editor) return false;
        try {
          const container = r.commonAncestorContainer;
          return editor === container || editor.contains(container);
        } catch (e) {
          return false;
        }
      };

      // 1. Restore the user's highlighted selection range strictly within editor
      let activeRange = null;
      if (savedRangeRef.current && isRangeInsideEditor(savedRangeRef.current) && !savedRangeRef.current.collapsed) {
        try {
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(savedRangeRef.current);
          }
          activeRange = savedRangeRef.current;
        } catch (e) {}
      } else if (sel && sel.rangeCount > 0 && isRangeInsideEditor(sel.getRangeAt(0)) && !sel.getRangeAt(0).collapsed) {
        activeRange = sel.getRangeAt(0);
      } else if (savedRangeRef.current && isRangeInsideEditor(savedRangeRef.current)) {
        try {
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(savedRangeRef.current);
          }
          activeRange = savedRangeRef.current;
        } catch (e) {}
      } else if (sel && sel.rangeCount > 0 && isRangeInsideEditor(sel.getRangeAt(0))) {
        activeRange = sel.getRangeAt(0);
      }

      // If no valid activeRange inside editor, create a range at the end of editor
      if (!activeRange || !isRangeInsideEditor(activeRange)) {
        try {
          editor.focus({ preventScroll: true });
          const newRange = document.createRange();
          if (editor.lastChild) {
            newRange.selectNodeContents(editor.lastChild);
            newRange.collapse(false);
          } else {
            newRange.selectNodeContents(editor);
            newRange.collapse(false);
          }
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
          activeRange = newRange;
        } catch (e) {}
      }

      // Check if activeRange is currently inside an existing task item
      let activeTaskItem = null;
      if (activeRange) {
        let temp = activeRange.commonAncestorContainer;
        if (temp.nodeType === 3) temp = temp.parentNode;
        while (temp && temp !== editor) {
          if (temp.classList && temp.classList.contains('studpal-task-item')) {
            activeTaskItem = temp;
            break;
          }
          temp = temp.parentNode;
        }
      }

      const cleanTextForTask = (html) => {
        let h = html || '';
        h = h.replace(/<span[^>]*class="[^"]*studpal-task-checkbox[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '');
        h = h.replace(/<input[^>]*>/gi, '');
        h = h.replace(/^(\s*[-*+]\s*|\s*\d+\.\s*)/, '');
        return h.trim() || '<br>';
      };

      // Helper for block-level headings and body conversion
      const applyBlockFormat = (tag) => {
        // If inside a task item, seamlessly apply the heading level to the task item without removing the checklist!
        if (activeTaskItem) {
          const textSpan = activeTaskItem.querySelector('.studpal-task-text') || activeTaskItem;
          const cleanHtml = textSpan.innerHTML;
          const targetTag = (tag || '').toLowerCase();
          const headingLevel = targetTag === 'h1' ? 1 : targetTag === 'h2' ? 2 : targetTag === 'h3' ? 3 : 0;

          activeTaskItem.classList.remove('studpal-task-h1', 'studpal-task-h2', 'studpal-task-h3');
          if (headingLevel > 0) {
            activeTaskItem.classList.add(`studpal-task-h${headingLevel}`);
            activeTaskItem.setAttribute('data-heading', `${headingLevel}`);
          } else {
            activeTaskItem.removeAttribute('data-heading');
          }

          const newTextEl = document.createElement(headingLevel > 0 ? `h${headingLevel}` : 'span');
          newTextEl.className = 'studpal-task-text';
          newTextEl.innerHTML = cleanHtml || '<br>';

          if (textSpan && textSpan.parentNode === activeTaskItem) {
            activeTaskItem.replaceChild(newTextEl, textSpan);
          } else if (textSpan) {
            textSpan.innerHTML = cleanHtml || '<br>';
          }

          const newRange = document.createRange();
          newRange.selectNodeContents(newTextEl);
          newRange.collapse(false);
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
          savedRangeRef.current = newRange.cloneRange();
          return true;
        }

        let ok = false;
        try {
          ok = document.execCommand('formatBlock', false, `<${tag}>`);
        } catch (e) {}
        if (!ok) {
          try {
            ok = document.execCommand('formatBlock', false, tag);
          } catch (e) {}
        }
        if (!ok) {
          try {
            ok = document.execCommand('formatBlock', false, `<${tag.toUpperCase()}>`);
          } catch (e) {}
        }
        if (!ok && activeRange) {
          try {
            let node = activeRange.commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            while (node && node !== editor && !/^(P|H[1-6]|DIV|LI|BLOCKQUOTE)$/i.test(node.tagName)) {
              node = node.parentNode;
            }
            if (node && node !== editor && node.parentNode) {
              const replacement = document.createElement(tag);
              replacement.innerHTML = node.innerHTML;
              node.parentNode.replaceChild(replacement, node);
              ok = true;
            }
          } catch (e) {}
        }
        return ok;
      };

      switch (cmd) {
        case 'h1':
          applyBlockFormat('h1');
          break;
        case 'h2':
          applyBlockFormat('h2');
          break;
        case 'h3':
          applyBlockFormat('h3');
          break;
        case 'body':
          applyBlockFormat('p');
          break;
        case 'bold':
          editor.focus({ preventScroll: true });
          document.execCommand('bold', false, null);
          break;
        case 'italic':
          editor.focus({ preventScroll: true });
          document.execCommand('italic', false, null);
          break;
        case 'underline':
          editor.focus({ preventScroll: true });
          document.execCommand('underline', false, null);
          break;
        case 'strikethrough':
          editor.focus({ preventScroll: true });
          document.execCommand('strikeThrough', false, null);
          break;
        case 'bullet':
          if (activeTaskItem) {
            const textSpan = activeTaskItem.querySelector('.studpal-task-text') || activeTaskItem;
            const cleanHtml = cleanTextForTask(textSpan.innerHTML);
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.innerHTML = cleanHtml || '<br>';
            ul.appendChild(li);
            activeTaskItem.parentNode.replaceChild(ul, activeTaskItem);
            const newRange = document.createRange();
            newRange.selectNodeContents(li);
            newRange.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
          } else {
            document.execCommand('insertUnorderedList', false, null);
          }
          break;
        case 'number':
          if (activeTaskItem) {
            const textSpan = activeTaskItem.querySelector('.studpal-task-text') || activeTaskItem;
            const cleanHtml = cleanTextForTask(textSpan.innerHTML);
            const ol = document.createElement('ol');
            const li = document.createElement('li');
            li.innerHTML = cleanHtml || '<br>';
            ol.appendChild(li);
            activeTaskItem.parentNode.replaceChild(ol, activeTaskItem);
            const newRange = document.createRange();
            newRange.selectNodeContents(li);
            newRange.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
          } else {
            document.execCommand('insertOrderedList', false, null);
          }
          break;
        case 'task': {
          if (!editor) break;

          const createTaskElement = (innerHTML = '<br>', isChecked = false, headingLevel = 0) => {
            const taskDiv = document.createElement('div');
            const headingClass = headingLevel > 0 ? ` studpal-task-h${headingLevel}` : '';
            taskDiv.className = 'studpal-task-item' + headingClass + (isChecked ? ' is-checked' : '');
            taskDiv.setAttribute('data-checked', isChecked ? 'true' : 'false');
            if (headingLevel > 0) {
              taskDiv.setAttribute('data-heading', `${headingLevel}`);
            }

            const checkbox = document.createElement('span');
            checkbox.className = 'studpal-task-checkbox';
            checkbox.setAttribute('contenteditable', 'false');
            taskDiv.appendChild(checkbox);

            const textEl = document.createElement(headingLevel > 0 ? `h${headingLevel}` : 'span');
            textEl.className = 'studpal-task-text';
            textEl.innerHTML = innerHTML || '<br>';
            taskDiv.appendChild(textEl);

            return taskDiv;
          };

          // 1. If selection is inside an existing task item -> toggle it back to paragraph or heading preserving level
          if (activeTaskItem) {
            const textSpan = activeTaskItem.querySelector('.studpal-task-text') || activeTaskItem;
            const isH1 = activeTaskItem.classList.contains('studpal-task-h1') || activeTaskItem.getAttribute('data-heading') === '1' || (textSpan.tagName && textSpan.tagName.toUpperCase() === 'H1');
            const isH2 = activeTaskItem.classList.contains('studpal-task-h2') || activeTaskItem.getAttribute('data-heading') === '2' || (textSpan.tagName && textSpan.tagName.toUpperCase() === 'H2');
            const isH3 = activeTaskItem.classList.contains('studpal-task-h3') || activeTaskItem.getAttribute('data-heading') === '3' || (textSpan.tagName && textSpan.tagName.toUpperCase() === 'H3');

            const targetTag = isH1 ? 'h1' : isH2 ? 'h2' : isH3 ? 'h3' : 'p';
            const replacement = document.createElement(targetTag);
            replacement.innerHTML = textSpan.innerHTML || '<br>';
            activeTaskItem.parentNode.replaceChild(replacement, activeTaskItem);

            const newRange = document.createRange();
            newRange.selectNodeContents(replacement);
            newRange.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
            break;
          }

          // 2. If inside a list item <li> -> convert that <li> into a task item IN PLACE without changing its position
          let startNode = activeRange ? activeRange.startContainer : null;
          if (startNode && startNode.nodeType === 3) startNode = startNode.parentNode;
          let liNode = startNode;
          while (liNode && liNode !== editor && liNode.tagName !== 'LI') {
            liNode = liNode.parentNode;
          }
          if (liNode && liNode.tagName === 'LI') {
            const taskDiv = createTaskElement(cleanTextForTask(liNode.innerHTML), false, 0);
            const listParent = liNode.parentNode;
            if (!listParent || listParent.children.length <= 1) {
              if (listParent && listParent.parentNode) {
                listParent.parentNode.replaceChild(taskDiv, listParent);
              }
            } else if (liNode === listParent.firstElementChild) {
              listParent.parentNode.insertBefore(taskDiv, listParent);
              liNode.remove();
            } else if (liNode === listParent.lastElementChild) {
              listParent.parentNode.insertBefore(taskDiv, listParent.nextSibling);
              liNode.remove();
            } else {
              // Split listParent so preceding items stay in place, taskDiv is in middle, subsequent items follow
              const afterList = document.createElement(listParent.tagName);
              let next = liNode.nextSibling;
              while (next) {
                const toMove = next;
                next = next.nextSibling;
                afterList.appendChild(toMove);
              }
              listParent.parentNode.insertBefore(taskDiv, listParent.nextSibling);
              if (afterList.children.length > 0) {
                listParent.parentNode.insertBefore(afterList, taskDiv.nextSibling);
              }
              liNode.remove();
            }
            const textEl = taskDiv.querySelector('.studpal-task-text');
            const newRange = document.createRange();
            newRange.selectNodeContents(textEl);
            newRange.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
            break;
          }

          // 3. Find top-level direct child block of editor containing activeRange
          const getEditorDirectChild = (node) => {
            let curr = node;
            if (curr && curr.nodeType === 3) curr = curr.parentNode;
            while (curr && curr.parentNode !== editor) {
              if (curr === editor) return null;
              curr = curr.parentNode;
            }
            return curr && curr.parentNode === editor ? curr : null;
          };

          let startBlock = activeRange ? getEditorDirectChild(activeRange.startContainer) : null;
          let endBlock = activeRange ? getEditorDirectChild(activeRange.endContainer) : null;

          if (!startBlock && activeRange && activeRange.startContainer === editor) {
            const idx = activeRange.startOffset;
            startBlock = (editor.children && editor.children[idx]) || editor.childNodes[idx] || null;
          }
          if (!endBlock && activeRange && activeRange.endContainer === editor) {
            const idx = Math.max(0, activeRange.endOffset - 1);
            endBlock = (editor.children && editor.children[idx]) || editor.childNodes[idx] || null;
          }

          // Empty editor fallback
          if (!startBlock) {
            const taskDiv = createTaskElement('<br>', false, 0);
            editor.appendChild(taskDiv);
            const textEl = taskDiv.querySelector('.studpal-task-text');
            const newRange = document.createRange();
            newRange.selectNodeContents(textEl);
            newRange.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
            break;
          }

          // If single block: convert IN PLACE without changing position
          if (!endBlock || startBlock === endBlock) {
            const tag = (startBlock.tagName || '').toUpperCase();
            const headingLevel = tag === 'H1' ? 1 : tag === 'H2' ? 2 : tag === 'H3' ? 3 : 0;
            const taskDiv = createTaskElement(cleanTextForTask(startBlock.innerHTML || startBlock.textContent), false, headingLevel);
            startBlock.parentNode.replaceChild(taskDiv, startBlock);

            const textEl = taskDiv.querySelector('.studpal-task-text');
            const newRange = document.createRange();
            newRange.selectNodeContents(textEl);
            newRange.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
            break;
          }

          // If multiple blocks selected: convert each block in place from startBlock to endBlock
          let curr = startBlock;
          const blocksToConvert = [];
          while (curr) {
            blocksToConvert.push(curr);
            if (curr === endBlock) break;
            curr = curr.nextSibling;
          }

          let lastTaskEl = null;
          blocksToConvert.forEach((b) => {
            if (b.classList && b.classList.contains('studpal-task-item')) {
              lastTaskEl = b;
              return;
            }
            const tag = (b.tagName || '').toUpperCase();
            const headingLevel = tag === 'H1' ? 1 : tag === 'H2' ? 2 : tag === 'H3' ? 3 : 0;
            const taskDiv = createTaskElement(cleanTextForTask(b.innerHTML || b.textContent), false, headingLevel);
            b.parentNode.replaceChild(taskDiv, b);
            lastTaskEl = taskDiv;
          });

          if (lastTaskEl) {
            const textEl = lastTaskEl.querySelector('.studpal-task-text') || lastTaskEl;
            const newRange = document.createRange();
            newRange.selectNodeContents(textEl);
            newRange.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
          }
          break;
        }
        case 'formula': {
          if (activeRange && isRangeInsideEditor(activeRange)) {
            const rawText = activeRange.toString().trim() || 'f(x) = x^2';
            const cleanFormula = rawText.replace(/^\$+\s*|\s*\$+$/g, '').trim() || 'f(x) = x^2';
            const fSpan = document.createElement('span');
            fSpan.className = 'studpal-formula';
            fSpan.textContent = `$ ${cleanFormula} $`;
            activeRange.deleteContents();
            activeRange.insertNode(fSpan);
            const newRange = document.createRange();
            newRange.setStartAfter(fSpan);
            newRange.collapse(true);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
          }
          break;
        }
        default:
          break;
      }

      // Re-save new selection after command
      if (sel && sel.rangeCount > 0) {
        try {
          savedRangeRef.current = sel.getRangeAt(0).cloneRange();
        } catch (e) {}
      }

      if (editor) {
        const md = htmlToMarkdown(editor.innerHTML);
        setNoteFormContent(md);
        pushHistory(md, true);
      }
    } else {
      applyFormatting(cmd);
    }
  };

  const applyFormatting = (type) => {
    const text = noteFormContent || '';
    let start = contentSelection.start ?? text.length;
    let end = contentSelection.end ?? text.length;

    if (Platform.OS === 'web' && contentInputRef.current) {
      const node = contentInputRef.current._node || contentInputRef.current;
      if (typeof node?.selectionStart === 'number' && typeof node?.selectionEnd === 'number') {
        start = node.selectionStart;
        end = node.selectionEnd;
      }
    }

    const selectedText = text.slice(start, end);

    // Calculate line bounds
    const lastNewlineBefore = text.lastIndexOf('\n', start - 1);
    const lineStart = lastNewlineBefore === -1 ? 0 : lastNewlineBefore + 1;
    const nextNewlineAfter = text.indexOf('\n', end);
    const lineEnd = nextNewlineAfter === -1 ? text.length : nextNewlineAfter;
    const currentLine = text.slice(lineStart, lineEnd);

    let newText = text;
    let newCursorPos = start;

    switch (type) {
      // ── Headings (Smart line-level switch/toggle)
      case 'h1': {
        const taskMatch = currentLine.match(/^([-*+]\s*\[[ xX]\]\s*)(.*)$/);
        if (taskMatch) {
          const checkPrefix = taskMatch[1];
          const rest = taskMatch[2].replace(/^#{1,6}\s*/, '');
          const newLine = taskMatch[2].startsWith('# ') ? `${checkPrefix}${rest}` : `${checkPrefix}# ${rest}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        } else {
          const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
          const newLine = currentLine.startsWith('# ') ? cleanLine : `# ${cleanLine}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        }
        break;
      }
      case 'h2': {
        const taskMatch = currentLine.match(/^([-*+]\s*\[[ xX]\]\s*)(.*)$/);
        if (taskMatch) {
          const checkPrefix = taskMatch[1];
          const rest = taskMatch[2].replace(/^#{1,6}\s*/, '');
          const newLine = taskMatch[2].startsWith('## ') ? `${checkPrefix}${rest}` : `${checkPrefix}## ${rest}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        } else {
          const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
          const newLine = currentLine.startsWith('## ') ? cleanLine : `## ${cleanLine}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        }
        break;
      }
      case 'h3': {
        const taskMatch = currentLine.match(/^([-*+]\s*\[[ xX]\]\s*)(.*)$/);
        if (taskMatch) {
          const checkPrefix = taskMatch[1];
          const rest = taskMatch[2].replace(/^#{1,6}\s*/, '');
          const newLine = taskMatch[2].startsWith('### ') ? `${checkPrefix}${rest}` : `${checkPrefix}### ${rest}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        } else {
          const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
          const newLine = currentLine.startsWith('### ') ? cleanLine : `### ${cleanLine}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        }
        break;
      }
      case 'body': {
        const taskMatch = currentLine.match(/^([-*+]\s*\[[ xX]\]\s*)(.*)$/);
        if (taskMatch) {
          const checkPrefix = taskMatch[1];
          const cleanRest = taskMatch[2].replace(/^#{1,6}\s*|^([-*+]\s*|\d+\.\s*)|^>\s*/, '');
          const newLine = `${checkPrefix}${cleanRest}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        } else {
          const cleanLine = currentLine.replace(/^#{1,6}\s*|^([-*+]\s*|\d+\.\s*|\[[ xX]\]\s*)|^>\s*/, '');
          newText = text.slice(0, lineStart) + cleanLine + text.slice(lineEnd);
          newCursorPos = lineStart + cleanLine.length;
        }
        break;
      }

      // ── Lists & Tasks (Line-level toggle)
      case 'bullet': {
        const cleanLine = currentLine.replace(/^([-*+]\s*|\d+\.\s*|\[[ xX]\]\s*)/, '');
        const newLine = currentLine.startsWith('- ') ? cleanLine : `- ${cleanLine}`;
        newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
        newCursorPos = lineStart + newLine.length;
        break;
      }
      case 'number': {
        const cleanLine = currentLine.replace(/^([-*+]\s*|\d+\.\s*|\[[ xX]\]\s*)/, '');
        const newLine = /^\d+\.\s*/.test(currentLine) ? cleanLine : `1. ${cleanLine}`;
        newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
        newCursorPos = lineStart + newLine.length;
        break;
      }
      case 'task': {
        const taskMatch = currentLine.match(/^[-*+]\s*\[[ xX]\]\s*(.*)$/);
        if (taskMatch) {
          const rest = taskMatch[1];
          newText = text.slice(0, lineStart) + rest + text.slice(lineEnd);
          newCursorPos = lineStart + rest.length;
        } else {
          const content = currentLine.replace(/^([-*+]\s*|\d+\.\s*)/, '');
          const newLine = `- [ ] ${content}`;
          newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
          newCursorPos = lineStart + newLine.length;
        }
        break;
      }
      case 'quote': {
        const cleanLine = currentLine.replace(/^>\s*/, '');
        const newLine = currentLine.startsWith('> ') ? cleanLine : `> ${cleanLine}`;
        newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
        newCursorPos = lineStart + newLine.length;
        break;
      }

      // ── Inline Text Wrappers (Smart wrap / unwrap)
      case 'bold': {
        if (selectedText.startsWith('**') && selectedText.endsWith('**') && selectedText.length >= 4) {
          const unwrapped = selectedText.slice(2, -2);
          newText = text.slice(0, start) + unwrapped + text.slice(end);
          newCursorPos = start + unwrapped.length;
        } else if (start !== end) {
          newText = text.slice(0, start) + `**${selectedText}**` + text.slice(end);
          newCursorPos = start + selectedText.length + 4;
        } else {
          newText = text.slice(0, start) + `**bold text**` + text.slice(start);
          newCursorPos = start + 2;
        }
        break;
      }
      case 'italic': {
        if (selectedText.startsWith('*') && selectedText.endsWith('*') && selectedText.length >= 2) {
          const unwrapped = selectedText.slice(1, -1);
          newText = text.slice(0, start) + unwrapped + text.slice(end);
          newCursorPos = start + unwrapped.length;
        } else if (start !== end) {
          newText = text.slice(0, start) + `*${selectedText}*` + text.slice(end);
          newCursorPos = start + selectedText.length + 2;
        } else {
          newText = text.slice(0, start) + `*italic text*` + text.slice(start);
          newCursorPos = start + 1;
        }
        break;
      }
      case 'strikethrough': {
        if (selectedText.startsWith('~~') && selectedText.endsWith('~~') && selectedText.length >= 4) {
          const unwrapped = selectedText.slice(2, -2);
          newText = text.slice(0, start) + unwrapped + text.slice(end);
          newCursorPos = start + unwrapped.length;
        } else if (start !== end) {
          newText = text.slice(0, start) + `~~${selectedText}~~` + text.slice(end);
          newCursorPos = start + selectedText.length + 4;
        } else {
          newText = text.slice(0, start) + `~~strikethrough~~` + text.slice(start);
          newCursorPos = start + 2;
        }
        break;
      }
      case 'underline': {
        if (selectedText.startsWith('<u>') && selectedText.endsWith('</u>') && selectedText.length >= 7) {
          const unwrapped = selectedText.slice(3, -4);
          newText = text.slice(0, start) + unwrapped + text.slice(end);
          newCursorPos = start + unwrapped.length;
        } else if (start !== end) {
          newText = text.slice(0, start) + `<u>${selectedText}</u>` + text.slice(end);
          newCursorPos = start + selectedText.length + 7;
        } else {
          newText = text.slice(0, start) + `<u>underlined text</u>` + text.slice(start);
          newCursorPos = start + 3;
        }
        break;
      }
      case 'highlight': {
        if (selectedText.startsWith('==') && selectedText.endsWith('==') && selectedText.length >= 4) {
          const unwrapped = selectedText.slice(2, -2);
          newText = text.slice(0, start) + unwrapped + text.slice(end);
          newCursorPos = start + unwrapped.length;
        } else if (start !== end) {
          newText = text.slice(0, start) + `==${selectedText}==` + text.slice(end);
          newCursorPos = start + selectedText.length + 4;
        } else {
          newText = text.slice(0, start) + `==important==` + text.slice(start);
          newCursorPos = start + 2;
        }
        break;
      }
      case 'code': {
        if (selectedText.includes('\n')) {
          newText = text.slice(0, start) + `\n\`\`\`\n${selectedText}\n\`\`\`\n` + text.slice(end);
          newCursorPos = start + selectedText.length + 8;
        } else if (start !== end) {
          newText = text.slice(0, start) + `\`${selectedText}\`` + text.slice(end);
          newCursorPos = start + selectedText.length + 2;
        } else {
          newText = text.slice(0, start) + `\`code\`` + text.slice(start);
          newCursorPos = start + 1;
        }
        break;
      }
      case 'formula': {
        if (start !== end) {
          newText = text.slice(0, start) + `$ ${selectedText} $` + text.slice(end);
          newCursorPos = start + selectedText.length + 4;
        } else {
          newText = text.slice(0, start) + `$ \\int_{a}^{b} f(x) dx $` + text.slice(start);
          newCursorPos = start + 2;
        }
        break;
      }
      case 'divider': {
        newText = text.slice(0, start) + `\n\n---\n\n` + text.slice(start);
        newCursorPos = start + 7;
        break;
      }
      default:
        return;
    }

    setNoteFormContent(newText);
    pushHistory(newText);
    setContentSelection({ start: newCursorPos, end: newCursorPos });
    if (Platform.OS === 'web' && contentInputRef.current) {
      const node = contentInputRef.current._node || contentInputRef.current;
      if (node && typeof node.focus === 'function') {
        node.focus();
        if (typeof node.setSelectionRange === 'function') {
          node.setSelectionRange(newCursorPos, newCursorPos);
        }
      }
    } else if (contentInputRef.current?.focus) {
      contentInputRef.current.focus();
    }
  };

  const handleTogglePin = (noteId) => {
    studyService.togglePinNote(noteId);
    setActiveMenuNoteId(null);
    refreshData();
  };

  const handleOpenNotes = (subjId = null, topId = null) => {
    setSelectedSubjectId(subjId);
    setSelectedTopicId(topId);
    setViewState("notes");
  };

  const handleCreateNoteModal = (subjId = null, topId = null) => {
    const sId = subjId || selectedSubjectId || "math";
    const subjObj = studyService.subjects.find((s) => s.id === sId) || studyService.subjects[0];
    const tId = topId || selectedTopicId || (subjObj && subjObj.topics && subjObj.topics[0] && subjObj.topics[0].id) || "m1";

    loadedNoteKeyRef.current = null;
    setEditingNote(null);
    setNoteFormTitle("");
    setNoteFormSubjectId(sId);
    setNoteFormTopicId(tId);
    setNoteFormContent("");
    setNoteEditorMode('edit');
    setIsFormatTrayOpen(false);
    if (typingHistoryTimerRef.current) {
      clearTimeout(typingHistoryTimerRef.current);
      typingHistoryTimerRef.current = null;
    }
    historyStackRef.current = [""];
    historyIndexRef.current = 0;
    setHistoryStack([""]);
    setHistoryIndex(0);
    setIsClassificationModalOpen(true);
  };

  const handleEditNoteModal = (note) => {
    loadedNoteKeyRef.current = null;
    setEditingNote(note);
    setNoteFormTitle(note.title);
    setNoteFormSubjectId(note.subjectId);
    setNoteFormTopicId(note.topicId);
    setNoteFormContent(note.content);
    setNoteEditorMode('edit');
    setIsFormatTrayOpen(false);
    const initialText = note.content || "";
    if (typingHistoryTimerRef.current) {
      clearTimeout(typingHistoryTimerRef.current);
      typingHistoryTimerRef.current = null;
    }
    historyStackRef.current = [initialText];
    historyIndexRef.current = 0;
    setHistoryStack([initialText]);
    setHistoryIndex(0);
    setViewState("note-editor");
  };

  const handleSaveNote = () => {
    if (!noteFormTitle.trim()) {
      Alert.alert("Required", "Please enter a title for your note.");
      return;
    }

    // Elastic tactile spring press & pop animation
    Animated.sequence([
      Animated.timing(saveBtnScale, {
        toValue: 0.88,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(saveBtnScale, {
        toValue: 1.15,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.spring(saveBtnScale, {
        toValue: 1.0,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSavingSuccess(true);

    let finalContent = noteFormContent;
    if (Platform.OS === 'web' && contentEditableRef.current) {
      finalContent = htmlToMarkdown(contentEditableRef.current.innerHTML);
      setNoteFormContent(finalContent);
    }

    studyService.saveNote({
      id: (editingNote && editingNote.id),
      title: noteFormTitle,
      subjectId: noteFormSubjectId,
      topicId: noteFormTopicId,
      content: finalContent,
    });

    setTimeout(() => {
      loadedNoteKeyRef.current = null;
      setIsSavingSuccess(false);
      setViewState("notes");
      refreshData();
    }, 450);
  };

  const insertFormatting = (prefix, suffix = "") => {
    setNoteFormContent((prev) => `${prev}${prefix}${suffix}`);
  };

  const wordCount = useMemo(() => {
    const plain = (noteFormContent || '').replace(/[#*`_~=\[\]\(\)>-]+/g, ' ').trim();
    return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  }, [noteFormContent]);

  const charCount = useMemo(() => {
    const plain = (noteFormContent || '').replace(/[#*`_~=\[\]\(\)>-]+/g, '').trim();
    return plain.length;
  }, [noteFormContent]);

  const handleDeleteNote = (target) => {
    if (!target) return;
    if (typeof target === "string") {
      const allNotes = studyService.getNotes();
      const found = allNotes.find((n) => n.id === target) || { id: target, title: "this note" };
      setNoteToDelete(found);
    } else {
      setNoteToDelete(target);
    }
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      const targetId = typeof noteToDelete === "string" ? noteToDelete : noteToDelete.id;
      if (targetId) {
        studyService.deleteNote(targetId);
      }
      setNoteToDelete(null);
      if (viewState === "note-editor") {
        setViewState("notes");
      }
      refreshData();
    }
  };

  // Dynamic Data & Recommendations
  const dueCardsCount = studyService.getDueCardsCount();
  const recentQuizAvg = studyService.getRecentQuizAvg();
  const availableQuizzes = studyService.getAvailableQuizzes(selectedSubjectId, selectedTopicId, currentLang);
  const notesList = studyService.getNotes(selectedSubjectId, selectedTopicId, notesSearch);
  const recommendations = useMemo(() => studyService.getSmartRecommendations(), [dataVersion]);

  // Subject topics lookup helper for Form Modal & Header Badge
  const activeFormSubject = studyService.subjects.find((s) => s.id === noteFormSubjectId) || studyService.subjects[0];
  const activeFormTopic = activeFormSubject?.topics?.find((t) => t.id === noteFormTopicId) || activeFormSubject?.topics?.[0];

  return (
    <SafeAreaView style={[styles.root, viewState === "review" && { backgroundColor: isDark ? "#06080F" : "#FAF8F5" }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? (viewState === "review" ? "#06080F" : "#0B0F19") : (viewState === "review" ? "#FAF8F5" : "#FFFFFF")} />

      {/* ── TOP HEADER (PERSISTENT BRAND HEADER) ─────────────────────── */}
      {!(viewState === "quiz" && quizSubState === "results") && (
        <View style={[styles.topHeader, viewState === "review" && styles.calmHeader]}>
          <View style={styles.headerLeftRow}>
            {viewState !== "overview" && (
              <TooltipTouchable
                tooltip="Back"
                style={[styles.backBtn, viewState === "review" && styles.calmBackBtn]}
                onPress={() => {
                  if (viewState === "quiz" && quizSubState === "active") {
                    setQuizSubState("select");
                  } else if (viewState === "note-editor") {
                    loadedNoteKeyRef.current = null;
                    setViewState("notes");
                  } else {
                    setViewState("overview");
                  }
                }}
              >
              <ChevronLeftIcon size={20} color={isDark ? "#F8FAFC" : (viewState === "review" ? "#1E293B" : "#0F172A")} />
            </TooltipTouchable>
          )}

          {viewState === "note-editor" ? (
            <View style={styles.nativeHeaderCenterContainer}>
              <TouchableOpacity
                style={[styles.nativeHeaderTopicPill, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                onPress={() => setIsClassificationModalOpen(true)}
                activeOpacity={0.75}
              >
                <Text style={styles.nativeHeaderTopicEmoji}>{activeFormSubject?.iconEmoji || "📝"}</Text>
                <Text style={[styles.nativeHeaderTopicText, isDark && { color: '#F1F5F9' }]} numberOfLines={1}>
                  {activeFormSubject?.name || 'General'} • {activeFormTopic?.name || 'Topic'}
                </Text>
                <ChevronDownIcon size={12} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.headerTitle,
                  viewState === "review" && styles.calmHeaderTitle,
                ]}
                numberOfLines={1}
              >
                {viewState === "overview" && (t("study.hubTitle") || "Study Hub")}
                {viewState === "review" && (t("study.flashcardReview") || "Flashcard Review")}
                {viewState === "quiz" && (t("study.quiz") || "Quiz")}
                {viewState === "notes" && (t("study.notesLibrary") || "Notes Library")}
              </Text>
              <Text style={[styles.headerSubtitle, viewState === "review" && styles.calmHeaderSubtitle]} numberOfLines={1}>
                {viewState === "overview" && (t("study.hubSubtitle") || "Review, test yourself, and master every topic.")}
                {viewState === "review" && ((currentCard && currentCard.category) || "Organic Chemistry I")}
                {viewState === "quiz" && (t("study.practiceTests") || "Topic-based testing connected to SRS")}
                {viewState === "notes" && (t("study.subjectOrganized") || "Organized by Subject & Topic")}
              </Text>
            </View>
          )}
        </View>

        {/* Header Right Action: Note Editor Actions (Undo, Redo, Save) or None */}
        {viewState === "note-editor" ? (
          <View style={styles.nativeHeaderRightActions}>
            <TouchableOpacity
              onPress={handleUndo}
              disabled={historyIndex <= 0}
              style={[styles.nativeHeaderIconBtn, historyIndex <= 0 && { opacity: 0.35 }]}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <UndoIcon size={18} color={isDark ? '#E2E8F0' : '#334155'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRedo}
              disabled={historyIndex >= historyStack.length - 1}
              style={[styles.nativeHeaderIconBtn, historyIndex >= historyStack.length - 1 && { opacity: 0.35 }]}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <RedoIcon size={18} color={isDark ? '#E2E8F0' : '#334155'} />
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: saveBtnScale }] }}>
              <TouchableOpacity
                style={[
                  styles.nativeHeaderSaveBtn,
                  { backgroundColor: isSavingSuccess ? '#10B981' : (accentColor || '#2D62FF') }
                ]}
                onPress={handleSaveNote}
                activeOpacity={0.8}
              >
                <CheckIcon size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : null}
      </View>
      )}

      {/* ── VIEW 1: OVERVIEW / STUDY HUB LANDING PAGE ─────────────────── */}
      {viewState === "overview" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 140 }]}
        >
          {/* Active Subject Workspace Quick Bar */}
          <TouchableOpacity
            style={styles.subjectFilterBar}
            onPress={() => (onNavigate ? onNavigate("subjects") : onSelectTab("subjects"))}
            activeOpacity={0.75}
          >
            <View style={[styles.subjectFilterHeader, { marginBottom: 0 }]}>
              <View style={styles.subjectFilterTitleGroup}>
                <FolderIcon size={16} color={accentColor || "#6236FF"} />
                <Text style={styles.subjectFilterTitle}>
                  {t("study.subjectWorkspaces") || "Subject Workspaces"}
                </Text>
              </View>
              <View style={styles.manageSubjectsLink}>
                <Text style={[styles.manageSubjectsLinkText, { color: accentColor || "#6236FF" }]}>
                  {t("study.manageAll") || "Manage All"}
                </Text>
                <ChevronRightIcon size={14} color={accentColor || "#6236FF"} />
              </View>
            </View>
          </TouchableOpacity>

          {/* ── UNIFIED KNOWLEDGE INTELLIGENCE CARD (Flashcards & Quiz Thinking as One) ── */}
          {(() => {
            const syncSummary = studyService.getKnowledgeSyncSummary();
            return (
              <View style={[styles.syncCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                {/* Header Row */}
                <View style={styles.syncCardHeader}>
                  <View style={styles.syncCardTitleGroup}>
                    <View style={[styles.syncBrainIconCircle, { backgroundColor: isDark ? "rgba(98, 54, 255, 0.2)" : "rgba(98, 54, 255, 0.1)" }]}>
                      <BrainIcon size={20} color={accentColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.syncCardTitle, isDark && { color: '#F8FAFC' }]}>
                        {t("study.connectedBrainTitle") || "Connected Learning Intelligence"}
                      </Text>
                      <Text style={[styles.syncCardSubtitle, isDark && { color: '#94A3B8' }]}>
                        {t("study.connectedBrainSubtitle") || "Flashcards & Quizzes think as one unified brain"}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.syncLiveBadge, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5", borderColor: isDark ? "rgba(16, 185, 129, 0.3)" : "#A7F3D0" }]}>
                    <View style={styles.syncLivePulseDot} />
                    <Text style={styles.syncLiveBadgeText}>
                      {t("study.syncLive") || "SYNCED"}
                    </Text>
                  </View>
                </View>

                {/* 2-Column Cross-Pollination Metrics */}
                <View style={styles.syncMetricsRow}>
                  {/* Metric 1: Quiz -> Flashcard */}
                  <View style={[styles.syncMetricCard, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <View style={styles.syncMetricHeader}>
                      <TargetIcon size={14} color="#EF4444" />
                      <Text style={[styles.syncMetricLabel, isDark && { color: '#94A3B8' }]}>
                        {t("study.quizToCards") || "Quiz Mistakes in Cards"}
                      </Text>
                    </View>
                    <View style={styles.syncMetricValueRow}>
                      <Text style={[styles.syncMetricValue, { color: syncSummary.quizMissedPrioritized > 0 ? "#EF4444" : "#10B981" }]}>
                        {syncSummary.quizMissedPrioritized}
                      </Text>
                      <Text style={[styles.syncMetricUnit, isDark && { color: '#94A3B8' }]}>
                        {syncSummary.quizMissedPrioritized === 1 ? "card prioritized" : "cards prioritized"}
                      </Text>
                    </View>
                  </View>

                  {/* Metric 2: Flashcard -> Quiz */}
                  <View style={[styles.syncMetricCard, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <View style={styles.syncMetricHeader}>
                      <BrainIcon size={14} color={accentColor} />
                      <Text style={[styles.syncMetricLabel, isDark && { color: '#94A3B8' }]}>
                        {t("study.cardsToQuiz") || "Card Struggles in Quiz"}
                      </Text>
                    </View>
                    <View style={styles.syncMetricValueRow}>
                      <Text style={[styles.syncMetricValue, { color: accentColor }]}>
                        {syncSummary.flashcardStrugglesQueued}
                      </Text>
                      <Text style={[styles.syncMetricUnit, isDark && { color: '#94A3B8' }]}>
                        {syncSummary.flashcardStrugglesQueued === 1 ? "concept queued" : "concepts queued"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Active Actionable Bridge Callout (if active bridge exists) */}
                {syncSummary.activeBridge && (
                  <View style={[styles.syncActionBanner, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={[styles.syncActionBannerTitle, isDark && { color: '#F8FAFC' }]} numberOfLines={1}>
                        {syncSummary.activeBridge.title}
                      </Text>
                      <Text style={[styles.syncActionBannerSubtitle, isDark && { color: '#94A3B8' }]} numberOfLines={2}>
                        {syncSummary.activeBridge.subtitle}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.syncActionBtn, { backgroundColor: accentColor }]}
                      onPress={() => {
                        if (syncSummary.activeBridge.type === "quiz_to_flashcard") {
                          handleStartReviewSession(
                            syncSummary.activeBridge.subjectId,
                            syncSummary.activeBridge.topicId,
                            0,
                            true
                          );
                        } else {
                          handleStartQuiz(
                            syncSummary.activeBridge.subjectId,
                            syncSummary.activeBridge.topicId
                          );
                        }
                      }}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.syncActionBtnText}>
                        {syncSummary.activeBridge.actionText}
                      </Text>
                      <ChevronRightIcon size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })()}

          {/* 3 Prominent Feature Hub Cards */}
          <View style={styles.hubCardsGrid}>
            {/* 1. NOTES CARD */}
            <TouchableOpacity
              style={[styles.hubCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
              onPress={() => handleOpenNotes()}
              activeOpacity={0.88}
            >
              <View style={styles.hubCardHeader}>
                <View style={[styles.hubIconCircle, { backgroundColor: "rgba(45, 98, 255, 0.10)" }]}>
                  <NotebookIcon size={22} color={accentColor} />
                </View>
                <View style={[styles.badgePillPrimary, { backgroundColor: "rgba(45, 98, 255, 0.10)" }]}>
                  <Text style={[styles.badgePillTextPrimary, { color: accentColor }]}>{(t("study.notesLibrary") || "NOTES LIBRARY").toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.hubCardTitle, isDark && { color: '#F8FAFC' }]}>{t("study.studyNotes") || "Study Notes"}</Text>
              <Text style={[styles.hubCardDescription, isDark && { color: '#94A3B8' }]}>
                {t("study.studyNotesSub") || "Create, organize, and revise smart notes linked directly to your active subjects."}
              </Text>
              <View style={styles.hubCardStatsRow}>
                <View style={[styles.hubStatBadge, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.hubStatValue, isDark && { color: '#F8FAFC' }, { color: accentColor }]}>{studyService.notes.length}</Text>
                  <Text style={[styles.hubStatLabel, isDark && { color: '#94A3B8' }]}>{t("study.savedNotes") || "Saved Notes"}</Text>
                </View>
                <View style={[styles.hubStatBadge, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.hubStatValue, isDark && { color: '#F8FAFC' }]}>{t("common.active") || "Subject"}</Text>
                  <Text style={[styles.hubStatLabel, isDark && { color: '#94A3B8' }]}>{t("study.subjectOrganized") || "Organized"}</Text>
                </View>
                <View style={[styles.hubStatBadge, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.hubStatValue, isDark && { color: '#F8FAFC' }]}>SRS</Text>
                  <Text style={[styles.hubStatLabel, isDark && { color: '#94A3B8' }]}>{t("study.linkedToSrs") || "To SRS"}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 2. REVIEW CARD */}
            <TouchableOpacity
              style={styles.hubCard}
              onPress={() => handleStartReviewSession()}
              activeOpacity={0.88}
            >
              <View style={styles.hubCardHeader}>
                <View style={[styles.hubIconCircle, { backgroundColor: "#F0EEFF" }]}>
                  <BrainIcon size={22} color="#6236FF" />
                </View>
                <View style={styles.badgePillPrimary}>
                  <Text style={styles.badgePillTextPrimary}>SRS</Text>
                </View>
              </View>
              <Text style={styles.hubCardTitle}>{t("study.flashcardReview") || "Review"}</Text>
              <Text style={styles.hubCardDescription}>
                {t("study.hubSubtitle") || "Review your flashcards and stay on track."}
              </Text>
              <View style={styles.hubCardStatsRow}>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>{dueCardsCount}</Text>
                  <Text style={styles.hubStatLabel}>{t("study.dueCards") || "Cards Due"}</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>3</Text>
                  <Text style={styles.hubStatLabel}>{t("study.streak") || "Needs Review"}</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>78%</Text>
                  <Text style={styles.hubStatLabel}>{t("study.mastery") || "Goal Rate"}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 3. QUIZ CARD */}
            <TouchableOpacity
              style={[styles.hubCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
              onPress={() => handleStartQuiz()}
              activeOpacity={0.88}
            >
              <View style={styles.hubCardHeader}>
                <View style={[styles.hubIconCircle, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.15)" : "#EEF3FF" }]}>
                  <TargetIcon size={22} color={accentColor} />
                </View>
                <View style={[styles.badgePillPrimary, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.15)" : "#EEF3FF" }]}>
                  <Text style={[styles.badgePillTextPrimary, { color: accentColor }]}>{(t("study.practiceTests") || "TEST").toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.hubCardTitle, isDark && { color: '#F8FAFC' }]}>{t("study.quiz") || "Quiz"}</Text>
              <Text style={[styles.hubCardDescription, isDark && { color: '#94A3B8' }]}>
                {t("study.hubSubtitle") || "Test what you know and discover weak areas."}
              </Text>
              <View style={styles.hubCardStatsRow}>
                <View style={[styles.hubStatBadge, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.hubStatValue, { color: accentColor }]}>{availableQuizzes.length}</Text>
                  <Text style={[styles.hubStatLabel, isDark && { color: '#94A3B8' }]}>{t("study.practiceTests") || "Quizzes"}</Text>
                </View>
                <View style={[styles.hubStatBadge, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.hubStatValue, { color: accentColor }]}>{recentQuizAvg}%</Text>
                  <Text style={[styles.hubStatLabel, isDark && { color: '#94A3B8' }]}>{t("study.accuracy") || "Avg Score"}</Text>
                </View>
                <View style={[styles.hubStatBadge, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.hubStatValue, { color: accentColor }]}>SRS</Text>
                  <Text style={[styles.hubStatLabel, isDark && { color: '#94A3B8' }]}>{t("study.linkedToSrs") || "To SRS"}</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>

          {/* ── SMART RECOMMENDATIONS (Connected Next Steps) ── */}
          {recommendations.length > 0 && (
            <View style={styles.recommendationsSection}>
              <View style={styles.sectionHeaderRow}>
                <SparkleIcon size={18} color={accentColor} />
                <Text style={[styles.sectionTitle, isDark && { color: '#F8FAFC' }]}>
                  {t("study.recommendedNextSteps") || "Recommended Next Steps"}
                </Text>
              </View>

              {recommendations.map((rec) => (
                <View
                  key={rec.id}
                  style={[styles.recommendationCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                >
                  <View style={styles.recTextGroup}>
                    <Text style={[styles.recTitle, isDark && { color: '#F8FAFC' }]}>{rec.title}</Text>
                    <Text style={[styles.recReason, isDark && { color: '#94A3B8' }]}>{rec.reason}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.recActionBtn, { backgroundColor: accentColor }]}
                    onPress={() => {
                      if (rec.targetView === "review") {
                        handleStartReviewSession(rec.subjectId || null, rec.topicId || null, 0, rec.filterQuizMissedOnly);
                      } else if (rec.targetView === "quiz") {
                        handleStartQuiz(rec.subjectId || null, rec.topicId || null);
                      } else if (rec.targetView === "notes") {
                        handleOpenNotes(rec.subjectId || null, rec.topicId || null);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.recActionBtnText}>{rec.actionText}</Text>
                    <ChevronRightIcon size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ── VIEW 2: SRS REVIEW SYSTEM ──────────────────────────────────── */}
      {viewState === "review" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 140 }]}
        >
          {!isSessionComplete ? (
            <View style={styles.sessionContainer}>
              {/* Calm Progress Row & Track */}
              <View style={styles.calmProgressRow}>
                <Text style={styles.calmProgressLeft}>
                  {t("study.cardProgress", { current: currentIndex + 1, total: cards.length || 1 }) || `Card ${currentIndex + 1} of ${cards.length || 1}`}
                </Text>
                <Text style={styles.calmProgressRight}>
                  {cardsReviewed > 0
                    ? (t("study.percentCorrect", { percent: Math.round((easyCount / cardsReviewed) * 100) }) || `${Math.round((easyCount / cardsReviewed) * 100)}% correct`)
                    : (t("study.percentCorrect", { percent: 80 }) || "80% correct")}
                </Text>
              </View>

              <View style={styles.calmProgressTrack}>
                <View
                  style={[
                    styles.calmProgressFill,
                    { width: `${Math.round(((currentIndex + 1) / (cards.length || 1)) * 100)}%` },
                  ]}
                />
              </View>

              {/* Dual-Face 3D Glass Flip Container (Crystal Clear Sharp Text) */}
              <Animated.View
                style={[
                  styles.calmFlashcardOuterContainer,
                  {
                    opacity: cardNextOpacity,
                    transform: [{ translateX: cardNextTranslateX }, { scale: cardNextScale }],
                  },
                ]}
              >
                {/* ── FRONT FACE (QUESTION) ── */}
                <Animated.View
                  style={[
                    styles.calmFlashcardFace,
                    isFlippedState && styles.calmFlashcardFaceInactive,
                    {
                      transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                      zIndex: isFlippedState ? 1 : 2,
                    },
                  ]}
                  pointerEvents={isFlippedState ? "none" : "auto"}
                >
                  <TouchableOpacity
                    style={styles.calmFlashcard}
                    onPress={handleFlipCardAnimation}
                    activeOpacity={0.95}
                  >
                    {/* Hyper-Prominent Multi-Layer Dual-Beam Glass Prism Flare */}
                    <Animated.View
                      style={[
                        styles.shineSurfaceFlash,
                        { opacity: shineSurfaceOpacity },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.shineFlareContainer,
                        {
                          opacity: shineOpacity,
                          transform: [{ translateX: shineTranslate }],
                        },
                      ]}
                    >
                      <View style={styles.shineDiffuserBand} />
                      <View style={styles.shineMainBeam} />
                      <View style={styles.shineSpecularCore} />
                      <View style={styles.shineSecondaryStreak} />
                    </Animated.View>

                    {/* Header Tag & State Pill */}
                    <View style={styles.calmCardHeaderRow}>
                      <Text style={styles.calmCategoryTag}>
                        {(currentCard && currentCard.category) || "FUNCTIONAL GROUPS"}
                      </Text>
                      <View style={styles.calmStatePillQuestion}>
                        <Text style={styles.calmStatePillTextQuestion}>{t("study.questionTag") || "QUESTION"}</Text>
                      </View>
                    </View>

                    {/* Quiz Bridge Front Indicator */}
                    {currentCard && currentCard.quizBridge && !currentCard.quizBridge.resolved && (
                      <View style={styles.quizBridgeFrontPill}>
                        <TargetIcon size={12} color="#EF4444" />
                        <Text style={styles.quizBridgeFrontPillText} numberOfLines={1}>
                          {t("study.quizFollowUp") || `Quiz Follow-up • ${currentCard.quizBridge.quizTitle || "Missed in Practice Quiz"}`}
                        </Text>
                      </View>
                    )}

                    {/* Card Body */}
                    <View style={styles.calmCardBody}>
                      <View style={styles.calmCardContentCenter}>
                        <Text style={styles.calmQuestionText}>
                          {(currentCard && currentCard.question)}
                        </Text>
                        {showHint && (
                          <Text style={styles.calmHintSubtext}>
                            💡 {(currentCard && currentCard.hint)}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Card Footer Indicator */}
                    <View style={styles.calmCardFooter}>
                      <Text style={styles.calmTapFlipText}>{t("study.tapToReveal") || "Tap card to reveal answer"}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>

                {/* ── BACK FACE (ANSWER) - 100% Crisp Native Vector Text ── */}
                <Animated.View
                  style={[
                    styles.calmFlashcardFace,
                    !isFlippedState && styles.calmFlashcardFaceInactive,
                    {
                      transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                      zIndex: isFlippedState ? 2 : 1,
                    },
                  ]}
                  pointerEvents={isFlippedState ? "auto" : "none"}
                >
                  <TouchableOpacity
                    style={[styles.calmFlashcard, styles.calmFlashcardFlipped]}
                    onPress={handleFlipCardAnimation}
                    activeOpacity={0.95}
                  >
                    {/* Hyper-Prominent Multi-Layer Dual-Beam Glass Prism Flare */}
                    <Animated.View
                      style={[
                        styles.shineSurfaceFlash,
                        { opacity: shineSurfaceOpacity },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.shineFlareContainer,
                        {
                          opacity: shineOpacity,
                          transform: [{ translateX: shineTranslate }],
                        },
                      ]}
                    >
                      <View style={styles.shineDiffuserBand} />
                      <View style={styles.shineMainBeam} />
                      <View style={styles.shineSpecularCore} />
                      <View style={styles.shineSecondaryStreak} />
                    </Animated.View>

                    {/* Header Tag & State Pill */}
                    <View style={styles.calmCardHeaderRow}>
                      <Text style={styles.calmCategoryTag}>
                        {(currentCard && currentCard.category) || "FUNCTIONAL GROUPS"}
                      </Text>
                      <View style={styles.calmStatePillAnswer}>
                        <Text style={styles.calmStatePillTextAnswer}>{t("study.answerTag") || "ANSWER"}</Text>
                      </View>
                    </View>

                    {/* Card Body - Razor Sharp Clear Typography */}
                    <View style={styles.calmCardBody}>
                      <View style={styles.calmCardContentCenter}>
                        <Text style={styles.calmAnswerTitle}>
                          {(currentCard && currentCard.answer)}
                        </Text>
                        <Text style={styles.calmAnswerDescription}>
                          {(currentCard && currentCard.explanation)}
                        </Text>
                        {currentCard && currentCard.takeaway && (
                          <View style={styles.calmTakeawayBox}>
                            <Text style={styles.calmTakeawayCode}>
                              {currentCard.takeaway}
                            </Text>
                          </View>
                        )}

                        {/* Quiz Bridge Detail Box (Back Face) */}
                        {currentCard && currentCard.quizBridge && (
                          <View style={styles.quizBridgeDetailBox}>
                            <View style={styles.quizBridgeDetailHeader}>
                              <TargetIcon size={13} color="#EF4444" />
                              <Text style={styles.quizBridgeDetailTitle}>
                                {t("study.quizMistakeContext") || `Targeted from Quiz Mistake (${currentCard.quizBridge.quizTitle || "Quiz"})`}
                              </Text>
                            </View>
                            <Text style={styles.quizBridgeDetailQuestion}>
                              "{currentCard.quizBridge.missedQuestion}"
                            </Text>
                            {currentCard.quizBridge.userChoice && (
                              <Text style={styles.quizBridgeDetailAnswer}>
                                <Text style={{ color: "#EF4444", fontWeight: "700" }}>
                                  {t("study.youAnswered") || "You answered:"} {currentCard.quizBridge.userChoice}
                                </Text>
                                {currentCard.quizBridge.correctAnswer && (
                                  <Text style={{ color: "#10B981", fontWeight: "700" }}>
                                    {" • "}{t("study.correct") || "Correct:"} {currentCard.quizBridge.correctAnswer}
                                  </Text>
                                )}
                              </Text>
                            )}
                            <Text style={styles.quizBridgeDetailTakeaway}>
                              💡 {t("study.quizRemediationNote") || "Reviewing this flashcard reinforces the core rule to guarantee recall on your next quiz."}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Card Footer Indicator */}
                    <View style={styles.calmCardFooter}>
                      <Text style={styles.calmTapFlipText}>{t("study.tapToFlipBack") || "Tap card to flip back to question"}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>

              {/* Subtle, Smooth, Premium Bottom Bar Transition */}
              <View style={styles.bottomBarContainer}>
                {/* ── QUESTION TOOLS (Show Hint & Ask Branco) ── */}
                <Animated.View
                  style={[
                    styles.toolsRowContainer,
                    {
                      opacity: bottomToolsOpacity,
                      transform: [{ translateY: bottomToolsTranslateY }],
                      zIndex: isFlippedState ? 1 : 2,
                    },
                  ]}
                  pointerEvents={isFlippedState ? "none" : "auto"}
                >
                  <View style={styles.toolsRow}>
                    <TactilePressable
                      style={styles.toolChip}
                      onPress={() => setShowHint(!showHint)}
                    >
                      <LightbulbIcon size={16} color="#D97706" />
                      <Text style={styles.toolChipText}>{showHint ? (t("study.hideHint") || "Hide Hint") : (t("study.showHint") || "Show Hint")}</Text>
                    </TactilePressable>

                    <TactilePressable
                      style={styles.toolChipAi}
                      onPress={handleAskBrancoForHint}
                    >
                      <SparkleIcon size={15} color="#6236FF" />
                      <Text style={styles.toolChipAiText}>{t("study.askBranco") || "Ask Branco"}</Text>
                    </TactilePressable>
                  </View>
                </Animated.View>

                {/* ── ANSWER RATING BAR (Hard, Good, Easy) ── */}
                <Animated.View
                  style={[
                    styles.calmRatingSectionContainer,
                    {
                      opacity: bottomRatingOpacity,
                      transform: [{ translateY: bottomRatingTranslateY }],
                      zIndex: isFlippedState ? 2 : 1,
                    },
                  ]}
                  pointerEvents={isFlippedState ? "auto" : "none"}
                >
                  <View style={styles.calmRatingSection}>
                    <Text style={styles.calmRatingPrompt}>{t("study.howWellDidYouKnow") || "How well did you know this?"}</Text>
                    <View style={styles.calmRatingButtonsRow}>
                      <TactilePressable
                        style={[styles.calmRatingBtn, { backgroundColor: "#FFF1F2", borderColor: "#FECDD3" }]}
                        onPress={() => handleSM2Rating("Hard", 10)}
                      >
                        <Text style={[styles.calmRatingBtnText, { color: "#E11D48" }]}>{t("study.hard") || "Hard"}</Text>
                      </TactilePressable>

                      <TactilePressable
                        style={[styles.calmRatingBtn, { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" }]}
                        onPress={() => handleSM2Rating("Good", 15)}
                      >
                        <Text style={[styles.calmRatingBtnText, { color: "#4338CA" }]}>{t("study.good") || "Good"}</Text>
                      </TactilePressable>

                      <TactilePressable
                        style={[styles.calmRatingBtn, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}
                        onPress={() => handleSM2Rating("Easy", 25)}
                      >
                        <Text style={[styles.calmRatingBtnText, { color: "#059669" }]}>{t("study.easy") || "Easy"}</Text>
                      </TactilePressable>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </View>
          ) : (
            /* SESSION COMPLETE REWARD & CONNECTED ENTRY POINTS VIEW */
            <View style={styles.rewardContainer}>
              <View style={styles.rewardBadgeCircle}>
                <SparkleIcon size={32} color="#6236FF" />
              </View>
              <Text style={styles.rewardTitle}>{t("study.reviewComplete") || "Review Complete 🎉"}</Text>
              <Text style={styles.rewardSubtitle}>
                {t("study.reviewedSummary", { count: cardsReviewed }) || `Great job! You reviewed ${cardsReviewed} cards using Spaced Repetition.`}
              </Text>

              <View style={styles.rewardStatsRow}>
                <View style={[styles.rewardStatCard, { backgroundColor: "#F4F0FF", borderColor: "#DDD6FE" }]}>
                  <Text style={[styles.rewardStatValue, { color: "#6236FF" }]}>+{xpEarned} XP</Text>
                  <Text style={styles.rewardStatLabel}>{t("study.xpEarned") || "XP Earned"}</Text>
                </View>
                <View style={[styles.rewardStatCard, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
                  <Text style={[styles.rewardStatValue, { color: "#059669" }]}>
                    {Math.round((easyCount / (cards.length || 1)) * 100)}%
                  </Text>
                  <Text style={styles.rewardStatLabel}>{t("study.masteryRate") || "Mastery Rate"}</Text>
                </View>
                <View style={[styles.rewardStatCard, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
                  <Text style={[styles.rewardStatValue, { color: "#2563EB" }]}>78%</Text>
                  <Text style={styles.rewardStatLabel}>{t("study.goalRate") || "Goal Rate"}</Text>
                </View>
              </View>

              {/* Knowledge Sync Notice */}
              <View style={styles.syncCompleteNotice}>
                <SparkleIcon size={14} color="#6236FF" />
                <Text style={styles.syncCompleteNoticeText}>
                  {t("study.sessionSyncedNotice") || "Knowledge Synced: Your card responses have calibrated your next Practice Quiz."}
                </Text>
              </View>

              {/* 3 CONNECTED ACTION BUTTONS */}
              <View style={styles.connectedActionsContainer}>
                <TooltipTouchable
                  tooltip={t("study.continueReviewing") || "Continue Reviewing"}
                  style={styles.primaryActionBtn}
                  onPress={() => handleStartReviewSession(selectedSubjectId, selectedTopicId)}
                  activeOpacity={0.88}
                >
                  <RotateCcwIcon size={18} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>{t("study.continueReviewing") || "Continue Reviewing"}</Text>
                </TooltipTouchable>

                <TooltipTouchable
                  tooltip={t("study.takeQuizTopic") || "Take a Quiz on this Topic"}
                  style={[styles.secondaryActionBtn, { borderColor: "#10B981", backgroundColor: "#ECFDF5" }]}
                  onPress={() => handleStartQuiz(selectedSubjectId, selectedTopicId)}
                  activeOpacity={0.88}
                >
                  <TargetIcon size={18} color="#059669" />
                  <Text style={[styles.secondaryActionBtnText, { color: "#059669" }]}>
                    {t("study.takeAdaptiveQuizTopic") || "Test What You Reviewed in a Quiz"}
                  </Text>
                </TooltipTouchable>

                <TooltipTouchable
                  tooltip={t("study.reviewTopicNotes") || "Review Topic Notes"}
                  style={[styles.secondaryActionBtn, { borderColor: "#F97316", backgroundColor: "#FFF7ED" }]}
                  onPress={() => handleOpenNotes(selectedSubjectId, selectedTopicId)}
                  activeOpacity={0.88}
                >
                  <NotebookIcon size={18} color="#EA580C" />
                  <Text style={[styles.secondaryActionBtnText, { color: "#EA580C" }]}>
                    {t("study.reviewTopicNotes") || "Review Topic Notes"}
                  </Text>
                </TooltipTouchable>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── VIEW 3: QUIZ SYSTEM ────────────────────────────────────────── */}
      {viewState === "quiz" && (
        quizSubState === "results" && quizScoreResult ? (
          <QuizPerformanceScreen
            quizResult={quizScoreResult}
            activeQuiz={activeQuiz}
            user={user}
            isDark={isDark}
            accentColor={accentColor}
            t={t}
            onStartReviewSession={handleStartReviewSession}
            onOpenNotes={handleOpenNotes}
            onRetakeQuiz={handleLaunchQuizEngine}
            onBackToHub={() => setViewState("overview")}
            onBackToQuizSelect={() => setQuizSubState("select")}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 140 }]}
          >
            {quizSubState === "select" && (
              <View style={styles.quizSetupContainer}>
                <View style={[styles.quizHeroBanner, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                  <View style={styles.quizHeroHeaderRow}>
                    <View style={[styles.quizHeroIconCircle, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.15)" : "rgba(45, 98, 255, 0.08)", borderColor: isDark ? "rgba(45, 98, 255, 0.3)" : "rgba(45, 98, 255, 0.2)" }]}>
                      <TargetIcon size={24} color={accentColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.quizSetupTitle, isDark && { color: '#F8FAFC' }]}>{t("study.chooseQuizTopic") || "Choose a Quiz Topic"}</Text>
                      <Text style={[styles.quizSetupSubtitle, isDark && { color: '#CBD5E1' }]}>
                        {t("study.chooseQuizSubtitle") || "Select a subject to test your recall. Quizzes directly inform your SRS review priorities."}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.quizHeroStatsRow, isDark && { borderTopWidth: 0, borderTopColor: 'transparent' }]}>
                    <View style={[styles.quizHeroStatChip, isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' }]}>
                      <Text style={[styles.quizHeroStatChipText, isDark && { color: '#CBD5E1' }]} numberOfLines={1} ellipsizeMode="tail">
                        {t("study.quizzesAvailable", { count: availableQuizzes.length }) || `${availableQuizzes.length} Quizzes Available`}
                      </Text>
                    </View>
                    <View style={[styles.quizHeroStatChip, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.15)" : "rgba(45, 98, 255, 0.08)", borderColor: isDark ? "rgba(45, 98, 255, 0.3)" : "rgba(45, 98, 255, 0.2)" }]}>
                      <SparkleIcon size={12} color={accentColor} />
                      <Text style={[styles.quizHeroStatChipText, { color: accentColor }]} numberOfLines={1} ellipsizeMode="tail">
                        {t("study.srsAdaptiveSync") || "SRS Adaptive Sync"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Available Quizzes List */}
                <View style={styles.quizList}>
                  {availableQuizzes.map((quiz) => (
                    <TouchableOpacity
                      key={quiz.id}
                      style={[styles.quizCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                      onPress={() => handleLaunchQuizEngine(quiz)}
                      activeOpacity={0.88}
                    >
                      <View style={styles.quizCardTopRow}>
                        <View style={[styles.quizTopicBadge, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.15)" : "rgba(45, 98, 255, 0.08)", borderColor: isDark ? "rgba(45, 98, 255, 0.3)" : "rgba(45, 98, 255, 0.2)" }]}>
                          <SparkleIcon size={11} color={accentColor} />
                          <Text style={[styles.quizTopicBadgeText, { color: accentColor }]} numberOfLines={1} ellipsizeMode="tail">{quiz.topicName}</Text>
                        </View>
                        {quiz.flashcardBridgeCount > 0 && (
                          <View
                            style={[
                              styles.quizCardBridgeBadge,
                              isDark && {
                                backgroundColor: "rgba(98, 54, 255, 0.16)",
                                borderColor: "rgba(139, 92, 246, 0.35)",
                              },
                            ]}
                          >
                            <BrainIcon size={11} color={isDark ? "#A78BFA" : "#6236FF"} />
                            <Text
                              style={[styles.quizCardBridgeBadgeText, isDark && { color: "#C4B5FD" }]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {quiz.flashcardBridgeCount === 1
                                ? (t("study.flashcardStruggleTargeted", { count: 1 }) || "Targets 1 Card Struggle")
                                : (t("study.flashcardStrugglesTargeted", { count: quiz.flashcardBridgeCount }) ||
                                    `Targets ${quiz.flashcardBridgeCount} Card Struggles`)}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={[styles.quizCardTitle, isDark && { color: '#F8FAFC' }]}>{quiz.title}</Text>

                      <View style={styles.quizCardMetaRow}>
                        <TargetIcon size={13} color={isDark ? "#94A3B8" : "#64748B"} />
                        <Text style={[styles.quizCardMeta, isDark && { color: '#94A3B8' }]} numberOfLines={1}>
                          {t("study.questionsCount", { count: quiz.questionCount }) || `${quiz.questionCount} Questions • Multiple Choice`}
                        </Text>
                      </View>

                      <View style={[styles.startQuizBtn, { backgroundColor: accentColor, shadowColor: accentColor }]}>
                        <Text style={styles.startQuizBtnText}>{t("study.startQuiz") || "Start Quiz"}</Text>
                        <ChevronRightIcon size={15} color="#FFFFFF" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {quizSubState === "active" && activeQuiz && (() => {
              const currentQ = activeQuiz.questions[quizQuestionIndex];
              const isUserCorrect = quizSelectedOption === currentQ.correctIndex;

              return (
                <View style={styles.quizActiveContainer}>
                  {/* Question Progress */}
                  <View style={styles.quizProgressHeader}>
                    <Text style={[styles.quizQuestionCounter, isDark && { color: '#CBD5E1' }]}>
                      {t("study.questionOf", { current: quizQuestionIndex + 1, total: activeQuiz.questions.length }) || `Question ${quizQuestionIndex + 1} of ${activeQuiz.questions.length}`}
                    </Text>
                    <View style={[styles.quizTagPill, { backgroundColor: isDark ? "rgba(45, 98, 255, 0.15)" : "rgba(45, 98, 255, 0.08)" }]}>
                      <Text style={[styles.quizTagPillText, { color: accentColor }]}>{activeQuiz.topicName}</Text>
                    </View>
                  </View>

                  {/* Connected to Flashcard Struggle Pill */}
                  {currentQ.flashcardBridge && (
                    <View
                      style={[
                        styles.quizActiveBridgePill,
                        isDark && {
                          backgroundColor: "rgba(98, 54, 255, 0.16)",
                          borderColor: "rgba(139, 92, 246, 0.35)",
                        },
                      ]}
                    >
                      <BrainIcon size={12} color={isDark ? "#A78BFA" : "#6236FF"} />
                      <Text
                        style={[styles.quizActiveBridgePillText, isDark && { color: "#C4B5FD" }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {t("study.reinforcingCard", { topic: currentQ.flashcardBridge.cardCategory || "Flashcard" }) ||
                          `Reinforcing Card Recall: ${currentQ.flashcardBridge.cardCategory || "Flashcard"}`}
                      </Text>
                    </View>
                  )}

                  {/* Question Box */}
                  <View style={[styles.quizQuestionCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                    <Text style={[styles.quizQuestionPrompt, isDark && { color: '#F8FAFC' }]}>
                      {currentQ.question}
                    </Text>
                  </View>

                  {/* Options */}
                  <View style={styles.quizOptionsList}>
                    {currentQ.options.map((optText, optIdx) => {
                      const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D, E...
                      const isSelected = quizSelectedOption === optIdx;
                      const isCorrectOpt = optIdx === currentQ.correctIndex;

                      let cardStyle = [styles.quizOptionCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }];
                      let badgeStyle = [styles.quizOptionLetterBadge, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }];
                      let letterStyle = [styles.quizOptionLetterText, isDark && { color: '#CBD5E1' }];
                      let textStyle = [styles.quizOptionText, isDark && { color: '#F8FAFC' }];

                      if (!isQuizAnswerChecked) {
                        // Before answer checked: show neutral primary selection
                        if (isSelected) {
                          cardStyle.push({ borderColor: accentColor, backgroundColor: isDark ? "rgba(45, 98, 255, 0.18)" : "rgba(45, 98, 255, 0.08)" });
                          badgeStyle.push({ backgroundColor: accentColor, borderColor: accentColor });
                          letterStyle.push(styles.quizOptionLetterTextSelected);
                          textStyle.push({ color: accentColor, fontWeight: "800" });
                        }
                      } else {
                        // After answer checked: differentiate Correct (Green) vs Wrong (Red)
                        if (isSelected && isCorrectOpt) {
                          // User chose correct answer
                          cardStyle.push(styles.quizOptionCardCorrect);
                          badgeStyle.push(styles.quizOptionLetterBadgeCorrect);
                          letterStyle.push(styles.quizOptionLetterTextSelected);
                          textStyle.push(styles.quizOptionTextCorrect);
                        } else if (isSelected && !isCorrectOpt) {
                          // User chose wrong answer
                          cardStyle.push(styles.quizOptionCardWrong);
                          badgeStyle.push(styles.quizOptionLetterBadgeWrong);
                          letterStyle.push(styles.quizOptionLetterTextSelected);
                          textStyle.push(styles.quizOptionTextWrong);
                        } else if (!isSelected && isCorrectOpt) {
                          // Highlight actual correct answer when user guessed wrong
                          cardStyle.push(styles.quizOptionCardCorrectRevealed);
                          badgeStyle.push(styles.quizOptionLetterBadgeCorrect);
                          letterStyle.push(styles.quizOptionLetterTextSelected);
                          textStyle.push(styles.quizOptionTextCorrect);
                        } else {
                          // Other unselected options
                          cardStyle.push({ opacity: 0.45 });
                        }
                      }

                      return (
                        <TouchableOpacity
                          key={optIdx}
                          style={cardStyle}
                          onPress={() => handleOptionSelect(optIdx)}
                          activeOpacity={isQuizAnswerChecked ? 1 : 0.8}
                          disabled={isQuizAnswerChecked}
                        >
                          <View style={badgeStyle}>
                            <Text style={letterStyle}>{optionLetter}</Text>
                          </View>
                          <Text style={textStyle}>
                            {optText}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Feedback / Explanation Box after checking answer */}
                  {isQuizAnswerChecked && (
                    <View style={isUserCorrect ? styles.quizFeedbackCardCorrect : styles.quizFeedbackCardWrong}>
                      <View style={styles.quizFeedbackHeaderRow}>
                        {isUserCorrect ? (
                          <CheckCircleIcon size={22} color="#10B981" />
                        ) : (
                          <AlertTriangleIcon size={22} color="#EF4444" />
                        )}
                        <Text style={isUserCorrect ? styles.quizFeedbackTitleCorrect : styles.quizFeedbackTitleWrong}>
                          {isUserCorrect ? (t("study.correctAnswerBanner") || "Correct Answer! 🎉") : (t("study.incorrectAnswerBanner") || "Incorrect Answer")}
                        </Text>
                      </View>
                      {!isUserCorrect && (
                        <Text style={styles.quizFeedbackCorrectAnswerText}>
                          {t("study.correctAnswerLabel") || "Correct Answer:"} <Text style={{ fontWeight: "800" }}>{String.fromCharCode(65 + currentQ.correctIndex)}. {currentQ.options[currentQ.correctIndex]}</Text>
                        </Text>
                      )}
                      {currentQ.explanation ? (
                        <Text style={[styles.quizFeedbackText, isDark && { color: '#E2E8F0' }]}>{currentQ.explanation}</Text>
                      ) : null}
                      {isUserCorrect && currentQ.flashcardBridge && (
                        <View style={styles.quizBridgeResolvedBanner}>
                          <SparkleIcon size={14} color="#10B981" />
                          <Text style={styles.quizBridgeResolvedText}>
                            {t("study.struggleOvercome") || "Concept mastered! You successfully applied the rule you struggled with on flashcards."}
                          </Text>
                        </View>
                      )}
                      {!isUserCorrect && (
                        <View style={styles.quizBridgeWrongNotice}>
                          <BrainIcon size={14} color="#EF4444" />
                          <Text style={styles.quizBridgeWrongNoticeText}>
                            {t("study.quizMistakeQueuedNotice") || "StudPal Spaced Repetition has queued a prioritized flashcard to reinforce this rule."}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Check Answer / Next Question CTA Button */}
                  <TouchableOpacity
                    style={[
                      styles.primaryActionBtn,
                      { backgroundColor: isQuizAnswerChecked && isUserCorrect ? "#10B981" : accentColor, shadowColor: isQuizAnswerChecked && isUserCorrect ? "#10B981" : accentColor },
                      quizSelectedOption === null && { opacity: 0.5 },
                    ]}
                    disabled={quizSelectedOption === null}
                    onPress={handleCheckOrNextQuizQuestion}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.primaryActionBtnText}>
                      {!isQuizAnswerChecked
                        ? (t("study.checkAnswer") || "Check Answer")
                        : quizQuestionIndex < activeQuiz.questions.length - 1
                        ? (t("study.nextQuestion") || "Next Question →")
                        : (t("study.viewQuizResults") || "View Quiz Results 🎉")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
          </ScrollView>
        )
      )}

      {/* ── VIEW 4: NOTES SYSTEM ───────────────────────────────────────── */}
      {viewState === "notes" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 140 }]}
        >
          {/* Header Action Bar */}
          <View style={styles.notesHeaderBar}>
            <View style={[styles.searchBarContainer, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
              <SearchIcon size={18} color="#94A3B8" />
              <TextInput
                style={[styles.searchInput, isDark && { color: '#F8FAFC' }]}
                placeholder={t("common.search") || "Search notes or topics..."}
                placeholderTextColor="#94A3B8"
                value={notesSearch}
                onChangeText={setNotesSearch}
              />
            </View>

            <TouchableOpacity
              style={[styles.createNoteBtn, { backgroundColor: accentColor }]}
              onPress={() => handleCreateNoteModal(selectedSubjectId, selectedTopicId)}
              activeOpacity={0.85}
            >
              <PlusIcon size={18} color="#FFFFFF" />
              <Text style={styles.createNoteBtnText}>{t("study.newNote") || "New Note"}</Text>
            </TouchableOpacity>
          </View>

          {/* Notes List */}
          <View style={styles.notesList}>
            {notesList.length === 0 ? (
              <View style={[styles.emptyNotesContainer, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                <View style={[styles.emptyIconCircle, { backgroundColor: 'rgba(45, 98, 255, 0.10)' }]}>
                  <NotebookIcon size={32} color={accentColor} />
                </View>
                <Text style={[styles.emptyNotesTitle, isDark && { color: '#F8FAFC' }]}>No Notes Found</Text>
                <Text style={[styles.emptyNotesSubtitle, isDark && { color: '#94A3B8' }]}>
                  Create your first note for this subject to keep your key formulas, summaries, and study takeaways organized.
                </Text>
                <TouchableOpacity
                  style={[styles.primaryActionBtn, { marginTop: 16, backgroundColor: accentColor }]}
                  onPress={() => handleCreateNoteModal(selectedSubjectId, selectedTopicId)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryActionBtnText}>+ Create Note</Text>
                </TouchableOpacity>
              </View>
            ) : (
              notesList.map((note) => {
                const words = (note.content || "").trim().split(/\s+/).filter(Boolean).length;
                const cleanSnippet = (note.content || "")
                  .replace(/#+\s*/g, "")
                  .replace(/[\*\_\~]+/g, "")
                  .replace(/`{1,3}.*?`{1,3}/g, "")
                  .replace(/^[\-\*\+]\s+/gm, "")
                  .replace(/\s+/g, " ")
                  .trim();

                const isMenuOpen = activeMenuNoteId === note.id;

                return (
                  <TouchableOpacity
                    key={note.id}
                    style={[
                      styles.noteCard,
                      isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                      note.isPinned && { borderColor: (accentColor || '#2D62FF') + '40' },
                      isMenuOpen && { borderColor: accentColor }
                    ]}
                    onPress={() => {
                      if (activeMenuNoteId) {
                        setActiveMenuNoteId(null);
                      } else {
                        handleEditNoteModal(note);
                      }
                    }}
                    onLongPress={() => {
                      setActiveMenuNoteId(isMenuOpen ? null : note.id);
                    }}
                    delayLongPress={280}
                    activeOpacity={0.88}
                  >
                    <View style={styles.noteCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[styles.noteTopicBadge, { backgroundColor: (accentColor || '#2D62FF') + '15' }]}>
                          <Text style={styles.noteTopicBadgeEmoji}>📝</Text>
                          <Text style={[styles.noteTopicBadgeText, { color: accentColor }]}>{note.topicName}</Text>
                        </View>

                        {note.isPinned && (
                          <View style={[styles.pinnedBadge, { backgroundColor: (accentColor || '#2D62FF') + '15' }]}>
                            <Text style={[styles.pinnedBadgeText, { color: accentColor }]}>📌 Pinned</Text>
                          </View>
                        )}
                      </View>

                      <ChevronRightIcon size={16} color={isDark ? '#64748B' : '#94A3B8'} />
                    </View>

                    <Text style={[styles.noteCardTitle, isDark && { color: '#F8FAFC' }]}>
                      {note.title}
                    </Text>

                    {cleanSnippet ? (
                      <Text style={[styles.noteCardSnippet, isDark && { color: '#94A3B8' }]} numberOfLines={2}>
                        {cleanSnippet}
                      </Text>
                    ) : null}

                    <View style={styles.noteCardFooterMinimal}>
                      <Text style={[styles.noteMetaText, isDark && { color: '#64748B' }]}>
                        {words} words {note.isPinned ? "• Pinned to top" : ""}
                      </Text>
                    </View>

                    {/* Long-Press Contextual Action Menu */}
                    {isMenuOpen && (
                      <View style={[styles.noteCardContextMenu, isDark && { borderTopWidth: 0, borderTopColor: 'transparent' }]}>
                        <TactilePressable
                          style={[
                            styles.contextMenuOption,
                            styles.contextMenuPinBtn,
                            isDark && { backgroundColor: '#1E1B4B', borderColor: '#312E81' },
                          ]}
                          onPress={() => handleTogglePin(note.id)}
                        >
                          <PinIcon size={14} color={isDark ? '#A5B4FC' : '#6236FF'} filled={note.isPinned} />
                          <Text style={[styles.contextMenuOptionText, { color: isDark ? '#A5B4FC' : '#4338CA' }]}>
                            {note.isPinned ? "Unpin" : "Pin"}
                          </Text>
                        </TactilePressable>

                        <TactilePressable
                          style={[
                            styles.contextMenuOption,
                            styles.contextMenuInfoBtn,
                            isDark && { backgroundColor: '#0C4A6E', borderColor: '#0369A1' },
                          ]}
                          onPress={() => {
                            setActiveMenuNoteId(null);
                            setNoteForDetailModal(note);
                          }}
                        >
                          <InfoIcon size={14} color={isDark ? '#38BDF8' : '#0284C7'} />
                          <Text style={[styles.contextMenuOptionText, { color: isDark ? '#38BDF8' : '#0369A1' }]}>
                            Details
                          </Text>
                        </TactilePressable>

                        <TactilePressable
                          style={[
                            styles.contextMenuOption,
                            styles.contextMenuDeleteBtn,
                            isDark && { backgroundColor: '#451A03', borderColor: '#7F1D1D' },
                          ]}
                          onPress={() => {
                            setActiveMenuNoteId(null);
                            handleDeleteNote(note);
                          }}
                        >
                          <TrashIcon size={14} color={isDark ? '#FCA5A5' : '#E11D48'} />
                          <Text style={[styles.contextMenuOptionText, { color: isDark ? '#FCA5A5' : '#E11D48' }]}>
                            Delete
                          </Text>
                        </TactilePressable>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* ── VIEW 5: DEDICATED FULL-SCREEN NOTE EDITOR (Native Apple/Samsung Notes Inspired) ── */}
      {viewState === "note-editor" && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.nativeEditorScrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 120 }]}
          >
            <View style={styles.nativeEditorContainer}>
              <View style={[styles.nativeEditorPaper, isDark && styles.nativeEditorPaperDark]}>
                {/* 1. Date/Time Stamp */}
                <Text style={[styles.nativeEditorTimestamp, isDark && { color: '#64748B' }]}>
                  {currentFormattedDate}
                </Text>

                {/* 2. Clean Large Title Input */}
                <TextInput
                  style={[styles.nativeEditorTitleInput, isDark && { color: '#F8FAFC' }]}
                  placeholder="Title"
                  placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                  underlineColorAndroid="transparent"
                  value={noteFormTitle}
                  onChangeText={setNoteFormTitle}
                  returnKeyType="next"
                  onSubmitEditing={() => contentInputRef.current?.focus()}
                />

                {/* 3. Word Stats */}
                <Text style={[styles.nativeEditorWordStats, isDark && { color: '#64748B' }]}>
                  {wordCount} words • {charCount} characters
                </Text>

                {/* 4. Directly Editable Formatted Preview (One Full Chunk) */}
                {Platform.OS === 'web' ? (
                  <View style={{ flex: 1, minHeight: Math.max(340, SCREEN_HEIGHT - 320) }}>
                    <style>{`
                      .studpal-editable-preview {
                        outline: none;
                        border: none;
                        cursor: text;
                        width: 100%;
                      }
                      .studpal-editable-preview:empty::before {
                        content: attr(data-placeholder);
                        color: ${isDark ? '#475569' : '#94A3B8'};
                        font-style: normal;
                        pointer-events: none;
                      }
                      .studpal-editable-preview h1 {
                        font-size: 24px;
                        font-weight: 800;
                        margin-top: 14px;
                        margin-bottom: 6px;
                        color: ${isDark ? '#F8FAFC' : '#0F172A'};
                        letter-spacing: -0.4px;
                        line-height: 1.3;
                      }
                      .studpal-editable-preview h2 {
                        font-size: 19px;
                        font-weight: 800;
                        margin-top: 12px;
                        margin-bottom: 6px;
                        color: ${isDark ? '#F8FAFC' : '#0F172A'};
                        letter-spacing: -0.3px;
                        line-height: 1.35;
                      }
                      .studpal-editable-preview h3 {
                        font-size: 16px;
                        font-weight: 700;
                        margin-top: 10px;
                        margin-bottom: 4px;
                        color: ${isDark ? '#E2E8F0' : '#1E293B'};
                        line-height: 1.4;
                      }
                      .studpal-editable-preview p, .studpal-editable-preview div {
                        margin-top: 2px;
                        margin-bottom: 6px;
                        font-size: 15.5px;
                        line-height: 25px;
                        color: ${isDark ? '#E2E8F0' : '#334155'};
                      }
                      .studpal-editable-preview ol, .studpal-editable-preview ul {
                        margin-left: 24px;
                        margin-top: 4px;
                        margin-bottom: 8px;
                        padding-left: 0;
                      }
                      .studpal-editable-preview li {
                        margin-bottom: 4px;
                        font-size: 15.5px;
                        line-height: 25px;
                        color: ${isDark ? '#E2E8F0' : '#334155'};
                      }
                      .studpal-editable-preview blockquote {
                        border-left: 3px solid ${accentColor || '#2D62FF'};
                        background: ${(accentColor || '#2D62FF') + (isDark ? '18' : '0F')};
                        padding: 8px 12px;
                        border-radius: 6px;
                        margin: 8px 0;
                        font-style: italic;
                        color: ${isDark ? '#E2E8F0' : '#334155'};
                      }
                      .studpal-editable-preview code {
                        font-family: monospace;
                        font-size: 13.5px;
                        background: ${isDark ? '#1E293B' : '#F1F5F9'};
                        padding: 2px 6px;
                        border-radius: 4px;
                        color: ${isDark ? '#38BDF8' : '#0284C7'};
                      }
                      .studpal-editable-preview mark {
                        background: ${isDark ? '#78350F' : '#FEF08A'};
                        color: ${isDark ? '#FEF08A' : '#854D0E'};
                        padding: 1px 4px;
                        border-radius: 3px;
                      }
                      .studpal-editable-preview .studpal-formula {
                        font-family: monospace;
                        background: ${(accentColor || '#2D62FF') + '15'};
                        color: ${accentColor || '#2D62FF'};
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-weight: 600;
                      }
                      .studpal-editable-preview .studpal-task-item {
                        display: flex !important;
                        flex-direction: row !important;
                        align-items: flex-start !important;
                        gap: 10px !important;
                        margin-top: 2px !important;
                        margin-bottom: 6px !important;
                        line-height: 25px !important;
                        width: 100% !important;
                        box-sizing: border-box !important;
                      }
                      .studpal-editable-preview .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item input[type="checkbox"] {
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        width: 18px !important;
                        height: 18px !important;
                        min-width: 18px !important;
                        max-width: 18px !important;
                        min-height: 18px !important;
                        max-height: 18px !important;
                        flex: 0 0 18px !important;
                        flex-shrink: 0 !important;
                        flex-grow: 0 !important;
                        aspect-ratio: 1 / 1 !important;
                        border-radius: 50% !important;
                        border: 1.8px solid ${isDark ? '#64748B' : '#94A3B8'} !important;
                        background-color: transparent !important;
                        cursor: pointer !important;
                        outline: none !important;
                        margin: 3px 0 0 0 !important;
                        padding: 0 !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease !important;
                        position: relative !important;
                        user-select: none !important;
                        -webkit-user-select: none !important;
                        box-sizing: border-box !important;
                      }
                      .studpal-editable-preview .studpal-task-checkbox:hover,
                      .studpal-editable-preview .studpal-task-item input[type="checkbox"]:hover {
                        border-color: ${accentColor || '#F59E0B'} !important;
                        transform: scale(1.08);
                      }
                      .studpal-editable-preview .studpal-task-item.is-checked .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item[data-checked="true"] .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item input[type="checkbox"]:checked {
                        background-color: ${accentColor || '#F59E0B'} !important;
                        border-color: ${accentColor || '#F59E0B'} !important;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") !important;
                        background-size: 11px 11px !important;
                        background-position: center center !important;
                        background-repeat: no-repeat !important;
                      }
                      .studpal-editable-preview .studpal-task-item.is-checked .studpal-task-checkbox::after,
                      .studpal-editable-preview .studpal-task-item[data-checked="true"] .studpal-task-checkbox::after,
                      .studpal-editable-preview .studpal-task-item input[type="checkbox"]:checked::after {
                        display: none !important;
                      }
                      .studpal-editable-preview .studpal-task-item > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item > span:not(.studpal-task-checkbox) {
                        flex: 1 1 auto !important;
                        min-width: 0 !important;
                        outline: none !important;
                        font-size: 15.5px !important;
                        line-height: 25px !important;
                        color: ${isDark ? '#E2E8F0' : '#334155'};
                        word-break: break-word !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        transition: opacity 0.15s ease, text-decoration 0.15s ease, color 0.15s ease !important;
                      }

                      /* Headings inside task items */
                      .studpal-editable-preview .studpal-task-item.studpal-task-h1 {
                        margin-top: 14px !important;
                        margin-bottom: 6px !important;
                      }
                      .studpal-editable-preview .studpal-task-item.studpal-task-h1 > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item[data-heading="1"] > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item > h1.studpal-task-text {
                        font-size: 24px !important;
                        font-weight: 800 !important;
                        line-height: 32px !important;
                        color: ${isDark ? '#FFFFFF' : '#0F172A'} !important;
                        letter-spacing: -0.5px !important;
                        margin: 0 !important;
                      }
                      .studpal-editable-preview .studpal-task-item.studpal-task-h1 .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item[data-heading="1"] .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item:has(> h1) .studpal-task-checkbox {
                        margin-top: 6px !important;
                      }

                      .studpal-editable-preview .studpal-task-item.studpal-task-h2 {
                        margin-top: 12px !important;
                        margin-bottom: 6px !important;
                      }
                      .studpal-editable-preview .studpal-task-item.studpal-task-h2 > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item[data-heading="2"] > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item > h2.studpal-task-text {
                        font-size: 20px !important;
                        font-weight: 700 !important;
                        line-height: 28px !important;
                        color: ${isDark ? '#F1F5F9' : '#1E293B'} !important;
                        letter-spacing: -0.3px !important;
                        margin: 0 !important;
                      }
                      .studpal-editable-preview .studpal-task-item.studpal-task-h2 .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item[data-heading="2"] .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item:has(> h2) .studpal-task-checkbox {
                        margin-top: 5px !important;
                      }

                      .studpal-editable-preview .studpal-task-item.studpal-task-h3 {
                        margin-top: 10px !important;
                        margin-bottom: 4px !important;
                      }
                      .studpal-editable-preview .studpal-task-item.studpal-task-h3 > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item[data-heading="3"] > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item > h3.studpal-task-text {
                        font-size: 17px !important;
                        font-weight: 700 !important;
                        line-height: 24px !important;
                        color: ${isDark ? '#E2E8F0' : '#334155'} !important;
                        margin: 0 !important;
                      }
                      .studpal-editable-preview .studpal-task-item.studpal-task-h3 .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item[data-heading="3"] .studpal-task-checkbox,
                      .studpal-editable-preview .studpal-task-item:has(> h3) .studpal-task-checkbox {
                        margin-top: 3px !important;
                      }

                      .studpal-editable-preview .studpal-task-item.is-checked > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item[data-checked="true"] > .studpal-task-text,
                      .studpal-editable-preview .studpal-task-item.is-checked > span:not(.studpal-task-checkbox),
                      .studpal-editable-preview .studpal-task-item[data-checked="true"] > span:not(.studpal-task-checkbox),
                      .studpal-editable-preview .studpal-task-item input[type="checkbox"]:checked ~ span,
                      .studpal-editable-preview .studpal-task-item input[type="checkbox"]:checked + span,
                      .studpal-editable-preview .studpal-task-item:has(input[type="checkbox"]:checked) > span:not(.studpal-task-checkbox) {
                        text-decoration: line-through !important;
                        opacity: 0.55 !important;
                        color: ${isDark ? '#64748B' : '#94A3B8'} !important;
                      }
                      /* Explicitly protect and preserve all other formatting effects inside checklist items */
                      .studpal-editable-preview .studpal-task-item strong,
                      .studpal-editable-preview .studpal-task-item b,
                      .studpal-editable-preview .studpal-task-item [style*="font-weight: bold"],
                      .studpal-editable-preview .studpal-task-item [style*="font-weight: 700"],
                      .studpal-editable-preview .studpal-task-item [style*="font-weight: 800"] {
                        font-weight: 800 !important;
                      }
                      .studpal-editable-preview .studpal-task-item em,
                      .studpal-editable-preview .studpal-task-item i,
                      .studpal-editable-preview .studpal-task-item [style*="font-style: italic"] {
                        font-style: italic !important;
                      }
                      .studpal-editable-preview .studpal-task-item u,
                      .studpal-editable-preview .studpal-task-item [style*="text-decoration: underline"] {
                        text-decoration: underline !important;
                      }
                      .studpal-editable-preview .studpal-task-item del,
                      .studpal-editable-preview .studpal-task-item s,
                      .studpal-editable-preview .studpal-task-item strike,
                      .studpal-editable-preview .studpal-task-item [style*="text-decoration: line-through"] {
                        text-decoration: line-through !important;
                      }
                      .studpal-editable-preview .studpal-task-item .studpal-formula {
                        font-family: monospace !important;
                        background: ${(accentColor || '#2D62FF') + '18'} !important;
                        color: ${accentColor || '#2D62FF'} !important;
                        padding: 2px 6px !important;
                        border-radius: 4px !important;
                        font-weight: 600 !important;
                        display: inline-block !important;
                        flex: none !important;
                        font-size: 14.5px !important;
                        line-height: normal !important;
                        text-decoration: none !important;
                        opacity: 1 !important;
                      }
                      .studpal-editable-preview .studpal-task-item code {
                        font-family: monospace !important;
                        background: ${isDark ? '#1E293B' : '#F1F5F9'} !important;
                        color: ${isDark ? '#38BDF8' : '#0284C7'} !important;
                        padding: 2px 6px !important;
                        border-radius: 4px !important;
                        font-size: 13.5px !important;
                      }
                      .studpal-editable-preview .studpal-task-item mark {
                        background: ${isDark ? '#78350F' : '#FEF08A'} !important;
                        color: ${isDark ? '#FEF08A' : '#854D0E'} !important;
                        padding: 1px 4px !important;
                        border-radius: 3px !important;
                      }
                    `}</style>
                    <div
                      ref={setEditorRef}
                      className="studpal-editable-preview"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleContentInput}
                      onClick={handleEditorClick}
                      onPointerDown={handleEditorPointerDown}
                      onKeyDown={handleEditorKeyDown}
                      onBeforeInput={handleBeforeInput}
                      onMouseUp={handleSelectChange}
                      onKeyUp={handleSelectChange}
                      onSelect={handleSelectChange}
                      data-placeholder="Start typing your study notes..."
                      style={{
                        outline: 'none',
                        border: 'none',
                        minHeight: Math.max(340, SCREEN_HEIGHT - 320),
                        fontSize: '15.5px',
                        lineHeight: '1.65',
                        color: isDark ? '#E2E8F0' : '#1E293B',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif',
                        wordBreak: 'break-word',
                        paddingBottom: 80,
                      }}
                    />
                  </View>
                ) : (
                  <TextInput
                    ref={contentInputRef}
                    style={[
                      styles.nativeEditorBodyInput,
                      isDark && { color: '#F1F5F9' },
                    ]}
                    placeholder="Start typing your study notes..."
                    placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                    multiline
                    scrollEnabled={false}
                    textAlignVertical="top"
                    underlineColorAndroid="transparent"
                    value={noteFormContent}
                    onChangeText={(val) => {
                      const prev = noteFormContent || '';
                      if (val.length === prev.length + 1 && val.endsWith('\n')) {
                        const lines = prev.split('\n');
                        const lastLine = lines[lines.length - 1];
                        if (lastLine.trim() === '- [ ]' || lastLine.trim() === '- [x]') {
                          // Exit task item on empty enter
                          lines[lines.length - 1] = '';
                          const updated = lines.join('\n') + '\n';
                          setNoteFormContent(updated);
                          pushHistory(updated);
                          return;
                        } else if (lastLine.startsWith('- [ ] ') || lastLine.startsWith('- [x] ')) {
                          // Auto-continue checklist on native!
                          const updated = val + '- [ ] ';
                          setNoteFormContent(updated);
                          pushHistory(updated);
                          return;
                        }
                      }
                      setNoteFormContent(val);
                      pushHistory(val);
                    }}
                    onSelectionChange={(e) => {
                      setContentSelection(e.nativeEvent.selection);
                      contentSelectionRef.current = e.nativeEvent.selection;
                    }}
                  />
                )}
              </View>
            </View>
          </ScrollView>

          {/* ── NATIVE BOTTOM FORMATTING & VOICE DOCK ── */}
          <View
            style={[
              styles.nativeBottomDockContainer,
              isDark && { backgroundColor: '#0B0F19', borderTopColor: '#1E293B' },
              { paddingBottom: Math.max(insets.bottom, 10) + 4 }
            ]}
          >
            {/* Format Tray (when Aa is toggled open) */}
            {isFormatTrayOpen && (
              <Animated.View style={[styles.nativeFormatTray, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                {/* Row 1: Headings / Body */}
                <View style={styles.nativeFormatTrayRow}>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('h1')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatOptionH1Text, isDark && { color: '#F1F5F9' }]}>H1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('h2')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatOptionH2Text, isDark && { color: '#F1F5F9' }]}>H2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('h3')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatOptionH3Text, isDark && { color: '#F1F5F9' }]}>H3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('body')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatOptionBodyText, isDark && { color: '#94A3B8' }]}>Body</Text>
                  </TouchableOpacity>
                </View>

                {/* Row 2: Inline Styles */}
                <View style={styles.nativeFormatTrayRow}>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('bold')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatInlineText, { fontWeight: '800' }, isDark && { color: '#F1F5F9' }]}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('italic')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatInlineText, { fontStyle: 'italic', fontFamily: 'serif' }, isDark && { color: '#F1F5F9' }]}>I</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('underline')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatInlineText, { textDecorationLine: 'underline' }, isDark && { color: '#F1F5F9' }]}>U</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nativeFormatOptionBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                    onPress={() => executeFormatCommand('strikethrough')}
                    onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.nativeFormatInlineText, { textDecorationLine: 'line-through' }, isDark && { color: '#F1F5F9' }]}>S</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            {/* Live Dictation Interim Subtitle Preview */}
            {isNoteRecording && !!dictationInterimPreview && (
              <View style={[styles.dictationLivePreviewContainer, isDark && styles.dictationLivePreviewContainerDark]}>
                <View style={styles.dictationLivePreviewDot} />
                <Text style={styles.dictationLivePreviewLabel}>Listening:</Text>
                <Text style={[styles.dictationLivePreviewText, isDark && { color: '#E2E8F0' }]} numberOfLines={2}>
                  “{dictationInterimPreview}”
                </Text>
              </View>
            )}

            {/* Main Dock Row */}
            <View style={styles.nativeDockMainRow}>
              {/* Left format tools */}
              <View style={styles.nativeDockToolsRow}>
                {/* Aa Toggle Button */}
                <TouchableOpacity
                  style={[
                    styles.nativeDockToolBtn,
                    isFormatTrayOpen && { backgroundColor: (accentColor || '#2D62FF') + '20', borderColor: accentColor || '#2D62FF' },
                    isDark && !isFormatTrayOpen && { backgroundColor: '#1E293B', borderColor: '#334155' }
                  ]}
                  onPress={() => setIsFormatTrayOpen((prev) => !prev)}
                  onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.nativeDockAaText, isFormatTrayOpen ? { color: accentColor || '#2D62FF', fontWeight: '800' } : (isDark ? { color: '#F1F5F9' } : { color: '#1E293B' })]}>
                    Aa
                  </Text>
                </TouchableOpacity>

                {/* Bullet List */}
                <TouchableOpacity
                  style={[styles.nativeDockToolBtn, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => executeFormatCommand('bullet')}
                  onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  activeOpacity={0.7}
                >
                  <BulletListIcon size={17} color={isDark ? '#E2E8F0' : '#334155'} />
                </TouchableOpacity>

                {/* Number List */}
                <TouchableOpacity
                  style={[styles.nativeDockToolBtn, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => executeFormatCommand('number')}
                  onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  activeOpacity={0.7}
                >
                  <NumberListIcon size={17} color={isDark ? '#E2E8F0' : '#334155'} />
                </TouchableOpacity>

                {/* Checklist */}
                <TouchableOpacity
                  style={[styles.nativeDockToolBtn, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => executeFormatCommand('task')}
                  onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  activeOpacity={0.7}
                >
                  <ChecklistIcon size={17} color={isDark ? '#E2E8F0' : '#334155'} />
                </TouchableOpacity>

                {/* Formula */}
                <TouchableOpacity
                  style={[styles.nativeDockToolBtn, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => executeFormatCommand('formula')}
                  onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  activeOpacity={0.7}
                >
                  <FormulaIcon size={17} color={isDark ? '#E2E8F0' : '#334155'} />
                </TouchableOpacity>
              </View>

              {/* Right: Signature Voice Dictation Red Mic Feature */}
              {isNoteRecording ? (
                <TouchableOpacity
                  style={styles.nativeVoiceRecordingPill}
                  onPress={handleToggleNoteVoiceDictation}
                  onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  activeOpacity={0.85}
                  accessibilityLabel="Pause voice dictation and transcribe"
                >
                  <Animated.View style={[styles.nativeVoicePulseDot, { opacity: pulseAnim }]} />
                  <Text style={styles.nativeVoiceTimerText}>{formattedRecordingTime}</Text>
                  <PauseIcon size={16} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.nativeVoiceMicBtn}
                  onPress={handleToggleNoteVoiceDictation}
                  onPointerDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  onMouseDown={(e) => { if (Platform.OS === 'web' && e?.preventDefault) e.preventDefault(); }}
                  activeOpacity={0.85}
                  accessibilityLabel="Start voice dictation"
                >
                  <MicIcon size={22} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ── ACADEMIC CLASSIFICATION POPUP MODAL ─────────────────────── */}
      <Modal
        visible={isClassificationModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsClassificationModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.confirmModalOverlay}
          activeOpacity={1}
          onPress={() => setIsClassificationModalOpen(false)}
        >
          <View
            style={[styles.classificationModalCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View style={styles.classificationModalHeader}>
              <View style={[styles.confirmModalIconCircle, { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF', borderColor: isDark ? '#312E81' : '#C7D2FE', marginBottom: 0, marginRight: 12 }]}>
                <NotebookIcon size={24} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.classificationModalTitle, isDark && { color: '#F8FAFC' }]}>
                  Select Note Topic
                </Text>
                <Text style={[styles.classificationModalSub, isDark && { color: '#94A3B8' }]}>
                  Choose subject & topic for your note
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsClassificationModalOpen(false)}
                style={styles.closeBtnCircle}
              >
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Live Selection Summary Pill */}
            <View style={[styles.classificationSummaryPill, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
              <Text style={[styles.classificationSummaryText, isDark && { color: '#94A3B8' }]}>
                {activeFormSubject ? activeFormSubject.iconEmoji : '📚'} <Text style={{ fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A' }}>{activeFormSubject ? activeFormSubject.name : 'Select Subject'}</Text>
                {'  ›  '}
                <Text style={{ fontWeight: '700', color: accentColor }}>{activeFormTopic ? activeFormTopic.name : 'Select Topic'}</Text>
              </Text>
            </View>

            {/* Subject Selector */}
            <Text style={[styles.editorSublabel, isDark && { color: '#94A3B8' }, { marginTop: 16, marginBottom: 8, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '800' }]}>Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.editorPillRow}>
              {studyService.subjects.map((subj) => {
                const isSelected = noteFormSubjectId === subj.id;
                return (
                  <TouchableOpacity
                    key={subj.id}
                    style={[
                      styles.editorSubjectPill,
                      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                      isSelected && { backgroundColor: accentColor, borderColor: accentColor },
                    ]}
                    onPress={() => {
                      setNoteFormSubjectId(subj.id);
                      setNoteFormTopicId((subj.topics && subj.topics[0] && subj.topics[0].id) || "");
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.editorSubjectEmoji}>{subj.iconEmoji}</Text>
                    <Text
                      style={[
                        styles.editorSubjectPillText,
                        isDark && { color: '#CBD5E1' },
                        isSelected && { color: '#FFFFFF', fontWeight: '800' },
                      ]}
                    >
                      {subj.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Topic Selector */}
            <Text style={[styles.editorSublabel, isDark && { color: '#94A3B8' }, { marginTop: 16, marginBottom: 8, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '800' }]}>Topic</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.editorPillRow}>
              {(activeFormSubject && activeFormSubject.topics) ? activeFormSubject.topics.map((top) => {
                const isSelected = noteFormTopicId === top.id;
                return (
                  <TouchableOpacity
                    key={top.id}
                    style={[
                      styles.editorTopicPill,
                      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                      isSelected && { backgroundColor: accentColor, borderColor: accentColor },
                    ]}
                    onPress={() => setNoteFormTopicId(top.id)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.editorTopicPillText,
                        isDark && { color: '#CBD5E1' },
                        isSelected && { color: '#FFFFFF', fontWeight: '700' },
                      ]}
                    >
                      {top.name}
                    </Text>
                  </TouchableOpacity>
                );
              }) : null}
            </ScrollView>

            {/* Action Row */}
            <TouchableOpacity
              style={[styles.editorSaveBtn, { backgroundColor: accentColor, shadowColor: accentColor, marginTop: 24, height: 52, borderRadius: 16 }]}
              onPress={() => {
                setIsClassificationModalOpen(false);
                setViewState("note-editor");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.editorSaveBtnText}>Continue to Note Canvas →</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── DELETE NOTE CONFIRMATION MODAL ─────────────────────────── */}
      <Modal
        visible={!!noteToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setNoteToDelete(null)}
      >
        <TouchableOpacity
          style={styles.confirmModalOverlay}
          activeOpacity={1}
          onPress={() => setNoteToDelete(null)}
        >
          <View
            style={[styles.confirmModalCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.confirmModalIconCircle}>
              <TrashIcon size={24} color="#EF4444" />
            </View>

            <Text style={[styles.confirmModalTitle, isDark && { color: '#F8FAFC' }]}>
              Delete Note?
            </Text>

            <Text style={[styles.confirmModalSubtitle, isDark && { color: '#94A3B8' }]}>
              Are you sure you want to delete "{noteToDelete?.title || 'this note'}"? This action cannot be undone.
            </Text>

            <View style={styles.confirmModalActionsRow}>
              <TouchableOpacity
                style={[styles.confirmCancelBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                onPress={() => setNoteToDelete(null)}
                activeOpacity={0.8}
              >
                <Text style={[styles.confirmCancelBtnText, isDark && { color: '#CBD5E1' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={confirmDeleteNote}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmDeleteBtnText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── NOTE DETAILS MODAL ────────────────────────────────────── */}
      <Modal
        visible={!!noteForDetailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setNoteForDetailModal(null)}
      >
        <TouchableOpacity
          style={styles.confirmModalOverlay}
          activeOpacity={1}
          onPress={() => setNoteForDetailModal(null)}
        >
          <View
            style={[styles.classificationModalCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View style={styles.classificationModalHeader}>
              <View style={[styles.confirmModalIconCircle, { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF', borderColor: isDark ? '#312E81' : '#C7D2FE', marginBottom: 0, marginRight: 12 }]}>
                <NotebookIcon size={24} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.classificationModalTitle, isDark && { color: '#F8FAFC' }]} numberOfLines={1}>
                  {noteForDetailModal?.title || "Note Details"}
                </Text>
                <Text style={[styles.classificationModalSub, isDark && { color: '#94A3B8' }]}>
                  Subject & Metadata Details
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setNoteForDetailModal(null)}
                style={styles.closeBtnCircle}
              >
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Details List */}
            {noteForDetailModal && (() => {
              const words = (noteForDetailModal.content || "").trim().split(/\s+/).filter(Boolean).length;
              const chars = (noteForDetailModal.content || "").length;
              const readTime = Math.max(1, Math.ceil(words / 200));
              const dateStr = noteForDetailModal.updatedAt
                ? new Date(noteForDetailModal.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recently';

              return (
                <View style={{ gap: 10, marginVertical: 10 }}>
                  <View style={[styles.detailRow, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <Text style={[styles.detailLabel, isDark && { color: '#94A3B8' }]}>Classification</Text>
                    <Text style={[styles.detailValue, { color: accentColor }]}>
                      {noteForDetailModal.subjectName || 'Subject'} • {noteForDetailModal.topicName || 'Topic'}
                    </Text>
                  </View>

                  <View style={[styles.detailRow, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <Text style={[styles.detailLabel, isDark && { color: '#94A3B8' }]}>Length & Stats</Text>
                    <Text style={[styles.detailValue, isDark && { color: '#F8FAFC' }]}>
                      {words} words • {chars} characters (~{readTime} min read)
                    </Text>
                  </View>

                  <View style={[styles.detailRow, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <Text style={[styles.detailLabel, isDark && { color: '#94A3B8' }]}>Last Modified</Text>
                    <Text style={[styles.detailValue, isDark && { color: '#F8FAFC' }]}>
                      {dateStr}
                    </Text>
                  </View>

                  <View style={[styles.detailRow, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <Text style={[styles.detailLabel, isDark && { color: '#94A3B8' }]}>Library Status</Text>
                    <Text style={[styles.detailValue, isDark && { color: '#F8FAFC' }]}>
                      {noteForDetailModal.isPinned ? "📌 Pinned to top of library" : "Standard Note"}
                    </Text>
                  </View>
                </View>
              );
            })()}

            {/* Action Buttons */}
            <View style={[styles.confirmModalActionsRow, { marginTop: 12 }]}>
              <TouchableOpacity
                style={[styles.confirmCancelBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                onPress={() => setNoteForDetailModal(null)}
                activeOpacity={0.8}
              >
                <Text style={[styles.confirmCancelBtnText, isDark && { color: '#CBD5E1' }]}>
                  Close
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.editorSaveBtn, { backgroundColor: accentColor, flex: 1.3, height: 46, borderRadius: 14 }]}
                onPress={() => {
                  const targetNote = noteForDetailModal;
                  setNoteForDetailModal(null);
                  handleEditNoteModal(targetNote);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.editorSaveBtnText}>Open Canvas ✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const baseStudyStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeftRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
    marginTop: 2,
  },
  headerSubjectsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(98, 54, 255, 0.2)",
  },
  subjectFilterBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  subjectFilterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  subjectFilterTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subjectFilterTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  manageSubjectsLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  manageSubjectsLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },
  subjectChipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subjectChipActive: {
    backgroundColor: "#6236FF",
    borderColor: "#6236FF",
  },
  subjectChipEmoji: {
    fontSize: 13,
  },
  subjectChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  subjectChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6236FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  timerToggleBtn: {
    padding: 2,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    flexGrow: 1,
  },

  // ── HUB CARDS GRID
  hubCardsGrid: {
    gap: 14,
  },
  hubCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  hubCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  hubIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePillPrimary: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillTextPrimary: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6236FF",
  },
  hubCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  hubCardDescription: {
    fontSize: 13,
    color: "#334155",
    marginTop: 4,
    lineHeight: 18,
    fontWeight: "600",
  },
  hubCardStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  hubStatBadge: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  hubStatValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  hubStatLabel: {
    fontSize: 10.5,
    color: "#475569",
    marginTop: 2,
    fontWeight: "700",
  },

  // ── UNIFIED KNOWLEDGE INTELLIGENCE CARD (Connected Learning Brain)
  syncCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
    gap: 14,
  },
  syncCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  syncCardTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  syncBrainIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  syncCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  syncCardSubtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 2,
  },
  syncLiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  syncLivePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  syncLiveBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.5,
  },
  syncMetricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  syncMetricCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  syncMetricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  syncMetricLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  syncMetricValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 2,
  },
  syncMetricValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  syncMetricUnit: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    flexShrink: 1,
  },
  syncActionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  syncActionBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  syncActionBannerSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 2,
  },
  syncActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  syncActionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── FLASHCARD & QUIZ CROSS-TALK BRIDGE STYLES
  quizBridgeFrontPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.25)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  quizBridgeFrontPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EF4444",
  },
  quizBridgeDetailBox: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    gap: 5,
    width: "100%",
  },
  quizBridgeDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quizBridgeDetailTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#EF4444",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quizBridgeDetailQuestion: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#334155",
    lineHeight: 16,
  },
  quizBridgeDetailAnswer: {
    fontSize: 11,
    marginTop: 2,
  },
  quizBridgeDetailTakeaway: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
  syncCompleteNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(98, 54, 255, 0.08)",
    borderColor: "rgba(98, 54, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
  },
  syncCompleteNoticeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
    flex: 1,
  },
  quizCardBridgeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4.5,
    backgroundColor: "rgba(98, 54, 255, 0.08)",
    borderColor: "rgba(98, 54, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    maxWidth: "100%",
  },
  quizCardBridgeBadgeText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#6236FF",
    flexShrink: 1,
  },
  quizActiveBridgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(98, 54, 255, 0.08)",
    borderColor: "rgba(98, 54, 255, 0.2)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  quizActiveBridgePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6236FF",
    flexShrink: 1,
  },
  quizBridgeResolvedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
  },
  quizBridgeResolvedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
    flex: 1,
  },
  quizBridgeWrongNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
  },
  quizBridgeWrongNoticeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
    flex: 1,
  },

  // ── RECOMMENDATIONS SECTION
  recommendationsSection: {
    marginTop: 24,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  recTextGroup: {
    flex: 1,
    marginRight: 12,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  recReason: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
    marginTop: 3,
  },
  recActionBtn: {
    backgroundColor: "#6236FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recActionBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── SRS FLASHCARD SESSION
  sessionContainer: {
    gap: 16,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  flashcard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    minHeight: 340,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  flashcardFront: {
    borderLeftWidth: 4,
    borderLeftColor: "#6236FF",
  },
  flashcardBack: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#6236FF",
    letterSpacing: 0.4,
  },
  categoryBadgeBack: {
    backgroundColor: "#E8FDF0",
  },
  categoryBadgeTextBack: {
    color: "#10B981",
  },
  cardBodyContainer: {
    marginVertical: 16,
  },
  frontContent: {
    gap: 10,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 24,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFBEB",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginTop: 6,
  },
  hintText: {
    fontSize: 12.5,
    color: "#B45309",
    flex: 1,
  },
  backContent: {
    gap: 12,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 0.8,
  },
  answerText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  explanationBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  explanationBody: {
    fontSize: 12.5,
    color: "#64748B",
    lineHeight: 18,
  },
  takeawayBox: {
    backgroundColor: "#F0EEFF",
    padding: 10,
    borderRadius: 10,
  },
  takeawayTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#6236FF",
  },
  takeawayBody: {
    fontSize: 12,
    color: "#4338CA",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  audioBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },
  tapFlipText: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  toolsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toolChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toolChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  toolChipAi: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F0EEFF",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2D9FF",
  },
  toolChipAiText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },

  // SM-2 Rating Bar
  sm2RatingContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sm2RatingHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  sm2ButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  sm2Btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  sm2BtnTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  sm2BtnInterval: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },
  notesShortcutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFF3E8",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  notesShortcutBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F97316",
  },

  // Session Reward View
  rewardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  rewardBadgeCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#F4F0FF",
    borderWidth: 2,
    borderColor: "#E0D7FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  rewardSubtitle: {
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "400",
    paddingHorizontal: 8,
  },
  rewardStatsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  rewardStatCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardStatValue: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  rewardStatLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 3,
    letterSpacing: 0.1,
  },
  connectedActionsContainer: {
    width: "100%",
    gap: 12,
    marginTop: 6,
  },
  primaryActionBtn: {
    backgroundColor: "#6236FF",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryActionBtnText: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  secondaryActionBtn: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  secondaryActionBtnText: {
    fontSize: 14.5,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  // ── QUIZ SYSTEM STYLES
  quizSetupContainer: {
    gap: 18,
  },
  quizHeroBanner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
    overflow: "hidden",
  },
  quizHeroHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  quizHeroIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
  },
  quizSetupTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  quizSetupSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 19,
    fontWeight: "400",
  },
  quizHeroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  quizHeroStatChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexShrink: 1,
  },
  quizHeroStatChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    flexShrink: 1,
  },
  quizList: {
    gap: 14,
  },
  quizCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  quizCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  quizTopicBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    maxWidth: "100%",
  },
  quizTopicBadgeText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  quizCardTitle: {
    fontSize: 16.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
    lineHeight: 23,
    marginBottom: 8,
  },
  quizCardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  quizCardMeta: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#64748B",
    flexShrink: 1,
  },
  startQuizBtn: {
    backgroundColor: "#10B981",
    height: 44,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  startQuizBtnText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  // Active Quiz Player
  quizActiveContainer: {
    gap: 16,
  },
  quizProgressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizQuestionCounter: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
  },
  quizTagPill: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quizTagPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6236FF",
  },
  quizQuestionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quizQuestionPrompt: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 22,
  },
  quizOptionsList: {
    gap: 10,
  },
  quizOptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quizOptionCardSelected: {
    borderColor: "#6236FF",
    backgroundColor: "#F4F0FF",
  },
  quizOptionCardCorrect: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  quizOptionCardCorrectRevealed: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  quizOptionCardWrong: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  quizOptionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  quizOptionLetterBadgeSelected: {
    backgroundColor: "#6236FF",
    borderColor: "#6236FF",
  },
  quizOptionLetterBadgeCorrect: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  quizOptionLetterBadgeWrong: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  quizOptionLetterText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#475569",
  },
  quizOptionLetterTextSelected: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  quizOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
  },
  quizOptionTextSelected: {
    color: "#6236FF",
    fontWeight: "700",
  },
  quizOptionTextCorrect: {
    color: "#059669",
    fontWeight: "800",
  },
  quizOptionTextWrong: {
    color: "#DC2626",
    fontWeight: "800",
  },
  quizFeedbackCardCorrect: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  quizFeedbackCardWrong: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  quizFeedbackHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quizFeedbackTitleCorrect: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#059669",
  },
  quizFeedbackTitleWrong: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#DC2626",
  },
  quizFeedbackCorrectAnswerText: {
    fontSize: 13.5,
    color: "#991B1B",
    fontWeight: "600",
    marginTop: 2,
  },
  quizFeedbackText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 19,
    marginTop: 4,
  },

  // Results Screen
  quizResultsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  weakTopicAlertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FEF2F2",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    width: "100%",
  },
  weakTopicAlertTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#991B1B",
  },
  weakTopicAlertBody: {
    fontSize: 12,
    color: "#B91C1C",
    marginTop: 2,
    lineHeight: 16,
  },

  // ── NOTES SYSTEM STYLES
  notesHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "transparent",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    padding: 0,
  },
  createNoteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  createNoteBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  notesList: {
    gap: 12,
  },
  emptyNotesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyNotesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B0B0F",
    marginTop: 4,
  },
  emptyNotesSubtitle: {
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 280,
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  noteCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  noteTopicBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  noteTopicBadgeEmoji: {
    fontSize: 12,
  },
  noteTopicBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
  },
  noteCardTitle: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 22,
  },
  noteCardSnippet: {
    fontSize: 13.5,
    color: "#64748B",
    lineHeight: 20,
  },
  noteCardFooterMinimal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 4,
  },
  noteMetaText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#94A3B8",
  },
  pinnedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pinnedBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
  },
  noteCardContextMenu: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  contextMenuOption: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
  },
  contextMenuPinBtn: {
    backgroundColor: "#F0EEFF",
    borderColor: "#D8D2FF",
  },
  contextMenuInfoBtn: {
    backgroundColor: "#F0F9FF",
    borderColor: "#BAE6FD",
  },
  contextMenuDeleteBtn: {
    backgroundColor: "#FFF1F2",
    borderColor: "#FECDD3",
  },
  contextMenuOptionText: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  detailRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  detailLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },

  // Form Modal Styles
  formGroup: {
    gap: 6,
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#475569",
  },
  formInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  formTextArea: {
    minHeight: 120,
  },
  formRow: {
    flexDirection: "row",
  },
  formPill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 6,
  },
  formPillActive: {
    backgroundColor: "#6236FF",
    borderColor: "#6236FF",
  },
  formPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  formPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: "#6236FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // ── CALM SRS REVIEW THEME STYLES (MATCHING REFERENCE DESIGN)
  calmHeader: {
    backgroundColor: "#FAF8F5",
    borderBottomWidth: 0,
  },
  calmHeaderTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1E293B",
  },
  calmHeaderSubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 1,
  },
  calmBackBtn: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  timerPillCalm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timerTextCalm: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#475569",
  },

  // Calm Progress
  calmProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calmProgressLeft: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  calmProgressRight: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A7C59",
  },
  calmProgressTrack: {
    height: 4,
    backgroundColor: "#EDEAE4",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 18,
  },
  calmProgressFill: {
    height: "100%",
    backgroundColor: "#2D3A58",
    borderRadius: 2,
  },

  // Calm Flashcard 3D Dual-Face Architecture (Dynamic Height & Zero Overlap)
  calmFlashcardOuterContainer: {
    width: "100%",
    position: "relative",
  },
  calmFlashcardFace: {
    width: "100%",
    minHeight: 380,
    backfaceVisibility: "hidden",
  },
  calmFlashcardFaceInactive: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  calmFlashcard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    minHeight: 380,
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
  },
  calmFlashcardFlipped: {
    backgroundColor: "#FFFFFF",
    borderColor: "#6236FF",
    borderWidth: 2,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  // Hyper-Prominent Dual-Beam Glass Prism Flare & Surface Flash
  shineSurfaceFlash: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    pointerEvents: "none",
    zIndex: 98,
  },
  shineFlareContainer: {
    position: "absolute",
    top: -150,
    bottom: -150,
    left: -40,
    width: 280,
    transform: [{ skewX: "-32deg" }],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 99,
  },
  shineDiffuserBand: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 40,
  },
  shineMainBeam: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 30,
    right: 30,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 40,
    elevation: 18,
  },
  shineSpecularCore: {
    width: 38,
    height: "100%",
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 24,
    elevation: 20,
  },
  shineSecondaryStreak: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: -25,
    width: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 15,
    elevation: 15,
  },

  calmCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calmCategoryTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  calmStatePillQuestion: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  calmStatePillTextQuestion: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 0.6,
  },
  calmStatePillAnswer: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  calmStatePillTextAnswer: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#4338CA",
    letterSpacing: 0.6,
  },
  calmCardBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  calmCardContentCenter: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
  },
  calmQuestionText: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    lineHeight: 30,
  },
  calmHintSubtext: {
    fontSize: 13,
    color: "#B45309",
    textAlign: "center",
    marginTop: 8,
  },
  calmAnswerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 8,
  },
  calmAnswerDescription: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
    paddingHorizontal: 8,
  },
  calmTakeawayBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 14,
    width: "100%",
  },
  calmTakeawayCode: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 18,
  },
  calmCardFooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  calmTapFlipText: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "500",
  },

  // Calm Bottom Bar Animated Container (Tools vs Rating Bar Crossfade)
  bottomBarContainer: {
    width: "100%",
    marginTop: 20,
    position: "relative",
    minHeight: 120,
  },
  toolsRowContainer: {
    width: "100%",
  },
  calmRatingSectionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  calmRatingSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    alignItems: "center",
  },
  calmRatingPrompt: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  calmRatingButtonsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  calmRatingBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  calmRatingBtnText: {
    fontSize: 13.5,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  calmNotesShortcutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  calmNotesShortcutBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A96A6",
  },

  // ── PREMIUM NOTE EDITOR SCREEN STYLES
  headerTrashBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerSaveNoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  headerSaveNoteBtnText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  editorContainer: {
    gap: 16,
    flex: 1,
    minHeight: SCREEN_HEIGHT - 210,
  },
  editorSectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  editorCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  editorCardHeaderLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },
  editorCardBadge: {
    backgroundColor: "rgba(45, 98, 255, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editorCardBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2D62FF",
  },
  editorSublabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
  },
  editorPillRow: {
    gap: 8,
    flexDirection: "row",
  },
  editorSubjectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  editorSubjectPillActive: {
    backgroundColor: "#112B8A",
    borderColor: "#112B8A",
  },
  editorSubjectEmoji: {
    fontSize: 13,
  },
  editorSubjectPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  editorSubjectPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  editorTopicPill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  editorTopicPillActive: {
    backgroundColor: "#2D62FF",
    borderColor: "#2D62FF",
  },
  editorTopicPillText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#64748B",
  },
  editorTopicPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  editorCanvasCard: {
    backgroundColor: "transparent",
    padding: 2,
    gap: 10,
    flex: 1,
    minHeight: SCREEN_HEIGHT - 220,
  },
  editorTitleInput: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    paddingVertical: 6,
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: "transparent",
  },
  editorToolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  formattingShortcuts: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fmtChip: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  fmtChipTextBold: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
  },
  fmtChipTextItalic: {
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "700",
    color: "#0F172A",
  },
  fmtChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  editorWordStats: {
    fontSize: 12,
    color: "#8F95A5",
    fontWeight: "600",
  },
  editorContentInput: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 25,
    flex: 1,
    minHeight: SCREEN_HEIGHT - 320,
    textAlignVertical: "top",
    borderWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "transparent",
    borderBottomColor: "transparent",
    paddingTop: 4,
    paddingBottom: 60,
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  editorActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  editorSaveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  editorSaveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  editorDeleteBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  // ── NOTE EDITOR BOTTOM ACTION BAR STYLES
  noteEditorActionBar: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderColor: "transparent",
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  noteEditorCenterActionRow: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 2,
  },
  noteEditorRedMicBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6,
  },
  noteEditorRedMicBtnActive: {
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  recordingLiveDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#FFFFFF",
  },

  // ── CONFIRMATION MODAL STYLES
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confirmModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmModalIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmModalSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmModalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmDeleteBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  confirmDeleteBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── CLASSIFICATION POPUP MODAL STYLES
  classificationModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  classificationModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  classificationModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  classificationModalSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classificationSummaryPill: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  classificationSummaryText: {
    fontSize: 13,
    color: '#64748B',
  },
  editorCanvasCategoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  changeTopicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  changeTopicPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  editorSegmentedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 9,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editorSegmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorSegmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  // ── Native Note Editor Styles (Apple/Samsung Notes Inspired)
  nativeHeaderCenterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  nativeHeaderTopicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: '92%',
  },
  nativeHeaderTopicEmoji: {
    fontSize: 13,
  },
  nativeHeaderTopicText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    maxWidth: 150,
  },
  nativeHeaderRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nativeHeaderIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeHeaderSaveBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2D62FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D62FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nativeEditorScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nativeEditorContainer: {
    flex: 1,
  },
  nativeEditorPaper: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  nativeEditorPaperDark: {
    backgroundColor: 'transparent',
  },
  nativeEditorTimestamp: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  nativeEditorTitleInput: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    paddingVertical: 6,
    borderWidth: 0,
    outlineWidth: 0,
    outlineColor: 'transparent',
    letterSpacing: -0.5,
  },
  nativeEditorWordStats: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 16,
  },
  nativeEditorBodyInput: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 26,
    flex: 1,
    minHeight: SCREEN_HEIGHT - 320,
    textAlignVertical: 'top',
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 60,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  nativeBottomDockContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  nativeFormatTray: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    gap: 8,
  },
  nativeFormatTrayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nativeFormatOptionBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeFormatOptionH1Text: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  nativeFormatOptionH2Text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  nativeFormatOptionH3Text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  nativeFormatOptionBodyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  nativeFormatInlineText: {
    fontSize: 14,
    color: '#0F172A',
  },
  nativeDockMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nativeDockToolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nativeDockToolBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeDockAaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  nativeVoiceMicBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  nativeVoiceRecordingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 5,
  },
  nativeVoicePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  nativeVoiceTimerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dictationLivePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.22)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  dictationLivePreviewContainerDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.16)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  dictationLivePreviewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  dictationLivePreviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  dictationLivePreviewText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
  },
});

const getStudyStyles = (isDark, activeAccentColor) => {
  if (!isDark && activeAccentColor === "#2D62FF") return baseStudyStyles;
  return {
    ...baseStudyStyles,
    root: [
      baseStudyStyles.root,
      isDark && { backgroundColor: "#0B0F19" },
    ],
    topHeader: [
      baseStudyStyles.topHeader,
      isDark && { backgroundColor: "#0B0F19", borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    headerTitle: [
      baseStudyStyles.headerTitle,
      isDark && { color: "#F8FAFC" },
    ],
    headerSubtitle: [
      baseStudyStyles.headerSubtitle,
      isDark && { color: "#94A3B8" },
    ],
    backBtn: [
      baseStudyStyles.backBtn,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    calmHeader: [
      baseStudyStyles.calmHeader,
      isDark && { backgroundColor: "#06080F", borderBottomWidth: 0, borderBottomColor: "transparent" },
    ],
    calmBackBtn: [
      baseStudyStyles.calmBackBtn,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    calmHeaderTitle: [
      baseStudyStyles.calmHeaderTitle,
      isDark && { color: "#F8FAFC" },
    ],
    calmHeaderSubtitle: [
      baseStudyStyles.calmHeaderSubtitle,
      isDark && { color: "#94A3B8" },
    ],
    subjectFilterBar: [
      baseStudyStyles.subjectFilterBar,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    subjectFilterTitle: [
      baseStudyStyles.subjectFilterTitle,
      isDark && { color: "#F8FAFC" },
    ],
    subjectChip: [
      baseStudyStyles.subjectChip,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    subjectChipText: [
      baseStudyStyles.subjectChipText,
      isDark && { color: "#94A3B8" },
    ],
    hubCard: [
      baseStudyStyles.hubCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    hubCardTitle: [
      baseStudyStyles.hubCardTitle,
      isDark && { color: "#F8FAFC" },
    ],
    hubCardDescription: [
      baseStudyStyles.hubCardDescription,
      isDark && { color: "#94A3B8" },
    ],
    hubCardStatsRow: [
      baseStudyStyles.hubCardStatsRow,
      isDark && { borderTopWidth: 0, borderTopColor: "transparent" },
    ],
    hubStatBadge: [
      baseStudyStyles.hubStatBadge,
      isDark && { backgroundColor: "#0F172A" },
    ],
    hubStatValue: [
      baseStudyStyles.hubStatValue,
      isDark && { color: "#F8FAFC" },
    ],
    hubStatLabel: [
      baseStudyStyles.hubStatLabel,
      isDark && { color: "#94A3B8" },
    ],
    sectionTitle: [
      baseStudyStyles.sectionTitle,
      isDark && { color: "#F8FAFC" },
    ],
    recommendationCard: [
      baseStudyStyles.recommendationCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    recTitle: [
      baseStudyStyles.recTitle,
      isDark && { color: "#F8FAFC" },
    ],
    recReason: [
      baseStudyStyles.recReason,
      isDark && { color: "#94A3B8" },
    ],
    flashcard: [
      baseStudyStyles.flashcard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    questionText: [
      baseStudyStyles.questionText,
      isDark && { color: "#F8FAFC" },
    ],
    answerText: [
      baseStudyStyles.answerText,
      isDark && { color: "#F8FAFC" },
    ],
    hintBox: [
      baseStudyStyles.hintBox,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    hintText: [
      baseStudyStyles.hintText,
      isDark && { color: "#FDE68A" },
    ],
    explanationBox: [
      baseStudyStyles.explanationBox,
      isDark && { backgroundColor: "#0F172A" },
    ],
    explanationTitle: [
      baseStudyStyles.explanationTitle,
      isDark && { color: "#F8FAFC" },
    ],
    explanationBody: [
      baseStudyStyles.explanationBody,
      isDark && { color: "#CBD5E1" },
    ],
    takeawayBox: [
      baseStudyStyles.takeawayBox,
      isDark && { backgroundColor: "#1E293B" },
    ],
    takeawayTitle: [
      baseStudyStyles.takeawayTitle,
      isDark && { color: "#A5B4FC" },
    ],
    takeawayBody: [
      baseStudyStyles.takeawayBody,
      isDark && { color: "#C7D2FE" },
    ],
    cardFooter: [
      baseStudyStyles.cardFooter,
      isDark && { borderTopWidth: 0, borderTopColor: "transparent" },
    ],
    calmFlashcard: [
      baseStudyStyles.calmFlashcard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    calmFlashcardFlipped: [
      baseStudyStyles.calmFlashcardFlipped,
      isDark && { backgroundColor: "#1E293B", borderColor: activeAccentColor || "#6236FF" },
    ],
    calmCategoryTag: [
      baseStudyStyles.calmCategoryTag,
      isDark && { color: "#94A3B8" },
    ],
    calmStatePillQuestion: [
      baseStudyStyles.calmStatePillQuestion,
      isDark && { backgroundColor: "#0F172A" },
    ],
    calmStatePillTextQuestion: [
      baseStudyStyles.calmStatePillTextQuestion,
      isDark && { color: "#94A3B8" },
    ],
    calmStatePillAnswer: [
      baseStudyStyles.calmStatePillAnswer,
      isDark && { backgroundColor: "rgba(98, 54, 255, 0.2)", borderColor: "rgba(98, 54, 255, 0.4)" },
    ],
    calmStatePillTextAnswer: [
      baseStudyStyles.calmStatePillTextAnswer,
      isDark && { color: "#C7D2FE" },
    ],
    calmQuestionText: [
      baseStudyStyles.calmQuestionText,
      isDark && { color: "#F8FAFC" },
    ],
    calmAnswerTitle: [
      baseStudyStyles.calmAnswerTitle,
      isDark && { color: "#F8FAFC" },
    ],
    calmAnswerDescription: [
      baseStudyStyles.calmAnswerDescription,
      isDark && { color: "#CBD5E1" },
    ],
    calmTakeawayBox: [
      baseStudyStyles.calmTakeawayBox,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    calmTakeawayCode: [
      baseStudyStyles.calmTakeawayCode,
      isDark && { color: "#E2E8F0" },
    ],
    calmTapFlipText: [
      baseStudyStyles.calmTapFlipText,
      isDark && { color: "#94A3B8" },
    ],
    categoryBadge: [
      baseStudyStyles.categoryBadge,
      isDark && { backgroundColor: "rgba(98, 54, 255, 0.2)" },
    ],
    categoryBadgeBack: [
      baseStudyStyles.categoryBadgeBack,
      isDark && { backgroundColor: "rgba(16, 185, 129, 0.2)" },
    ],
    categoryBadgeText: [
      baseStudyStyles.categoryBadgeText,
      isDark && { color: "#C7D2FE" },
    ],
    categoryBadgeTextBack: [
      baseStudyStyles.categoryBadgeTextBack,
      isDark && { color: "#6EE7B7" },
    ],
    questionLabel: [
      baseStudyStyles.questionLabel,
      isDark && { color: "#94A3B8" },
    ],
    answerLabel: [
      baseStudyStyles.answerLabel,
      isDark && { color: "#34D399" },
    ],
    calmRatingSection: [
      baseStudyStyles.calmRatingSection,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    calmRatingPrompt: [
      baseStudyStyles.calmRatingPrompt,
      isDark && { color: "#94A3B8" },
    ],
    quizQuestionCard: [
      baseStudyStyles.quizQuestionCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    quizQuestionPrompt: [
      baseStudyStyles.quizQuestionPrompt,
      isDark && { color: "#F8FAFC" },
    ],
    quizOptionCard: [
      baseStudyStyles.quizOptionCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    quizOptionCardSelected: [
      baseStudyStyles.quizOptionCardSelected,
      isDark && { backgroundColor: "rgba(98, 54, 255, 0.2)", borderColor: activeAccentColor },
    ],
    quizOptionCardCorrect: [
      baseStudyStyles.quizOptionCardCorrect,
      isDark && { backgroundColor: "rgba(16, 185, 129, 0.2)", borderColor: "#10B981" },
    ],
    quizOptionCardCorrectRevealed: [
      baseStudyStyles.quizOptionCardCorrectRevealed,
      isDark && { backgroundColor: "rgba(16, 185, 129, 0.2)", borderColor: "#10B981" },
    ],
    quizOptionCardWrong: [
      baseStudyStyles.quizOptionCardWrong,
      isDark && { backgroundColor: "rgba(239, 68, 68, 0.2)", borderColor: "#EF4444" },
    ],
    quizOptionLetterBadge: [
      baseStudyStyles.quizOptionLetterBadge,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    quizOptionLetterText: [
      baseStudyStyles.quizOptionLetterText,
      isDark && { color: "#CBD5E1" },
    ],
    quizOptionText: [
      baseStudyStyles.quizOptionText,
      isDark && { color: "#F8FAFC" },
    ],
    quizFeedbackCardCorrect: [
      baseStudyStyles.quizFeedbackCardCorrect,
      isDark && { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "#059669" },
    ],
    quizFeedbackCardWrong: [
      baseStudyStyles.quizFeedbackCardWrong,
      isDark && { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "#DC2626" },
    ],
    quizFeedbackText: [
      baseStudyStyles.quizFeedbackText,
      isDark && { color: "#CBD5E1" },
    ],
    quizResultsContainer: [
      baseStudyStyles.quizResultsContainer,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    weakTopicAlertBox: [
      baseStudyStyles.weakTopicAlertBox,
      isDark && { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "#7F1D1D" },
    ],
    editorSectionCard: [
      baseStudyStyles.editorSectionCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    editorSublabel: [
      baseStudyStyles.editorSublabel,
      isDark && { color: "#CBD5E1" },
    ],
    editorSubjectPill: [
      baseStudyStyles.editorSubjectPill,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    editorSubjectPillText: [
      baseStudyStyles.editorSubjectPillText,
      isDark && { color: "#94A3B8" },
    ],
    editorTopicPill: [
      baseStudyStyles.editorTopicPill,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    editorTopicPillText: [
      baseStudyStyles.editorTopicPillText,
      isDark && { color: "#94A3B8" },
    ],
    editorTitleInput: [
      baseStudyStyles.editorTitleInput,
      isDark && { color: "#F8FAFC" },
    ],
    editorContentInput: [
      baseStudyStyles.editorContentInput,
      isDark && { color: "#CBD5E1" },
    ],
    fmtChip: [
      baseStudyStyles.fmtChip,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    fmtChipTextBold: [
      baseStudyStyles.fmtChipTextBold,
      isDark && { color: "#F8FAFC" },
    ],
    fmtChipTextItalic: [
      baseStudyStyles.fmtChipTextItalic,
      isDark && { color: "#F8FAFC" },
    ],
    fmtChipText: [
      baseStudyStyles.fmtChipText,
      isDark && { color: "#94A3B8" },
    ],
    notesSearchBarContainer: [
      baseStudyStyles.notesSearchBarContainer,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    notesSearchInput: [
      baseStudyStyles.notesSearchInput,
      isDark && { color: "#F8FAFC" },
    ],
    noteCard: [
      baseStudyStyles.noteCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    noteCardTitle: [
      baseStudyStyles.noteCardTitle,
      isDark && { color: "#F8FAFC" },
    ],
    noteCardBody: [
      baseStudyStyles.noteCardBody,
      isDark && { color: "#94A3B8" },
    ],
    rewardModalCard: [
      baseStudyStyles.rewardModalCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    rewardTitle: [
      baseStudyStyles.rewardTitle,
      isDark && { color: "#F8FAFC" },
    ],
    rewardSubtitle: [
      baseStudyStyles.rewardSubtitle,
      isDark && { color: "#94A3B8" },
    ],
    rewardStatCard: [
      baseStudyStyles.rewardStatCard,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    rewardStatLabel: [
      baseStudyStyles.rewardStatLabel,
      isDark && { color: "#94A3B8" },
    ],
    confirmModalCard: [
      baseStudyStyles.confirmModalCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    confirmModalTitle: [
      baseStudyStyles.confirmModalTitle,
      isDark && { color: "#F8FAFC" },
    ],
    confirmModalSubtitle: [
      baseStudyStyles.confirmModalSubtitle,
      isDark && { color: "#94A3B8" },
    ],
    confirmCancelBtn: [
      baseStudyStyles.confirmCancelBtn,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    confirmCancelBtnText: [
      baseStudyStyles.confirmCancelBtnText,
      isDark && { color: "#94A3B8" },
    ],
    classificationModalCard: [
      baseStudyStyles.classificationModalCard,
      isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" },
    ],
    classificationModalTitle: [
      baseStudyStyles.classificationModalTitle,
      isDark && { color: "#F8FAFC" },
    ],
    classificationModalSub: [
      baseStudyStyles.classificationModalSub,
      isDark && { color: "#94A3B8" },
    ],
    closeBtnCircle: [
      baseStudyStyles.closeBtnCircle,
      isDark && { backgroundColor: "#0F172A" },
    ],
    classificationSummaryPill: [
      baseStudyStyles.classificationSummaryPill,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    classificationSummaryText: [
      baseStudyStyles.classificationSummaryText,
      isDark && { color: "#94A3B8" },
    ],
    changeTopicPill: [
      baseStudyStyles.changeTopicPill,
      isDark && { backgroundColor: "#0F172A", borderWidth: 0, borderColor: "transparent" },
    ],
    modalSheetContainer: [
      baseStudyStyles.modalSheetContainer,
      isDark && { backgroundColor: "#1E293B" },
    ],
    modalSheetTitle: [
      baseStudyStyles.modalSheetTitle,
      isDark && { color: "#F8FAFC" },
    ],
    inputLabel: [
      baseStudyStyles.inputLabel,
      isDark && { color: "#94A3B8" },
    ],
    modalTextInput: [
      baseStudyStyles.modalTextInput,
      isDark && { backgroundColor: "#0F172A", color: "#F8FAFC", borderWidth: 0, borderColor: "transparent" },
    ],
    noteEditorActionBar: [
      baseStudyStyles.noteEditorActionBar,
    ],
    noteEditorRedMicBtn: [
      baseStudyStyles.noteEditorRedMicBtn,
    ],
    nativeHeaderTopicPill: [
      baseStudyStyles.nativeHeaderTopicPill,
      isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
    ],
    nativeHeaderTopicText: [
      baseStudyStyles.nativeHeaderTopicText,
      isDark && { color: '#F1F5F9' },
    ],
    nativeEditorTimestamp: [
      baseStudyStyles.nativeEditorTimestamp,
      isDark && { color: '#64748B' },
    ],
    nativeEditorTitleInput: [
      baseStudyStyles.nativeEditorTitleInput,
      isDark && { color: '#F8FAFC' },
    ],
    nativeEditorWordStats: [
      baseStudyStyles.nativeEditorWordStats,
      isDark && { color: '#64748B' },
    ],
    nativeEditorBodyInput: [
      baseStudyStyles.nativeEditorBodyInput,
      isDark && { color: '#F1F5F9' },
    ],
    nativeBottomDockContainer: [
      baseStudyStyles.nativeBottomDockContainer,
      isDark && { backgroundColor: '#0B0F19', borderTopColor: '#1E293B' },
    ],
    nativeFormatTray: [
      baseStudyStyles.nativeFormatTray,
      isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
    ],
    nativeFormatOptionBtn: [
      baseStudyStyles.nativeFormatOptionBtn,
      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
    ],
    nativeFormatOptionH1Text: [
      baseStudyStyles.nativeFormatOptionH1Text,
      isDark && { color: '#F1F5F9' },
    ],
    nativeFormatOptionH2Text: [
      baseStudyStyles.nativeFormatOptionH2Text,
      isDark && { color: '#F1F5F9' },
    ],
    nativeFormatOptionH3Text: [
      baseStudyStyles.nativeFormatOptionH3Text,
      isDark && { color: '#F1F5F9' },
    ],
    nativeFormatOptionBodyText: [
      baseStudyStyles.nativeFormatOptionBodyText,
      isDark && { color: '#94A3B8' },
    ],
    nativeFormatInlineText: [
      baseStudyStyles.nativeFormatInlineText,
      isDark && { color: '#F1F5F9' },
    ],
    nativeDockToolBtn: [
      baseStudyStyles.nativeDockToolBtn,
      isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
    ],
    nativeDockAaText: [
      baseStudyStyles.nativeDockAaText,
      isDark && { color: '#F1F5F9' },
    ],
  };
};
