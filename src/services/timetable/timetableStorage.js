// src/services/timetable/timetableStorage.js
// Local persistence for StudPal timetable sessions and preferences.
// Uses AsyncStorage with in-memory caching so the app works seamlessly offline and for guest users.

import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMETABLE_STORAGE_KEY = '@studpal_timetable_sessions_v2';
const TIMETABLE_PREFS_KEY = '@studpal_timetable_prefs_v2';

// In-memory cache
let memorySessions = null;
let memoryPreferences = null;

export const timetableStorage = {
  /**
   * Get all cached or stored timetable sessions
   */
  async getSessions() {
    if (memorySessions && Array.isArray(memorySessions)) {
      return memorySessions;
    }
    try {
      const raw = await AsyncStorage.getItem(TIMETABLE_STORAGE_KEY);
      if (raw) {
        memorySessions = JSON.parse(raw);
        return memorySessions;
      }
    } catch (err) {
      console.warn('[timetableStorage.getSessions] Storage read error:', err.message);
    }
    return memorySessions || [];
  },

  /**
   * Save timetable sessions to local storage
   */
  async saveSessions(sessions = []) {
    memorySessions = Array.isArray(sessions) ? [...sessions] : [];
    try {
      await AsyncStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(memorySessions));
    } catch (err) {
      console.warn('[timetableStorage.saveSessions] Storage write error:', err.message);
    }
    return memorySessions;
  },

  /**
   * Update status of a specific session (e.g. 'completed', 'missed', 'rescheduled')
   */
  async updateSessionStatus(sessionId, status, extraData = {}) {
    const list = await this.getSessions();
    const index = list.findIndex((s) => s.id === sessionId);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      status,
      ...extraData,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    await this.saveSessions(list);
    return updated;
  },

  /**
   * Delete a single session by id
   */
  async deleteSession(sessionId) {
    const list = await this.getSessions();
    const filtered = list.filter((s) => s.id !== sessionId);
    await this.saveSessions(filtered);
    return filtered;
  },

  /**
   * Add a single session
   */
  async addSession(session) {
    return this.addSessions([session]);
  },

  /**
   * Add multiple sessions
   */
  async addSessions(newSessions = []) {
    const list = await this.getSessions();
    const updated = [...list, ...newSessions];
    await this.saveSessions(updated);
    return updated;
  },

  /**
   * Clear all stored sessions (e.g. on full reset)
   */
  async clearSessions() {
    memorySessions = [];
    try {
      await AsyncStorage.removeItem(TIMETABLE_STORAGE_KEY);
    } catch (err) {
      console.warn('[timetableStorage.clearSessions] Error:', err.message);
    }
  },

  /**
   * Save user timetable preferences
   */
  async savePreferences(prefs) {
    memoryPreferences = { ...prefs, updatedAt: new Date().toISOString() };
    try {
      await AsyncStorage.setItem(TIMETABLE_PREFS_KEY, JSON.stringify(memoryPreferences));
    } catch (err) {
      console.warn('[timetableStorage.savePreferences] Error:', err.message);
    }
    return memoryPreferences;
  },

  /**
   * Get user timetable preferences
   */
  async getPreferences() {
    if (memoryPreferences) return memoryPreferences;
    try {
      const raw = await AsyncStorage.getItem(TIMETABLE_PREFS_KEY);
      if (raw) {
        memoryPreferences = JSON.parse(raw);
        return memoryPreferences;
      }
    } catch (err) {
      console.warn('[timetableStorage.getPreferences] Error:', err.message);
    }
    return null;
  },
};

export default timetableStorage;
