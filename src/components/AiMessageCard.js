import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Clipboard,
  Image,
  ActivityIndicator,
  ScrollView,
  Animated,
  UIManager,
  LayoutAnimation,
  Linking,
} from 'react-native';
import Svg, { Path, Line, Rect, Polyline, Circle } from 'react-native-svg';
import TooltipTouchable from './TooltipTouchable';
import { fishAudioPlaybackService } from '../services/ai/fishAudioPlaybackService';

const USE_NATIVE = Platform.OS !== 'web';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  try {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } catch (e) {}
}

// ── Minimalist SVG Icons ────────────────────────────────────────────────────

const GlobeIcon = ({ color = '#3B82F6', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const ExternalLinkIcon = ({ color = '#64748B', size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <Polyline points="15 3 21 3 21 9" />
    <Line x1="10" y1="14" x2="21" y2="3" />
  </Svg>
);

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

// ── Collapsible Thought Process (ChatGPT / Gemini style) ────────────────────
const ThoughtProcessCard = ({ thought, isDark, accentColor }) => {
  const [expanded, setExpanded] = useState(false);

  if (!thought || typeof thought !== 'string' || thought.trim().length === 0) {
    return null;
  }

  const cleanThought = thought.trim();

  return (
    <View
      style={[
        styles.thoughtCardContainer,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      <TouchableOpacity
        style={styles.thoughtHeaderBtn}
        onPress={() => {
          if (Platform.OS !== 'web' && LayoutAnimation?.configureNext) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          }
          setExpanded((prev) => !prev);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.thoughtHeaderLeft}>
          <Text style={styles.thoughtIcon}>💭</Text>
          <Text style={[styles.thoughtTitleText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Thought Process
          </Text>
        </View>
        <View style={styles.thoughtChevronBox}>
          {expanded ? (
            <ChevronUpIcon color={isDark ? '#94A3B8' : '#64748B'} size={14} />
          ) : (
            <ChevronDownIcon color={isDark ? '#94A3B8' : '#64748B'} size={14} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.thoughtBodyBox, { borderLeftColor: accentColor || '#6366F1' }]}>
          <Text
            style={[
              styles.thoughtBodyText,
              { color: isDark ? '#CBD5E1' : '#475569' },
            ]}
            selectable={true}
          >
            {cleanThought}
          </Text>
        </View>
      )}
    </View>
  );
};

// ── Source Citations & References Panel ──────────────────────────────────
const SourceCitationsCard = ({ citations, isDark, accentColor }) => {
  if (!Array.isArray(citations) || citations.length === 0) return null;

  return (
    <View
      style={[
        styles.citationsContainer,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      <View style={styles.citationsHeaderRow}>
        <GlobeIcon size={13} color={accentColor || '#3B82F6'} />
        <Text style={[styles.citationsHeaderLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          Verified Sources & Citations ({citations.length})
        </Text>
      </View>
      <View style={styles.citationChipsWrap}>
        {citations.slice(0, 6).map((c, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.citationChip,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
            onPress={() => {
              if (c.url) {
                const target = /^https?:\/\//i.test(c.url) ? c.url : `https://${c.url}`;
                Linking.openURL(target).catch(() => {});
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.citationBadge, { backgroundColor: (accentColor || '#3B82F6') + '22' }]}>
              <Text style={[styles.citationDomainText, { color: accentColor || '#3B82F6' }]}>
                {c.domain || 'Source'}
              </Text>
            </View>
            <Text
              style={[styles.citationTitleText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}
              numberOfLines={1}
            >
              {c.title || c.url}
            </Text>
            <ExternalLinkIcon size={11} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ── Mathematical Formatter ──────────────────────────────────────────────────

const SUPERSCRIPTS = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', 'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ', 't': 'ᵗ', 'k': 'ᵏ', 'm': 'ᵐ'
};

const SUBSCRIPTS = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎', 'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
};

function toSuperscript(str) {
  return str.split('').map(c => SUPERSCRIPTS[c] || c).join('');
}

function toSubscript(str) {
  return str.split('').map(c => SUBSCRIPTS[c] || c).join('');
}

export function formatMathExpression(latex) {
  if (!latex) return '';
  let str = latex;
  str = str.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)');
  str = str.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  str = str.replace(/\\sqrt\b/g, '√');
  str = str.replace(/\\lim_\{([^}]+)\}/g, 'lim($1)');
  str = str.replace(/\\to|\\rightarrow/g, '→');
  str = str.replace(/\\leftarrow/g, '←');
  str = str.replace(/\\int/g, '∫');
  str = str.replace(/\\cdot/g, '·');
  str = str.replace(/\\times/g, '×');
  str = str.replace(/\\div/g, '÷');
  str = str.replace(/\\pm/g, '±');
  str = str.replace(/\\mp/g, '∓');
  str = str.replace(/\\leq|\\le\b/g, '≤');
  str = str.replace(/\\geq|\\ge\b/g, '≥');
  str = str.replace(/\\neq|\\ne\b/g, '≠');
  str = str.replace(/\\approx/g, '≈');
  str = str.replace(/\\infty/g, '∞');
  str = str.replace(/\\partial/g, '∂');
  str = str.replace(/\\nabla/g, '∇');
  str = str.replace(/\\sum/g, '∑');
  str = str.replace(/\\prod/g, '∏');
  str = str.replace(/\\in\b/g, '∈');
  str = str.replace(/\\notin\b/g, '∉');
  str = str.replace(/\\subset\b/g, '⊂');
  str = str.replace(/\\subseteq\b/g, '⊆');
  str = str.replace(/\\cup\b/g, '∪');
  str = str.replace(/\\cap\b/g, '∩');
  str = str.replace(/\\forall\b/g, '∀');
  str = str.replace(/\\exists\b/g, '∃');
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
  str = str.replace(/\\epsilon/g, 'ε');
  str = str.replace(/\\lambda/g, 'λ');
  str = str.replace(/\\mu/g, 'μ');
  str = str.replace(/\\sigma/g, 'σ');
  str = str.replace(/\\Sigma/g, 'Σ');
  str = str.replace(/\\omega/g, 'ω');
  str = str.replace(/\\Omega/g, 'Ω');
  str = str.replace(/\\text\{([^}]+)\}/g, '$1');
  str = str.replace(/\\,/g, ' ');
  str = str.replace(/\\;/g, ' ');
  str = str.replace(/\\quad/g, '  ');
  str = str.replace(/\\qquad/g, '   ');
  str = str.replace(/\\left|\\right/g, '');
  str = str.replace(/\\\{/g, '{');
  str = str.replace(/\\\}/g, '}');
  str = str.replace(/\^\{([^}]+)\}/g, (_, p1) => toSuperscript(p1));
  str = str.replace(/\^([0-9a-zA-Z\+\-])/g, (_, p1) => toSuperscript(p1));
  str = str.replace(/_\{([^}]+)\}/g, (_, p1) => toSubscript(p1));
  str = str.replace(/_([0-9a-zA-Z\+\-])/g, (_, p1) => toSubscript(p1));
  str = str.replace(/\\(ln|sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|log|exp)\b/g, '$1');
  str = str.replace(/\\([a-zA-Z]+)/g, '$1');
  str = str.replace(/\\\s*/g, '');
  return str.trim();
}

// ── Math & Markdown Inline Tokens ───────────────────────────────────────────

export function convertMarkupToReadableExplanation(raw) {
  if (!raw || typeof raw !== 'string') return '';

  let outsideProse = raw
    .replace(/```(?:xml|svg|html)?\s*[\s\S]*?```/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<diagram[\s\S]*?<\/diagram>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

  const extractedItems = [];
  const compMatches = raw.matchAll(/<component(?:\s+name="([^"]+)")?[^>]*>([\s\S]*?)<\/component>/gi);
  for (const m of compMatches) {
    const name = m[1]?.trim();
    const content = m[2]?.replace(/<[^>]+>/g, '').trim();
    if (content) {
      extractedItems.push(name ? `**${name}:** ${content}` : content);
    }
  }

  const textMatches = raw.matchAll(/<(?:text|tspan)[^>]*>([\s\S]*?)<\/(?:text|tspan)>/gi);
  for (const m of textMatches) {
    const textContent = m[1]?.replace(/<[^>]+>/g, '').trim();
    if (textContent && textContent.length > 1 && !/^\d+(?:\.\d+)?$/.test(textContent) && !/^(M|L|C|Z|V|H)\s*-?\d+/i.test(textContent)) {
      if (!extractedItems.includes(textContent)) {
        extractedItems.push(textContent);
      }
    }
  }

  const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = raw.match(/<desc[^>]*>([\s\S]*?)<\/desc>/i);
  const diagramTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const diagramDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  const stepMatches = raw.matchAll(/<(?:step|item)(?:\s+title="([^"]+)")?[^>]*>([\s\S]*?)<\/(?:step|item)>/gi);
  for (const m of stepMatches) {
    const title = m[1]?.trim();
    const content = m[2]?.replace(/<[^>]+>/g, '').trim();
    if (content) {
      extractedItems.push(title ? `**${title}:** ${content}` : content);
    }
  }

  let explanation = '';
  if (outsideProse && outsideProse.length > 20) {
    explanation = outsideProse;
  }
  if (diagramTitle) {
    explanation += explanation ? `\n\n### ${diagramTitle}\n` : `### ${diagramTitle}\n`;
  }
  if (diagramDesc) {
    explanation += `\n${diagramDesc}\n`;
  }
  if (extractedItems.length > 0) {
    explanation += `\n\n**Key Structures & Diagram Labels:**\n`;
    extractedItems.forEach((item) => {
      explanation += `- ${item}\n`;
    });
    explanation += `\nEach structure is differentiated with distinct colors, leader lines, and an indexed legend to clarify their roles.`;
  }

  if (explanation.trim().length > 30) {
    return explanation.trim();
  }

  if (/cross-section|anatomical/i.test(raw)) {
    return "The diagram should show a clearly labelled cross-section, with each major structure identified and explained. Use distinct colours to differentiate the layers, and include a legend to help students understand their functions.";
  }
  return "I've reviewed this visual concept! To help you learn best, let's explore the key ideas in plain English. What specific aspect would you like to break down?";
}

export function sanitizeHumanReadableText(raw, isExplicitCode = false) {
  if (!raw || typeof raw !== 'string') return '';
  let str = raw;

  // 1. Remove internal reasoning / thinking tags (<think>...</think>, <thought>...</thought>, etc.)
  str = str.replace(/<think[\s\S]*?<\/think>/gi, '');
  str = str.replace(/<thought[\s\S]*?<\/thought>/gi, '');
  str = str.replace(/<reasoning[\s\S]*?<\/reasoning>/gi, '');
  str = str.replace(/<reflection[\s\S]*?<\/reflection>/gi, '');
  str = str.replace(/<analysis[\s\S]*?<\/analysis>/gi, '');

  // 1b. Remove unwanted TL;DR blockquotes / callouts
  str = str.replace(/^>\s*(?:\*\*)?TL;?DR:?(?:\*\*)?[\s\S]*?(?:\n\n|\n(?=[^>])|$)/im, '');
  str = str.replace(/^(?:\*\*)?TL;?DR:?(?:\*\*)?[^\n]*(?:\n\n|\n|$)/im, '');

  const hasExplicitCodeIndicator = isExplicitCode || /(?:here is (?:the )?|below is (?:the )?|svg code|xml structure|xml code|source code|programming code)/i.test(str);

  // 2. Convert unexpected XML/SVG/CSS diagram code blocks (including unclosed fences during streaming) into readable explanations
  // (Do NOT convert if explicitly presented or requested as code!)
  if (!hasExplicitCodeIndicator && /```(?:xml|svg|html)|<(?:\?xml|svg|diagram|canvas|component)/i.test(str)) {
    str = convertMarkupToReadableExplanation(str);
  }

  // 3. Detect and extract from raw JSON if wrapped
  if ((str.trim().startsWith('{') && str.trim().endsWith('}')) || (str.trim().startsWith('```json') && str.trim().endsWith('```'))) {
    try {
      const cleanJson = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      const extracted = parsed.text || parsed.response || parsed.message || parsed.answer ||
        parsed.explanation || parsed.content || parsed.description || parsed.prompt || parsed.summary;
      if (typeof extracted === 'string' && extracted.trim().length > 0) {
        str = extracted.trim();
      }
    } catch (_) {}
  }

  // 4. Unwrap top-level response/message/content/diagram wrappers
  str = str.replace(/<\/?(?:response|output|answer|explanation|message|result|content|diagram|canvas|illustration|root|city|image|scene)[^>]*>/gi, '');

  // 5. Transform structured XML components/items into clean readable bullet points
  str = str.replace(/<component(?:\s+name="([^"]+)")?[^>]*>([\s\S]*?)<\/component>/gi, (_match, name, content) => {
    return name ? `\n- **${name}:** ${content.trim()}` : `\n- ${content.trim()}`;
  });
  str = str.replace(/<step(?:\s+title="([^"]+)")?[^>]*>([\s\S]*?)<\/step>/gi, (_match, title, content) => {
    return title ? `\n- **${title}:** ${content.trim()}` : `\n- ${content.trim()}`;
  });
  str = str.replace(/<description[^>]*>([\s\S]*?)<\/description>/gi, '$1\n');
  str = str.replace(/<prompt[^>]*>([\s\S]*?)<\/prompt>/gi, '$1\n');
  str = str.replace(/<label[^>]*>/gi, ' (**Label:** ');
  str = str.replace(/<\/label>/gi, ')');

  // 6. Strip any remaining XML/HTML tags, but preserve mathematical comparisons (e.g. "x < 5", "0 < y")
  str = str.replace(/<\/?[a-zA-Z][a-zA-Z0-9_\-:]*(?:\s+[^>]*)?>/g, '');

  // 7. Decode common XML entities
  str = str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  str = str.replace(/\n{3,}/g, '\n\n').trim();

  // 8. Fallback: never show raw markup or empty corrupted text
  if (!str || /^[\s{\[<]+$/.test(str)) {
    return "I'm ready to help with your question! Could you please ask that once more or share a few more details?";
  }

  return str;
}

const MathToken = ({ text, isDark, accentColor }) => {
  const isVar = /^[a-zA-Z](_[0-9a-zA-Z])?$/.test(text) || /^(d[a-zA-Z]|dt|dx|dy|du|dv)$/.test(text);
  return (
    <Text
      style={{
        fontStyle: isVar ? 'italic' : 'normal',
        fontWeight: '600',
        fontFamily: isVar ? undefined : (Platform.OS === 'ios' ? 'Menlo' : 'monospace'),
        fontSize: isVar ? 15.5 : 14.5,
        color: isDark ? '#93C5FD' : '#2563EB',
      }}
    >
      {text}
    </Text>
  );
};

export const renderFormattedInline = (text, isDark, accentColor, options = {}) => {
  if (!text) return null;
  const { defaultColor } = options;
  const baseColor = defaultColor || (isDark ? '#F8FAFC' : '#0F172A');

  const INLINE_REGEX = /(\[[^\]]+\]\([^\)]+\)|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|\b_[^_]+_\b|~~[^~]+~~|==[^=]+==|\$(?:\\\$|[^\$\n])+\$|`[^`\n]+`)/g;
  const parts = text.split(INLINE_REGEX);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Clickable Markdown Link: [Title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <Text
          key={idx}
          accessibilityRole="link"
          onPress={() => {
            if (linkUrl) {
              const target = /^https?:\/\//i.test(linkUrl) ? linkUrl : `https://${linkUrl}`;
              Linking.openURL(target).catch(() => {});
            }
          }}
          style={{
            color: accentColor || '#3B82F6',
            textDecorationLine: 'underline',
            fontWeight: '600',
          }}
        >
          {linkText}
        </Text>
      );
    }

    // Bold + Italic: ***text*** or ___text___
    if ((part.startsWith('***') && part.endsWith('***') && part.length >= 6) ||
        (part.startsWith('___') && part.endsWith('___') && part.length >= 6)) {
      return (
        <Text key={idx} style={{ fontWeight: '800', fontStyle: 'italic', color: isDark ? '#FFFFFF' : '#0F172A' }}>
          {renderFormattedInline(part.slice(3, -3), isDark, accentColor, { defaultColor: isDark ? '#FFFFFF' : '#0F172A' })}
        </Text>
      );
    }

    // Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
        (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
      return (
        <Text key={idx} style={{ fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
          {renderFormattedInline(part.slice(2, -2), isDark, accentColor, { defaultColor: isDark ? '#FFFFFF' : '#0F172A' })}
        </Text>
      );
    }

    // Italic: *text* or _text_
    if ((part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
        (part.startsWith('_') && part.endsWith('_') && part.length >= 2)) {
      return (
        <Text key={idx} style={{ fontStyle: 'italic', color: isDark ? '#F1F5F9' : '#1E293B' }}>
          {renderFormattedInline(part.slice(1, -1), isDark, accentColor, { defaultColor: isDark ? '#F1F5F9' : '#1E293B' })}
        </Text>
      );
    }

    // Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <Text key={idx} style={{ textDecorationLine: 'line-through', opacity: 0.65 }}>
          {renderFormattedInline(part.slice(2, -2), isDark, accentColor, options)}
        </Text>
      );
    }

    // Highlight: ==text==
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

    // Inline Math: $formula$
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      const raw = part.slice(1, -1).trim();
      const formatted = formatMathExpression(raw);
      return <MathToken key={idx} text={formatted} isDark={isDark} accentColor={accentColor} />;
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <Text
          key={idx}
          style={[
            styles.inlineCode,
            {
              color: isDark ? '#E2E8F0' : '#1E293B',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          {part.slice(1, -1)}
        </Text>
      );
    }

    return (
      <Text key={idx} style={{ color: baseColor }}>
        {part}
      </Text>
    );
  });
};

// ── Image Prompt Block Card with 1-Tap Copy Support ─────────────────────────

const PromptBlockCard = ({ content, isDark, accentColor }) => {
  const [copied, setCopied] = useState(false);

  // Extract clean prompt text for copying (strips **Prompt:** and surrounding quotes)
  const promptMatch = content.match(/(?:\*\*Prompt:\*\*|Prompt:)\s*"?([\s\S]*?)"?\s*$/i);
  let textToCopy = promptMatch && promptMatch[1] ? promptMatch[1].trim() : content.trim();
  textToCopy = textToCopy.replace(/^["']|["']$/g, '').trim();

  const handleCopyPrompt = () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(textToCopy);
      } else if (Clipboard?.setString) {
        Clipboard.setString(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  const isPrompt = /(?:prompt:|\*\*prompt:\*\*)/i.test(content);

  return (
    <View
      style={[
        styles.blockquoteCard,
        {
          borderLeftColor: accentColor || '#6366F1',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
        },
      ]}
    >
      {isPrompt && (
        <View style={styles.promptHeaderRow}>
          <View style={styles.promptBadgeRow}>
            <SparklesIcon color={accentColor || '#6366F1'} size={13} />
            <Text style={[styles.promptBadgeText, { color: accentColor || '#6366F1' }]}>
              IMAGE PROMPT
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.copyPromptBtn,
              {
                backgroundColor: copied
                  ? 'rgba(16, 185, 129, 0.15)'
                  : isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderColor: copied ? '#10B981' : isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
            onPress={handleCopyPrompt}
            activeOpacity={0.7}
          >
            {copied ? (
              <CheckIcon color="#10B981" size={13} />
            ) : (
              <CopyIcon color={isDark ? '#CBD5E1' : '#475569'} size={13} />
            )}
            <Text
              style={[
                styles.copyPromptBtnText,
                { color: copied ? '#10B981' : isDark ? '#CBD5E1' : '#475569' },
              ]}
            >
              {copied ? 'Copied' : 'Copy Prompt'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.blockquoteText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
        {renderFormattedInline(content, isDark, accentColor)}
      </Text>
    </View>
  );
};

// ── Code Block Card with Copy Support ────────────────────────────────────────

const CodeBlockCard = ({ code, lang, isDark, accentColor }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code);
      } else if (Clipboard?.setString) {
        Clipboard.setString(code);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {}
  };

  return (
    <View
      style={[
        styles.codeBlockCard,
        {
          backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      <View
        style={[
          styles.codeBlockHeader,
          {
            borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        <Text style={[styles.codeBlockLang, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          {lang || 'code'}
        </Text>
        <TouchableOpacity
          onPress={handleCopyCode}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={styles.codeCopyBtn}
        >
          <Text style={[styles.codeCopyText, { color: copied ? '#10B981' : isDark ? '#94A3B8' : '#64748B' }]}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeScrollView}>
        <Text
          style={[
            styles.codeText,
            { color: isDark ? '#E2E8F0' : '#1E293B' },
          ]}
          selectable={true}
        >
          {code}
        </Text>
      </ScrollView>
    </View>
  );
};

// ── Markdown Blocks Parser ──────────────────────────────────────────────────

export function parseMarkdownBlocks(rawText) {
  if (!rawText) return [];

  const blocks = [];
  const lines = rawText.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block: ```lang ... ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }

      const rawCode = codeLines.join('\n');
      const lowerLang = (lang || '').toLowerCase();
      const isPseudoMarkup = /<(?:\?xml|diagram|canvas|component)/i.test(rawCode);
      const hasCodeContext = /(?:here is (?:the )?|below is (?:the )?|svg code|xml structure|xml code|source code|programming code)/i.test(rawText);

      // Guard against unexpected XML/SVG/CSS/diagram code in ordinary chat:
      // Convert it directly into readable text blocks unless it was explicitly presented as code
      if (isPseudoMarkup || ((lowerLang === 'xml' || lowerLang === 'svg' || lowerLang === 'html' || /<svg/i.test(rawCode)) && !hasCodeContext)) {
        const readableExplanation = convertMarkupToReadableExplanation(rawCode);
        const subBlocks = parseMarkdownBlocks(readableExplanation);
        blocks.push(...subBlocks);
        continue;
      }

      blocks.push({
        type: 'code',
        lang: lang || 'code',
        content: rawCode,
      });
      continue;
    }

    // 2. Block Math: $$ formula $$
    if (trimmed.startsWith('$$')) {
      if (trimmed.length > 2 && trimmed.endsWith('$$') && trimmed.slice(2, -2).trim().length > 0) {
        blocks.push({
          type: 'math_block',
          content: trimmed.slice(2, -2).trim(),
        });
        i++;
        continue;
      } else {
        const mathLines = [];
        const firstLineContent = trimmed.slice(2).trim();
        if (firstLineContent) mathLines.push(firstLineContent);
        i++;
        while (i < lines.length && !lines[i].trim().endsWith('$$')) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          const lastLineTrimmed = lines[i].trim();
          const lastLineContent = lastLineTrimmed.replace(/\$\$$/, '').trim();
          if (lastLineContent) mathLines.push(lastLineContent);
          i++;
        }
        blocks.push({
          type: 'math_block',
          content: mathLines.join('\n').trim(),
        });
        continue;
      }
    }

    // 3. Horizontal Rule / Divider: ---, ***, ___
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // 4. Headings: # H1, ## H2, ### H3, #### H4
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push({
        type: 'heading',
        level: Math.min(level, 4),
        content: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 5. Blockquote: > text
    if (/^>\s*/.test(line)) {
      const quoteLines = [line.replace(/^>\s*/, '')];
      i++;
      while (i < lines.length && /^>\s*/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s*/, ''));
        i++;
      }
      const quoteContent = quoteLines.join('\n');
      if (!/^(?:\*\*)?TL;?DR:?/i.test(quoteContent.trim())) {
        blocks.push({
          type: 'quote',
          content: quoteContent,
        });
      }
      continue;
    }

    // 6. Numbered list: 1. text
    const numMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (numMatch) {
      blocks.push({
        type: 'ordered_list',
        indent: Math.floor(numMatch[1].length / 2),
        number: parseInt(numMatch[2], 10),
        content: numMatch[3],
      });
      i++;
      continue;
    }

    // 7. Bullet list: - text, * text, + text, • text
    const bulletMatch = line.match(/^(\s*)([-*+•])\s+(.*)$/);
    if (bulletMatch) {
      blocks.push({
        type: 'unordered_list',
        indent: Math.floor(bulletMatch[1].length / 2),
        content: bulletMatch[3],
      });
      i++;
      continue;
    }

    // 8. Empty line
    if (!trimmed) {
      if (blocks.length === 0 || blocks[blocks.length - 1].type !== 'empty') {
        blocks.push({ type: 'empty' });
      }
      i++;
      continue;
    }

    // 9. Standard Paragraph
    blocks.push({
      type: 'paragraph',
      content: line,
    });
    i++;
  }

  return blocks;
}

// ── Markdown Body Renderer ──────────────────────────────────────────────────

export const MarkdownBody = React.memo(({ content, isDark = true, accentColor = '#2D62FF' }) => {
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  return (
    <View style={styles.markdownBodyContainer}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <View
                key={idx}
                style={[
                  styles.headingBox,
                  block.level === 1 && styles.h1Box,
                  block.level === 2 && styles.h2Box,
                  block.level === 3 && styles.h3Box,
                  block.level >= 4 && styles.h4Box,
                ]}
              >
                <Text
                  style={[
                    styles.headingText,
                    block.level === 1 && styles.h1Text,
                    block.level === 2 && styles.h2Text,
                    block.level === 3 && styles.h3Text,
                    block.level >= 4 && styles.h4Text,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  {renderFormattedInline(block.content, isDark, accentColor, { isHeading: true })}
                </Text>
              </View>
            );

          case 'divider':
            return (
              <View
                key={idx}
                style={[
                  styles.markdownDivider,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' },
                ]}
              />
            );

          case 'ordered_list':
            return (
              <View key={idx} style={[styles.listRow, block.indent ? { paddingLeft: block.indent * 16 } : null]}>
                <View style={styles.listNumberBox}>
                  <Text style={[styles.listNumberText, { color: accentColor || '#6366F1' }]}>
                    {block.number}.
                  </Text>
                </View>
                <Text style={[styles.aiText, { color: isDark ? '#F8FAFC' : '#0F172A', flex: 1 }]}>
                  {renderFormattedInline(block.content, isDark, accentColor)}
                </Text>
              </View>
            );

          case 'unordered_list':
            return (
              <View key={idx} style={[styles.listRow, block.indent ? { paddingLeft: block.indent * 16 } : null]}>
                <View style={styles.bulletDotBox}>
                  <View style={[styles.bulletDot, { backgroundColor: accentColor || '#6366F1' }]} />
                </View>
                <Text style={[styles.aiText, { color: isDark ? '#F8FAFC' : '#0F172A', flex: 1 }]}>
                  {renderFormattedInline(block.content, isDark, accentColor)}
                </Text>
              </View>
            );

          case 'quote':
            return (
              <PromptBlockCard
                key={idx}
                content={block.content}
                isDark={isDark}
                accentColor={accentColor}
              />
            );

          case 'code':
            const isPseudoMarkup = /<(?:\?xml|diagram|canvas|component)/i.test(block.content);
            const hasExplicitCodeContext = /(?:here is (?:the )?|below is (?:the )?|svg code|xml structure|xml code|source code|programming code)/i.test(content);
            if (isPseudoMarkup || ((block.lang === 'xml' || block.lang === 'svg' || /<svg/i.test(block.content)) && !hasExplicitCodeContext)) {
              const readableText = convertMarkupToReadableExplanation(block.content);
              return (
                <View key={idx} style={styles.paragraphBox}>
                  <Text style={[styles.aiText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {renderFormattedInline(readableText, isDark, accentColor)}
                  </Text>
                </View>
              );
            }
            return (
              <CodeBlockCard
                key={idx}
                code={block.content}
                lang={block.lang}
                isDark={isDark}
                accentColor={accentColor}
              />
            );

          case 'math_block':
            return (
              <View
                key={idx}
                style={[
                  styles.blockMathContainer,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.blockMathText,
                    { color: isDark ? '#93C5FD' : '#1D4ED8' },
                  ]}
                  selectable={true}
                >
                  {formatMathExpression(block.content)}
                </Text>
              </View>
            );

          case 'empty':
            return <View key={idx} style={styles.emptySpacer} />;

          case 'paragraph':
          default:
            return (
              <Text key={idx} style={[styles.paragraphText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {renderFormattedInline(block.content, isDark, accentColor)}
              </Text>
            );
        }
      })}
    </View>
  );
});

// ── Ultra-Clean Industry-Grade AI Message Card ──────────────────────────────

// ── Animated Feedback Buttons (Like & Dislike with Smooth Transitions) ──────

const AnimatedFeedbackButtons = React.memo(({
  messageId,
  userFeedback = null,
  handleFeedback,
  accentColor = '#6366F1',
  isDark = true,
}) => {
  const [feedback, setFeedback] = useState(userFeedback);

  useEffect(() => {
    setFeedback(userFeedback);
  }, [userFeedback]);

  // Scale bounce animations for the clicked thumb
  const upScale = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;

  // Opacity and width values for graceful removal & entry
  const upOpacity = useRef(new Animated.Value(userFeedback === 'dislike' ? 0 : 1)).current;
  const upWidth = useRef(new Animated.Value(userFeedback === 'dislike' ? 0 : 28)).current;

  const downOpacity = useRef(new Animated.Value(userFeedback === 'like' ? 0 : 1)).current;
  const downWidth = useRef(new Animated.Value(userFeedback === 'like' ? 0 : 28)).current;

  // Animated gap between thumbs: 6px when both exist, 0px when one is removed
  const gapAnim = useRef(new Animated.Value(userFeedback ? 0 : 6)).current;

  const feedbackRef = useRef(feedback);
  feedbackRef.current = feedback;

  const onSelect = (type) => {
    const prev = feedbackRef.current;
    const next = prev === type ? null : type;

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      try {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      } catch (e) {}
    }
    if (Platform.OS !== 'web') {
      try {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      } catch (e) {}
    }

    setFeedback(next);
    if (handleFeedback) {
      handleFeedback(messageId, next);
    }

    if (next === 'like') {
      // 1. Pop the selected thumb with bouncy spring
      upScale.setValue(0.65);
      Animated.spring(upScale, {
        toValue: 1,
        friction: 3.5,
        tension: 180,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Ensure up thumb is full width and opacity
      Animated.parallel([
        Animated.timing(upOpacity, { toValue: 1, duration: 160, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(upWidth, { toValue: 28, duration: 180, useNativeDriver: false }),
        Animated.timing(gapAnim, { toValue: 0, duration: 180, useNativeDriver: false }),

        // 2. Animate other button (down thumb) away: shrink scale, fade out, collapse width to 0
        Animated.timing(downScale, { toValue: 0.15, duration: 160, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(downOpacity, { toValue: 0, duration: 140, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(downWidth, { toValue: 0, duration: 190, useNativeDriver: false }),
      ]).start();
    } else if (next === 'dislike') {
      // 1. Pop the selected thumb with bouncy spring
      downScale.setValue(0.65);
      Animated.spring(downScale, {
        toValue: 1,
        friction: 3.5,
        tension: 180,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Ensure down thumb is full width and opacity
      Animated.parallel([
        Animated.timing(downOpacity, { toValue: 1, duration: 160, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(downWidth, { toValue: 28, duration: 180, useNativeDriver: false }),
        Animated.timing(gapAnim, { toValue: 0, duration: 180, useNativeDriver: false }),

        // 2. Animate other button (up thumb) away: shrink scale, fade out, collapse width to 0
        Animated.timing(upScale, { toValue: 0.15, duration: 160, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(upOpacity, { toValue: 0, duration: 140, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(upWidth, { toValue: 0, duration: 190, useNativeDriver: false }),
      ]).start();
    } else {
      // Deselected / reset: smoothly restore both buttons!
      Animated.parallel([
        Animated.spring(upScale, { toValue: 1, friction: 4.5, tension: 130, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(upOpacity, { toValue: 1, duration: 190, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(upWidth, { toValue: 28, duration: 190, useNativeDriver: false }),
        Animated.timing(gapAnim, { toValue: 6, duration: 190, useNativeDriver: false }),

        Animated.spring(downScale, { toValue: 1, friction: 4.5, tension: 130, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(downOpacity, { toValue: 1, duration: 190, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(downWidth, { toValue: 28, duration: 190, useNativeDriver: false }),
      ]).start();
    }
  };

  const isLike = feedback === 'like';
  const isDislike = feedback === 'dislike';

  return (
    <View style={styles.feedbackRow}>
      {/* ── Thumbs Up Button Slot ── */}
      <Animated.View
        style={[
          styles.feedbackBtnSlot,
          {
            width: upWidth,
            marginRight: gapAnim,
            opacity: upOpacity,
            transform: [{ scale: upScale }],
          },
        ]}
        pointerEvents={isDislike ? 'none' : 'auto'}
      >
        <TooltipTouchable
          tooltip={isLike ? 'Liked response' : 'Good response (Like)'}
          style={[
            styles.actionIconBtn,
            isLike && {
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.22)' : 'rgba(99, 102, 241, 0.15)',
              borderRadius: 6,
            },
          ]}
          onPress={() => onSelect('like')}
          activeScale={0.88}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ThumbUpIcon
            color={isLike ? (accentColor || '#6366F1') : isDark ? '#94A3B8' : '#64748B'}
            size={14}
            filled={isLike}
          />
        </TooltipTouchable>
      </Animated.View>

      {/* ── Thumbs Down Button Slot ── */}
      <Animated.View
        style={[
          styles.feedbackBtnSlot,
          {
            width: downWidth,
            opacity: downOpacity,
            transform: [{ scale: downScale }],
          },
        ]}
        pointerEvents={isLike ? 'none' : 'auto'}
      >
        <TooltipTouchable
          tooltip={isDislike ? 'Disliked response' : 'Bad response (Dislike)'}
          style={[
            styles.actionIconBtn,
            isDislike && {
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.22)' : 'rgba(239, 68, 68, 0.15)',
              borderRadius: 6,
            },
          ]}
          onPress={() => onSelect('dislike')}
          activeScale={0.88}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ThumbDownIcon
            color={isDislike ? '#EF4444' : isDark ? '#94A3B8' : '#64748B'}
            size={14}
            filled={isDislike}
          />
        </TooltipTouchable>
      </Animated.View>
    </View>
  );
});

const AiMessageCard = ({
  item,
  isDark = true,
  accentColor = '#2D62FF',
  isExpanded = false,
  toggleSteps,
  isAudioPlaying = false,
  isAudioLoading = false,
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
  const rawClean = sanitizeHumanReadableText((item.text || '').replace(/^🎙️[^\n]+\n\n?/, ''), item.isExplicitCode);
  const cleanBodyText = item.isStreaming ? rawClean.trimStart() : rawClean.trim();

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
      {/* ── Main Message Body (Backgroundless, Direct & Airy) ── */}
      <View style={styles.aiBubbleCard}>
        {/* ── Collapsible Thought Process (ChatGPT / Gemini style) ── */}
        {item.thoughtProcess ? (
          <ThoughtProcessCard
            thought={item.thoughtProcess}
            isDark={isDark}
            accentColor={accentColor}
          />
        ) : null}

        {/* ── Body Text (Formatted Markdown & Math) ── */}
        <MarkdownBody
          content={cleanBodyText}
          isDark={isDark}
          accentColor={accentColor}
        />

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



        {/* ── Source Citations Panel (Multi-Website Research) ── */}
        <SourceCitationsCard
          citations={item.citations}
          isDark={isDark}
          accentColor={accentColor}
        />

        {/* ── High-Visibility Action Toolbar ── */}
        {!item.isStreaming && (
          <View style={styles.ghostActionBar}>
            <View style={styles.ghostActionsLeft}>
              {/* Audio Toggle (Listen with AI voice) */}
              <TooltipTouchable
                tooltip={
                  isAudioLoading
                    ? 'Loading AI voice...'
                    : isAudioPlaying
                    ? 'Stop audio playback'
                    : 'Read aloud with AI voice'
                }
                style={[
                  styles.actionIconBtn,
                  isAudioPlaying && {
                    backgroundColor: accentColor || '#6236FF',
                    borderRadius: 6,
                  },
                  isAudioLoading && {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 6,
                  },
                ]}
                onPress={() => handleToggleListen(item.id, item)}
                activeScale={0.88}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isAudioLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={accentColor || '#6236FF'}
                    style={{ transform: [{ scale: 0.75 }] }}
                  />
                ) : isAudioPlaying ? (
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

              {/* Animated Feedback (Thumbs Up / Down) */}
              <AnimatedFeedbackButtons
                messageId={item.id}
                userFeedback={userFeedback}
                handleFeedback={handleFeedback}
                accentColor={accentColor}
                isDark={isDark}
              />

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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aiBubbleWrapper: {
    marginVertical: 8,
    marginHorizontal: 4,
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
    width: '100%',
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
  markdownBodyContainer: {
    width: '100%',
  },
  paragraphText: {
    fontSize: 15.5,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: -0.1,
    marginBottom: 6,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2.5,
    paddingRight: 4,
  },
  listNumberBox: {
    width: 24,
    alignItems: 'flex-start',
    paddingTop: 1,
  },
  listNumberText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 23,
  },
  bulletDotBox: {
    width: 18,
    alignItems: 'center',
    paddingTop: 9,
  },
  bulletDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
  },
  markdownDivider: {
    height: 1,
    marginVertical: 10,
    width: '100%',
  },
  headingBox: {
    width: '100%',
  },
  h1Box: {
    marginTop: 12,
    marginBottom: 5,
  },
  h2Box: {
    marginTop: 10,
    marginBottom: 4,
  },
  h3Box: {
    marginTop: 8,
    marginBottom: 4,
  },
  h4Box: {
    marginTop: 6,
    marginBottom: 3,
  },
  headingText: {
    letterSpacing: -0.2,
  },
  h1Text: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 26,
  },
  h2Text: {
    fontSize: 17.5,
    fontWeight: '700',
    lineHeight: 24,
  },
  h3Text: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
  h4Text: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  blockquoteCard: {
    borderLeftWidth: 3.5,
    paddingLeft: 12,
    paddingVertical: 6,
    marginVertical: 6,
    borderRadius: 4,
  },
  blockquoteText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  promptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 4,
  },
  promptBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  promptBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  copyPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  copyPromptBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  codeBlockCard: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 6,
  },
  codeBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  codeBlockLang: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codeCopyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  codeCopyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  codeScrollView: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    lineHeight: 19,
  },
  blockMathContainer: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockMathText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  inlineCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13.5,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  emptySpacer: {
    height: 6,
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
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackBtnSlot: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  timestampText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  // Thought Process Accordion Styles
  thoughtCardContainer: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thoughtHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  thoughtHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  thoughtIcon: {
    fontSize: 13,
  },
  thoughtTitleText: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  thoughtChevronBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thoughtBodyBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 2.5,
    marginHorizontal: 10,
    marginBottom: 8,
  },
  thoughtBodyText: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  // Source Citations Styles
  citationsContainer: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  citationsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  citationsHeaderLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  citationChipsWrap: {
    flexDirection: 'column',
    gap: 6,
  },
  citationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    gap: 7,
  },
  citationBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  citationDomainText: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'lowercase',
  },
  citationTitleText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default React.memo(AiMessageCard);
