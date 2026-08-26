// src/services/gamification/levels.js

export const LEVELS_CONFIG = [
  {
    level: 1,
    title: "Beginner",
    requiredXp: 0,
    requirements: {
      sessions: 0,
      reviews: 0,
      masteredTopics: 0,
      quizzes: 0,
      streak: 0,
    },
  },
  {
    level: 2,
    title: "Learner",
    requiredXp: 100,
    requirements: {
      sessions: 3,
      reviews: 0,
      masteredTopics: 0,
      quizzes: 0,
      streak: 0,
    },
  },
  {
    level: 3,
    title: "Focused Learner",
    requiredXp: 300,
    requirements: {
      sessions: 10,
      reviews: 5,
      masteredTopics: 0,
      quizzes: 0,
      streak: 0,
    },
  },
  {
    level: 4,
    title: "Consistent Student",
    requiredXp: 600,
    requirements: {
      sessions: 20,
      reviews: 10,
      masteredTopics: 0,
      quizzes: 0,
      streak: 3,
    },
  },
  {
    level: 5,
    title: "Rising Scholar",
    requiredXp: 1000,
    requirements: {
      sessions: 35,
      reviews: 15,
      masteredTopics: 5,
      quizzes: 2,
      streak: 7,
    },
  },
  {
    level: 6,
    title: "Dedicated Scholar",
    requiredXp: 1500,
    requirements: {
      sessions: 50,
      reviews: 20,
      masteredTopics: 10,
      quizzes: 5,
      streak: 7,
    },
  },
  {
    level: 7,
    title: "Knowledge Builder",
    requiredXp: 2200,
    requirements: {
      sessions: 75,
      reviews: 30,
      masteredTopics: 20,
      quizzes: 8,
      streak: 7,
    },
  },
  {
    level: 8,
    title: "Academic Achiever",
    requiredXp: 3000,
    requirements: {
      sessions: 100,
      reviews: 40,
      masteredTopics: 30,
      quizzes: 10,
      streak: 10,
    },
  },
  {
    level: 9,
    title: "Study Expert",
    requiredXp: 4000,
    requirements: {
      sessions: 150,
      reviews: 60,
      masteredTopics: 50,
      quizzes: 12,
      streak: 14,
    },
  },
  {
    level: 10,
    title: "StudPal Master",
    requiredXp: 5500,
    requirements: {
      sessions: 200,
      reviews: 80,
      masteredTopics: 75,
      quizzes: 15,
      streak: 14,
    },
  },
  {
    level: 11,
    title: "Academic Pro",
    requiredXp: 7000,
    requirements: {
      sessions: 250,
      reviews: 100,
      masteredTopics: 90,
      quizzes: 20,
      streak: 21,
    },
  },
  {
    level: 12,
    title: "Knowledge Master",
    requiredXp: 9000,
    requirements: {
      sessions: 320,
      reviews: 130,
      masteredTopics: 110,
      quizzes: 25,
      streak: 21,
    },
  },
  {
    level: 13,
    title: "Elite Scholar",
    requiredXp: 12000,
    requirements: {
      sessions: 400,
      reviews: 170,
      masteredTopics: 135,
      quizzes: 30,
      streak: 30,
    },
  },
  {
    level: 14,
    title: "Study Champion",
    requiredXp: 16000,
    requirements: {
      sessions: 500,
      reviews: 220,
      masteredTopics: 165,
      quizzes: 40,
      streak: 30,
    },
  },
  {
    level: 15,
    title: "StudPal Legend",
    requiredXp: 20000,
    requirements: {
      sessions: 650,
      reviews: 300,
      masteredTopics: 200,
      quizzes: 50,
      streak: 30,
    },
  },
];

/**
 * Checks whether user meets all quota requirements for a given level config
 */
