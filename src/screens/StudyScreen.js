import React, { useState, useEffect, useMemo, useRef } from "react";
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
    <Rect x="3" y="5" width="6" height="6" rx="1" />
    <Line x1="12" y1="8" x2="21" y2="8" />
    <Rect x="3" y="13" width="6" height="6" rx="1" />
    <Line x1="12" y1="16" x2="21" y2="16" />
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
          {part.slice(1, -1).trim()}
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
      const taskText = taskMatch[2];
      elements.push(
        <TouchableOpacity
          key={`task-${lineIdx}`}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            marginVertical: 3,
            paddingVertical: 2,
          }}
          onPress={() => onToggleTask && onToggleTask(lineIdx)}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              borderWidth: 1.5,
              borderColor: isChecked ? (accentColor || '#2D62FF') : (isDark ? '#64748B' : '#94A3B8'),
              backgroundColor: isChecked ? (accentColor || '#2D62FF') : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 2,
            }}
          >
            {isChecked && <CheckIcon size={12} color="#FFFFFF" />}
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 22,
              color: isChecked ? (isDark ? '#64748B' : '#94A3B8') : (isDark ? '#F8FAFC' : '#0F172A'),
              textDecorationLine: isChecked ? 'line-through' : 'none',
            }}
            selectable={selectable}
          >
            {parseInlineMarkdown(taskText, isDark, accentColor)}
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

    // Bright glass sheen light reflection - glides smoothly across the glass surface
    shineAnim.setValue(0);
    Animated.timing(shineAnim, {
      toValue: 1,
      duration: 650,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Crisp 3D glass flip animation (450ms)
    Animated.timing(cardFlipAnim, {
      toValue: toVal,
      duration: 450,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsFlipping(false);
    });

    // Toggle content state & animate bottom bar crossfade smoothly at edge-on midpoint (225ms)
    setTimeout(() => {
      setIsFlippedState(!isFlippedState);
      setIsFlipped(!isFlippedState);
      Animated.timing(bottomBarAnim, {
        toValue: toVal,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 225);
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
  const handleStartReviewSession = (subjId = null, topId = null, initialIndex = 0) => {
    const sessionCards = studyService.getCardsForReview(subjId, topId, currentLang);
    setCards(sessionCards);
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
  const [isSavingSuccess, setIsSavingSuccess] = useState(false);
  const [activeMenuNoteId, setActiveMenuNoteId] = useState(null);
  const saveBtnScale = useRef(new Animated.Value(1)).current;
  const [noteForDetailModal, setNoteForDetailModal] = useState(null);

  // ── Voice Dictation State ──
  const [isNoteRecording, setIsNoteRecording] = useState(false);
  const speechRecognitionRef = useRef(null);
  const isRecordingActiveRef = useRef(false);

  useEffect(() => {
    return () => {
      isRecordingActiveRef.current = false;
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }
      try { voiceRecordingService.stopRecording(); } catch (e) {}
    };
  }, []);

  const handleToggleNoteVoiceDictation = async () => {
    if (isNoteRecording) {
      isRecordingActiveRef.current = false;
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
        speechRecognitionRef.current = null;
      }
      try {
        await voiceRecordingService.stopRecording();
      } catch (e) {}
      setIsNoteRecording(false);
      return;
    }

    isRecordingActiveRef.current = true;
    setIsNoteRecording(true);

    // 1. High-fidelity audio recording capture in background
    try {
      await voiceRecordingService.startRecording();
    } catch (err) {
      console.warn('[NoteVoiceDictation] Audio recording notice:', err);
    }

    // 2. High-sensitivity continuous speech-to-text recognition
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
            let finalChunk = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalChunk += event.results[i][0].transcript;
              }
            }
            if (finalChunk && finalChunk.trim()) {
              setNoteFormContent((prev) => {
                const base = (prev || '').trim();
                const textToAdd = finalChunk.trim();
                const newText = base ? `${base} ${textToAdd}` : textToAdd;
                pushHistory(newText);
                return newText;
              });
            }
          };

          recognition.onerror = (event) => {
            console.log('[NoteVoiceDictation] Recognition notice:', event?.error);
            if (event?.error === 'not-allowed') {
              isRecordingActiveRef.current = false;
              setIsNoteRecording(false);
              Alert.alert('Microphone Access', 'Please allow microphone access in your browser settings.');
            }
          };

          recognition.onend = () => {
            // Auto-reconnect so speech recognition never cuts out on pauses while recording is active
            if (isRecordingActiveRef.current) {
              try {
                recognition.start();
              } catch (e) {}
            } else {
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

  // ── Note Undo / Redo History Stack ──
  const [historyStack, setHistoryStack] = useState(() => [""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isHistoryActionRef = useRef(false);

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
      pushHistory(updated);
    }
  };

  const pushHistory = (newText) => {
    if (isHistoryActionRef.current) {
      isHistoryActionRef.current = false;
      return;
    }
    setHistoryStack((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      if (trimmed[trimmed.length - 1] === newText) return prev;
      return [...trimmed.slice(-25), newText];
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 25));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevText = historyStack[prevIndex] ?? "";
      isHistoryActionRef.current = true;
      setHistoryIndex(prevIndex);
      setNoteFormContent(prevText);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextText = historyStack[nextIndex] ?? "";
      isHistoryActionRef.current = true;
      setHistoryIndex(nextIndex);
      setNoteFormContent(nextText);
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
        const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
        const newLine = currentLine.startsWith('# ') ? cleanLine : `# ${cleanLine}`;
        newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
        newCursorPos = lineStart + newLine.length;
        break;
      }
      case 'h2': {
        const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
        const newLine = currentLine.startsWith('## ') ? cleanLine : `## ${cleanLine}`;
        newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
        newCursorPos = lineStart + newLine.length;
        break;
      }
      case 'h3': {
        const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
        const newLine = currentLine.startsWith('### ') ? cleanLine : `### ${cleanLine}`;
        newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
        newCursorPos = lineStart + newLine.length;
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
        const cleanLine = currentLine.replace(/^([-*+]\s*\[[ xX]\]\s*|[-*+]\s*|\d+\.\s*)/, '');
        const newLine = currentLine.startsWith('- [ ] ') ? cleanLine : `- [ ] ${cleanLine}`;
        newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
        newCursorPos = lineStart + newLine.length;
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

    setEditingNote(null);
    setNoteFormTitle("");
    setNoteFormSubjectId(sId);
    setNoteFormTopicId(tId);
    setNoteFormContent("");
    setNoteEditorMode('edit');
    setIsClassificationModalOpen(true);
  };

  const handleEditNoteModal = (note) => {
    setEditingNote(note);
    setNoteFormTitle(note.title);
    setNoteFormSubjectId(note.subjectId);
    setNoteFormTopicId(note.topicId);
    setNoteFormContent(note.content);
    setNoteEditorMode('edit');
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

    studyService.saveNote({
      id: (editingNote && editingNote.id),
      title: noteFormTitle,
      subjectId: noteFormSubjectId,
      topicId: noteFormTopicId,
      content: noteFormContent,
    });

    setTimeout(() => {
      setIsSavingSuccess(false);
      setViewState("notes");
      refreshData();
    }, 450);
  };

  const insertFormatting = (prefix, suffix = "") => {
    setNoteFormContent((prev) => `${prev}${prefix}${suffix}`);
  };

  const wordCount = noteFormContent.trim() ? noteFormContent.trim().split(/\s+/).length : 0;
  const charCount = noteFormContent.length;

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
                    setViewState("notes");
                  } else {
                    setViewState("overview");
                  }
                }}
              >
              <ChevronLeftIcon size={20} color={isDark ? "#F8FAFC" : (viewState === "review" ? "#1E293B" : "#0F172A")} />
            </TooltipTouchable>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.headerTitle,
                viewState === "review" && styles.calmHeaderTitle,
                viewState === "note-editor" && { fontSize: 26, fontWeight: "800", letterSpacing: -0.6 },
              ]}
              numberOfLines={1}
            >
              {viewState === "overview" && (t("study.hubTitle") || "Study Hub")}
              {viewState === "review" && (t("study.flashcardReview") || "Flashcard Review")}
              {viewState === "quiz" && (t("study.quiz") || "Quiz")}
              {viewState === "notes" && (t("study.notesLibrary") || "Notes Library")}
              {viewState === "note-editor" && (editingNote ? (t("study.editNote") || "Edit Note") : (t("study.newNote") || "New Note"))}
            </Text>
            {viewState !== "note-editor" && (
              <Text style={[styles.headerSubtitle, viewState === "review" && styles.calmHeaderSubtitle]} numberOfLines={1}>
                {viewState === "overview" && (t("study.hubSubtitle") || "Review, test yourself, and master every topic.")}
                {viewState === "review" && ((currentCard && currentCard.category) || "Organic Chemistry I")}
                {viewState === "quiz" && (t("study.practiceTests") || "Topic-based testing connected to SRS")}
                {viewState === "notes" && (t("study.subjectOrganized") || "Organized by Subject & Topic")}
              </Text>
            )}
          </View>
        </View>

        {/* Header Right Action: Save Note Button or None */}
        {viewState === "note-editor" ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Animated.View style={{ transform: [{ scale: saveBtnScale }] }}>
              <TooltipTouchable
                tooltip="Save Note"
                style={[
                  styles.headerSaveNoteBtn,
                  {
                    backgroundColor: isSavingSuccess ? "#10B981" : accentColor,
                    shadowColor: isSavingSuccess ? "#10B981" : accentColor,
                  },
                ]}
                onPress={handleSaveNote}
                activeOpacity={0.85}
              >
                <CheckIcon size={15} color="#FFFFFF" />
                <Text style={styles.headerSaveNoteBtnText}>
                  {isSavingSuccess ? (t("study.saved") || "Saved!") : (t("common.save") || "Save")}
                </Text>
              </TooltipTouchable>
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
          {/* Active Subject Workspace Quick Selector */}
          <View style={styles.subjectFilterBar}>
            <View style={styles.subjectFilterHeader}>
              <View style={styles.subjectFilterTitleGroup}>
                <FolderIcon size={16} color="#6236FF" />
                <Text style={styles.subjectFilterTitle}>{t("study.subjectWorkspaces") || "Subject Workspaces"}</Text>
              </View>
              <TouchableOpacity
                style={styles.manageSubjectsLink}
                onPress={() => (onNavigate ? onNavigate("subjects") : onSelectTab("subjects"))}
                activeOpacity={0.7}
              >
                <Text style={styles.manageSubjectsLinkText}>{t("study.manageAll") || "Manage All"}</Text>
                <ChevronRightIcon size={14} color="#6236FF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subjectChipsRow}
            >
              <TouchableOpacity
                style={[
                  styles.subjectChip,
                  selectedSubjectId === null && styles.subjectChipActive,
                ]}
                onPress={() => {
                  setSelectedSubjectId(null);
                  setSelectedTopicId(null);
                }}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.subjectChipText,
                    selectedSubjectId === null && styles.subjectChipTextActive,
                  ]}
                >
                  {t("study.allSubjects") || "✨ All Subjects"}
                </Text>
              </TouchableOpacity>

              {studyService.subjects.map((subj) => {
                const isSelected = selectedSubjectId === subj.id;
                return (
                  <TouchableOpacity
                    key={subj.id}
                    style={[
                      styles.subjectChip,
                      isSelected && [
                        styles.subjectChipActive,
                        { backgroundColor: subj.color || "#6236FF", borderColor: subj.color || "#6236FF" },
                      ],
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedSubjectId(null);
                        setSelectedTopicId(null);
                      } else {
                        setSelectedSubjectId(subj.id);
                        setSelectedTopicId(null);
                      }
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.subjectChipEmoji}>{subj.iconEmoji}</Text>
                    <Text
                      style={[
                        styles.subjectChipText,
                        isSelected && styles.subjectChipTextActive,
                      ]}
                    >
                      {subj.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
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
                    {t("study.takeQuizTopic") || "Take a Quiz on this Topic"}
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
                          <Text style={[styles.quizTopicBadgeText, { color: accentColor }]} numberOfLines={1}>{quiz.topicName}</Text>
                        </View>
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

      {/* ── VIEW 5: DEDICATED FULL-SCREEN NOTE EDITOR ────────────────────── */}
      {viewState === "note-editor" && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}
          >
            <View style={styles.editorContainer}>
              {/* Main Note Canvas Paper */}
              <View style={styles.editorCanvasCard}>
                {/* Category Badge & Topic Selector Button */}
                <TouchableOpacity
                  style={styles.editorCanvasCategoryBadgeRow}
                  onPress={() => setIsClassificationModalOpen(true)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.noteTopicBadge, { backgroundColor: (accentColor || '#2D62FF') + '15' }]}>
                    <Text style={styles.noteTopicBadgeEmoji}>{activeFormSubject?.iconEmoji || "📝"}</Text>
                    <Text style={[styles.noteTopicBadgeText, { color: accentColor }]}>
                      {activeFormSubject?.name || 'General'} • {activeFormTopic?.name || 'Topic'}
                    </Text>
                  </View>

                  <View style={[styles.changeTopicPill, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                    <EditIcon size={12} color={accentColor} />
                    <Text style={[styles.changeTopicPillText, { color: accentColor }]}>Change</Text>
                  </View>
                </TouchableOpacity>

                {/* Note Title Input */}
                <TextInput
                  style={[styles.editorTitleInput, isDark && { color: '#F8FAFC' }]}
                  placeholder="Title"
                  placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                  underlineColorAndroid="transparent"
                  value={noteFormTitle}
                  onChangeText={setNoteFormTitle}
                />

                {/* Stats & Preview Toggle Bar */}
                <View style={[styles.editorToolbarRow, { justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, marginVertical: 4 }]}>
                  <Text style={[styles.editorWordStats, isDark && { color: '#64748B' }]}>
                    {wordCount} words • {charCount} chars
                  </Text>
                  <View style={[styles.editorSegmentedBar, isDark && { backgroundColor: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.12)' }]}>
                    <TouchableOpacity
                      style={[
                        styles.editorSegmentBtn,
                        noteEditorMode === 'edit' && { backgroundColor: accentColor || '#2D62FF', shadowColor: accentColor || '#2D62FF', shadowOpacity: 0.3, shadowRadius: 4 }
                      ]}
                      onPress={() => setNoteEditorMode('edit')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.editorSegmentBtnText, noteEditorMode === 'edit' ? { color: '#FFFFFF', fontWeight: '700' } : (isDark ? { color: '#94A3B8' } : { color: '#64748B' })]}>
                        ✏️ Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.editorSegmentBtn,
                        noteEditorMode === 'preview' && { backgroundColor: accentColor || '#2D62FF', shadowColor: accentColor || '#2D62FF', shadowOpacity: 0.3, shadowRadius: 4 }
                      ]}
                      onPress={() => setNoteEditorMode('preview')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.editorSegmentBtnText, noteEditorMode === 'preview' ? { color: '#FFFFFF', fontWeight: '700' } : (isDark ? { color: '#94A3B8' } : { color: '#64748B' })]}>
                        👁️ Preview
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Main Content Area: Edit Mode or Formatted Preview Mode */}
                {noteEditorMode === 'edit' ? (
                  <TextInput
                    ref={contentInputRef}
                    style={[
                      styles.editorContentInput,
                      isDark && { color: '#F8FAFC' },
                      Platform.OS === 'web' && { outlineStyle: 'none', borderWidth: 0, outline: 'none' }
                    ]}
                    placeholder="Start typing your study notes..."
                    placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                    multiline
                    scrollEnabled={false}
                    textAlignVertical="top"
                    underlineColorAndroid="transparent"
                    value={noteFormContent}
                    onChangeText={setNoteFormContent}
                    onSelectionChange={(e) => setContentSelection(e.nativeEvent.selection)}
                  />
                ) : (
                  <View style={{ minHeight: 220, paddingVertical: 8 }}>
                    <FormattedMarkdownView
                      content={noteFormContent}
                      isDark={isDark}
                      accentColor={accentColor}
                      onToggleTask={handleToggleTaskCheckbox}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* ── NOTE EDITOR ACTION BAR: CENTERED RED MICROPHONE / STOP BUTTON ── */}
          <View
            style={[
              styles.noteEditorActionBar,
              {
                paddingBottom: Math.max(insets.bottom, 12) + 8,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.noteEditorCenterActionRow} pointerEvents="box-none">
              <TooltipTouchable
                style={styles.noteEditorRedMicBtn}
                onPress={handleToggleNoteVoiceDictation}
                activeScale={0.88}
                disableTooltip
              >
                {isNoteRecording ? (
                  <StopSquareIcon size={22} color="#FFFFFF" />
                ) : (
                  <MicIcon size={28} color="#FFFFFF" />
                )}
              </TooltipTouchable>
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
    marginBottom: 10,
  },
  quizTopicBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  quizTopicBadgeText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.2,
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
  };
};
