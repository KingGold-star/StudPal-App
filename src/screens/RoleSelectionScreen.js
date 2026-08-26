import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { Colors } from '../theme/colors';

const StudentIcon = ({ size = 22, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <Path d="M6 12v5c3 3 9 3 12 0v-5" />
  </Svg>
);

const ParentIcon = ({ size = 22, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const EducatorIcon = ({ size = 22, color = '#2D62FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <Path d="M9 7h6" />
    <Path d="M9 11h4" />
  </Svg>
);

const roles = [
  {
    id: 'student',
    IconComponent: StudentIcon,
    title: 'Student / Scholar',
    tag: 'Primary Workspace',
    description: 'Master subjects, tackle adaptive quizzes, track spaced repetition queues, and accelerate your academic goals.',
  },
  {
    id: 'parent',
    IconComponent: ParentIcon,
    title: 'Parent / Guardian',
    tag: 'Family Overview',
    description: "Monitor study consistency, celebrate milestones, and support your child's academic journey.",
  },
  {
    id: 'educator',
    IconComponent: EducatorIcon,
    title: 'Educator / Instructor',
    tag: 'Classroom',
    description: 'Structure custom revision modules, analyze topic mastery, and guide student performance.',
  },
];

export default function RoleSelectionScreen({ onContinue, onBack }) {
  const [selectedRole, setSelectedRole] = useState('student');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Header onBack={onBack} showBack={true} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.topSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>STEP 1 OF 2</Text>
          </View>

          <Text style={styles.title}>Select Account Type</Text>
          <Text style={styles.subtitle}>
            We'll customize your study workspace, AI tools, and dashboard metrics to match your focus.
          </Text>
        </View>

        <View style={styles.cardsList}>
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;
            const Icon = r.IconComponent;

            return (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => setSelectedRole(r.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                  <Icon size={22} color={isSelected ? Colors.accent : '#64748B'} />
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{r.title}</Text>
                    <View style={[styles.tagPill, isSelected && styles.tagPillSelected]}>
                      <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                        {r.tag}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardDesc}>{r.description}</Text>
                </View>

                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footerSection}>
          <PrimaryButton
            title="Continue"
            onPress={() => onContinue(selectedRole)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  topSection: {
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(45, 98, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
  },
  cardsList: {
    gap: 12,
    marginVertical: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
    backgroundColor: '#F8FAFC',
    shadowColor: Colors.accent,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: 'rgba(45, 98, 255, 0.1)',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagPillSelected: {
    backgroundColor: 'rgba(45, 98, 255, 0.12)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tagTextSelected: {
    color: Colors.accent,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  radioCircleSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  footerSection: {
    marginTop: 18,
    paddingTop: 6,
  },
});

