// src/services/adaptiveTopicsService.js
// Generates personalized, daily-rotating study prompts and topic pills tailored to the user's data & weak areas.

export const SUBJECT_KNOWLEDGE_BANK = {
  chemistry: {
    subjectName: 'Chemistry',
    emoji: '🧫',
    color: '#F97316',
    weakTopics: [
      {
        topic: 'Organic Chemistry Mechanisms',
        queries: [
          'Branco, explain SN1 vs SN2 and E1 vs E2 reaction mechanisms with transition states and solvent effects.',
          'Walk me through Aldol addition and condensation mechanisms step-by-step with electron-pushing arrows.',
          'Explain electrophilic aromatic substitution (EAS) directing groups: ortho/para vs meta directors.',
        ],
      },
      {
        topic: 'Chemical Equilibrium & Le Chatelier',
        queries: [
          'Explain Le Chatelier’s Principle: how temperature, pressure, and concentration shifts affect equilibrium constant K.',
          'How do I calculate ICE tables and equilibrium concentrations for weak acid-base buffer solutions?',
        ],
      },
      {
        topic: 'Stoichiometry & Redox Reactions',
        queries: [
          'Explain how to balance complex redox half-reactions in acidic and basic solutions step-by-step.',
          'How do I calculate limiting reagents, theoretical yield, and percent yield accurately?',
        ],
      },
    ],
  },
  math: {
    subjectName: 'Mathematics',
    emoji: '📐',
    color: '#6236FF',
    weakTopics: [
      {
        topic: 'Integration by Parts',
        queries: [
          'Branco, guide me through Integration by Parts using the LIATE rule with 2 challenging exam-style examples.',
          'Explain tabular integration (DI method) for repeated integrals with trig and exponential functions.',
        ],
      },
      {
        topic: 'Differential Equations',
        queries: [
          'Explain how to solve first-order separable and linear differential equations with integrating factors.',
          'Walk me through second-order homogeneous differential equations with characteristic roots.',
        ],
      },
      {
        topic: 'Derivatives & Chain Rule',
        queries: [
          'Explain the Chain Rule for composite and implicit functions with geometric intuition and step-by-step proofs.',
          'How do I find related rates and optimization maximums/minimums using first and second derivatives?',
        ],
      },
    ],
  },
  physics: {
    subjectName: 'Physics',
    emoji: '⚛️',
    color: '#10B981',
    weakTopics: [
      {
        topic: 'Electromagnetism & Flux',
        queries: [
          'Branco, explain Gauss’s Law and magnetic flux: Faraday’s Law of induction and Lenz’s Law with direction rules.',
          'Walk me through Ampere’s Law, Biot-Savart Law, and Lorentz force calculations on charged particles.',
        ],
      },
      {
        topic: 'Quantum Physics',
        queries: [
          'Explain wave-particle duality, De Broglie wavelength, and the physical meaning of the Schrödinger wavefunction.',
          'What is quantum tunneling and Heisenberg’s uncertainty principle with real-world semiconductor examples?',
        ],
      },
      {
        topic: 'Thermodynamics & Heat Engines',
        queries: [
          'Explain Carnot cycle efficiency, entropy changes in irreversible processes, and PV-diagram work calculations.',
          'Walk me through the First and Second Laws of Thermodynamics with adiabatic and isothermal expansions.',
        ],
      },
    ],
  },
  biology: {
    subjectName: 'Biology',
    emoji: '🧬',
    color: '#3B82F6',
    weakTopics: [
      {
        topic: 'Cellular Respiration & ATP',
        queries: [
          'Branco, trace glycolysis, Krebs cycle, and oxidative phosphorylation electron transport chain with ATP yields.',
          'Explain Chemiosmosis and the proton-motive force across the inner mitochondrial membrane.',
        ],
      },
      {
        topic: 'Genetics & DNA Replication',
        queries: [
          'Explain DNA replication fork enzymes: helicase, topoisomerase, primase, DNA polymerase III, and ligase.',
          'Walk me through transcription and translation with mRNA splicing and tRNA codon-anticodon pairing.',
        ],
      },
    ],
  },
  cs: {
    subjectName: 'Computer Science',
    emoji: '💻',
    color: '#8B5CF6',
    weakTopics: [
      {
        topic: 'Data Structures & Big-O',
        queries: [
          'Branco, compare time and space complexity of Trees, Hash Maps, and Heaps with edge-case scenarios.',
          'Explain dynamic programming memoization vs tabulation using the Knapsack and Fibonacci problems.',
        ],
      },
      {
        topic: 'Algorithms & Recursion',
        queries: [
          'Explain Dijkstra’s algorithm and A* search step-by-step with priority queue implementation.',
          'Walk me through recursive backtracking and tree traversal (In-order, Pre-order, Post-order).',
        ],
      },
    ],
  },
  english: {
    subjectName: 'English',
    emoji: '📖',
    color: '#EC4899',
    weakTopics: [
      {
        topic: 'Argumentative Essay Structure',
        queries: [
          'Branco, help me structure a compelling thesis statement and rebuttal paragraph for an academic essay.',
          'Explain rhetorical analysis: ethos, pathos, and logos with high-scoring analytical templates.',
        ],
      },
      {
        topic: 'Literary Devices & Grammar',
        queries: [
          'Explain subject-verb agreement exceptions and tricky pronoun-antecedent concord rules.',
          'Walk me through identifying subtle metaphors, paradoxes, and allegories in reading comprehension.',
        ],
      },
    ],
  },
  economics: {
    subjectName: 'Economics',
    emoji: '📈',
    color: '#0284C7',
    weakTopics: [
      {
        topic: 'Price Elasticity of Demand',
        queries: [
          'Branco, explain price elasticity of demand (PED) calculations and total revenue test.',
          'Walk me through cross-price and income elasticity with normal, inferior, and luxury goods.',
        ],
      },
      {
        topic: 'Fiscal & Monetary Policy',
        queries: [
          'Explain how central bank interest rate shifts impact aggregate demand and inflation.',
          'What is the difference between expansionary fiscal policy and contractionary monetary policy?',
        ],
      },
    ],
  },
  government: {
    subjectName: 'Government',
    emoji: '🏛️',
    color: '#2563EB',
    weakTopics: [
      {
        topic: 'Separation of Powers & Judiciary',
        queries: [
          'Branco, explain the checks and balances between Legislature, Executive, and Judiciary.',
          'Walk me through judicial review and constitutional supremacy principles.',
        ],
      },
      {
        topic: 'Federalism & Electoral Systems',
        queries: [
          'Compare Federal, Unitary, and Confederal systems of government with real-world examples.',
          'Explain proportional representation vs first-past-the-post electoral systems.',
        ],
      },
    ],
  },
  geography: {
    subjectName: 'Geography',
    emoji: '🌍',
    color: '#059669',
    weakTopics: [
      {
        topic: 'Plate Tectonics & Earthquakes',
        queries: [
          'Branco, explain convergent, divergent, and transform plate boundaries with landform outcomes.',
          'Walk me through seismic waves (P-waves vs S-waves) and Richter vs Mercalli scales.',
        ],
      },
      {
        topic: 'Climate Zones & Atmospheric Circulation',
        queries: [
          'Explain Hadley, Ferrel, and Polar atmospheric cells and global precipitation belts.',
          'What factors determine Koppen climate classifications across continents?',
        ],
      },
    ],
  },
  history: {
    subjectName: 'History',
    emoji: '📜',
    color: '#D97706',
    weakTopics: [
      {
        topic: 'World War II & Post-War Order',
        queries: [
          'Branco, summarize the causes and turning points of World War II in Europe and the Pacific.',
          'Explain the origin of the United Nations and the onset of the Cold War.',
        ],
      },
      {
        topic: 'Ancient Empires & Civilizations',
        queries: [
          'Compare the governance systems of Ancient Greece, Egypt, and the Roman Republic.',
          'What trade networks shaped early Mediterranean and trans-Saharan commerce?',
        ],
      },
    ],
  },
  literature: {
    subjectName: 'Literature',
    emoji: '📚',
    color: '#9333EA',
    weakTopics: [
      {
        topic: 'Poetic Forms & Meter',
        queries: [
          'Branco, break down Shakespearean vs Petrarchan sonnet rhyme schemes and iambic pentameter.',
          'Explain tone, mood, and dramatic irony in classic theatre.',
        ],
      },
    ],
  },
  french: {
    subjectName: 'French',
    emoji: '🇫🇷',
    color: '#4F46E5',
    weakTopics: [
      {
        topic: 'Passé Composé vs Imparfait',
        queries: [
          'Branco, explain when to use Passé Composé vs Imparfait with narrative story examples.',
          'Walk me through irregular French verb conjugations with être vs avoir auxiliary.',
        ],
      },
    ],
  },
  accounting: {
    subjectName: 'Accounting',
    emoji: '📊',
    color: '#16A34A',
    weakTopics: [
      {
        topic: 'Balance Sheet & Ledger Entries',
        queries: [
          'Branco, explain double-entry journal entries for asset depreciation and accruals.',
          'Walk me through preparing a Statement of Financial Position and Trial Balance.',
        ],
      },
    ],
  },
};

