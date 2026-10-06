import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../theme/themeContext';
import { getOnboardingTheme } from '../theme/onboardingTheme';

const DEFAULT_SUBJECTS = [
  'Mathematics',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Government',
  'Geography',
  'History',
  'Literature',
  'Computer Science',
  'French',
];

function CheckCircleIcon({ size = 20, color = '#2563EB' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Path
        d="M8 12.5l2.5 2.5 5.5-5.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function OnboardingSubjectsScreen({
  onContinue,
  onBack,
  initialSelected = ['Mathematics', 'Economics', 'Computer Science'],
}) {
  const { isDark } = useTheme();
  const theme = getOnboardingTheme(isDark);
  const [selectedSubjects, setSelectedSubjects] = useState(
    Array.isArray(initialSelected) && initialSelected.length > 0
      ? initialSelected
      : ['Mathematics', 'Economics', 'Computer Science']
  );
  const [customSubjects, setCustomSubjects] = useState([]);
  const [otherText, setOtherText] = useState('');
  const [isEditingOther, setIsEditingOther] = useState(false);
  const textInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  // Commit any active custom subject text and deactivate input
  const commitAndDeactivateOther = () => {
    if (otherText.trim()) {
      const formatted = otherText.trim();
      if (!DEFAULT_SUBJECTS.includes(formatted) && !customSubjects.includes(formatted)) {
        setCustomSubjects((prev) => [...prev, formatted]);
      }
      if (!selectedSubjects.includes(formatted)) {
        setSelectedSubjects((prev) => [...prev, formatted]);
      }
    }
    setOtherText('');
    setIsEditingOther(false);
    Keyboard.dismiss();
  };

  const handleOutsidePress = () => {
    if (isEditingOther) {
      commitAndDeactivateOther();
    }
  };

  const toggleSubject = (subject) => {
    if (isEditingOther) {
      commitAndDeactivateOther();
    }
    setSelectedSubjects((prev) => {
      if (prev.includes(subject)) {
        return prev.filter((s) => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  const removeCustomSubject = (subjectToRemove) => {
    setCustomSubjects((prev) => prev.filter((s) => s !== subjectToRemove));
    setSelectedSubjects((prev) => prev.filter((s) => s !== subjectToRemove));
  };

  const handleContinue = () => {
    if (isEditingOther) {
      commitAndDeactivateOther();
    }
    let finalSubjects = [...selectedSubjects];
    if (otherText.trim()) {
      const formatted = otherText.trim();
      if (!finalSubjects.includes(formatted)) {
        finalSubjects.push(formatted);
      }
    }
    if (finalSubjects.length === 0) {
      finalSubjects = ['Mathematics'];
    }
    if (onContinue) {
      onContinue(finalSubjects);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress} accessible={false}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bg} translucent />

        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
          {/* Header Title & Subtitle */}
          <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>what are you studying?</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>pick at least three</Text>
          </Animated.View>

          {/* Subjects List */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={handleOutsidePress}
          >
            {/* Default standard subjects */}
            {DEFAULT_SUBJECTS.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              return (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.subjectCard,
                    {
                      backgroundColor: isSelected ? theme.cardSelected : theme.card,
                      borderColor: isSelected ? theme.cardSelectedBorder : theme.border,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleSubject(subject)}
                >
                  <Text
                    style={[
                      styles.subjectText,
                      { color: isSelected ? theme.textPrimary : theme.textSecondary },
                      isSelected && styles.subjectTextSelected,
                    ]}
                  >
                    {subject}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIconWrapper}>
                      <CheckCircleIcon size={18} color={theme.accent} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Custom subjects added by user */}
            {customSubjects.map((customSub) => {
              const isSelected = selectedSubjects.includes(customSub);
              return (
                <TouchableOpacity
                  key={customSub}
                  style={[
                    styles.subjectCard,
                    {
                      backgroundColor: isSelected ? theme.cardSelected : theme.card,
                      borderColor: isSelected ? theme.cardSelectedBorder : theme.border,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleSubject(customSub)}
                >
                  <Text
                    style={[
                      styles.subjectText,
                      { color: isSelected ? theme.textPrimary : theme.textSecondary },
                      isSelected && styles.subjectTextSelected,
                    ]}
                  >
                    {customSub}
                  </Text>
                  <View style={styles.rightIconsRow}>
                    {isSelected && (
                      <View style={styles.checkIconWrapper}>
                        <CheckCircleIcon size={18} color={theme.accent} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Dynamic Other Input / Button */}
            {isEditingOther ? (
              <View style={[styles.subjectCard, { backgroundColor: theme.cardSelected, borderColor: theme.cardSelectedBorder }]}>
                <TextInput
                  ref={textInputRef}
                  style={[styles.otherInput, { color: theme.inputText }]}
                  placeholder="Enter subject or course"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={otherText}
                  onChangeText={setOtherText}
                  onSubmitEditing={commitAndDeactivateOther}
                  returnKeyType="done"
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.checkIconWrapper}
                  onPress={commitAndDeactivateOther}
                  activeOpacity={0.7}
                >
                  <CheckCircleIcon size={20} color={theme.accent} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.subjectCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => setIsEditingOther(true)}
              >
                <Text style={[styles.subjectText, { color: theme.textSecondary }]}>other</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Bottom Continue Button (Blue when >= 3 selected, otherwise blurred/faded) */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedSubjects.length >= 3
                  ? styles.continueButtonActive
                  : styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={selectedSubjects.length < 3}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  selectedSubjects.length < 3 && styles.continueButtonTextDisabled,
                ]}
              >
                continue ➔
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '400',
    marginTop: 4,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    gap: 10,
  },
  subjectCard: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  subjectCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  },
  subjectTextSelected: {
    color: '#0F172A',
    fontWeight: '600',
  },
  checkIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  rightIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otherInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: '100%',
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  continueButtonTextDisabled: {
    color: '#94A3B8',
  },
});
