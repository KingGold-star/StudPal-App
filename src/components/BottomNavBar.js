import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated, Platform } from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { settingsService } from "../services/settings/settingsService";
import { useTranslation } from "../services/i18n/i18nService";
import { useTheme } from "../theme/themeContext";

// On web, useNativeDriver doesn't support transform — must use JS driver
const USE_NATIVE = Platform.OS !== "web";

// ─── SVG Icons matching user reference design ────────────────────────────────
const HomeIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 10.5L12 3l9 7.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
    <Path d="M9 21.5v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" fill={isActive ? "#FFFFFF" : "none"} />
  </Svg>
);

const CommunityIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill={isActive ? color : "none"} />
    <Circle cx="9" cy="7" r="4" fill={isActive ? color : "none"} />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} />
  </Svg>
);

const ScheduleIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={isActive ? "#FFFFFF" : color} strokeWidth={isActive ? "2.2" : "2"} />
  </Svg>
);

const StudyIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={isActive ? "#FFFFFF" : color} strokeWidth={isActive ? "2.2" : "2"} />
  </Svg>
);

const StatsIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 20V10M12 20V4M6 20v-6" fill={isActive ? color : "none"} />
  </Svg>
);

const ProfileIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="7" r="4" />
    <Path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
  </Svg>
);

const SparklesIcon = ({ size = 26, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M10 1c0 4.5 3.5 8 8 8-4.5 0-8 3.5-8 8 0-4.5-3.5-8-8-8 4.5 0 8-3.5 8-8z" />
    <Path d="M18 14c0 2 1.5 3.5 3.5 3.5-2 0-3.5 1.5-3.5 3.5 0-2-1.5-3.5-3.5-3.5 2 0 3.5-1.5 3.5-3.5z" />
  </Svg>
);

// ─── Reusable click-pop animation helper ─────────────────────────────────────
function playClickPop(animValue) {
  animValue.stopAnimation();
  animValue.setValue(1);
  Animated.sequence([
    Animated.timing(animValue, {
      toValue: 1.06,
      duration: 100,
      useNativeDriver: USE_NATIVE,
    }),
    Animated.timing(animValue, {
      toValue: 1,
      duration: 120,
      useNativeDriver: USE_NATIVE,
    }),
  ]).start();
}

// ─── Reusable Tooltip Card that slides up from clicked navbar button ─────────
const TooltipCard = ({
  label,
  isVisible,
  animKey,
  accentColor,
  isDark,
  topOffset = -38,
  extraOffset = 0,
}) => {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const dismissTimer = useRef(null);

  useEffect(() => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }

    if (isVisible) {
      slideAnim.stopAnimation();
      opacityAnim.stopAnimation();
      scaleAnim.stopAnimation();

      // Start position: emerging from the icon button below
      slideAnim.setValue(20);
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.85);

      // Slide upward from button into resting position with smooth spring
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 7,
          tension: 160,
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: USE_NATIVE,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 160,
          useNativeDriver: USE_NATIVE,
        }),
      ]).start();

      // Auto-dismiss after 1.9s: gently glides up and fades away
      dismissTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -8,
            duration: 220,
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.92,
            duration: 200,
            useNativeDriver: USE_NATIVE,
          }),
        ]).start();
      }, 1900);
    } else {
      slideAnim.stopAnimation();
      opacityAnim.stopAnimation();
      scaleAnim.stopAnimation();
      opacityAnim.setValue(0);
      slideAnim.setValue(20);
      scaleAnim.setValue(0.85);
    }

    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, [isVisible, animKey]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.tooltipWrapper,
        {
          top: topOffset,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
            { translateX: extraOffset },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.tooltipCard,
          isDark ? styles.tooltipCardDark : styles.tooltipCardLight,
        ]}
      >
        <View style={[styles.tooltipDot, { backgroundColor: accentColor }]} />
        <Text
          style={[
            styles.tooltipText,
            isDark ? styles.tooltipTextDark : styles.tooltipTextLight,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <View
        style={[
          styles.tooltipBeak,
          isDark ? styles.tooltipBeakDark : styles.tooltipBeakLight,
        ]}
      />
    </Animated.View>
  );
};

