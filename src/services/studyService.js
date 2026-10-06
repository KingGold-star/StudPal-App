// ─── STUDPAL STUDY SERVICE ───────────────────────────────────────────────────
// Central service linking SRS Flashcards, Quizzes, Notes, and Topic Mastery.
import { getLocalizedCards, getLocalizedQuizzes } from "./i18n/studyContentTranslations.js";

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
    questionCount: 10,
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
      {
        id: "qm3-4",
        question: "What choice of u should be used for evaluating ∫ ln(x) dx using integration by parts?",
        options: ["u = 1", "u = ln(x)", "u = x", "u = 1/x"],
        correctIndex: 1,
        explanation: "According to LIATE, Logarithmic functions come first, so u = ln(x) and dv = dx.",
      },
      {
        id: "qm3-5",
        question: "What is the derivative of u = arctan(x) when integrating ∫ arctan(x) dx by parts?",
        options: ["du = 1/(1+x²) dx", "du = sec²(x) dx", "du = 1/x dx", "du = tan(x) dx"],
        correctIndex: 0,
        explanation: "The derivative of arctan(x) is 1/(1+x²). Setting u = arctan(x) gives du = 1/(1+x²) dx.",
      },
      {
        id: "qm3-6",
        question: "Evaluate ∫ x · cos(x) dx using integration by parts.",
        options: ["x · sin(x) + cos(x) + C", "x · sin(x) - cos(x) + C", "-x · sin(x) + cos(x) + C", "x · cos(x) - sin(x) + C"],
        correctIndex: 0,
        explanation: "With u = x and dv = cos(x)dx: u·v - ∫v du = x·sin(x) - ∫sin(x)dx = x·sin(x) + cos(x) + C.",
      },
      {
        id: "qm3-7",
        question: "When setting up Integration by Parts for ∫ x² · sin(x) dx, what is dv equal to if u = x²?",
        options: ["dv = sin(x) dx", "dv = x² dx", "dv = cos(x) dx", "dv = 2x dx"],
        correctIndex: 0,
        explanation: "If u = x², the remaining term dv must be sin(x) dx.",
      },
      {
        id: "qm3-8",
        question: "What product rule of differentiation is Integration by Parts derived from?",
        options: ["d/dx [u · v] = u'v + uv'", "d/dx [u / v] = (u'v - uv')/v²", "d/dx [f(g(x))] = f'(g(x))g'(x)", "d/dx [x^n] = n x^(n-1)"],
        correctIndex: 0,
        explanation: "Integrating both sides of d/dx [u·v] = u·dv/dx + v·du/dx produces the integration by parts formula.",
      },
      {
        id: "qm3-9",
        question: "How many times must Integration by Parts be applied to integrate ∫ x² · e^x dx?",
        options: ["1 time", "2 times", "3 times", "It cannot be integrated"],
        correctIndex: 1,
        explanation: "Since u = x² has a degree of 2, taking derivatives twice reduces it to a constant, requiring 2 applications.",
      },
      {
        id: "qm3-10",
        question: "Evaluate ∫ ln(x) dx using Integration by Parts.",
        options: ["x · ln(x) - x + C", "ln(x) / x + C", "x · ln(x) + x + C", "1/x + C"],
        correctIndex: 0,
        explanation: "With u = ln(x) and dv = dx: u·v - ∫v du = x·ln(x) - ∫ x · (1/x) dx = x·ln(x) - x + C.",
      },
    ],
  },
  {
    id: "q-p3",
    subjectId: "physics",
    topicId: "p3",
    topicName: "Electromagnetism & Flux",
    title: "Electromagnetism & Faraday's Law Quiz",
    questionCount: 10,
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
      {
        id: "qp3-4",
        question: "What is the formula for magnetic flux Φ through a planar loop of area A in uniform magnetic field B?",
        options: ["Φ = B · A · cos(θ)", "Φ = B / A", "Φ = B · A · sin(θ)", "Φ = I · R"],
        correctIndex: 0,
        explanation: "Magnetic flux is defined as Φ = B · A · cos(θ), where θ is the angle relative to the surface normal.",
      },
      {
        id: "qp3-5",
        question: "What angle θ between magnetic field vectors and normal vector maximizes magnetic flux?",
        options: ["0°", "45°", "90°", "180°"],
        correctIndex: 0,
        explanation: "Since cos(0°) = 1, magnetic flux is maximized when field lines are perpendicular to the loop surface (θ = 0°).",
      },
      {
        id: "qp3-6",
        question: "If a stationary conductor is placed in a constant, unchanging magnetic field, what is the induced EMF?",
        options: ["0 Volts", "Maximum Volts", "Infinite Volts", "Depends on area only"],
        correctIndex: 0,
        explanation: "EMF requires a change in magnetic flux over time (dΦ/dt). For a static field and loop, dΦ/dt = 0.",
      },
      {
        id: "qp3-7",
        question: "What device uses Faraday's principle of electromagnetic induction to generate mechanical movement into electricity?",
        options: ["Electric generator", "Resistor", "Capacitor", "Diode"],
        correctIndex: 0,
        explanation: "Electric generators rotate wire loops inside magnetic fields to continuously change magnetic flux and produce current.",
      },
      {
        id: "qp3-8",
        question: "What is the SI unit of magnetic field strength B?",
        options: ["Tesla (T)", "Weber (Wb)", "Volt (V)", "Ampere (A)"],
        correctIndex: 0,
        explanation: "Magnetic field B is measured in Tesla (T), equivalent to Wb/m².",
      },
      {
        id: "qp3-9",
        question: "According to Lenz's law, the magnetic field produced by an induced current:",
        options: ["Opposes the change in magnetic flux that produced it", "Amplifies the change in magnetic flux", "Points perpendicular to magnetic flux", "Is always zero"],
        correctIndex: 0,
        explanation: "Lenz's Law ensures conservation of energy by resisting the change in magnetic flux.",
      },
      {
        id: "qp3-10",
        question: "What happens to induced EMF if the magnetic flux through a circuit doubles in half the time?",
        options: ["Increases by factor of 4", "Doubles", "Halves", "Remains unchanged"],
        correctIndex: 0,
        explanation: "EMF = ΔΦ / Δt. Doubling ΔΦ and halving Δt yields (2 ΔΦ) / (0.5 Δt) = 4 × (ΔΦ/Δt).",
      },
    ],
  },
  {
    id: "q-c3",
    subjectId: "chemistry",
    topicId: "c3",
    topicName: "Organic Chemistry Mechanisms",
    title: "Reaction Mechanisms Check",
    questionCount: 10,
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
      {
        id: "qc3-4",
        question: "Which intermediate is formed during an SN1 reaction mechanism?",
        options: ["Carbocation intermediate", "Pentavalent transition state only", "Free radical", "Carbanion"],
        correctIndex: 0,
        explanation: "SN1 involves step-wise cleavage of leaving group forming a planar trigonal carbocation intermediate.",
      },
      {
        id: "qc3-5",
        question: "What type of solvent best accelerates an SN2 reaction?",
        options: ["Polar aprotic solvent (e.g. Acetone, DMSO)", "Polar protic solvent (e.g. H2O, Ethanol)", "Nonpolar solvent", "Acidic solvent"],
        correctIndex: 0,
        explanation: "Polar aprotic solvents solvate cations without hydrogen bonding to nucleophiles, leaving nucleophiles unencumbered for SN2 attack.",
      },
      {
        id: "qc3-6",
        question: "What is the rate law for an SN1 substitution reaction?",
        options: ["Rate = k[Substrate]", "Rate = k[Substrate][Nucleophile]", "Rate = k[Nucleophile]", "Rate = k[Substrate]²"],
        correctIndex: 0,
        explanation: "SN1 is unimolecular; the rate depends only on the concentration of the alkyl halide substrate.",
      },
      {
        id: "qc3-7",
        question: "Which alkyl halide is most reactive toward an SN2 mechanism?",
        options: ["CH3-Br (Methyl bromide)", "Primary alkyl halide", "Secondary alkyl halide", "Tertiary alkyl halide"],
        correctIndex: 0,
        explanation: "Methyl halides experience minimal steric hindrance, offering unhindered backside attack for SN2.",
      },
      {
        id: "qc3-8",
        question: "What stereochemical outcome is expected in an SN1 reaction at a chiral center?",
        options: ["Racemization (mixture of enantiomers)", "Complete inversion", "100% Retention", "No reaction"],
        correctIndex: 0,
        explanation: "Planar carbocation intermediate can be attacked by nucleophiles equally from top or bottom face, giving racemization.",
      },
      {
        id: "qc3-9",
        question: "What is the rate-determining step in an SN1 reaction?",
        options: ["Loss of leaving group to form carbocation", "Nucleophilic attack on carbocation", "Deprotonation step", "Backside attack"],
        correctIndex: 0,
        explanation: "Formation of high-energy carbocation intermediate by leaving group dissociation is slow and rate-limiting.",
      },
      {
        id: "qc3-10",
        question: "Which of the following is a strong nucleophile favoring SN2 reactions?",
        options: ["Iodide ion (I-)", "Water (H2O)", "Methanol (CH3OH)", "Acetic acid"],
        correctIndex: 0,
        explanation: "Iodide ion (I-) is a powerful nucleophile due to high polarizability, favoring SN2 substitution.",
      },
    ],
  },
  {
    id: "q-b1",
    subjectId: "biology",
    topicId: "b1",
    topicName: "Cellular Respiration & ATP",
    title: "Cellular Respiration & Bioenergetics Quiz",
    questionCount: 10,
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
      {
        id: "qb1-4",
        question: "Where in the cell does Glycolysis occur?",
        options: ["Cytosol (Cytoplasm)", "Mitochondrial matrix", "Inner mitochondrial membrane", "Lysosome"],
        correctIndex: 0,
        explanation: "Glycolysis takes place in the cytosol of the cell without requiring oxygen.",
      },
      {
        id: "qb1-5",
        question: "What enzyme complex drives ATP synthesis using the proton electrochemical gradient across the inner membrane?",
        options: ["ATP Synthase", "Rubisco", "DNA Polymerase", "Amylase"],
        correctIndex: 0,
        explanation: "Protons flowing down their concentration gradient through ATP Synthase provide energy to phosphorylate ADP into ATP.",
      },
      {
        id: "qb1-6",
        question: "What 3-carbon molecule is the end product of Glycolysis?",
        options: ["Pyruvate", "Acetyl-CoA", "Oxaloacetate", "Glucose"],
        correctIndex: 0,
        explanation: "One 6-carbon glucose molecule is broken down into two 3-carbon pyruvate molecules during glycolysis.",
      },
      {
        id: "qb1-7",
        question: "How many turns of the Krebs (Citric Acid) Cycle occur per 1 molecule of glucose?",
        options: ["1 turn", "2 turns", "3 turns", "4 turns"],
        correctIndex: 1,
        explanation: "Since glucose yields 2 Acetyl-CoA molecules, the Krebs Cycle turns twice per original glucose molecule.",
      },
      {
        id: "qb1-8",
        question: "What high-energy electron carriers donate electrons to the Electron Transport Chain?",
        options: ["NADH and FADH2", "ATP and ADP", "DNA and RNA", "Glucose and Pyruvate"],
        correctIndex: 0,
        explanation: "NADH and FADH2 carry high-energy electrons harvested from glycolysis and Krebs cycle to the ETC.",
      },
      {
        id: "qb1-9",
        question: "What byproduct is formed when oxygen accepts electrons at the end of the ETC?",
        options: ["Water (H2O)", "Carbon dioxide (CO2)", "Lactic acid", "Glucose"],
        correctIndex: 0,
        explanation: "Oxygen accepts 2 electrons and 2 H+ protons to form water (H2O).",
      },
      {
        id: "qb1-10",
        question: "In human muscle cells during anaerobic exertion, what process regenerates NAD+ from NADH?",
        options: ["Lactic acid fermentation", "Alcoholic fermentation", "Oxidative phosphorylation", "Krebs cycle"],
        correctIndex: 0,
        explanation: "When oxygen is lacking, pyruvate is reduced to lactic acid to recycle NAD+ needed for glycolysis to continue.",
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

  // Synchronize user subjects from onboarding or workspace
  syncUserSubjects(userSubjectsList) {
    if (!Array.isArray(userSubjectsList) || userSubjectsList.length === 0) return;

    const SUBJECT_PRESETS = {
      math: { id: "math", name: "Mathematics", iconEmoji: "⚛️", color: "#6236FF", bg: "#F0EEFF", topics: [{ id: "m1", name: "Limits & Continuity", mastery: 92 }, { id: "m2", name: "Derivatives & Chain Rule", mastery: 88 }, { id: "m3", name: "Integration by Parts", mastery: 62 }, { id: "m4", name: "Differential Equations", mastery: 84 }] },
      mathematics: { id: "math", name: "Mathematics", iconEmoji: "⚛️", color: "#6236FF", bg: "#F0EEFF", topics: [{ id: "m1", name: "Limits & Continuity", mastery: 92 }, { id: "m2", name: "Derivatives & Chain Rule", mastery: 88 }, { id: "m3", name: "Integration by Parts", mastery: 62 }, { id: "m4", name: "Differential Equations", mastery: 84 }] },
      physics: { id: "physics", name: "Physics", iconEmoji: "🧪", color: "#10B981", bg: "#E8FDF0", topics: [{ id: "p1", name: "Kinematics & Motion", mastery: 90 }, { id: "p2", name: "Newton's Laws & Dynamics", mastery: 82 }, { id: "p3", name: "Electromagnetism & Flux", mastery: 64 }, { id: "p4", name: "Thermodynamics", mastery: 70 }] },
      chemistry: { id: "chemistry", name: "Chemistry", iconEmoji: "🧫", color: "#F97316", bg: "#FFF3E8", topics: [{ id: "c1", name: "Atomic Structure & Bonding", mastery: 85 }, { id: "c2", name: "Stoichiometry & Reactions", mastery: 74 }, { id: "c3", name: "Organic Chemistry Mechanisms", mastery: 55 }, { id: "c4", name: "Chemical Equilibrium", mastery: 60 }] },
      biology: { id: "biology", name: "Biology", iconEmoji: "🧬", color: "#3B82F6", bg: "#EBF5FF", topics: [{ id: "b1", name: "Cellular Respiration & ATP", mastery: 88 }, { id: "b2", name: "Genetics & DNA Replication", mastery: 80 }, { id: "b3", name: "Ecology & Ecosystems", mastery: 75 }] },
      english: { id: "english", name: "English Language", iconEmoji: "📖", color: "#EC4899", bg: "#FDF2F8", topics: [{ id: "e1", name: "Grammar & Syntax Rules", mastery: 75 }, { id: "e2", name: "Essays & Argumentation", mastery: 60 }] },
      cs: { id: "cs", name: "Computer Science", iconEmoji: "💻", color: "#8B5CF6", bg: "#F5F3FF", topics: [{ id: "cs1", name: "Data Structures & Big-O", mastery: 82 }, { id: "cs2", name: "Algorithms & Recursion", mastery: 78 }, { id: "cs3", name: "Computer Networks", mastery: 70 }] },
      'computer science': { id: "cs", name: "Computer Science", iconEmoji: "💻", color: "#8B5CF6", bg: "#F5F3FF", topics: [{ id: "cs1", name: "Data Structures & Big-O", mastery: 82 }, { id: "cs2", name: "Algorithms & Recursion", mastery: 78 }, { id: "cs3", name: "Computer Networks", mastery: 70 }] },
      economics: { id: "economics", name: "Economics", iconEmoji: "📈", color: "#0284C7", bg: "#F0F9FF", topics: [{ id: "ec1", name: "Price Elasticity of Demand", mastery: 80 }, { id: "ec2", name: "Fiscal & Monetary Policy", mastery: 75 }, { id: "ec3", name: "Market Structures", mastery: 62 }] },
      government: { id: "government", name: "Government", iconEmoji: "🏛️", color: "#2563EB", bg: "#EFF6FF", topics: [{ id: "g1", name: "Separation of Powers & Judiciary", mastery: 85 }, { id: "g2", name: "Constitutional Law", mastery: 72 }, { id: "g3", name: "Federalism & Electoral Systems", mastery: 65 }] },
      geography: { id: "geography", name: "Geography", iconEmoji: "🌍", color: "#059669", bg: "#ECFDF5", topics: [{ id: "gg1", name: "Plate Tectonics & Landforms", mastery: 88 }, { id: "gg2", name: "Atmospheric Circulation & Climate", mastery: 70 }] },
      history: { id: "history", name: "History", iconEmoji: "📜", color: "#D97706", bg: "#FFFBEB", topics: [{ id: "h1", name: "World War II & Global Order", mastery: 85 }, { id: "h2", name: "Ancient Civilizations", mastery: 74 }] },
      literature: { id: "literature", name: "Literature", iconEmoji: "📚", color: "#9333EA", bg: "#FAF5FF", topics: [{ id: "l1", name: "Poetic Forms & Meter", mastery: 82 }, { id: "l2", name: "Dramatic Irony & Theatre", mastery: 70 }] },
      french: { id: "french", name: "French", iconEmoji: "🇫🇷", color: "#4F46E5", bg: "#EEF2FF", topics: [{ id: "f1", name: "Passé Composé & Imparfait", mastery: 78 }, { id: "f2", name: "Vocabulary & Direct Objects", mastery: 65 }] },
      accounting: { id: "accounting", name: "Accounting", iconEmoji: "📊", color: "#16A34A", bg: "#F0FDF4", topics: [{ id: "a1", name: "Balance Sheet & Ledger", mastery: 80 }, { id: "a2", name: "Double Entry Accounting", mastery: 70 }] },
      commerce: { id: "commerce", name: "Commerce", iconEmoji: "💼", color: "#EA580C", bg: "#FFF7ED", topics: [{ id: "cm1", name: "International Trade", mastery: 78 }, { id: "cm2", name: "Commercial Banking & Insurance", mastery: 68 }] },
    };

    const synced = [];
    userSubjectsList.forEach((subjStr, idx) => {
      const clean = String(subjStr).toLowerCase().trim();
      let matched = SUBJECT_PRESETS[clean];
      if (!matched) {
        // Find by partial match
        const foundKey = Object.keys(SUBJECT_PRESETS).find(k => clean.includes(k) || k.includes(clean));
        matched = foundKey ? SUBJECT_PRESETS[foundKey] : null;
      }

      if (matched) {
        synced.push({ ...matched });
      } else {
        // Custom Subject
        const cleanName = String(subjStr).trim();
        synced.push({
          id: `custom_${idx}_${cleanName.toLowerCase().replace(/\s+/g, '_')}`,
          name: cleanName,
          iconEmoji: "📚",
          color: idx % 3 === 0 ? "#6236FF" : idx % 3 === 1 ? "#2563EB" : "#10B981",
          bg: idx % 3 === 0 ? "#F0EEFF" : idx % 3 === 1 ? "#EFF6FF" : "#E8FDF0",
          topics: [
            { id: `top_${idx}_1`, name: `${cleanName} Fundamentals`, mastery: 85 },
            { id: `top_${idx}_2`, name: `Core ${cleanName} Principles`, mastery: 70 },
            { id: `top_${idx}_3`, name: `Applied ${cleanName} Problem Solving`, mastery: 60 },
          ],
        });
      }
    });

    if (synced.length > 0) {
      this.subjects = synced;

      // Auto-provision SRS cards and Quizzes for synced subjects if not already present
      synced.forEach((subj) => {
        const hasCards = this.cards.some((c) => c.subjectId === subj.id);
        if (!hasCards && Array.isArray(subj.topics) && subj.topics.length > 0) {
          subj.topics.forEach((top, tIdx) => {
            this.cards.push({
              id: `srs_${subj.id}_${top.id || tIdx}`,
              subjectId: subj.id,
              topicId: top.id,
              category: `${subj.name.toUpperCase()} - ${top.name.toUpperCase()}`,
              question: `Explain the fundamental concept of ${top.name} in ${subj.name}.`,
              hint: `Focus on core definitions, principles, and applications of ${top.name}.`,
              answer: `${top.name} constitutes a cornerstone principle in ${subj.name}, focusing on fundamental mechanisms and problem-solving techniques.`,
              explanation: `Mastering ${top.name} enables students to solve advanced analytical problems in ${subj.name}.`,
              takeaway: `Review key formulas, definitions, and active examples of ${top.name}.`,
              priority: tIdx === 0 ? "high" : "normal",
              isDue: true,
            });
          });
        }

        const hasQuiz = this.quizzes.some((q) => q.subjectId === subj.id);
        if (!hasQuiz && Array.isArray(subj.topics) && subj.topics.length > 0) {
          const mainTopic = subj.topics[0];
          this.quizzes.push({
            id: `q-${subj.id}`,
            subjectId: subj.id,
            topicId: mainTopic.id,
            topicName: mainTopic.name,
            title: `${subj.name}: ${mainTopic.name} Practice Quiz`,
            questionCount: 3,
            questions: [
              {
                id: `q_${subj.id}_1`,
                question: `What is the primary objective of studying ${mainTopic.name} in ${subj.name}?`,
                options: [
                  `To understand core foundational principles of ${mainTopic.name}`,
                  `To memorize isolated facts without conceptual understanding`,
                  `To replace fundamental theory with unverified assumptions`,
                  `None of the above`,
                ],
                correctIndex: 0,
                explanation: `Understanding the core principles of ${mainTopic.name} provides the foundation for advanced mastery in ${subj.name}.`,
              },
              {
                id: `q_${subj.id}_2`,
                question: `Which approach is most effective when analyzing problems in ${mainTopic.name}?`,
                options: [
                  `Systematic breakdown into first principles and step-by-step reasoning`,
                  `Guessing without checking boundary conditions`,
                  `Ignoring problem constraints and definitions`,
                  `Memorizing only the final answer`,
                ],
                correctIndex: 0,
                explanation: `A systematic first-principles breakdown guarantees accurate and reproducible solutions.`,
              },
              {
                id: `q_${subj.id}_3`,
                question: `How does mastery of ${mainTopic.name} benefit broader studies in ${subj.name}?`,
                options: [
                  `It builds strong analytical intuition and accelerates recall`,
                  `It narrows focus and eliminates other subjects`,
                  `It is only useful for basic definitions`,
                  `It has no cross-topic applications`,
                ],
                correctIndex: 0,
                explanation: `Foundational mastery accelerates knowledge retention and enables seamless cross-topic problem solving.`,
              },
            ],
          });
        }
      });
    }
  }

  getSubjects() {
    return this.subjects;
  }

  // ── SRS & CARDS ──────────────────────────────────────────────────────────
  getDueCardsCount() {
    return this.cards.filter((c) => c.isDue).length;
  }

  getCardsForReview(subjectId = null, topicId = null, lang = 'en') {
    const raw = this.cards.filter((c) => {
      if (subjectId && c.subjectId !== subjectId) return false;
      if (topicId && c.topicId !== topicId) return false;
      return true;
    });
    return getLocalizedCards(raw, lang);
  }

  // ── QUIZZES ──────────────────────────────────────────────────────────────
  getAvailableQuizzes(subjectId = null, topicId = null, lang = 'en') {
    const raw = this.quizzes.filter((q) => {
      if (subjectId && q.subjectId !== subjectId) return false;
      if (topicId && q.topicId !== topicId) return false;
      return true;
    });
    return getLocalizedQuizzes(raw, lang);
  }

  getRecentQuizAvg() {
    if (this.quizAttempts.length === 0) return 80;
    const sum = this.quizAttempts.reduce((acc, a) => acc + a.score, 0);
    return Math.round(sum / this.quizAttempts.length);
  }

  recordQuizAttempt({
    quizId,
    subjectId,
    topicId,
    topicName,
    score,
    correctCount,
    totalQuestions,
    durationSeconds = 60,
    answers = {},
    questions = [],
    xpEarned = 25,
  }) {
    let previousMastery = 50;
    let newMastery = 50;

    const subj = this.subjects.find((s) => s.id === subjectId);
    if (subj) {
      const top = subj.topics ? subj.topics.find((t) => t.id === topicId) : null;
      if (top) {
        previousMastery = top.mastery !== undefined ? top.mastery : 50;
        top.mastery = Math.min(100, Math.max(20, Math.round(previousMastery * 0.7 + score * 0.3)));
        newMastery = top.mastery;
      }
    }

    const attempt = {
      id: `attempt-${Date.now()}`,
      quizId,
      subjectId,
      topicId,
      topicName,
      score,
      correctCount,
      totalQuestions,
      durationSeconds,
      answers,
      questions,
      previousMastery,
      newMastery,
      masteryDelta: newMastery - previousMastery,
      xpEarned,
      date: Date.now(),
    };
    this.quizAttempts.unshift(attempt);

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
    const list = this.notes.filter((n) => {
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

    return list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }

  togglePinNote(noteId) {
    const idx = this.notes.findIndex((n) => n.id === noteId);
    if (idx !== -1) {
      this.notes[idx].isPinned = !this.notes[idx].isPinned;
      return this.notes[idx];
    }
    return null;
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
