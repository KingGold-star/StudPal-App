import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Image,
  Animated,
  Easing,
} from 'react-native';
import Modal from '../components/CustomModal';
import Svg, { Circle, G, Defs, LinearGradient, Stop, Path, Rect, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import BottomNavBar from '../components/BottomNavBar';
import { Colors } from '../theme/colors';
import { gamificationService } from '../services/gamification/gamificationService';
import { settingsService } from '../services/settings/settingsService';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const CIRCUMFERENCE = 2 * Math.PI * 104; // ~653.45

// --- Executive SVG Icon Components ---
const FlameIcon = ({ size = 16, color = '#F97316' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.87-1.67-2.5-2.5-4-.83 1.5-2.5 2.13-2.5 4z" />
    <Path d="M12 2c.67 2 2.8 4.2 3.5 6 1 2.5.5 5.5-1.5 7.5a6.5 6.5 0 0 1-10-3.5c-.3-1.5 0-3 1-4.5.8-1.2 2-2.5 3-4C9.5 4.5 11 3 12 2z" />
  </Svg>
);

const TrophyIcon = ({ size = 16, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <Path d="M4 22h16" />
    <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </Svg>
);

const BellIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const SparklesIcon = ({ size = 16, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

const CameraIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const CalendarHeaderIcon = ({ size = 16, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const MathIcon = ({ size = 18, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19L19 4" />
    <Path d="M9 4h10v10" />
    <Path d="M4 9v10h10" />
  </Svg>
);

const PhysicsIcon = ({ size = 18, color = '#6366F1' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
  </Svg>
);

const ChemistryIcon = ({ size = 18, color = '#0EA5E9' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10 2v7.5L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9.5V2" />
    <Path d="M8.5 2h7" />
  </Svg>
);

const BiologyIcon = ({ size = 18, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 15c6.667-6 13.333-6 20 0" />
    <Path d="M2 9c6.667 6 13.333 6 20 0" />
  </Svg>
);

const subjects = [
  {
    id: 'math',
    title: 'Mathematics',
    currentTopic: 'Calculus II: Derivatives',
    IconComponent: MathIcon,
    mastery: 0.82,
    completed: 14,
    total: 18,
    tint: '#2D62FF',
    bgTint: 'rgba(45, 98, 255, 0.08)',
    lessons: [
      { name: 'Functions & Limits', done: true },
      { name: 'Derivatives & Chain Rule', done: true },
      { name: 'Integration by Parts', done: false },
      { name: 'Differential Equations', done: false },
    ],
  },
  {
    id: 'physics',
    title: 'Physics',
    currentTopic: 'Electromagnetism',
    IconComponent: PhysicsIcon,
    mastery: 0.64,
    completed: 9,
    total: 15,
    tint: '#6366F1',
    bgTint: 'rgba(99, 102, 241, 0.08)',
    lessons: [
      { name: 'Kinematics & Vectors', done: true },
      { name: 'Newtonian Dynamics', done: true },
      { name: 'Electromagnetism & Flux', done: false },
      { name: 'Quantum Basics', done: false },
    ],
  },
  {
    id: 'chem',
    title: 'Chemistry',
    currentTopic: 'Organic Reactions',
    IconComponent: ChemistryIcon,
    mastery: 0.45,
    completed: 6,
    total: 14,
    tint: '#0EA5E9',
    bgTint: 'rgba(14, 165, 233, 0.08)',
    lessons: [
      { name: 'Atomic Structure & Periodic Trends', done: true },
      { name: 'Thermodynamics & Kinetics', done: true },
      { name: 'Organic Reactions & Mechanisms', done: false },
      { name: 'Acid-Base Equilibria', done: false },
    ],
  },
  {
    id: 'bio',
    title: 'Biology',
    currentTopic: 'Cellular Respiration',
    IconComponent: BiologyIcon,
    mastery: 0.90,
    completed: 11,
    total: 12,
    tint: '#10B981',
    bgTint: 'rgba(16, 185, 129, 0.08)',
    lessons: [
      { name: 'Cell Structure & Membranes', done: true },
      { name: 'Cellular Respiration & ATP', done: true },
      { name: 'Genetics & Inheritance', done: true },
      { name: 'Ecology & Biosphere', done: false },
    ],
  },
];

const srsFlashcards = [
  {
    id: 'srs-1',
    title: 'Integration by Parts',
    subject: 'Mathematics',
    IconComponent: MathIcon,
    question: 'What is the formula for integration by parts?',
    answer: '∫ u dv = uv - ∫ v du (choose u using the LIATE rule).',
    retention: 65,
    status: 'Due today',
    urgent: false,
  },
  {
    id: 'srs-2',
    title: 'Wave Optics & Interference',
    subject: 'Physics',
    IconComponent: PhysicsIcon,
    question: "State the condition for constructive interference in Young's double slit.",
    answer: 'Path difference Δx = nλ (where n = 0, 1, 2, ...).',
    retention: 48,
    status: '1d overdue',
    urgent: true,
  },
  {
    id: 'srs-3',
    title: 'Acid-Base Buffers',
    subject: 'Chemistry',
    IconComponent: ChemistryIcon,
    question: 'Write the Henderson-Hasselbalch equation for buffer pH.',
    answer: 'pH = pKa + log([A⁻]/[HA]).',
    retention: 78,
    status: 'In 3 hours',
    urgent: false,
  },
];

export default function DashboardScreen({ user = { name: 'Alex' }, onSelectTab, onNavigate, settings }) {
  const activeSettings = settings || settingsService.getSettingsSync();
  const [activeTab, setActiveTab] = useState('home');
  const [completedMins, setCompletedMins] = useState(45);
  const [targetMins, setTargetMins] = useState(activeSettings.dailyStudyGoal || 60);
  const [xp, setXp] = useState(320);
  const [streakCount, setStreakCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFocusModalVisible, setFocusModalVisible] = useState(false);
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);
  const [isNotifModalVisible, setNotifModalVisible] = useState(false);
  const [isAiModalVisible, setAiModalVisible] = useState(false);
  const [aiTopicTitle, setAiTopicTitle] = useState('Calculus');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSrsModalVisible, setSrsModalVisible] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isAiCoachVisible, setAiCoachVisible] = useState(false);

  // File Upload state
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Pomodoro Focus Timer State (derived from active settings)
  const initialFocusSecs = (activeSettings.defaultSessionDuration || 25) * 60;
  const initialShortBreakSecs = (activeSettings.shortBreakDuration || 5) * 60;
  const initialLongBreakSecs = (activeSettings.longBreakDuration || 15) * 60;

  const [pomodoroMode, setPomodoroMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'longBreak'
  const [pomodoroDuration, setPomodoroDuration] = useState(initialFocusSecs);
  const [shortBreakDuration, setShortBreakDuration] = useState(initialShortBreakSecs);
  const [longBreakDuration, setLongBreakDuration] = useState(initialLongBreakSecs);

  const [timerSeconds, setTimerSeconds] = useState(initialFocusSecs);
  const [totalTimerDuration, setTotalTimerDuration] = useState(initialFocusSecs);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Keep timer configurations in sync with dynamic settings changes
  useEffect(() => {
    const s = settings || settingsService.getSettingsSync();
    if (s.dailyStudyGoal) {
      setTargetMins(s.dailyStudyGoal);
    }
    if (s.defaultSessionDuration) {
      const newFocus = s.defaultSessionDuration * 60;
      setPomodoroDuration(newFocus);
      if (pomodoroMode === 'pomodoro' && !isTimerRunning) {
        setTimerSeconds(newFocus);
        setTotalTimerDuration(newFocus);
        totalDurRef.current = newFocus;
      }
    }
    if (s.shortBreakDuration) {
      const newShort = s.shortBreakDuration * 60;
      setShortBreakDuration(newShort);
      if (pomodoroMode === 'shortBreak' && !isTimerRunning) {
        setTimerSeconds(newShort);
        setTotalTimerDuration(newShort);
        totalDurRef.current = newShort;
      }
    }
    if (s.longBreakDuration) {
      const newLong = s.longBreakDuration * 60;
      setLongBreakDuration(newLong);
      if (pomodoroMode === 'longBreak' && !isTimerRunning) {
        setTimerSeconds(newLong);
        setTotalTimerDuration(newLong);
        totalDurRef.current = newLong;
      }
    }
  }, [settings]);

  const [currentCycle, setCurrentCycle] = useState(1); // 1 to 4
  const [isTipVisible, setIsTipVisible] = useState(true);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isSubjectChangeModalVisible, setIsSubjectChangeModalVisible] = useState(false);

  const [activeSessionSubject, setActiveSessionSubject] = useState({
    title: 'Physics',
    topic: 'Kinematics – Equations of Motion',
    emoji: '⚛️',
  });

  // Daily stats tracking
  const [todayFocusMins, setTodayFocusMins] = useState(135); // 2h 15m
  const [todaySessionsCount, setTodaySessionsCount] = useState(5);
  const [todayFocusScore, setTodayFocusScore] = useState(85);

  // ─── rAF-based smooth 60 FPS ring animation ──────────────────────────────
  // strokeDashoffset drives the ring: 0 = full circle, CIRCUMFERENCE = empty.
  const strokeOffset = useRef(new Animated.Value(0)).current;

  // Mutable refs so the rAF loop never closes over stale state
  const rafRef          = useRef(null);
  const startTsRef      = useRef(null);   // wall-clock ms when current run started
  const startSecsRef    = useRef(0);      // remaining seconds when current run started
  const totalDurRef     = useRef(25 * 60);
  const isRunningRef    = useRef(false);
  const secsIntervalRef = useRef(null);

  // Keep totalDurRef in sync with React state
  useEffect(() => { totalDurRef.current = totalTimerDuration; }, [totalTimerDuration]);

  // ── rAF loop ────────────────────────────────────────────────────────────
  const startRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      if (!isRunningRef.current) return;

      const elapsed = (now - startTsRef.current) / 1000; // seconds elapsed
      const remaining = Math.max(0, startSecsRef.current - elapsed);
      const progress  = remaining / totalDurRef.current;  // 1 → 0

      // Set offset: 0 = full ring, CIRCUMFERENCE = empty
      strokeOffset.setValue(CIRCUMFERENCE * (1 - progress));

      if (remaining <= 0) {
        strokeOffset.setValue(CIRCUMFERENCE);
        isRunningRef.current = false;
        setIsTimerRunning(false);
        setTimerSeconds(0);
        handleFinishFocusSession();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const stopRaf = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // ── Main timer effect — reacts to isTimerRunning ─────────────────────────
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      // Capture start state
      isRunningRef.current = true;
      startTsRef.current   = performance.now();
      startSecsRef.current = timerSeconds;

      // Start rAF loop for ring
      startRaf();

      // 1-second interval for digital clock digits only
      secsIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            clearInterval(secsIntervalRef.current);
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      // Pause / stop: freeze the ring exactly where it is
      isRunningRef.current = false;
      stopRaf();
      if (secsIntervalRef.current) {
        clearInterval(secsIntervalRef.current);
        secsIntervalRef.current = null;
      }
    }

    return () => {
      isRunningRef.current = false;
      stopRaf();
      if (secsIntervalRef.current) {
        clearInterval(secsIntervalRef.current);
        secsIntervalRef.current = null;
      }
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectMode = (mode) => {
    // Stop everything first
    isRunningRef.current = false;
    stopRaf();
    if (secsIntervalRef.current) {
      clearInterval(secsIntervalRef.current);
      secsIntervalRef.current = null;
    }

    setPomodoroMode(mode);
    setIsTimerRunning(false);

    let targetSecs = 25 * 60;
    if (mode === 'pomodoro') targetSecs = pomodoroDuration;
    else if (mode === 'shortBreak') targetSecs = shortBreakDuration;
    else if (mode === 'longBreak') targetSecs = longBreakDuration;

    totalDurRef.current = targetSecs;
    strokeOffset.setValue(0); // reset ring to full
    setTimerSeconds(targetSecs);
    setTotalTimerDuration(targetSecs);
  };

  const handleFinishFocusSession = () => {
    if (pomodoroMode === 'pomodoro') {
      const minsGained = Math.round(pomodoroDuration / 60);
      setCompletedMins((prev) => Math.min(targetMins, prev + minsGained));
      setTodayFocusMins((prev) => prev + minsGained);
      setTodaySessionsCount((prev) => prev + 1);
      setXp((prev) => prev + 50);
      gamificationService.recordStudySession(minsGained || 25);

      if (currentCycle < 4) {
        const nextCycle = currentCycle + 1;
        setCurrentCycle(nextCycle);
        Alert.alert(
          '🎉 Focus Session Completed!',
          `Awesome job! Cycle ${currentCycle} of 4 completed. Time for a 5-minute Short Break! ☕`,
          [
            {
              text: 'Start Short Break',
              onPress: () => handleSelectMode('shortBreak'),
            },
            { text: 'Later', style: 'cancel' },
          ]
        );
      } else {
        setCurrentCycle(1);
        Alert.alert(
          '🏆 4 Cycles Completed!',
          `Outstanding work! You finished 4 Pomodoro cycles! Time for a well-deserved 15-minute Long Break! 🌴`,
          [
            {
              text: 'Start Long Break',
              onPress: () => handleSelectMode('longBreak'),
            },
            { text: 'Later', style: 'cancel' },
          ]
        );
      }
    } else {
      Alert.alert(
        '☕ Break Completed!',
        'Feeling refreshed? Ready to start your next Pomodoro Focus Session!',
        [
          {
            text: 'Start Focus Session',
            onPress: () => handleSelectMode('pomodoro'),
          },
          { text: 'OK', style: 'cancel' },
        ]
      );
    }
  };

  const progressPercent = Math.min(100, Math.round((completedMins / targetMins) * 100));

  const handleOpenAiTopic = (topic) => {
    setAiTopicTitle(topic);
    setAiModalVisible(true);
  };

  const handleNavSelect = (tab) => {
    setActiveTab(tab);
    if (tab === 'aicoach') {
      if (onSelectTab) onSelectTab('aicoach');
      else if (onNavigate) onNavigate('aicoach');
      else setAiCoachVisible(true);
    } else if (tab === 'subjects') {
      if (onSelectTab) onSelectTab('subjects');
      else if (onNavigate) onNavigate('subjects');
    } else if (tab === 'study') {
      if (onSelectTab) onSelectTab('study');
      else if (onNavigate) onNavigate('study');
      else setStreakModalVisible(true);
    } else if (tab === 'profile') {
      if (onSelectTab) onSelectTab('profile');
      else if (onNavigate) onNavigate('profile');
      else setProfileModalVisible(true);
    }
  };

  // File Upload Handlers (Documents, PDFs, Images, Videos, Live Camera)
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', '*/*'],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        setUploadedFile({
          name: file.name,
          size: file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF Document',
          type: 'document',
          emoji: '📄',
          uri: file.uri,
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to pick document: ' + e.message);
    }
  };

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        setUploadedFile({
          name: asset.fileName || 'Homework Photo.jpg',
          size: 'Image (High Res)',
          type: 'image',
          emoji: '🖼️',
          uri: asset.uri,
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to select image: ' + e.message);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is required to scan assignments.');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        setUploadedFile({
          name: 'Live Problem Scan.jpg',
          size: 'Camera Capture',
          type: 'camera',
          emoji: '📸',
          uri: asset.uri,
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Camera unavailable: ' + e.message);
    }
  };

  const handlePickVideo = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        setUploadedFile({
          name: asset.fileName || 'Lecture Video.mp4',
          size: 'Video Clip',
          type: 'video',
          emoji: '🎥',
          uri: asset.uri,
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to select video: ' + e.message);
    }
  };

  const handleAnalyzeUploadedFile = () => {
    if (!uploadedFile) return;
    setUploadModalVisible(false);
    handleOpenAiTopic(`Analyzed: ${uploadedFile.name}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ========================================================================= */}
      {/* 🌟 1. STICKY TOP NAVBAR (Zero Border, Fixed at Top)                       */}
      {/* ========================================================================= */}
      <View style={styles.stickyTopNavbar}>
        <View style={styles.headerRow}>
          <View style={styles.profileGroup}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => onNavigate ? onNavigate('profile') : setProfileModalVisible(true)}
              activeOpacity={0.8}
            >
              {user?.avatarUri ? (
                <Image source={{ uri: user.avatarUri }} style={styles.headerAvatarImg} />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nameBlock}
              onPress={() => setProfileModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.greetingGreeting} numberOfLines={1}>Welcome back,</Text>
              <Text style={styles.greetingName} numberOfLines={1}>{user.name || 'Alex'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.streakCapsule}
              onPress={() => setStreakModalVisible(true)}
              activeOpacity={0.7}
            >
              <FlameIcon size={14} color="#F97316" />
              <Text style={styles.streakNumber}>{streakCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => onNavigate && onNavigate('leaderboard')}
              activeOpacity={0.7}
            >
              <TrophyIcon size={16} color="#2D62FF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setNotifModalVisible(true)}
              activeOpacity={0.7}
            >
              <BellIcon size={16} color="#64748B" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ========================================================================= */}
      {/* 📜 2. SCROLLABLE DASHBOARD CONTENT                                         */}
      {/* ========================================================================= */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 2. Architectural Midnight Goal & Focus Card */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => setFocusModalVisible(true)}
          activeOpacity={0.92}
        >
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroPretitle}>DAILY COMMITMENT</Text>
              <Text style={styles.heroTitle}>{completedMins} of {targetMins} mins</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                onPress={() => onNavigate && onNavigate('schedule')}
                style={styles.heroScheduleBtn}
                activeOpacity={0.7}
              >
                <CalendarHeaderIcon size={15} color="#93C5FD" />
              </TouchableOpacity>
              <View style={styles.xpBadge}>
                <Text style={styles.xpBadgeText}>+{xp} XP</Text>
              </View>
            </View>
          </View>

          {/* Minimalist Progress Track */}
          <View style={styles.trackContainer}>
            <View style={styles.trackBg}>
              <View style={[styles.trackFill, { width: `${progressPercent}%` }]} />
            </View>
            <View style={styles.trackMeta}>
              <Text style={styles.trackSubtext}>
                {completedMins >= targetMins
                  ? 'Daily Target Achieved'
                  : `${targetMins - completedMins} mins remaining today`}
              </Text>
              <Text style={styles.trackPercent}>{progressPercent}%</Text>
            </View>
          </View>

          {/* Clean Action Button */}
          <TouchableOpacity
            style={styles.resumeBtn}
            onPress={() => setFocusModalVisible(true)}
            activeOpacity={0.88}
          >
            <Text style={styles.resumeBtnText}>Start 25m Focus Session</Text>
            <Text style={styles.resumeArrow}>→</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 3. Quiet & Clean AI Search Bar with Multi-Media File Upload Icon */}
        <View style={styles.searchBox}>
          <View style={styles.searchBar}>
            <SparklesIcon size={16} color="#2D62FF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Ask anything or explore a topic..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleOpenAiTopic(searchQuery || 'General Study')}
            />
            {/* Camera / Multi-Media File Upload Button */}
            <TouchableOpacity
              style={styles.searchAction}
              onPress={() => setUploadModalVisible(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <CameraIcon size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Refined Minimalist Topic Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContainer}
          >
            {['Calculus', 'Quantum Physics', 'Organic Chemistry', 'Summarize'].map((tag, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.minimalPill}
                onPress={() => handleOpenAiTopic(tag)}
                activeOpacity={0.65}
              >
                <Text style={styles.minimalPillText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 4. Active Subjects — Clean Modern Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Subjects</Text>
            <TouchableOpacity
              onPress={() => {
                if (onSelectTab) onSelectTab('subjects');
                else if (onNavigate) onNavigate('subjects');
                else setSelectedSubject(subjects[0]);
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.seeAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsRow}
          >
            {subjects.map((sub) => {
              const SubIcon = sub.IconComponent;
              return (
                <TouchableOpacity
                  key={sub.id}
                  style={styles.cleanSubjectCard}
                  onPress={() => setSelectedSubject(sub)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardTopRow}>
                    <View style={[styles.cleanIconBox, { backgroundColor: sub.bgTint }]}>
                      <SubIcon size={18} color={sub.tint} />
                    </View>
                    <Text style={[styles.masteryBadge, { color: sub.tint }]}>
                      {Math.round(sub.mastery * 100)}%
                    </Text>
                  </View>

                  <View style={styles.subjectContent}>
                    <Text style={styles.cardTitle}>{sub.title}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {sub.currentTopic}
                    </Text>
                  </View>

                  {/* Micro Progress Bar */}
                  <View style={styles.cardTrackBg}>
                    <View
                      style={[
                        styles.cardTrackFill,
                        { width: `${sub.mastery * 100}%`, backgroundColor: sub.tint },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 5. Revision Queue — Quiet List Design */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.sectionHeading}>Revision Queue</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>3</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setCurrentCardIndex(0);
                setIsCardFlipped(false);
                setSrsModalVisible(true);
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.seeAllLink}>Start all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.queueList}>
            {srsFlashcards.map((item, index) => {
              const ItemIcon = item.IconComponent;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quietQueueItem}
                  onPress={() => {
                    setCurrentCardIndex(index);
                    setIsCardFlipped(false);
                    setSrsModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.queueIconBox}>
                    <ItemIcon size={18} color="#2D62FF" />
                  </View>

                  <View style={styles.queueInfo}>
                    <Text style={styles.queueTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.queueMeta}>
                      {item.subject} • {item.retention}% retention
                    </Text>
                  </View>

                  <View style={[styles.statusTag, item.urgent && styles.statusTagUrgent]}>
                    <Text style={[styles.statusTagText, item.urgent && styles.statusTagTextUrgent]}>
                      {item.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* ========================================================================= */}
      {/* 🌟 3. STICKY BOTTOM NAVBAR (Zero Border, Fixed at Bottom)                  */}
      {/* ========================================================================= */}
      <BottomNavBar activeTab={activeTab} onSelectTab={handleNavSelect} />

      {/* ========================================================================= */}
      {/* 🚀 1. MULTI-MEDIA FILE UPLOAD BOTTOM SHEET MODAL (PDF, Doc, Image, Video) */}
      {/* ========================================================================= */}
      <Modal
        visible={isUploadModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 22 }}>📁</Text>
                <Text style={styles.modalSheetTitle}>Upload Study Material</Text>
              </View>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.uploadSubtitle}>
              Select any document, PDF, homework photo, or lecture video for instant AI explanation:
            </Text>

            {/* Selected File Preview Box (if any) */}
            {uploadedFile && (
              <View style={styles.filePreviewCard}>
                <Text style={{ fontSize: 28 }}>{uploadedFile.emoji}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.filePreviewName} numberOfLines={1}>
                    {uploadedFile.name}
                  </Text>
                  <Text style={styles.filePreviewSize}>{uploadedFile.size}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setUploadedFile(null)}
                  style={styles.fileRemoveBtn}
                >
                  <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 13 }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Upload Option Grid */}
            <View style={styles.uploadGrid}>
              <TouchableOpacity
                style={styles.uploadOptionCard}
                onPress={handlePickDocument}
                activeOpacity={0.8}
              >
                <View style={[styles.uploadIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Text style={{ fontSize: 22 }}>📄</Text>
                </View>
                <Text style={styles.uploadOptionTitle}>Document / PDF</Text>
                <Text style={styles.uploadOptionSub}>Notes, textbooks, DOCX</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOptionCard}
                onPress={handlePickImage}
                activeOpacity={0.8}
              >
                <View style={[styles.uploadIconCircle, { backgroundColor: '#F0FDF4' }]}>
                  <Text style={{ fontSize: 22 }}>🖼️</Text>
                </View>
                <Text style={styles.uploadOptionTitle}>Photo / Gallery</Text>
                <Text style={styles.uploadOptionSub}>Diagrams, equations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOptionCard}
                onPress={handleTakePhoto}
                activeOpacity={0.8}
              >
                <View style={[styles.uploadIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={{ fontSize: 22 }}>📸</Text>
                </View>
                <Text style={styles.uploadOptionTitle}>Scan Live Photo</Text>
                <Text style={styles.uploadOptionSub}>Snap homework problem</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOptionCard}
                onPress={handlePickVideo}
                activeOpacity={0.8}
              >
                <View style={[styles.uploadIconCircle, { backgroundColor: '#FAF5FF' }]}>
                  <Text style={{ fontSize: 22 }}>🎥</Text>
                </View>
                <Text style={styles.uploadOptionTitle}>Video Lesson</Text>
                <Text style={styles.uploadOptionSub}>Lectures & tutorials</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            {uploadedFile ? (
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={handleAnalyzeUploadedFile}
                activeOpacity={0.88}
              >
                <Text style={styles.modalPrimaryBtnText}>✨ Analyze with StudPal AI →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { backgroundColor: '#94A3B8' }]}
                onPress={() => setUploadModalVisible(false)}
              >
                <Text style={styles.modalPrimaryBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 2. PIXEL-PERFECT POMODORO FOCUS TIMER SCREEN (Full Screen)             */}
      {/* ========================================================================= */}
      <Modal
        visible={isFocusModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setFocusModalVisible(false)}
      >
        <SafeAreaView style={styles.pomodoroScreenRoot} edges={['top', 'bottom']}>
          {/* 1. Header Bar (Back Arrow, Title & Subtitle, Settings Gear) */}
          <View style={styles.pomodoroHeaderRow}>
            <TouchableOpacity
              style={styles.pomoHeaderBtn}
              onPress={() => setFocusModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.pomoHeaderBackIcon}>‹</Text>
            </TouchableOpacity>

            <View style={styles.pomoHeaderTitleGroup}>
              <Text style={styles.pomoHeaderTitle}>Focus Timer</Text>
              <Text style={styles.pomoHeaderSubtitle}>Stay focused, make it count! 🚀</Text>
            </View>

            <TouchableOpacity
              style={styles.pomoHeaderBtn}
              onPress={() => setIsSettingsModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.pomoHeaderGearIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.pomodoroScrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* 2. Mode Switcher (Segmented Tab Bar) */}
            <View style={styles.modeSegmentContainer}>
              {[
                { id: 'pomodoro', label: 'Pomodoro' },
                { id: 'shortBreak', label: 'Short Break' },
                { id: 'longBreak', label: 'Long Break' },
              ].map((tab) => {
                const isActive = pomodoroMode === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.modeTabPill, isActive && styles.modeTabPillActive]}
                    onPress={() => handleSelectMode(tab.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.modeTabText, isActive && styles.modeTabTextActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Premium Dark Timer Hero Card ── */}
            <View style={styles.premiumTimerCard}>

              {/* Mode badge + cycle pill */}
              <View style={styles.premiumModeRow}>
                <View style={styles.premiumModeBadge}>
                  <Text style={styles.premiumModeEmoji}>
                    {pomodoroMode === 'pomodoro' ? '🎯' : pomodoroMode === 'shortBreak' ? '☕' : '🌿'}
                  </Text>
                  <Text style={styles.premiumModeLabel}>
                    {pomodoroMode === 'pomodoro' ? 'Focus Session' : pomodoroMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </Text>
                </View>
                <View style={styles.premiumCycleBadge}>
                  <Text style={styles.premiumCycleBadgeText}>Cycle {currentCycle}/4</Text>
                </View>
              </View>

              {/* Ring */}
              <View style={styles.premiumRingWrapper}>
                <Svg width={280} height={280} viewBox="0 0 280 280">
                  <Defs>
                    <LinearGradient id="premiumArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#A5B4FC" />
                      <Stop offset="100%" stopColor="#6366F1" />
                    </LinearGradient>
                  </Defs>
                  {/* Subtle outer ring */}
                  <Circle cx="140" cy="140" r={128} stroke="#FFFFFF" strokeWidth={1} strokeOpacity={0.06} fill="none" />
                  {/* Background track */}
                  <Circle cx="140" cy="140" r={112} stroke="#FFFFFF" strokeWidth={18} strokeOpacity={0.08} fill="none" />
                  {/* Active progress arc */}
                  <G rotation="-90" origin="140, 140">
                    <AnimatedCircle
                      cx="140" cy="140" r={112}
                      stroke="url(#premiumArcGrad)"
                      strokeWidth={18}
                      strokeDasharray={`${2 * Math.PI * 112} ${2 * Math.PI * 112}`}
                      strokeDashoffset={strokeOffset.interpolate({
                        inputRange: [0, CIRCUMFERENCE],
                        outputRange: [0, 2 * Math.PI * 112],
                        extrapolate: 'clamp',
                      })}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </G>
                </Svg>

                {/* Center digits */}
                <View style={styles.premiumRingCenter}>
                  <Text style={styles.premiumTimerLabel}>
                    {pomodoroMode === 'pomodoro' ? 'FOCUS' : pomodoroMode === 'shortBreak' ? 'BREAK' : 'REST'}
                  </Text>
                  <Text style={styles.premiumTimerDigits}>{formatTimer(timerSeconds)}</Text>
                  <Text style={styles.premiumTimerSub}>
                    {isTimerRunning ? 'in progress…' : timerSeconds === totalTimerDuration ? 'ready to start' : 'paused'}
                  </Text>
                </View>
              </View>

              {/* Controls */}
              <View style={styles.premiumControlsRow}>
                <TouchableOpacity
                  style={styles.premiumControlSecondary}
                  onPress={() => {
                    isRunningRef.current = false;
                    stopRaf();
                    if (secsIntervalRef.current) { clearInterval(secsIntervalRef.current); secsIntervalRef.current = null; }
                    setIsTimerRunning(false);
                    strokeOffset.setValue(0);
                    setTimerSeconds(totalTimerDuration);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.premiumControlIcon}>↺</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.premiumPlayBtn} onPress={() => setIsTimerRunning(!isTimerRunning)} activeOpacity={0.85}>
                  <Text style={styles.premiumPlayIcon}>{isTimerRunning ? '⏸' : '▶'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.premiumControlSecondary}
                  onPress={() => handleSelectMode(
                    pomodoroMode === 'pomodoro' ? 'shortBreak' : pomodoroMode === 'shortBreak' ? 'longBreak' : 'pomodoro'
                  )}
                  activeOpacity={0.8}
                >
                  <Text style={styles.premiumControlIcon}>⏭</Text>
                </TouchableOpacity>
              </View>

              {/* Cycle dots */}
              <View style={styles.premiumDotsRow}>
                {[1, 2, 3, 4].map((dot) => (
                  <View key={dot} style={[styles.premiumDot, dot <= currentCycle && styles.premiumDotActive]} />
                ))}
              </View>

            </View>

            {/* Now Studying Card */}
            <View style={styles.premiumSessionCard}>
              <View style={styles.premiumSessionCardTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={styles.premiumSessionIconBox}>
                    <Text style={{ fontSize: 16 }}>📘</Text>
                  </View>
                  <Text style={styles.premiumSessionCardLabel}>Now Studying</Text>
                </View>
                <TouchableOpacity onPress={() => setIsSubjectChangeModalVisible(true)} activeOpacity={0.7}>
                  <Text style={styles.premiumChangeLink}>Switch ›</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.premiumSessionSubject}>{activeSessionSubject.emoji}  {activeSessionSubject.title}</Text>
              <Text style={styles.premiumSessionTopic}>{activeSessionSubject.topic}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.premiumStatsRow}>
              <View style={styles.premiumStatCard}>
                <Text style={[styles.premiumStatVal, { color: '#10B981' }]}>{Math.floor(todayFocusMins / 60)}h {todayFocusMins % 60}m</Text>
                <Text style={styles.premiumStatLabel}>Focus Time</Text>
                <View style={[styles.premiumStatAccent, { backgroundColor: '#10B981' }]} />
              </View>
              <View style={styles.premiumStatCard}>
                <Text style={[styles.premiumStatVal, { color: '#6366F1' }]}>{todaySessionsCount}</Text>
                <Text style={styles.premiumStatLabel}>Sessions</Text>
                <View style={[styles.premiumStatAccent, { backgroundColor: '#6366F1' }]} />
              </View>
              <View style={styles.premiumStatCard}>
                <Text style={[styles.premiumStatVal, { color: '#F59E0B' }]}>{todayFocusScore}%</Text>
                <Text style={styles.premiumStatLabel}>Score</Text>
                <View style={[styles.premiumStatAccent, { backgroundColor: '#F59E0B' }]} />
              </View>
            </View>

            {/* Tip Card */}
            {isTipVisible && (
              <View style={styles.premiumTipCard}>
                <Text style={styles.premiumTipEmoji}>💡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumTipTitle}>Pro Tip</Text>
                  <Text style={styles.premiumTipBody}>Eliminate distractions and focus on one topic at a time for better retention.</Text>
                </View>
                <TouchableOpacity onPress={() => setIsTipVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.premiumTipClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>

        {/* POMODORO SETTINGS MODAL */}
        <Modal
          visible={isSettingsModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsSettingsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalSheetTitle}>⚙️ Pomodoro Settings</Text>
                <TouchableOpacity onPress={() => setIsSettingsModalVisible(false)}>
                  <Text style={styles.modalCloseBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.uploadSubtitle}>Customize timer durations (in minutes):</Text>

              {/* Pomodoro Focus Setting */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Focus Session (mins)</Text>
                <View style={styles.adjustCounterRow}>
                  <TouchableOpacity
                    style={styles.adjustCounterBtn}
                    onPress={() => setPomodoroDuration((prev) => Math.max(5 * 60, prev - 5 * 60))}
                  >
                    <Text style={styles.adjustCounterText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.adjustCounterVal}>{Math.round(pomodoroDuration / 60)}</Text>
                  <TouchableOpacity
                    style={styles.adjustCounterBtn}
                    onPress={() => setPomodoroDuration((prev) => prev + 5 * 60)}
                  >
                    <Text style={styles.adjustCounterText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Short Break Setting */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Short Break (mins)</Text>
                <View style={styles.adjustCounterRow}>
                  <TouchableOpacity
                    style={styles.adjustCounterBtn}
                    onPress={() => setShortBreakDuration((prev) => Math.max(60, prev - 60))}
                  >
                    <Text style={styles.adjustCounterText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.adjustCounterVal}>{Math.round(shortBreakDuration / 60)}</Text>
                  <TouchableOpacity
                    style={styles.adjustCounterBtn}
                    onPress={() => setShortBreakDuration((prev) => prev + 60)}
                  >
                    <Text style={styles.adjustCounterText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Long Break Setting */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Long Break (mins)</Text>
                <View style={styles.adjustCounterRow}>
                  <TouchableOpacity
                    style={styles.adjustCounterBtn}
                    onPress={() => setLongBreakDuration((prev) => Math.max(5 * 60, prev - 5 * 60))}
                  >
                    <Text style={styles.adjustCounterText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.adjustCounterVal}>{Math.round(longBreakDuration / 60)}</Text>
                  <TouchableOpacity
                    style={styles.adjustCounterBtn}
                    onPress={() => setLongBreakDuration((prev) => prev + 5 * 60)}
                  >
                    <Text style={styles.adjustCounterText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setIsSettingsModalVisible(false);
                  handleSelectMode(pomodoroMode);
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* SUBJECT SELECTION MODAL */}
        <Modal
          visible={isSubjectChangeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsSubjectChangeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalSheetTitle}>📘 Select Subject</Text>
                <TouchableOpacity onPress={() => setIsSubjectChangeModalVisible(false)}>
                  <Text style={styles.modalCloseBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.uploadSubtitle}>Choose which subject you are focusing on:</Text>

              <View style={{ gap: 10, marginVertical: 10 }}>
                {subjects.map((sub) => (
                  <TouchableOpacity
                    key={sub.id}
                    style={styles.subjectSelectOption}
                    onPress={() => {
                      setActiveSessionSubject({
                        title: sub.title,
                        topic: sub.currentTopic,
                        emoji: sub.emoji,
                      });
                      setIsSubjectChangeModalVisible(false);
                    }}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.cleanIconBox, { backgroundColor: sub.bgTint }]}>
                      <Text style={{ fontSize: 20 }}>{sub.emoji}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.cardTitle}>{sub.title}</Text>
                      <Text style={styles.cardSubtitle}>{sub.currentTopic}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 3. STUDY STREAK & HABIT MODAL                                          */}
      {/* ========================================================================= */}
      <Modal
        visible={isStreakModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setStreakModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalSheetTitle}>🔥 Study Streak</Text>
              <TouchableOpacity onPress={() => setStreakModalVisible(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.streakHeroBox}>
              <Text style={{ fontSize: 44 }}>🔥</Text>
              <Text style={styles.streakHeroCount}>{streakCount} Days Active</Text>
              <Text style={styles.streakHeroSub}>You're on fire! Keep studying daily to maintain momentum.</Text>
            </View>

            {/* Weekly Days Row */}
            <View style={styles.weekRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const isChecked = idx < streakCount;
                return (
                  <View key={idx} style={styles.dayCol}>
                    <View style={[styles.dayCircle, isChecked && styles.dayCircleActive]}>
                      <Text style={[styles.dayCircleText, isChecked && styles.dayCircleTextActive]}>
                        {isChecked ? '✓' : ''}
                      </Text>
                    </View>
                    <Text style={styles.dayNameText}>{day}</Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => setStreakModalVisible(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Awesome, Keep Going!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 4. NOTIFICATIONS MODAL                                                 */}
      {/* ========================================================================= */}
      <Modal
        visible={isNotifModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotifModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalSheetTitle}>🔔 Notifications</Text>
              <TouchableOpacity onPress={() => setNotifModalVisible(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12, marginVertical: 14 }}>
              <View style={styles.notifCard}>
                <Text style={{ fontSize: 20 }}>📐</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifCardTitle}>Calculus Revision Due</Text>
                  <Text style={styles.notifCardSub}>Integration by Parts is due for Spaced Repetition review.</Text>
                </View>
              </View>

              <View style={styles.notifCard}>
                <Text style={{ fontSize: 20 }}>🏆</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifCardTitle}>Level 4 Scholar Achieved</Text>
                  <Text style={styles.notifCardSub}>You earned +320 XP this week. Rank #3 on class leaderboard.</Text>
                </View>
              </View>

              <View style={styles.notifCard}>
                <Text style={{ fontSize: 20 }}>✨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifCardTitle}>New AI Study Guide Ready</Text>
                  <Text style={styles.notifCardSub}>Your customized notes for Organic Chemistry are compiled.</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => setNotifModalVisible(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Mark All as Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 5. AI TUTOR CONCEPT BREAKDOWN MODAL                                     */}
      {/* ========================================================================= */}
      <Modal
        visible={isAiModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAiModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalSheetTitle}>✨ AI Study Tutor</Text>
              <TouchableOpacity onPress={() => setAiModalVisible(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 12 }}>
              <View style={styles.aiResultCard}>
                <Text style={styles.aiResultTopic}>{aiTopicTitle}</Text>
                <Text style={styles.aiResultBody}>
                  Here is your concise AI study breakdown:
                  {'\n\n'}
                  • Core Analysis: Processed file contents and key conceptual definitions.
                  {'\n'}
                  • Step-by-Step Breakdown: Important theorems, formulas, and structural mechanisms identified.
                  {'\n'}
                  • Active Recall Recommendations: Added 3 flashcard items to your Spaced Repetition queue.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.aiQuizBtn}
                onPress={() => {
                  setAiModalVisible(false);
                  Alert.alert('Quiz Started', `Starting 3-question quick quiz on ${aiTopicTitle}!`);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.aiQuizBtnText}>📝 Start 3-Question Practice Quiz</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => setAiModalVisible(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 6. SUBJECT DETAIL MODAL                                                */}
      {/* ========================================================================= */}
      <Modal
        visible={!!selectedSubject}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedSubject(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '85%' }]}>
            {selectedSubject && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 24 }}>{selectedSubject.emoji}</Text>
                    <Text style={styles.modalSheetTitle}>{selectedSubject.title}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedSubject(null)}>
                    <Text style={styles.modalCloseBtn}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.subjectMasteryRow}>
                  <Text style={styles.subjectMasteryLabel}>Mastery Level</Text>
                  <Text style={[styles.subjectMasteryVal, { color: selectedSubject.tint }]}>
                    {Math.round(selectedSubject.mastery * 100)}%
                  </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
                  <Text style={styles.syllabusHeading}>LESSON SYLLABUS</Text>
                  {selectedSubject.lessons.map((l, i) => (
                    <View key={i} style={styles.lessonItem}>
                      <View style={[styles.lessonCheck, l.done && styles.lessonCheckDone]}>
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                          {l.done ? '✓' : i + 1}
                        </Text>
                      </View>
                      <Text style={[styles.lessonText, l.done && styles.lessonTextDone]}>
                        {l.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.modalPrimaryBtn, { backgroundColor: selectedSubject.tint }]}
                  onPress={() => {
                    setSelectedSubject(null);
                    Alert.alert('Lesson Resumed', `Continuing: ${selectedSubject.currentTopic}`);
                  }}
                >
                  <Text style={styles.modalPrimaryBtnText}>Resume Next Lesson →</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 7. SPACED REPETITION (SRS) FLASHCARD DRILL MODAL                        */}
      {/* ========================================================================= */}
      <Modal
        visible={isSrsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSrsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalSheetTitle}>⚡ Spaced Repetition Drill</Text>
              <TouchableOpacity onPress={() => setSrsModalVisible(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.cardCounterText}>
              Card {currentCardIndex + 1} of {srsFlashcards.length}
            </Text>

            {/* Tap-to-Flip Flashcard */}
            <TouchableOpacity
              style={styles.flashcardBox}
              onPress={() => setIsCardFlipped(!isCardFlipped)}
              activeOpacity={0.9}
            >
              <Text style={styles.flashcardSideTag}>
                {isCardFlipped ? '💡 ANSWER' : '❓ QUESTION (TAP TO FLIP)'}
              </Text>
              <Text style={styles.flashcardText}>
                {isCardFlipped
                  ? srsFlashcards[currentCardIndex].answer
                  : srsFlashcards[currentCardIndex].question}
              </Text>
            </TouchableOpacity>

            {/* SRS Rating Actions */}
            <View style={styles.srsActionsRow}>
              <TouchableOpacity
                style={[styles.srsRateBtn, { borderColor: '#EF4444' }]}
                onPress={() => {
                  setIsCardFlipped(false);
                  setCurrentCardIndex((prev) => (prev + 1) % srsFlashcards.length);
                }}
              >
                <Text style={{ color: '#EF4444', fontWeight: '700' }}>🔴 Hard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.srsRateBtn, { borderColor: '#F59E0B' }]}
                onPress={() => {
                  setIsCardFlipped(false);
                  setCurrentCardIndex((prev) => (prev + 1) % srsFlashcards.length);
                }}
              >
                <Text style={{ color: '#F59E0B', fontWeight: '700' }}>🟡 Good</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.srsRateBtn, { borderColor: '#10B981', backgroundColor: '#ECFDF5' }]}
                onPress={() => {
                  setIsCardFlipped(false);
                  if (currentCardIndex + 1 >= srsFlashcards.length) {
                    setSrsModalVisible(false);
                    setXp((prev) => prev + 30);
                    Alert.alert('🏆 Drill Complete!', 'All flashcards reviewed! +30 XP awarded.');
                  } else {
                    setCurrentCardIndex((prev) => prev + 1);
                  }
                }}
              >
                <Text style={{ color: '#10B981', fontWeight: '700' }}>🟢 Easy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 8. PROFILE & ACCOUNT SETTINGS MODAL                                    */}
      {/* ========================================================================= */}
      <Modal
        visible={isProfileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalSheetTitle}>👤 Student Profile</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileModalHeader}>
              <View style={styles.profileAvatarLarge}>
                <Text style={styles.profileAvatarText}>
                  {user.name ? user.name[0].toUpperCase() : 'A'}
                </Text>
              </View>
              <Text style={styles.profileModalName}>{user.name || 'Alex'}</Text>
              <Text style={styles.profileModalEmail}>{user.email || 'alex@studpal.app'}</Text>
            </View>

            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatVal}>{xp}</Text>
                <Text style={styles.profileStatLabel}>Total XP</Text>
              </View>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatVal}>{streakCount}d</Text>
                <Text style={styles.profileStatLabel}>Streak</Text>
              </View>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatVal}>Lvl 4</Text>
                <Text style={styles.profileStatLabel}>Scholar</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 🚀 9. AI COACH CHAT DRAWER                                                */}
      {/* ========================================================================= */}
      <Modal
        visible={isAiCoachVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAiCoachVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>✨</Text>
                <Text style={styles.modalSheetTitle}>Branco</Text>
              </View>
              <TouchableOpacity onPress={() => setAiCoachVisible(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 12 }}>
              <View style={styles.chatBubbleAi}>
                <Text style={styles.chatTextAi}>
                  Hello {user.name || 'Alex'}! 👋 I'm Branco, your study companion. What would you like to master today?
                </Text>
              </View>

              <View style={{ gap: 8, marginVertical: 12 }}>
                {[
                  'Explain Integration by Parts step-by-step 📐',
                  'Quiz me on Newton’s Laws of Motion ⚛️',
                  'Create a 30-min revision plan for Chemistry 🧪',
                ].map((prompt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.chatPromptChip}
                    onPress={() => handleOpenAiTopic(prompt)}
                  >
                    <Text style={styles.chatPromptText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => setAiCoachVisible(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // 1. Sticky Top Navbar
  stickyTopNavbar: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    zIndex: 90,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F1D4A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F1D4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  nameBlock: {
    flex: 1,
    gap: 1,
  },
  greetingGreeting: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0B0B0F',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  streakFire: {
    fontSize: 13,
  },
  streakNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brandOrange,
  },
  bellBtn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bellIcon: {
    fontSize: 16,
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brandOrange,
  },

  // 2. Scrollable Body
  scrollContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 120, // Increased for absolute floating bottom nav
    gap: 24,
  },

  // 2. Hero Card
  heroCard: {
    backgroundColor: '#0F1D4A',
    borderRadius: 24,
    padding: 22,
    gap: 18,
    shadowColor: '#0F1D4A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroPretitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  heroScheduleBtn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  xpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  xpBadgeText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
  },
  trackContainer: {
    gap: 8,
  },
  trackBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  trackMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  trackPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resumeBtn: {
    height: 52,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resumeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1D4A',
  },
  resumeArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent,
  },

  // 3. Search Box
  searchBox: {
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  searchSparkle: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  searchAction: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillsContainer: {
    gap: 8,
  },
  minimalPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  minimalPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  // 4. Subjects
  section: {
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subjectsRow: {
    gap: 14,
    paddingVertical: 2,
  },
  cleanSubjectCard: {
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 14,
    shadowColor: '#0F1D4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cleanIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masteryBadge: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  subjectContent: {
    gap: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardTrackBg: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  cardTrackFill: {
    height: '100%',
    borderRadius: 2,
  },

  // 5. Revision Queue
  countBadge: {
    backgroundColor: '#EFF4FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
  },
  queueList: {
    gap: 10,
  },
  quietQueueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  queueIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  queueInfo: {
    flex: 1,
    gap: 2,
  },
  queueTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  queueMeta: {
    fontSize: 11.5,
    color: '#64748B',
  },
  statusTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTagUrgent: {
    backgroundColor: '#FEF2F2',
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statusTagTextUrgent: {
    color: '#EF4444',
    fontWeight: '700',
  },

  // ==========================================
  // MODAL & SHEET STYLES
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
    
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalSheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  modalCloseBtn: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94A3B8',
    padding: 6,
  },
  modalPrimaryBtn: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },

  // File Upload Modal Styles
  uploadSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  uploadOptionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  uploadOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  uploadOptionSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  filePreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  filePreviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  filePreviewSize: {
    fontSize: 12,
    color: '#64748B',
  },
  fileRemoveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
  },

  // ==========================================
  // 🌟 PIXEL-PERFECT POMODORO TIMER STYLES
  // ==========================================
  pomodoroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F4F6FB',
  },
  pomoHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pomoHeaderBackIcon: {
    fontSize: 26,
    fontWeight: '300',
    color: '#0F172A',
    marginTop: -2,
  },
  pomoHeaderGearIcon: {
    fontSize: 18,
  },
  pomoHeaderTitleGroup: {
    alignItems: 'center',
    gap: 2,
  },
  pomoHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  pomoHeaderSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },

  pomodoroScrollBody: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 16,
  },

  // Mode Segmented Switcher
  modeSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  modeTabPill: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  modeTabPillActive: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modeTabText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Screen root
  pomodoroScreenRoot: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },

  // ── Main Focus Card → Dark Premium Card
  mainPomodoroCard: { display: 'none' }, // legacy, unused
  premiumTimerCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 32,
    paddingTop: 22,
    paddingBottom: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
    gap: 6,
  },

  // Mode row
  premiumModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  premiumModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumModeEmoji: { fontSize: 14 },
  premiumModeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C7D2FE',
    letterSpacing: 0.2,
  },
  premiumCycleBadge: {
    backgroundColor: 'rgba(99,102,241,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(165,180,252,0.3)',
  },
  premiumCycleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A5B4FC',
  },

  // Ring
  premiumRingWrapper: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  premiumRingCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  premiumTimerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 3,
  },
  premiumTimerDigits: {
    fontSize: 58,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  premiumTimerSub: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },

  // Controls
  premiumControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
  },
  premiumControlSecondary: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  premiumControlIcon: {
    fontSize: 20,
    color: '#C7D2FE',
  },
  premiumPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  premiumPlayIcon: {
    fontSize: 26,
    color: '#FFFFFF',
  },

  // Cycle dots
  premiumDotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  premiumDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  premiumDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },

  // Session card
  premiumSessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  premiumSessionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  premiumSessionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumSessionCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumChangeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
  premiumSessionSubject: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  premiumSessionTopic: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  // Stats row
  premiumStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  premiumStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  premiumStatVal: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#0F172A',
  },
  premiumStatLabel: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  premiumStatAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    opacity: 0.7,
  },

  // Tip card
  premiumTipCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  premiumTipEmoji: { fontSize: 20, marginTop: 1 },
  premiumTipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 2,
  },
  premiumTipBody: {
    fontSize: 12.5,
    color: '#78350F',
    lineHeight: 18,
  },
  premiumTipClose: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 2,
  },

  // Legacy styles kept for compatibility
  targetIconCircle: { display: 'none' },
  pomoCardTitle: { display: 'none' },
  pomoCardSubtitle: { display: 'none' },
  pomoRingWrapper: { display: 'none' },
  pomoRingCenter: { display: 'none' },
  pomoTimerDigits: { display: 'none' },
  gaugeActionText: { display: 'none' },
  gaugeBottomPill: { display: 'none' },
  gaugeBottomPillText: { display: 'none' },
  cycleTrackerBox: { display: 'none' },
  cycleText: { display: 'none' },
  dotsRow: { display: 'none' },
  cycleDot: { display: 'none' },
  cycleDotActive: { display: 'none' },
  currentSessionCard: { display: 'none' },
  sessionCardHeader: { display: 'none' },
  sessionIconBox: { display: 'none' },
  sessionCardSubLabel: { display: 'none' },
  changeLinkText: { display: 'none' },
  sessionSubjectTitle: { display: 'none' },
  sessionTopicText: { display: 'none' },
  statsCardContainer: { display: 'none' },
  statsCardHeader: { display: 'none' },
  statsHeaderTitle: { display: 'none' },
  statsColumnsRow: { display: 'none' },
  statCol: { display: 'none' },
  statVal: { display: 'none' },
  statLabel: { display: 'none' },
  statDivider: { display: 'none' },
  tipCard: { display: 'none' },
  tipIconCircle: { display: 'none' },
  tipTitle: { display: 'none' },
  tipBody: { display: 'none' },
  tipCloseBtn: { display: 'none' },

  // Settings & Subject Selection Rows
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  adjustCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustCounterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustCounterText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  adjustCounterVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#6366F1',
    minWidth: 24,
    textAlign: 'center',
  },
  subjectSelectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },

  // Streak Modal
  streakHeroBox: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  streakHeroCount: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.brandOrange,
  },
  streakHeroSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: Colors.brandOrange,
  },
  dayCircleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dayCircleTextActive: {
    color: '#FFFFFF',
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  // Notifications
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifCardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // AI Modal
  aiResultCard: {
    backgroundColor: '#F0F6FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#BFDBFE',
  },
  aiResultTopic: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
    marginBottom: 8,
  },
  aiResultBody: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#1E293B',
  },
  aiQuizBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  aiQuizBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Subject Modal
  subjectMasteryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  subjectMasteryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  subjectMasteryVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  syllabusHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginVertical: 8,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  lessonCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCheckDone: {
    backgroundColor: '#10B981',
  },
  lessonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  lessonTextDone: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },

  // Flashcards Drill Modal
  cardCounterText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  flashcardBox: {
    minHeight: 180,
    backgroundColor: '#0F1D4A',
    borderRadius: 22,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#0F1D4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  flashcardSideTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1,
  },
  flashcardText: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 24,
    marginVertical: 12,
  },
  srsActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  srsRateBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  // Profile Modal
  profileModalHeader: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  profileAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F1D4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  profileModalName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileModalEmail: {
    fontSize: 13,
    color: '#64748B',
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileStatItem: {
    alignItems: 'center',
    gap: 2,
  },
  profileStatVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1D4A',
  },
  profileStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  // AI Coach Chat
  chatBubbleAi: {
    backgroundColor: '#F0F6FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#BFDBFE',
  },
  chatTextAi: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1E293B',
  },
  chatPromptChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
  },
  chatPromptText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
});
