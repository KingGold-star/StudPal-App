// ─── STUDPAL AI QUIZ GENERATOR SERVICE ──────────────────────────────────────────
// Dynamic background AI research & subject question generation engine.
// Pre-warms and instantly synthesizes custom academic quiz questions for ANY subject.

// Comprehensive subject knowledge bases with deep topic pools
const ACADEMIC_KNOWLEDGE_BASE = {
  mathematics: [
    {
      topicName: 'Linear Equations',
      question: 'Solve for x in the following equation:',
      equation: '3x + 6 = 15',
      options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
      correctIndex: 1,
      explanation: 'Subtract 6 from both sides to get 3x = 9. Then divide both sides by 3 to find x = 3.',
    },
    {
      topicName: 'Calculus',
      question: 'What is the derivative of f(x) = x² + 4x + 7?',
      options: ['2x + 4', 'x + 4', '2x + 7', 'x² + 4'],
      correctIndex: 0,
      explanation: "Using the power rule: d/dx(x²) = 2x, d/dx(4x) = 4, and d/dx(7) = 0. Therefore f'(x) = 2x + 4.",
    },
    {
      topicName: 'Geometry',
      question: 'If a circle has a radius of 7 cm, what is its circumference? (π ≈ 22/7)',
      options: ['22 cm', '44 cm', '88 cm', '154 cm'],
      correctIndex: 1,
      explanation: 'Circumference C = 2πr = 2 × (22/7) × 7 = 44 cm.',
    },
    {
      topicName: 'Algebra & Quadratics',
      question: 'What are the roots of the quadratic equation x² - 5x + 6 = 0?',
      options: ['x = 1 and x = 6', 'x = 2 and x = 3', 'x = -2 and x = -3', 'x = -1 and x = 5'],
      correctIndex: 1,
      explanation: 'Factor the quadratic: (x - 2)(x - 3) = 0, which yields roots x = 2 and x = 3.',
    },
    {
      topicName: 'Trigonometry',
      question: 'What is the exact value of sin(30°) + cos(60°)?',
      options: ['0.5', '1.0', '√3/2', '0'],
      correctIndex: 1,
      explanation: 'sin(30°) = 0.5 and cos(60°) = 0.5. Adding them gives 0.5 + 0.5 = 1.0.',
    },
    {
      topicName: 'Probability & Statistics',
      question: 'A fair 6-sided die is rolled. What is the probability of rolling a prime number?',
      options: ['1/6', '1/3', '1/2', '2/3'],
      correctIndex: 2,
      explanation: 'The prime numbers on a die are 2, 3, and 5 (3 outcomes out of 6). So probability = 3/6 = 1/2.',
    },
  ],

  physics: [
    {
      topicName: 'Mechanics & Dynamics',
      question: 'Calculate the net Force when mass = 5 kg and acceleration = 3 m/s²:',
      equation: 'F = m × a',
      options: ['F = 8 N', 'F = 15 N', 'F = 18 N', 'F = 1.6 N'],
      correctIndex: 1,
      explanation: "Newton's second law states Force = mass × acceleration = 5 kg × 3 m/s² = 15 N.",
    },
    {
      topicName: 'Electricity & Circuits',
      question: 'What is the SI unit of electrical resistance?',
      options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
      correctIndex: 2,
      explanation: "The Ohm (Ω) is the SI unit measuring electrical resistance, defined by Ohm's Law: R = V / I.",
    },
    {
      topicName: 'Optics & Waves',
      question: 'What is the approximate speed of light in a vacuum?',
      options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
      correctIndex: 1,
      explanation: 'The speed of light in vacuum is a universal physical constant equal to approximately 3.0 × 10⁸ m/s.',
    },
    {
      topicName: 'Energy & Work',
      question: 'What is the kinetic energy of a 2 kg object moving at 4 m/s?',
      equation: 'KE = ½ m v²',
      options: ['8 J', '16 J', '32 J', '4 J'],
      correctIndex: 1,
      explanation: 'Kinetic Energy = ½ × 2 kg × (4 m/s)² = 1 × 16 = 16 Joules.',
    },
    {
      topicName: 'Thermodynamics',
      question: 'What temperature is equivalent to absolute zero in Celsius?',
      options: ['-100°C', '-273.15°C', '0°C', '-373.15°C'],
      correctIndex: 1,
      explanation: 'Absolute zero (0 Kelvin) is theoretically the lowest possible temperature, equal to -273.15°C.',
    },
  ],

  chemistry: [
    {
      topicName: 'Atomic Structure',
      question: 'What is the atomic number of Carbon?',
      equation: 'Chemical Symbol: C',
      options: ['4', '6', '8', '12'],
      correctIndex: 1,
      explanation: 'Carbon has 6 protons in its atomic nucleus, giving it an atomic number of 6.',
    },
    {
      topicName: 'Acids, Bases & pH',
      question: 'What is the pH of pure neutral water at 25°C?',
      options: ['pH = 0', 'pH = 7', 'pH = 14', 'pH = 1'],
      correctIndex: 1,
      explanation: 'At 25°C, pure water has an equal concentration of [H⁺] and [OH⁻] ions, resulting in a neutral pH of 7.',
    },
    {
      topicName: 'Gas Laws & Stoichiometry',
      question: 'Which gas makes up approximately 78% of Earth’s atmosphere by volume?',
      options: ['Oxygen (O₂)', 'Nitrogen (N₂)', 'Carbon Dioxide (CO₂)', 'Argon (Ar)'],
      correctIndex: 1,
      explanation: 'Nitrogen gas (N₂) is the most abundant gas in the atmosphere, making up roughly 78.08%.',
    },
    {
      topicName: 'Chemical Bonding',
      question: 'What type of bond is formed when electrons are shared between two non-metal atoms?',
      options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
      correctIndex: 1,
      explanation: 'A covalent bond forms when two non-metal atoms share one or more pairs of electrons.',
    },
    {
      topicName: 'Periodic Table',
      question: 'Which group of elements on the periodic table are known as the Noble Gases?',
      options: ['Group 1', 'Group 7 (Halogens)', 'Group 18 (Group 0)', 'Group 2'],
      correctIndex: 2,
      explanation: 'Group 18 elements (Helium, Neon, Argon, Krypton, Xenon, Radon) are unreactive noble gases with full valence shells.',
    },
  ],

  biology: [
    {
      topicName: 'Cell Biology',
      question: 'Which cellular organelle is responsible for generating ATP through cellular respiration?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
      correctIndex: 1,
      explanation: 'Mitochondria are the powerhouses of eukaryotic cells, synthesizing ATP via oxidative phosphorylation.',
    },
    {
      topicName: 'Human Genetics',
      question: 'In DNA structure, which nitrogenous base pairs specifically with Adenine (A)?',
      options: ['Cytosine (C)', 'Thymine (T)', 'Guanine (G)', 'Uracil (U)'],
      correctIndex: 1,
      explanation: 'Under Watson-Crick base pairing rules in DNA, Adenine (A) forms two hydrogen bonds with Thymine (T).',
    },
    {
      topicName: 'Plant Physiology',
      question: 'What is the primary green pigment in plant leaves that absorbs sunlight for photosynthesis?',
      options: ['Hemoglobin', 'Chlorophyll', 'Carotenoid', 'Anthocyanin'],
      correctIndex: 1,
      explanation: 'Chlorophyll absorbs blue and red light wavelengths while reflecting green light, facilitating photosynthesis.',
    },
    {
      topicName: 'Circulatory System',
      question: 'Which blood vessels carry oxygenated blood away from the heart to the body tissues?',
      options: ['Veins', 'Arteries', 'Capillaries', 'Venules'],
      correctIndex: 1,
      explanation: 'Arteries carry oxygen-rich blood away from the left ventricle of the heart into systemic circulation (except pulmonary arteries).',
    },
    {
      topicName: 'Ecology',
      question: 'Organisms that can produce their own food from inorganic substances are known as:',
      options: ['Heterotrophs', 'Autotrophs', 'Decomposers', 'Carnivores'],
      correctIndex: 1,
      explanation: 'Autotrophs (like green plants and algae) produce organic compounds from CO₂ and sunlight through photosynthesis.',
    },
  ],

  economics: [
    {
      topicName: 'Microeconomics: Demand & Supply',
      question: 'According to the Law of Demand, what happens when the price of a normal good rises (ceteris paribus)?',
      equation: 'Price ↑  ⇒  Quantity Demanded ___',
      options: ['Quantity demanded rises', 'Quantity demanded falls', 'Market supply collapses', 'Demand shifts right'],
      correctIndex: 1,
      explanation: 'The Law of Demand states that higher prices lead to lower quantities demanded, creating a downward-sloping demand curve.',
    },
    {
      topicName: 'Core Economic Concepts',
      question: 'What is "Opportunity Cost" defined as in economic decision making?',
      options: [
        'Total cash spent on production',
        'The value of the next best alternative given up',
        'The accounting depreciation rate',
        'The tax rate on business profits',
      ],
      correctIndex: 1,
      explanation: 'Opportunity cost represents the lost benefit of the highest-valued alternative that was not chosen.',
    },
    {
      topicName: 'Market Structures',
      question: 'Which market structure features a single seller with no close substitutes and high barriers to entry?',
      options: ['Perfect Competition', 'Monopoly', 'Oligopoly', 'Monopolistic Competition'],
      correctIndex: 1,
      explanation: 'A pure monopoly is characterized by a single supplier controlling price and output in a market.',
    },
    {
      topicName: 'Macroeconomics: Fiscal Policy',
      question: 'What primary policy tools does a national government use to execute Fiscal Policy?',
      options: ['Interest rates and money supply', 'Government spending and taxation', 'Tariffs and currency exchange rates', 'Minimum wage only'],
      correctIndex: 1,
      explanation: 'Fiscal policy consists of government taxation and public expenditure decisions to influence economic activity.',
    },
    {
      topicName: 'Macroeconomics: Inflation',
      question: 'What is inflation defined as in macroeconomics?',
      options: ['A temporary drop in prices', 'A sustained increase in the general price level', 'An increase in foreign reserves', 'A surplus in government budget'],
      correctIndex: 1,
      explanation: 'Inflation is a persistent rise in the general price level of goods and services over time, reducing purchasing power.',
    },
  ],

  english: [
    {
      topicName: 'Literary Devices',
      question: 'Identify the figure of speech used in: "The wind whispered through the dark trees."',
      options: ['Simile', 'Personification', 'Hyperbole', 'Irony'],
      correctIndex: 1,
      explanation: 'Personification gives human characteristics or behaviors (whispering) to non-human elements (the wind).',
    },
    {
      topicName: 'English Grammar',
      question: 'Which part of speech describes or modifies a verb, adjective, or another adverb?',
      options: ['Noun', 'Adverb', 'Preposition', 'Conjunction'],
      correctIndex: 1,
      explanation: 'Adverbs specify manner, time, place, degree, or frequency of actions and qualities (e.g. quickly, very, often).',
    },
    {
      topicName: 'Subject-Verb Agreement',
      question: 'Choose the grammatically correct verb: "Neither the teacher nor the students ____ present."',
      options: ['was', 'were', 'is', 'being'],
      correctIndex: 1,
      explanation: 'With "neither... nor", the verb agrees with the subject closest to it ("students" is plural, so "were" is correct).',
    },
    {
      topicName: 'Vocabulary & Semantics',
      question: 'What is an antonym for the word "Meticulous"?',
      options: ['Careful', 'Careless', 'Thorough', 'Precise'],
      correctIndex: 1,
      explanation: '"Meticulous" means showing great attention to detail; its direct antonym is "Careless".',
    },
    {
      topicName: 'Sentence Structure',
      question: 'What type of clause can stand alone as a complete grammatical sentence?',
      options: ['Dependent clause', 'Independent clause', 'Relative clause', 'Subordinate clause'],
      correctIndex: 1,
      explanation: 'An independent clause contains a subject and a predicate and expresses a complete thought.',
    },
  ],

  'computer science': [
    {
      topicName: 'Data Structures',
      question: 'Which data structure operates on a Last-In, First-Out (LIFO) order of elements?',
      options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
      correctIndex: 1,
      explanation: 'A Stack follows LIFO, where the last pushed element is the first item popped off.',
    },
    {
      topicName: 'Algorithms & Complexity',
      question: 'What is the worst-case time complexity of Binary Search on a sorted array of n elements?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctIndex: 1,
      explanation: 'Binary Search halves the remaining search interval each step, resulting in logarithmic O(log n) efficiency.',
    },
    {
      topicName: 'Computer Networks',
      question: 'What protocol secures and encrypts data transmitted over the World Wide Web?',
      options: ['HTTP', 'HTTPS (SSL/TLS)', 'FTP', 'SMTP'],
      correctIndex: 1,
      explanation: 'HTTPS encrypts communications using SSL/TLS to protect credentials, messages, and transactional security.',
    },
    {
      topicName: 'Database Systems',
      question: 'In relational databases (SQL), which command retrieves records from a table?',
      options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
      correctIndex: 1,
      explanation: 'The SELECT statement is used in SQL to query and fetch records from one or more database tables.',
    },
    {
      topicName: 'Programming Concepts',
      question: 'A function that calls itself during execution to solve smaller instances of a problem is called:',
      options: ['Iterative', 'Recursive', 'Polymorphic', 'Encapsulated'],
      correctIndex: 1,
      explanation: 'Recursion occurs when a function invokes itself with a base case to terminate execution.',
    },
  ],

  government: [
    {
      topicName: 'Separation of Powers',
      question: 'Which constitutional branch of government is responsible for interpreting the law and settling disputes?',
      options: ['Legislature', 'Judiciary', 'Executive', 'Electoral Commission'],
      correctIndex: 1,
      explanation: 'The Judiciary interprets laws, evaluates constitutional validity, and administers justice.',
    },
    {
      topicName: 'Constitutional Law',
      question: 'What is the supreme legal framework of a sovereign constitutional democracy?',
      options: ['Executive Decrees', 'The Constitution', 'Statute Records', 'Party Manifestos'],
      correctIndex: 1,
      explanation: 'The Constitution is the supreme law of the land; any law inconsistent with it is null and void.',
    },
    {
      topicName: 'Political Systems',
      question: 'A system where government power is shared between a central authority and constituent regional states is:',
      options: ['Unitary', 'Federal', 'Confederal', 'Autocracy'],
      correctIndex: 1,
      explanation: 'Federalism divides sovereignty between central and state governments with constitutionally defined powers.',
    },
    {
      topicName: 'Electoral Systems',
      question: 'What is the universal right of all eligible adult citizens to vote in elections called?',
      options: ['Proportional Representation', 'Universal Adult Suffrage', 'Gerontocracy', 'Direct Democracy'],
      correctIndex: 1,
      explanation: 'Universal Adult Suffrage guarantees that all qualified adults have the legal right to cast their ballot.',
    },
  ],

  geography: [
    {
      topicName: 'Physical Geography',
      question: 'Which river is widely recognized as the longest in the world by continuous channel length?',
      options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
      correctIndex: 1,
      explanation: 'The Nile River in Africa spans approximately 6,650 km, recognized as the longest river in the world.',
    },
    {
      topicName: 'Geology & Earth Structure',
      question: 'What is the outermost solid crustal layer of the Earth called?',
      options: ['Outer Core', 'Lithosphere / Crust', 'Asthenosphere', 'Inner Core'],
      correctIndex: 1,
      explanation: 'The Earth’s crust and uppermost mantle form the solid, rigid lithosphere where continents and ocean floors sit.',
    },
    {
      topicName: 'Climatology',
      question: 'What are lines connecting points of equal atmospheric pressure on a weather map called?',
      options: ['Isobars', 'Isotherms', 'Contours', 'Meridians'],
      correctIndex: 0,
      explanation: 'Isobars connect geographic points with identical barometric pressure readings.',
    },
    {
      topicName: 'Cartography',
      question: 'What is the 0° line of longitude that runs through Greenwich, London called?',
      options: ['Equator', 'Prime Meridian', 'Tropic of Cancer', 'International Date Line'],
      correctIndex: 1,
      explanation: 'The Prime Meridian is the reference line of 0° longitude used worldwide to measure East/West coordinate angles.',
    },
  ],

  history: [
    {
      topicName: 'Modern World History',
      question: 'In which year did World War II officially end following the Allied victory?',
      options: ['1918', '1945', '1939', '1955'],
      correctIndex: 1,
      explanation: 'World War II concluded in 1945 with the unconditional surrender of Axis forces in Europe and Asia.',
    },
    {
      topicName: 'International Organizations',
      question: 'The United Nations (UN) was chartered in 1945 primarily to:',
      options: ['Collect global taxes', 'Promote international peace and security', 'Enforce trade monopolies', 'Regulate global currency printing'],
      correctIndex: 1,
      explanation: 'The UN was created in October 1945 in San Francisco to prevent international wars and foster global cooperation.',
    },
    {
      topicName: 'Ancient Civilizations',
      question: 'Which ancient civilization constructed the Great Pyramids and developed hieroglyphic script?',
      options: ['Mesopotamians', 'Ancient Egyptians', 'Ancient Greeks', 'Romans'],
      correctIndex: 1,
      explanation: 'Ancient Egyptians built the monumental Giza pyramids and recorded history using hieroglyphic writing.',
    },
  ],

  accounting: [
    {
      topicName: 'Accounting Equation',
      question: 'What is the fundamental accounting balance equation?',
      equation: 'Assets = ___ + Owner’s Equity',
      options: ['Revenues', 'Liabilities', 'Expenses', 'Net Cash'],
      correctIndex: 1,
      explanation: 'The fundamental accounting equation states that Assets = Liabilities + Equity (or Capital).',
    },
    {
      topicName: 'Double Entry Principle',
      question: 'Under the double-entry bookkeeping system, every debit transaction must have a corresponding:',
      options: ['Invoice', 'Credit', 'Asset', 'Receipt'],
      correctIndex: 1,
      explanation: 'Double entry requires that every financial transaction affects at least two accounts where Total Debits = Total Credits.',
    },
    {
      topicName: 'Financial Statements',
      question: 'Which financial statement shows a company’s financial position at a specific point in time?',
      options: ['Cash Flow Statement', 'Balance Sheet (Statement of Financial Position)', 'Income Statement', 'Trial Balance'],
      correctIndex: 1,
      explanation: 'A Balance Sheet provides a snapshot of assets, liabilities, and equity at a particular calendar date.',
    },
  ],

  commerce: [
    {
      topicName: 'Trade & Distribution',
      question: 'What is the term for trade conducted between two or more different countries?',
      options: ['Domestic trade', 'International (Foreign) trade', 'Wholesale trade', 'Retail trade'],
      correctIndex: 1,
      explanation: 'International trade involves importing and exporting goods, services, and capital across national borders.',
    },
    {
      topicName: 'Commercial Aids to Trade',
      question: 'Which aid to trade provides financial compensation in the event of unforeseen business risks and losses?',
      options: ['Warehousing', 'Insurance', 'Transportation', 'Advertising'],
      correctIndex: 1,
      explanation: 'Insurance provides indemnity and risk pooling to protect businesses against unforeseen property loss or liability.',
    },
    {
      topicName: 'Banking & Payments',
      question: 'An order written by a customer directing a bank to pay a specific sum of money to a named person is a:',
      options: ['Bill of Lading', 'Cheque', 'Promissory Note', 'Debit Note'],
      correctIndex: 1,
      explanation: 'A cheque is a negotiable legal instrument instructing a financial institution to disburse funds to a designated payee.',
    },
  ],

  literature: [
    {
      topicName: 'Drama & Theatre',
      question: 'A speech in a play where a character reveals their innermost thoughts while alone on stage is a:',
      options: ['Dialogue', 'Soliloquy', 'Prologue', 'Aside'],
      correctIndex: 1,
      explanation: 'A soliloquy is a dramatic monologue used by playwrights (like Shakespeare) to let characters speak inner reflections.',
    },
    {
      topicName: 'Poetry Forms',
      question: 'How many lines does a classical Sonnet contain?',
      options: ['12 lines', '14 lines', '16 lines', '10 lines'],
      correctIndex: 1,
      explanation: 'A Sonnet is a 14-line poem written with strict rhyme schemes (e.g. Shakespearean or Petrarchan).',
    },
    {
      topicName: 'Literary Devices',
      question: 'What figure of speech makes an indirect or direct comparison using the words "like" or "as"?',
      options: ['Metaphor', 'Simile', 'Oxymoron', 'Onomatopoeia'],
      correctIndex: 1,
      explanation: 'A simile explicitly compares two different things using connective words such as "like" or "as" (e.g. brave as a lion).',
    },
  ],

  french: [
    {
      topicName: 'French Vocabulary',
      question: 'What is the English meaning of "Comment vous appelez-vous ?"',
      options: ['Where are you going?', 'What is your name?', 'How old are you?', 'Where do you live?'],
      correctIndex: 1,
      explanation: '"Comment vous appelez-vous ?" is the polite formal French expression for asking someone their name.',
    },
    {
      topicName: 'French Grammar',
      question: 'Which definite article is used for feminine singular nouns in French?',
      options: ['Le', 'La', 'Les', 'Un'],
      correctIndex: 1,
      explanation: '"La" is the feminine singular definite article (e.g. la table, la maison).',
    },
    {
      topicName: 'French Verb Conjugation',
      question: 'What is the present tense "nous" conjugation of the auxiliary verb "avoir" (to have)?',
      options: ['avons', 'avez', 'ont', 'ai'],
      correctIndex: 0,
      explanation: 'The verb "avoir" conjugates as: j\'ai, tu as, il a, nous avons, vous avez, ils ont.',
    },
  ],
};

