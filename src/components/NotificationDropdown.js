// src/components/NotificationDropdown.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/themeContext';
import { notificationService } from '../services/notifications/notificationService';

const USE_NATIVE = Platform.OS !== 'web';

// ─── Minimalist SVG Icons ───────────────────────────────────────────────────
const SrsIcon = ({ size = 15, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Svg>
);

const TrophyIcon = ({ size = 15, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
    <Path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
    <Path d="M4 3h16v7a8 8 0 0 1-16 0V3z" />
    <Path d="M12 15v5" />
    <Path d="M8 21h8" />
  </Svg>
);

const AiSparklesIcon = ({ size = 15, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
  </Svg>
);

const StreakFireIcon = ({ size = 15, color = '#F97316' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Svg>
);

export default function NotificationDropdown({
  visible = false,
  onClose,
  onNavigate,
}) {
  const insets = useSafeAreaInsets();
  const { isDark, accentColor } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsub = notificationService.subscribe((state) => {
      setNotifications(state.notifications);
      setUnreadCount(state.unreadCount);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (visible) {
      animValue.setValue(0);
      Animated.spring(animValue, {
        toValue: 1,
        tension: 200,
        friction: 16,
        useNativeDriver: USE_NATIVE,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: USE_NATIVE,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const handleItemPress = async (item) => {
    if (!item.read) {
      await notificationService.markAsRead(item.id);
    }
    if (item.action && onNavigate) {
      onClose();
      onNavigate(item.action.route, item.action.params);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
  };

  const handleClearAll = async () => {
    await notificationService.clearAll();
  };

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });

  const topOffset = Platform.OS === 'web' ? insets.top + 54 : insets.top + 52;
  const screenWidth = Dimensions.get('window').width;
  const dropdownWidth = Math.min(screenWidth - 32, 336);

  const getIconForType = (type) => {
    switch (type) {
      case 'srs':
        return (
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.14)' : '#EFF6FF' }]}>
            <SrsIcon size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
          </View>
        );
      case 'achievement':
        return (
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.14)' : '#FEF3C7' }]}>
            <TrophyIcon size={14} color={isDark ? '#FBBF24' : '#D97706'} />
          </View>
        );
      case 'ai':
        return (
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.14)' : '#F5F3FF' }]}>
            <AiSparklesIcon size={14} color={isDark ? '#A78BFA' : '#7C3AED'} />
          </View>
        );
      case 'streak':
      default:
        return (
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(249, 115, 22, 0.14)' : '#FFF7ED' }]}>
            <StreakFireIcon size={14} color={isDark ? '#FB923C' : '#EA580C'} />
          </View>
        );
    }
  };

  return (
    <View style={styles.overlayContainer} pointerEvents="box-none">
      {/* Outside click backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Floating Dropdown Card */}
      <Animated.View
        style={[
          styles.dropdownCard,
          {
            top: topOffset,
            width: dropdownWidth,
            transform: [{ translateY }, { scale }],
            opacity,
          },
          isDark ? styles.dropdownDark : styles.dropdownLight,
        ]}
      >
        {/* Upward pointer beak */}
        <View style={[styles.beak, isDark ? styles.beakDark : styles.beakLight]} />

        {/* ─── Clean Header: Title & Mark Read ─── */}
        <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          <View style={styles.headerTitleRow}>
            <Text style={[styles.headerTitle, isDark ? styles.headerTitleDark : styles.headerTitleLight]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(45, 98, 255, 0.2)' : '#EFF6FF' }]}>
                <Text style={[styles.countBadgeText, { color: accentColor || '#2D62FF' }]}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllRead}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.markReadText, { color: accentColor || '#2D62FF' }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Streamlined List (No Nested Boxes) ─── */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, isDark && { color: '#F8FAFC' }]}>
                All caught up
              </Text>
              <Text style={[styles.emptySub, isDark && { color: '#64748B' }]}>
                No notifications right now. Keep up the great work!
              </Text>
            </View>
          ) : (
            notifications.map((item, idx) => {
              const isLast = idx === notifications.length - 1;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.row,
                    !isLast && (isDark ? styles.rowBorderDark : styles.rowBorderLight),
                    !item.read && (isDark ? styles.rowUnreadDark : styles.rowUnreadLight),
                  ]}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.65}
                >
                  {/* Left Minimal Icon */}
                  {getIconForType(item.type)}

                  {/* Middle Content */}
                  <View style={styles.rowBody}>
                    <View style={styles.rowTopLine}>
                      <Text
                        style={[
                          styles.rowTitle,
                          isDark
                            ? (!item.read ? styles.rowTitleUnreadDark : styles.rowTitleDark)
                            : (!item.read ? styles.rowTitleUnreadLight : styles.rowTitleLight),
                        ]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>

                      <View style={styles.rowMetaRight}>
                        <Text style={[styles.rowTime, isDark && { color: '#64748B' }]}>
                          {item.time}
                        </Text>
                        {!item.read && (
                          <View style={[styles.unreadDot, { backgroundColor: accentColor || '#2D62FF' }]} />
                        )}
                      </View>
                    </View>

                    <Text
                      style={[styles.rowMessage, isDark ? styles.rowMessageDark : styles.rowMessageLight]}
                      numberOfLines={2}
                    >
                      {item.message}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* ─── Minimal Footer ─── */}
        {notifications.length > 0 && (
          <View style={[styles.footer, isDark ? styles.footerDark : styles.footerLight]}>
            <TouchableOpacity
              onPress={handleClearAll}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            >
              <Text style={[styles.footerText, isDark && { color: '#64748B' }]}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    elevation: 99999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  dropdownCard: {
    position: 'absolute',
    right: 16,
    maxHeight: 460,
    borderRadius: 18,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 20,
    zIndex: 9999,
  },
  dropdownLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownDark: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
  },
  beak: {
    position: 'absolute',
    top: -6,
    right: 22,
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    zIndex: 1,
  },
  beakLight: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#E2E8F0',
  },
  beakDark: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  headerLight: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  headerDark: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerTitleLight: {
    color: '#0F172A',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    maxHeight: 340,
  },
  listContent: {
    paddingVertical: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rowBorderLight: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  rowBorderDark: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowUnreadLight: {
    backgroundColor: 'rgba(45, 98, 255, 0.02)',
  },
  rowUnreadDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  rowTitleLight: {
    color: '#64748B',
    fontWeight: '500',
  },
  rowTitleDark: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  rowTitleUnreadLight: {
    color: '#0F172A',
    fontWeight: '700',
  },
  rowTitleUnreadDark: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  rowMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  rowMessage: {
    fontSize: 12,
    lineHeight: 16.5,
  },
  rowMessageLight: {
    color: '#64748B',
  },
  rowMessageDark: {
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLight: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1F5F9',
  },
  footerDark: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#94A3B8',
  },
});
