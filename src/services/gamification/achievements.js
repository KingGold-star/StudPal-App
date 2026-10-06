// src/services/gamification/achievements.js

export const ACHIEVEMENT_CATEGORIES = ["All", "Study", "Consistency", "Mastery", "Leadership"];

export const MASTER_ACHIEVEMENTS = [
  // ── STUDY CATEGORY ────────────────────────────────────────────────────────
  {
    id: "first_step",
    name: "First Step",
    description: "Complete your first study session.",
    category: "Study",
    icon: "🏆",
    bgTint: "#FFF7ED",
    xpReward: 25,
    requiredProgress: 1,
    progressMetric: "completedSessions",
    isFeatureLocked: false,
  },
  {
    id: "focused_learner",
    name: "Focused Learner",
    description: "Complete 10 study sessions.",
    category: "Study",
    icon: "🎯",
    bgTint: "#F0FDF4",
    xpReward: 50,
    requiredProgress: 10,
    progressMetric: "completedSessions",
    isFeatureLocked: false,
  },
  {
    id: "focus_master",
    name: "Focus Master",
    description: "Complete 50 focus sessions.",
    category: "Study",
    icon: "⚡",
    bgTint: "#EEF2FF",
    xpReward: 100,
    requiredProgress: 50,
    progressMetric: "completedSessions",
    isFeatureLocked: false,
  },
  {
    id: "study_machine",
    name: "Study Machine",
    description: "Complete 200 study sessions.",
    category: "Study",
    icon: "🚀",
    bgTint: "#F5F3FF",
    xpReward: 200,
    requiredProgress: 200,
    progressMetric: "completedSessions",
    isFeatureLocked: false,
  },

  // ── CONSISTENCY & GOALS CATEGORY ──────────────────────────────────────────
  {
    id: "goal_starter",
    name: "Goal Starter",
    description: "Complete your first study goal.",
    category: "Consistency",
    icon: "🎯",
    bgTint: "#EFF6FF",
    xpReward: 25,
    requiredProgress: 1,
    progressMetric: "completedGoals",
    isFeatureLocked: false,
  },
  {
    id: "goal_builder",
    name: "Goal Builder",
    description: "Complete 10 study goals.",
    category: "Consistency",
    icon: "📊",
    bgTint: "#F0FDF4",
    xpReward: 50,
    requiredProgress: 10,
    progressMetric: "completedGoals",
    isFeatureLocked: false,
  },
  {
    id: "goal_master",
    name: "Goal Master",
    description: "Complete 50 study goals.",
    category: "Consistency",
    icon: "🏆",
    bgTint: "#EEF2FF",
    xpReward: 100,
    requiredProgress: 50,
    progressMetric: "completedGoals",
    isFeatureLocked: false,
  },
  {
    id: "century",
    name: "Century",
    description: "Complete 100 study goals.",
    category: "Consistency",
    icon: "💯",
    bgTint: "#FEF3C7",
    xpReward: 200,
    requiredProgress: 100,
    progressMetric: "completedGoals",
    isFeatureLocked: false,
  },
  {
    id: "perfect_day",
    name: "Perfect Day",
    description: "Complete 100% of your planned goals for a day.",
    category: "Consistency",
    icon: "🌟",
    bgTint: "#ECFDF5",
    xpReward: 40,
    requiredProgress: 1,
    progressMetric: "perfectDays",
    isFeatureLocked: false,
  },
  {
    id: "consistent_learner",
    name: "Consistent Learner",
    description: "Maintain 80%+ goal completion over an active study period.",
    category: "Consistency",
    icon: "👑",
    bgTint: "#F0EEFF",
    xpReward: 150,
    requiredProgress: 80,
    progressMetric: "consistencyScore",
    isFeatureLocked: false,
  },

  // ── MASTERY CATEGORY ──────────────────────────────────────────────────────
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Master 10 topics.",
    category: "Mastery",
    icon: "📚",
    bgTint: "#EFF6FF",
    xpReward: 50,
    requiredProgress: 10,
    progressMetric: "masteredTopics",
    isFeatureLocked: false,
  },
  {
    id: "topic_expert",
    name: "Topic Expert",
    description: "Master 30 topics.",
    category: "Mastery",
    icon: "🧠",
    bgTint: "#ECFDF5",
    xpReward: 100,
    requiredProgress: 30,
    progressMetric: "masteredTopics",
    isFeatureLocked: false,
  },
  {
    id: "knowledge_master",
    name: "Knowledge Master",
    description: "Master 75 topics.",
    category: "Mastery",
    icon: "🔮",
    bgTint: "#F5F3FF",
    xpReward: 200,
    requiredProgress: 75,
    progressMetric: "masteredTopics",
    isFeatureLocked: false,
  },
  {
    id: "study_legend",
    name: "Study Legend",
    description: "Master 100 topics.",
    category: "Mastery",
    icon: "👑",
    bgTint: "#FEF3C7",
    xpReward: 300,
    requiredProgress: 100,
    progressMetric: "masteredTopics",
    isFeatureLocked: false,
  },

  // ── LEADERSHIP CATEGORY ───────────────────────────────────────────────────
  {
    id: "first_leader",
    name: "First Leader",
    description: "Complete your first leadership activity.",
    category: "Leadership",
    icon: "👥",
    bgTint: "#F1F5F9",
    xpReward: 25,
    requiredProgress: 1,
    progressMetric: "leadershipActivities",
    isFeatureLocked: true,
  },
  {
    id: "team_player",
    name: "Team Player",
    description: "Participate in or help with a study group.",
    category: "Leadership",
    icon: "🤝",
    bgTint: "#F1F5F9",
    xpReward: 50,
    requiredProgress: 1,
    progressMetric: "studyGroupsHelped",
    isFeatureLocked: true,
  },
  {
    id: "study_mentor",
    name: "Study Mentor",
    description: "Help another student solve a problem.",
    category: "Leadership",
    icon: "🎓",
    bgTint: "#F1F5F9",
    xpReward: 75,
    requiredProgress: 1,
    progressMetric: "studentsMentored",
    isFeatureLocked: true,
  },
  {
    id: "emerging_leader",
    name: "Emerging Leader",
    description: "Complete multiple leadership challenges.",
    category: "Leadership",
    icon: "🥇",
    bgTint: "#F1F5F9",
    xpReward: 100,
    requiredProgress: 5,
    progressMetric: "leadershipChallenges",
    isFeatureLocked: true,
  },
];

