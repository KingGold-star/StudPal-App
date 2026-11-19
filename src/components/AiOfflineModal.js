// src/components/AiOfflineModal.js
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';

function WifiOffIcon({ size = 28, color = '#EF4444' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="1" y1="1" x2="23" y2="23" />
      <Path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <Path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <Path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <Path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <Circle cx="12" cy="20" r="1" fill={color} />
    </Svg>
  );
}

function BookOpenIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Svg>
  );
}

export default function AiOfflineModal({
  visible,
  onClose,
  onGoToOfflineStudy,
  featureName = 'Nia AI Coach',
}) {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
          {/* Header Icon Badge */}
          <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2' }]}>
            <Text style={{ fontSize: 26 }}>🌐</Text>
          </View>

          {/* Status Tag */}
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>INTERNET REQUIRED FOR AI</Text>
          </View>

          {/* Title & Description */}
          <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {featureName} is Online Only
          </Text>

          <Text style={[styles.bodyText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            AI intelligence models require an active internet connection to generate custom answers, explanations, and quiz recommendations.
          </Text>

          {/* Highlights Box: Offline tools available */}
          <View style={[styles.offlineHighlightBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
            <Text style={[styles.offlineHighlightTitle, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
              ✨ Working 100% Offline:
            </Text>
            <Text style={[styles.offlineHighlightItem, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              • Spaced Repetition & Flashcards
            </Text>
            <Text style={[styles.offlineHighlightItem, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              • Practice Quizzes & Scoring
            </Text>
            <Text style={[styles.offlineHighlightItem, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              • Focus Timer & Pomodoro
            </Text>
            <Text style={[styles.offlineHighlightItem, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              • Study Notes & Formulas
            </Text>
            <Text style={[styles.offlineHighlightItem, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              • Study Timetable & Schedule
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonCol}>
            {onGoToOfflineStudy && (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  onClose();
                  onGoToOfflineStudy();
                }}
                activeOpacity={0.88}
              >
                <BookOpenIcon size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Study Offline (Flashcards & Quizzes)</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: isDark ? '#475569' : '#CBD5E1' }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryBtnText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 390,
    borderRadius: 24,
    borderWidth: 1.2,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 10,
  },
  tagPillText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 14,
  },
  offlineHighlightBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 18,
    gap: 4,
  },
  offlineHighlightTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  offlineHighlightItem: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
  },
  buttonCol: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    borderWidth: 1,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
