// src/services/timetable/timetableEngine.js
// StudPal Intelligent Research-Informed Timetable Scheduling Engine
// Pure deterministic algorithms for study capacity, prioritization, task allocation,
// spaced repetition, Pomodoro intervals, constraint validation, and adaptive rescheduling.

export const STUDY_TIME_WINDOWS = {
  morning: {
    start: '08:00',
    end: '12:00',
    startHour: 8,
    endHour: 12,
    defaultBlocks: ['08:00', '09:30', '11:00'],
  },
  afternoon: {
    start: '13:00',
    end: '17:00',
    startHour: 13,
    endHour: 17,
    defaultBlocks: ['13:00', '14:30', '16:00'],
  },
  evening: {
    start: '17:30',
    end: '21:30',
    startHour: 17.5,
    endHour: 21.5,
    defaultBlocks: ['18:00', '19:30', '21:00'],
  },
  night: {
    start: '22:00',
    end: '23:45',
    startHour: 22,
    endHour: 23.75,
    defaultBlocks: ['22:00', '22:35', '23:15'],
  },
};

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Standard curriculum knowledge bank fallback topics when subject has no custom topics
export const SUBJECT_TOPICS_CATALOG = {
  mathematics: [
    { name: 'Algebra Practice', category: 'Core Practice', mastery: 80 },
    { name: 'Derivatives & Chain Rule', category: 'Understanding', mastery: 75 },
    { name: 'Integration by Parts', category: 'Weak Topic', mastery: 55 },
    { name: 'Differential Equations', category: 'Practice', mastery: 70 },
    { name: 'Trigonometry & Vectors', category: 'Revision', mastery: 65 },
    { name: 'Past Exam Questions', category: 'Exam Prep', mastery: 85 },
  ],
  english: [
    { name: 'Comprehension & Inference', category: 'Core Practice', mastery: 85 },
    { name: 'Essay Writing & Structure', category: 'Practice', mastery: 70 },
    { name: 'Grammar & Syntax Rules', category: 'Weak Topic', mastery: 60 },
    { name: 'Vocabulary & Context', category: 'Revision', mastery: 78 },
  ],
  science: [
    { name: 'Scientific Method & Inquiry', category: 'Fundamentals', mastery: 88 },
    { name: 'Forces & Energy Systems', category: 'Practice', mastery: 72 },
    { name: 'Cell Biology & Systems', category: 'Core Practice', mastery: 68 },
    { name: 'Chemical Reactions', category: 'Revision', mastery: 64 },
  ],
  physics: [
    { name: 'Kinematics & Motion', category: 'Fundamentals', mastery: 85 },
    { name: 'Newtonian Dynamics', category: 'Practice', mastery: 75 },
    { name: 'Electromagnetism & Flux', category: 'Weak Topic', mastery: 58 },
    { name: 'Thermodynamics & Work', category: 'Revision', mastery: 65 },
    { name: 'Wave Optics & Light', category: 'Exam Prep', mastery: 70 },
  ],
  chemistry: [
    { name: 'Atomic Structure & Bonding', category: 'Fundamentals', mastery: 82 },
    { name: 'Stoichiometry & Reactions', category: 'Practice', mastery: 70 },
    { name: 'Organic Chemistry Mechanisms', category: 'Weak Topic', mastery: 52 },
    { name: 'Equilibrium & Le Chatelier', category: 'Revision', mastery: 62 },
  ],
  biology: [
    { name: 'Cell Structure & Organelles', category: 'Fundamentals', mastery: 85 },
    { name: 'Genetics & DNA Replication', category: 'Core Practice', mastery: 78 },
    { name: 'Cellular Respiration & ATP', category: 'Weak Topic', mastery: 60 },
    { name: 'Ecology & Population Growth', category: 'Revision', mastery: 75 },
  ],
  economics: [
    { name: 'Market Structure & Pricing', category: 'Core Practice', mastery: 80 },
    { name: 'Supply & Demand Elasticity', category: 'Practice', mastery: 75 },
    { name: 'Fiscal & Monetary Policy', category: 'Revision', mastery: 68 },
    { name: 'Macroeconomic Growth', category: 'Weak Topic', mastery: 58 },
  ],
  computerscience: [
    { name: 'Data Structures & Arrays', category: 'Fundamentals', mastery: 85 },
    { name: 'Algorithms & Big-O Notation', category: 'Core Practice', mastery: 72 },
    { name: 'Recursion & Dynamic Programming', category: 'Weak Topic', mastery: 54 },
    { name: 'Database Queries & SQL', category: 'Revision', mastery: 80 },
  ],
  history: [
    { name: 'Early Civilizations & Trade', category: 'Fundamentals', mastery: 82 },
    { name: 'Constitutional Developments', category: 'Core Practice', mastery: 75 },
    { name: 'Modern Global Conflicts', category: 'Revision', mastery: 68 },
  ],
  geography: [
    { name: 'Physical Landscapes & Rivers', category: 'Fundamentals', mastery: 80 },
    { name: 'Climate Systems & Ecosystems', category: 'Practice', mastery: 74 },
    { name: 'Urbanization & Economic Hubs', category: 'Revision', mastery: 70 },
  ],
};

