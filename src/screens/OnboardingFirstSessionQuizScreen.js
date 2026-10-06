import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import aiQuizGeneratorService from '../services/aiQuizGeneratorService.js';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

function ChevronLeftIcon({ size = 20, color = '#0F172A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 22, color = '#10B981' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Path d="M22 4L12 14.01l-3-3" />
    </Svg>
  );
}

function AlertTriangleIcon({ size = 22, color = '#EF4444' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <Path d="M12 9v4" />
      <Path d="M12 17h.01" />
    </Svg>
  );
}

const SUBJECT_QUIZ_DATA = {
  economics: [
    {
      topicName: 'Law of Demand',
      question: 'What is the law of demand?',
      equation: 'Price ↑  ⇒  Quantity Demanded ___',
      options: [
        'Quantity Demanded ↑',
        'Quantity Demanded ↓',
        'Supply increases',
        'Price remains constant',
      ],
      correctIndex: 1,
      explanation: 'According to the law of demand, ceteris paribus, when the price of a good increases, the quantity demanded decreases.',
    },
    {
      topicName: 'Opportunity Cost',
      question: 'What is opportunity cost defined as?',
      options: [
        'Total monetary expenditure',
        'The value of the next best alternative foregone',
        'The fixed cost of industrial production',
        'Annual accounting depreciation',
      ],
      correctIndex: 1,
      explanation: 'Opportunity cost represents the potential benefits an individual, investor, or business misses out on when choosing one alternative over another.',
    },
    {
      topicName: 'Market Structures',
      question: 'Which market structure is characterized by a single supplier with no close substitutes?',
      options: [
        'Perfect Competition',
        'Monopoly',
        'Oligopoly',
        'Monopolistic Competition',
      ],
      correctIndex: 1,
      explanation: 'A monopoly exists when a single company dominates an entire market with high barriers to entry and unique products.',
    },
  ],
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
      explanation: 'Applying the power rule: d/dx(x²) = 2x, d/dx(4x) = 4, and d/dx(7) = 0. So f\'(x) = 2x + 4.',
    },
    {
      topicName: 'Geometry',
      question: 'If a circle has a radius of 7 cm, what is its circumference? (π ≈ 22/7)',
      options: ['22 cm', '44 cm', '88 cm', '154 cm'],
      correctIndex: 1,
      explanation: 'Circumference C = 2πr = 2 × (22/7) × 7 = 44 cm.',
    },
  ],
  math: [
    {
      topicName: 'Linear Equations',
      question: 'Solve for x in the following equation:',
      equation: '3x + 6 = 15',
      options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
      correctIndex: 1,
      explanation: 'Subtract 6 from both sides: 3x = 9, then divide by 3: x = 3.',
    },
    {
      topicName: 'Calculus',
      question: 'What is the derivative of f(x) = x² + 4x + 7?',
      options: ['2x + 4', 'x + 4', '2x + 7', 'x² + 4'],
      correctIndex: 0,
      explanation: 'Using power rule: d/dx(x²) = 2x, d/dx(4x) = 4, constant 7 becomes 0.',
    },
    {
      topicName: 'Geometry',
      question: 'If a circle has a radius of 7 cm, what is its circumference? (π ≈ 22/7)',
      options: ['22 cm', '44 cm', '88 cm', '154 cm'],
      correctIndex: 1,
      explanation: 'Circumference C = 2πr = 2 × (22/7) × 7 = 44 cm.',
    },
  ],
  physics: [
    {
      topicName: 'Mechanics',
      question: 'Calculate Force (F = m × a):',
      equation: 'mass = 5 kg,  acceleration = 3 m/s²',
      options: ['F = 8 N', 'F = 15 N', 'F = 18 N', 'F = 1.6 N'],
      correctIndex: 1,
      explanation: "Newton's second law: Force = mass × acceleration = 5 kg × 3 m/s² = 15 N.",
    },
    {
      topicName: 'Electricity',
      question: 'What is the SI unit of electrical current?',
      options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
      correctIndex: 1,
      explanation: 'The Ampere (A) is the base SI unit measuring electric current flow.',
    },
    {
      topicName: 'Optics',
      question: 'What is the approximate speed of light in a vacuum?',
      options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
      correctIndex: 1,
      explanation: 'The universal constant speed of light in vacuum is approximately 3.0 × 10⁸ m/s.',
    },
  ],
  chemistry: [
    {
      topicName: 'Atomic Structure',
      question: 'What is the atomic number of Carbon?',
      equation: 'Atomic Symbol: C',
      options: ['4', '6', '8', '12'],
      correctIndex: 1,
      explanation: 'Carbon has 6 protons in its nucleus, giving it an atomic number of 6.',
    },
    {
      topicName: 'Acids & Bases',
      question: 'What is the pH value of pure neutral water at 25°C?',
      options: ['0', '7', '14', '1'],
      correctIndex: 1,
      explanation: 'Pure water has an equal balance of hydrogen and hydroxide ions, resulting in a neutral pH of 7.',
    },
    {
      topicName: 'Atmospheric Chemistry',
      question: "Which gas is the most abundant in Earth's atmosphere?",
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      correctIndex: 1,
      explanation: 'Nitrogen gas (N₂) accounts for roughly 78% of Earth\'s atmosphere.',
    },
  ],
  biology: [
    {
      topicName: 'Cell Biology',
      question: 'What is known as the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
      correctIndex: 1,
      explanation: 'Mitochondria generate cellular energy in the form of Adenosine Triphosphate (ATP).',
    },
    {
      topicName: 'Human Physiology',
      question: 'Which blood type is considered the universal red cell donor?',
      options: ['Type A', 'Type B', 'Type AB', 'Type O-negative'],
      correctIndex: 3,
      explanation: 'Type O-negative blood lacks A, B, and Rh antigens, minimizing immune reaction risks.',
    },
    {
      topicName: 'Plant Biology',
      question: 'Which primary pigment is responsible for absorbing light in photosynthesis?',
      options: ['Hemoglobin', 'Chlorophyll', 'Carotenoid', 'Melanin'],
      correctIndex: 1,
      explanation: 'Chlorophyll absorbs blue and red wavelengths of light while reflecting green.',
    },
  ],
  english: [
    {
      topicName: 'Literary Devices',
      question: 'Identify the figure of speech in this sentence:',
      equation: '"The wind whispered through the dark trees"',
      options: ['Simile', 'Personification', 'Hyperbole', 'Irony'],
      correctIndex: 1,
      explanation: 'Personification attributes human qualities (whispering) to non-human objects or nature (the wind).',
    },
    {
      topicName: 'Grammar',
      question: 'Which part of speech modifies a verb, adjective, or another adverb?',
      options: ['Noun', 'Adverb', 'Preposition', 'Conjunction'],
      correctIndex: 1,
      explanation: 'Adverbs describe how, when, where, or to what extent an action or quality occurs.',
    },
    {
      topicName: 'Subject-Verb Concord',
      question: 'Choose the correct form: "Neither the teacher nor the students ____ present."',
      options: ['was', 'were', 'is', 'being'],
      correctIndex: 1,
      explanation: 'In \'neither... nor\' structures, the verb agrees with the closest subject (\'students\' is plural → \'were\').',
    },
  ],
  literature: [
    {
      topicName: 'Literary Devices',
      question: 'Identify the figure of speech:',
      equation: '"The wind whispered through the dark trees"',
      options: ['Simile', 'Personification', 'Hyperbole', 'Irony'],
      correctIndex: 1,
      explanation: 'Personification gives human traits and emotions to inanimate things.',
    },
    {
      topicName: 'Poetry Terms',
      question: 'What is a poem of 14 lines with a structured rhyme scheme called?',
      options: ['Ballad', 'Sonnet', 'Elegy', 'Ode'],
      correctIndex: 1,
      explanation: 'A sonnet is a classic poetic form consisting of exactly 14 rhymed lines.',
    },
    {
      topicName: 'Drama',
      question: 'A speech where a character speaks their thoughts aloud alone on stage is a:',
      options: ['Dialogue', 'Soliloquy', 'Prologue', 'Epilogue'],
      correctIndex: 1,
      explanation: 'A soliloquy is used in drama for characters to reveal inner thoughts to the audience.',
    },
  ],
  government: [
    {
      topicName: 'Separation of Powers',
      question: 'Which organ of government is primarily responsible for interpreting the law?',
      options: ['Legislature', 'Judiciary', 'Executive', 'Civil Service'],
      correctIndex: 1,
      explanation: 'The Judiciary interprets laws, settles legal disputes, and protects constitutional rights.',
    },
    {
      topicName: 'Constitutional Law',
      question: 'What is the supreme law of a constitutional democratic state?',
      options: ['Statute Books', 'The Constitution', 'Executive Decrees', 'Common Law'],
      correctIndex: 1,
      explanation: 'The Constitution is the ultimate legal framework that supersedes all other laws and acts.',
    },
    {
      topicName: 'Systems of Government',
      question: 'A system where power is constitutionally shared between central and regional governments is:',
      options: ['Unitary', 'Federal', 'Confederal', 'Autocratic'],
      correctIndex: 1,
      explanation: 'A federal system divides powers between federal and state/provincial governments.',
    },
  ],
  'computer science': [
    {
      topicName: 'Data Structures',
      question: 'Which data structure operates on a Last-In, First-Out (LIFO) basis?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctIndex: 1,
      explanation: 'A stack uses LIFO order, where the last element inserted is the first one removed.',
    },
    {
      topicName: 'Algorithms',
      question: 'What is the time complexity of searching a sorted array using Binary Search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctIndex: 1,
      explanation: 'Binary search halves the search space each step, achieving logarithmic O(log n) time complexity.',
    },
    {
      topicName: 'Web & Networking',
      question: 'What protocol is standard for secure encrypted web traffic communication?',
      options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
      correctIndex: 1,
      explanation: 'HTTPS encrypts communications using SSL/TLS protocols to protect data integrity and privacy.',
    },
  ],
  geography: [
    {
      topicName: 'Physical Geography',
      question: 'What is the longest river in the world by continuous flow length?',
      options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
      correctIndex: 1,
      explanation: 'The Nile River is widely recognized as the longest river in the world at approximately 6,650 km.',
    },
    {
      topicName: 'Earth Structure',
      question: 'Which layer is the outermost rigid solid shell of the Earth?',
      options: ['Outer Core', 'Crust', 'Mantle', 'Inner Core'],
      correctIndex: 1,
      explanation: 'The Earth\'s crust is the outermost solid tectonic layer where life and terrain exist.',
    },
    {
      topicName: 'Climate',
      question: 'Which lines on a map represent locations of equal atmospheric pressure?',
      options: ['Isobars', 'Isotherms', 'Contour Lines', 'Meridians'],
      correctIndex: 0,
      explanation: 'Isobars connect points of equal atmospheric pressure on meteorological maps.',
    },
  ],
  history: [
    {
      topicName: 'World History',
      question: 'In which year did World War II officially conclude?',
      options: ['1918', '1945', '1939', '1950'],
      correctIndex: 1,
      explanation: 'World War II concluded in 1945 following the surrender of Axis powers.',
    },
    {
      topicName: 'Ancient Civilizations',
      question: 'Which ancient civilization built the Great Pyramids of Giza?',
      options: ['Mesopotamians', 'Ancient Egyptians', 'Greeks', 'Romans'],
      correctIndex: 1,
      explanation: 'The Pyramids of Giza were built during ancient Egypt\'s Old Kingdom period.',
    },
    {
      topicName: 'Modern History',
      question: 'The United Nations (UN) was established in 1945 following which major event?',
      options: ['The Cold War', 'World War II', 'The Industrial Revolution', 'World War I'],
      correctIndex: 1,
      explanation: 'The UN was created in October 1945 to foster international peace and prevent future global conflicts.',
    },
  ],
  french: [
    {
      topicName: 'Vocabulary',
      question: 'What is the English translation for "Bonjour, comment allez-vous?"',
      options: ['Goodbye, see you soon', 'Hello, how are you?', 'Thank you very much', 'Good evening, my friend'],
      correctIndex: 1,
      explanation: '"Bonjour, comment allez-vous?" is the polite standard French phrase for "Hello, how are you?".',
    },
    {
      topicName: 'Grammar',
      question: 'Which definite article is used for feminine singular nouns in French?',
      options: ['Le', 'La', 'Les', 'Un'],
      correctIndex: 1,
      explanation: '"La" is the feminine singular definite article (e.g., la maison).',
    },
    {
      topicName: 'Conjugation',
      question: 'What is the present tense "nous" form of the verb "être"?',
      options: ['sommes', 'êtes', 'sont', 'suis'],
      correctIndex: 0,
      explanation: 'The verb \'être\' (to be) conjugates as \'nous sommes\' for the first-person plural.',
    },
  ],
};

