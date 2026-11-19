import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Rect,
  Ellipse,
  Line,
} from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';
import { searchCourseCatalog } from '../constants/courseCatalog';

// ==========================================
// 1. HIGH-PRECISION SUBJECT ICONS
// ==========================================

function MathIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Plus (+) */}
      <Path d="M4 6.5H9.5M6.75 3.75V9.25" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      {/* Minus (-) */}
      <Path d="M14.5 6.5H20" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      {/* Multiply (×) */}
      <Path d="M4.5 15L9 19.5M9 15L4.5 19.5" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      {/* Equals (=) */}
      <Path d="M14.5 15.5H20M14.5 19H20" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
    </Svg>
  );
}

function EnglishIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Open Book */}
      <Path
        d="M2.5 6C4.8 4.6 7.8 4.6 12 7C16.2 4.6 19.2 4.6 21.5 6V19C19.2 17.6 16.2 17.6 12 20C7.8 17.6 4.8 17.6 2.5 19V6Z"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 7V20" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

function ScienceIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Laboratory Flask */}
      <Path
        d="M9 3H15M10 3V8L5 17.5C4.2 19 5.2 21 7 21H17C18.8 21 19.8 19 19 17.5L14 8V3"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M7 16H17" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Circle cx="10" cy="18" r="1.1" fill={color} />
      <Circle cx="13.5" cy="17.2" r="0.9" fill={color} />
    </Svg>
  );
}

function HistoryIcon({ size = 22, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Classical Temple */}
      <Path d="M3 9.5L12 5L21 9.5V10.5H3V9.5Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
      <Path d="M5 11V18M9.6 11V18M14.4 11V18M19 11V18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M3 18.5H21M2 21H22" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

function GeographyIcon({ size = 22, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Globe with latitude and longitude */}
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.9" />
      <Path d="M3.5 9H20.5M3.5 15H20.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Ellipse cx="12" cy="12" rx="4.5" ry="9" stroke={color} strokeWidth="1.7" />
    </Svg>
  );
}

function PhysicsIcon({ size = 22, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Atom structure */}
      <Circle cx="12" cy="12" r="2.2" fill={color} />
      <Ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(30 12 12)" stroke={color} strokeWidth="1.8" />
      <Ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-30 12 12)" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

function ChemistryIcon({ size = 22, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Chemistry Beaker */}
      <Path
        d="M7 4H17M8 4V16.5C8 18.7 9.8 20.5 12 20.5C14.2 20.5 16 18.7 16 16.5V4"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="8" y1="9" x2="11.5" y2="9" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Line x1="8" y1="13" x2="12.5" y2="13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

function BiologyIcon({ size = 22, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* DNA Helix */}
      <Path
        d="M6 3.5C8 6.5 12 9.5 18 12C12 14.5 8 17.5 6 20.5"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <Path
        d="M18 3.5C16 6.5 12 9.5 6 12C12 14.5 16 17.5 18 20.5"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <Line x1="7.5" y1="7" x2="16.5" y2="7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="7.5" y1="17" x2="16.5" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function ComputerScienceIcon({ size = 22, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Monitor with code brackets */}
      <Rect x="3" y="4" width="18" height="12" rx="2" stroke={color} strokeWidth="1.9" />
      <Path d="M12 16V20M8 20H16" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <Path d="M8.5 9L6.5 10L8.5 11M15.5 9L17.5 10L15.5 11" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EconomicsIcon({ size = 22, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Upward Trending Chart */}
      <Path d="M4 20H20" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <Path d="M5 15L10 10L14 13L19 6M19 6H15M19 6V10" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function OtherIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Dashed outer circle with crisp plus sign */}
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" strokeDasharray="3.5 2.5" />
      <Path d="M12 8V16M8 12H16" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
    </Svg>
  );
}

function HealthIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Heartbeat pulse */}
      <Path
        d="M22 12h-4l-3 9L9 3l-3 9H2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EngineeringIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Gear / Mechanical Cog */}
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LawIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Scales of Justice */}
      <Path d="M12 3v18M5 6l7-2 7 2M5 6l-3 7h6L5 6zM19 6l-3 7h6l-3-7zM2 13c0 2 1.5 3 3 3s3-1 3-3M16 13c0 2 1.5 3 3 3s3-1 3-3M8 21h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CapIcon({ size = 22, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Graduation Cap */}
      <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SearchIcon({ size = 18, color = '#94A3B8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Path d="M20 20L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CheckmarkBadge({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#2563EB" />
      <Path
        d="M7.5 12.5L10.5 15.5L16.5 9"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EmptyCircleBadge({ size = 20, isDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={isDark ? 'rgba(255, 255, 255, 0.25)' : '#CBD5E1'}
        strokeWidth="1.8"
      />
    </Svg>
  );
}

// Map subject names to their respective icons
const SUBJECT_ICON_MAP = {
  Mathematics: MathIcon,
  English: EnglishIcon,
  Science: ScienceIcon,
  History: HistoryIcon,
  Geography: GeographyIcon,
  Physics: PhysicsIcon,
  Chemistry: ChemistryIcon,
  Biology: BiologyIcon,
  'Computer Science': ComputerScienceIcon,
  Economics: EconomicsIcon,
  Other: OtherIcon,
};

// Smart fallback icon resolver for added courses
function resolveSubjectIcon(subjectName) {
  if (SUBJECT_ICON_MAP[subjectName]) {
    return SUBJECT_ICON_MAP[subjectName];
  }
  const s = (subjectName || '').toLowerCase();
  if (s.includes('other')) {
    return OtherIcon;
  }
  if (s.includes('med') || s.includes('nurs') || s.includes('pharm') || s.includes('health') || s.includes('anat') || s.includes('physio') || s.includes('dent')) {
    return HealthIcon;
  }
  if (s.includes('comp') || s.includes('softw') || s.includes('cyber') || s.includes('data') || s.includes('ai') || s.includes('tech') || s.includes('csc') || s.includes('swe') || s.includes('cos') || s.includes('cit') || s.includes('ift')) {
    return ComputerScienceIcon;
  }
  if (s.includes('engine') || s.includes('civil') || s.includes('mechan') || s.includes('electr') || s.includes('arch') || s.includes('cve') || s.includes('mee') || s.includes('eee') || s.includes('get') || s.includes('mce') || s.includes('tme') || s.includes('abe') || s.includes('bme')) {
    return EngineeringIcon;
  }
  if (s.includes('law') || s.includes('crimin') || s.includes('jur') || s.includes('legal') || s.includes('pcr') || s.includes('css')) {
    return LawIcon;
  }
  if (s.includes('account') || s.includes('busin') || s.includes('finan') || s.includes('market') || s.includes('bank') || s.includes('acc') || s.includes('eco') || s.includes('bua') || s.includes('ams') || s.includes('fms')) {
    return EconomicsIcon;
  }
  if (s.includes('math') || s.includes('stat') || s.includes('calc') || s.includes('mth') || s.includes('mts') || s.includes('mat') || s.includes('sta') || s.includes('sts')) {
    return MathIcon;
  }
  if (s.includes('bio') || s.includes('botan') || s.includes('zool') || s.includes('microb') || s.includes('bot') || s.includes('zoo') || s.includes('bch') || s.includes('mcb')) {
    return BiologyIcon;
  }
  if (s.includes('chem') || s.includes('chm') || s.includes('che') || s.includes('sci')) {
    return ChemistryIcon;
  }
  if (s.includes('eng') || s.includes('lit') || s.includes('fren') || s.includes('arab') || s.includes('ling') || s.includes('lang') || s.includes('gst') || s.includes('gns') || s.includes('gsp') || s.includes('frn') || s.includes('fre')) {
    return EnglishIcon;
  }
  return CapIcon;
}

const DEFAULT_PRESETS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Other',
];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function OnboardingSubjectsScreen({
  onContinue,
  onBack,
  initialSelected = ['Mathematics', 'English', 'Science'],
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);

  const [availableSubjects, setAvailableSubjects] = useState(() => {
    const list = [...DEFAULT_PRESETS];
    if (Array.isArray(initialSelected)) {
      initialSelected.forEach((s) => {
        if (!list.includes(s) && s !== 'Other') {
          list.unshift(s);
        }
      });
    }
    // Ensure 'Other' is always the last item in the grid
    const withoutOther = list.filter((s) => s !== 'Other');
    return [...withoutOther, 'Other'];
  });

  const [selectedSubjects, setSelectedSubjects] = useState(
    Array.isArray(initialSelected) && initialSelected.length > 0
      ? initialSelected
      : ['Mathematics', 'English', 'Science']
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [btnScale] = useState(new Animated.Value(1));
  const [gridWidth, setGridWidth] = useState(0);

  // Other input states
  const [otherText, setOtherText] = useState('');
  const otherInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const isOtherSelected = selectedSubjects.includes('Other');

  // Exact 3-column width dynamically calculated relative to container
  const cardDynamicWidth = useMemo(() => {
    if (gridWidth > 120) {
      return Math.floor((gridWidth - 20) / 3);
    }
    return null;
  }, [gridWidth]);

  // Connect to the imported PDF/CSV course catalog
  const catalogMatches = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return searchCourseCatalog(q, 8);
  }, [searchQuery]);

  // Filtered preset cards currently displayed in the grid
  const filteredGridSubjects = useMemo(() => {
    if (!searchQuery.trim()) return availableSubjects;
    const q = searchQuery.toLowerCase().trim();
    return availableSubjects.filter((sub) => sub.toLowerCase().includes(q));
  }, [availableSubjects, searchQuery]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) => {
      const willSelect = !prev.includes(subject);

      // If user tapped "Other", focus and scroll to the other input field
      if (subject === 'Other' && willSelect) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
          otherInputRef.current?.focus();
        }, 150);
      }

      if (prev.includes(subject)) {
        return prev.filter((s) => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  // Add custom course from "Other" input
  const handleCommitOther = () => {
    const custom = otherText.trim();
    if (!custom) return;

    // Add to available subjects (placed right before 'Other')
    setAvailableSubjects((prev) => {
      const withoutOther = prev.filter((s) => s !== 'Other');
      if (withoutOther.includes(custom)) return prev;
      return [...withoutOther, custom, 'Other'];
    });

    // Auto-select the newly added custom course
    setSelectedSubjects((prev) => {
      if (prev.includes(custom)) return prev;
      return [...prev, custom];
    });

    setOtherText('');
  };

  // User selects an item from the course catalog dropdown
  const handleSelectFromCatalog = (courseName) => {
    const name = courseName.trim();
    if (!name) return;

    // Add to available subjects list right before 'Other'
    setAvailableSubjects((prev) => {
      const withoutOther = prev.filter((s) => s !== 'Other');
      if (withoutOther.includes(name)) return prev;
      return [name, ...withoutOther, 'Other'];
    });

    // Auto-select the course
    setSelectedSubjects((prev) => {
      if (prev.includes(name)) return prev;
      return [...prev, name];
    });

    // Clear search and close dropdown
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleContinue = () => {
    let finalSelection = [...selectedSubjects];

    // If "Other" is selected and text was typed in the other input, add it
    if (isOtherSelected && otherText.trim().length > 0) {
      const custom = otherText.trim();
      if (!finalSelection.includes(custom)) {
        finalSelection.push(custom);
      }
    }

    // Filter out the literal word 'Other' if any real subjects were selected
    if (finalSelection.some((s) => s !== 'Other')) {
      finalSelection = finalSelection.filter((s) => s !== 'Other');
    }

    if (finalSelection.length === 0) {
      finalSelection = ['Mathematics'];
    }

    if (onContinue) {
      onContinue(finalSelection);
    }
  };

  const handlePressIn = () => {
    Animated.spring(btnScale, {
      toValue: 0.975,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const showDropdown = searchQuery.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
            Which subjects{'\n'}are you studying?
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Select all that apply. You can add more{'\n'}later in the app.
          </Text>
        </View>

        {/* Search Input Bar + Autocomplete Dropdown from Catalog */}
        <View style={styles.searchSectionWrapper}>
          <View
            style={[
              styles.searchBarWrapper,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                borderColor: showDropdown
                  ? '#3B82F6'
                  : isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
              },
            ]}
          >
            <SearchIcon size={18} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search subjects or courses..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#2563EB"
            />
            {!!searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.clearBtnText, { color: theme.textMuted }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Dynamic Dropdown from Course Catalog */}
          {showDropdown && (
            <View
              style={[
                styles.dropdownOverlay,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : '#3B82F6',
                },
              ]}
            >
              <View
                style={[
                  styles.dropdownHeader,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dropdownHeaderTitle,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Courses in catalog ({catalogMatches.length} found)
                </Text>
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.dropdownCloseBtn}>Close ✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.dropdownScroll}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {catalogMatches.map((item) => {
                  const isSelected = selectedSubjects.includes(item.name);
                  return (
                    <TouchableOpacity
                      key={item.id || item.name}
                      style={[
                        styles.dropdownItem,
                        {
                          borderBottomColor: isDark
                            ? 'rgba(255, 255, 255, 0.06)'
                            : '#F1F5F9',
                        },
                      ]}
                      onPress={() => handleSelectFromCatalog(item.name)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dropdownItemLeft}>
                        <Text
                          style={[
                            styles.dropdownItemName,
                            { color: isDark ? '#F8FAFC' : '#0F172A' },
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <View style={styles.dropdownTagsRow}>
                          {!!item.code && (
                            <View
                              style={[
                                styles.codeBadge,
                                {
                                  backgroundColor: isDark
                                    ? 'rgba(37, 99, 235, 0.3)'
                                    : '#EFF6FF',
                                  borderColor: isDark
                                    ? '#3B82F6'
                                    : '#BFDBFE',
                                },
                              ]}
                            >
                              <Text style={styles.codeBadgeText}>{item.code}</Text>
                            </View>
                          )}
                          {!!item.category && (
                            <Text
                              style={[
                                styles.categoryTagText,
                                { color: isDark ? '#94A3B8' : '#64748B' },
                              ]}
                              numberOfLines={1}
                            >
                              {item.category}
                            </Text>
                          )}
                          {!!item.level && (
                            <Text
                              style={[
                                styles.levelTagText,
                                { color: isDark ? '#60A5FA' : '#2563EB' },
                              ]}
                            >
                              • {item.level}
                            </Text>
                          )}
                        </View>
                      </View>

                      {isSelected ? (
                        <View style={styles.addedBadge}>
                          <Text style={styles.addedBadgeText}>✓ Added</Text>
                        </View>
                      ) : (
                        <View style={styles.addCourseBtn}>
                          <Text style={styles.addCourseBtnText}>+ Add</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Option to add custom course if typed query not in catalog */}
                {searchQuery.trim().length > 1 &&
                  !catalogMatches.some(
                    (c) => c.name.toLowerCase() === searchQuery.trim().toLowerCase()
                  ) && (
                    <TouchableOpacity
                      style={[
                        styles.customAddRow,
                        {
                          backgroundColor: isDark
                            ? 'rgba(37, 99, 235, 0.12)'
                            : '#F0F6FF',
                          borderTopColor: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : '#E2E8F0',
                        },
                      ]}
                      onPress={() => handleSelectFromCatalog(searchQuery.trim())}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.customAddText}>
                        + Add "{searchQuery.trim()}" as custom course
                      </Text>
                    </TouchableOpacity>
                  )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Subjects 3-Column Grid + "Other" Input Field */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.gridScrollView}
          contentContainerStyle={styles.gridContentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={styles.cardsGrid}
            onLayout={(e) => {
              const w = Math.round(e.nativeEvent.layout.width);
              if (w > 0 && Math.abs(w - gridWidth) > 1) {
                setGridWidth(w);
              }
            }}
          >
            {filteredGridSubjects.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              const IconComponent = resolveSubjectIcon(subject);

              return (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.subjectCard,
                    cardDynamicWidth ? { width: cardDynamicWidth } : { width: '31.2%' },
                    {
                      backgroundColor: isSelected
                        ? (isDark ? 'rgba(37, 99, 235, 0.18)' : '#F0F6FF')
                        : (isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF'),
                      borderColor: isSelected
                        ? '#3B82F6'
                        : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'),
                    },
                    isSelected && styles.subjectCardSelected,
                  ]}
                  onPress={() => toggleSubject(subject)}
                  activeOpacity={0.8}
                >
                  {/* Top Row: Icon on left, Check/Circle badge on right */}
                  <View style={styles.cardTopRow}>
                    <IconComponent
                      size={22}
                      color={isSelected ? '#2563EB' : (isDark ? '#94A3B8' : '#334155')}
                    />
                    {isSelected ? (
                      <CheckmarkBadge size={19} />
                    ) : (
                      <EmptyCircleBadge size={19} isDark={isDark} />
                    )}
                  </View>

                  {/* Bottom: Subject Name */}
                  <Text
                    style={[
                      styles.cardSubjectName,
                      {
                        color: isSelected ? (isDark ? '#60A5FA' : '#1D4ED8') : theme.textPrimary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* "Other" Custom Subject Input Field - Appears when "Other" is selected */}
          {isOtherSelected && (
            <View style={styles.otherInputContainer}>
              <Text style={[styles.otherInputLabel, { color: theme.textSecondary }]}>
                Specify your other course or subject:
              </Text>
              <View
                style={[
                  styles.otherInputWrapper,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                    borderColor: isDark ? '#3B82F6' : '#2563EB',
                  },
                ]}
              >
                <TextInput
                  ref={otherInputRef}
                  style={[styles.otherTextInput, { color: theme.textPrimary }]}
                  placeholder="e.g. Law, Medicine, French, Philosophy..."
                  placeholderTextColor={theme.textMuted}
                  value={otherText}
                  onChangeText={setOtherText}
                  returnKeyType="done"
                  onSubmitEditing={handleCommitOther}
                  autoCapitalize="words"
                  selectionColor="#2563EB"
                />
                {otherText.trim().length > 0 && (
                  <TouchableOpacity
                    style={styles.addOtherButton}
                    onPress={handleCommitOther}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addOtherButtonText}>Add to list</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.otherHintText, { color: theme.textMuted }]}>
                Enter any custom course or subject not in the preset list
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Primary Action Button */}
        <View style={styles.footerContainer}>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ==========================================
// 3. STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerBlock: {
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 14,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0A1838',
    letterSpacing: -0.6,
    lineHeight: 33,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  searchSectionWrapper: {
    position: 'relative',
    zIndex: 9999,
    elevation: 10,
    marginBottom: 16,
  },
  searchBarWrapper: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14.5,
    fontWeight: '500',
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    maxHeight: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    zIndex: 99999,
    elevation: 12,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dropdownHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dropdownCloseBtn: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  dropdownScroll: {
    maxHeight: 185,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemLeft: {
    flex: 1,
    paddingRight: 10,
  },
  dropdownItemName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 3,
  },
  dropdownTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  codeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  levelTagText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  addCourseBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCourseBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  addedBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  customAddRow: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#F0F6FF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  customAddText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  gridScrollView: {
    flex: 1,
  },
  gridContentContainer: {
    paddingBottom: 20,
  },
  cardsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  subjectCard: {
    width: '31.2%',
    height: 98,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  subjectCardSelected: {
    borderWidth: 1.8,
    borderColor: '#3B82F6',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSubjectName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: -0.2,
    lineHeight: 16,
  },
  otherInputContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
  otherInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  otherInputWrapper: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  otherTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
  },
  addOtherButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOtherButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  otherHintText: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  footerContainer: {
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
