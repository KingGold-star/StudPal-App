import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated, Platform } from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { settingsService } from "../services/settings/settingsService";

// On web, useNativeDriver doesn't support transform — must use JS driver
const USE_NATIVE = Platform.OS !== "web";

// ─── SVG Icons matching user reference design ────────────────────────────────
const HomeIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 10.5L12 3l9 7.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
    <Path d="M9 21.5v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" fill={isActive ? "#FFFFFF" : "none"} />
  </Svg>
);

const SubjectsIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill={isActive ? color : "none"} />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={isActive ? color : "none"} />
    <Path d="M9 7h6" stroke={isActive ? "#FFFFFF" : color} strokeWidth={isActive ? "2.5" : "2"} />
    <Path d="M9 11h4" stroke={isActive ? "#FFFFFF" : color} strokeWidth={isActive ? "2.5" : "2"} />
  </Svg>
);

const StudyIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    {isActive && <Path d="M12 7v14" stroke="#FFFFFF" strokeWidth="2" />}
  </Svg>
);

const ProfileIcon = ({ color, size = 24, isActive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth={isActive ? "2.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="7" r="4" />
    <Path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
  </Svg>
);

const SparklesIcon = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFFFF">
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

const TabItem = ({ tab, isActive, onSelectTab, accentColor = "#6236FF" }) => {
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

  // Click handler: always fires the pop, even if already active
  const handlePress = () => {
    playClickPop(scaleAnim);
    if (onSelectTab) onSelectTab(tab.id);
  };

  const IconComponent = tab.icon;

  return (
    <TouchableOpacity
      style={styles.tabBtn}
      onPress={handlePress}
      activeOpacity={1}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={{ width: 26, height: 26 }}>
          <Animated.View style={{ position: "absolute", opacity: inactiveOpacity }}>
            <IconComponent color="#64748B" size={26} isActive={false} />
          </Animated.View>
          <Animated.View style={{ position: "absolute", opacity: activeOpacity }}>
            <IconComponent color={accentColor} size={26} isActive={true} />
          </Animated.View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AiCoachButton = ({ onSelectTab, accentColor = "#6236FF" }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    playClickPop(scaleAnim);
    if (onSelectTab) onSelectTab("aicoach");
  };

  return (
    <View style={styles.centerSlot}>
      <TouchableOpacity
        style={[styles.floatingAiBtn, { backgroundColor: accentColor }]}
        onPress={handlePress}
        activeOpacity={1}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <SparklesIcon size={26} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default function BottomNavBar({ activeTab = "home", onSelectTab }) {
  const insets = useSafeAreaInsets();
  const [currentSettings, setCurrentSettings] = useState(settingsService.getSettingsSync());

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setCurrentSettings(s));
    return () => unsub();
  }, []);

  const accentColor = currentSettings?.accentColor || "#6236FF";
  const isDark = currentSettings?.theme === "dark";

  const windowWidth = Dimensions.get("window").width;
  const [containerWidth, setContainerWidth] = useState(windowWidth);

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

  const tabs = [
    { id: "home", icon: HomeIcon, label: "Home" },
    { id: "subjects", icon: SubjectsIcon, label: "Subjects" },
    { id: "aicoach", special: true },
    { id: "study", icon: StudyIcon, label: "Study" },
    { id: "profile", icon: ProfileIcon, label: "Profile" },
  ];

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
            <Path d={pathData} fill={isDark ? "#1E293B" : "#E2E8F0"} />
          </Svg>
        </View>

        {/* Tab Items Row - fixed at the top of the bar */}
        <View style={[styles.tabsRow, { height: BAR_HEIGHT }]}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            if (tab.special) {
              return <AiCoachButton key={tab.id} onSelectTab={onSelectTab} accentColor={accentColor} />;
            }

            return (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={isActive}
                accentColor={accentColor}
                onSelectTab={onSelectTab}
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
  },
  navContainer: {
    width: "100%",
    position: "relative",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 54,
  },
  tabLabel: {
    fontSize: 12,
    letterSpacing: -0.2,
  },

  centerSlot: {
    width: 66,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 54,
    position: "relative",
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
});