// Format a date object to YYYY-MM-DD
export function formatDateKey(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert 24h HH:MM to 12h formatted time string (e.g. "8:00 AM")
export function formatTime12(time24) {
  if (!time24 || typeof time24 !== 'string') return '8:00 AM';
  const parts = time24.split(':');
  let hour = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minutes} ${ampm}`;
}

// Add minutes to HH:MM time string
export function addMinutesToTime(time24, minutesToAdd) {
  const [hStr, mStr] = time24.split(':');
  let totalMin = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + minutesToAdd;
  // Bound to 23:59 to prevent crossing midnight unexpectedly
  totalMin = Math.min(1439, Math.max(0, totalMin));
  const newHour = Math.floor(totalMin / 60);
  const newMin = totalMin % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
}

// Normalize study day strings (e.g. "mon" or "Monday" -> "Mon")
export function normalizeDayName(day) {
  if (!day || typeof day !== 'string') return '';
  const clean = day.trim().toLowerCase();
  if (clean.startsWith('mon')) return 'Mon';
  if (clean.startsWith('tue')) return 'Tue';
  if (clean.startsWith('wed')) return 'Wed';
  if (clean.startsWith('thu')) return 'Thu';
  if (clean.startsWith('fri')) return 'Fri';
  if (clean.startsWith('sat')) return 'Sat';
  if (clean.startsWith('sun')) return 'Sun';
  return clean;
}

// Normalize goal/objective to a clean string
export function normalizeGoalString(goalInput) {
  if (!goalInput) return 'Prepare for upcoming exams';
  if (typeof goalInput === 'string') return goalInput;
  if (typeof goalInput === 'object') {
    return (
      goalInput.title ||
      goalInput.label ||
      goalInput.customGoal ||
      goalInput.name ||
      goalInput.id ||
      'Prepare for upcoming exams'
    );
  }
  return String(goalInput);
}

// Normalize confidence rating to a clean string
export function normalizeConfidenceString(confInput) {
  if (!confInput) return 'I understand the basics';
  if (typeof confInput === 'string') return confInput;
  if (typeof confInput === 'object') {
    return (
      confInput.level ||
      confInput.title ||
      confInput.label ||
      confInput.value ||
      'I understand the basics'
    );
  }
  return String(confInput);
}

// Normalize study time window string
export function normalizeStudyTimeString(timeInput) {
  if (!timeInput) return 'night';
  if (typeof timeInput === 'string') return timeInput.toLowerCase();
  if (typeof timeInput === 'object') {
    return (
      timeInput.id ||
      timeInput.value ||
      timeInput.time ||
      timeInput.title ||
      timeInput.key ||
      'night'
    ).toLowerCase();
  }
  return 'night';
}

// ==============================================================================
// STEP 1: CALCULATE AVAILABLE STUDY CAPACITY
// ==============================================================================

/**
 * Builds concrete calendar time slots based on user selected study days and time period.
 * Subtracts existing commitments and leaves buffer capacity.
 */
export function buildAvailabilitySlots({
  studyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  studyTime = 'night',
  targetDays = 90,
  startDate = new Date(),
  commitments = [],
  bufferFactor = 0.2, // 20% left unallocated for unexpected flexibility
  usePomodoro = true,
  sessionLengthMinutes = 25,
}) {
  // Any weekday shouldn't be free: Mon, Tue, Wed, Thu, Fri are mandatory study days
  const MANDATORY_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const inputDays = Array.isArray(studyDays) && studyDays.length > 0
    ? studyDays.map(normalizeDayName)
    : MANDATORY_WEEKDAYS;
  const normalizedStudyDays = new Set([...MANDATORY_WEEKDAYS, ...inputDays]);
  const timeKey = normalizeStudyTimeString(studyTime);
  const windowConfig = STUDY_TIME_WINDOWS[timeKey] || STUDY_TIME_WINDOWS.night;

  const focusDuration = usePomodoro ? 25 : (sessionLengthMinutes || 45);
  const breakDuration = usePomodoro ? 5 : 10;
  const slotTotalDuration = focusDuration + breakDuration;

  const availableSlots = [];
  const planningDays = Math.min(targetDays, 365); // Cap to 1 year planning horizon

  for (let dayOffset = 0; dayOffset < planningDays; dayOffset++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + dayOffset);

    const dayName = DAY_NAMES[currentDate.getDay()];
    const dateKey = formatDateKey(currentDate);

    // If day is not selected by student, mark as rest day with no slots
    if (!normalizedStudyDays.has(dayName)) {
      continue;
    }

    // Determine candidate start times within the study window
    let candidateBlocks = windowConfig.defaultBlocks;
    if (!usePomodoro) {
      if (timeKey === 'night') {
        candidateBlocks = ['22:00', '22:55'];
      } else if (timeKey === 'morning') {
        candidateBlocks = ['08:30', '10:00'];
      } else if (timeKey === 'afternoon') {
        candidateBlocks = ['13:30', '15:15'];
      } else if (timeKey === 'evening') {
        candidateBlocks = ['18:00', '19:45'];
      } else {
        candidateBlocks = candidateBlocks.slice(0, 2);
      }
    }

    candidateBlocks.forEach((startTimeStr, blockIdx) => {
      const endTimeStr = addMinutesToTime(startTimeStr, focusDuration);

      // Check if slot clashes with any commitment
      const hasConflict = commitments.some((cmt) => {
        if (cmt.date !== dateKey) return false;
        // Simple overlap check
        return (
          (startTimeStr >= cmt.startTime && startTimeStr < cmt.endTime) ||
          (endTimeStr > cmt.startTime && endTimeStr <= cmt.endTime)
        );
      });

      if (!hasConflict) {
        availableSlots.push({
          date: dateKey,
          dayName,
          dateObj: currentDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
          startTime12: formatTime12(startTimeStr),
          endTime12: formatTime12(endTimeStr),
          durationMinutes: focusDuration,
          breakMinutes: breakDuration,
          cycleIndex: (blockIdx % 4) + 1,
          isLongBreakCycle: (blockIdx % 4) === 3,
        });
      }
    });
  }

  // Apply buffer factor: leave portion unallocated
  const totalSlotsCount = availableSlots.length;
  const maxAllocatableSlots = Math.max(1, Math.floor(totalSlotsCount * (1 - bufferFactor)));

  return {
    slots: availableSlots,
    allocatableSlots: availableSlots.slice(0, maxAllocatableSlots),
    bufferedSlotsCount: totalSlotsCount - maxAllocatableSlots,
    totalCapacityMinutes: totalSlotsCount * focusDuration,
  };
}

// ==============================================================================
// STEP 2: DETERMINE SUBJECT AND TOPIC PRIORITIES
// ==============================================================================

/**
 * Calculates normalized priority scores (0 to 1) for each subject and topic.
 * Incorporates Topic Weakness (30%), Deadline Urgency (25%), Academic Importance (20%),
 * Revision Need (15%), and Unfinished Work (10%).
 */
export function calculateSubjectPriorities({
  subjects = ['Mathematics', 'Economics', 'Computer Science'],
  objective = 'Prepare for upcoming exams',
  targetDays = 90,
  confidence = 'I understand the basics',
  performanceData = {}, // { [subjectName]: { averageScore, weakTopicsCount, lastReviewedDaysAgo } }
}) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    subjects = ['Mathematics'];
  }

  // Baseline confidence mapping
  let confidenceWeakness = 0.5;
  const confStr = normalizeConfidenceString(confidence);
  const confLower = confStr.toLowerCase();
  if (confLower.includes('struggle')) confidenceWeakness = 0.85;
  else if (confLower.includes('basic')) confidenceWeakness = 0.55;
  else if (confLower.includes('confident') || confLower.includes('advanced')) confidenceWeakness = 0.25;

  // Objective modifier
  const objStr = normalizeGoalString(objective);
  const objLower = objStr.toLowerCase();
  const isExamPrep = objLower.includes('exam') || objLower.includes('waec') || objLower.includes('jamb');
  const isGradeBoost = objLower.includes('grade') || objLower.includes('improve');

  // Safe target days calculation
  const safeTargetDays = typeof targetDays === 'number'
    ? targetDays
    : (targetDays?.days || parseInt(targetDays?.label, 10) || 90);

  // Weights specified in educational scheduling guidelines
  const W_WEAKNESS = isExamPrep ? 0.35 : 0.30;
  const W_URGENCY = isExamPrep ? 0.30 : 0.25;
  const W_IMPORTANCE = 0.20;
  const W_REVISION = isGradeBoost ? 0.20 : 0.15;
  const W_UNFINISHED = 0.10;

  const rawScores = {};

  subjects.forEach((subjRaw, idx) => {
    const subjName = typeof subjRaw === 'string'
      ? subjRaw
      : (subjRaw?.name || subjRaw?.title || subjRaw?.label || `Subject ${idx + 1}`);
    const cleanKey = String(subjName).toLowerCase().replace(/[^a-z0-9]/g, '');

    const perf = performanceData[subjName] || performanceData[cleanKey] || {};

    // 1. Weakness factor (0 to 1): lower score = higher weakness
    let weaknessScore = confidenceWeakness;
    if (typeof perf.averageScore === 'number') {
      weaknessScore = Math.max(0.1, (100 - perf.averageScore) / 100);
    } else if (perf.isWeak) {
      weaknessScore = 0.85;
    }

    // 2. Deadline Urgency factor (0 to 1): closer target = higher urgency
    let urgencyScore = Math.min(1.0, 45 / Math.max(10, safeTargetDays));
    if (isExamPrep) urgencyScore = Math.min(1.0, urgencyScore * 1.25);

    // 3. Academic Importance (0 to 1): core STEM & core language get high baseline
    let importanceScore = 0.7;
    if (cleanKey.includes('math') || cleanKey.includes('physic') || cleanKey.includes('chem') || cleanKey.includes('eng')) {
      importanceScore = 0.9;
    } else if (idx === 0) {
      importanceScore = 0.85; // User's first selected subject
    }

    // 4. Revision Need (0 to 1): time since last review
    const daysAgo = typeof perf.lastReviewedDaysAgo === 'number' ? perf.lastReviewedDaysAgo : 7;
    const revisionScore = Math.min(1.0, daysAgo / 14);

    // 5. Unfinished required work (0 to 1)
    const unfinishedScore = 0.65;

    const compositeScore =
      weaknessScore * W_WEAKNESS +
      urgencyScore * W_URGENCY +
      importanceScore * W_IMPORTANCE +
      revisionScore * W_REVISION +
      unfinishedScore * W_UNFINISHED;

    rawScores[subjName] = compositeScore;
  });

  // Normalize scores so they sum to 1.0 (with a minimum share floor of 10% per subject)
  const sumRaw = Object.values(rawScores).reduce((a, b) => a + b, 0) || 1;
  const normalized = {};

  Object.entries(rawScores).forEach(([subj, score]) => {
    // Balanced allocation with minimum floor
    normalized[subj] = Math.max(0.12, Number((score / sumRaw).toFixed(3)));
  });

  return normalized;
}

// ==============================================================================
// STEP 3: ALLOCATE STUDY TASKS ACROSS PLANNING PERIOD
// ==============================================================================

/**
 * Maps subject priorities into realistic pedagogical tasks:
 * First-time learning, Practice Questions, Active Recall Quizzes, Spaced Revision.
 */
export function allocateStudyTasks({
  subjects = ['Mathematics'],
  subjectPriorities = {},
  availableSlots = [],
  objective = 'Prepare for upcoming exams',
  usePomodoro = true,
}) {
  if (!availableSlots || availableSlots.length === 0) {
    return [];
  }

  const tasksQueue = [];

  // Generate curriculum topics for each subject
  subjects.forEach((subjRaw) => {
    const subjName = typeof subjRaw === 'string'
      ? subjRaw
      : (subjRaw?.name || subjRaw?.title || subjRaw?.label || 'Subject');
    const cleanKey = String(subjName).toLowerCase().replace(/[^a-z0-9]/g, '');

    const knownTopics = SUBJECT_TOPICS_CATALOG[cleanKey] || [
      { name: `${subjName} Fundamentals`, category: 'Fundamentals', mastery: 80 },
      { name: `${subjName} Core Practice`, category: 'Core Practice', mastery: 72 },
      { name: `${subjName} Problem Solving`, category: 'Practice', mastery: 65 },
      { name: `${subjName} Weak Topic Review`, category: 'Weak Topic', mastery: 55 },
      { name: `${subjName} Past Exam Questions`, category: 'Exam Prep', mastery: 85 },
    ];

    const weight = subjectPriorities[subjName] || 1 / subjects.length;
    // Number of sessions proportional to subject priority
    const totalSubjectSessions = Math.max(2, Math.round(availableSlots.length * weight));

    for (let i = 0; i < totalSubjectSessions; i++) {
      const topicItem = knownTopics[i % knownTopics.length];

      // Pedagogical progression based on cycle index and objective
      let activityType = 'Practice';
      if (topicItem.category === 'Weak Topic') {
        activityType = 'Revision';
      } else if (i % 4 === 0) {
        activityType = 'Understanding';
      } else if (i % 4 === 2) {
        activityType = 'Quiz';
      }

      tasksQueue.push({
        subject: subjName,
        topic: topicItem.name,
        activityType,
        mastery: topicItem.mastery,
        priorityWeight: weight,
      });
    }
  });

  // Interleave subjects (Educational interleaving principle) to avoid clustering same subject
  const interleavedTasks = [];
  const subjectGroups = {};
  subjects.forEach((s) => {
    const name = typeof s === 'string' ? s : s.name;
    subjectGroups[name] = tasksQueue.filter((t) => t.subject === name);
  });

  let hasMore = true;
  let round = 0;
  while (hasMore) {
    hasMore = false;
    subjects.forEach((s) => {
      const name = typeof s === 'string' ? s : s.name;
      if (subjectGroups[name] && subjectGroups[name].length > 0) {
        interleavedTasks.push(subjectGroups[name].shift());
        hasMore = true;
      }
    });
    round++;
    if (round > 500) break; // safety guard
  }

  return interleavedTasks;
}

// ==============================================================================
// STEP 4: FIT SESSIONS INTO ACTUAL TIME SLOTS & VALIDATE CONSTRAINTS
// ==============================================================================

/**
 * Fits allocated tasks into concrete calendar slots with start/end times and Pomodoro config.
 */
export function generateTimetable({
  userId = 'user_local_guest',
  onboardingData = {},
  existingSessions = [], // completed or existing sessions to preserve
  commitments = [],
  startDate,
  horizonWeeks = 4, // Generate 4 weeks initially for immediate view
}) {
  let effectiveStartDate = startDate ? new Date(startDate) : new Date();
  if (isNaN(effectiveStartDate.getTime())) {
    effectiveStartDate = new Date();
  }
  // Anchor to Monday of the starting week so every weekday of the week is scheduled
  const startDay = effectiveStartDate.getDay();
  const diffToMonday = effectiveStartDate.getDate() - startDay + (startDay === 0 ? -6 : 1);
  effectiveStartDate = new Date(effectiveStartDate.setDate(diffToMonday));
  effectiveStartDate.setHours(0, 0, 0, 0);

  const subjects = onboardingData.subjects && onboardingData.subjects.length > 0
    ? onboardingData.subjects
    : ['Mathematics', 'Economics', 'Computer Science'];

  // Any weekday shouldn't be free (Mon, Tue, Wed, Thu, Fri are mandatory study days)
  const MANDATORY_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const userDays = Array.isArray(onboardingData.studyDays) && onboardingData.studyDays.length > 0
    ? onboardingData.studyDays.map(normalizeDayName)
    : [];
  const studyDaysSet = new Set([...MANDATORY_WEEKDAYS, ...userDays]);
  const studyDays = Array.from(studyDaysSet);

  const studyTime = normalizeStudyTimeString(onboardingData.studyTime || onboardingData.studyTimeOfDay || 'night');

  const targetDays = typeof onboardingData.targetData === 'number'
    ? onboardingData.targetData
    : (onboardingData.targetData?.days || 90);

  const usePomodoro = onboardingData.usePomodoro !== false;
  const sessionLengthMinutes = usePomodoro ? 25 : (parseInt(onboardingData.sessionLength, 10) || 45);

  const objective = normalizeGoalString(onboardingData.goal || onboardingData.objective);
  const confidence = normalizeConfidenceString(onboardingData.confidence);

  // 1. Build available calendar slots
  const capacity = buildAvailabilitySlots({
    studyDays,
    studyTime,
    targetDays: horizonWeeks * 7,
    startDate: effectiveStartDate,
    commitments,
    bufferFactor: 0.15, // 15% buffer
    usePomodoro,
    sessionLengthMinutes,
  });

  const slots = capacity.allocatableSlots;

  // 2. Calculate normalized priorities
  const priorities = calculateSubjectPriorities({
    subjects,
    objective,
    targetDays,
    confidence,
  });

  // 3. Allocate interleaved tasks
  const tasks = allocateStudyTasks({
    subjects,
    subjectPriorities: priorities,
    availableSlots: slots,
    objective,
    usePomodoro,
  });

  // 4. Preserve existing completed sessions and build set of booked slots
  const preservedSessions = existingSessions.filter((s) => s.status === 'completed');
  const bookedSlotKeys = new Set(
    preservedSessions.map((s) => `${s.date}_${s.startTime}`)
  );

  const generatedSessions = [...preservedSessions];

  // 5. Fit tasks into unbooked slots
  let taskIndex = 0;
  slots.forEach((slot, slotIdx) => {
    const slotKey = `${slot.date}_${slot.startTime}`;
    if (bookedSlotKeys.has(slotKey)) {
      return; // already occupied by preserved completed session
    }

    if (taskIndex >= tasks.length) {
      taskIndex = 0; // loop curriculum seamlessly
    }

    const task = tasks[taskIndex++];
    const sessionType = usePomodoro ? 'Pomodoro' : 'Continuous';

    // Format human-friendly day label, e.g. "Mon Oct 27"
    const dateParts = slot.date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(dateParts[1], 10) - 1;
    const formattedDate = `${slot.dayName} ${monthNames[monthIdx]} ${dateParts[2]}`;

    const newSession = {
      id: `tt_${slot.date}_${slot.startTime.replace(':', '')}_${slotIdx}`,
      userId,
      subject: task.subject,
      topic: task.topic,
      date: slot.date,
      dayName: slot.dayName,
      formattedDate,
      startTime: slot.startTime12,
      endTime: slot.endTime12,
      rawStartTime: slot.startTime,
      rawEndTime: slot.endTime,
      durationMinutes: slot.durationMinutes,
      sessionType,
      status: 'upcoming',
      priority: task.priorityWeight,
      isPomodoro: usePomodoro,
      breakMinutes: slot.breakMinutes,
      cycleIndex: slot.cycleIndex,
      notes: `${task.activityType} session generated by StudPal AI`,
    };

    generatedSessions.push(newSession);
  });

  // 6. Sort chronologically by date and start time
  generatedSessions.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.rawStartTime || a.startTime).localeCompare(b.rawStartTime || b.startTime);
  });

  // 7. Validate constraints
  const validation = validateTimetable(generatedSessions, {
    studyDays,
    usePomodoro,
    studyTime,
  });

  return {
    sessions: generatedSessions,
    priorities,
    validation,
    capacity,
  };
}

// ==============================================================================
// STEP 5: VALIDATE TIMETABLE CONSTRAINTS
// ==============================================================================

/**
 * Validates generated sessions for conflicts, invalid days, and workload constraints.
 */
export function validateTimetable(sessions = [], constraints = {}) {
  const warnings = [];
  const conflicts = [];
  const allowedDays = new Set((constraints.studyDays || []).map(normalizeDayName));

  const bookedTimesByDate = {};

  sessions.forEach((sess) => {
    // 1. Day of week validation
    if (allowedDays.size > 0 && !allowedDays.has(sess.dayName)) {
      warnings.push(`Session ${sess.id} scheduled on unselected day ${sess.dayName}.`);
    }

    // 2. Overlap validation
    if (!bookedTimesByDate[sess.date]) {
      bookedTimesByDate[sess.date] = [];
    }

    const dateSlots = bookedTimesByDate[sess.date];
    const sStart = sess.rawStartTime || sess.startTime;
    const sEnd = sess.rawEndTime || sess.endTime;

    const hasOverlap = dateSlots.some((slot) => {
      return (sStart >= slot.start && sStart < slot.end) || (sEnd > slot.start && sEnd <= slot.end);
    });

    if (hasOverlap) {
      conflicts.push({
        sessionId: sess.id,
        date: sess.date,
        time: `${sStart} - ${sEnd}`,
      });
      warnings.push(`Conflict: Overlapping session on ${sess.date} at ${sStart}.`);
    } else {
      dateSlots.push({ start: sStart, end: sEnd });
    }

    // 3. Duration check
    if (sess.durationMinutes <= 0) {
      warnings.push(`Session ${sess.id} has invalid non-positive duration.`);
    }
  });

  return {
    isValid: conflicts.length === 0,
    conflicts,
    warnings,
    totalSessions: sessions.length,
  };
}

// ==============================================================================
// STEP 6: ADAPTIVE RESCHEDULING OF MISSED SESSIONS
// ==============================================================================

/**
 * Reschedules a missed session into the earliest feasible future slot without stacking.
 * Preserves all completed sessions intact.
 */
export function rescheduleMissedSession(sessions = [], missedSessionId, futureAvailableSlots = []) {
  const sessionIndex = sessions.findIndex((s) => s.id === missedSessionId);
  if (sessionIndex === -1) {
    return { success: false, sessions };
  }

  const targetSession = sessions[sessionIndex];
  if (targetSession.status === 'completed') {
    // Cannot reschedule completed work
    return { success: false, sessions, error: 'Cannot reschedule completed session.' };
  }

  // Find existing occupied slot dates & times
  const occupied = new Set(
    sessions.map((s) => `${s.date}_${s.rawStartTime || s.startTime}`)
  );

  // Look for first unallocated future slot
  const todayKey = formatDateKey(new Date());
  const candidateSlot = futureAvailableSlots.find((slot) => {
    if (slot.date <= todayKey) return false;
    const key = `${slot.date}_${slot.startTime}`;
    return !occupied.has(key);
  });

  if (!candidateSlot) {
    return {
      success: false,
      sessions,
      warning: 'No available capacity in the current planning period to reschedule.',
    };
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateParts = candidateSlot.date.split('-');
  const monthIdx = parseInt(dateParts[1], 10) - 1;
  const formattedDate = `${candidateSlot.dayName} ${monthNames[monthIdx]} ${dateParts[2]}`;

  const updatedSessions = [...sessions];
  updatedSessions[sessionIndex] = {
    ...targetSession,
    date: candidateSlot.date,
    dayName: candidateSlot.dayName,
    formattedDate,
    startTime: candidateSlot.startTime12,
    endTime: candidateSlot.endTime12,
    rawStartTime: candidateSlot.startTime,
    rawEndTime: candidateSlot.endTime,
    status: 'rescheduled',
    rescheduledFrom: targetSession.date,
    notes: `Rescheduled from ${targetSession.date}`,
  };

  return {
    success: true,
    sessions: updatedSessions,
    rescheduledSession: updatedSessions[sessionIndex],
  };
}
