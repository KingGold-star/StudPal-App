import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Clipboard,
  Image,
} from 'react-native';
import Svg, { Path, Line, Rect, Polyline } from 'react-native-svg';
import TooltipTouchable from './TooltipTouchable';

// ── Minimalist SVG Icons ────────────────────────────────────────────────────

const SparklesIcon = ({ color = '#FFFFFF', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const SpeakerIcon = ({ color = '#334155', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </Svg>
);

const PlayingWaveIcon = ({ color = '#FFFFFF', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <Line x1="4" y1="8" x2="4" y2="16" />
    <Line x1="9" y1="4" x2="9" y2="20" />
    <Line x1="15" y1="6" x2="15" y2="18" />
    <Line x1="20" y1="9" x2="20" y2="15" />
  </Svg>
);

const StopIcon = ({ color = '#FFFFFF', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="4" y="4" width="16" height="16" rx="2" fill={color} />
  </Svg>
);

const CopyIcon = ({ color = '#334155', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="9" y="9" width="13" height="13" rx="2" />
    <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Svg>
);

const CheckIcon = ({ color = '#10B981', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const BookmarkIcon = ({ color = '#334155', size = 16, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const NoteIcon = ({ color = '#334155', size = 16, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill={filled ? color + '33' : 'none'} />
    <Path d="M14 2v6h6" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
  </Svg>
);

const ThumbUpIcon = ({ color = '#64748B', size = 15, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </Svg>
);

const ThumbDownIcon = ({ color = '#64748B', size = 15, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
  </Svg>
);

const BranchIcon = ({ color = '#64748B', size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="4" y1="12" x2="9" y2="12" />
    <Path d="M9 12c3.5 0 5.5-6.5 8.5-6.5" />
    <Polyline points="14 5 18 5 18 9" />
    <Path d="M9 12c3.5 0 5.5 6.5 8.5 6.5" />
    <Polyline points="14 19 18 19 18 15" />
  </Svg>
);

const LayersIcon = ({ color = '#64748B', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </Svg>
);

const ChevronDownIcon = ({ color = '#64748B', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

const ChevronUpIcon = ({ color = '#64748B', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 15l-6-6-6 6" />
  </Svg>
);

// ── Mathematical Formatter ──────────────────────────────────────────────────

export function formatMathExpression(latex) {
  if (!latex) return '';
  let str = latex;
  str = str.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)');
  str = str.replace(/\\lim_\{([^}]+)\}/g, 'lim($1)');
  str = str.replace(/\\to/g, '→');
  str = str.replace(/\\rightarrow/g, '→');
  str = str.replace(/\\leftarrow/g, '←');
  str = str.replace(/\\int/g, '∫');
  str = str.replace(/\\mathcal\{E\}/g, 'ℰ');
  str = str.replace(/\\Phi_B/g, 'Φ_B');
  str = str.replace(/\\Phi/g, 'Φ');
  str = str.replace(/\\phi/g, 'φ');
  str = str.replace(/\\theta/g, 'θ');
  str = str.replace(/\\pi/g, 'π');
  str = str.replace(/\\alpha/g, 'α');
  str = str.replace(/\\beta/g, 'β');
  str = str.replace(/\\gamma/g, 'γ');
  str = str.replace(/\\delta/g, 'δ');
  str = str.replace(/\\Delta/g, 'Δ');
  str = str.replace(/\\sigma/g, 'σ');
  str = str.replace(/\\omega/g, 'ω');
  str = str.replace(/\\Omega/g, 'Ω');
  str = str.replace(/\\text\{([^}]+)\}/g, '$1');
  str = str.replace(/\\,/g, ' ');
  str = str.replace(/\\\s*/g, '');
  str = str.replace(/\^\{([^}]+)\}/g, '^($1)');
  str = str.replace(/\^-/g, '⁻');
  str = str.replace(/\^\+/g, '⁺');
  str = str.replace(/\^2/g, '²');
  str = str.replace(/\^3/g, '³');
  str = str.replace(/\^n/g, 'ⁿ');
  str = str.replace(/_\{([^}]+)\}/g, '_$1');
  return str.trim();
}

// ── Ultra-Clean Industry-Grade AI Message Card ──────────────────────────────

const AiMessageCard = ({
  item,
  isDark = true,
  accentColor = '#2D62FF',
  isExpanded = false,
  toggleSteps,
  isAudioPlaying = false,
  handleToggleListen,
  isSavedSrs = false,
  handleSaveToSrs,
  isSavedNote = false,
  handleSaveNote,
  userFeedback = null,
  handleFeedback,
  handleBranchConversation,
  t,
}) => {
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Clean raw prepended voice note string if present
  const cleanBodyText = (item.text || '')
    .replace(/^🎙️[^\n]+\n\n?/, '')
    .trim();

  const formattedFormula = item.latexFormula ? formatMathExpression(item.latexFormula) : null;

  const handleCopyMessage = () => {
    try {
      const fullContent = `${cleanBodyText}\n${formattedFormula ? `\nFormula: ${formattedFormula}` : ''}`;
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(fullContent);
      } else if (Clipboard?.setString) {
        Clipboard.setString(fullContent);
      }
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 1800);
    } catch (e) {}
  };

  return (
    <View style={styles.aiBubbleWrapper}>
      {/* ── Left Minimalist Avatar ── */}
      <View style={styles.aiAvatarBox}>
        <Image
          source={require('../../assets/images/ai_avatar.png')}
          style={styles.aiAvatarImage}
          resizeMode="contain"
        />
      </View>

      {/* ── Main Message Body (Backgroundless, Direct & Airy) ── */}
      <View style={styles.aiBubbleCard}>
        {/* ── Body Text (Clean, High-Legibility) ── */}
        <Text style={[styles.aiText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          {cleanBodyText}
        </Text>

        {/* ── Minimalist Math Block (Formula Callout Card) ── */}
        {formattedFormula ? (
          <View
            style={[
              styles.minimalMathBlock,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <View style={styles.formulaHeaderRow}>
              <View style={[styles.formulaLabelBadge, { backgroundColor: (accentColor || '#6366F1') + '15' }]}>
                <Text style={[styles.formulaLabelText, { color: accentColor || '#6366F1' }]}>
                  KEY FORMULA
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.mathFormulaText,
                { color: isDark ? '#E2E8F0' : '#1E293B' },
              ]}
              selectable={true}
            >
              {formattedFormula}
            </Text>
          </View>
        ) : null}

        {/* ── Seamless Step-by-Step Breakdown Accordion ── */}
        {item.steps && item.steps.length > 0 ? (
          <View
            style={[
              styles.cleanAccordion,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.025)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSteps(item.id)}
              activeOpacity={0.75}
            >
              <View style={styles.accordionHeaderLeft}>
                <LayersIcon color={accentColor || '#6366F1'} size={14} />
                <Text style={[styles.accordionTitle, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  {isExpanded ? 'Hide Breakdown' : 'Step-by-Step Breakdown'}
                </Text>
              </View>

              <View style={styles.accordionHeaderRight}>
                <View style={[styles.stepCountBadge, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]}>
                  <Text style={[styles.stepCountText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {item.steps.length} {item.steps.length === 1 ? 'Step' : 'Steps'}
                  </Text>
                </View>
                {isExpanded ? (
                  <ChevronUpIcon color={isDark ? '#94A3B8' : '#64748B'} size={14} />
                ) : (
                  <ChevronDownIcon color={isDark ? '#94A3B8' : '#64748B'} size={14} />
                )}
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.accordionBody}>
                {item.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepItemRow}>
                    <View style={[styles.stepNumberBadge, { backgroundColor: (accentColor || '#6366F1') + '18' }]}>
                      <Text style={[styles.stepNumber, { color: accentColor || '#6366F1' }]}>
                        {step.number || `0${idx + 1}`}
                      </Text>
                    </View>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={[styles.stepItemTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                        {step.title}
                      </Text>
                      <Text style={[styles.stepItemContent, { color: isDark ? '#94A3B8' : '#475569' }]}>
                        {step.content}
                      </Text>
                    </View>
                  </View>
                ))}

                {item.example && (
                  <View
                    style={[
                      styles.tipCallout,
                      {
                        backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : '#FFFBEB',
                        borderLeftColor: '#F59E0B',
                        borderColor: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FEF3C7',
                      },
                    ]}
                  >
                    <Text style={[styles.tipText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
                      <Text style={{ fontWeight: '700' }}>💡 Pro Tip: </Text>
                      {item.example}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : null}

        {/* ── High-Visibility Action Toolbar ── */}
        <View style={styles.ghostActionBar}>
          <View style={styles.ghostActionsLeft}>
            {/* Audio Toggle (Listen with AI voice) */}
            <TooltipTouchable
              tooltip={isAudioPlaying ? 'Stop audio playback' : 'Read aloud with AI voice'}
              style={[
                styles.actionIconBtn,
                isAudioPlaying && {
                  backgroundColor: accentColor || '#6236FF',
                  borderRadius: 6,
                },
              ]}
              onPress={() => handleToggleListen(item.id, item)}
              activeScale={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isAudioPlaying ? (
                <PlayingWaveIcon color="#FFFFFF" size={14} />
              ) : (
                <SpeakerIcon color={isDark ? '#94A3B8' : '#64748B'} size={15} />
              )}
            </TooltipTouchable>

            {/* Copy Action */}
            <TooltipTouchable
              tooltip={copiedMessage ? 'Copied to clipboard!' : 'Copy response to clipboard'}
              style={[
                styles.actionIconBtn,
                copiedMessage && {
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: 6,
                },
              ]}
              onPress={handleCopyMessage}
              activeScale={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {copiedMessage ? (
                <CheckIcon color="#10B981" size={15} />
              ) : (
                <CopyIcon color={isDark ? '#94A3B8' : '#64748B'} size={15} />
              )}
            </TooltipTouchable>

            {/* Save Study Note */}
            <TooltipTouchable
              tooltip={isSavedNote ? 'Saved to Study Notes' : 'Save question & explanation to Study Notes'}
              style={[
                styles.actionIconBtn,
                isSavedNote && {
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  borderRadius: 6,
                },
              ]}
              onPress={() => handleSaveNote(item.id, item)}
              activeScale={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <NoteIcon
                color={isSavedNote ? '#3B82F6' : isDark ? '#94A3B8' : '#64748B'}
                size={15}
                filled={isSavedNote}
              />
            </TooltipTouchable>

            {/* Like Response */}
            <TooltipTouchable
              tooltip={userFeedback === 'like' ? 'Liked response' : 'Good response (Like)'}
              style={[
                styles.actionIconBtn,
                userFeedback === 'like' && {
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  borderRadius: 6,
                },
              ]}
              onPress={() => handleFeedback && handleFeedback(item.id, 'like')}
              activeScale={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ThumbUpIcon
                color={userFeedback === 'like' ? (accentColor || '#6366F1') : isDark ? '#94A3B8' : '#64748B'}
                size={14}
                filled={userFeedback === 'like'}
              />
            </TooltipTouchable>

            {/* Dislike Response */}
            <TooltipTouchable
              tooltip={userFeedback === 'dislike' ? 'Disliked response' : 'Bad response (Dislike)'}
              style={[
                styles.actionIconBtn,
                userFeedback === 'dislike' && {
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  borderRadius: 6,
                },
              ]}
              onPress={() => handleFeedback && handleFeedback(item.id, 'dislike')}
              activeScale={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ThumbDownIcon
                color={userFeedback === 'dislike' ? '#EF4444' : isDark ? '#94A3B8' : '#64748B'}
                size={14}
                filled={userFeedback === 'dislike'}
              />
            </TooltipTouchable>

            {/* Branch Out to New Chat */}
            <TooltipTouchable
              tooltip="Branch to new chat"
              style={styles.actionIconBtn}
              onPress={() => handleBranchConversation && handleBranchConversation(item.id, item)}
              activeScale={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <BranchIcon color={isDark ? '#94A3B8' : '#64748B'} size={15} />
            </TooltipTouchable>
          </View>

          {/* Timestamp */}
          <Text style={[styles.timestampText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aiBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    marginHorizontal: 12,
    gap: 12,
  },
  aiAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    overflow: 'hidden',
  },
  aiAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  aiBubbleCard: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 2,
    borderWidth: 0,
    gap: 12,
  },
  aiText: {
    fontSize: 15.5,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: -0.1,
  },

  // ── Minimalist Math Block (Formula Callout Card) ──
  minimalMathBlock: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 2,
    gap: 6,
  },
  formulaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formulaLabelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  formulaLabelText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  mathFormulaText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.2,
  },

  // ── Clean Accordion ──
  cleanAccordion: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accordionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  stepCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepCountText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  accordionBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 10,
  },
  stepItemRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumber: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  stepItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  stepItemContent: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  tipCallout: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderWidth: 1,
    marginTop: 2,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 17,
  },

  // ── High-Visibility Action Toolbar ──
  ghostActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    marginTop: 2,
  },
  ghostActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease',
      },
    }),
  },
  timestampText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default AiMessageCard;
