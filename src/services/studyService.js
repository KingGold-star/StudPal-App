// ─── STUDPAL STUDY SERVICE ───────────────────────────────────────────────────
// Central service linking SRS Flashcards, Quizzes, Notes, and Topic Mastery.

export const INITIAL_STUDY_SUBJECTS = [
  {
    id: "math",
    name: "Mathematics",
    iconEmoji: "⚛️",
    color: "#6236FF",
    bg: "#F0EEFF",
    topics: [
      { id: "m1", name: "Limits & Continuity", mastery: 92 },
      { id: "m2", name: "Derivatives & Chain Rule", mastery: 88 },
      { id: "m3", name: "Integration by Parts", mastery: 62 }, // Weak topic
      { id: "m4", name: "Differential Equations", mastery: 84 },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    iconEmoji: "🧪",
    color: "#10B981",
    bg: "#E8FDF0",
    topics: [
      { id: "p1", name: "Kinematics & Motion", mastery: 90 },
      { id: "p2", name: "Newton's Laws & Dynamics", mastery: 82 },
      { id: "p3", name: "Electromagnetism & Flux", mastery: 64 }, // Weak topic
      { id: "p4", name: "Thermodynamics", mastery: 70 },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    iconEmoji: "🧫",
    color: "#F97316",
    bg: "#FFF3E8",
    topics: [
      { id: "c1", name: "Atomic Structure & Bonding", mastery: 85 },
      { id: "c2", name: "Stoichiometry & Reactions", mastery: 74 },
      { id: "c3", name: "Organic Chemistry Mechanisms", mastery: 55 }, // Weak topic
      { id: "c4", name: "Chemical Equilibrium", mastery: 60 },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    iconEmoji: "🧬",
    color: "#3B82F6",
    bg: "#EBF5FF",
    topics: [
      { id: "b1", name: "Cellular Respiration & ATP", mastery: 88 },
      { id: "b2", name: "Genetics & DNA Replication", mastery: 80 },
      { id: "b3", name: "Ecology & Ecosystems", mastery: 75 },
    ],
  },
  {
    id: "english",
    name: "English Language",
    iconEmoji: "📖",
    color: "#EC4899",
    bg: "#FDF2F8",
    topics: [
      { id: "e1", name: "Grammar & Syntax Rules", mastery: 75 },
      { id: "e2", name: "Essays & Argumentation", mastery: 60 },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    iconEmoji: "💻",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    topics: [
      { id: "cs1", name: "Data Structures & Big-O", mastery: 82 },
      { id: "cs2", name: "Algorithms & Recursion", mastery: 78 },
    ],
  },
];

export const INITIAL_SRS_CARDS = [
  {
    id: "1",
    subjectId: "math",
    topicId: "m2",
    category: "DERIVATIVES & CHAIN RULE",
    question: "What is the derivative of f(x) = sin(x²) with respect to x?",
    hint: "Use the Chain Rule: d/dx [f(g(x))] = f'(g(x)) · g'(x). Outer is sin(u), inner u = x².",
    answer: "f'(x) = 2x · cos(x²)",
    explanation: "1. Outer derivative: d/du [sin(u)] = cos(u).\n2. Inner derivative: d/dx [x²] = 2x.\n3. Multiply: f'(x) = 2x · cos(x²).",
    takeaway: "Always multiply by the derivative of the inner function when using chain rule.",
    priority: "normal",
    isDue: true,
  },
  {
    id: "2",
    subjectId: "math",
    topicId: "m3",
    category: "INTEGRATION BY PARTS",
    question: "What is the formula for Integration by Parts?",
    hint: "Think of LIATE rule for choosing u and dv.",
    answer: "∫ u dv = u·v - ∫ v du",
    explanation: "Derived directly from the product rule of differentiation: d/dx(u·v) = u'v + uv'. Integrating both sides yields ∫ u dv = u·v - ∫ v du.",
    takeaway: "Choose u in order of LIATE: Logarithmic, Inverse Trig, Algebraic, Trigonometric, Exponential.",
    priority: "high", // Struggled topic
    isDue: true,
  },
  {
    id: "3",
    subjectId: "math",
    topicId: "m1",
    category: "LIMITS & L'HÔPITAL'S RULE",
    question: "When can you apply L'Hôpital's Rule to evaluate lim (x→a) [f(x)/g(x)]?",
    hint: "Applies only to indeterminate forms.",
    answer: "Only when the limit produces an indeterminate form 0/0 or ∞/∞.",
    explanation: "If lim f(x)/g(x) results in 0/0 or ±∞/±∞, then lim [f(x)/g(x)] = lim [f'(x)/g'(x)], provided the derivative limit exists.",
    takeaway: "Check that the form is strictly 0/0 or ∞/∞ BEFORE taking derivatives of top and bottom.",
    priority: "normal",
    isDue: true,
  },
  {
    id: "4",
    subjectId: "physics",
    topicId: "p3",
    category: "ELECTROMAGNETISM",
    question: "What is Faraday's Law of Electromagnetic Induction?",
    hint: "Relates induced EMF to magnetic flux change.",
    answer: "Ɛ = -N · (dΦ_B / dt)",
    explanation: "The induced electromotive force (EMF) in a closed circuit equals the negative rate of change of magnetic flux through the circuit.",
    takeaway: "The negative sign (Lenz's Law) indicates that induced current opposes the change in magnetic flux.",
    priority: "high",
    isDue: true,
  },
  {
    id: "5",
    subjectId: "physics",
    topicId: "p1",
    category: "PHYSICS - KINEMATICS",
    question: "What is the kinematic equation relating velocity, acceleration, and distance without time?",
    hint: "It involves v squared.",
    answer: "v² = v₀² + 2aΔx",
    explanation: "Derived from substituting time t = (v - v₀)/a into displacement equation Δx = v₀t + ½at².",
    takeaway: "Use this equation when time is not given and not requested.",
    priority: "normal",
    isDue: true,
  },
  {
    id: "6",
    subjectId: "math",
    topicId: "m4",
    category: "DIFFERENTIAL EQUATIONS",
    question: "What is the general solution to the differential equation y' = k·y?",
    hint: "It represents exponential growth or decay.",
    answer: "y(t) = C·e^(kt)",
    explanation: "Separating variables gives dy/y = k dt. Integrating yields ln|y| = kt + C, which exponentiates to y = C·e^(kt).",
    takeaway: "Rate of change is proportional to current amount, leading to exponential behavior.",
    priority: "normal",
    isDue: true,
  },
  {
    id: "7",
    subjectId: "chemistry",
    topicId: "c3",
    category: "ORGANIC CHEMISTRY MECHANISMS",
    question: "What distinguishes SN1 from SN2 substitution reactions?",
    hint: "Think about steps, carbocation intermediate, and stereochemistry.",
    answer: "SN1 is two steps with carbocation intermediate (racemization). SN2 is one concerted step (inversion of configuration).",
    explanation: "SN1 rate depends only on substrate concentration [R-X]. SN2 rate depends on both substrate and nucleophile [R-X][Nu-].",
    takeaway: "Tertiary substrates favor SN1; primary substrates favor SN2.",
    priority: "high",
    isDue: true,
  },
  {
    id: "8",
    subjectId: "biology",
    topicId: "b1",
    category: "CELLULAR RESPIRATION",
    question: "How many net ATP molecules are produced per glucose in aerobic respiration?",
    hint: "Glycolysis + Krebs Cycle + Electron Transport Chain.",
    answer: "Approximately 30 to 32 ATP molecules.",
    explanation: "Glycolysis yields 2 ATP, Krebs cycle yields 2 ATP, and Oxidative Phosphorylation yields 26-28 ATP.",
    takeaway: "Oxygen acts as the final electron acceptor in the electron transport chain.",
    priority: "normal",
    isDue: true,
  },
];

export const SAMPLE_QUIZZES = [
  {
    id: "q-m3",
    subjectId: "math",
    topicId: "m3",
    topicName: "Integration by Parts",
    title: "Integration by Parts Mastery Quiz",
    questionCount: 3,
    questions: [
      {
        id: "qm3-1",
        question: "In applying Integration by Parts to ∫ x·e^x dx, which choice of u is best according to LIATE?",
        options: ["u = e^x", "u = x", "u = x·e^x", "u = 1"],
        correctIndex: 1,
        explanation: "Algebraic functions (x) come before Exponential functions (e^x) in LIATE, so set u = x.",
      },
      {
        id: "qm3-2",
        question: "What is the result of evaluating ∫ x·e^x dx?",
        options: ["x·e^x - e^x + C", "x·e^x + e^x + C", "e^x/x + C", "x²·e^x / 2 + C"],
        correctIndex: 0,
        explanation: "∫ x·e^x dx = x·e^x - ∫ e^x dx = x·e^x - e^x + C = e^x(x - 1) + C.",
      },
      {
        id: "qm3-3",
        question: "Which equation represents the tabular method for repeated integration by parts?",
        options: ["Alternating signs (+/-) multiplying derivative of u and integral of dv", "Adding derivatives continuously", "Multiplying all terms by x", "None of the above"],
        correctIndex: 0,
        explanation: "Tabular method differentiates polynomial u to 0 while integrating dv, taking alternating diagonal products.",
      },
    ],
  },
  {
    id: "q-p3",
    subjectId: "physics",
    topicId: "p3",
    topicName: "Electromagnetism & Flux",
    title: "Electromagnetism & Faraday's Law Quiz",
    questionCount: 3,
    questions: [
      {
        id: "qp3-1",
        question: "What does the negative sign in Faraday's Law Ɛ = -dΦ/dt signify?",
        options: ["Ohm's Law", "Lenz's Law", "Ampere's Law", "Gauss's Law"],
        correctIndex: 1,
        explanation: "Lenz's Law states that the induced current flows in a direction that opposes the change in magnetic flux.",
      },
      {
        id: "qp3-2",
        question: "What is the SI unit of magnetic flux?",
        options: ["Tesla (T)", "Weber (Wb)", "Henry (H)", "Farad (F)"],
        correctIndex: 1,
        explanation: "1 Weber (Wb) = 1 Tesla · m².",
      },
      {
        id: "qp3-3",
        question: "How can you increase the induced voltage in a solenoid?",
        options: ["Increase number of turns N", "Increase rate of change of magnetic flux", "Use a stronger magnet", "All of the above"],
        correctIndex: 3,
        explanation: "Induced voltage Ɛ = -N (dΦ/dt). Increasing N, B strength, or speed of movement increases voltage.",
      },
    ],
  },
  {
    id: "q-c3",
    subjectId: "chemistry",
    topicId: "c3",
    topicName: "Organic Chemistry Mechanisms",
    title: "Reaction Mechanisms Check",
    questionCount: 3,
    questions: [
      {
        id: "qc3-1",
        question: "Which factor strongly favors an SN1 reaction mechanism over SN2?",
        options: ["Primary substrate", "Strong nucleophile", "Tertiary substrate and polar protic solvent", "Aprotic solvent"],
        correctIndex: 2,
        explanation: "Tertiary substrates form stable carbocations, and polar protic solvents stabilize the ionic transition state in SN1.",
      },
      {
        id: "qc3-2",
        question: "What stereochemical outcome occurs in a pure SN2 reaction?",
        options: ["Complete inversion of configuration (Walden inversion)", "Racemization (50% R, 50% S)", "No change in configuration", "Retention of configuration"],
        correctIndex: 0,
        explanation: "Backside attack in SN2 causes complete inversion of stereocenter configuration.",
      },
      {
        id: "qc3-3",
        question: "What is the rate law for an SN2 substitution reaction?",
        options: ["Rate = k[Substrate]", "Rate = k[Substrate][Nucleophile]", "Rate = k[Nucleophile]", "Rate = k[Substrate]²"],
        correctIndex: 1,
        explanation: "SN2 is bimolecular nucleophilic substitution, depending on both substrate and nucleophile concentrations.",
      },
    ],
  },
  {
    id: "q-b1",
    subjectId: "biology",
    topicId: "b1",
    topicName: "Cellular Respiration & ATP",
    title: "Cellular Respiration & Bioenergetics Quiz",
    questionCount: 3,
    questions: [
      {
        id: "qb1-1",
        question: "Where in the mitochondrion does the Electron Transport Chain take place?",
        options: ["Outer membrane", "Mitochondrial matrix", "Inner mitochondrial membrane (cristae)", "Intermembrane space"],
        correctIndex: 2,
        explanation: "Protein complexes of the ETC are embedded in the inner mitochondrial membrane.",
      },
      {
        id: "qb1-2",
        question: "What is the net yield of ATP from 1 molecule of glucose in Glycolysis alone?",
        options: ["2 ATP", "4 ATP", "32 ATP", "36 ATP"],
        correctIndex: 0,
        explanation: "Glycolysis produces 4 ATP gross but consumes 2 ATP, yielding 2 ATP net.",
      },
      {
        id: "qb1-3",
        question: "What molecule acts as the final electron acceptor in aerobic respiration?",
        options: ["NAD+", "FAD", "Oxygen (O2)", "Pyruvate"],
        correctIndex: 2,
        explanation: "Oxygen combines with electrons and protons to form water (H2O) at the end of the electron transport chain.",
      },
    ],
  },
];

export const INITIAL_NOTES = [
  {
    id: "note-1",
    title: "Integration by Parts Strategy & LIATE",
    subjectId: "math",
    topicId: "m3",
    subjectName: "Mathematics",
    topicName: "Integration by Parts",
    content: `## Formula
∫ u dv = u·v - ∫ v du

## LIATE Choice Hierarchy
Choose **u** based on which function appears higher in LIATE:
1. **L**ogarithmic: ln(x), log(x)
2. **I**nverse Trig: arctan(x), arcsin(x)
3. **A**lgebraic: x, x², 3x³
4. **T**rigonometric: sin(x), cos(x)
5. **E**xponential: e^x, 2^x

## Example: ∫ x · cos(x) dx
- Let u = x → du = dx
- Let dv = cos(x) dx → v = sin(x)
- Apply formula: x·sin(x) - ∫ sin(x) dx = x·sin(x) + cos(x) + C`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
  },
  {
    id: "note-2",
    title: "Faraday's Law & Lenz's Law Notes",
    subjectId: "physics",
    topicId: "p3",
    subjectName: "Physics",
    topicName: "Electromagnetism & Flux",
    content: `## Magnetic Flux Formula
Φ_B = B · A · cos(θ)
Where B is magnetic field, A is surface area, θ is angle relative to normal.

## Faraday's Law
Ɛ = -N (dΦ_B / dt)

## Lenz's Law Key Principle
The induced current creates a magnetic field that opposes the change in flux that caused it.`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
  {
    id: "note-3",
    title: "SN1 vs SN2 Substitution Cheat Sheet",
    subjectId: "chemistry",
    topicId: "c3",
    subjectName: "Chemistry",
    topicName: "Organic Chemistry Mechanisms",
    content: `## SN1 (Substitution Nucleophilic Unimolecular)
- Rate = k[R-X] (1st order)
- 2 steps with Carbocation intermediate
- Substrate preference: 3° > 2° >> 1°
- Solvent: Polar Protic (H2O, MeOH, EtOH)
- Stereochemistry: Racemization

## SN2 (Substitution Nucleophilic Bimolecular)
- Rate = k[R-X][Nu-] (2nd order)
- 1 concerted step with backside attack
- Substrate preference: CH3 > 1° > 2° >> 3°
- Solvent: Polar Aprotic (DMSO, Acetone, DMF)
- Stereochemistry: Complete Inversion`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
  },
  {
    id: "note-4",
    title: "Cellular Respiration ATP Summary",
    subjectId: "biology",
    topicId: "b1",
    subjectName: "Biology",
    topicName: "Cellular Respiration & ATP",
    content: `## 4 Stages of Aerobic Respiration
1. Glycolysis (Cytosol): Glucose → 2 Pyruvate + 2 ATP + 2 NADH
2. Pyruvate Oxidation (Matrix): 2 Pyruvate → 2 Acetyl-CoA + 2 NADH + 2 CO2
3. Krebs Cycle (Matrix): 2 Acetyl-CoA → 2 ATP + 6 NADH + 2 FADH2 + 4 CO2
4. Electron Transport Chain (Inner Membrane): 28-30 ATP via Oxidative Phosphorylation`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
  },
];

// ─── CLASS SERVICE INSTANCE ──────────────────────────────────────────────────
class StudyService {
  constructor() {
    this.subjects = INITIAL_STUDY_SUBJECTS;
    this.cards = INITIAL_SRS_CARDS;
    this.quizzes = SAMPLE_QUIZZES;
    this.notes = INITIAL_NOTES;
    this.quizAttempts = [
      {
        id: "attempt-1",
        quizId: "q-m3",
        topicId: "m3",
        topicName: "Integration by Parts",
        subjectId: "math",
        score: 66,
        correctCount: 2,
        totalQuestions: 3,
        date: Date.now() - 1000 * 60 * 60 * 24 * 1,
      },
    ];
  }

  // ── SRS & CARDS ──────────────────────────────────────────────────────────
  getDueCardsCount() {
    return this.cards.filter((c) => c.isDue).length;
  }

  getCardsForReview(subjectId = null, topicId = null) {
    return this.cards.filter((c) => {
      if (subjectId && c.subjectId !== subjectId) return false;
      if (topicId && c.topicId !== topicId) return false;
      return true;
    });
  }

  // ── QUIZZES ──────────────────────────────────────────────────────────────
  getAvailableQuizzes(subjectId = null, topicId = null) {
    return this.quizzes.filter((q) => {
      if (subjectId && q.subjectId !== subjectId) return false;
      if (topicId && q.topicId !== topicId) return false;
      return true;
    });
  }

  getRecentQuizAvg() {
    if (this.quizAttempts.length === 0) return 80;
    const sum = this.quizAttempts.reduce((acc, a) => acc + a.score, 0);
    return Math.round(sum / this.quizAttempts.length);
  }

  recordQuizAttempt({ quizId, subjectId, topicId, topicName, score, correctCount, totalQuestions }) {
    const attempt = {
      id: `attempt-${Date.now()}`,
      quizId,
      subjectId,
      topicId,
      topicName,
      score,
      correctCount,
      totalQuestions,
      date: Date.now(),
    };
    this.quizAttempts.unshift(attempt);

    // Update topic mastery
    this.updateTopicMastery(subjectId, topicId, score);

    // If score < 70%, boost SRS card priorities for this topic
    if (score < 70) {
      this.boostSrsCardPriorityForTopic(topicId);
    }

    return attempt;
  }

  updateTopicMastery(subjectId, topicId, quizScore) {
    const subj = this.subjects.find((s) => s.id === subjectId);
    if (subj) {
      const top = subj.topics.find((t) => t.id === topicId);
      if (top) {
        // Weighted adjustment: 70% existing + 30% quiz score
        top.mastery = Math.min(100, Math.max(20, Math.round(top.mastery * 0.7 + quizScore * 0.3)));
      }
    }
  }

  boostSrsCardPriorityForTopic(topicId) {
    this.cards.forEach((c) => {
      if (c.topicId === topicId) {
        c.priority = "high";
        c.isDue = true;
      }
    });
  }

  // ── NOTES ────────────────────────────────────────────────────────────────
  getNotes(subjectId = null, topicId = null, searchQuery = "") {
    return this.notes.filter((n) => {
      if (subjectId && n.subjectId !== subjectId) return false;
      if (topicId && n.topicId !== topicId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchTopic = n.topicName?.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchTopic) return false;
      }
      return true;
    });
  }

  saveNote({ id, title, subjectId, topicId, content }) {
    const subj = this.subjects.find((s) => s.id === subjectId);
    const top = subj?.topics.find((t) => t.id === topicId);
    const subjectName = subj ? subj.name : "General";
    const topicName = top ? top.name : "General Notes";

    if (id) {
      // Edit
      const idx = this.notes.findIndex((n) => n.id === id);
      if (idx !== -1) {
        this.notes[idx] = {
          ...this.notes[idx],
          title,
          subjectId,
          topicId,
          subjectName,
          topicName,
          content,
          updatedAt: Date.now(),
        };
        return this.notes[idx];
      }
    }

    // Create
    const newNote = {
      id: `note-${Date.now()}`,
      title,
      subjectId,
      topicId,
      subjectName,
      topicName,
      content,
      updatedAt: Date.now(),
    };
    this.notes.unshift(newNote);
    return newNote;
  }

  deleteNote(noteId) {
    this.notes = this.notes.filter((n) => n.id !== noteId);
  }

  // ── SMART RECOMMENDATIONS ─────────────────────────────────────────────────
  getSmartRecommendations() {
    const recs = [];

    // 1. Check for due cards
    const dueCount = this.getDueCardsCount();
    if (dueCount > 0) {
      recs.push({
        id: "rec-due",
        type: "review",
        title: `${dueCount} flashcards due for review today`,
        reason: "Maintain your SM-2 memory retention curve",
        actionText: "Review Now",
        targetView: "review",
      });
    }

    // 2. Check for weak topics (< 70% mastery)
    const weakTopics = [];
    this.subjects.forEach((s) => {
      s.topics.forEach((t) => {
        if (t.mastery < 70) {
          weakTopics.push({ subject: s, topic: t });
        }
      });
    });

    if (weakTopics.length > 0) {
      const target = weakTopics[0];
      recs.push({
        id: `rec-weak-${target.topic.id}`,
        type: "quiz",
        title: `Struggled with ${target.topic.name}`,
        reason: `Your topic mastery is ${target.topic.mastery}%. Take a targeted quiz to strengthen it.`,
        actionText: "Take Quiz",
        targetView: "quiz",
        subjectId: target.subject.id,
        topicId: target.topic.id,
      });
    }

    // 3. High mastery topic recommendation
    const strongTopics = [];
    this.subjects.forEach((s) => {
      s.topics.forEach((t) => {
        if (t.mastery >= 85) {
          strongTopics.push({ subject: s, topic: t });
        }
      });
    });

    if (strongTopics.length > 0) {
      const strongTarget = strongTopics[0];
      recs.push({
        id: `rec-strong-${strongTarget.topic.id}`,
        type: "quiz",
        title: `Test your knowledge: ${strongTarget.topic.name}`,
        reason: `You've achieved ${strongTarget.topic.mastery}% mastery. Lock in your recall with a quiz.`,
        actionText: "Start Test",
        targetView: "quiz",
        subjectId: strongTarget.subject.id,
        topicId: strongTarget.topic.id,
      });
    }

    // 4. Notes check
    if (this.notes.length > 0) {
      const oldestNote = [...this.notes].sort((a, b) => a.updatedAt - b.updatedAt)[0];
      recs.push({
        id: "rec-notes",
        type: "notes",
        title: `Review notes: ${oldestNote.title}`,
        reason: "You haven't reviewed these notes recently.",
        actionText: "Open Notes",
        targetView: "notes",
        subjectId: oldestNote.subjectId,
        topicId: oldestNote.topicId,
      });
    }

    return recs;
  }
}

export const studyService = new StudyService();