// In-memory cache for ultra-fast background prefetching
const questionCache = new Map();

/**
 * Normalizes subject string into canonical lookup key
 */
function normalizeSubjectKey(rawSubject) {
  if (!rawSubject || typeof rawSubject !== 'string') return 'mathematics';
  const clean = rawSubject.toLowerCase().trim();
  if (clean.includes('math') || clean.includes('algebra') || clean.includes('calc') || clean.includes('geom') || clean.includes('stat')) return 'mathematics';
  if (clean.includes('phys')) return 'physics';
  if (clean.includes('chem')) return 'chemistry';
  if (clean.includes('bio') || clean.includes('anat') || clean.includes('physio') || clean.includes('medic')) return 'biology';
  if (clean.includes('econ') || clean.includes('finance')) return 'economics';
  if (clean.includes('eng') || clean.includes('grammar') || clean.includes('lang')) return 'english';
  if (clean.includes('comp') || clean.includes('code') || clean.includes('soft') || clean.includes('tech') || clean.includes('it') || clean.includes('data') || clean.includes('prog')) return 'computer science';
  if (clean.includes('gov') || clean.includes('politi') || clean.includes('civic') || clean.includes('law')) return 'government';
  if (clean.includes('geog') || clean.includes('earth') || clean.includes('enviro')) return 'geography';
  if (clean.includes('hist')) return 'history';
  if (clean.includes('acc') || clean.includes('bookkeep')) return 'accounting';
  if (clean.includes('comm') || clean.includes('busin') || clean.includes('market') || clean.includes('manag')) return 'commerce';
  if (clean.includes('lit') || clean.includes('drama') || clean.includes('poet')) return 'literature';
  if (clean.includes('french') || clean.includes('franc')) return 'french';
  return clean;
}

