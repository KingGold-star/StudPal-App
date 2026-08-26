// src/services/gamification/gamificationService.js

import { XP_VALUES, ANTI_ABUSE_RULES } from "./xpConfig";
import { calculateUserLevel, getNextLevelBreakdown } from "./levels";
import { MASTER_ACHIEVEMENTS, evaluateAchievements } from "./achievements";

const STORAGE_KEY = "@studpal_gamification_v1";

class GamificationService {
  constructor() {
    this.listeners = new Set();
    this.state = this.getInitialState();
    this.loadPersistedState();
  }

  getInitialState() {
    const baseProgress = {
      totalXp: 860, // Baseline user XP matching current StudPal user state
      completedSessions: 8,
      completedReviews: 12,
      masteredTopics: 4,
      completedQuizzes: 3,
      currentStreak: 4,
      longestStreak: 7,
      highestCelebratedLevel: 4,
    };

    const levelObj = calculateUserLevel(baseProgress);
    const { achievements } = evaluateAchievements(baseProgress, {});

    return {
      ...baseProgress,
      currentLevel: levelObj.current,
      nextLevel: levelObj.next,
      processedEvents: {}, // idempotency keys map
      xpHistory: [
        {
          id: "hist_1",
          activityType: "STUDY_SESSION",
          xpAmount: 25,
          title: "Completed 25m Focus Session",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "hist_2",
          activityType: "TOPIC_MASTERY",
          xpAmount: 50,
          title: "Mastered: Calculus Derivatives",
          timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
        {
          id: "hist_3",
          activityType: "ACHIEVEMENT_UNLOCK",
          xpAmount: 75,
          title: "Unlocked: 7-Day Streak",
          timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
        },
      ],
      achievements,
      pendingLevelUp: null, // Holds level object when level up celebration should trigger
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Call listener immediately with current state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error("Error in gamification subscriber:", err);
      }
    });
  }

  getState() {
    const levelObj = calculateUserLevel(this.state);
    const breakdown = getNextLevelBreakdown(this.state);
    const { achievements } = evaluateAchievements(this.state, this.state.achievements);

    return {
      ...this.state,
      currentLevel: levelObj.current,
      nextLevel: levelObj.next,
      breakdown,
      achievements,
    };
  }

  async loadPersistedState() {
    try {
      let data = null;
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) data = JSON.parse(raw);
      }
      if (data) {
        this.state = {
          ...this.state,
          ...data,
        };
        this.notify();
      }
    } catch (e) {
      console.warn("Unable to load persisted gamification data:", e);
    }
  }

  async saveState() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn("Unable to persist gamification data:", e);
    }
  }

  /**
   * Core Idempotent XP Awarding Engine
   */
  awardXp(activityType, xpAmount, title, idempotencyKey, extraData = {}) {
    if (!idempotencyKey) {
      idempotencyKey = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    // ── Idempotency Check: Prevent duplicate XP awards for the same action ──
    if (this.state.processedEvents[idempotencyKey]) {
      console.log(`[GamificationService] Idempotency block: ${idempotencyKey} already processed.`);
      return this.getState();
    }

    const previousProgress = { ...this.state };
    const newTotalXp = (this.state.totalXp || 0) + xpAmount;
    const newProcessedEvents = { ...this.state.processedEvents, [idempotencyKey]: true };

    const newXpEvent = {
      id: `xp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      idempotencyKey,
      activityType,
      xpAmount,
      title,
      timestamp: new Date().toISOString(),
      ...extraData,
    };

    const newHistory = [newXpEvent, ...(this.state.xpHistory || [])].slice(0, 100);

    // Apply stats updates if provided
    let updatedProgress = {
      ...this.state,
      totalXp: newTotalXp,
      processedEvents: newProcessedEvents,
      xpHistory: newHistory,
    };

    if (extraData.completedSessionsDelta) {
      updatedProgress.completedSessions = (updatedProgress.completedSessions || 0) + extraData.completedSessionsDelta;
    }
    if (extraData.completedReviewsDelta) {
      updatedProgress.completedReviews = (updatedProgress.completedReviews || 0) + extraData.completedReviewsDelta;
    }
    if (extraData.masteredTopicsDelta) {
      updatedProgress.masteredTopics = (updatedProgress.masteredTopics || 0) + extraData.masteredTopicsDelta;
    }
    if (extraData.completedQuizzesDelta) {
      updatedProgress.completedQuizzes = (updatedProgress.completedQuizzes || 0) + extraData.completedQuizzesDelta;
    }
    if (extraData.currentStreak) {
      updatedProgress.currentStreak = extraData.currentStreak;
      updatedProgress.longestStreak = Math.max(updatedProgress.longestStreak || 0, extraData.currentStreak);
    }

    // Evaluate Achievements
    const { achievements: evalAch, newlyUnlocked } = evaluateAchievements(updatedProgress, updatedProgress.achievements);
    updatedProgress.achievements = evalAch;

    // Check newly unlocked achievements and award their XP automatically
    newlyUnlocked.forEach((ach) => {
      const achKey = `ach_reward_${ach.id}`;
      if (!newProcessedEvents[achKey]) {
        newProcessedEvents[achKey] = true;
        updatedProgress.totalXp += ach.xpReward;
        updatedProgress.xpHistory.unshift({
          id: `xp_ach_${ach.id}_${Date.now()}`,
          idempotencyKey: achKey,
          activityType: "ACHIEVEMENT_UNLOCK",
          xpAmount: ach.xpReward,
          title: `Unlocked: ${ach.name}`,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Re-evaluate Level & Check for Level Up
    const levelObj = calculateUserLevel(updatedProgress);
    const newLevel = levelObj.current;
    const previousLevelObj = calculateUserLevel(previousProgress);
    const prevLevelNumber = previousLevelObj.current.level;

    let pendingLevelUp = this.state.pendingLevelUp;
    if (newLevel.level > prevLevelNumber && newLevel.level > (this.state.highestCelebratedLevel || 0)) {
      pendingLevelUp = newLevel;
      updatedProgress.highestCelebratedLevel = newLevel.level;
    }

    this.state = {
      ...updatedProgress,
      currentLevel: newLevel,
      nextLevel: levelObj.next,
      pendingLevelUp,
    };

    this.saveState();
    this.notify();
    return this.getState();
  }

  clearPendingLevelUp() {
    this.state = {
      ...this.state,
      pendingLevelUp: null,
    };
    this.saveState();
    this.notify();
  }

  // ─── SPECIFIC ACTIVITY ENTRY POINTS ────────────────────────────────────────

  recordStudySession(durationMins = 25, sessionKey = null) {
    if (!sessionKey) {
      sessionKey = `session_${Date.now()}`;
    }
    return this.awardXp(
      "STUDY_SESSION",
      XP_VALUES.MEANINGFUL_STUDY_SESSION,
      `Completed ${durationMins}m Focus Session`,
      sessionKey,
      { completedSessionsDelta: 1, durationMins }
    );
  }

  recordFlashcardReview(cardsReviewed = 10, reviewKey = null) {
    if (!reviewKey) {
      reviewKey = `review_${Date.now()}`;
    }
    return this.awardXp(
      "TOPIC_REVIEW",
      XP_VALUES.REVIEW_DUE_TOPIC,
      `Reviewed ${cardsReviewed} Flashcards`,
      reviewKey,
      { completedReviewsDelta: 1, cardsReviewed }
    );
  }

  recordQuizCompletion(score = 85, totalQuestions = 5, quizKey = null) {
    if (!quizKey) {
      quizKey = `quiz_${Date.now()}`;
    }

    const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);
    let totalXp = XP_VALUES.COMPLETE_QUIZ;

    if (percentage >= 95) {
      totalXp += XP_VALUES.HIGH_QUIZ_SCORE_BONUS_TIER_3;
    } else if (percentage >= 85) {
      totalXp += XP_VALUES.HIGH_QUIZ_SCORE_BONUS_TIER_2;
    } else if (percentage >= 70) {
      totalXp += XP_VALUES.HIGH_QUIZ_SCORE_BONUS_TIER_1;
    }

    return this.awardXp(
      "QUIZ_COMPLETED",
      totalXp,
      `Completed Practice Quiz (${percentage}%)`,
      quizKey,
      { completedQuizzesDelta: 1, score, percentage }
    );
  }

  recordTopicMastery(topicId, topicName = "Topic", topicKey = null) {
    if (!topicKey) {
      topicKey = `topic_mastery_${topicId}_${Date.now()}`;
    }
    return this.awardXp(
      "TOPIC_MASTERY",
      XP_VALUES.MASTER_TOPIC,
      `Mastered: ${topicName}`,
      topicKey,
      { masteredTopicsDelta: 1, topicId }
    );
  }

  recordProfileCompletion() {
    const key = `profile_complete_init`;
    return this.awardXp(
      "PROFILE_COMPLETE",
      XP_VALUES.COMPLETE_PROFILE,
      "Completed Profile Setup",
      key
    );
  }

  recordDailyStreak(streakDays = 1) {
    const todayStr = new Date().toISOString().split("T")[0];
    const key = `streak_daily_${todayStr}`;
    return this.awardXp(
      "DAILY_STREAK",
      XP_VALUES.DAILY_STREAK_BONUS,
      `${streakDays}-Day Study Streak Bonus`,
      key,
      { currentStreak: streakDays }
    );
  }
}

export const gamificationService = new GamificationService();
