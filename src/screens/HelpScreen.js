import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Polyline } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { useTheme } from '../theme/themeContext';

// ─── Minimal Icons ────────────────────────────────────────────────────────────

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

const ChevronDownIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

const ChevronUpIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="18 15 12 9 6 15" />
  </Svg>
);

// ─── Expanded FAQs Data ───────────────────────────────────────────────────────

const EXPANDED_FAQS = [
  {
    id: 'ai-1',
    question: 'How do I use AI Coach Branco?',
    answer:
      'Navigate to the AI Coach tab to ask study questions, get step-by-step concept explanations, generate custom flashcards from topics, or build personalized exam revision plans.',
  },
  {
    id: 'ai-2',
    question: 'Can I upload lecture notes or PDFs for Branco to analyze?',
    answer:
      'Yes! In AI Coach, tap the attachment icon (+) to upload PDF notes, textbook chapters, or lecture slides. Branco will extract key takeaways, summarize sections, and generate practice questions.',
  },
  {
    id: 'study-1',
    question: 'How does Spaced Repetition (SRS) work?',
    answer:
      'StudPal utilizes a Leitner 5-box spaced repetition algorithm. Cards you answer correctly advance to higher review intervals (1d, 3d, 7d, 14d, 30d), while cards you struggle with appear more frequently for reinforcement.',
  },
  {
    id: 'study-2',
    question: 'How do I create and manage flashcard decks?',
    answer:
      'Go to the Subjects or Study tab, pick your subject, and tap "+ Add Deck". You can add questions, answers, and formulas, or let AI Coach generate cards automatically from your notes.',
  },
  {
    id: 'focus-1',
    question: 'How does Focus Mode and the Pomodoro timer work?',
    answer:
      'Focus Mode allows you to run customizable study intervals (such as 25m focus / 5m break). You can also enable relaxing background soundscapes like Rain, Forest, White Noise, and Lo-Fi Beats to stay in deep work.',
  },
  {
    id: 'xp-1',
    question: 'How do I earn XP, Level up, and unlock Badges?',
    answer:
      'You earn XP by reviewing flashcards (+10 XP), completing focus sessions (+25 XP), asking Branco questions (+15 XP), and maintaining daily study streaks. Reaching XP milestones promotes you to higher scholar ranks.',
  },
  {
    id: 'streak-1',
    question: 'What happens if I miss a day of my study streak?',
    answer:
      'StudPal features Streak Freeze protection. You can earn freeze tokens by completing consecutive weekly goals, allowing you to preserve your hard-earned streak during busy days.',
  },
  {
    id: 'sched-1',
    question: 'How do I add exam dates and schedule study reminders?',
    answer:
      'Open the Schedule tab and tap "+ Add Event / Exam". StudPal will intelligently distribute revision sessions leading up to your exam and send timely reminder notifications.',
  },
  {
    id: 'comm-1',
    question: 'Can I share decks and study with classmates?',
    answer:
      'Yes! In the Community tab, you can discover public flashcard decks by subject, join live study rooms, share your notes with study groups, and track class leaderboard standings.',
  },
  {
    id: 'off-1',
    question: 'Can I use StudPal completely offline?',
    answer:
      'Yes. Your flashcards, cached notes, and focus timers work completely offline. All your review stats, streaks, and XP will automatically sync to the cloud once you reconnect.',
  },
  {
    id: 'data-1',
    question: 'How do I backup or export my study data?',
    answer:
      'Go to Settings > Data & Storage to export your flashcard decks, study logs, and notes in JSON or CSV format, or clear cached files to free up local storage.',
  },
  {
    id: 'theme-1',
    question: 'How do I toggle Dark Mode or customize theme colors?',
    answer:
      'Go to Profile > Account Settings > Appearance to switch between Dark, Light, or System theme mode, and choose your favorite primary accent color.',
  },
];

export default function HelpScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const { isDark, accentColor } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return EXPANDED_FAQS;
    return EXPANDED_FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.backgroundDark : Colors.backgroundLight },
      ]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? Colors.surfaceDark : '#FFFFFF',
            borderBottomColor: isDark ? Colors.borderDark : Colors.dividerLight,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <ArrowLeftIcon color={isDark ? '#F8FAFC' : '#0F172A'} size={20} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          Help
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Search Bar ── */}
        <View
          style={[
            styles.searchWrap,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? Colors.borderDark : '#E2E8F0',
            },
          ]}
        >
          <SearchIcon color={isDark ? '#94A3B8' : '#64748B'} size={18} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            placeholder="Search help topics, FAQs, SRS, AI..."
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <CloseIcon color={isDark ? '#94A3B8' : '#64748B'} size={16} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── FAQs Section Title ── */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          FREQUENTLY ASKED QUESTIONS ({filteredFaqs.length})
        </Text>

        {/* ── FAQ List ── */}
        <View style={styles.faqList}>
          {filteredFaqs.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                No answers found for "{searchQuery}"
              </Text>
            </View>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <View
                  key={faq.id}
                  style={[
                    styles.faqCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? Colors.borderDark : '#E2E8F0',
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.faqQuestionRow}
                    onPress={() => setExpandedId(isExpanded ? null : faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.faqQuestionText,
                        { color: isDark ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      {faq.question}
                    </Text>
                    {isExpanded ? (
                      <ChevronUpIcon color={accentColor || '#6236FF'} size={18} />
                    ) : (
                      <ChevronDownIcon color={isDark ? '#94A3B8' : '#64748B'} size={18} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View
                      style={[
                        styles.faqAnswerWrap,
                        { borderTopColor: isDark ? '#334155' : '#F1F5F9' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.faqAnswerText,
                          { color: isDark ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
            StudPal v1.4.2 • support@studpal.app
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 2,
  },
  faqList: {
    gap: 10,
    marginBottom: 24,
  },
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  faqAnswerText: {
    fontSize: 13,
    lineHeight: 20,
  },
  emptyWrap: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
  },
});
