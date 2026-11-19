// src/services/timetable/index.js
// Main unified entry point for StudPal's Intelligent Timetable Generation Engine

import {
  generateTimetable,
  rescheduleMissedSession,
  buildAvailabilitySlots,
  calculateSubjectPriorities,
  validateTimetable,
  formatDateKey,
  DAY_NAMES,
} from './timetableEngine';
import { timetableStorage } from './timetableStorage';
import { timetableSupabase } from './timetableSupabase';
import { authService } from '../supabase/authService';

class TimetableService {
  constructor() {
    this.listeners = new Set();
    this.cachedSessions = [];
    this.isInitialized = false;
  }

  // Subscribe to timetable state updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.cachedSessions);
      } catch (e) {
        console.warn('[TimetableService.notify] Error in listener:', e);
      }
    });
  }

  /**
   * Initializes or fetches timetable.
   * If none exists, generates a fresh intelligent timetable from onboarding responses.
   */
  async getOrGenerateTimetable(user = {}, onboardingData = {}, options = {}) {
    const userId = user?.id || (await authService.getCurrentUser())?.id || 'local_student';

    // 1. Try local storage first
    let sessions = await timetableStorage.getSessions();

    // 2. If storage is empty, try Supabase cloud
    if ((!sessions || sessions.length === 0) && userId !== 'local_student') {
      sessions = await timetableSupabase.fetchSessions(userId);
      if (sessions && sessions.length > 0) {
        await timetableStorage.saveSessions(sessions);
      }
    }

    // 3. Check if cached sessions cover the current week's weekdays (Mon - Fri)
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diffToMonday));
    const mondayKey = formatDateKey(monday);

    const hasCurrentWeekMonday = (sessions || []).some((s) => s.date === mondayKey);

    // If empty or missing current week weekdays, regenerate fresh starting from Monday
    if (!sessions || sessions.length === 0 || !hasCurrentWeekMonday) {
      const result = await this.regenerateTimetable(user, onboardingData, options);
      return result;
    }

    this.cachedSessions = sessions;
    this.isInitialized = true;
    const sessionsArray = Array.isArray(sessions) ? [...sessions] : [];
    sessionsArray.fromCache = true;
    sessionsArray.sessions = sessionsArray;
    return sessionsArray;
  }

  /**
   * Regenerates timetable from current onboarding responses while PRESERVING completed sessions!
   */
  async regenerateTimetable(user = {}, onboardingData = {}, options = {}) {
    const userId = user?.id || (await authService.getCurrentUser())?.id || 'local_student';
    const currentSessions = await timetableStorage.getSessions();

    // Preserve completed sessions
    const preservedCompleted = (currentSessions || []).filter((s) => s.status === 'completed');

    const startCandidate = options.startDate ? new Date(options.startDate) : new Date();
    const startDay = startCandidate.getDay();
    const diffToMonday = startCandidate.getDate() - startDay + (startDay === 0 ? -6 : 1);
    const startMonday = new Date(startCandidate.setDate(diffToMonday));
    startMonday.setHours(0, 0, 0, 0);

    const result = generateTimetable({
      userId,
      onboardingData,
      existingSessions: preservedCompleted,
      commitments: options.commitments || [],
      startDate: startMonday,
      horizonWeeks: options.horizonWeeks || 4,
    });

    this.cachedSessions = result.sessions;
    this.isInitialized = true;

    // Save to local storage
    await timetableStorage.saveSessions(result.sessions);

    // Save user preferences
    await timetableStorage.savePreferences({
      userId,
      subjects: onboardingData.subjects,
      studyDays: onboardingData.studyDays,
      studyTime: onboardingData.studyTime,
      usePomodoro: onboardingData.usePomodoro,
      targetData: onboardingData.targetData,
    });

    // Cloud sync (non-blocking)
    if (userId !== 'local_student') {
      timetableSupabase.syncSessions(userId, result.sessions).catch((err) => {
        console.warn('[TimetableService] Cloud sync deferred:', err.message);
      });
    }

    this.notify();

    const sessionsArray = Array.isArray(result.sessions) ? [...result.sessions] : [];
    sessionsArray.analytics = result.analytics;
    sessionsArray.metadata = result.metadata;
    sessionsArray.sessions = sessionsArray;
    return sessionsArray;
  }

  /**
   * Mark a session completed, missed, or upcoming
   */
  async updateSessionStatus(sessionId, status, user = {}) {
    const userId = user?.id || (await authService.getCurrentUser())?.id;
    const updated = await timetableStorage.updateSessionStatus(sessionId, status);

    this.cachedSessions = await timetableStorage.getSessions();
    this.notify();

    if (userId) {
      timetableSupabase.updateStatus(userId, sessionId, status).catch(() => {});
    }

    return updated;
  }

  /**
   * Reschedule a missed session into the next feasible future slot
   */
  async rescheduleSession(sessionId, user = {}, onboardingData = {}) {
    const currentSessions = await timetableStorage.getSessions();
    const capacity = buildAvailabilitySlots({
      studyDays: onboardingData.studyDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      studyTime: onboardingData.studyTime || 'night',
      targetDays: 30,
      startDate: new Date(),
      usePomodoro: onboardingData.usePomodoro !== false,
    });

    const result = rescheduleMissedSession(currentSessions, sessionId, capacity.slots);

    if (result.success) {
      this.cachedSessions = result.sessions;
      await timetableStorage.saveSessions(result.sessions);
      this.notify();

      const userId = user?.id || (await authService.getCurrentUser())?.id;
      if (userId) {
        timetableSupabase.syncSessions(userId, result.sessions).catch(() => {});
      }
    }

    return result;
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId, user = {}) {
    const userId = user?.id || (await authService.getCurrentUser())?.id;
    const updated = await timetableStorage.deleteSession(sessionId);

    this.cachedSessions = updated;
    this.notify();

    if (userId) {
      timetableSupabase.deleteSession(userId, sessionId).catch(() => {});
    }

    return updated;
  }

  /**
   * Add session(s)
   */
  async addSession(sessionOrSessions, user = {}) {
    const userId = user?.id || (await authService.getCurrentUser())?.id;
    const items = Array.isArray(sessionOrSessions) ? sessionOrSessions : [sessionOrSessions];
    const updated = await timetableStorage.addSessions(items);

    this.cachedSessions = updated;
    this.notify();

    if (userId && userId !== 'local_student') {
      timetableSupabase.syncSessions(userId, updated).catch(() => {});
    }

    return updated;
  }

  /**
   * Get the primary scheduled study session for today
   */
  async getTodaySession() {
    const sessions = await timetableStorage.getSessions();
    const todayKey = formatDateKey(new Date());
    const todaySessions = sessions.filter((s) => s.date === todayKey);

    // Return the earliest upcoming or active session
    const upcoming = todaySessions.find((s) => s.status === 'upcoming');
    return upcoming || todaySessions[0] || null;
  }

  /**
   * Get weekly schedule starting from a reference Monday date
   */
  getWeeklyView(sessionsInput = [], referenceDate = new Date()) {
    const sessions = Array.isArray(sessionsInput)
      ? sessionsInput
      : (sessionsInput && Array.isArray(sessionsInput.sessions))
        ? sessionsInput.sessions
        : [];
    // Find Monday of the reference week
    const current = new Date(referenceDate);
    const day = current.getDay();
    const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diffToMonday));

    const DEFAULT_WEEKDAY_CURRICULUM = {
      Mon: [
        { subject: 'Mathematics', topic: 'Algebra Practice', startTime: '10:00 PM', endTime: '10:25 PM' },
        { subject: 'Economics', topic: 'Market Structure', startTime: '10:35 PM', endTime: '11:00 PM' },
        { subject: 'Computer Science', topic: 'Data Structures', startTime: '11:15 PM', endTime: '11:40 PM' },
      ],
      Tue: [
        { subject: 'Mathematics', topic: 'Derivatives', startTime: '10:00 PM', endTime: '10:25 PM' },
        { subject: 'Economics', topic: 'Supply & Demand', startTime: '10:35 PM', endTime: '11:00 PM' },
        { subject: 'Computer Science', topic: 'Algorithms', startTime: '11:15 PM', endTime: '11:40 PM' },
      ],
      Wed: [
        { subject: 'Mathematics', topic: 'Integration', startTime: '10:00 PM', endTime: '10:25 PM' },
        { subject: 'Economics', topic: 'Fiscal & Monetary Policy', startTime: '10:35 PM', endTime: '11:00 PM' },
        { subject: 'Computer Science', topic: 'Recursion', startTime: '11:15 PM', endTime: '11:40 PM' },
      ],
      Thu: [
        { subject: 'Mathematics', topic: 'Differential Equations', startTime: '10:00 PM', endTime: '10:25 PM' },
        { subject: 'Economics', topic: 'Macroeconomics', startTime: '10:35 PM', endTime: '11:00 PM' },
        { subject: 'Computer Science', topic: 'Database Systems', startTime: '11:15 PM', endTime: '11:40 PM' },
      ],
      Fri: [
        { subject: 'Mathematics', topic: 'Trigonometry', startTime: '10:00 PM', endTime: '10:25 PM' },
        { subject: 'Economics', topic: 'Market Structure', startTime: '10:35 PM', endTime: '11:00 PM' },
        { subject: 'Computer Science', topic: 'Data Structures', startTime: '11:15 PM', endTime: '11:40 PM' },
      ],
    };

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = formatDateKey(d);
      const dayName = DAY_NAMES[d.getDay()];

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${dayName} ${monthNames[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;

      const daySessions = sessions.filter((s) => s.date === dateKey);
      let effectiveDaySessions = daySessions;
      const isWeekend = dayName === 'Sat' || dayName === 'Sun';

      // Rule: Any weekday shouldn't be free (Mon, Tue, Wed, Thu, Fri must always have study sessions)
      if (!isWeekend && (!effectiveDaySessions || effectiveDaySessions.length === 0)) {
        const templates = DEFAULT_WEEKDAY_CURRICULUM[dayName] || [];
        effectiveDaySessions = templates.map((tmpl, idx) => ({
          id: `tt_${dateKey}_${idx}`,
          userId: 'local_student',
          date: dateKey,
          dayName,
          formattedDate,
          subject: tmpl.subject,
          topic: tmpl.topic,
          startTime: tmpl.startTime,
          endTime: tmpl.endTime,
          time: `${tmpl.startTime} – ${tmpl.endTime}`,
          sessionType: 'Pomodoro',
          status: 'Upcoming',
        }));
      }

      const isRestDay = isWeekend && (!effectiveDaySessions || effectiveDaySessions.length === 0);

      weekDays.push({
        date: dateKey,
        dayName,
        formattedDate,
        dateObj: d,
        isRestDay,
        sessions: effectiveDaySessions,
      });
    }

    return weekDays;
  }
}

export const timetableService = new TimetableService();
export default timetableService;
export * from './timetableEngine';
export * from './timetableStorage';
export * from './timetableSupabase';
