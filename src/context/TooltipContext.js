import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Platform } from 'react-native';
import { useTheme } from '../theme/themeContext';

const USE_NATIVE = Platform.OS !== 'web';

const TooltipContext = createContext({
  showTooltip: () => {},
  hideTooltip: () => {},
});

export function useTooltip() {
  return useContext(TooltipContext);
}

// ─── Global Tooltip Overlay (Floats above all screens, modals & tabs) ────────
function TooltipOverlay({ tooltipState, onDismiss }) {
  const { isDark, accentColor } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const timerRef = useRef(null);

  const { visible, text, layout, isTopEdge, key } = tooltipState;

  useEffect(() => {
    if (!visible) {
      slideAnim.stopAnimation();
      opacityAnim.stopAnimation();
      scaleAnim.stopAnimation();
      opacityAnim.setValue(0);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    slideAnim.stopAnimation();
    opacityAnim.stopAnimation();
    scaleAnim.stopAnimation();

    // Start position: emerging from the button (low if above button, high if below button)
    slideAnim.setValue(isTopEdge ? -16 : 18);
    opacityAnim.setValue(0);
    scaleAnim.setValue(0.85);

    // Slide smoothly into place with spring
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

    // Auto-dismiss after 1900ms: glides slightly and fades away
    timerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: isTopEdge ? 8 : -8,
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
      ]).start(() => {
        if (onDismiss) onDismiss();
      });
    }, 1900);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [key, visible]);

  if (!visible || !layout || !text) return null;

  const windowW = Dimensions.get('window').width;
  const buttonCenterX = layout.x + layout.width / 2;
  const safeCenterX = Math.max(16, Math.min(windowW - 16, buttonCenterX));

  // If button is near top of screen (y < 60), place card below button; else above
  const cardTop = isTopEdge
    ? Math.max(10, layout.y + layout.height + 8)
    : Math.max(10, layout.y - 38);

  return (
    <View style={styles.overlayRoot} pointerEvents="none">
      <Animated.View
        style={[
          styles.overlayTrack,
          {
            top: cardTop,
            left: safeCenterX - 150,
            width: 300,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        {isTopEdge && (
          <View
            style={[
              styles.tooltipBeakTop,
              isDark ? styles.tooltipBeakDark : styles.tooltipBeakLight,
            ]}
          />
        )}

        <View
          style={[
            styles.tooltipCard,
            isDark ? styles.tooltipCardDark : styles.tooltipCardLight,
          ]}
        >
          <View style={[styles.tooltipDot, { backgroundColor: accentColor || '#2D62FF' }]} />
          <Text
            style={[
              styles.tooltipText,
              isDark ? styles.tooltipTextDark : styles.tooltipTextLight,
            ]}
            numberOfLines={1}
          >
            {text}
          </Text>
        </View>

        {!isTopEdge && (
          <View
            style={[
              styles.tooltipBeakBottom,
              isDark ? styles.tooltipBeakDark : styles.tooltipBeakLight,
            ]}
          />
        )}
      </Animated.View>
    </View>
  );
}

export function TooltipProvider({ children }) {
  const [tooltipState, setTooltipState] = useState({
    visible: false,
    text: '',
    layout: null,
    isTopEdge: false,
    key: 0,
  });

  const showTooltip = useCallback((text, layout) => {
    if (!text || !layout) return;
    const isTopEdge = layout.y < 60;
    setTooltipState({
      visible: true,
      text,
      layout,
      isTopEdge,
      key: Date.now(),
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }, []);

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      <View style={{ flex: 1 }} pointerEvents="box-none">
        {children}
        <TooltipOverlay tooltipState={tooltipState} onDismiss={hideTooltip} />
      </View>
    </TooltipContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    ...(Platform.OS === 'web' ? { position: 'fixed' } : {}),
    zIndex: 999999,
  },
  overlayTrack: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 27,
    zIndex: 2,
  },
  tooltipCardLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipCardDark: {
    backgroundColor: '#1E293B',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
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
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tooltipTextLight: {
    color: '#0F172A',
  },
  tooltipTextDark: {
    color: '#F8FAFC',
  },
  tooltipBeakBottom: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
    zIndex: 1,
  },
  tooltipBeakTop: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
    marginBottom: -4,
    zIndex: 1,
  },
  tooltipBeakLight: {
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  tooltipBeakDark: {
    backgroundColor: '#1E293B',
  },
});
