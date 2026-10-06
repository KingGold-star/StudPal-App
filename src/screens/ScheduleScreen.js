// src/screens/ScheduleScreen.js

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import Modal from '../components/CustomModal';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import { gamificationService } from '../services/gamification/gamificationService';
import { useTranslation } from '../services/i18n/i18nService';
import { useTheme } from '../theme/themeContext';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ size = 22, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const FolderIcon = ({ size = 18, color = '#6236FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Svg>
);

const CalendarIcon = ({ size = 18, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const ClockIcon = ({ size = 18, color = '#6236FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const PlusIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const CloseIcon = ({ size = 18, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const TagIcon = ({ size = 14, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <Line x1="7" y1="7" x2="7.01" y2="7" />
  </Svg>
);

const LocationPinIcon = ({ size = 14, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const UserIcon = ({ size = 14, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const TrashIcon = ({ size = 14, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Svg>
);

const SparklesIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

const AlertTriangleIcon = ({ size = 28, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Line x1="12" y1="9" x2="12" y2="13" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

// --- Dynamic Date Helpers ---
const getOffsetDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getOffsetDateInfo = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return {
    date: getOffsetDate(offsetDays),
    dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
    dayNum: String(d.getDate()),
  };
};

const TODAY_DATE = getOffsetDate(0);

// ─── Dummy Initial Data ──────────────────────────────────────────────────────
const INITIAL_CALENDAR_EVENTS = [
  {
    id: 'cal-1',
    title: 'Physics Midterm Exam',
    type: 'Exam',
    subject: 'Physics',
    date: getOffsetDate(0),
    time: '10:00 AM - 12:00 PM',
    location: 'Exam Hall B',
    color: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    id: 'cal-2',
    title: 'Calculus Problem Set #4 Due',
    type: 'Deadline',
    subject: 'Mathematics',
    date: getOffsetDate(0),
    time: '11:59 PM',
    location: 'Online Portal',
    color: '#F97316',
    bg: '#FFF7ED',
  },
  {
    id: 'cal-3',
    title: 'Organic Chemistry Revision Session',
    type: 'Session',
    subject: 'Chemistry',
    date: getOffsetDate(1),
    time: '3:00 PM - 4:30 PM',
    location: 'Library Quiet Zone',
    color: '#2D62FF',
    bg: '#EFF6FF',
  },
  {
    id: 'cal-4',
    title: 'Biology Lab Report Submission',
    type: 'Deadline',
    subject: 'Biology',
    date: getOffsetDate(3),
    time: '5:00 PM',
    location: 'Science Building',
    color: '#10B981',
    bg: '#ECFDF5',
  },
];

const INITIAL_TIMETABLE_ROUTINE = [
  {
    id: 'tt-1',
    day: 'Mon',
    subject: 'Mathematics',
    topic: 'Calculus II: Derivatives & Flux',
    time: '4:00 PM - 5:30 PM',
    room: 'Room 302',
    instructor: 'Dr. Vance',
    color: '#2D62FF',
    bg: '#EFF6FF',
  },
  {
    id: 'tt-2',
    day: 'Mon',
    subject: 'Physics',
    topic: 'Electromagnetism & Wave Optics',
    time: '6:00 PM - 7:30 PM',
    room: 'Lab B',
    instructor: 'Prof. Reynolds',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    id: 'tt-3',
    day: 'Tue',
    subject: 'Organic Chemistry',
    topic: 'Reaction Mechanisms & Synthesis',
    time: '5:00 PM - 6:30 PM',
    room: 'Hall 101',
    instructor: 'Dr. Aris',
    color: '#0EA5E9',
    bg: '#F0F9FF',
  },
  {
    id: 'tt-4',
    day: 'Wed',
    subject: 'Biology',
    topic: 'Cellular Respiration & Genetics',
    time: '3:30 PM - 5:00 PM',
    room: 'Bio Lab 4',
    instructor: 'Dr. Chen',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    id: 'tt-5',
    day: 'Thu',
    subject: 'Computer Science',
    topic: 'Data Structures & Algorithms',
    time: '4:00 PM - 5:30 PM',
    room: 'CS Lab 2',
    instructor: 'Prof. Miller',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    id: 'tt-6',
    day: 'Fri',
    subject: 'Mathematics',
    topic: 'Integration & Problem Solving',
    time: '2:00 PM - 3:30 PM',
    room: 'Room 302',
    instructor: 'Dr. Vance',
    color: '#2D62FF',
    bg: '#EFF6FF',
  },
];

const ROUTINE_COLOR_PALETTES = [
  { label: 'Blue', color: '#2D62FF', bg: '#EFF6FF' },
  { label: 'Indigo', color: '#6366F1', bg: '#EEF2FF' },
  { label: 'Sky', color: '#0EA5E9', bg: '#F0F9FF' },
  { label: 'Emerald', color: '#10B981', bg: '#ECFDF5' },
  { label: 'Purple', color: '#8B5CF6', bg: '#F5F3FF' },
  { label: 'Orange', color: '#F97316', bg: '#FFF7ED' },
  { label: 'Rose', color: '#EF4444', bg: '#FEF2F2' },
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleScreen({ user = { name: 'Alex' }, onBack, onSelectTab }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isDark, accentColor } = useTheme();
  const styles = useMemo(() => getScheduleStyles(isDark, accentColor, insets), [isDark, accentColor, insets]);
  
  // Hub Segment State: 'calendar' (date-specific) or 'timetable' (weekly routine)
  const [activeSegment, setActiveSegment] = useState('calendar');

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState(INITIAL_CALENDAR_EVENTS);
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
  const [calendarFilter, setCalendarFilter] = useState('All');
  const [isAddCalModalOpen, setAddCalModalOpen] = useState(false);

  // Calendar Modal Form State
  const [newCalTitle, setNewCalTitle] = useState('');
  const [newCalType, setNewCalType] = useState('Session');
  const [newCalSubject, setNewCalSubject] = useState('Mathematics');
  const [newCalDate, setNewCalDate] = useState(TODAY_DATE);
  const [newCalTime, setNewCalTime] = useState('4:00 PM - 5:00 PM');
  const [newCalLocation, setNewCalLocation] = useState('Library');
  const [newCalNotes, setNewCalNotes] = useState('');

  // Timetable State
  const [timetableRoutines, setTimetableRoutines] = useState(INITIAL_TIMETABLE_ROUTINE);
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [isAddTtModalOpen, setAddTtModalOpen] = useState(false);

  // Timetable Modal Form State
  const [newTtSubject, setNewTtSubject] = useState('');
  const [newTtTopic, setNewTtTopic] = useState('');
  const [newTtDay, setNewTtDay] = useState('Mon');
  const [newTtTime, setNewTtTime] = useState('4:00 PM - 5:30 PM');
  const [newTtRoom, setNewTtRoom] = useState('Room 201');
  const [newTtInstructor, setNewTtInstructor] = useState('');
  const [newTtColor, setNewTtColor] = useState('#2D62FF');
  const [newTtBg, setNewTtBg] = useState('#EFF6FF');
  const [newTtFocusMode, setNewTtFocusMode] = useState(false);

  // Custom Delete Verification Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Date Ribbon Generator (Current real-life dates)
  const dateRibbon = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => getOffsetDateInfo(i - 3));
  }, []);

  // Filtered Calendar Events
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter((evt) => {
      const matchesDate = evt.date === selectedDate || calendarFilter === 'All';
      const matchesCategory = calendarFilter === 'All' || evt.type === calendarFilter;
      return matchesDate && matchesCategory;
    });
  }, [calendarEvents, selectedDate, calendarFilter]);

  // Filtered Timetable Routines for selected day
  const dayRoutines = useMemo(() => {
    return timetableRoutines.filter((item) => item.day === selectedDay);
  }, [timetableRoutines, selectedDay]);

  // Open Modals with current context preset
  const handleOpenAddModal = () => {
    if (activeSegment === 'calendar') {
      setNewCalDate(selectedDate);
      setAddCalModalOpen(true);
    } else {
      setNewTtDay(selectedDay);
      setAddTtModalOpen(true);
    }
  };

  // Handlers
  const handleAddCalendarEvent = () => {
    if (!newCalTitle.trim()) {
      Alert.alert('Event Title Required', 'Please enter a valid event title.');
      return;
    }
    const newEvt = {
      id: `cal-${Date.now()}`,
      title: newCalTitle.trim(),
      type: newCalType,
      subject: newCalSubject.trim() || 'General Study',
      date: newCalDate || selectedDate,
      time: newCalTime.trim() || 'All Day',
      location: newCalLocation.trim(),
      notes: newCalNotes.trim(),
      color: newCalType === 'Exam' ? '#EF4444' : newCalType === 'Deadline' ? '#F97316' : '#2D62FF',
      bg: newCalType === 'Exam' ? '#FEF2F2' : newCalType === 'Deadline' ? '#FFF7ED' : '#EFF6FF',
    };
    setCalendarEvents([newEvt, ...calendarEvents]);
    setAddCalModalOpen(false);
    setNewCalTitle('');
    setNewCalLocation('Library');
    setNewCalNotes('');
    gamificationService.awardXp('ADD_SCHEDULE_EVENT', 15, `Scheduled: ${newEvt.title}`, `cal_evt_${newEvt.id}`);
    Alert.alert('Event Added! 📅', `"${newEvt.title}" added to your study calendar.`);
  };

  const promptDeleteEvent = (evt) => {
    setDeleteTarget({
      id: evt.id,
      type: 'calendar',
      title: evt.title,
      subtitle: evt.subject,
      category: evt.type,
      time: evt.time,
      dateOrDay: evt.date,
      location: evt.location,
      color: evt.color,
    });
    setIsDeleteModalOpen(true);
  };

  const handleAddTimetableRoutine = () => {
    if (!newTtSubject.trim()) {
      Alert.alert('Subject Required', 'Please enter a valid subject name.');
      return;
    }
    const newTt = {
      id: `tt-${Date.now()}`,
      day: newTtDay,
      subject: newTtSubject.trim(),
      topic: newTtTopic.trim() || 'General Weekly Session',
      time: newTtTime.trim() || 'TBD',
      room: newTtRoom.trim() || 'Main Hall',
      instructor: newTtInstructor.trim() || 'Self-Scheduled',
      focusMode: newTtFocusMode,
      color: newTtColor || '#2D62FF',
      bg: newTtBg || '#EFF6FF',
    };
    setTimetableRoutines([...timetableRoutines, newTt]);
    setAddTtModalOpen(false);
    setNewTtSubject('');
    setNewTtTopic('');
    setNewTtRoom('Room 201');
    setNewTtInstructor('');
    setNewTtFocusMode(false);
    gamificationService.awardXp('ADD_TIMETABLE_ROUTINE', 15, `Added Routine: ${newTt.subject}`, `tt_evt_${newTt.id}`);
    Alert.alert('Routine Added! ⏰', `${newTt.subject} added to your ${newTt.day} weekly timetable.`);
  };

  const promptDeleteRoutine = (routine) => {
    setDeleteTarget({
      id: routine.id,
      type: 'timetable',
      title: routine.subject,
      subtitle: routine.topic,
      category: 'Weekly Routine',
      time: routine.time,
      dateOrDay: routine.day,
      location: routine.room,
      color: routine.color,
    });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'calendar') {
      setCalendarEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } else {
      setTimetableRoutines((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    }

    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0B0F19" : "#FFFFFF"} />

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <View style={styles.topHeaderBar}>
        <View style={styles.headerTitleGroup}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <ChevronLeftIcon size={22} color={isDark ? "#F8FAFC" : "#0F172A"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle} numberOfLines={1}>{t("schedule.title", "Schedule Hub")}</Text>
            <Text style={styles.screenSubtitle} numberOfLines={1}>
              {activeSegment === 'calendar' ? t("schedule.manageEvents", "Manage calendar events") : t("schedule.manageRoutine", "Manage weekly routine")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addTriggerBtn}
          onPress={handleOpenAddModal}
          activeOpacity={0.85}
        >
          <PlusIcon size={16} color="#FFFFFF" />
          <Text style={styles.addTriggerText}>{activeSegment === 'calendar' ? t("schedule.event", "Event") : t("schedule.routine", "Routine")}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Segment Control Switcher (Calendar vs Timetable) ──────────── */}
      <View style={styles.segmentWrapper}>
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'calendar' && styles.segmentBtnActive]}
            onPress={() => setActiveSegment('calendar')}
            activeOpacity={0.85}
          >
            <CalendarIcon size={16} color={activeSegment === 'calendar' ? (isDark ? accentColor : '#2D62FF') : (isDark ? '#94A3B8' : '#64748B')} />
            <Text style={[styles.segmentText, activeSegment === 'calendar' && styles.segmentTextActive]}>
              {t("schedule.calendar", "Calendar")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'timetable' && styles.segmentBtnActive]}
            onPress={() => setActiveSegment('timetable')}
            activeOpacity={0.85}
          >
            <ClockIcon size={16} color={activeSegment === 'timetable' ? (isDark ? accentColor : '#6236FF') : (isDark ? '#94A3B8' : '#64748B')} />
            <Text style={[styles.segmentText, activeSegment === 'timetable' && styles.segmentTextActive]}>
              {t("schedule.timetable", "Timetable")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Content Scroll Area ────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 110 }}
      >
        {activeSegment === 'calendar' ? (
          /* ========================================================================= */
          /* 📅 1. CALENDAR VIEW (Date-Specific Events & Activities)                    */
          /* ========================================================================= */
          <View style={styles.sectionContainer}>
            {/* Banner explaining Calendar distinction */}
            <View style={styles.hubInfoBanner}>
              <View style={styles.infoBannerIconBox}>
                <CalendarIcon size={18} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoBannerTitle}>{t("schedule.dateSpecificCalendar", "Date-Specific Calendar")}</Text>
                <Text style={styles.infoBannerSub}>
                  {t("schedule.calendarSub", "Exams, deadlines, and planned study sessions on specific dates.")}
                </Text>
              </View>
            </View>

            {/* Date Picker Ribbon */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateRibbonContainer}
            >
              {dateRibbon.map((d) => {
                const isSelected = selectedDate === d.date;
                return (
                  <TouchableOpacity
                    key={d.date}
                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                    onPress={() => setSelectedDate(d.date)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dayNameText, isSelected && styles.dayNameSelected]}>{d.dayName}</Text>
                    <Text style={[styles.dayNumText, isSelected && styles.dayNumSelected]}>{d.dayNum}</Text>
                    {isSelected && <View style={styles.dateActiveDot} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPillsRow}
            >
              {['All', 'Exam', 'Deadline', 'Session'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterPill, calendarFilter === cat && styles.filterPillActive]}
                  onPress={() => setCalendarFilter(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterPillText, calendarFilter === cat && styles.filterPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Events List */}
            <View style={styles.eventsListContainer}>
              {filteredEvents.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={{ fontSize: 32 }}>📅</Text>
                  <Text style={styles.emptyTitle}>No Events Scheduled</Text>
                  <Text style={styles.emptySub}>No study tasks or exams on this date.</Text>
                </View>
              ) : (
                filteredEvents.map((evt) => (
                  <TouchableOpacity
                    key={evt.id}
                    style={styles.eventCard}
                    activeOpacity={0.9}
                    onLongPress={() => promptDeleteEvent(evt)}
                  >
                    <View style={[styles.eventTypeStrip, { backgroundColor: evt.color }]} />

                    <View style={styles.eventCardBody}>
                      <View style={styles.eventHeaderRow}>
                        <View style={[styles.typeTagPill, { backgroundColor: isDark ? `${evt.color}25` : evt.bg }]}>
                          <Text style={[styles.typeTagText, { color: evt.color }]}>
                            {evt.type === 'Exam' ? '📝 EXAM' : evt.type === 'Deadline' ? '⏳ DEADLINE' : '📚 SESSION'}
                          </Text>
                        </View>
                        <View style={styles.subjectPillBadge}>
                          <Text style={styles.eventSubjectText}>{evt.subject}</Text>
                        </View>
                      </View>

                      <Text style={styles.eventTitleText}>{evt.title}</Text>

                      {evt.notes ? (
                        <View style={[styles.eventNotesContainer, { borderLeftColor: evt.color }]}>
                          <Text style={styles.eventNotesText} numberOfLines={2}>
                            {evt.notes}
                          </Text>
                        </View>
                      ) : null}

                      <View style={styles.eventFooterRow}>
                        <View style={styles.metaChip}>
                          <ClockIcon size={12} color={isDark ? "#94A3B8" : "#475569"} />
                          <Text style={styles.metaChipText}>{evt.time}</Text>
                        </View>
                        {evt.location ? (
                          <View style={styles.metaChip}>
                            <LocationPinIcon size={12} color={isDark ? "#94A3B8" : "#475569"} />
                            <Text style={styles.metaChipText} numberOfLines={1}>{evt.location}</Text>
                          </View>
                        ) : null}
                        <TouchableOpacity
                          style={styles.cardDeleteBtn}
                          onPress={() => promptDeleteEvent(evt)}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          activeOpacity={0.7}
                        >
                          <TrashIcon size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        ) : (
          /* ========================================================================= */
          /* ⏰ 2. TIMETABLE VIEW (Recurring Weekly Study Routine)                      */
          /* ========================================================================= */
          <View style={styles.sectionContainer}>
            {/* Banner explaining Timetable distinction */}
            <View style={[styles.hubInfoBanner, isDark ? { backgroundColor: '#1E293B', borderColor: '#334155' } : { backgroundColor: '#F5F3FF', borderColor: '#E9E3FF' }]}>
              <View style={[styles.infoBannerIconBox, isDark ? { backgroundColor: `${accentColor}25` } : { backgroundColor: '#ECE6FF' }]}>
                <ClockIcon size={18} color={isDark ? accentColor : '#6236FF'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoBannerTitle, isDark ? { color: '#F8FAFC' } : { color: '#0F172A' }]}>{t("schedule.weeklyTimetable", "Weekly Study Timetable")}</Text>
                <Text style={[styles.infoBannerSub, isDark ? { color: '#94A3B8' } : { color: '#334155' }]}>
                  {t("schedule.timetableSub", "Your recurring weekly class schedule and study routine (e.g. Mon 4:00 PM).")}
                </Text>
              </View>
            </View>

            {/* Day of Week Selector */}
            <View style={styles.daySelectorRow}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.daySelectorChip, isSelected && styles.daySelectorChipSelected]}
                    onPress={() => setSelectedDay(day)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.daySelectorText, isSelected && styles.daySelectorTextSelected]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Day Routine List */}
            <View style={styles.routineListContainer}>
              <Text style={styles.routineDayHeader}>{selectedDay}'s Recurring Schedule</Text>

              {dayRoutines.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={{ fontSize: 32 }}>⏰</Text>
                  <Text style={styles.emptyTitle}>Free Day!</Text>
                  <Text style={styles.emptySub}>No recurring sessions scheduled for {selectedDay}.</Text>
                </View>
              ) : (
                dayRoutines.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.routineCard}
                    activeOpacity={0.9}
                    onLongPress={() => promptDeleteRoutine(item)}
                  >
                    <View style={[styles.routineIconBox, { backgroundColor: isDark ? (item.color ? `${item.color}25` : '#1E293B') : (item.bg || '#EFF6FF') }]}>
                      <Text style={[styles.routineAvatarInitials, { color: item.color || '#2D62FF' }]}>
                        {item.subject ? item.subject.substring(0, 2).toUpperCase() : 'SB'}
                      </Text>
                    </View>

                    <View style={styles.routineCardBody}>
                      <View style={styles.routineHeaderRow}>
                        <Text style={styles.routineSubjectTitle} numberOfLines={1}>{item.subject}</Text>
                        <View style={[styles.routineTimeBadge, { backgroundColor: isDark ? `${item.color || '#6236FF'}25` : (item.bg || '#EFF6FF') }]}>
                          <ClockIcon size={11} color={item.color || '#6236FF'} />
                          <Text style={[styles.routineTimeText, { color: item.color || '#6236FF' }]}>{item.time}</Text>
                        </View>
                      </View>

                      <Text style={styles.routineTopicText} numberOfLines={1}>{item.topic || 'General Weekly Session'}</Text>

                      <View style={styles.routineMetaRow}>
                        {item.room ? (
                          <View style={styles.metaChip}>
                            <LocationPinIcon size={11} color={isDark ? "#94A3B8" : "#64748B"} />
                            <Text style={styles.metaChipText} numberOfLines={1}>{item.room}</Text>
                          </View>
                        ) : null}
                        {item.instructor ? (
                          <View style={styles.metaChip}>
                            <UserIcon size={11} color={isDark ? "#94A3B8" : "#64748B"} />
                            <Text style={styles.metaChipText} numberOfLines={1}>{item.instructor}</Text>
                          </View>
                        ) : null}
                        {item.focusMode ? (
                          <View style={styles.focusModeActiveChip}>
                            <Text style={styles.focusModeActiveText}>⚡ Focus Locked</Text>
                          </View>
                        ) : null}
                        <TouchableOpacity
                          style={styles.cardDeleteBtn}
                          onPress={() => promptDeleteRoutine(item)}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          activeOpacity={0.7}
                        >
                          <TrashIcon size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── 1. ADD CALENDAR EVENT MODAL ───────────────────────────────── */}
      <Modal visible={isAddCalModalOpen} animationType="slide" transparent onRequestClose={() => setAddCalModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalDragHandle} />

            <View style={styles.modalSheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.modalHeaderIconBox, { backgroundColor: isDark ? `${accentColor}25` : '#EFF6FF' }]}>
                  <CalendarIcon size={18} color={accentColor} />
                </View>
                <View>
                  <Text style={styles.modalSheetTitle}>Add Calendar Event</Text>
                  <Text style={styles.modalSheetSub}>Schedule an exam, deadline, or study session</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setAddCalModalOpen(false)} style={styles.modalCloseBtn} activeOpacity={0.7}>
                <CloseIcon size={16} color={isDark ? "#F8FAFC" : "#64748B"} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <View style={styles.formSectionCard}>
                  <Text style={styles.inputLabel}>Event Title *</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Physics Midterm Exam, Problem Set #4 Due"
                    placeholderTextColor="#94A3B8"
                    value={newCalTitle}
                    onChangeText={setNewCalTitle}
                  />

                  <Text style={styles.inputLabel}>Category Type</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {['Session', 'Exam', 'Deadline'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typeChoiceChip, newCalType === type && styles.typeChoiceSelected]}
                        onPress={() => setNewCalType(type)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.typeChoiceText, newCalType === type && styles.typeChoiceTextSelected]}>
                          {type === 'Exam' ? '📝 Exam' : type === 'Deadline' ? '⏳ Deadline' : '📚 Session'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formSectionCard}>
                  <Text style={styles.inputLabel}>Event Date</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    {dateRibbon.slice(0, 14).map((d) => {
                      const isSelected = newCalDate === d.date;
                      return (
                        <TouchableOpacity
                          key={d.date}
                          style={[styles.modalDateChip, isSelected && styles.modalDateChipSelected]}
                          onPress={() => setNewCalDate(d.date)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.modalDateDayName, isSelected && styles.modalDateTextSelected]}>{d.dayName}</Text>
                          <Text style={[styles.modalDateDayNum, isSelected && styles.modalDateTextSelected]}>{d.dayNum}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.formSectionCard}>
                  <Text style={styles.inputLabel}>Subject</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Mathematics, Chemistry, Physics"
                    placeholderTextColor="#94A3B8"
                    value={newCalSubject}
                    onChangeText={setNewCalSubject}
                  />

                  <Text style={styles.inputLabel}>Time / Due Time</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. 10:00 AM - 12:00 PM or 11:59 PM"
                    placeholderTextColor="#94A3B8"
                    value={newCalTime}
                    onChangeText={setNewCalTime}
                  />

                  <Text style={styles.inputLabel}>Location / Room / Portal</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Exam Hall B, Library Quiet Zone, Online Portal"
                    placeholderTextColor="#94A3B8"
                    value={newCalLocation}
                    onChangeText={setNewCalLocation}
                  />

                  <Text style={styles.inputLabel}>Notes & Instructions (Optional)</Text>
                  <TextInput
                    style={[styles.modalTextInput, { height: 68, textAlignVertical: 'top' }]}
                    placeholder="e.g. Covers chapters 1-4. Bring scientific calculator & formula sheet."
                    placeholderTextColor="#94A3B8"
                    multiline
                    value={newCalNotes}
                    onChangeText={setNewCalNotes}
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleAddCalendarEvent} activeOpacity={0.88}>
              <SparklesIcon size={16} color="#FFFFFF" />
              <Text style={styles.modalActionBtnText}>Schedule Event</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── 2. ADD RECURRING TIMETABLE MODAL ──────────────────────────── */}
      <Modal visible={isAddTtModalOpen} animationType="slide" transparent onRequestClose={() => setAddTtModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalDragHandle} />

            <View style={styles.modalSheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.modalHeaderIconBox, { backgroundColor: isDark ? `${accentColor}25` : '#F5F3FF' }]}>
                  <ClockIcon size={18} color={accentColor} />
                </View>
                <View>
                  <Text style={styles.modalSheetTitle}>Add Weekly Class Routine</Text>
                  <Text style={styles.modalSheetSub}>Recurring lecture, lab, or study slot</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setAddTtModalOpen(false)} style={styles.modalCloseBtn} activeOpacity={0.7}>
                <CloseIcon size={16} color={isDark ? "#F8FAFC" : "#64748B"} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <View style={styles.formSectionCard}>
                  <Text style={styles.inputLabel}>Subject Name *</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Mathematics, Organic Chemistry, Physics"
                    placeholderTextColor="#94A3B8"
                    value={newTtSubject}
                    onChangeText={setNewTtSubject}
                  />

                  <Text style={styles.inputLabel}>Lesson Topic / Module Description</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Calculus II: Derivatives & Flux, Wave Optics"
                    placeholderTextColor="#94A3B8"
                    value={newTtTopic}
                    onChangeText={setNewTtTopic}
                  />
                </View>

                <View style={styles.formSectionCard}>
                  <Text style={styles.inputLabel}>Day of Week</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    {DAYS_OF_WEEK.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[styles.typeChoiceChip, newTtDay === day && styles.typeChoiceSelected]}
                        onPress={() => setNewTtDay(day)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.typeChoiceText, newTtDay === day && styles.typeChoiceTextSelected]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.formSectionCard}>
                  <Text style={styles.inputLabel}>Time Slot</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. 4:00 PM - 5:30 PM"
                    placeholderTextColor="#94A3B8"
                    value={newTtTime}
                    onChangeText={setNewTtTime}
                  />

                  <Text style={styles.inputLabel}>Room / Venue / Link</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Room 302, Science Lab B, or Zoom Meeting"
                    placeholderTextColor="#94A3B8"
                    value={newTtRoom}
                    onChangeText={setNewTtRoom}
                  />

                  <Text style={styles.inputLabel}>Instructor / Professor / Tutor</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Dr. Vance, Prof. Reynolds, Self-Paced"
                    placeholderTextColor="#94A3B8"
                    value={newTtInstructor}
                    onChangeText={setNewTtInstructor}
                  />

                  <Text style={styles.inputLabel}>Subject Color Theme</Text>
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginVertical: 4 }}>
                    {ROUTINE_COLOR_PALETTES.map((pal) => {
                      const isColorSelected = newTtColor === pal.color;
                      return (
                        <TouchableOpacity
                          key={pal.color}
                          onPress={() => {
                            setNewTtColor(pal.color);
                            setNewTtBg(pal.bg);
                          }}
                          style={[
                            styles.colorPaletteCircle,
                            { backgroundColor: pal.color },
                            isColorSelected && styles.colorPaletteSelected,
                          ]}
                          activeOpacity={0.8}
                        />
                      );
                    })}
                  </View>

                  <View style={styles.focusToggleContainer}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text style={styles.inputLabel}>Focus Mode during session</Text>
                      <Text style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B' }}>Automatically silence alerts & lock apps</Text>
                    </View>
                    <Switch
                      value={newTtFocusMode}
                      onValueChange={setNewTtFocusMode}
                      trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: accentColor }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleAddTimetableRoutine} activeOpacity={0.88}>
              <SparklesIcon size={16} color="#FFFFFF" />
              <Text style={styles.modalActionBtnText}>Save Weekly Routine</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── 3. DELETE CONFIRMATION & VERIFICATION MODAL ────────────────── */}
      <Modal
        visible={isDeleteModalOpen}
        animationType="fade"
        transparent
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmCardContainer}>
            {/* Warning Icon Badge */}
            <View style={styles.confirmWarningBadge}>
              <AlertTriangleIcon size={32} color="#EF4444" />
            </View>

            {/* Title & Warning Copy */}
            <Text style={styles.confirmModalTitle}>
              {deleteTarget?.type === 'calendar' ? 'Delete Calendar Event?' : 'Delete Weekly Routine?'}
            </Text>
            <Text style={styles.confirmModalSub}>
              This action cannot be undone. Are you sure you want to permanently remove this from your study schedule?
            </Text>

            {/* Verification Preview Card */}
            {deleteTarget ? (
              <View style={styles.confirmPreviewBox}>
                <View style={[styles.confirmPreviewColorBar, { backgroundColor: deleteTarget.color || '#EF4444' }]} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.confirmPreviewTitle} numberOfLines={1}>
                    {deleteTarget.title}
                  </Text>
                  <Text style={styles.confirmPreviewSub} numberOfLines={1}>
                    {deleteTarget.subtitle} • {deleteTarget.dateOrDay}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
                    <Text style={styles.confirmPreviewTime}>
                      ⏰ {deleteTarget.time}
                    </Text>
                    {deleteTarget.location ? (
                      <Text style={styles.confirmPreviewLocation} numberOfLines={1}>
                        📍 {deleteTarget.location}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Action Buttons Row */}
            <View style={styles.confirmActionsRow}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={handleCancelDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={handleConfirmDelete}
                activeOpacity={0.85}
              >
                <TrashIcon size={16} color="#FFFFFF" />
                <Text style={styles.confirmDeleteBtnText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const baseScheduleStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  headerTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    color: '#334155',
    fontWeight: '600',
  },
  addTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2D62FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 14,
    justifyContent: 'center',
  },
  headerSubjectsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(98, 54, 255, 0.2)',
  },
  addTriggerText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  segmentWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 12,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
  segmentTextActive: {
    fontWeight: '800',
    color: '#0F172A',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  sectionContainer: {
    gap: 14,
  },

  hubInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 14,
  },
  infoBannerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  infoBannerSub: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    marginTop: 1,
  },

  // Date Ribbon
  dateRibbonContainer: {
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  dateCard: {
    width: 56,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  dateCardSelected: {
    backgroundColor: '#2D62FF',
    shadowColor: '#2D62FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.1 }],
    zIndex: 10,
  },
  dayNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: '#93C5FD',
  },
  dayNumText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  dayNumSelected: {
    color: '#FFFFFF',
  },
  dateActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },

  // Filter Pills
  filterPillsRow: {
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Events List
  eventsListContainer: {
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  eventTypeStrip: {
    width: 5,
  },
  eventCardBody: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  subjectPillBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eventSubjectText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  eventTitleText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  eventNotesContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginVertical: 2,
  },
  eventNotesText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  eventFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    maxWidth: '46%',
  },
  metaChipText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
  },
  cardDeleteBtn: {
    marginLeft: 'auto',
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Timetable
  daySelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  daySelectorChip: {
    flex: 1,
    paddingVertical: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  daySelectorChipSelected: {
    backgroundColor: '#6236FF',
    borderColor: '#6236FF',
    shadowColor: '#6236FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.1 }],
    zIndex: 10,
  },
  daySelectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  daySelectorTextSelected: {
    color: '#FFFFFF',
  },

  routineListContainer: {
    gap: 12,
    marginTop: 4,
  },
  routineDayHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  routineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  routineIconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineAvatarInitials: {
    fontSize: 15,
    fontWeight: '900',
  },
  routineCardBody: {
    flex: 1,
    gap: 4,
  },
  routineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineSubjectTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  routineTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  routineTimeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  routineTopicText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
  routineMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  focusModeActiveChip: {
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  focusModeActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6236FF',
  },

  // Empty State
  emptyCard: {
    backgroundColor: 'rgba(45, 98, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(45, 98, 255, 0.15)',
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalDragHandle: {
    width: 42,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 6,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  modalHeaderIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  modalSheetSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollBody: {
    maxHeight: 440,
  },
  formGroup: {
    gap: 12,
  },
  formSectionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  typeChoiceChip: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChoiceSelected: {
    backgroundColor: '#2D62FF',
    borderColor: '#2D62FF',
    shadowColor: '#2D62FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  typeChoiceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  typeChoiceTextSelected: {
    color: '#FFFFFF',
  },
  modalDateChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 48,
  },
  modalDateChipSelected: {
    backgroundColor: '#2D62FF',
    borderColor: '#2D62FF',
    shadowColor: '#2D62FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modalDateDayName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  modalDateDayNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalDateTextSelected: {
    color: '#FFFFFF',
  },
  colorPaletteCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorPaletteSelected: {
    borderWidth: 3.5,
    borderColor: '#0F172A',
    transform: [{ scale: 1.15 }],
  },
  focusToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#112B8A',
    borderRadius: 16,
    height: 52,
    minHeight: 48,
    shadowColor: '#112B8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
    marginTop: 6,
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },

  // Confirmation & Verification Modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  confirmCardContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 12,
  },
  confirmWarningBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  confirmModalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 6,
  },
  confirmPreviewBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    marginVertical: 4,
  },
  confirmPreviewColorBar: {
    width: 4,
    height: '80%',
    borderRadius: 2,
  },
  confirmPreviewTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  confirmPreviewSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  confirmPreviewTime: {
    fontSize: 11.5,
    color: '#2D62FF',
    fontWeight: '700',
  },
  confirmPreviewLocation: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  confirmActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  confirmCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  confirmDeleteBtn: {
    flex: 1.25,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmDeleteBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

function getScheduleStyles(isDark, activeAccentColor = '#2D62FF', insets = { bottom: 0 }) {
  return {
    ...baseScheduleStyles,
    root: [
      baseScheduleStyles.root,
      isDark && { backgroundColor: '#0B0F19' },
    ],
    topHeaderBar: [
      baseScheduleStyles.topHeaderBar,
      isDark && { backgroundColor: '#0B0F19' },
    ],
    backButton: [
      baseScheduleStyles.backButton,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', shadowOpacity: 0 },
    ],
    screenTitle: [
      baseScheduleStyles.screenTitle,
      isDark && { color: '#F8FAFC' },
    ],
    screenSubtitle: [
      baseScheduleStyles.screenSubtitle,
      isDark && { color: '#94A3B8' },
    ],
    addTriggerBtn: [
      baseScheduleStyles.addTriggerBtn,
      { backgroundColor: activeAccentColor },
    ],
    segmentWrapper: [
      baseScheduleStyles.segmentWrapper,
      isDark && { backgroundColor: '#0B0F19', borderColor: '#1E293B' },
    ],
    segmentContainer: [
      baseScheduleStyles.segmentContainer,
      isDark && { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B' },
    ],
    segmentBtnActive: [
      baseScheduleStyles.segmentBtnActive,
      isDark && { backgroundColor: '#1E293B', shadowOpacity: 0 },
    ],
    segmentText: [
      baseScheduleStyles.segmentText,
      isDark && { color: '#94A3B8' },
    ],
    segmentTextActive: [
      baseScheduleStyles.segmentTextActive,
      isDark && { color: '#F8FAFC' },
    ],
    dateCard: [
      baseScheduleStyles.dateCard,
      isDark && { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', shadowOpacity: 0 },
    ],
    dateCardSelected: [
      baseScheduleStyles.dateCardSelected,
      { backgroundColor: activeAccentColor, borderColor: activeAccentColor, shadowColor: activeAccentColor },
    ],
    dayNameText: [
      baseScheduleStyles.dayNameText,
      isDark && { color: '#94A3B8' },
    ],
    dayNameSelected: [
      baseScheduleStyles.dayNameSelected,
      { color: '#FFFFFF' },
    ],
    dayNumText: [
      baseScheduleStyles.dayNumText,
      isDark && { color: '#F8FAFC' },
    ],
    dayNumSelected: [
      baseScheduleStyles.dayNumSelected,
      { color: '#FFFFFF' },
    ],
    filterPill: [
      baseScheduleStyles.filterPill,
      isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
    ],
    filterPillActive: [
      baseScheduleStyles.filterPillActive,
      { backgroundColor: activeAccentColor, borderColor: activeAccentColor },
    ],
    filterPillText: [
      baseScheduleStyles.filterPillText,
      isDark && { color: '#94A3B8' },
    ],
    filterPillTextActive: [
      baseScheduleStyles.filterPillTextActive,
      { color: '#FFFFFF' },
    ],
    hubInfoBanner: [
      baseScheduleStyles.hubInfoBanner,
      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
    ],
    infoBannerIconBox: [
      baseScheduleStyles.infoBannerIconBox,
      isDark && { backgroundColor: `${activeAccentColor}25` },
    ],
    infoBannerTitle: [
      baseScheduleStyles.infoBannerTitle,
      isDark && { color: '#F8FAFC' },
    ],
    infoBannerSub: [
      baseScheduleStyles.infoBannerSub,
      isDark && { color: '#94A3B8' },
    ],
    emptyCard: [
      baseScheduleStyles.emptyCard,
      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
    ],
    emptyTitle: [
      baseScheduleStyles.emptyTitle,
      isDark && { color: '#F8FAFC' },
    ],
    emptySub: [
      baseScheduleStyles.emptySub,
      isDark && { color: '#94A3B8' },
    ],
    eventCard: [
      baseScheduleStyles.eventCard,
      isDark && { backgroundColor: '#1E293B', borderColor: '#334155', shadowOpacity: 0 },
    ],
    subjectPillBadge: [
      baseScheduleStyles.subjectPillBadge,
      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
    ],
    eventSubjectText: [
      baseScheduleStyles.eventSubjectText,
      isDark && { color: '#94A3B8' },
    ],
    eventTitleText: [
      baseScheduleStyles.eventTitleText,
      isDark && { color: '#F8FAFC' },
    ],
    eventNotesContainer: [
      baseScheduleStyles.eventNotesContainer,
      isDark && { backgroundColor: '#0F172A' },
    ],
    eventNotesText: [
      baseScheduleStyles.eventNotesText,
      isDark && { color: '#94A3B8' },
    ],
    metaChip: [
      baseScheduleStyles.metaChip,
      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
    ],
    metaChipText: [
      baseScheduleStyles.metaChipText,
      isDark && { color: '#94A3B8' },
    ],
    cardDeleteBtn: [
      baseScheduleStyles.cardDeleteBtn,
      isDark && { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' },
    ],
    daySelectorChip: [
      baseScheduleStyles.daySelectorChip,
      isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
    ],
    daySelectorChipSelected: [
      baseScheduleStyles.daySelectorChipSelected,
      { backgroundColor: activeAccentColor, borderColor: activeAccentColor, shadowColor: activeAccentColor },
    ],
    daySelectorText: [
      baseScheduleStyles.daySelectorText,
      isDark && { color: '#94A3B8' },
    ],
    daySelectorTextSelected: [
      baseScheduleStyles.daySelectorTextSelected,
      { color: '#FFFFFF' },
    ],
    routineDayHeader: [
      baseScheduleStyles.routineDayHeader,
      isDark && { color: '#F8FAFC' },
    ],
    routineCard: [
      baseScheduleStyles.routineCard,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent', shadowOpacity: 0 },
    ],
    routineSubjectTitle: [
      baseScheduleStyles.routineSubjectTitle,
      isDark && { color: '#F8FAFC' },
    ],
    routineTopicText: [
      baseScheduleStyles.routineTopicText,
      isDark && { color: '#94A3B8' },
    ],
    focusModeActiveChip: [
      baseScheduleStyles.focusModeActiveChip,
      isDark && { backgroundColor: 'rgba(98, 54, 255, 0.2)', borderColor: 'rgba(98, 54, 255, 0.4)' },
    ],
    focusModeActiveText: [
      baseScheduleStyles.focusModeActiveText,
      isDark && { color: '#C4B5FD' },
    ],
    modalOverlay: [
      baseScheduleStyles.modalOverlay,
      isDark && { backgroundColor: 'rgba(11, 15, 25, 0.75)' },
    ],
    modalSheetContainer: [
      baseScheduleStyles.modalSheetContainer,
      { paddingBottom: Math.max(insets?.bottom || 0, 16) + 16 },
      isDark && { backgroundColor: '#0F172A', borderTopWidth: 0, borderColor: 'transparent' },
    ],
    modalDragHandle: [
      baseScheduleStyles.modalDragHandle,
      isDark && { backgroundColor: '#475569' },
    ],
    modalSheetTitle: [
      baseScheduleStyles.modalSheetTitle,
      isDark && { color: '#F8FAFC' },
    ],
    modalSheetSub: [
      baseScheduleStyles.modalSheetSub,
      isDark && { color: '#94A3B8' },
    ],
    modalCloseBtn: [
      baseScheduleStyles.modalCloseBtn,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    formSectionCard: [
      baseScheduleStyles.formSectionCard,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    inputLabel: [
      baseScheduleStyles.inputLabel,
      isDark && { color: '#94A3B8' },
    ],
    modalTextInput: [
      baseScheduleStyles.modalTextInput,
      isDark && { backgroundColor: '#0F172A', color: '#F8FAFC', borderWidth: 0, borderColor: 'transparent' },
    ],
    typeChoiceChip: [
      baseScheduleStyles.typeChoiceChip,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    typeChoiceSelected: [
      baseScheduleStyles.typeChoiceSelected,
      { backgroundColor: activeAccentColor, borderColor: activeAccentColor, shadowColor: activeAccentColor },
    ],
    typeChoiceText: [
      baseScheduleStyles.typeChoiceText,
      isDark && { color: '#94A3B8' },
    ],
    typeChoiceTextSelected: [
      baseScheduleStyles.typeChoiceTextSelected,
      { color: '#FFFFFF' },
    ],
    modalDateChip: [
      baseScheduleStyles.modalDateChip,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    modalDateChipSelected: [
      baseScheduleStyles.modalDateChipSelected,
      { backgroundColor: activeAccentColor, borderColor: activeAccentColor, shadowColor: activeAccentColor },
    ],
    modalDateDayName: [
      baseScheduleStyles.modalDateDayName,
      isDark && { color: '#94A3B8' },
    ],
    modalDateDayNum: [
      baseScheduleStyles.modalDateDayNum,
      isDark && { color: '#F8FAFC' },
    ],
    modalDateTextSelected: [
      baseScheduleStyles.modalDateTextSelected,
      { color: '#FFFFFF' },
    ],
    colorPaletteSelected: [
      baseScheduleStyles.colorPaletteSelected,
      isDark && { borderColor: '#F8FAFC' },
    ],
    focusToggleContainer: [
      baseScheduleStyles.focusToggleContainer,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    modalActionBtn: [
      baseScheduleStyles.modalActionBtn,
      { backgroundColor: activeAccentColor, shadowColor: activeAccentColor },
    ],
    confirmModalOverlay: [
      baseScheduleStyles.confirmModalOverlay,
      isDark && { backgroundColor: 'rgba(11, 15, 25, 0.85)' },
    ],
    confirmCardContainer: [
      baseScheduleStyles.confirmCardContainer,
      isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
    ],
    confirmWarningBadge: [
      baseScheduleStyles.confirmWarningBadge,
      isDark && { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' },
    ],
    confirmModalTitle: [
      baseScheduleStyles.confirmModalTitle,
      isDark && { color: '#F8FAFC' },
    ],
    confirmModalSub: [
      baseScheduleStyles.confirmModalSub,
      isDark && { color: '#94A3B8' },
    ],
    confirmPreviewBox: [
      baseScheduleStyles.confirmPreviewBox,
      isDark && { backgroundColor: '#0F172A', borderWidth: 0, borderColor: 'transparent' },
    ],
    confirmPreviewTitle: [
      baseScheduleStyles.confirmPreviewTitle,
      isDark && { color: '#F8FAFC' },
    ],
    confirmPreviewSub: [
      baseScheduleStyles.confirmPreviewSub,
      isDark && { color: '#94A3B8' },
    ],
    confirmPreviewTime: [
      baseScheduleStyles.confirmPreviewTime,
      isDark && { color: activeAccentColor },
    ],
    confirmPreviewLocation: [
      baseScheduleStyles.confirmPreviewLocation,
      isDark && { color: '#94A3B8' },
    ],
    confirmCancelBtn: [
      baseScheduleStyles.confirmCancelBtn,
      isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
    ],
    confirmCancelBtnText: [
      baseScheduleStyles.confirmCancelBtnText,
      isDark && { color: '#94A3B8' },
    ],
  };
}
