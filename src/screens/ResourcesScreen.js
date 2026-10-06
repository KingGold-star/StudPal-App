import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  Share,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg';
import { resourcesService } from '../services/resourcesService';
import { useTranslation } from '../services/i18n/i18nService';
import { Colors } from '../theme/colors';
import { useTheme } from '../theme/themeContext';

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const ArrowLeftIcon = ({ color = '#0F172A', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const SearchIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="7" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const CloseIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const ImageIcon = ({ color = '#3B82F6', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
    <Path d="M21 15l-5-5L5 21" />
  </Svg>
);

const DocumentIcon = ({ color = '#10B981', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

const FlashcardIcon = ({ color = '#6236FF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const CheatSheetIcon = ({ color = '#F59E0B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="4" y="2" width="16" height="20" rx="2" />
    <Line x1="8" y1="6" x2="16" y2="6" />
    <Line x1="8" y1="10" x2="16" y2="10" />
    <Line x1="8" y1="14" x2="12" y2="14" />
    <Line x1="8" y1="18" x2="14" y2="18" />
  </Svg>
);

const CodeIcon = ({ color = '#EC4899', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="16 18 22 12 16 6" />
    <Polyline points="8 6 2 12 8 18" />
  </Svg>
);

const StarIcon = ({ color = '#F59E0B', filled = false, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

const DownloadIcon = ({ color = '#6236FF', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="7 10 12 15 17 10" />
    <Line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);

const EyeIcon = ({ color = '#6236FF', size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const SparklesIcon = ({ color = '#6236FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

// ─── Filter Categories ───────────────────────────────────────────────────────

const TYPE_FILTERS = [
  { id: 'all', label: 'All', icon: SparklesIcon },
  { id: 'image', label: 'Visuals', icon: ImageIcon },
  { id: 'document', label: 'Guides', icon: DocumentIcon },
  { id: 'flashcards', label: 'Decks', icon: FlashcardIcon },
  { id: 'favorites', label: 'Starred', icon: StarIcon },
];

export default function ResourcesScreen({ onBack, onNavigate, settings }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isDark, accentColor: themeAccentColor } = useTheme();
  const accentColor = themeAccentColor || settings?.accentColor || '#6236FF';
  const styles = useMemo(() => getResourcesStyles(isDark, accentColor), [isDark, accentColor]);

  const [resources, setResources] = useState(() => resourcesService.getAll());
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [downloadToast, setDownloadToast] = useState(null);

  useEffect(() => {
    const unsub = resourcesService.subscribe((list) => setResources(list));
    return () => unsub();
  }, []);

  const handleToggleFavorite = (id) => {
    resourcesService.toggleFavorite(id);
  };

  const handleDownload = (resource) => {
    setDownloadToast(`Saved "${resource.title}" to device!`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const filteredResources = resources.filter((res) => {
    // Type Filter
    if (selectedType === 'favorites') {
      if (!res.isFavorite) return false;
    } else if (selectedType !== 'all') {
      if (res.type !== selectedType) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchSubject = res.subject.toLowerCase().includes(q);
      const matchTags = res.tags.some((t) => t.toLowerCase().includes(q));
      const matchPrompt = res.prompt.toLowerCase().includes(q);
      return matchTitle || matchSubject || matchTags || matchPrompt;
    }

    return true;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon color="#3B82F6" size={18} />;
      case 'document':
        return <DocumentIcon color="#10B981" size={18} />;
      case 'flashcards':
        return <FlashcardIcon color="#6236FF" size={18} />;
      case 'cheatsheet':
        return <CheatSheetIcon color="#F59E0B" size={18} />;
      case 'code':
        return <CodeIcon color="#EC4899" size={18} />;
      default:
        return <DocumentIcon color="#64748B" size={18} />;
    }
  };

  const getResourceBgColor = (type) => {
    switch (type) {
      case 'image':
        return isDark ? 'rgba(59, 130, 246, 0.18)' : '#EFF6FF';
      case 'document':
        return isDark ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5';
      case 'flashcards':
        return isDark ? 'rgba(98, 54, 255, 0.18)' : '#F0EEFF';
      case 'cheatsheet':
        return isDark ? 'rgba(245, 158, 11, 0.18)' : '#FFFBEB';
      case 'code':
        return isDark ? 'rgba(236, 72, 153, 0.18)' : '#FDF2F8';
      default:
        return isDark ? 'rgba(148, 163, 184, 0.15)' : '#F8FAFC';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0B0F19" : "#FFFFFF"} />

      {/* ── TOP HEADER BAR ───────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeftIcon color={isDark ? "#F8FAFC" : "#0F172A"} size={20} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>{t("resources.title", "AI Resources")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("resources.subtitle", { count: resources.length })}
          </Text>
        </View>
      </View>

      {/* ── TOAST NOTIFICATION ───────────────────────────────────────────── */}
      {downloadToast && (
        <View style={[styles.toastCard, { backgroundColor: accentColor }]}>
          <DownloadIcon color="#FFFFFF" size={16} />
          <Text style={styles.toastText}>{downloadToast}</Text>
        </View>
      )}

      {/* ── SEARCH BAR ───────────────────────────────────────────────────── */}
      <View style={styles.searchBarContainer}>
        <SearchIcon color="#94A3B8" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("resources.searchPlaceholder", "Search AI resources...")}
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <CloseIcon color="#94A3B8" size={16} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── FILTER PILLS CAROUSEL ────────────────────────────────────────── */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {TYPE_FILTERS.map((filter) => {
            const isSelected = selectedType === filter.id;
            const IconComp = filter.icon;
            const count =
              filter.id === 'all'
                ? resources.length
                : filter.id === 'favorites'
                ? resources.filter((r) => r.isFavorite).length
                : resources.filter((r) => r.type === filter.id).length;

            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterPill,
                  isSelected && [
                    styles.filterPillActive,
                    {
                      backgroundColor: isDark ? `${accentColor}25` : `${accentColor}18`,
                      borderWidth: 0,
                      borderColor: 'transparent',
                    },
                  ],
                ]}
                onPress={() => setSelectedType(filter.id)}
                activeOpacity={0.75}
              >
                <IconComp
                  color={isSelected ? accentColor : (isDark ? '#94A3B8' : '#64748B')}
                  size={14}
                  filled={filter.id === 'favorites' && isSelected}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && [styles.filterPillTextActive, { color: accentColor }],
                  ]}
                >
                  {filter.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── MAIN CONTENT LIST ────────────────────────────────────────────── */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={[styles.mainContent, { paddingBottom: Math.max(insets.bottom, 20) + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredResources.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyStateIconBg, { backgroundColor: `${accentColor}14` }]}>
              <SparklesIcon color={accentColor} size={28} />
            </View>
            <Text style={styles.emptyStateTitle}>No resources found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery
                ? `No AI generated resources matched "${searchQuery}"`
                : 'Ask your AI Coach to generate diagrams, summary guides, or flashcard decks!'}
            </Text>
          </View>
        ) : (
          filteredResources.map((res) => {
            const isFav = res.isFavorite;
            const iconBg = getResourceBgColor(res.type);

            return (
              <TouchableOpacity
                key={res.id}
                style={styles.resourceCard}
                onPress={() => setSelectedResource(res)}
                activeOpacity={0.75}
              >
                {/* Top Row: Icon & Favorite Star */}
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.cardIconBox, { backgroundColor: iconBg }]}>
                    {getResourceIcon(res.type)}
                  </View>

                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={() => handleToggleFavorite(res.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <StarIcon color={isFav ? '#F59E0B' : (isDark ? 'rgba(148, 163, 184, 0.35)' : '#CBD5E1')} filled={isFav} size={16} />
                  </TouchableOpacity>
                </View>

                {/* Card Title */}
                <Text style={styles.cardTitle} numberOfLines={2}>{res.title}</Text>

                {/* Bottom Row: Subject Tag & Format */}
                <View style={styles.cardBottomRow}>
                  <View style={[styles.subjectTag, { backgroundColor: isDark ? `${res.subjectColor}25` : `${res.subjectColor}14`, borderWidth: isDark ? 1 : 0, borderColor: `${res.subjectColor}40` }]}>
                    <Text style={[styles.subjectTagText, { color: res.subjectColor }]} numberOfLines={1}>
                      {res.subject}
                    </Text>
                  </View>
                  <Text style={styles.cardMetaText} numberOfLines={1}>
                    {res.format}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* ── RESOURCE FULL PREVIEW MODAL ──────────────────────────────────── */}
      <Modal
        visible={!!selectedResource}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedResource(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedResource(null)}
          />

          {selectedResource && (
            <View
              style={[
                styles.modalSheet,
                { paddingBottom: Math.max(insets.bottom, 16) + 16 },
              ]}
            >
              {/* Sheet Handle */}
              <View style={styles.sheetHandle} />

              {/* Modal Header */}
              <View style={styles.modalHeaderRow}>
                <View style={[styles.cardIconBox, { backgroundColor: getResourceBgColor(selectedResource.type) }]}>
                  {getResourceIcon(selectedResource.type)}
                </View>

                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={styles.modalTitle}>{selectedResource.title}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedResource.subject} • {selectedResource.format} • {selectedResource.size}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedResource(null)}
                  activeOpacity={0.7}
                >
                  <CloseIcon color={isDark ? "#F8FAFC" : "#64748B"} size={18} />
                </TouchableOpacity>
              </View>

              {/* Modal Scroll Content */}
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Generation Prompt Box */}
                <View style={styles.modalPromptBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <SparklesIcon color={accentColor} size={14} />
                    <Text style={[styles.modalPromptHeading, { color: accentColor }]}>
                      GENERATED FROM PROMPT
                    </Text>
                  </View>
                  <Text style={styles.modalPromptBody}>"{selectedResource.prompt}"</Text>
                </View>

                {/* Content Preview Container */}
                <View style={styles.modalContentCard}>
                  <Text style={styles.modalContentHeading}>CONTENT PREVIEW</Text>
                  <Text style={styles.modalContentBody}>{selectedResource.previewContent}</Text>
                </View>

                {/* Tags row */}
                <View style={styles.modalTagsRow}>
                  {selectedResource.tags.map((tag, idx) => (
                    <View key={idx} style={styles.modalTagPill}>
                      <Text style={styles.modalTagPillText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Modal Bottom Actions */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={[styles.modalFavBtn, { borderColor: selectedResource.isFavorite ? '#F59E0B' : (isDark ? '#334155' : '#E2E8F0') }]}
                  onPress={() => handleToggleFavorite(selectedResource.id)}
                  activeOpacity={0.75}
                >
                  <StarIcon
                    color={selectedResource.isFavorite ? '#F59E0B' : (isDark ? '#94A3B8' : '#64748B')}
                    filled={selectedResource.isFavorite}
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalDownloadBtn, { backgroundColor: isDark ? `${accentColor}25` : `${accentColor}14` }]}
                  onPress={() => handleDownload(selectedResource)}
                  activeOpacity={0.8}
                >
                  <DownloadIcon color={accentColor} size={18} />
                  <Text style={[styles.modalDownloadText, { color: accentColor }]}>Save to Device</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalPrimaryBtn, { backgroundColor: accentColor }]}
                  onPress={() => {
                    setSelectedResource(null);
                    if (selectedResource.type === 'flashcards' && onNavigate) {
                      onNavigate('study');
                    } else if (onNavigate) {
                      onNavigate('aicoach');
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalPrimaryText}>
                    {selectedResource.type === 'flashcards' ? '⚡ Study Deck' : '💬 Open in Chat'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const baseResourcesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Toast
  toastCard: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },

  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },

  // Filter Pills Carousel
  filtersWrapper: {
    marginTop: 10,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  filterPillActive: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    fontWeight: '700',
  },

  // Main Scroll
  mainScroll: {
    flex: 1,
    marginTop: 10,
  },
  mainContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Resource Card
  resourceCard: {
    width: '48.2%',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    justifyContent: 'space-between',
    minHeight: 122,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subjectTag: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    maxWidth: '58%',
  },
  subjectTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  formatTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
  },
  formatTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  favBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.2,
    lineHeight: 18,
    flex: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  cardMetaText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  cardPromptInline: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 15,
  },
  promptSnippetBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#CBD5E1',
  },
  promptSnippetLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  promptSnippetText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cardChatOrigin: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
    paddingRight: 4,
  },
  cardActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardActionBtnText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  cardActionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardActionBtnPrimaryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Empty State
  emptyStateContainer: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateIconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyStateSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },

  // Preview Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '85%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 16,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    marginVertical: 12,
  },
  modalPromptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalPromptHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalPromptBody: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalContentHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  modalContentBody: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  modalTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  modalTagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalTagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  modalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalFavBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
  },
  modalDownloadText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalPrimaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

const getResourcesStyles = (isDark, activeAccentColor) => {
  if (!isDark && activeAccentColor === '#6236FF') return baseResourcesStyles;
  return {
    ...baseResourcesStyles,
    container: [
      baseResourcesStyles.container,
      isDark && { backgroundColor: '#0B0F19' },
    ],
    header: [
      baseResourcesStyles.header,
      isDark && { backgroundColor: '#0B0F19', borderBottomWidth: 0, borderBottomColor: 'transparent' },
    ],
    backBtn: [
      baseResourcesStyles.backBtn,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
    ],
    headerTitle: [
      baseResourcesStyles.headerTitle,
      isDark && { color: '#F8FAFC' },
    ],
    headerSubtitle: [
      baseResourcesStyles.headerSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    searchBarContainer: [
      baseResourcesStyles.searchBarContainer,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
    ],
    searchInput: [
      baseResourcesStyles.searchInput,
      isDark && { color: '#F8FAFC' },
    ],
    filtersWrapper: [
      baseResourcesStyles.filtersWrapper,
      isDark && { backgroundColor: '#0B0F19' },
    ],
    filterPill: [
      baseResourcesStyles.filterPill,
      isDark && {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0,
        borderColor: 'transparent',
      },
    ],
    filterPillActive: [
      baseResourcesStyles.filterPillActive,
      isDark && {
        backgroundColor: `${activeAccentColor}25`,
        borderWidth: 0,
        borderColor: 'transparent',
      },
    ],
    filterPillText: [
      baseResourcesStyles.filterPillText,
      isDark && { color: '#94A3B8' },
    ],
    filterPillTextActive: [
      baseResourcesStyles.filterPillTextActive,
      isDark && { color: activeAccentColor },
    ],
    resourceCard: [
      baseResourcesStyles.resourceCard,
      isDark && {
        backgroundColor: 'rgba(30, 41, 59, 0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
        shadowOpacity: 0,
        elevation: 0,
      },
    ],
    cardIconBox: [
      baseResourcesStyles.cardIconBox,
      isDark && { borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' },
    ],
    cardTitle: [
      baseResourcesStyles.cardTitle,
      isDark && { color: '#F8FAFC' },
    ],
    cardMetaText: [
      baseResourcesStyles.cardMetaText,
      isDark && { color: '#94A3B8' },
    ],
    cardPromptInline: [
      baseResourcesStyles.cardPromptInline,
      isDark && { color: '#94A3B8' },
    ],
    promptSnippetBox: [
      baseResourcesStyles.promptSnippetBox,
      isDark && { backgroundColor: '#0F172A', borderLeftColor: activeAccentColor, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', borderLeftWidth: 3 },
    ],
    promptSnippetLabel: [
      baseResourcesStyles.promptSnippetLabel,
      isDark && { color: '#94A3B8' },
    ],
    promptSnippetText: [
      baseResourcesStyles.promptSnippetText,
      isDark && { color: '#CBD5E1' },
    ],
    formatTag: [
      baseResourcesStyles.formatTag,
      isDark && { backgroundColor: '#0F172A', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
    ],
    formatTagText: [
      baseResourcesStyles.formatTagText,
      isDark && { color: '#94A3B8' },
    ],
    cardFooterRow: [
      baseResourcesStyles.cardFooterRow,
      isDark && { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.06)' },
    ],
    cardChatOrigin: [
      baseResourcesStyles.cardChatOrigin,
      isDark && { color: '#94A3B8' },
    ],
    cardActionBtn: [
      baseResourcesStyles.cardActionBtn,
      isDark && {
        backgroundColor: `${activeAccentColor}18`,
        borderWidth: 1,
        borderColor: `${activeAccentColor}30`,
      },
    ],
    cardActionBtnText: [
      baseResourcesStyles.cardActionBtnText,
      isDark && { color: activeAccentColor },
    ],
    emptyStateTitle: [
      baseResourcesStyles.emptyStateTitle,
      isDark && { color: '#F8FAFC' },
    ],
    emptyStateSubtitle: [
      baseResourcesStyles.emptyStateSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    modalSheet: [
      baseResourcesStyles.modalSheet,
      isDark && { backgroundColor: '#0F172A', borderTopWidth: 1, borderColor: '#334155' },
    ],
    sheetHandle: [
      baseResourcesStyles.sheetHandle,
      isDark && { backgroundColor: '#475569' },
    ],
    modalHeaderRow: [
      baseResourcesStyles.modalHeaderRow,
      isDark && { borderBottomWidth: 1, borderBottomColor: '#1E293B' },
    ],
    modalTitle: [
      baseResourcesStyles.modalTitle,
      isDark && { color: '#F8FAFC' },
    ],
    modalSubtitle: [
      baseResourcesStyles.modalSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    modalCloseBtn: [
      baseResourcesStyles.modalCloseBtn,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
    ],
    modalPromptBox: [
      baseResourcesStyles.modalPromptBox,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
    ],
    modalPromptBody: [
      baseResourcesStyles.modalPromptBody,
      isDark && { color: '#CBD5E1' },
    ],
    modalContentCard: [
      baseResourcesStyles.modalContentCard,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
    ],
    modalContentHeading: [
      baseResourcesStyles.modalContentHeading,
      isDark && { color: '#94A3B8' },
    ],
    modalContentBody: [
      baseResourcesStyles.modalContentBody,
      isDark && { color: '#F8FAFC' },
    ],
    modalTagPill: [
      baseResourcesStyles.modalTagPill,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
    ],
    modalTagPillText: [
      baseResourcesStyles.modalTagPillText,
      isDark && { color: '#94A3B8' },
    ],
    modalActionRow: [
      baseResourcesStyles.modalActionRow,
      isDark && { borderTopWidth: 1, borderTopColor: '#1E293B' },
    ],
    modalFavBtn: [
      baseResourcesStyles.modalFavBtn,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
    ],
    modalDownloadBtn: [
      baseResourcesStyles.modalDownloadBtn,
      isDark && { backgroundColor: `${activeAccentColor}20`, borderWidth: 1, borderColor: `${activeAccentColor}40` },
    ],
  };
};
