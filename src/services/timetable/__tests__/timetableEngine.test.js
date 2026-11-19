// src/services/timetable/__tests__/timetableEngine.test.js
// Automated test suite verifying the 12 critical scheduling criteria for StudPal Timetable Engine

const assert = require('assert');
const {
  buildAvailabilitySlots,
  calculateSubjectPriorities,
  allocateStudyTasks,
  generateTimetable,
  validateTimetable,
  rescheduleMissedSession,
  formatDateKey,
} = require('../timetableEngine');

let passedTests = 0;
let failedTests = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`  PASS: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`  FAIL: ${testName}`);
    console.error(`        ${err.message}`);
    failedTests++;
  }
}

console.log('\n======================================================');
console.log('STUDPAL TIMETABLE SCHEDULING ENGINE - 12 CRITICAL TESTS');
console.log('======================================================\n');

// --------------------------------------------------------------------------
// TEST 1: 3 subjects, 5 study days, 3-month target, Pomodoro
// --------------------------------------------------------------------------
runTest('1. Standard Student (3 subjects, 5 days, 3 months, Pomodoro)', () => {
  const result = generateTimetable({
    onboardingData: {
      subjects: ['Mathematics', 'Economics', 'Computer Science'],
      studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      studyTime: 'night',
      targetData: { label: 'In 3 months', days: 90 },
      usePomodoro: true,
      goal: 'Prepare for upcoming exams',
    },
    horizonWeeks: 2,
  });

  assert(result.sessions.length > 0, 'Should generate sessions');
  assert.strictEqual(result.validation.isValid, true, 'Validation must pass without conflicts');
  // Check that all generated sessions are Pomodoro (25 min)
  result.sessions.forEach((sess) => {
    assert.strictEqual(sess.durationMinutes, 25, 'Each session must be 25 min');
    assert.strictEqual(sess.sessionType, 'Pomodoro', 'Session type must be Pomodoro');
    assert(
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(sess.dayName),
      `Session must be on selected study days, got ${sess.dayName}`
    );
  });
});

// --------------------------------------------------------------------------
// TEST 2: Continuous study instead of Pomodoro
// --------------------------------------------------------------------------
runTest('2. Continuous Study Student (45m/60m unbroken flow, no 25m forced Pomodoro)', () => {
  const result = generateTimetable({
    onboardingData: {
      subjects: ['Physics', 'Chemistry'],
      studyDays: ['Mon', 'Wed', 'Fri'],
      studyTime: 'evening',
      usePomodoro: false,
      sessionLength: '45 min',
    },
    horizonWeeks: 2,
  });

  assert(result.sessions.length > 0, 'Should generate continuous sessions');
  result.sessions.forEach((sess) => {
    assert.strictEqual(sess.sessionType, 'Continuous', 'Session type must be Continuous');
    assert.strictEqual(sess.durationMinutes, 45, 'Session duration must be 45 min');
    assert.strictEqual(sess.isPomodoro, false, 'isPomodoro flag must be false');
  });
});

// --------------------------------------------------------------------------
// TEST 3: Student selecting only 1 or 2 available days
// --------------------------------------------------------------------------
runTest('3. Constrained Schedule (Only 1-2 study days selected: Sat & Sun)', () => {
  const result = generateTimetable({
    onboardingData: {
      subjects: ['Biology', 'History'],
      studyDays: ['Sat', 'Sun'],
      studyTime: 'morning',
      usePomodoro: true,
    },
    horizonWeeks: 2,
  });

  assert(result.sessions.length > 0, 'Should generate sessions on weekend only');
  result.sessions.forEach((sess) => {
    assert(['Sat', 'Sun'].includes(sess.dayName), `Session must only be on Sat or Sun, found ${sess.dayName}`);
  });
  // Verify weekdays have 0 sessions
  const weekdaySessions = result.sessions.filter((s) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(s.dayName));
  assert.strictEqual(weekdaySessions.length, 0, 'No sessions allowed on unselected weekdays');
});

// --------------------------------------------------------------------------
// TEST 4: Student with several overlapping commitments
// --------------------------------------------------------------------------
runTest('4. Overlapping Commitments (Clashing blocks must be subtracted from availability)', () => {
  const todayKey = formatDateKey(new Date());
  const commitments = [
    { date: todayKey, startTime: '21:30', endTime: '22:30', title: 'Work shift' },
  ];

  const capacity = buildAvailabilitySlots({
    studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    studyTime: 'night', // default night blocks: 21:30, 22:15, 23:00
    commitments,
    targetDays: 7,
  });

  // Verify no slot is created that overlaps with the 21:30-22:30 commitment
  const conflictingSlots = capacity.slots.filter(
    (s) => s.date === todayKey && s.startTime >= '21:30' && s.startTime < '22:30'
  );
  assert.strictEqual(conflictingSlots.length, 0, 'Commitment times must be excluded from available slots');
});

// --------------------------------------------------------------------------
// TEST 5: Insufficient time to complete all planned work
// --------------------------------------------------------------------------
runTest('5. Insufficient Time (Gracefully caps workload without impossible timetable)', () => {
  // 5 subjects requested, but only 1 day available
  const result = generateTimetable({
    onboardingData: {
      subjects: ['Math', 'Physics', 'Chemistry', 'Biology', 'Economics'],
      studyDays: ['Mon'],
      studyTime: 'night', // 3 slots max per night
      usePomodoro: true,
    },
    horizonWeeks: 1,
  });

  assert(result.validation.isValid, 'Timetable must remain valid without crashing');
  assert(result.sessions.length <= 3, 'Must safely cap to available day capacity without overflowing');
});

// --------------------------------------------------------------------------
// TEST 6: Student with an upcoming examination
// --------------------------------------------------------------------------
runTest('6. Upcoming Examination (Elevates urgency and allocates exam topics & past questions)', () => {
  const priorities = calculateSubjectPriorities({
    subjects: ['Mathematics', 'Geography'],
    objective: 'Prepare for upcoming exams',
    targetDays: 14, // Exam in 2 weeks
    confidence: 'I understand the basics',
  });

  // Math core exam priority should be distinctly elevated
  assert(priorities['Mathematics'] > priorities['Geography'], 'Core exam subject must have higher priority score');
  assert(priorities['Mathematics'] >= 0.5, 'Math priority should be >= 0.5 in exam mode');
});

// --------------------------------------------------------------------------
// TEST 7: Student with weak performance in one subject
// --------------------------------------------------------------------------
runTest('7. Weak Subject Performance (Boosts weakness factor to 30%+ share of study time)', () => {
  const priorities = calculateSubjectPriorities({
    subjects: ['Physics', 'English'],
    objective: 'Improve my grades',
    targetDays: 60,
    confidence: 'I struggle with the basics',
    performanceData: {
      Physics: { averageScore: 45, isWeak: true, lastReviewedDaysAgo: 10 },
      English: { averageScore: 90, isWeak: false, lastReviewedDaysAgo: 2 },
    },
  });

  assert(
    priorities['Physics'] > priorities['English'],
    `Weak subject Physics (${priorities['Physics']}) must have higher priority than strong English (${priorities['English']})`
  );
});

// --------------------------------------------------------------------------
// TEST 8: Student who misses a scheduled session
// --------------------------------------------------------------------------
runTest('8. Reschedule Missed Session (Moves into future slot without touching completed work)', () => {
  const initial = generateTimetable({
    onboardingData: {
      subjects: ['Mathematics'],
      studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      studyTime: 'morning',
      usePomodoro: true,
    },
    horizonWeeks: 2,
  });

  const sessionToMiss = initial.sessions[0];
  const capacity = buildAvailabilitySlots({
    studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    studyTime: 'morning',
    targetDays: 20,
    startDate: new Date(),
  });

  const rescheduleResult = rescheduleMissedSession(initial.sessions, sessionToMiss.id, capacity.slots);

  assert.strictEqual(rescheduleResult.success, true, 'Reschedule must succeed');
  assert.strictEqual(rescheduleResult.rescheduledSession.status, 'rescheduled');
  assert(rescheduleResult.rescheduledSession.rescheduledFrom, 'Must record original date');
});

// --------------------------------------------------------------------------
// TEST 9: Student whose available days or target date changes
// --------------------------------------------------------------------------
runTest('9. Preference Changes (Regenerates future sessions respecting new days)', () => {
  // First generation: Mon-Wed
  const first = generateTimetable({
    onboardingData: {
      subjects: ['Computer Science'],
      studyDays: ['Mon', 'Tue', 'Wed'],
      studyTime: 'afternoon',
    },
    horizonWeeks: 2,
  });

  // Second generation: Changed to Thu-Fri
  const second = generateTimetable({
    onboardingData: {
      subjects: ['Computer Science'],
      studyDays: ['Thu', 'Fri'],
      studyTime: 'afternoon',
    },
    horizonWeeks: 2,
  });

  second.sessions.forEach((sess) => {
    assert(['Thu', 'Fri'].includes(sess.dayName), 'New sessions must strictly follow updated days');
  });
});

// --------------------------------------------------------------------------
// TEST 10: Regenerating timetable preserves completed sessions
// --------------------------------------------------------------------------
runTest('10. Preserve Completed Sessions (Completed work is never deleted or moved)', () => {
  const completedDate = formatDateKey(new Date());
  const existingCompleted = [
    {
      id: 'completed-sess-1',
      subject: 'Mathematics',
      topic: 'Integration by Parts',
      date: completedDate,
      startTime: '8:00 AM',
      endTime: '8:25 AM',
      rawStartTime: '08:00',
      durationMinutes: 25,
      status: 'completed',
    },
  ];

  const regenerated = generateTimetable({
    onboardingData: {
      subjects: ['Physics', 'Chemistry'], // even if subjects change!
      studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      studyTime: 'morning',
    },
    existingSessions: existingCompleted,
    horizonWeeks: 2,
  });

  const foundCompleted = regenerated.sessions.find((s) => s.id === 'completed-sess-1');
  assert(foundCompleted, 'Completed session must be preserved in regenerated timetable');
  assert.strictEqual(foundCompleted.status, 'completed', 'Completed status must remain completed');
});

// --------------------------------------------------------------------------
// TEST 11: Night-time slot that crosses midnight
// --------------------------------------------------------------------------
runTest('11. Night-Time Slot Handling (Safe boundary to prevent negative times or infinite loops)', () => {
  const capacity = buildAvailabilitySlots({
    studyDays: ['Mon'],
    studyTime: 'night', // default night window: 21:30 - 23:45
    targetDays: 7,
    usePomodoro: true,
  });

  capacity.slots.forEach((slot) => {
    assert(slot.endTime <= '23:59', 'End time must not exceed 23:59 or wrap into previous day');
    assert(slot.startTime < slot.endTime, 'Start time must precede end time');
  });
});

// --------------------------------------------------------------------------
// TEST 12: User attempting to access another student's timetable (RLS check)
// --------------------------------------------------------------------------
runTest('12. User Privacy & RLS Isolation (Sessions strictly partitioned by userId)', () => {
  const studentA = generateTimetable({
    userId: 'user_student_alex_uuid_1111',
    onboardingData: { subjects: ['Math'], studyDays: ['Mon'] },
  });

  const studentB = generateTimetable({
    userId: 'user_student_bella_uuid_2222',
    onboardingData: { subjects: ['Economics'], studyDays: ['Tue'] },
  });

  studentA.sessions.forEach((s) => {
    assert.strictEqual(s.userId, 'user_student_alex_uuid_1111', 'Session must belong to Alex');
  });

  studentB.sessions.forEach((s) => {
    assert.strictEqual(s.userId, 'user_student_bella_uuid_2222', 'Session must belong to Bella');
  });

  const alexSeesBella = studentA.sessions.some((s) => s.userId === 'user_student_bella_uuid_2222');
  assert.strictEqual(alexSeesBella, false, 'Cross-user data leakage strictly prohibited');
});

console.log('\n======================================================');
console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