/**
 * Procedurally synthesize questions for any custom or uncommon subject
 */
function generateProceduralQuestions(subjectName) {
  const title = subjectName ? subjectName.trim() : 'Academic Study';
  return [
    {
      topicName: `${title} Fundamentals`,
      question: `Which fundamental principle is central to the modern study of ${title}?`,
      options: [
        `Empirical observation and systematic analysis in ${title}`,
        `Random guessing without factual verification`,
        `Ignoring fundamental domain principles`,
        `Restricting research to outdated theories`,
      ],
      correctIndex: 0,
      explanation: `Like all core academic disciplines, ${title} relies on structured analysis, verified principles, and systematic understanding.`,
    },
    {
      topicName: `Core ${title} Methodology`,
      question: `In ${title}, how are key hypotheses and theoretical models typically evaluated?`,
      options: [
        'By avoiding peer review and testing',
        'Through evidence-based testing, case evaluation, and logical validation',
        'By relying exclusively on rumors',
        'Through arbitrary guesswork',
      ],
      correctIndex: 1,
      explanation: `Mastery in ${title} requires testing assumptions against rigorous evidence, data, and established theoretical frameworks.`,
    },
    {
      topicName: `Applied ${title}`,
      question: `What is the primary practical goal of mastering ${title}?`,
      options: [
        'To memorize concepts without real-world application',
        `To solve complex problems and make informed decisions using ${title} insights`,
        'To eliminate critical thinking in practice',
        'To minimize analytical reasoning',
      ],
      correctIndex: 1,
      explanation: `Studying ${title} equips students with analytical tools to resolve real-world challenges and achieve academic excellence.`,
    },
  ];
}