export default function OnboardingFirstSessionQuizScreen({
  onContinue,
  onBack,
  subject = 'Mathematics',
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Dynamically research and synthesize AI questions for the subject in the background
  const [questionSet] = useState(() =>
    aiQuizGeneratorService.generateQuizQuestions(subject, 3)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answersRecord, setAnswersRecord] = useState([]);
  const startTimeRef = useRef(Date.now());

  const totalQuestions = questionSet.length;
  const currentQ = questionSet[currentQuestionIndex] || questionSet[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [currentQuestionIndex]);

  const handleOptionSelect = (index) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckOrNext = () => {
    if (!isAnswerChecked) {
      if (selectedOption === null) return;
      const isCorrect = selectedOption === currentQ.correctIndex;
      setAnswersRecord((prev) => [...prev, isCorrect]);
      setIsAnswerChecked(true);
    } else {
      if (currentQuestionIndex < totalQuestions - 1) {
        fadeAnim.setValue(0);
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        const elapsedSecs = Math.max(
          1,
          Math.round((Date.now() - startTimeRef.current) / 1000)
        );
        const incorrect = answersRecord.filter((c) => !c).length;
        const correct = answersRecord.filter((c) => c).length;
        if (onContinue) {
          onContinue({
            elapsedSeconds: elapsedSecs,
            incorrectCount: incorrect,
            correctCount: correct,
            totalQuestions,
          });
        }
      }
    }
  };

  const isUserCorrect = isAnswerChecked && selectedOption === currentQ.correctIndex;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            {/* Top Progress Bar & Counter */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBarBackground, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: theme.accent,
                      width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.counterText, { color: theme.textSecondary }]}>
                {currentQuestionIndex + 1} / {totalQuestions}
              </Text>
            </View>

            {/* Question Header */}
            <View style={styles.questionSection}>
              <Text style={[styles.questionPromptText, { color: theme.textPrimary }]}>{currentQ.question}</Text>
              {currentQ.equation ? (
                <Text style={[styles.equationText, { color: theme.textPrimary }]}>{currentQ.equation}</Text>
              ) : null}
            </View>

            {/* Options List */}
            <View style={styles.quizOptionsList}>
              {currentQ.options.map((optText, optIdx) => {
                const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                const isSelected = selectedOption === optIdx;
                const isCorrectOpt = optIdx === currentQ.correctIndex;

                let cardStyle = [styles.quizOptionCard, { backgroundColor: theme.card, borderColor: theme.border }];
                let badgeStyle = [styles.quizOptionLetterBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderColor: theme.border }];
                let letterStyle = [styles.quizOptionLetterText, { color: theme.textSecondary }];
                let textStyle = [styles.quizOptionText, { color: theme.textPrimary }];

                if (!isAnswerChecked) {
                  if (isSelected) {
                    cardStyle.push(styles.quizOptionCardSelected);
                    badgeStyle.push(styles.quizOptionLetterBadgeSelected);
                    letterStyle.push(styles.quizOptionLetterTextSelected);
                    textStyle.push(styles.quizOptionTextSelected);
                  }
                } else {
                  if (isSelected && isCorrectOpt) {
                    cardStyle.push(styles.quizOptionCardCorrect);
                    badgeStyle.push(styles.quizOptionLetterBadgeCorrect);
                    letterStyle.push(styles.quizOptionLetterTextSelected);
                    textStyle.push(styles.quizOptionTextCorrect);
                  } else if (isSelected && !isCorrectOpt) {
                    cardStyle.push(styles.quizOptionCardWrong);
                    badgeStyle.push(styles.quizOptionLetterBadgeWrong);
                    letterStyle.push(styles.quizOptionLetterTextSelected);
                    textStyle.push(styles.quizOptionTextWrong);
                  } else if (!isSelected && isCorrectOpt) {
                    cardStyle.push(styles.quizOptionCardCorrectRevealed);
                    badgeStyle.push(styles.quizOptionLetterBadgeCorrect);
                    letterStyle.push(styles.quizOptionLetterTextSelected);
                    textStyle.push(styles.quizOptionTextCorrect);
                  } else {
                    cardStyle.push({ opacity: 0.45 });
                  }
                }

                return (
                  <TouchableOpacity
                    key={optIdx}
                    style={cardStyle}
                    onPress={() => handleOptionSelect(optIdx)}
                    activeOpacity={isAnswerChecked ? 1 : 0.8}
                    disabled={isAnswerChecked}
                  >
                    <View style={badgeStyle}>
                      <Text style={letterStyle}>{optionLetter}</Text>
                    </View>
                    <Text style={textStyle}>{optText}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Feedback / Explanation Box after checking answer */}
            {isAnswerChecked && (
              <View
                style={
                  isUserCorrect
                    ? styles.quizFeedbackCardCorrect
                    : styles.quizFeedbackCardWrong
                }
              >
                <View style={styles.quizFeedbackHeaderRow}>
                  {isUserCorrect ? (
                    <CheckCircleIcon size={22} color="#10B981" />
                  ) : (
                    <AlertTriangleIcon size={22} color="#EF4444" />
                  )}
                  <Text
                    style={
                      isUserCorrect
                        ? styles.quizFeedbackTitleCorrect
                        : styles.quizFeedbackTitleWrong
                    }
                  >
                    {isUserCorrect ? 'Correct Answer! 🎉' : 'Incorrect Answer'}
                  </Text>
                </View>

                {!isUserCorrect && (
                  <Text style={styles.quizFeedbackCorrectAnswerText}>
                    Correct Answer:{' '}
                    <Text style={{ fontWeight: '800' }}>
                      {String.fromCharCode(65 + currentQ.correctIndex)}. {currentQ.options[currentQ.correctIndex]}
                    </Text>
                  </Text>
                )}

                {currentQ.explanation ? (
                  <Text style={styles.quizFeedbackText}>{currentQ.explanation}</Text>
                ) : null}
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Bottom CTA Button */}
        <View style={[styles.bottomSection, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[
              styles.primaryActionBtn,
              isAnswerChecked && isUserCorrect && styles.primaryActionBtnCorrect,
              !isAnswerChecked && selectedOption === null && styles.primaryActionBtnDisabled,
            ]}
            disabled={!isAnswerChecked && selectedOption === null}
            onPress={handleCheckOrNext}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryActionBtnText}>
              {!isAnswerChecked
                ? 'check answer ➔'
                : currentQuestionIndex < totalQuestions - 1
                ? 'Next Question ➔'
                : 'View Results 🎉'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 2,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  questionPromptText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  equationText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginTop: 10,
  },
  quizOptionsList: {
    gap: 12,
    marginBottom: 18,
  },
  quizOptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quizOptionCardSelected: {
    borderColor: '#1200C6',
    backgroundColor: '#F5F3FF',
  },
  quizOptionCardCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  quizOptionCardCorrectRevealed: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  quizOptionCardWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  quizOptionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionLetterBadgeSelected: {
    backgroundColor: '#1200C6',
    borderColor: '#1200C6',
  },
  quizOptionLetterBadgeCorrect: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  quizOptionLetterBadgeWrong: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  quizOptionLetterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  quizOptionLetterTextSelected: {
    color: '#FFFFFF',
  },
  quizOptionText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    letterSpacing: -0.1,
  },
  quizOptionTextSelected: {
    color: '#1200C6',
    fontWeight: '700',
  },
  quizOptionTextCorrect: {
    color: '#059669',
    fontWeight: '800',
  },
  quizOptionTextWrong: {
    color: '#DC2626',
    fontWeight: '800',
  },
  quizFeedbackCardCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 4,
    marginBottom: 12,
  },
  quizFeedbackCardWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 4,
    marginBottom: 12,
  },
  quizFeedbackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quizFeedbackTitleCorrect: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#059669',
  },
  quizFeedbackTitleWrong: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  quizFeedbackCorrectAnswerText: {
    fontSize: 13.5,
    color: '#991B1B',
    fontWeight: '600',
    marginTop: 2,
  },
  quizFeedbackText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginTop: 4,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  primaryActionBtn: {
    width: '100%',
    backgroundColor: '#1200C6',
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1200C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionBtnCorrect: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  primaryActionBtnDisabled: {
    opacity: 0.5,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