export function meetsLevelRequirements(progress, levelConfig) {
  if (!levelConfig) return false;
  if ((progress.totalXp || 0) < levelConfig.requiredXp) return false;

  const req = levelConfig.requirements || {};
  if ((progress.completedSessions || 0) < (req.sessions || 0)) return false;
  if ((progress.completedReviews || 0) < (req.reviews || 0)) return false;
  if ((progress.masteredTopics || 0) < (req.masteredTopics || 0)) return false;
  if ((progress.completedQuizzes || 0) < (req.quizzes || 0)) return false;
  if ((progress.currentStreak || 0) < (req.streak || 0)) return false;

  return true;
}

/**
 * Calculate user's current level object based on XP and all completed quotas
 */
export function calculateUserLevel(progress = {}) {
  let highestLevel = LEVELS_CONFIG[0];
  for (let i = 0; i < LEVELS_CONFIG.length; i++) {
    const lvl = LEVELS_CONFIG[i];
    if (meetsLevelRequirements(progress, lvl)) {
      highestLevel = lvl;
    } else {
      break;
    }
  }

  // Determine next level
  const currentIndex = LEVELS_CONFIG.findIndex((l) => l.level === highestLevel.level);
  const nextLevel = LEVELS_CONFIG[currentIndex + 1] || null;

  return {
    current: highestLevel,
    next: nextLevel,
  };
}

/**
 * Returns breakdown of satisfied vs remaining quotas for the next level
 */
export function getNextLevelBreakdown(progress = {}) {
  const { current, next } = calculateUserLevel(progress);
  if (!next) {
    return {
      isMaxLevel: true,
      currentLevel: current,
      percent: 100,
      xpRemaining: 0,
      checklist: [],
    };
  }

  const currentXp = progress.totalXp || 0;
  const xpBasis = current.requiredXp;
  const xpNeeded = next.requiredXp - xpBasis;
  const xpEarnedInTier = Math.max(0, currentXp - xpBasis);
  const percent = Math.min(100, Math.round((xpEarnedInTier / Math.max(1, xpNeeded)) * 100));

  const req = next.requirements || {};
  const checklist = [
    {
      id: "xp",
      label: `${next.requiredXp} Total XP`,
      current: currentXp,
      target: next.requiredXp,
      met: currentXp >= next.requiredXp,
      type: "xp",
    },
  ];

  if (req.sessions > 0) {
    const currentSessions = progress.completedSessions || 0;
    checklist.push({
      id: "sessions",
      label: `${req.sessions} Study Sessions`,
      current: currentSessions,
      target: req.sessions,
      met: currentSessions >= req.sessions,
      type: "count",
    });
  }

  if (req.reviews > 0) {
    const currentReviews = progress.completedReviews || 0;
    checklist.push({
      id: "reviews",
      label: `${req.reviews} Topic Reviews`,
      current: currentReviews,
      target: req.reviews,
      met: currentReviews >= req.reviews,
      type: "count",
    });
  }

  if (req.masteredTopics > 0) {
    const currentMastered = progress.masteredTopics || 0;
    checklist.push({
      id: "mastered",
      label: `${req.masteredTopics} Topics Mastered`,
      current: currentMastered,
      target: req.masteredTopics,
      met: currentMastered >= req.masteredTopics,
      type: "count",
    });
  }

  if (req.quizzes > 0) {
    const currentQuizzes = progress.completedQuizzes || 0;
    checklist.push({
      id: "quizzes",
      label: `${req.quizzes} Quizzes Completed`,
      current: currentQuizzes,
      target: req.quizzes,
      met: currentQuizzes >= req.quizzes,
      type: "count",
    });
  }

  if (req.streak > 0) {
    const currentStreak = progress.currentStreak || 0;
    checklist.push({
      id: "streak",
      label: `${req.streak}-Day Study Streak`,
      current: currentStreak,
      target: req.streak,
      met: currentStreak >= req.streak,
      type: "streak",
    });
  }

  return {
    isMaxLevel: false,
    currentLevel: current,
    nextLevel: next,
    percent,
    xpRemaining: Math.max(0, next.requiredXp - currentXp),
    checklist,
  };
}