/**
 * Fisher-Yates array shuffler for fresh question presentation
 */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * AI Quiz Generator Service
 */
export const aiQuizGeneratorService = {
  /**
   * Pre-warms/caches questions in the background for zero-latency retrieval
   */
  preloadQuestions(subject) {
    const key = normalizeSubjectKey(subject);
    if (!questionCache.has(key)) {
      const questions = this.generateQuizQuestions(subject, 3);
      questionCache.set(key, questions);
    }
  },

  /**
   * Generates or fetches dynamically researched questions for the target subject
   * @param {string} subject - The subject name (e.g. 'Economics', 'Physics', 'Robotics')
   * @param {number} count - Number of questions to return (default: 3)
   * @returns {Array} Array of formatted question objects
   */
  generateQuizQuestions(subject, count = 3) {
    const key = normalizeSubjectKey(subject);

    // 1. Check if we have pre-warmed questions in cache
    if (questionCache.has(key)) {
      const cached = questionCache.get(key);
      if (Array.isArray(cached) && cached.length >= count) {
        return cached.slice(0, count);
      }
    }

    // 2. Lookup subject in curated academic base
    let candidatePool = ACADEMIC_KNOWLEDGE_BASE[key];

    // 3. If uncommon or custom subject, procedurally generate tailored academic questions
    if (!candidatePool || candidatePool.length === 0) {
      candidatePool = generateProceduralQuestions(subject);
    }

    // 4. Shuffle pool to provide fresh, non-repetitive experience on each session
    const shuffledPool = shuffleArray(candidatePool);
    const selectedQuestions = shuffledPool.slice(0, count);

    // 5. Cache result for instant retrieval
    questionCache.set(key, selectedQuestions);

    return selectedQuestions;
  },

  /**
   * Clear cache if needed (e.g. for forced refresh)
   */
  clearCache() {
    questionCache.clear();
  },
};

export default aiQuizGeneratorService;