const TabItem = ({
  tab,
  isActive,
  onSelectTab,
  onLongPressTab,
  accentColor = "#6236FF",
  isDark = false,
  showTooltip = false,
  tooltipKey = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const activeOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  // Cross-fade between active/inactive icon states
  useEffect(() => {
    Animated.timing(activeOpacity, {
      toValue: isActive ? 1 : 0,
      duration: 150,
      useNativeDriver: USE_NATIVE,
    }).start();
  }, [isActive]);

  const inactiveOpacity = activeOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Short tap: immediate navigation without showing the card
  const handlePress = () => {
    if (onSelectTab) onSelectTab(tab.id);
  };

  // Long press: triggers the sliding screen name card
  const handleLongPress = () => {
    if (onLongPressTab) onLongPressTab(tab.id);
  };

  // Scale down when user clicks / presses down
  const handlePressIn = () => {
    scaleAnim.stopAnimation();
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      friction: 7,
      tension: 300,
      useNativeDriver: USE_NATIVE,
    }).start();
  };

  // Scale back up when user lets go
  const handlePressOut = () => {
    scaleAnim.stopAnimation();
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 250,
      useNativeDriver: USE_NATIVE,
    }).start();
  };

  const IconComponent = tab.icon;

  return (
    <TouchableOpacity
      style={styles.tabBtn}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={300}
      activeOpacity={1}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      {/* Tiny Simple Card sliding from button on long press */}
      <TooltipCard
        label={tab.screenName}
        isVisible={showTooltip}
        animKey={tooltipKey}
        accentColor={accentColor}
        isDark={isDark}
        topOffset={-38}
        extraOffset={tab.id === "home" ? 8 : tab.id === "stats" ? -8 : 0}
      />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={{ width: 26, height: 26 }}>
          <Animated.View style={{ position: "absolute", opacity: inactiveOpacity }}>
            <IconComponent color={isDark ? "#94A3B8" : "#64748B"} size={26} isActive={false} />
          </Animated.View>
          <Animated.View style={{ position: "absolute", opacity: activeOpacity }}>
            <IconComponent color={accentColor} size={26} isActive={true} />
          </Animated.View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AiCoachButton = ({
  tab,
  onSelectTab,
  onLongPressTab,
  accentColor = "#6236FF",
  isDark = false,
  showTooltip = false,
  tooltipKey = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
 
  // Short tap: immediate navigation without showing the card
  const handlePress = () => {
    if (onSelectTab) onSelectTab("aicoach");
  };

  // Long press: triggers the sliding screen name card for AI Coach
  const handleLongPress = () => {
    if (onLongPressTab) onLongPressTab("aicoach");
  };

  // Scale down when user clicks / presses down
  const handlePressIn = () => {
    scaleAnim.stopAnimation();
    Animated.spring(scaleAnim, {
      toValue: 0.90,
      friction: 7,
      tension: 300,
      useNativeDriver: USE_NATIVE,
    }).start();
  };

  // Scale back up when user lets go
  const handlePressOut = () => {
    scaleAnim.stopAnimation();
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 250,
      useNativeDriver: USE_NATIVE,
    }).start();
  };
 
  return (
    <View style={styles.centerSlot}>
      {/* Tiny Simple Card sliding from center AI Coach button on long press */}
      <TooltipCard
        label={tab?.screenName || "AI Coach"}
        isVisible={showTooltip}
        animKey={tooltipKey}
        accentColor={accentColor}
        isDark={isDark}
        topOffset={-72}
        extraOffset={0}
      />

      <TouchableOpacity
        style={[
          styles.floatingAiBtn,
          {
            backgroundColor: accentColor,
            shadowColor: accentColor,
            shadowOpacity: isDark ? 0.5 : 0.25,
            shadowRadius: 10,
            elevation: 6,
          },
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={300}
        activeOpacity={1}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <SparklesIcon size={26} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default function BottomNavBar({ activeTab = "home", onSelectTab }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isDark, accentColor } = useTheme();

  // Active tooltip state for sliding card on long press
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipKey, setTooltipKey] = useState(0);

  const windowWidth = Dimensions.get("window").width;
  const initialWidth = Platform.OS === "web" ? Math.min(windowWidth, 380) : windowWidth;
  const [containerWidth, setContainerWidth] = useState(initialWidth);

  const BAR_HEIGHT = 66;
  const bottomInset = Math.max(insets.bottom, 0);
  const TOTAL_HEIGHT = BAR_HEIGHT + bottomInset;

  const W = containerWidth;
  const H = TOTAL_HEIGHT;
  const cx = W / 2;

  // Bezier and Arc path creating the precise circular cutout for the floating center button
  const R = 34; // Radius of the cutout
  const pathData = `
    M 0 24
    Q 0 0, 24 0
    L ${cx - R - 12} 0
    Q ${cx - R} 0, ${cx - R} 12
    A ${R} ${R} 0 0 0 ${cx + R} 12
    Q ${cx + R} 0, ${cx + R + 12} 0
    L ${W - 24} 0
    Q ${W} 0, ${W} 24
    L ${W} ${H}
    L 0 ${H}
    Z
  `.trim().replace(/\s+/g, " ");

  const getScreenName = (tabId) => {
    switch (tabId) {
      case "home":
        return t("nav.dashboard", "Dashboard");
      case "community":
        return t("nav.community", "Community");
      case "aicoach":
        return t("nav.aiCoach", "AI Coach");
      case "study":
        return t("study.hubTitle", "Study Hub");
      case "stats":
        return t("nav.stats", "Stats");
      default:
        return "";
    }
  };

  const tabs = [
    { id: "home", icon: HomeIcon, label: t("nav.home"), screenName: getScreenName("home") },
    { id: "community", icon: CommunityIcon, label: t("nav.community"), screenName: getScreenName("community") },
    { id: "aicoach", special: true, label: t("nav.aiCoach"), screenName: getScreenName("aicoach") },
    { id: "study", icon: StudyIcon, label: t("nav.study"), screenName: getScreenName("study") },
    { id: "stats", icon: StatsIcon, label: t("nav.stats"), screenName: getScreenName("stats") },
  ];

  // Short tap: immediate navigation, dismisses any active tooltip
  const handleTabPress = (tabId) => {
    setActiveTooltip(null);
    if (onSelectTab) onSelectTab(tabId);
  };

  // Long press: triggers the tiny simple card to slide up from the button
  const handleTabLongPress = (tabId) => {
    setActiveTooltip(tabId);
    setTooltipKey((prev) => prev + 1);
  };

  return (
    <View style={styles.outerWrapper}>
      <View
        style={[styles.navContainer, { height: TOTAL_HEIGHT }]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && w !== containerWidth) setContainerWidth(w);
        }}
      >
        {/* SVG Curved Background with Notch - extended all the way to screen bottom */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Path
              d={pathData}
              fill={isDark ? "#0F172A" : "#FFFFFF"}
              stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}
              strokeWidth="1"
            />
          </Svg>
        </View>

        {/* Tab Items Row - fixed at the top of the bar */}
        <View style={[styles.tabsRow, { height: BAR_HEIGHT }]}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const showTooltip = activeTooltip === tab.id;

            if (tab.special) {
              return (
                <AiCoachButton
                  key={tab.id}
                  tab={tab}
                  onSelectTab={handleTabPress}
                  onLongPressTab={handleTabLongPress}
                  accentColor={accentColor}
                  isDark={isDark}
                  showTooltip={showTooltip}
                  tooltipKey={tooltipKey}
                />
              );
            }

            return (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={isActive}
                accentColor={accentColor}
                isDark={isDark}
                showTooltip={showTooltip}
                tooltipKey={tooltipKey}
                onSelectTab={handleTabPress}
                onLongPressTab={handleTabLongPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1000,
    overflow: "visible",
  },
  navContainer: {
    width: "100%",
    position: "relative",
    overflow: "visible",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 8,
    overflow: "visible",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 54,
    position: "relative",
    overflow: "visible",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    letterSpacing: -0.2,
  },

  centerSlot: {
    width: 66,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 54,
    position: "relative",
    overflow: "visible",
  },
  floatingAiBtn: {
    position: "absolute",
    top: -27, // Places the center of the button exactly at y=12 (center of the cutout arc)
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#6236FF",
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Tiny Simple Card Styles ───────────────────────────────────────────────
  tooltipWrapper: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  tooltipCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 12,
    minHeight: 27,
    zIndex: 2,
  },
  tooltipCardLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipCardDark: {
    backgroundColor: "#1E293B",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  tooltipText: {
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  tooltipTextLight: {
    color: "#0F172A",
  },
  tooltipTextDark: {
    color: "#F8FAFC",
  },
  tooltipBeak: {
    width: 8,
    height: 8,
    transform: [{ rotate: "45deg" }],
    marginTop: -4,
    zIndex: 1,
  },
  tooltipBeakLight: {
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  tooltipBeakDark: {
    backgroundColor: "#1E293B",
  },
});
