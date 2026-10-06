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
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg';
import { libraryService } from '../services/libraryService';
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

const PlusIcon = ({ color = '#FFFFFF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

const UploadCloudIcon = ({ color = '#6236FF', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 16l-4-4-4 4" />
    <Line x1="12" y1="12" x2="12" y2="21" />
    <Path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    <Polyline points="16 16 12 12 8 16" />
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

const AudioIcon = ({ color = '#EC4899', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const StarIcon = ({ color = '#F59E0B', filled = false, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Svg>
);

const SparklesIcon = ({ color = '#6236FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const EyeIcon = ({ color = '#6236FF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const ChatBubbleIcon = ({ color = '#6236FF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

// ─── Filter Categories ───────────────────────────────────────────────────────

const UPLOAD_TYPE_FILTERS = [
  { id: 'all', label: 'All', icon: DocumentIcon },
  { id: 'document', label: 'Docs', icon: DocumentIcon },
  { id: 'image', label: 'Photos', icon: ImageIcon },
  { id: 'audio', label: 'Audio', icon: AudioIcon },
  { id: 'favorites', label: 'Starred', icon: StarIcon },
];

const SUBJECT_OPTIONS = ['Physics', 'Mathematics', 'Chemistry', 'Biology', 'History', 'Computer Science', 'General'];

export default function LibraryScreen({ onBack, onNavigate, settings, user }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isDark, accentColor: contextAccent } = useTheme();
  const accentColor = settings?.accentColor || contextAccent || '#6236FF';
  const styles = useMemo(() => getLibraryStyles(isDark, accentColor), [isDark, accentColor]);

  const [uploads, setUploads] = useState(() => libraryService.getAll());
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New file upload state
  const [newFileTitle, setNewFileTitle] = useState('');
  const [newFileType, setNewFileType] = useState('document');
  const [newFileSubject, setNewFileSubject] = useState('Physics');
  const [newFileDesc, setNewFileDesc] = useState('');

  useEffect(() => {
    const unsub = libraryService.subscribe((list) => setUploads(list));
    return () => unsub();
  }, []);

  const handleToggleFavorite = (id) => {
    libraryService.toggleFavorite(id);
  };

  const handleDeleteFile = (id, title) => {
    libraryService.deleteFile(id);
    if (selectedFile?.id === id) setSelectedFile(null);
    showToast(`Deleted "${title}"`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateUpload = () => {
    if (!newFileTitle.trim()) {
      showToast('Please enter a title for your file');
      return;
    }

    const subjectColors = {
      Physics: '#10B981',
      Mathematics: '#6236FF',
      Chemistry: '#F97316',
      Biology: '#3B82F6',
      History: '#F59E0B',
      'Computer Science': '#EC4899',
      General: '#64748B',
    };

    libraryService.uploadFile({
      title: newFileTitle.trim(),
      type: newFileType,
      subject: newFileSubject,
      subjectColor: subjectColors[newFileSubject] || '#6236FF',
      description: newFileDesc.trim() || 'Uploaded by student for AI study assistance.',
      format: newFileType === 'image' ? 'PNG • 1080p' : newFileType === 'audio' ? 'Audio • MP3' : 'PDF • 10 Pages',
      size: `${(Math.random() * 3 + 0.8).toFixed(1)} MB`,
    });

    setIsUploadModalOpen(false);
    setNewFileTitle('');
    setNewFileDesc('');
    showToast(`Successfully uploaded "${newFileTitle.trim()}"!`);
  };

  const filteredUploads = uploads.filter((item) => {
    // Type Filter
    if (selectedType === 'favorites') {
      if (!item.isFavorite) return false;
    } else if (selectedType !== 'all') {
      if (item.type !== selectedType) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchSummary = item.extractedSummary?.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSubject || matchDesc || matchSummary || matchTags;
    }

    return true;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon color="#3B82F6" size={18} />;
      case 'audio':
        return <AudioIcon color="#EC4899" size={18} />;
      case 'document':
      default:
        return <DocumentIcon color="#10B981" size={18} />;
    }
  };

  const getFileBgColor = (type) => {
    switch (type) {
      case 'image':
        return isDark ? 'rgba(59, 130, 246, 0.18)' : '#EFF6FF';
      case 'audio':
        return isDark ? 'rgba(236, 72, 153, 0.18)' : '#FDF2F8';
      case 'document':
      default:
        return isDark ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5';
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
          <ArrowLeftIcon color={isDark ? '#F8FAFC' : '#0F172A'} size={20} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>{t("library.title", "My Library")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("library.subtitle", { count: uploads.length })}
          </Text>
        </View>

        {/* Upload Action Button */}
        <TouchableOpacity
          style={[styles.uploadBtn, { backgroundColor: accentColor }]}
          onPress={() => setIsUploadModalOpen(true)}
          activeOpacity={0.88}
        >
          <PlusIcon color="#FFFFFF" size={16} />
          <Text style={styles.uploadBtnText}>{t("library.upload", "Upload")}</Text>
        </TouchableOpacity>
      </View>

      {/* ── TOAST NOTIFICATION ───────────────────────────────────────────── */}
      {toastMessage && (
        <View style={[styles.toastCard, { backgroundColor: accentColor }]}>
          <SparklesIcon color="#FFFFFF" size={16} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* ── SEARCH BAR ───────────────────────────────────────────────────── */}
      <View style={styles.searchBarContainer}>
        <SearchIcon color="#94A3B8" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("library.searchPlaceholder", "Search your library...")}
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
          {UPLOAD_TYPE_FILTERS.map((filter) => {
            const isSelected = selectedType === filter.id;
            const IconComp = filter.icon;
            const count =
              filter.id === 'all'
                ? uploads.length
                : filter.id === 'favorites'
                ? uploads.filter((r) => r.isFavorite).length
                : uploads.filter((r) => r.type === filter.id).length;

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
        {filteredUploads.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyStateIconBg, { backgroundColor: `${accentColor}14` }]}>
              <UploadCloudIcon color={accentColor} size={28} />
            </View>
            <Text style={styles.emptyStateTitle}>No uploaded files found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery
                ? `No uploaded files matched "${searchQuery}"`
                : 'Upload PDFs, textbook photos, handwritten homework, or lecture notes to study with your AI Coach!'}
            </Text>

            <TouchableOpacity
              style={[styles.emptyUploadBtn, { backgroundColor: accentColor }]}
              onPress={() => setIsUploadModalOpen(true)}
              activeOpacity={0.85}
            >
              <PlusIcon color="#FFFFFF" size={16} />
              <Text style={styles.emptyUploadBtnText}>Upload Your First File</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredUploads.map((item) => {
            const isFav = item.isFavorite;
            const iconBg = getFileBgColor(item.type);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.uploadCard}
                onPress={() => setSelectedFile(item)}
                activeOpacity={0.75}
              >
                {/* Top Row: Icon & Favorite Star */}
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.cardIconBox, { backgroundColor: iconBg }]}>
                    {getFileIcon(item.type)}
                  </View>

                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={() => handleToggleFavorite(item.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <StarIcon color={isFav ? '#F59E0B' : (isDark ? 'rgba(148, 163, 184, 0.35)' : '#CBD5E1')} filled={isFav} size={16} />
                  </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

                {/* Bottom Row: Subject Tag & Uploaded Time */}
                <View style={styles.cardBottomRow}>
                  <View style={[styles.subjectTag, {
                    backgroundColor: isDark ? `${item.subjectColor}25` : `${item.subjectColor}14`,
                    borderWidth: isDark ? 1 : 0,
                    borderColor: `${item.subjectColor}40`,
                  }]}>
                    <Text style={[styles.subjectTagText, { color: item.subjectColor }]} numberOfLines={1}>
                      {item.subject}
                    </Text>
                  </View>
                  <Text style={styles.cardMetaText} numberOfLines={1}>
                    {getRelativeTime(item.uploadedAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* ── FILE DETAIL & OCR PREVIEW MODAL ──────────────────────────────── */}
      <Modal
        visible={!!selectedFile}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedFile(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedFile(null)}
          />

          {selectedFile && (
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
                <View style={[styles.cardIconBox, { backgroundColor: getFileBgColor(selectedFile.type) }]}>
                  {getFileIcon(selectedFile.type)}
                </View>

                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={styles.modalTitle}>{selectedFile.title}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedFile.subject} • {selectedFile.format} • {selectedFile.size}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedFile(null)}
                  activeOpacity={0.7}
                >
                  <CloseIcon color={isDark ? '#94A3B8' : '#64748B'} size={18} />
                </TouchableOpacity>
              </View>

              {/* Modal Scroll Content */}
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Description */}
                {selectedFile.description && (
                  <View style={styles.modalDescBox}>
                    <Text style={styles.modalDescHeading}>FILE NOTES</Text>
                    <Text style={styles.modalDescBody}>{selectedFile.description}</Text>
                  </View>
                )}

                {/* AI Extracted OCR Summary */}
                {selectedFile.extractedSummary && (
                  <View style={styles.modalOcrCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <SparklesIcon color={accentColor} size={15} />
                      <Text style={[styles.modalOcrHeading, { color: accentColor }]}>
                        AI OCR TEXT & CONCEPTS
                      </Text>
                    </View>
                    <Text style={styles.modalOcrBody}>{selectedFile.extractedSummary}</Text>
                  </View>
                )}

                {/* Tags row */}
                <View style={styles.modalTagsRow}>
                  {selectedFile.tags?.map((tag, idx) => (
                    <View key={idx} style={styles.modalTagPill}>
                      <Text style={styles.modalTagPillText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Modal Bottom Actions */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalDeleteBtn}
                  onPress={() => handleDeleteFile(selectedFile.id, selectedFile.title)}
                  activeOpacity={0.75}
                >
                  <TrashIcon color="#EF4444" size={18} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalFavBtn, { borderColor: selectedFile.isFavorite ? '#F59E0B' : (isDark ? '#334155' : '#E2E8F0') }]}
                  onPress={() => handleToggleFavorite(selectedFile.id)}
                  activeOpacity={0.75}
                >
                  <StarIcon
                    color={selectedFile.isFavorite ? '#F59E0B' : (isDark ? '#94A3B8' : '#64748B')}
                    filled={selectedFile.isFavorite}
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalPrimaryBtn, { backgroundColor: accentColor }]}
                  onPress={() => {
                    setSelectedFile(null);
                    if (onNavigate) onNavigate('aicoach');
                  }}
                  activeOpacity={0.85}
                >
                  <SparklesIcon color="#FFFFFF" size={16} />
                  <Text style={styles.modalPrimaryText}>Ask AI Coach About This</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* ── NEW FILE UPLOAD MODAL ────────────────────────────────────────── */}
      <Modal
        visible={isUploadModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsUploadModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsUploadModalOpen(false)}
          />

          <View style={[styles.uploadModalSheet, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
            <View style={styles.sheetHandle} />

            {/* Modal Header */}
            <View style={styles.uploadModalHeader}>
              <View style={[styles.uploadHeaderIconBg, { backgroundColor: `${accentColor}14` }]}>
                <UploadCloudIcon color={accentColor} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.uploadModalTitle}>Upload Study Material</Text>
                <Text style={styles.uploadModalSubtitle}>Add lecture notes, scanned homework, or PDFs</Text>
              </View>
              <TouchableOpacity onPress={() => setIsUploadModalOpen(false)}>
                <CloseIcon color={isDark ? '#94A3B8' : '#64748B'} size={18} />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {/* Type Selection */}
              <Text style={styles.formFieldLabel}>RESOURCE TYPE</Text>
              <View style={styles.typeSelectorRow}>
                {[
                  { id: 'document', label: 'PDF / Doc', icon: DocumentIcon },
                  { id: 'image', label: 'Photo / Scan', icon: ImageIcon },
                  { id: 'audio', label: 'Audio Memo', icon: AudioIcon },
                ].map((t) => {
                  const isSel = newFileType === t.id;
                  const IconC = t.icon;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[
                        styles.typeSelectBtn,
                        isSel && [styles.typeSelectBtnActive, { borderColor: accentColor, backgroundColor: isDark ? `${accentColor}25` : `${accentColor}12` }],
                      ]}
                      onPress={() => setNewFileType(t.id)}
                      activeOpacity={0.75}
                    >
                      <IconC color={isSel ? accentColor : (isDark ? '#94A3B8' : '#64748B')} size={18} />
                      <Text style={[styles.typeSelectBtnText, isSel && { color: accentColor, fontWeight: '700' }]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Title Input */}
              <Text style={styles.formFieldLabel}>FILE TITLE</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="e.g. Chapter 4 Newton Laws Lecture Notes.pdf"
                placeholderTextColor="#94A3B8"
                value={newFileTitle}
                onChangeText={setNewFileTitle}
              />

              {/* Subject Selector */}
              <Text style={styles.formFieldLabel}>SUBJECT</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                {SUBJECT_OPTIONS.map((sub) => {
                  const isSel = newFileSubject === sub;
                  return (
                    <TouchableOpacity
                      key={sub}
                      style={[
                        styles.subjectPill,
                        isSel && [styles.subjectPillActive, { backgroundColor: isDark ? `${accentColor}25` : `${accentColor}14`, borderColor: accentColor }],
                      ]}
                      onPress={() => setNewFileSubject(sub)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.subjectPillText, isSel && { color: accentColor, fontWeight: '700' }]}>
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Description Input */}
              <Text style={[styles.formFieldLabel, { marginTop: 12 }]}>OPTIONAL NOTES / DESCRIPTION</Text>
              <TextInput
                style={[styles.formTextInput, { height: 72, textAlignVertical: 'top' }]}
                placeholder="Add any specific questions or exam topics to focus on..."
                placeholderTextColor="#94A3B8"
                value={newFileDesc}
                onChangeText={setNewFileDesc}
                multiline
              />
            </ScrollView>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitUploadBtn, { backgroundColor: accentColor }]}
              onPress={handleCreateUpload}
              activeOpacity={0.88}
            >
              <UploadCloudIcon color="#FFFFFF" size={18} />
              <Text style={styles.submitUploadBtnText}>Save & Process with AI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Helper: relative time ──────────────────────────────────────────────────

function getRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const baseStyles = StyleSheet.create({
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
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
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

  // Upload Card
  uploadCard: {
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
  sizeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: '#F8FAFC',
  },
  sizeTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
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
  cardDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 15,
  },
  ocrSnippetBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#CBD5E1',
  },
  ocrSnippetLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ocrSnippetText: {
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
  cardUploadedTime: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
    flex: 1,
    paddingRight: 4,
  },
  cardActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardAskAiBtn: {
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
  cardAskAiBtnText: {
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
    marginBottom: 16,
  },
  emptyUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyUploadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
  modalDescBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalDescHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  modalDescBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  modalOcrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalOcrHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  modalOcrBody: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 20,
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
  modalDeleteBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalPrimaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalPrimaryText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Upload Form Modal
  uploadModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 16,
  },
  uploadModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  uploadHeaderIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  uploadModalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  formFieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 8,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  typeSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeSelectBtnActive: {
    borderWidth: 1.5,
  },
  typeSelectBtnText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  formTextInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
  },
  subjectPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subjectPillActive: {
    borderWidth: 1.2,
  },
  subjectPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  submitUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    marginTop: 14,
  },
  submitUploadBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

const getLibraryStyles = (isDark, accentColor) => {
  if (!isDark) return baseStyles;
  return {
    ...baseStyles,
    container: [baseStyles.container, { backgroundColor: '#0B0F19' }],
    header: [baseStyles.header, { backgroundColor: '#0B0F19', borderBottomWidth: 0, borderBottomColor: 'transparent' }],
    backBtn: [baseStyles.backBtn, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    headerTitle: [baseStyles.headerTitle, { color: '#F8FAFC' }],
    headerSubtitle: [baseStyles.headerSubtitle, { color: '#94A3B8' }],
    searchBarContainer: [baseStyles.searchBarContainer, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    searchInput: [baseStyles.searchInput, { color: '#F8FAFC' }],
    filterPill: [
      baseStyles.filterPill,
      {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0,
        borderColor: 'transparent',
      },
    ],
    filterPillActive: [
      baseStyles.filterPillActive,
      {
        backgroundColor: `${accentColor}25`,
        borderWidth: 0,
        borderColor: 'transparent',
      },
    ],
    filterPillText: [baseStyles.filterPillText, { color: '#94A3B8' }],
    filterPillTextActive: [baseStyles.filterPillTextActive, { color: accentColor }],
    uploadCard: [
      baseStyles.uploadCard,
      {
        backgroundColor: 'rgba(30, 41, 59, 0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
        shadowOpacity: 0,
        elevation: 0,
      },
    ],
    cardIconBox: [baseStyles.cardIconBox, { borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' }],
    cardTitle: [baseStyles.cardTitle, { color: '#F8FAFC' }],
    cardMetaText: [baseStyles.cardMetaText, { color: '#94A3B8' }],
    cardDesc: [baseStyles.cardDesc, { color: '#94A3B8' }],
    ocrSnippetBox: [baseStyles.ocrSnippetBox, { backgroundColor: '#0F172A', borderLeftColor: accentColor, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', borderLeftWidth: 3 }],
    ocrSnippetLabel: [baseStyles.ocrSnippetLabel, { color: '#94A3B8' }],
    ocrSnippetText: [baseStyles.ocrSnippetText, { color: '#CBD5E1' }],
    cardFooterRow: [baseStyles.cardFooterRow, { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.06)' }],
    cardUploadedTime: [baseStyles.cardUploadedTime, { color: '#94A3B8' }],
    cardAskAiBtn: [
      baseStyles.cardAskAiBtn,
      {
        backgroundColor: `${accentColor}18`,
        borderWidth: 1,
        borderColor: `${accentColor}30`,
      },
    ],
    cardAskAiBtnText: [baseStyles.cardAskAiBtnText, { color: accentColor }],
    formatTag: [baseStyles.formatTag, { backgroundColor: '#0F172A', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }],
    formatTagText: [baseStyles.formatTagText, { color: '#94A3B8' }],
    sizeTag: [baseStyles.sizeTag, { backgroundColor: '#0F172A', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }],
    sizeTagText: [baseStyles.sizeTagText, { color: '#94A3B8' }],
    emptyStateTitle: [baseStyles.emptyStateTitle, { color: '#F8FAFC' }],
    emptyStateSubtitle: [baseStyles.emptyStateSubtitle, { color: '#94A3B8' }],
    modalSheet: [baseStyles.modalSheet, { backgroundColor: '#0F172A', borderTopWidth: 1, borderColor: '#334155' }],
    sheetHandle: [baseStyles.sheetHandle, { backgroundColor: '#475569' }],
    modalHeaderRow: [baseStyles.modalHeaderRow, { borderBottomWidth: 1, borderBottomColor: '#1E293B' }],
    modalTitle: [baseStyles.modalTitle, { color: '#F8FAFC' }],
    modalSubtitle: [baseStyles.modalSubtitle, { color: '#94A3B8' }],
    modalCloseBtn: [baseStyles.modalCloseBtn, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    modalDescBox: [baseStyles.modalDescBox, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    modalDescHeading: [baseStyles.modalDescHeading, { color: '#94A3B8' }],
    modalDescBody: [baseStyles.modalDescBody, { color: '#CBD5E1' }],
    modalOcrCard: [baseStyles.modalOcrCard, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    modalOcrHeading: [baseStyles.modalOcrHeading, { color: accentColor }],
    modalOcrBody: [baseStyles.modalOcrBody, { color: '#F8FAFC' }],
    modalTagPill: [baseStyles.modalTagPill, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    modalTagPillText: [baseStyles.modalTagPillText, { color: '#94A3B8' }],
    modalActionRow: [baseStyles.modalActionRow, { borderTopWidth: 1, borderTopColor: '#1E293B' }],
    modalDeleteBtn: [baseStyles.modalDeleteBtn, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' }],
    modalFavBtn: [baseStyles.modalFavBtn, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    uploadModalSheet: [baseStyles.uploadModalSheet, { backgroundColor: '#0F172A', borderTopWidth: 1, borderColor: '#334155' }],
    uploadModalHeader: [baseStyles.uploadModalHeader, { borderBottomWidth: 1, borderBottomColor: '#1E293B' }],
    uploadModalTitle: [baseStyles.uploadModalTitle, { color: '#F8FAFC' }],
    uploadModalSubtitle: [baseStyles.uploadModalSubtitle, { color: '#94A3B8' }],
    formFieldLabel: [baseStyles.formFieldLabel, { color: '#94A3B8' }],
    typeSelectBtn: [baseStyles.typeSelectBtn, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    typeSelectBtnActive: [baseStyles.typeSelectBtnActive, { backgroundColor: `${accentColor}20`, borderColor: accentColor }],
    typeSelectBtnText: [baseStyles.typeSelectBtnText, { color: '#94A3B8' }],
    formTextInput: [baseStyles.formTextInput, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', color: '#F8FAFC' }],
    subjectPill: [baseStyles.subjectPill, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }],
    subjectPillActive: [baseStyles.subjectPillActive, { backgroundColor: `${accentColor}20`, borderColor: accentColor }],
    subjectPillText: [baseStyles.subjectPillText, { color: '#94A3B8' }],
  };
};