/**
 * Evaluate user progress against master achievements and return updated achievement statuses
 */
export function evaluateAchievements(userProgress = {}, currentAchievementsState = {}) {
  const updatedAchievements = {};
  const newlyUnlocked = [];

  MASTER_ACHIEVEMENTS.forEach((ach) => {
    const existing = currentAchievementsState[ach.id] || {};
    
    // If feature is locked (e.g. leadership feature not active yet), keep locked
    if (ach.isFeatureLocked) {
      updatedAchievements[ach.id] = {
        ...ach,
        currentProgress: 0,
        unlocked: false,
        status: "locked",
        unlockDate: null,
      };
      return;
    }

    const metricVal = userProgress[ach.progressMetric] || 0;
    const currentProgress = Math.min(ach.requiredProgress, metricVal);
    const wasUnlocked = existing.unlocked || false;
    const isNowUnlocked = wasUnlocked || currentProgress >= ach.requiredProgress;

    let status = "locked";
    if (isNowUnlocked) {
      status = "unlocked";
    } else if (currentProgress > 0) {
      status = "in_progress";
    }

    const unlockDate = isNowUnlocked ? (existing.unlockDate || new Date().toISOString()) : null;

    if (isNowUnlocked && !wasUnlocked) {
      newlyUnlocked.push({
        ...ach,
        unlocked: true,
        status: "unlocked",
        unlockDate,
      });
    }

    updatedAchievements[ach.id] = {
      ...ach,
      currentProgress,
      unlocked: isNowUnlocked,
      status,
      unlockDate,
    };
  });

  return {
    achievements: updatedAchievements,
    newlyUnlocked,
  };
}
