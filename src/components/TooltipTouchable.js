import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Platform } from 'react-native';
import { useTooltip } from '../context/TooltipContext';

const USE_NATIVE = Platform.OS !== 'web';

// Extract readable text from React children tree if string or Text element
function extractText(children) {
  if (!children) return null;
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    for (const child of children) {
      const text = extractText(child);
      if (text) return text;
    }
  }
  if (React.isValidElement(children)) {
    if (children.props?.children) {
      return extractText(children.props.children);
    }
  }
  return null;
}

// Click pop animation helper
function playClickPop(animValue) {
  if (!animValue) return;
  animValue.stopAnimation();
  animValue.setValue(1);
  Animated.sequence([
    Animated.timing(animValue, {
      toValue: 1.05,
      duration: 90,
      useNativeDriver: USE_NATIVE,
    }),
    Animated.timing(animValue, {
      toValue: 1,
      duration: 110,
      useNativeDriver: USE_NATIVE,
    }),
  ]).start();
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * TooltipTouchable
 * Universal interactive button component with tactile scale-down on click/press
 * and spring-back on release, plus optional sliding tooltip card on long-press.
 */
export default function TooltipTouchable({
  children,
  tooltip,
  title,
  label,
  accessibilityLabel,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  delayLongPress = 300,
  style,
  activeOpacity = 0.82,
  disableTooltip = false,
  activeScale = 0.92,
  ...restProps
}) {
  const { showTooltip, hideTooltip } = useTooltip();
  const touchableRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Scale down when user clicks / presses down
  const handlePressIn = (e) => {
    scaleAnim.stopAnimation();
    Animated.spring(scaleAnim, {
      toValue: activeScale,
      friction: 6,
      tension: 320,
      useNativeDriver: USE_NATIVE,
    }).start();
    if (onPressIn) onPressIn(e);
  };

  // Scale back up to 1.0 and bounce back when user lets go / releases
  const handlePressOut = (e) => {
    scaleAnim.stopAnimation();
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 280,
      useNativeDriver: USE_NATIVE,
    }).start();
    if (onPressOut) onPressOut(e);
  };

  const handlePress = (e) => {
    if (hideTooltip) hideTooltip();
    if (onPress) onPress(e);
  };

  const handleLongPress = (e) => {
    if (!disableTooltip) {
      const tooltipText =
        tooltip ||
        title ||
        label ||
        accessibilityLabel ||
        extractText(children);

      if (tooltipText && showTooltip && touchableRef.current) {
        const raw = touchableRef.current;
        const node = raw?.getNode ? raw.getNode() : (raw?._touchableNode || raw);

        if (Platform.OS === 'web') {
          // On Web, getBoundingClientRect gives exact viewport coordinates
          if (node && typeof node.getBoundingClientRect === 'function') {
            const rect = node.getBoundingClientRect();
            showTooltip(tooltipText, {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
            });
          } else if (node && typeof node.measureInWindow === 'function') {
            node.measureInWindow((x, y, width, height) => {
              showTooltip(tooltipText, { x, y, width, height });
            });
          }
        } else {
          // On Native (iOS / Android), measureInWindow gives exact screen coordinates
          if (node && typeof node.measureInWindow === 'function') {
            node.measureInWindow((x, y, width, height) => {
              showTooltip(tooltipText, { x, y, width, height });
            });
          } else if (node && typeof node.measure === 'function') {
            node.measure((x, y, width, height, pageX, pageY) => {
              showTooltip(tooltipText, { x: pageX, y: pageY, width, height });
            });
          }
        }
      }
    }

    if (onLongPress) {
      onLongPress(e);
    }
  };

  return (
    <AnimatedTouchable
      ref={touchableRef}
      style={[style, { transform: [{ scale: scaleAnim }] }]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={delayLongPress}
      activeOpacity={activeOpacity}
      accessibilityLabel={accessibilityLabel || tooltip || title}
      {...restProps}
    >
      {children}
    </AnimatedTouchable>
  );
}
