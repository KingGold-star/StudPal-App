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
} from 'react-native';
import Modal from '../components/CustomModal';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import { gamificationService } from '../services/gamification/gamificationService';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ size = 22, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
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

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleScreen({ user = { name: 'Alex' }, onBack, onSelectTab }) {
  const insets = useSafeAreaInsets();
  
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
  const [newCalTime, setNewCalTime] = useState('4:00 PM - 5:00 PM');
  const [newCalLocation, setNewCalLocation] = useState('Library');

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
      subject: newCalSubject,
      date: selectedDate,
      time: newCalTime.trim(),
      location: newCalLocation.trim(),
      color: newCalType === 'Exam' ? '#EF4444' : newCalType === 'Deadline' ? '#F97316' : '#2D62FF',
      bg: newCalType === 'Exam' ? '#FEF2F2' : newCalType === 'Deadline' ? '#FFF7ED' : '#EFF6FF',
    };
    setCalendarEvents([newEvt, ...calendarEvents]);
    setAddCalModalOpen(false);
    setNewCalTitle('');
    gamificationService.awardXp('ADD_SCHEDULE_EVENT', 15, `Scheduled: ${newEvt.title}`, `cal_evt_${newEvt.id}`);
    Alert.alert('Event Added! 📅', `"${newEvt.title}" added to your study calendar.`);
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
      time: newTtTime.trim(),
      room: newTtRoom.trim(),
      instructor: 'Self-Scheduled',
      color: '#2D62FF',
      bg: '#EFF6FF',
    };
    setTimetableRoutines([...timetableRoutines, newTt]);
    setAddTtModalOpen(false);
    setNewTtSubject('');
    setNewTtTopic('');
    gamificationService.awardXp('ADD_TIMETABLE_ROUTINE', 15, `Added Routine: ${newTt.subject}`, `tt_evt_${newTt.id}`);
    Alert.alert('Routine Added! ⏰', `${newTt.subject} added to your ${newTt.day} weekly timetable.`);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <View style={styles.topHeaderBar}>
        <View style={styles.headerTitleGroup}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <ChevronLeftIcon size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle} numberOfLines={1}>Schedule Hub</Text>
            <Text style={styles.screenSubtitle} numberOfLines={1}>
              {activeSegment === 'calendar' ? 'Manage calendar events' : 'Manage weekly routine'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addTriggerBtn}
          onPress={() => (activeSegment === 'calendar' ? setAddCalModalOpen(true) : setAddTtModalOpen(true))}
          activeOpacity={0.85}
        >
          <PlusIcon size={16} color="#FFFFFF" />
          <Text style={styles.addTriggerText}>{activeSegment === 'calendar' ? 'Event' : 'Routine'}</Text>
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
            <CalendarIcon size={16} color={activeSegment === 'calendar' ? '#2D62FF' : '#64748B'} />
            <Text style={[styles.segmentText, activeSegment === 'calendar' && styles.segmentTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'timetable' && styles.segmentBtnActive]}
            onPress={() => setActiveSegment('timetable')}
            activeOpacity={0.85}
          >
            <ClockIcon size={16} color={activeSegment === 'timetable' ? '#6236FF' : '#64748B'} />
            <Text style={[styles.segmentText, activeSegment === 'timetable' && styles.segmentTextActive]}>
              Timetable
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Content Scroll Area ────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {activeSegment === 'calendar' ? (
          /* ========================================================================= */
          /* 📅 1. CALENDAR VIEW (Date-Specific Events & Activities)                    */
          /* ========================================================================= */
          <View style={styles.sectionContainer}>
            {/* Banner explaining Calendar distinction */}
            <View style={styles.hubInfoBanner}>
              <View style={styles.infoBannerIconBox}>
                <CalendarIcon size={18} color="#2D62FF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoBannerTitle}>Date-Specific Calendar</Text>
                <Text style={styles.infoBannerSub}>
                  Exams, deadlines, and planned study sessions on specific dates.
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
                  <View key={evt.id} style={styles.eventCard}>
                    <View style={[styles.eventTypeStrip, { backgroundColor: evt.color }]} />

                    <View style={styles.eventCardBody}>
                      <View style={styles.eventHeaderRow}>
                        <View style={[styles.typeTagPill, { backgroundColor: evt.bg }]}>
                          <Text style={[styles.typeTagText, { color: evt.color }]}>{evt.type}</Text>
                        </View>
                        <Text style={styles.eventSubjectText}>{evt.subject}</Text>
                      </View>

                      <Text style={styles.eventTitleText}>{evt.title}</Text>

                      <View style={styles.eventFooterRow}>
                        <View style={styles.metaItem}>
                          <ClockIcon size={13} color="#64748B" />
                          <Text style={styles.metaItemText}>{evt.time}</Text>
                        </View>
                        {evt.location ? (
                          <View style={styles.metaItem}>
                            <TagIcon size={13} color="#64748B" />
                            <Text style={styles.metaItemText}>{evt.location}</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
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
            <View style={[styles.hubInfoBanner, { backgroundColor: '#F5F3FF', borderColor: '#E9E3FF' }]}>
              <View style={[styles.infoBannerIconBox, { backgroundColor: '#ECE6FF' }]}>
                <ClockIcon size={18} color="#6236FF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoBannerTitle, { color: '#0F172A' }]}>Weekly Study Timetable</Text>
                <Text style={styles.infoBannerSub}>
                  Your recurring weekly class schedule and study routine (e.g. Mon 4:00 PM).
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
                  <View key={item.id} style={styles.routineCard}>
                    <View style={[styles.routineIconBox, { backgroundColor: item.bg }]}>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: item.color }}>
                        {item.subject.substring(0, 2).toUpperCase()}
                      </Text>
                    </View>

                    <View style={{ flex: 1, gap: 2 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.routineSubjectTitle}>{item.subject}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#6236FF' }}>{item.time}</Text>
                      </View>

                      <Text style={styles.routineTopicText}>{item.topic}</Text>

                      <View style={styles.routineMetaRow}>
                        <Text style={styles.routineMetaText}>📍 {item.room}</Text>
                        <Text style={styles.routineMetaText}>👤 {item.instructor}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar activeTab="home" onSelectTab={onSelectTab} />

      {/* ── 1. ADD CALENDAR EVENT MODAL ───────────────────────────────── */}
      <Modal visible={isAddCalModalOpen} animationType="slide" transparent onRequestClose={() => setAddCalModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Add Calendar Event</Text>
              <TouchableOpacity onPress={() => setAddCalModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Event Title</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Physics Exam, Bio Report Due"
                placeholderTextColor="#94A3B8"
                value={newCalTitle}
                onChangeText={setNewCalTitle}
              />

              <Text style={styles.inputLabel}>Category Type</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                {['Session', 'Exam', 'Deadline'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeChoiceChip, newCalType === type && styles.typeChoiceSelected]}
                    onPress={() => setNewCalType(type)}
                  >
                    <Text style={[styles.typeChoiceText, newCalType === type && styles.typeChoiceTextSelected]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Mathematics, Chemistry"
                placeholderTextColor="#94A3B8"
                value={newCalSubject}
                onChangeText={setNewCalSubject}
              />

              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="10:00 AM - 11:30 AM"
                placeholderTextColor="#94A3B8"
                value={newCalTime}
                onChangeText={setNewCalTime}
              />
            </View>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleAddCalendarEvent}>
              <Text style={styles.modalActionBtnText}>Schedule Event</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── 2. ADD RECURRING TIMETABLE MODAL ──────────────────────────── */}
      <Modal visible={isAddTtModalOpen} animationType="slide" transparent onRequestClose={() => setAddTtModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Add Weekly Class Routine</Text>
              <TouchableOpacity onPress={() => setAddTtModalOpen(false)}>
                <CloseIcon size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Subject Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Calculus II, Physics Lab"
                placeholderTextColor="#94A3B8"
                value={newTtSubject}
                onChangeText={setNewTtSubject}
              />

              <Text style={styles.inputLabel}>Day of Week</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 12 }}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.typeChoiceChip, newTtDay === day && styles.typeChoiceSelected]}
                    onPress={() => setNewTtDay(day)}
                  >
                    <Text style={[styles.typeChoiceText, newTtDay === day && styles.typeChoiceTextSelected]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Time Slot</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. 4:00 PM - 5:30 PM"
                placeholderTextColor="#94A3B8"
                value={newTtTime}
                onChangeText={setNewTtTime}
              />

              <Text style={styles.inputLabel}>Room / Location</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Room 302 or Online Zoom"
                placeholderTextColor="#94A3B8"
                value={newTtRoom}
                onChangeText={setNewTtRoom}
              />
            </View>

            <TouchableOpacity style={styles.modalActionBtn} onPress={handleAddTimetableRoutine}>
              <Text style={styles.modalActionBtnText}>Save Weekly Routine</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    color: '#64748B',
    fontWeight: '500',
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
    fontWeight: '600',
    color: '#64748B',
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
    color: '#475569',
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
    borderWidth: 0,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  eventSubjectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  eventTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  eventFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
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
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 0,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  routineIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineSubjectTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  routineTopicText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  routineMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  routineMetaText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  formGroup: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  typeChoiceChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChoiceSelected: {
    backgroundColor: '#2D62FF',
    borderColor: '#2D62FF',
  },
  typeChoiceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  typeChoiceTextSelected: {
    color: '#FFFFFF',
  },
  modalActionBtn: {
    backgroundColor: '#2D62FF',
    borderRadius: 14,
    height: 52,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
