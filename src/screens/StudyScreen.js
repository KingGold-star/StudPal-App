import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import Modal from "../components/CustomModal";
import { gamificationService } from "../services/gamification/gamificationService";
import { studyService } from "../services/studyService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ size = 20, color = "#0F172A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const BrainIcon = ({ size = 22, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04" />
    <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04" />
  </Svg>
);

const TargetIcon = ({ size = 22, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const NotebookIcon = ({ size = 22, color = "#F97316" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <Path d="M8 7h8" />
    <Path d="M8 11h6" />
  </Svg>
);

const SparkleIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1C12 8 16 12 23 12 16 12 12 16 12 23 12 16 8 12 1 12 8 12 12 8 12 1Z" />
  </Svg>
);

const PlayIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M8 5v14l11-7z" />
  </Svg>
);

const PauseIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </Svg>
);

const RotateCcwIcon = ({ size = 16, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 4v6h6" />
    <Path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </Svg>
);

const VolumeIcon = ({ size = 18, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </Svg>
);

const LightbulbIcon = ({ size = 18, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18h6" />
    <Path d="M10 22h4" />
    <Path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.59 2.96 1.5 4 .76.76 1.23 1.52 1.41 2.5h6.18z" />
  </Svg>
);

const BookmarkIcon = ({ size = 18, color = "#64748B", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const SearchIcon = ({ size = 18, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const PlusIcon = ({ size = 18, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14" />
    <Path d="M5 12h14" />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

const AlertTriangleIcon = ({ size = 20, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Path d="M12 9v4" />
    <Path d="M12 17h.01" />
  </Svg>
);

const EditIcon = ({ size = 16, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

const TrashIcon = ({ size = 16, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = "#94A3B8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

// ─── MAIN STUDY SCREEN COMPONENT ─────────────────────────────────────────────
export default function StudyScreen({ onSelectTab, onNavigate }) {
  const insets = useSafeAreaInsets();

  // ── INTERNAL NAVIGATION & CONTEXT STATE ────────────────────────────────────
  // viewState: 'overview' | 'review' | 'quiz' | 'notes'
  const [viewState, setViewState] = useState("overview");

  // Context filters passed between features
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // ── REFRESH TRIGGER ────────────────────────────────────────────────────────
  const [dataVersion, setDataVersion] = useState(0);
  const refreshData = () => setDataVersion((v) => v + 1);

  // ── SRS REVIEW STATE ───────────────────────────────────────────────────────
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [easyCount, setEasyCount] = useState(0);

  // Pomodoro Timer
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 min
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start SRS Review Session
  const handleStartReviewSession = (subjId = null, topId = null) => {
    const sessionCards = studyService.getCardsForReview(subjId, topId);
    setCards(sessionCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsBookmarked(false);
    setIsSessionComplete(false);
    setXpEarned(0);
    setCardsReviewed(0);
    setEasyCount(0);
    setTimerSeconds(1500);
    setIsTimerRunning(true);
    setSelectedSubjectId(subjId);
    setSelectedTopicId(topId);
    setViewState("review");
  };

  const currentCard = cards[currentIndex] || cards[0];

  const handleSM2Rating = (ratingType, xpAmount) => {
    setXpEarned((prev) => prev + xpAmount);
    setCardsReviewed((prev) => prev + 1);
    if (ratingType === "Easy") setEasyCount((prev) => prev + 1);

    setIsFlipped(false);
    setShowHint(false);
    setIsBookmarked(false);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionComplete(true);
      setIsTimerRunning(false);
      gamificationService.recordFlashcardReview(cardsReviewed + 1);
      refreshData();
    }
  };

  const handleAudioListen = () => {
    if (currentCard) {
      Alert.alert("🔊 Audio Pronunciation", `Reading card: "${currentCard.question}"`);
    }
  };

  // ── QUIZ STATE ─────────────────────────────────────────────────────────────
  // quizSubState: 'select' | 'active' | 'results'
  const [quizSubState, setQuizSubState] = useState("select");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionIndex: optionIndex }
  const [quizScoreResult, setQuizScoreResult] = useState(null);

  const handleStartQuiz = (subjId = null, topId = null) => {
    setSelectedSubjectId(subjId);
    setSelectedTopicId(topId);
    setQuizSubState("select");
    setViewState("quiz");
  };

  const handleLaunchQuizEngine = (quizObj) => {
    setActiveQuiz(quizObj);
    setQuizQuestionIndex(0);
    setQuizSelectedOption(null);
    setQuizAnswers({});
    setQuizScoreResult(null);
    setQuizSubState("active");
  };

  const handleOptionSelect = (optionIndex) => {
    setQuizSelectedOption(optionIndex);
    setQuizAnswers((prev) => ({ ...prev, [quizQuestionIndex]: optionIndex }));
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuiz) return;
    if (quizQuestionIndex < activeQuiz.questions.length - 1) {
      setQuizQuestionIndex((prev) => prev + 1);
      setQuizSelectedOption(quizAnswers[quizQuestionIndex + 1] ?? null);
    } else {
      // Submit Quiz
      let correct = 0;
      activeQuiz.questions.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correctIndex) {
          correct += 1;
        }
      });
      const total = activeQuiz.questions.length;
      const scorePct = Math.round((correct / total) * 100);

      // Record in service & adjust topic mastery/SRS priorities
      const resultObj = studyService.recordQuizAttempt({
        quizId: activeQuiz.id,
        subjectId: activeQuiz.subjectId,
        topicId: activeQuiz.topicId,
        topicName: activeQuiz.topicName,
        score: scorePct,
        correctCount: correct,
        totalQuestions: total,
      });

      gamificationService.addXp(scorePct >= 70 ? 30 : 15, "Quiz Attempt");
      setQuizScoreResult(resultObj);
      setQuizSubState("results");
      refreshData();
    }
  };

  // ── NOTES STATE ────────────────────────────────────────────────────────────
  const [notesSearch, setNotesSearch] = useState("");
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteFormTitle, setNoteFormTitle] = useState("");
  const [noteFormSubjectId, setNoteFormSubjectId] = useState("math");
  const [noteFormTopicId, setNoteFormTopicId] = useState("m1");
  const [noteFormContent, setNoteFormContent] = useState("");

  const handleOpenNotes = (subjId = null, topId = null) => {
    setSelectedSubjectId(subjId);
    setSelectedTopicId(topId);
    setViewState("notes");
  };

  const handleCreateNoteModal = (subjId = null, topId = null) => {
    const sId = subjId || selectedSubjectId || "math";
    const subjObj = studyService.subjects.find((s) => s.id === sId) || studyService.subjects[0];
    const tId = topId || selectedTopicId || subjObj.topics[0]?.id || "m1";

    setEditingNote(null);
    setNoteFormTitle("");
    setNoteFormSubjectId(sId);
    setNoteFormTopicId(tId);
    setNoteFormContent("");
    setIsNoteModalVisible(true);
  };

  const handleEditNoteModal = (note) => {
    setEditingNote(note);
    setNoteFormTitle(note.title);
    setNoteFormSubjectId(note.subjectId);
    setNoteFormTopicId(note.topicId);
    setNoteFormContent(note.content);
    setIsNoteModalVisible(true);
  };

  const handleSaveNote = () => {
    if (!noteFormTitle.trim()) {
      Alert.alert("Required", "Please enter a title for your note.");
      return;
    }
    studyService.saveNote({
      id: editingNote?.id,
      title: noteFormTitle,
      subjectId: noteFormSubjectId,
      topicId: noteFormTopicId,
      content: noteFormContent,
    });
    setIsNoteModalVisible(false);
    refreshData();
  };

  const handleDeleteNote = (noteId) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          studyService.deleteNote(noteId);
          refreshData();
        },
      },
    ]);
  };

  // Dynamic Data & Recommendations
  const dueCardsCount = studyService.getDueCardsCount();
  const recentQuizAvg = studyService.getRecentQuizAvg();
  const availableQuizzes = studyService.getAvailableQuizzes(selectedSubjectId, selectedTopicId);
  const notesList = studyService.getNotes(selectedSubjectId, selectedTopicId, notesSearch);
  const recommendations = useMemo(() => studyService.getSmartRecommendations(), [dataVersion]);

  // Subject topics lookup helper for Form Modal
  const activeFormSubject = studyService.subjects.find((s) => s.id === noteFormSubjectId) || studyService.subjects[0];

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── TOP HEADER (PERSISTENT BRAND HEADER) ─────────────────────── */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeftRow}>
          {viewState !== "overview" ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                if (viewState === "quiz" && quizSubState === "active") {
                  setQuizSubState("select");
                } else {
                  setViewState("overview");
                }
              }}
            >
              <ChevronLeftIcon size={20} color="#0F172A" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => (onNavigate ? onNavigate("dashboard") : onSelectTab("home"))}
            >
              <ChevronLeftIcon size={20} color="#0F172A" />
            </TouchableOpacity>
          )}

          <View>
            <Text style={styles.headerTitle}>
              {viewState === "overview" && "Study Hub"}
              {viewState === "review" && (currentCard?.category || "SRS Review")}
              {viewState === "quiz" && "Quiz System"}
              {viewState === "notes" && "Notes Library"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {viewState === "overview" && "Review, test yourself, and master every topic."}
              {viewState === "review" && "Spaced Repetition Review (SM-2)"}
              {viewState === "quiz" && "Topic-based testing connected to SRS"}
              {viewState === "notes" && "Organized by Subject & Topic"}
            </Text>
          </View>
        </View>

        {/* Timer Pill when in Review Mode */}
        {viewState === "review" && (
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{formatTimer(timerSeconds)}</Text>
            <TouchableOpacity
              style={styles.timerToggleBtn}
              onPress={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── VIEW 1: OVERVIEW / STUDY HUB LANDING PAGE ─────────────────── */}
      {viewState === "overview" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}
        >
          {/* 3 Prominent Feature Hub Cards */}
          <View style={styles.hubCardsGrid}>
            {/* 1. REVIEW CARD */}
            <TouchableOpacity
              style={styles.hubCard}
              onPress={() => handleStartReviewSession()}
              activeOpacity={0.88}
            >
              <View style={styles.hubCardHeader}>
                <View style={[styles.hubIconCircle, { backgroundColor: "#F0EEFF" }]}>
                  <BrainIcon size={22} color="#6236FF" />
                </View>
                <View style={styles.badgePillPrimary}>
                  <Text style={styles.badgePillTextPrimary}>SRS</Text>
                </View>
              </View>
              <Text style={styles.hubCardTitle}>Review</Text>
              <Text style={styles.hubCardDescription}>
                Review your flashcards and stay on track.
              </Text>
              <View style={styles.hubCardStatsRow}>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>{dueCardsCount}</Text>
                  <Text style={styles.hubStatLabel}>Cards Due</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>3</Text>
                  <Text style={styles.hubStatLabel}>Needs Review</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>8 Days</Text>
                  <Text style={styles.hubStatLabel}>Streak</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 2. QUIZ CARD */}
            <TouchableOpacity
              style={styles.hubCard}
              onPress={() => handleStartQuiz()}
              activeOpacity={0.88}
            >
              <View style={styles.hubCardHeader}>
                <View style={[styles.hubIconCircle, { backgroundColor: "#E8FDF0" }]}>
                  <TargetIcon size={22} color="#10B981" />
                </View>
                <View style={[styles.badgePillPrimary, { backgroundColor: "#E8FDF0" }]}>
                  <Text style={[styles.badgePillTextPrimary, { color: "#10B981" }]}>TEST</Text>
                </View>
              </View>
              <Text style={styles.hubCardTitle}>Quiz</Text>
              <Text style={styles.hubCardDescription}>
                Test what you know and discover weak areas.
              </Text>
              <View style={styles.hubCardStatsRow}>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>{availableQuizzes.length}</Text>
                  <Text style={styles.hubStatLabel}>Quizzes</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>{recentQuizAvg}%</Text>
                  <Text style={styles.hubStatLabel}>Avg Score</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>Connected</Text>
                  <Text style={styles.hubStatLabel}>To SRS</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 3. NOTES CARD */}
            <TouchableOpacity
              style={styles.hubCard}
              onPress={() => handleOpenNotes()}
              activeOpacity={0.88}
            >
              <View style={styles.hubCardHeader}>
                <View style={[styles.hubIconCircle, { backgroundColor: "#FFF3E8" }]}>
                  <NotebookIcon size={22} color="#F97316" />
                </View>
                <View style={[styles.badgePillPrimary, { backgroundColor: "#FFF3E8" }]}>
                  <Text style={[styles.badgePillTextPrimary, { color: "#F97316" }]}>NOTES</Text>
                </View>
              </View>
              <Text style={styles.hubCardTitle}>Notes</Text>
              <Text style={styles.hubCardDescription}>
                Create and organize notes for every subject.
              </Text>
              <View style={styles.hubCardStatsRow}>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>{studyService.notes.length}</Text>
                  <Text style={styles.hubStatLabel}>Saved Notes</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>Subject</Text>
                  <Text style={styles.hubStatLabel}>Organized</Text>
                </View>
                <View style={styles.hubStatBadge}>
                  <Text style={styles.hubStatValue}>Linked</Text>
                  <Text style={styles.hubStatLabel}>To SRS</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* SMART RECOMMENDATIONS SECTION */}
          <View style={styles.recommendationsSection}>
            <View style={styles.sectionHeaderRow}>
              <SparkleIcon size={18} color="#6236FF" />
              <Text style={styles.sectionTitle}>Recommended for You</Text>
            </View>

            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.recommendationCard}>
                <View style={styles.recTextGroup}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recReason}>{rec.reason}</Text>
                </View>
                <TouchableOpacity
                  style={styles.recActionBtn}
                  onPress={() => {
                    if (rec.targetView === "review") {
                      handleStartReviewSession(rec.subjectId, rec.topicId);
                    } else if (rec.targetView === "quiz") {
                      handleStartQuiz(rec.subjectId, rec.topicId);
                    } else if (rec.targetView === "notes") {
                      handleOpenNotes(rec.subjectId, rec.topicId);
                    }
                  }}
                >
                  <Text style={styles.recActionBtnText}>{rec.actionText}</Text>
                  <ChevronRightIcon size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── VIEW 2: SRS REVIEW SYSTEM ──────────────────────────────────── */}
      {viewState === "review" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}
        >
          {!isSessionComplete ? (
            <View style={styles.sessionContainer}>
              {/* Progress Bar */}
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.round(((currentIndex + 1) / (cards.length || 1)) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {currentIndex + 1} / {cards.length || 1}
                </Text>
              </View>

              {/* 3D Interactive Flashcard */}
              <TouchableOpacity
                style={[styles.flashcard, isFlipped ? styles.flashcardBack : styles.flashcardFront]}
                onPress={() => setIsFlipped(!isFlipped)}
                activeOpacity={0.92}
              >
                {/* Header Badge & Bookmark */}
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.categoryBadge, isFlipped && styles.categoryBadgeBack]}>
                    <Text style={[styles.categoryBadgeText, isFlipped && styles.categoryBadgeTextBack]}>
                      {isFlipped ? "SOLUTION & REASONING" : currentCard?.category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsBookmarked(!isBookmarked)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <BookmarkIcon size={20} color={isBookmarked ? "#F59E0B" : "#94A3B8"} filled={isBookmarked} />
                  </TouchableOpacity>
                </View>

                {/* Card Body */}
                <View style={styles.cardBodyContainer}>
                  {!isFlipped ? (
                    <View style={styles.frontContent}>
                      <Text style={styles.questionLabel}>QUESTION</Text>
                      <Text style={styles.questionText}>{currentCard?.question}</Text>

                      {showHint && (
                        <View style={styles.hintBox}>
                          <LightbulbIcon size={16} color="#D97706" />
                          <Text style={styles.hintText}>{currentCard?.hint}</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.backContent}>
                      <Text style={styles.answerLabel}>CORRECT ANSWER</Text>
                      <Text style={styles.answerText}>{currentCard?.answer}</Text>

                      <View style={styles.explanationBox}>
                        <Text style={styles.explanationTitle}>Step-by-Step Explanation:</Text>
                        <Text style={styles.explanationBody}>{currentCard?.explanation}</Text>
                      </View>

                      <View style={styles.takeawayBox}>
                        <Text style={styles.takeawayTitle}>💡 Key Takeaway</Text>
                        <Text style={styles.takeawayBody}>{currentCard?.takeaway}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Footer Controls */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.audioBtn} onPress={handleAudioListen}>
                    <VolumeIcon size={16} color="#6236FF" />
                    <Text style={styles.audioBtnText}>Listen</Text>
                  </TouchableOpacity>

                  <Text style={styles.tapFlipText}>
                    {isFlipped ? "Tap card to flip back" : "Tap card to reveal answer"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Quick Tool Chips (Front) */}
              {!isFlipped && (
                <View style={styles.toolsRow}>
                  <TouchableOpacity
                    style={styles.toolChip}
                    onPress={() => setShowHint(!showHint)}
                  >
                    <LightbulbIcon size={16} color="#D97706" />
                    <Text style={styles.toolChipText}>{showHint ? "Hide Hint" : "Show Hint"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toolChipAi}
                    onPress={() => (onNavigate ? onNavigate("aicoach") : onSelectTab("aicoach"))}
                  >
                    <SparkleIcon size={15} color="#6236FF" />
                    <Text style={styles.toolChipAiText}>Ask Branco</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* SM-2 Rating Bar & Notes Shortcut (Back) */}
              {isFlipped && (
                <View style={styles.sm2RatingContainer}>
                  <Text style={styles.sm2RatingHeader}>How well did you recall this?</Text>

                  <View style={styles.sm2ButtonsRow}>
                    <TouchableOpacity
                      style={[styles.sm2Btn, { backgroundColor: "#FEF2F2", borderColor: "#FECACA" }]}
                      onPress={() => handleSM2Rating("Again", 5)}
                    >
                      <Text style={[styles.sm2BtnTitle, { color: "#EF4444" }]}>Again</Text>
                      <Text style={styles.sm2BtnInterval}>&lt; 1 min</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.sm2Btn, { backgroundColor: "#FFF7ED", borderColor: "#FFEDD5" }]}
                      onPress={() => handleSM2Rating("Hard", 10)}
                    >
                      <Text style={[styles.sm2BtnTitle, { color: "#F97316" }]}>Hard</Text>
                      <Text style={styles.sm2BtnInterval}>2 days</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.sm2Btn, { backgroundColor: "#F0FDF4", borderColor: "#DCFCE7" }]}
                      onPress={() => handleSM2Rating("Good", 15)}
                    >
                      <Text style={[styles.sm2BtnTitle, { color: "#10B981" }]}>Good</Text>
                      <Text style={styles.sm2BtnInterval}>4 days</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.sm2Btn, { backgroundColor: "#F0EEFF", borderColor: "#E2D9FF" }]}
                      onPress={() => handleSM2Rating("Easy", 25)}
                    >
                      <Text style={[styles.sm2BtnTitle, { color: "#6236FF" }]}>Easy</Text>
                      <Text style={styles.sm2BtnInterval}>7 days</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Notes Shortcut Button */}
                  <TouchableOpacity
                    style={styles.notesShortcutBtn}
                    onPress={() => handleOpenNotes(currentCard?.subjectId, currentCard?.topicId)}
                  >
                    <NotebookIcon size={16} color="#F97316" />
                    <Text style={styles.notesShortcutBtnText}>View / Add Topic Notes</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            /* SESSION COMPLETE REWARD & CONNECTED ENTRY POINTS VIEW */
            <View style={styles.rewardContainer}>
              <View style={styles.rewardBadgeCircle}>
                <SparkleIcon size={32} color="#6236FF" />
              </View>
              <Text style={styles.rewardTitle}>Review Complete 🎉</Text>
              <Text style={styles.rewardSubtitle}>
                Great job! You reviewed {cardsReviewed} cards using Spaced Repetition.
              </Text>

              <View style={styles.rewardStatsRow}>
                <View style={styles.rewardStatCard}>
                  <Text style={styles.rewardStatValue}>+{xpEarned} XP</Text>
                  <Text style={styles.rewardStatLabel}>XP Earned</Text>
                </View>
                <View style={styles.rewardStatCard}>
                  <Text style={styles.rewardStatValue}>
                    {Math.round((easyCount / (cards.length || 1)) * 100)}%
                  </Text>
                  <Text style={styles.rewardStatLabel}>Mastery Rate</Text>
                </View>
                <View style={styles.rewardStatCard}>
                  <Text style={styles.rewardStatValue}>8 Days</Text>
                  <Text style={styles.rewardStatLabel}>Streak</Text>
                </View>
              </View>

              {/* 3 CONNECTED ACTION BUTTONS */}
              <View style={styles.connectedActionsContainer}>
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={() => handleStartReviewSession(selectedSubjectId, selectedTopicId)}
                >
                  <RotateCcwIcon size={18} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Continue Reviewing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryActionBtn, { borderColor: "#10B981", backgroundColor: "#E8FDF0" }]}
                  onPress={() => handleStartQuiz(selectedSubjectId, selectedTopicId)}
                >
                  <TargetIcon size={18} color="#10B981" />
                  <Text style={[styles.secondaryActionBtnText, { color: "#10B981" }]}>
                    Take a Quiz on this Topic
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryActionBtn, { borderColor: "#F97316", backgroundColor: "#FFF3E8" }]}
                  onPress={() => handleOpenNotes(selectedSubjectId, selectedTopicId)}
                >
                  <NotebookIcon size={18} color="#F97316" />
                  <Text style={[styles.secondaryActionBtnText, { color: "#F97316" }]}>
                    Review Topic Notes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── VIEW 3: QUIZ SYSTEM ────────────────────────────────────────── */}
      {viewState === "quiz" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}
        >
          {quizSubState === "select" && (
            <View style={styles.quizSetupContainer}>
              <Text style={styles.quizSetupTitle}>Choose a Quiz Topic</Text>
              <Text style={styles.quizSetupSubtitle}>
                Select a subject to test your recall. Quizzes directly inform your SRS review priorities.
              </Text>

              {/* Available Quizzes List */}
              <View style={styles.quizList}>
                {availableQuizzes.map((quiz) => (
                  <View key={quiz.id} style={styles.quizCard}>
                    <View style={styles.quizCardInfo}>
                      <View style={styles.quizTopicBadge}>
                        <Text style={styles.quizTopicBadgeText}>{quiz.topicName}</Text>
                      </View>
                      <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                      <Text style={styles.quizCardMeta}>
                        {quiz.questionCount} Questions • Multiple Choice
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.startQuizBtn}
                      onPress={() => handleLaunchQuizEngine(quiz)}
                    >
                      <Text style={styles.startQuizBtnText}>Start Quiz</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {quizSubState === "active" && activeQuiz && (
            <View style={styles.quizActiveContainer}>
              {/* Question Progress */}
              <View style={styles.quizProgressHeader}>
                <Text style={styles.quizQuestionCounter}>
                  Question {quizQuestionIndex + 1} of {activeQuiz.questions.length}
                </Text>
                <View style={styles.quizTagPill}>
                  <Text style={styles.quizTagPillText}>{activeQuiz.topicName}</Text>
                </View>
              </View>

              {/* Question Box */}
              <View style={styles.quizQuestionCard}>
                <Text style={styles.quizQuestionPrompt}>
                  {activeQuiz.questions[quizQuestionIndex].question}
                </Text>
              </View>

              {/* Options */}
              <View style={styles.quizOptionsList}>
                {activeQuiz.questions[quizQuestionIndex].options.map((optText, optIdx) => {
                  const isSelected = quizSelectedOption === optIdx;
                  return (
                    <TouchableOpacity
                      key={optIdx}
                      style={[
                        styles.quizOptionCard,
                        isSelected && styles.quizOptionCardSelected,
                      ]}
                      onPress={() => handleOptionSelect(optIdx)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.quizOptionRadio, isSelected && styles.quizOptionRadioSelected]}>
                        {isSelected && <View style={styles.quizOptionRadioInner} />}
                      </View>
                      <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                        {optText}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Next / Submit Button */}
              <TouchableOpacity
                style={[
                  styles.primaryActionBtn,
                  quizSelectedOption === null && { opacity: 0.5 },
                ]}
                disabled={quizSelectedOption === null}
                onPress={handleNextQuizQuestion}
              >
                <Text style={styles.primaryActionBtnText}>
                  {quizQuestionIndex < activeQuiz.questions.length - 1 ? "Next Question" : "Submit Quiz"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {quizSubState === "results" && quizScoreResult && (
            <View style={styles.quizResultsContainer}>
              <View style={styles.rewardBadgeCircle}>
                {quizScoreResult.score >= 70 ? (
                  <CheckCircleIcon size={36} color="#10B981" />
                ) : (
                  <AlertTriangleIcon size={36} color="#EF4444" />
                )}
              </View>

              <Text style={styles.rewardTitle}>
                {quizScoreResult.score >= 70 ? "Great Performance! 🎉" : "Needs Review 📚"}
              </Text>
              <Text style={styles.rewardSubtitle}>
                You scored {quizScoreResult.score}% ({quizScoreResult.correctCount} / {quizScoreResult.totalQuestions} correct) on {quizScoreResult.topicName}.
              </Text>

              {/* Weak Topic Alert if score < 70% */}
              {quizScoreResult.score < 70 && (
                <View style={styles.weakTopicAlertBox}>
                  <AlertTriangleIcon size={20} color="#EF4444" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.weakTopicAlertTitle}>SRS Flashcards Prioritized</Text>
                    <Text style={styles.weakTopicAlertBody}>
                      Because you struggled with {quizScoreResult.topicName}, related flashcards have been moved to high priority.
                    </Text>
                  </View>
                </View>
              )}

              {/* Results Action Buttons */}
              <View style={styles.connectedActionsContainer}>
                <TouchableOpacity
                  style={[styles.primaryActionBtn, { backgroundColor: "#6236FF" }]}
                  onPress={() => handleStartReviewSession(quizScoreResult.subjectId, quizScoreResult.topicId)}
                >
                  <BrainIcon size={18} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Review SRS Flashcards</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryActionBtn, { borderColor: "#F97316", backgroundColor: "#FFF3E8" }]}
                  onPress={() => handleOpenNotes(quizScoreResult.subjectId, quizScoreResult.topicId)}
                >
                  <NotebookIcon size={18} color="#F97316" />
                  <Text style={[styles.secondaryActionBtnText, { color: "#F97316" }]}>
                    Open Topic Notes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryActionBtn}
                  onPress={() => setViewState("overview")}
                >
                  <Text style={styles.secondaryActionBtnText}>Back to Study Hub</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── VIEW 4: NOTES SYSTEM ───────────────────────────────────────── */}
      {viewState === "notes" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}
        >
          {/* Header Action Bar */}
          <View style={styles.notesHeaderBar}>
            <View style={styles.searchBarContainer}>
              <SearchIcon size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search notes..."
                placeholderTextColor="#94A3B8"
                value={notesSearch}
                onChangeText={setNotesSearch}
              />
            </View>

            <TouchableOpacity
              style={styles.createNoteBtn}
              onPress={() => handleCreateNoteModal(selectedSubjectId, selectedTopicId)}
            >
              <PlusIcon size={18} color="#FFFFFF" />
              <Text style={styles.createNoteBtnText}>New Note</Text>
            </TouchableOpacity>
          </View>

          {/* Notes List */}
          <View style={styles.notesList}>
            {notesList.length === 0 ? (
              <View style={styles.emptyNotesContainer}>
                <NotebookIcon size={40} color="#CBD5E1" />
                <Text style={styles.emptyNotesTitle}>No Notes Found</Text>
                <Text style={styles.emptyNotesSubtitle}>
                  Create your first note for this subject or topic to keep your study materials organized.
                </Text>
                <TouchableOpacity
                  style={[styles.primaryActionBtn, { marginTop: 16 }]}
                  onPress={() => handleCreateNoteModal(selectedSubjectId, selectedTopicId)}
                >
                  <Text style={styles.primaryActionBtnText}>Create Note</Text>
                </TouchableOpacity>
              </View>
            ) : (
              notesList.map((note) => (
                <View key={note.id} style={styles.noteCard}>
                  <View style={styles.noteCardHeader}>
                    <View style={styles.noteTopicBadge}>
                      <Text style={styles.noteTopicBadgeText}>{note.topicName}</Text>
                    </View>
                    <View style={styles.noteCardActions}>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => handleEditNoteModal(note)}
                      >
                        <EditIcon size={16} color="#64748B" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => handleDeleteNote(note.id)}
                      >
                        <TrashIcon size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.noteCardTitle}>{note.title}</Text>
                  <Text style={styles.noteCardSnippet} numberOfLines={3}>
                    {note.content}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* ── CREATE / EDIT NOTE MODAL ───────────────────────────────────── */}
      <Modal
        visible={isNoteModalVisible}
        onClose={() => setIsNoteModalVisible(false)}
        title={editingNote ? "Edit Note" : "Create New Note"}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Title</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Integration by Parts Cheat Sheet"
              placeholderTextColor="#94A3B8"
              value={noteFormTitle}
              onChangeText={setNoteFormTitle}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>Subject</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                {studyService.subjects.map((subj) => (
                  <TouchableOpacity
                    key={subj.id}
                    style={[
                      styles.formPill,
                      noteFormSubjectId === subj.id && styles.formPillActive,
                    ]}
                    onPress={() => {
                      setNoteFormSubjectId(subj.id);
                      setNoteFormTopicId(subj.topics[0]?.id || "");
                    }}
                  >
                    <Text
                      style={[
                        styles.formPillText,
                        noteFormSubjectId === subj.id && styles.formPillTextActive,
                      ]}
                    >
                      {subj.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Topic</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
              {activeFormSubject?.topics.map((top) => (
                <TouchableOpacity
                  key={top.id}
                  style={[
                    styles.formPill,
                    noteFormTopicId === top.id && styles.formPillActive,
                  ]}
                  onPress={() => setNoteFormTopicId(top.id)}
                >
                  <Text
                    style={[
                      styles.formPillText,
                      noteFormTopicId === top.id && styles.formPillTextActive,
                    ]}
                  >
                    {top.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Note Content</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              placeholder="Write your study notes, formulas, or key concepts here..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={noteFormContent}
              onChangeText={setNoteFormContent}
            />
          </View>

          <View style={styles.modalActionsRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsNoteModalVisible(false)}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={handleSaveNote}
            >
              <Text style={styles.modalSaveBtnText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar activeTab="study" onSelectTab={onSelectTab} />
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
    fontWeight: "500",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6236FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  timerToggleBtn: {
    padding: 2,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  // ── HUB CARDS GRID
  hubCardsGrid: {
    gap: 14,
  },
  hubCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  hubCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  hubIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePillPrimary: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillTextPrimary: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6236FF",
  },
  hubCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  hubCardDescription: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },
  hubCardStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  hubStatBadge: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  hubStatValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  hubStatLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "600",
  },

  // ── RECOMMENDATIONS SECTION
  recommendationsSection: {
    marginTop: 24,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  recTextGroup: {
    flex: 1,
    marginRight: 12,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  recReason: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },
  recActionBtn: {
    backgroundColor: "#6236FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recActionBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── SRS FLASHCARD SESSION
  sessionContainer: {
    gap: 16,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6236FF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  flashcard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    minHeight: 340,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  flashcardFront: {
    borderLeftWidth: 4,
    borderLeftColor: "#6236FF",
  },
  flashcardBack: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#6236FF",
    letterSpacing: 0.4,
  },
  categoryBadgeBack: {
    backgroundColor: "#E8FDF0",
  },
  categoryBadgeTextBack: {
    color: "#10B981",
  },
  cardBodyContainer: {
    marginVertical: 16,
  },
  frontContent: {
    gap: 10,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 24,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFBEB",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginTop: 6,
  },
  hintText: {
    fontSize: 12.5,
    color: "#B45309",
    flex: 1,
  },
  backContent: {
    gap: 12,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 0.8,
  },
  answerText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  explanationBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  explanationBody: {
    fontSize: 12.5,
    color: "#64748B",
    lineHeight: 18,
  },
  takeawayBox: {
    backgroundColor: "#F0EEFF",
    padding: 10,
    borderRadius: 10,
  },
  takeawayTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#6236FF",
  },
  takeawayBody: {
    fontSize: 12,
    color: "#4338CA",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  audioBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },
  tapFlipText: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  toolsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toolChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toolChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  toolChipAi: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F0EEFF",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2D9FF",
  },
  toolChipAiText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6236FF",
  },

  // SM-2 Rating Bar
  sm2RatingContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sm2RatingHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  sm2ButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  sm2Btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  sm2BtnTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  sm2BtnInterval: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },
  notesShortcutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFF3E8",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  notesShortcutBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F97316",
  },

  // Session Reward View
  rewardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  rewardBadgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  rewardSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  rewardStatsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  rewardStatCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  rewardStatValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  rewardStatLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  connectedActionsContainer: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  primaryActionBtn: {
    backgroundColor: "#6236FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  secondaryActionBtn: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  // ── QUIZ SYSTEM STYLES
  quizSetupContainer: {
    gap: 16,
  },
  quizSetupTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  quizSetupSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  quizList: {
    gap: 12,
  },
  quizCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  quizTopicBadge: {
    backgroundColor: "#E8FDF0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  quizTopicBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#10B981",
  },
  quizCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  quizCardMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  startQuizBtn: {
    backgroundColor: "#10B981",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startQuizBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // Active Quiz Player
  quizActiveContainer: {
    gap: 16,
  },
  quizProgressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizQuestionCounter: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
  },
  quizTagPill: {
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quizTagPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6236FF",
  },
  quizQuestionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quizQuestionPrompt: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 22,
  },
  quizOptionsList: {
    gap: 10,
  },
  quizOptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quizOptionCardSelected: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  quizOptionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  quizOptionRadioSelected: {
    borderColor: "#10B981",
  },
  quizOptionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
  },
  quizOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
  },
  quizOptionTextSelected: {
    color: "#065F46",
    fontWeight: "700",
  },

  // Results Screen
  quizResultsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  weakTopicAlertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FEF2F2",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    width: "100%",
  },
  weakTopicAlertTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#991B1B",
  },
  weakTopicAlertBody: {
    fontSize: 12,
    color: "#B91C1C",
    marginTop: 2,
    lineHeight: 16,
  },

  // ── NOTES SYSTEM STYLES
  notesHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    padding: 0,
  },
  createNoteBtn: {
    backgroundColor: "#F97316",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  createNoteBtnText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  notesList: {
    gap: 12,
  },
  emptyNotesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  emptyNotesTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
  },
  emptyNotesSubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 8,
  },
  noteCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteTopicBadge: {
    backgroundColor: "#FFF3E8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  noteTopicBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#F97316",
  },
  noteCardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconActionBtn: {
    padding: 4,
  },
  noteCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  noteCardSnippet: {
    fontSize: 12.5,
    color: "#64748B",
    lineHeight: 18,
  },

  // Form Modal Styles
  formGroup: {
    gap: 6,
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#475569",
  },
  formInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  formTextArea: {
    minHeight: 120,
  },
  formRow: {
    flexDirection: "row",
  },
  formPill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 6,
  },
  formPillActive: {
    backgroundColor: "#6236FF",
    borderColor: "#6236FF",
  },
  formPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  formPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: "#6236FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