const DAILY_THEMES = [
  { name: 'Weekly Mastery Booster', queryPrefix: 'Comprehensive revision & master drill: ' },
  { name: 'Foundations & Concepts', queryPrefix: 'Break down foundational principles of ' },
  { name: 'Step-by-Step Derivations', queryPrefix: 'Walk me through step-by-step derivations and mechanisms for ' },
  { name: 'Active Recall & High-Yield', queryPrefix: 'High-yield active recall flashcard breakdown for ' },
  { name: 'Exam Trap Diagnostic', queryPrefix: 'Common exam traps, mistakes, and edge cases in ' },
  { name: 'Rapid Speed Practice', queryPrefix: 'Rapid practice questions and shortcuts for ' },
  { name: 'Deep Dive & Intuition', queryPrefix: 'Real-world visual intuition and mental models for ' },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTodayDateKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

export function getDailyAdaptivePills(user = {}) {
  const todayKey = getTodayDateKey();
  const dayOfWeek = new Date().getDay();
  const userSeed = todayKey + '_' + (user && (user.id || user.name) ? (user.id || user.name) : 'Alex');
  const dayTheme = DAILY_THEMES[dayOfWeek];

  // Resolve user subject keys from user.subjects or user.enrolledSubjectIds
  let rawSubjects = (user && user.subjects && Array.isArray(user.subjects) && user.subjects.length > 0)
    ? user.subjects
    : ((user && user.enrolledSubjectIds && Array.isArray(user.enrolledSubjectIds) && user.enrolledSubjectIds.length > 0)
      ? user.enrolledSubjectIds
      : ['Mathematics', 'Economics', 'Computer Science']);

  const userSubjectKeys = rawSubjects.map(function(s) {
    const clean = String(s).toLowerCase().trim();
    if (clean.includes('math') || clean.includes('calc')) return 'math';
    if (clean.includes('phys')) return 'physics';
    if (clean.includes('chem')) return 'chemistry';
    if (clean.includes('bio')) return 'biology';
    if (clean.includes('econ')) return 'economics';
    if (clean.includes('comp') || clean.includes('cs')) return 'cs';
    if (clean.includes('gov') || clean.includes('civic')) return 'government';
    if (clean.includes('geog')) return 'geography';
    if (clean.includes('hist')) return 'history';
    if (clean.includes('lit')) return 'literature';
    if (clean.includes('french')) return 'french';
    if (clean.includes('acc')) return 'accounting';
    if (clean.includes('eng')) return 'english';
    return clean;
  });

  const weakAreasList = [];

  userSubjectKeys.forEach(function(sKey) {
    const sData = SUBJECT_KNOWLEDGE_BANK[sKey];
    if (sData && sData.weakTopics) {
      sData.weakTopics.forEach(function(wt) {
        weakAreasList.push({
          subjectKey: sKey,
          subjectName: sData.subjectName,
          emoji: sData.emoji,
          color: sData.color,
          topic: wt.topic,
          queries: wt.queries,
        });
      });
    } else {
      // Dynamic fallback for custom subject
      weakAreasList.push({
        subjectKey: sKey,
        subjectName: sKey.charAt(0).toUpperCase() + sKey.slice(1),
        emoji: '📖',
        color: '#6236FF',
        topic: sKey.charAt(0).toUpperCase() + sKey.slice(1) + ' Core Principles',
        queries: [
          'Branco, explain key principles and exam problem-solving in ' + sKey + '.',
        ],
      });
    }
  });

  if (user && user.weakAreas && Array.isArray(user.weakAreas)) {
    user.weakAreas.forEach(function(area) {
      weakAreasList.unshift({
        subjectKey: 'custom',
        subjectName: 'Focus Target',
        emoji: '🎯',
        color: '#EF4444',
        topic: area,
        queries: [
          "Branco, let's practice my key focus area: " + area + ". Provide a step-by-step breakdown and active recall questions.",
        ],
      });
    });
  }

  const pills = [];

  // 1. Primary Weak Area Pill (Personalized)
  if (weakAreasList.length > 0) {
    const weakIndex = hashString(userSeed + '_weak') % weakAreasList.length;
    const targetWeak = weakAreasList[weakIndex];
    const queryIndex = hashString(userSeed + '_wquery') % targetWeak.queries.length;
    pills.push({
      id: 'pill_weak_' + todayKey,
      label: targetWeak.topic,
      prompt: dayTheme.queryPrefix + targetWeak.topic + ': ' + targetWeak.queries[queryIndex],
      tag: targetWeak.topic,
      isWeakArea: true,
      badgeText: 'Priority Need',
      emoji: targetWeak.emoji,
    });
  }

  // 2. Second Subject Rotated by Day
  const availableSubjects = Object.keys(SUBJECT_KNOWLEDGE_BANK);
  const subjIndex = (dayOfWeek + hashString(userSeed)) % availableSubjects.length;
  const subjKey = availableSubjects[subjIndex];
  const subj = SUBJECT_KNOWLEDGE_BANK[subjKey];
  if (subj) {
    const topicObj = subj.weakTopics[hashString(userSeed + '_subjt') % subj.weakTopics.length];
    pills.push({
      id: 'pill_subj_' + todayKey + '_' + subjKey,
      label: topicObj.topic,
      prompt: 'Branco, ' + dayTheme.queryPrefix + topicObj.topic + '. Please explain with clear examples and formulas.',
      tag: topicObj.topic,
      isWeakArea: false,
      badgeText: 'Daily Focus',
      emoji: subj.emoji,
    });
  }

  // 3. Third Complementary Subject
  const altSubjIndex = (subjIndex + 2) % availableSubjects.length;
  const altSubjKey = availableSubjects[altSubjIndex];
  const altSubj = SUBJECT_KNOWLEDGE_BANK[altSubjKey];
  if (altSubj) {
    const topicObj = altSubj.weakTopics[hashString(userSeed + '_altt') % altSubj.weakTopics.length];
    pills.push({
      id: 'pill_alt_' + todayKey + '_' + altSubjKey,
      label: topicObj.topic,
      prompt: topicObj.queries[0],
      tag: topicObj.topic,
      isWeakArea: false,
      badgeText: 'High Yield',
      emoji: altSubj.emoji,
    });
  }

  // 4. Daily Diagnostic Quiz on hardest subject
  const offsetIndex = (hashString(userSeed + '_offset_2') + 1) % (weakAreasList.length || 1);
  const quizSubj = weakAreasList[offsetIndex] || weakAreasList[0];
  if (quizSubj) {
    pills.push({
      id: 'pill_quiz_' + todayKey,
      label: 'Quiz: ' + quizSubj.topic,
      prompt: 'Branco, generate a 3-question diagnostic practice quiz with step-by-step solutions for ' + quizSubj.topic + '.',
      tag: 'Quiz: ' + quizSubj.topic,
      isWeakArea: true,
      badgeText: 'Active Recall',
      emoji: '📝',
    });
  }

  // 5. Executive Study Summarizer
  pills.push({
    id: 'pill_summary_' + todayKey,
    label: 'Summarize Today’s Notes',
    prompt: 'Branco, help me summarize my study notes, extract key formulas, and generate active recall flashcards for my upcoming exam.',
    tag: 'Summarize',
    isWeakArea: false,
    badgeText: 'Study Tool',
    emoji: '⚡',
  });

  return pills;
}

export default {
  getDailyAdaptivePills,
  SUBJECT_KNOWLEDGE_BANK,
};