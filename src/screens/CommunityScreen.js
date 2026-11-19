// src/screens/CommunityScreen.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
  Share,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Modal from '../components/CustomModal';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import TooltipTouchable from '../components/TooltipTouchable';
import { settingsService } from '../services/settings/settingsService';
import { gamificationService } from '../services/gamification/gamificationService';
import { useTranslation, normalizeLanguageCode } from '../services/i18n/i18nService';
import { getLocalizedGroups, getLocalizedPosts, getLocalizedChallenges, getLocalizedRules, getLocalizedTimeAgo } from '../services/i18n/communityContentTranslations';
import { Colors } from '../theme/colors';
import { useTheme } from '../theme/themeContext';
import { authService } from '../services/supabase/authService';
import { communitySupabaseService } from '../services/supabase/communityService';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const SearchIcon = ({ color = '#94A3B8', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const PlusIcon = ({ color = '#FFFFFF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const CloseIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const HeartIcon = ({ color = '#64748B', size = 18, isLiked = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isLiked ? '#EF4444' : 'none'} stroke={isLiked ? '#EF4444' : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const MessageSquareIcon = ({ color = '#64748B', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

const BookmarkIcon = ({ color = '#64748B', size = 18, isBookmarked = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isBookmarked ? '#2D62FF' : 'none'} stroke={isBookmarked ? '#2D62FF' : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const UsersIcon = ({ color = '#2D62FF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const SendIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 2L11 13" />
    <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

const ChevronLeftIcon = ({ color = '#0F172A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const ChevronRightIcon = ({ color = '#94A3B8', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const VerifiedIcon = ({ color = '#2D62FF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" strokeWidth="2.5" />
  </Svg>
);

const ShieldIcon = ({ color = '#EF4444', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const LockIcon = ({ color = '#F59E0B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0110 0v4" />
  </Svg>
);

const EditPenIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

const PinIcon = ({ color = '#2563EB', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="17" x2="12" y2="22" />
    <Path d="M5 17h14v-2l-2-4V5h1V2H6v3h1v6l-2 4v2z" />
  </Svg>
);

// ─── Community Mascot Source Asset ──────────────────────────────────────────
const communityMascotSource = require('../../assets/images/community_mascot.png');

// ─── Initial Mock Data ───────────────────────────────────────────────────────
const INITIAL_GROUPS = [
  {
    id: 'grp-0',
    name: 'StudPal Global Hub',
    subject: 'All Subjects',
    membersCount: 14200,
    onlineCount: 1400,
    avatarBg: Colors.brandNavy || '#112B8A',
    avatarSource: communityMascotSource,
    joined: false,
    description: 'The official StudPal community for announcements, tips, and general chat.',
    category: 'Trending',
    isOfficial: true,
  },
  {
    id: 'grp-1',
    name: 'JAMB 2027 Aspirants',
    subject: 'Exam Prep',
    membersCount: 3200,
    avatarBg: '#2D62FF',
    joined: true,
    description: 'Daily past questions, syllabus breakdowns, and motivation for JAMB.',
    category: 'Exam Prep',
  },
  {
    id: 'grp-2',
    name: 'WAEC Science Hub',
    subject: 'Sciences',
    membersCount: 1650,
    avatarBg: '#6366F1',
    joined: false,
    description: 'Physics, Chemistry, and Biology prep for WAEC.',
    category: 'Exam Prep',
  },
  {
    id: 'grp-3',
    name: 'Mathematics Problem Solvers',
    subject: 'Mathematics',
    membersCount: 840,
    avatarBg: '#0EA5E9',
    joined: true,
    description: 'Stuck on a math problem? Drop it here and lets solve it together.',
    category: 'Subjects',
  },
  {
    id: 'grp-4',
    name: 'Deep Focus & Pomodoro Sprints',
    subject: 'Study Skills',
    membersCount: 420,
    avatarBg: '#10B981',
    joined: false,
    description: 'Join live voice channels for silent 50/10 pomodoro study sessions.',
    category: 'Study Skills',
  },
];

const DEFAULT_POST_COMMENTS = {
  'post-1': [
    { id: 'c1-1', author: 'Alex', avatarBg: '#6236FF', avatarLetter: 'A', timeAgo: '15m ago', text: 'This makes so much sense now! Thank you Sarah!' },
    { id: 'c1-2', author: 'Marcus', avatarBg: '#10B981', avatarLetter: 'M', timeAgo: '12m ago', text: 'LIATE is legendary. Saved me on the midterm calculus exam.' },
    { id: 'c1-3', author: 'Tunde W.', avatarBg: '#0EA5E9', avatarLetter: 'T', timeAgo: '10m ago', text: 'What about when you have exponential times trigonometric? Does order matter there?' },
    { id: 'c1-4', author: 'Sarah Jenkins', authorRole: 'Host', avatarBg: '#2D62FF', avatarLetter: 'S', timeAgo: '7m ago', text: 'Great question Tunde! With e^x * sin(x), you loop back to the original integral after two applications.' },
    { id: 'c1-5', author: 'Blessing A.', avatarBg: '#EC4899', avatarLetter: 'B', timeAgo: '4m ago', text: 'Mind blown 🤯 Bookmark saved!' },
  ],
  'post-2': [
    { id: 'c2-1', author: 'Sarah Jenkins', authorRole: 'Host', avatarBg: '#2D62FF', avatarLetter: 'S', timeAgo: '2h ago', text: 'Welcome everyone! So excited to have a dedicated hub for all subjects 🚀' },
    { id: 'c2-2', author: 'David O.', avatarBg: '#F59E0B', avatarLetter: 'D', timeAgo: '2h ago', text: 'When does the first global weekly challenge kick off?' },
    { id: 'c2-3', author: 'Admin Team', authorRole: 'Official', avatarSource: communityMascotSource, avatarLetter: 'S', avatarBg: '#112B8A', timeAgo: '1h ago', text: 'The first global challenge starts this Monday at 8 AM! Check the Study & Challenges tab ⚡' },
    { id: 'c2-4', author: 'Chiamaka E.', avatarBg: '#10B981', avatarLetter: 'C', timeAgo: '1h ago', text: 'The AI study rhythm planner helped me set up my weekly timetable. Glad to be here!' },
    { id: 'c2-5', author: 'Marcus V.', avatarBg: '#10B981', avatarLetter: 'M', timeAgo: '45m ago', text: 'Does anyone know if there are voice study rooms for pomodoro sprints?' },
    { id: 'c2-6', author: 'Admin Team', authorRole: 'Official', avatarSource: communityMascotSource, avatarLetter: 'S', avatarBg: '#112B8A', timeAgo: '30m ago', text: 'Yes Marcus! Live Pomodoro sprints are active under the Study Skills channels.' },
    { id: 'c2-7', author: 'Blessing A.', avatarBg: '#EC4899', avatarLetter: 'B', timeAgo: '20m ago', text: 'StudPal has completely transformed how I organize my study sessions.' },
    { id: 'c2-8', author: 'Alex', avatarBg: '#6236FF', avatarLetter: 'A', timeAgo: '10m ago', text: 'Ready to crush the weekly goals with everyone!' },
  ],
  'post-3': [
    { id: 'c3-1', author: 'Chiamaka E.', avatarBg: '#10B981', avatarLetter: 'C', timeAgo: '22h ago', text: 'Yes please David! Could you kindly share the PDF link? Preparing for JAMB next month 🙏' },
    { id: 'c3-2', author: 'David O.', authorRole: 'Author', avatarBg: '#F59E0B', avatarLetter: 'D', timeAgo: '21h ago', text: 'Here you go: drive.google.com/studpal-jamb-physics. Make sure to review the mechanics section carefully!' },
    { id: 'c3-3', author: 'Ibrahim K.', avatarBg: '#6366F1', avatarLetter: 'I', timeAgo: '19h ago', text: 'Downloaded! Thank you so much David, waves and optics questions are usually my weak point.' },
    { id: 'c3-4', author: 'Blessing A.', avatarBg: '#EC4899', avatarLetter: 'B', timeAgo: '18h ago', text: 'Are the step-by-step working solutions included as well?' },
    { id: 'c3-5', author: 'David O.', authorRole: 'Author', avatarBg: '#F59E0B', avatarLetter: 'D', timeAgo: '17h ago', text: 'Yes Blessing! Complete step-by-step working solutions for 2018-2023 are attached at the end.' },
    { id: 'c3-6', author: 'Tunde W.', avatarBg: '#0EA5E9', avatarLetter: 'T', timeAgo: '16h ago', text: 'God bless you for this! Any tips for remembering electromagnetic induction formulas?' },
    { id: 'c3-7', author: 'Sarah Jenkins', authorRole: 'Host', avatarBg: '#2D62FF', avatarLetter: 'S', timeAgo: '14h ago', text: 'For electromagnetism, group the formulas by Faraday and Lenz laws with units. Flashcards work wonders!' },
    { id: 'c3-8', author: 'Zainab M.', avatarBg: '#8B5CF6', avatarLetter: 'Z', timeAgo: '12h ago', text: 'Just solved the 2021 section. The explanations in this compilation are super clear.' },
    { id: 'c3-9', author: 'Emeka U.', avatarBg: '#14B8A6', avatarLetter: 'E', timeAgo: '10h ago', text: 'Anyone want to form a study group to go through 10 questions a day together?' },
    { id: 'c3-10', author: 'Fatimah B.', avatarBg: '#F43F5E', avatarLetter: 'F', timeAgo: '8h ago', text: 'I am down for the study group Emeka! Count me in.' },
    { id: 'c3-11', author: 'Kelechi N.', avatarBg: '#F97316', avatarLetter: 'K', timeAgo: '6h ago', text: 'Can you please compile Chemistry past questions next if you have time?' },
    { id: 'c3-12', author: 'David O.', authorRole: 'Author', avatarBg: '#F59E0B', avatarLetter: 'D', timeAgo: '5h ago', text: 'Working on Chemistry Organic & Physical right now Kelechi, will post it soon!' },
    { id: 'c3-13', author: 'Amina S.', avatarBg: '#3B82F6', avatarLetter: 'A', timeAgo: '4h ago', text: 'The link is working perfectly. Really appreciate you sharing this with everyone.' },
    { id: 'c3-14', author: 'Victor J.', avatarBg: '#10B981', avatarLetter: 'V', timeAgo: '3h ago', text: 'Question 14 on Projectile Motion was on my school mock exam last week! Exact same numbers.' },
    { id: 'c3-15', author: 'Alex', avatarBg: '#6236FF', avatarLetter: 'A', timeAgo: '1h ago', text: 'Saved to my study resources. Best compilation so far!' },
  ],
};

const INITIAL_POSTS = [
  {
    id: 'post-1',
    communityId: 'grp-3',
    author: 'Sarah Jenkins',
    authorRole: 'Host',
    avatarLetter: 'S',
    avatarBg: '#2D62FF',
    timeAgo: '20 mins ago',
    subject: 'Mathematics',
    title: 'Intuitive trick for Integration by Parts (LIATE Rule)',
    content: 'Struggling with integral Calculus? Always choose u in order: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. It saved my grades last term!',
    likesCount: 18,
    commentsCount: DEFAULT_POST_COMMENTS['post-1'].length,
    isLiked: false,
    isBookmarked: true,
    comments: DEFAULT_POST_COMMENTS['post-1'],
  },
  {
    id: 'post-2',
    communityId: 'grp-0',
    author: 'Admin Team',
    authorRole: 'Official',
    avatarSource: communityMascotSource,
    avatarLetter: 'S',
    avatarBg: '#112B8A',
    timeAgo: '2 hours ago',
    subject: 'Announcements',
    title: 'Welcome to StudPal Global!',
    content: 'This is the official hub for all StudPal updates. Keep an eye out for our weekly global study challenges!',
    likesCount: 245,
    commentsCount: DEFAULT_POST_COMMENTS['post-2'].length,
    isLiked: true,
    isBookmarked: false,
    comments: DEFAULT_POST_COMMENTS['post-2'],
  },
  {
    id: 'post-3',
    communityId: 'grp-1',
    author: 'David O.',
    authorRole: 'Member',
    avatarLetter: 'D',
    avatarBg: '#F59E0B',
    timeAgo: '1 day ago',
    subject: 'Exam Prep',
    title: 'JAMB Physics Past Questions Compilation',
    content: 'Hey everyone, I compiled the most repeated physics questions from 2015-2023. Let me know if you want the PDF link.',
    likesCount: 42,
    commentsCount: DEFAULT_POST_COMMENTS['post-3'].length,
    isLiked: false,
    isBookmarked: false,
    comments: DEFAULT_POST_COMMENTS['post-3'],
  }
];

const INITIAL_CHALLENGES = [
  { id: 'ch-1', communityId: 'grp-2', title: '7-Day Organic Chemistry Sprint', progress: 5, total: 7, joined: true, checkedInToday: false },
  { id: 'ch-2', communityId: 'grp-3', title: '21-Day Calculus Mastery', progress: 0, total: 21, joined: false, checkedInToday: false },
  { id: 'ch-3', communityId: 'grp-0', title: 'Global 100-Hour Pomodoro Goal', progress: 17, total: 100, joined: true, checkedInToday: false },
];

const COMMUNITY_STORAGE_KEY = '@studpal_joined_communities_v2';
const CREATED_COMMUNITIES_STORAGE_KEY = '@studpal_created_communities_v2';

const DEFAULT_COMMUNITY_RULES = [
  { id: 'r-1', icon: '🤝', title: 'Respect & Mutual Support', desc: 'Treat fellow peers with kindness. We are all here to learn and achieve together.' },
  { id: 'r-2', icon: '🚫', title: 'No Spam or Self-Promotion', desc: 'Keep discussions strictly relevant to course subjects and study topics.' },
  { id: 'r-3', icon: '📚', title: 'Academic Integrity', desc: 'Share study guides, explanations, and practice questions. Avoid direct exam cheating.' },
];

const QUICK_COMMUNITY_TEMPLATES = [
  {
    name: 'JAMB 2027 Success Squad',
    category: 'Exam Prep',
    subject: 'General Study',
    bio: 'Daily past questions, syllabus breakdowns, and motivation for JAMB 2027 aspirants.',
    color: '#2D62FF',
    level: 'High School (WAEC / JAMB)',
    icon: '📝',
  },
  {
    name: 'Organic Chem Problem Solvers',
    category: 'Subjects',
    subject: 'Chemistry',
    bio: 'Stuck on reaction mechanisms or synthesis problems? Let us solve it together.',
    color: '#6366F1',
    level: 'University / STEM',
    icon: '🧪',
  },
  {
    name: 'Calculus & Pure Math Sprints',
    category: 'Subjects',
    subject: 'Mathematics',
    bio: 'Daily calculus problem solving, past papers, and pomodoro study sprints.',
    color: '#0EA5E9',
    level: 'All Levels',
    icon: '📐',
  },
  {
    name: '50/10 Deep Focus Pomodoro Hub',
    category: 'Study Skills',
    subject: 'Study Skills',
    bio: 'Join silent pomodoro study sprints and track daily study hours together.',
    color: '#10B981',
    level: 'All Levels',
    icon: '⚡',
  },
];

export default function CommunityScreen({ user = { name: 'Alex' }, onSelectTab, onNavigate }) {
  const { t, currentLanguageCode } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentSettings, setCurrentSettings] = useState(settingsService.getSettingsSync());
  const [gamificationState, setGamificationState] = useState(gamificationService.getState());

  useEffect(() => {
    const unsubSettings = settingsService.subscribe((s) => setCurrentSettings(s));
    const unsubGame = gamificationService.subscribe((s) => setGamificationState(s));
    return () => { unsubSettings(); unsubGame(); };
  }, []);

  // Load persisted joined & created communities on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedJoined = window.localStorage.getItem(COMMUNITY_STORAGE_KEY);
        const storedCreated = window.localStorage.getItem(CREATED_COMMUNITIES_STORAGE_KEY);

        let createdGroups = [];
        if (storedCreated) {
          createdGroups = JSON.parse(storedCreated);
        }

        const mergedBase = [...INITIAL_GROUPS, ...createdGroups.filter(cg => !INITIAL_GROUPS.some(ig => ig.id === cg.id))];

        if (storedJoined) {
          const joinedSet = new Set(JSON.parse(storedJoined));
          setStudyGroups(mergedBase.map(g => ({
            ...g,
            joined: joinedSet.has(g.id)
          })));
        } else {
          setStudyGroups(mergedBase);
        }
      }
    } catch (err) {
      console.warn('Failed to load community persistence:', err);
    }
  }, []);

  const { isDark: themeIsDark, accentColor: themeAccent } = useTheme();
  const accentColor = currentSettings?.accentColor || themeAccent || Colors.accent || '#2D62FF';
  const isDark = themeIsDark;
  const currentLang = normalizeLanguageCode(currentSettings?.language || currentLanguageCode || 'en');

  const currentLevel = gamificationState.currentLevel.level;
  const xpProgress = gamificationState.breakdown ? gamificationState.breakdown.xpIntoLevel : 860;
  const xpRequired = gamificationState.breakdown ? gamificationState.breakdown.levelXpRequirement : 1000;
  const canCreateGroup = currentLevel >= 5;

  // View State
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [detailTab, setDetailTab] = useState('Feed'); // Feed, Study, Members, Rules
  const detailScrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    detailScrollY.setValue(0);
  }, [selectedCommunity]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Trending');

  // Data
  const [studyGroups, setStudyGroups] = useState(INITIAL_GROUPS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);

  // Modals
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const [isJoinRequiredModalOpen, setJoinRequiredModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isCreateChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [leavingGroupTarget, setLeavingGroupTarget] = useState(null);
  const [leaveStep, setLeaveStep] = useState(1);
  const [pendingActionAfterJoin, setPendingActionAfterJoin] = useState(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isInviteLinkCopied, setInviteLinkCopied] = useState(false);

  const handleCopyInviteLink = async () => {
    const groupName = selectedCommunity?.name || 'this study community';
    const groupId = selectedCommunity?.id || 'group-1';
    const inviteUrl = `https://studpal.app/community/${groupId}`;
    const shareMessage = `Join "${groupName}" on StudPal to collaborate, share study past questions, and track study sprints together!\n\nLink: ${inviteUrl}`;

    setInviteLinkCopied(true);
    setTimeout(() => {
      setInviteLinkCopied(false);
    }, 2500);

    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        await Share.share({
          title: `Join ${groupName} on StudPal`,
          message: shareMessage,
          url: inviteUrl,
        });
      }
    } catch (err) {}

    Alert.alert(
      '📋 Invite Link Copied!',
      `Community invite link for "${groupName}" has been copied to your clipboard.\n\n${inviteUrl}`
    );
  };

  // Form States for Report & Challenge
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeDays, setNewChallengeDays] = useState('7');

  // Form States for Post Creation (Dedicated Form Arrangements)
  const [postType, setPostType] = useState('tip'); // 'tip' | 'question' | 'notes'
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // 1. Study Tip Fields
  const [tipTitle, setTipTitle] = useState('');
  const [tipSubject, setTipSubject] = useState('Mathematics');
  const [tipMethod, setTipMethod] = useState('');
  const [tipTakeaway, setTipTakeaway] = useState('');

  // 2. Ask Question Fields
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionSubject, setQuestionSubject] = useState('Physics');
  const [questionDetails, setQuestionDetails] = useState('');
  const [questionTried, setQuestionTried] = useState('');
  const [questionUrgency, setQuestionUrgency] = useState('Normal'); // 'Normal' | 'Assignment' | 'Urgent'

  // 3. Study Notes Fields
  const [notesTitle, setNotesTitle] = useState('');
  const [notesSubject, setNotesSubject] = useState('Exam Prep');
  const [notesHighlights, setNotesHighlights] = useState('');
  const [notesLink, setNotesLink] = useState('');

  // Form States for Community Creation
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Exam Prep');
  const [newGroupSubject, setNewGroupSubject] = useState('Mathematics');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupPrivacy, setNewGroupPrivacy] = useState('public');
  const [newGroupAvatarBg, setNewGroupAvatarBg] = useState('#2D62FF');
  const [newGroupAvatarIcon, setNewGroupAvatarIcon] = useState('🎓');
  const [customAvatarUri, setCustomAvatarUri] = useState(null);
  const [newGroupLevel, setNewGroupLevel] = useState('All Levels');

  // Form States for Community Rules & Guidelines
  const [ruleMode, setRuleMode] = useState('preset'); // 'preset' | 'custom'
  const [customRules, setCustomRules] = useState([]);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');

  const handlePickCommunityImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow photo library access to upload a community profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCustomAvatarUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Upload Error', 'Could not pick image: ' + (e?.message || 'Unknown error'));
    }
  };

  const handleApplyQuickTemplate = (tpl) => {
    setNewGroupName(tpl.name);
    setNewGroupCategory(tpl.category);
    setNewGroupSubject(tpl.subject);
    setNewGroupDesc(tpl.bio);
    setNewGroupAvatarBg(tpl.color);
    setNewGroupAvatarIcon(tpl.avatarIcon || tpl.icon || '🎓');
    setCustomAvatarUri(null);
    setNewGroupLevel(tpl.level);
  };

  const handleAddPresetToCustom = (presetRule) => {
    if (customRules.some((r) => r.title === presetRule.title)) return;
    const newRule = {
      id: `cr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      icon: presetRule.icon || '📌',
      title: presetRule.title,
      desc: presetRule.desc,
    };
    setCustomRules((prev) => [...prev, newRule]);
  };

  // Localized Content
  const localizedGroups = useMemo(() => {
    return getLocalizedGroups(studyGroups, currentLang);
  }, [studyGroups, currentLang]);

  const localizedPosts = useMemo(() => {
    return getLocalizedPosts(posts, currentLang);
  }, [posts, currentLang]);

  const localizedChallenges = useMemo(() => {
    return getLocalizedChallenges(challenges, currentLang);
  }, [challenges, currentLang]);

  const localizedRules = useMemo(() => {
    return getLocalizedRules(DEFAULT_COMMUNITY_RULES, currentLang);
  }, [currentLang]);

  // Computed
  const filteredGroups = useMemo(() => {
    return localizedGroups.filter((grp) => {
      if (grp.isOfficial) return false; // Handled separately
      const matchesSearch = grp.name.toLowerCase().includes(searchQuery.toLowerCase()) || grp.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilter === 'Trending') return matchesSearch;
      return matchesSearch && (grp.category === activeFilter || grp.categoryKey === activeFilter);
    });
  }, [localizedGroups, searchQuery, activeFilter]);

  const joinedGroups = useMemo(() => localizedGroups.filter(g => g.joined), [localizedGroups]);
  const officialGroup = useMemo(() => localizedGroups.find(g => g.isOfficial), [localizedGroups]);

  const saveCommunitiesToStorage = (groups) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const joinedIds = groups.filter(g => g.joined).map(g => g.id);
        window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(joinedIds));

        const customCreated = groups.filter(g => !INITIAL_GROUPS.some(ig => ig.id === g.id));
        window.localStorage.setItem(CREATED_COMMUNITIES_STORAGE_KEY, JSON.stringify(customCreated));
      }

      // Async Cloud Sync to Supabase
      authService.getCurrentUser().then((user) => {
        if (user?.id) {
          const joinedIds = groups.filter(g => g.joined).map(g => g.id);
          joinedIds.forEach((id) => communitySupabaseService.joinCommunity(user.id, id));
        }
      }).catch((e) => console.warn('[CommunityScreen] Supabase sync notice:', e));
    } catch (err) {
      console.warn('Failed to save communities to storage:', err);
    }
  };

  // Handlers
  const handleToggleLike = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: !p.isLiked ? p.likesCount + 1 : p.likesCount - 1 } : p));
  };
  const handleToggleBookmark = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p));
  };
  const handleToggleJoinGroup = (groupId) => {
    const targetGroup = studyGroups.find(g => g.id === groupId);
    if (!targetGroup) return;

    // If already joined -> Trigger custom double-verification modal
    if (targetGroup.joined) {
      setLeavingGroupTarget(targetGroup);
      setLeaveStep(1);
      return;
    }

    // Joining community -> Direct join & save persistence
    setStudyGroups(prev => {
      const updatedList = prev.map(g => {
        if (g.id === groupId) {
          const updated = { ...g, joined: true, membersCount: g.membersCount + 1 };
          if (selectedCommunity?.id === groupId) {
            setSelectedCommunity(updated);
          }
          return updated;
        }
        return g;
      });
      saveCommunitiesToStorage(updatedList);
      return updatedList;
    });
  };

  const handleRequireMembership = (onSuccessAction) => {
    if (selectedCommunity && !selectedCommunity.joined) {
      setPendingActionAfterJoin(() => onSuccessAction);
      setJoinRequiredModalOpen(true);
    } else {
      onSuccessAction();
    }
  };

  const handleJoinFromModal = () => {
    if (selectedCommunity) {
      handleToggleJoinGroup(selectedCommunity.id);
      setJoinRequiredModalOpen(false);
      if (pendingActionAfterJoin) {
        const actionToRun = pendingActionAfterJoin;
        setPendingActionAfterJoin(null);
        setTimeout(() => {
          actionToRun();
        }, 300);
      }
    }
  };

  const handleOpenCreatePost = (type = 'tip') => {
    handleRequireMembership(() => {
      setPostType(type);
      setCreatePostOpen(true);
    });
  };

  const handleCreatePostSubmit = () => {
    let finalTitle = '';
    let finalContent = '';
    let finalSubject = selectedCommunity?.subject || 'General Study';

    if (postType === 'tip') {
      if (!tipTitle.trim() || !tipMethod.trim()) {
        Alert.alert('Incomplete Fields', 'Please provide a tip title and explain the method/technique.');
        return;
      }
      finalTitle = tipTitle.trim();
      finalContent = `${tipMethod.trim()}${tipTakeaway.trim() ? `\n\n💡 Pro Tip: ${tipTakeaway.trim()}` : ''}`;
      finalSubject = tipSubject;
    } else if (postType === 'question') {
      if (!questionTitle.trim() || !questionDetails.trim()) {
        Alert.alert('Incomplete Fields', 'Please provide your question title and problem details.');
        return;
      }
      finalTitle = questionTitle.trim();
      finalContent = `${questionDetails.trim()}${questionTried.trim() ? `\n\n🤔 What I've tried:\n${questionTried.trim()}` : ''}${questionUrgency !== 'Normal' ? `\n\n⚡ Status: ${questionUrgency}` : ''}`;
      finalSubject = questionSubject;
    } else {
      // notes
      if (!notesTitle.trim() || !notesHighlights.trim()) {
        Alert.alert('Incomplete Fields', 'Please provide a notes title and key overview highlights.');
        return;
      }
      finalTitle = notesTitle.trim();
      finalContent = `${notesHighlights.trim()}${notesLink.trim() ? `\n\n📎 Resource Link: ${notesLink.trim()}` : ''}`;
      finalSubject = notesSubject;
    }

    const newPost = {
      id: `p-${Date.now()}`,
      author: user?.name || 'Alex',
      authorAvatar: user?.avatarUri || user?.avatar || null,
      authorEmoji: user?.avatarEmoji || null,
      avatarBg: user?.avatarBg || accentColor || '#2D62FF',
      avatarLetter: (user?.name?.[0] || 'A').toUpperCase(),
      authorBadge: 'Level 7 • Knowledge Builder',
      authorRole: 'Member',
      timeAgo: 'Just now',
      title: finalTitle,
      content: finalContent,
      subject: finalSubject,
      postFormat: postType,
      communityId: selectedCommunity ? selectedCommunity.id : 'grp-0',
      likesCount: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      commentsCount: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setTipTitle('');
    setTipMethod('');
    setTipTakeaway('');
    setQuestionTitle('');
    setQuestionDetails('');
    setQuestionTried('');
    setNotesTitle('');
    setNotesHighlights('');
    setNotesLink('');
    setNewPostTitle('');
    setNewPostContent('');
    setCreatePostOpen(false);

    gamificationService.awardXp(
      'CREATE_COMMUNITY_POST',
      25,
      `Published ${postType === 'tip' ? 'Study Tip' : postType === 'question' ? 'Question' : 'Study Notes'}: ${finalTitle}`,
      `post_${newPost.id}`
    );
  };

  const handleAddCommentSubmit = () => {
    if (!newCommentText.trim() || !selectedPostForComments) return;
    handleRequireMembership(() => {
      const commentObj = {
        id: `c-${Date.now()}`,
        author: user?.name || 'Alex',
        authorAvatar: user?.avatarUri || user?.avatar || null,
        authorEmoji: user?.avatarEmoji || null,
        avatarBg: user?.avatarBg || accentColor || '#2D62FF',
        avatarLetter: (user?.name?.[0] || 'A').toUpperCase(),
        timeAgo: 'Just now',
        text: newCommentText.trim(),
      };
      const currentList = (selectedPostForComments.comments && selectedPostForComments.comments.length > 0)
        ? selectedPostForComments.comments
        : (DEFAULT_POST_COMMENTS[selectedPostForComments.id] || []);
      const updatedComments = [...currentList, commentObj];

      setPosts(prev => prev.map(p => {
        if (p.id === selectedPostForComments.id) {
          return { ...p, comments: updatedComments, commentsCount: updatedComments.length };
        }
        return p;
      }));

      setSelectedPostForComments(prev => ({
        ...prev,
        comments: updatedComments,
        commentsCount: updatedComments.length
      }));

      setNewCommentText('');
    });
  };

  const handleChallengeCheckIn = (ch) => {
    handleRequireMembership(() => {
      // 1. If not joined yet, join and check-in for Day 1
      if (!ch.joined) {
        setChallenges(prev => prev.map(c => c.id === ch.id ? { 
          ...c, 
          joined: true, 
          progress: Math.min(c.total, c.progress + 1),
          checkedInToday: true 
        } : c));

        try {
          gamificationService.recordStudySession(25, `ch_join_${ch.id}_${Date.now()}`);
        } catch (err) {}

        Alert.alert(
          '🏆 Challenge Enrolled!', 
          `You enrolled in "${ch.title}" and completed your Day 1 check-in!\n+25 XP awarded to your profile!`
        );
        return;
      }

      // 2. If already completed
      if (ch.progress >= ch.total) {
        Alert.alert(
          '🎉 Sprint Completed!', 
          `You have already achieved all ${ch.total} Days of "${ch.title}"! Outstanding dedication!`
        );
        return;
      }

      // 3. If already checked in today
      if (ch.checkedInToday) {
        Alert.alert(
          '✓ Already Checked In Today', 
          `You've already recorded your study check-in for "${ch.title}" today! Come back tomorrow for your next daily streak check-in.`
        );
        return;
      }

      // 4. Perform daily check-in
      const newProgress = Math.min(ch.total, ch.progress + 1);
      setChallenges(prev => prev.map(c => c.id === ch.id ? { 
        ...c, 
        progress: newProgress, 
        checkedInToday: true 
      } : c));

      try {
        gamificationService.recordStudySession(25, `ch_checkin_${ch.id}_${Date.now()}`);
      } catch (err) {}

      Alert.alert(
        '⚡ Daily Check-In Recorded!',
        `Progress: ${newProgress}/${ch.total} Days Completed.\n+25 XP awarded to your profile!`
      );
    });
  };

  const handleLeaveCommunityConfirm = () => {
    if (!selectedCommunity) return;
    setLeavingGroupTarget(selectedCommunity);
    setLeaveStep(1);
  };

  const handleReportCommunitySubmit = () => {
    if (!reportReason) {
      Alert.alert('Selection Required', 'Please select a reason for reporting.');
      return;
    }
    setReportModalOpen(false);
    setReportReason('');
    setReportDetails('');
    Alert.alert(
      '🛡️ Report Submitted',
      `Thank you for keeping StudPal safe. Our moderation team has received your report regarding "${selectedCommunity?.name}" and will review it shortly.`
    );
  };

  const handleCreateChallengeSubmit = () => {
    if (!newChallengeTitle.trim()) {
      Alert.alert('Incomplete Form', 'Please enter a title for the challenge.');
      return;
    }
    const days = parseInt(newChallengeDays) || 7;
    const newCh = {
      id: `ch-${Date.now()}`,
      communityId: selectedCommunity?.id || 'grp-0',
      title: newChallengeTitle.trim(),
      progress: 0,
      total: days,
      joined: true,
    };
    setChallenges([newCh, ...challenges]);
    setNewChallengeTitle('');
    setNewChallengeDays('7');
    setCreateChallengeOpen(false);
    Alert.alert('🏆 Challenge Created!', `"${newCh.title}" is now active in ${selectedCommunity?.name}.`);
  };

  const handleCreateGroupSubmit = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Incomplete Form', 'Please enter a community name.');
      return;
    }
    if (newGroupName.trim().length > 80) {
      Alert.alert('Name Too Long', 'Community name cannot exceed 80 characters.');
      return;
    }
    if (!newGroupDesc.trim()) {
      Alert.alert('Incomplete Form', 'Please enter a brief bio/description for your community.');
      return;
    }
    if (newGroupDesc.trim().length > 120) {
      Alert.alert('Bio Too Long', 'Community bio cannot exceed 120 characters.');
      return;
    }

    const activeRules = (ruleMode === 'preset' || customRules.length === 0)
      ? DEFAULT_COMMUNITY_RULES
      : customRules;

    const newGroup = {
      id: `grp-${Date.now()}`,
      name: newGroupName.trim(),
      subject: newGroupSubject,
      membersCount: 1,
      onlineCount: 1,
      avatarBg: newGroupAvatarBg || accentColor,
      avatarIcon: customAvatarUri ? null : (newGroupAvatarIcon || '🎓'),
      avatarUri: customAvatarUri || null,
      joined: true,
      description: newGroupDesc.trim(),
      category: newGroupCategory,
      privacy: newGroupPrivacy,
      targetLevel: newGroupLevel,
      rules: activeRules,
      isOfficial: false,
      isHost: true,
    };

    setStudyGroups(prev => {
      const updatedList = [newGroup, ...prev];
      saveCommunitiesToStorage(updatedList);
      return updatedList;
    });

    // Reset Form
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupCategory('Exam Prep');
    setNewGroupSubject('Mathematics');
    setNewGroupPrivacy('public');
    setNewGroupAvatarBg('#2D62FF');
    setNewGroupAvatarIcon('🎓');
    setCustomAvatarUri(null);
    setNewGroupLevel('All Levels');
    setRuleMode('preset');
    setCustomRules([]);
    setNewRuleTitle('');
    setNewRuleDesc('');

    setCreateGroupOpen(false);

    // Navigate to the newly created community
    setSelectedCommunity(newGroup);
    Alert.alert('🎉 Community Created!', `You are now the host of "${newGroup.name}".`);
  };

  const renderCommunityHome = () => (
    <View style={{ flex: 1 }}>
      {/* Sticky Header Section */}
      <View style={[styles.stickyHeader, isDark && { backgroundColor: '#0B0F19' }]}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pageTitle, isDark && { color: '#F8FAFC' }]}>{t("community.title", "Community")}</Text>
            <Text style={styles.pageSubtitle}>{t("community.subtitle", "Learn, collaborate, and grow with peers.")}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBarContainer, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <SearchIcon size={18} color="#94A3B8" />
          <TextInput
            style={[styles.searchInput, isDark && { color: '#F8FAFC' }]}
            placeholder={t("community.searchPlaceholder", "Search communities or topics...")}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 110 }]}>
        {/* Sleek My Communities & Host Action Bar */}
        <View style={styles.storySection}>
          <View style={styles.sectionHeaderRowCompact}>
            <Text style={[styles.sectionHeadingSmall, isDark && { color: '#F8FAFC' }]}>{t("community.myCommunities", "My Communities")}</Text>
            {!canCreateGroup && (
              <View style={styles.lockedPillInline}>
                <LockIcon size={12} color={Colors.warning} />
                <Text style={styles.lockedPillText}>Create at Lvl 5 ({xpProgress}/{xpRequired} XP)</Text>
              </View>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyRow}>
            {/* Create Button in Story Row if Level 5+ */}
            {canCreateGroup && (
              <TooltipTouchable tooltip="Create Community" style={styles.storyItem} onPress={() => setCreateGroupOpen(true)} activeOpacity={0.8}>
                <View style={[styles.storyAvatarCreate, { borderColor: accentColor }]}>
                  <PlusIcon size={20} color={accentColor} />
                </View>
                <Text style={[styles.storyName, isDark && { color: '#CBD5E1' }]} numberOfLines={1}>{t("community.create", "+ Create")}</Text>
              </TooltipTouchable>
            )}

            {/* Joined Communities Avatar Circles */}
            {joinedGroups.map(grp => {
              const grpAvatar = grp.avatarSource || ((grp.id === 'grp-0' || grp.isOfficial) ? communityMascotSource : null);
              return (
                <TouchableOpacity key={grp.id} style={styles.storyItem} onPress={() => setSelectedCommunity(grp)} activeOpacity={0.8}>
                  <View style={[styles.storyAvatarRing, { backgroundColor: grpAvatar ? '#FFFFFF' : grp.avatarBg, overflow: 'hidden' }]}>
                    {grpAvatar ? (
                      <Image source={grpAvatar} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    ) : grp.avatarUri ? (
                      <Image source={{ uri: grp.avatarUri }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <Text style={styles.storyAvatarText}>{grp.avatarIcon || grp.name[0]}</Text>
                    )}
                  </View>
                  <Text style={[styles.storyName, isDark && { color: '#F8FAFC' }]} numberOfLines={3}>{grp.name}</Text>
                </TouchableOpacity>
              );
            })}

            {joinedGroups.length === 0 && !canCreateGroup && (
              <Text style={styles.noJoinedText}>{t("community.joinToSee", "Join communities below to see them here")}</Text>
            )}
          </ScrollView>
        </View>

        {/* Curated Discovery Section Header */}
        <View style={styles.sectionHeaderRowCompact}>
          <Text style={[styles.sectionHeadingSmall, isDark && { color: '#F8FAFC' }]}>{t("community.exploreCommunities", "Explore Communities")}</Text>
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
          {[
            { key: 'Trending', labelKey: 'community.trending', defaultLabel: 'Trending' },
            { key: 'Exam Prep', labelKey: 'community.examPrep', defaultLabel: 'Exam Prep' },
            { key: 'Subjects', labelKey: 'community.subjects', defaultLabel: 'Subjects' },
            { key: 'Study Skills', labelKey: 'community.studySkills', defaultLabel: 'Study Skills' },
            { key: 'University & STEM', labelKey: 'community.universityStem', defaultLabel: 'University & STEM' },
          ].map((cat) => (
            <TouchableOpacity key={cat.key} style={[styles.filterPill, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }, activeFilter === cat.key && { backgroundColor: accentColor, borderColor: accentColor }]} onPress={() => setActiveFilter(cat.key)}>
              <Text style={[styles.filterPillText, isDark && { color: '#94A3B8' }, activeFilter === cat.key && { color: '#FFFFFF', fontWeight: '700' }]}>{t(cat.labelKey, cat.defaultLabel)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Community Discovery List */}
        <View style={styles.discoverList}>
          {/* Featured Official Hub Item */}
          {officialGroup && activeFilter === 'Trending' && !searchQuery && (
            <TouchableOpacity 
              style={[styles.featuredHubItem, { backgroundColor: officialGroup.avatarBg || '#112B8A' }]} 
              onPress={() => setSelectedCommunity(officialGroup)} 
              activeOpacity={0.9}
            >
              <View style={styles.featuredHubTopRow}>
                <View style={styles.featuredHubAvatarWrap}>
                  <Image 
                    source={officialGroup.avatarSource || communityMascotSource} 
                    style={styles.featuredHubAvatar} 
                    resizeMode="cover" 
                  />
                </View>
                <View style={styles.featuredHubTitleCol}>
                  <View style={styles.featuredHubTitleRow}>
                    <Text style={styles.featuredHubTitle}>
                      {officialGroup.name}
                    </Text>
                    <VerifiedIcon size={18} color="#60A5FA" />
                  </View>
                  <Text style={styles.featuredHubMeta}>
                    {t("community.officialHub", "Official Hub")} • {(officialGroup.membersCount / 1000).toFixed(1)}k {t("community.membersLabel", "members")}
                  </Text>
                </View>
              </View>

              <Text style={styles.featuredHubDesc} numberOfLines={3}>
                {officialGroup.description}
              </Text>

              <View style={styles.featuredHubBottomRow}>
                <View style={styles.featuredHubBtn}>
                  <Text style={styles.featuredHubBtnText}>{t("community.enterHub", "Enter Hub")}</Text>
                  <ChevronRightIcon size={14} color={Colors.brandNavy || '#112B8A'} />
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Clean Discover List Cards */}
          {filteredGroups.map(grp => {
            const grpAvatar = grp.avatarSource || ((grp.id === 'grp-0' || grp.isOfficial) ? communityMascotSource : null);
            return (
              <TouchableOpacity key={grp.id} style={[styles.discoverCardClean, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]} onPress={() => setSelectedCommunity(grp)} activeOpacity={0.85}>
                <View style={[styles.groupAvatarSmall, { backgroundColor: grpAvatar ? '#FFFFFF' : grp.avatarBg, overflow: 'hidden' }]}>
                  {grpAvatar ? (
                    <Image source={grpAvatar} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : grp.avatarUri ? (
                    <Image source={{ uri: grp.avatarUri }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Text style={styles.groupAvatarTextSmall}>{grp.avatarIcon || grp.name[0]}</Text>
                  )}
                </View>

              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.discoverNameClean, isDark && { color: '#F8FAFC' }]}>{grp.name}</Text>
                <Text style={[styles.discoverDescClean, isDark && { color: '#CBD5E1' }]} numberOfLines={4}>{grp.description}</Text>
                <Text style={[styles.discoverMetaClean, isDark && { color: '#94A3B8' }]}>{grp.category} • {(grp.membersCount / 1000).toFixed(1)}k {t("community.membersLabel", "members")}</Text>
              </View>

              <TouchableOpacity 
                style={[
                  styles.joinBtnClean, 
                  grp.joined ? { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)' } : { backgroundColor: accentColor }
                ]} 
                onPress={() => handleToggleJoinGroup(grp.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.joinBtnTextClean, grp.joined && { color: '#10B981' }]}>
                  {grp.joined ? t("community.joined", "Joined ✓") : t("community.join", "Join")}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
        </View>
      </ScrollView>
    </View>
  );

  const renderCommunityDetail = () => {
    const activeCommunity = selectedCommunity 
      ? (localizedGroups.find(g => g.id === selectedCommunity.id) || selectedCommunity) 
      : null;
    if (!activeCommunity) return null;

    const communityPosts = localizedPosts.filter(p => p.communityId === activeCommunity.id);
    const communityChallenges = localizedChallenges.filter(c => c.communityId === activeCommunity.id);

    // Collapsible header animations
    const navBgOpacity = detailScrollY.interpolate({
      inputRange: [20, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const compactTitleOpacity = detailScrollY.interpolate({
      inputRange: [45, 90],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const compactTitleTranslateY = detailScrollY.interpolate({
      inputRange: [45, 90],
      outputRange: [8, 0],
      extrapolate: 'clamp',
    });

    const heroContentOpacity = detailScrollY.interpolate({
      inputRange: [0, 85],
      outputRange: [1, 0.2],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.detailContainer}>
        {/* Sticky Compact Top Navigation Bar */}
        <View style={[styles.detailStickyNavWrapper, { paddingTop: insets.top }]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: activeCommunity.avatarBg || '#1E3A8A',
                opacity: navBgOpacity,
              },
            ]}
          />
          <View style={styles.detailStickyNavRow}>
            <TooltipTouchable
              tooltip="Back to Communities"
              onPress={() => setSelectedCommunity(null)}
              style={styles.backBtnClean}
              activeOpacity={0.8}
            >
              <ChevronLeftIcon color="#FFFFFF" size={24} />
            </TooltipTouchable>

            <Animated.View
              style={[
                styles.detailStickyTitleContainer,
                {
                  opacity: compactTitleOpacity,
                  transform: [{ translateY: compactTitleTranslateY }],
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.detailStickyTitle} numberOfLines={1}>
                  {activeCommunity.name}
                </Text>
                {activeCommunity.isOfficial && <VerifiedIcon size={16} color="#60A5FA" />}
              </View>
              <Text style={styles.detailStickySubtitle}>
                {activeCommunity.membersCount} {t("community.membersLabel", "members")}
              </Text>
            </Animated.View>

            <Animated.View style={{ opacity: compactTitleOpacity }}>
              <TouchableOpacity
                style={[
                  styles.detailStickyJoinBtn,
                  activeCommunity.joined && styles.detailStickyJoinedBtn,
                ]}
                onPress={() => handleToggleJoinGroup(activeCommunity.id)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.detailStickyJoinText,
                    activeCommunity.joined && { color: '#FFFFFF' },
                  ]}
                >
                  {activeCommunity.joined ? t("community.joined", "Joined ✓") : t("community.joinCommunity", "Join")}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* ScrollView with collapsible hero banner and sticky tabs */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: detailScrollY } } }],
            { useNativeDriver: false }
          )}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 12) + 110 },
          ]}
        >
          {/* Index 0: Hero Header Banner (Collapsible) */}
          <View style={[styles.detailHeroBanner, { backgroundColor: activeCommunity.avatarBg || '#1E3A8A', paddingTop: insets.top + 48 }]}>
            <Animated.View style={[styles.detailHeaderContentClean, { opacity: heroContentOpacity }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                {(() => {
                  const communityAvatarSource = activeCommunity.avatarSource || ((activeCommunity.id === 'grp-0' || activeCommunity.isOfficial) ? communityMascotSource : null);
                  const hasImage = !!(communityAvatarSource || activeCommunity.avatarUri);
                  return (
                    <View style={[styles.detailAvatarBadgeClean, { overflow: 'hidden' }, hasImage && { backgroundColor: '#FFFFFF' }]}>
                      {communityAvatarSource ? (
                        <Image
                          source={communityAvatarSource}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      ) : activeCommunity.avatarUri ? (
                        <Image source={{ uri: activeCommunity.avatarUri }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Text style={{ fontSize: 22, color: '#FFFFFF', fontWeight: '800' }}>
                          {activeCommunity.avatarIcon || activeCommunity.name[0]}
                        </Text>
                      )}
                    </View>
                  );
                })()}

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={styles.detailTitleRowClean}>
                    <Text style={styles.detailTitleClean} numberOfLines={2}>
                      {activeCommunity.name}
                    </Text>
                    {activeCommunity.isOfficial && (
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <VerifiedIcon size={18} color="#60A5FA" />
                      </View>
                    )}
                  </View>

                  <Text style={styles.detailSubtitleClean}>
                    {activeCommunity.membersCount} {t("community.membersLabel", "members")}
                  </Text>
                </View>
              </View>

              {activeCommunity.description && (
                <Text style={styles.detailBioTextClean} numberOfLines={4}>
                  {activeCommunity.description}
                </Text>
              )}

              <TouchableOpacity 
                style={[
                  styles.detailJoinBtnClean, 
                  activeCommunity.joined && { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)' }
                ]} 
                onPress={() => handleToggleJoinGroup(activeCommunity.id)}
                activeOpacity={0.85}
              >
                <Text style={[styles.detailJoinBtnTextClean, activeCommunity.joined && { color: '#FFFFFF' }]}>
                  {activeCommunity.joined ? t("community.joined", "Joined ✓") : t("community.joinCommunity", "Join Community")}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Index 1: Sticky Tabs Bar */}
          <View style={[styles.detailTabsContainer, isDark && styles.detailTabsContainerDark]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.detailTabsScrollContent}
              bounces={false}
            >
              {[
                { key: 'Feed', icon: '💬', labelKey: 'community.feed', defaultLabel: 'Feed' },
                { key: 'Study & Challenges', icon: '⚡', labelKey: 'community.studyAndChallenges', defaultLabel: 'Study & Challenges' },
                { key: 'Members', icon: '👥', labelKey: 'community.members', defaultLabel: 'Members' },
                { key: 'Rules & Safety', icon: '🛡️', labelKey: 'community.rulesAndSafety', defaultLabel: 'Rules & Safety' },
              ].map(tabItem => {
                const isActive = detailTab === tabItem.key;
                return (
                  <TouchableOpacity
                    key={tabItem.key}
                    style={[
                      styles.detailTabPill,
                      isActive && [styles.detailTabPillActive, { borderColor: accentColor, backgroundColor: isDark ? 'rgba(45, 98, 255, 0.18)' : '#EFF6FF' }],
                      isDark && !isActive && styles.detailTabPillDark,
                    ]}
                    onPress={() => setDetailTab(tabItem.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.detailTabIcon}>{tabItem.icon}</Text>
                    <Text
                      style={[
                        styles.detailTabPillText,
                        isActive && [styles.detailTabPillTextActive, { color: accentColor }],
                        isDark && !isActive && { color: '#94A3B8' },
                      ]}
                      numberOfLines={1}
                    >
                      {t(tabItem.labelKey, tabItem.defaultLabel)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        {detailTab === 'Feed' && (
          <View style={{ paddingTop: 4 }}>
            {/* Ultra-Premium Post Composer Card */}
            <TouchableOpacity 
              style={[
                styles.createPostCard, 
                isDark && styles.createPostCardDark,
                !activeCommunity?.joined && { borderColor: accentColor + '40', backgroundColor: accentColor + '0A' }
              ]} 
              onPress={() => handleOpenCreatePost(postType || 'tip')}
              activeOpacity={0.85}
            >
              <View style={styles.createPostTopRow}>
                <View style={[styles.createPostAvatarWrap, { backgroundColor: user?.avatarBg || accentColor }]}>
                  {user?.avatarUri ? (
                    <Image source={{ uri: user.avatarUri }} style={styles.createPostAvatarImg} />
                  ) : user?.avatarEmoji ? (
                    <Text style={{ fontSize: 16 }}>{user.avatarEmoji}</Text>
                  ) : (
                    <Text style={styles.createPostAvatarLetter}>{(user?.name?.[0] || 'A').toUpperCase()}</Text>
                  )}
                </View>
                <View style={[styles.createPostInputMock, isDark && styles.createPostInputMockDark]}>
                  <Text
                    style={[
                      styles.createPostPlaceholder,
                      !activeCommunity?.joined && { color: accentColor, fontWeight: '600' }
                    ]}
                    numberOfLines={1}
                  >
                    {activeCommunity?.joined
                      ? t("community.shareSomething", "Share something with the community...")
                      : t("community.joinToShare", "🔒 Join community to share posts or comments")}
                  </Text>
                  <View style={[styles.createPostPenCircle, { backgroundColor: accentColor + '18' }]}>
                    <EditPenIcon size={13} color={accentColor} />
                  </View>
                </View>
              </View>

              {/* Quick Action Tags (Each opens its own dedicated form arrangement) */}
              <View style={[styles.createPostQuickActions, isDark && styles.createPostQuickActionsDark]}>
                <TouchableOpacity
                  style={[styles.quickActionTag, isDark && styles.quickActionTagDark]}
                  onPress={() => handleOpenCreatePost('tip')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.quickActionEmoji}>💡</Text>
                  <Text style={[styles.quickActionLabel, isDark && { color: '#CBD5E1' }]}>Study Tip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionTag, isDark && styles.quickActionTagDark]}
                  onPress={() => handleOpenCreatePost('question')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.quickActionEmoji}>❓</Text>
                  <Text style={[styles.quickActionLabel, isDark && { color: '#CBD5E1' }]}>Ask Question</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionTag, isDark && styles.quickActionTagDark]}
                  onPress={() => handleOpenCreatePost('notes')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.quickActionEmoji}>📚</Text>
                  <Text style={[styles.quickActionLabel, isDark && { color: '#CBD5E1' }]}>Notes</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {communityPosts.map(post => {
              const isOfficialPost = post.communityId === 'grp-0' && (post.authorRole === 'Official' || post.author === 'Admin Team');
              const postAvatarSource = post.avatarSource || (isOfficialPost ? communityMascotSource : null);
              const pImg = post.authorAvatar || post.avatarUri || (post.author === user?.name ? user?.avatarUri : null);
              const pEmoji = post.authorEmoji || (post.author === user?.name ? user?.avatarEmoji : null);
              const pLetter = post.avatarLetter || (post.author?.[0] || 'A').toUpperCase();
              const pBg = postAvatarSource ? '#FFFFFF' : (post.avatarBg || (post.author === user?.name ? (user?.avatarBg || accentColor) : '#2D62FF'));
              const isHost = post.authorRole === 'Host';

              return (
                <View
                  key={post.id}
                  style={[
                    styles.postCardPremium,
                    isDark && styles.postCardPremiumDark,
                    isOfficialPost && [styles.officialPostCardGlow, { borderColor: isDark ? 'rgba(45, 98, 255, 0.4)' : '#BFDBFE' }],
                  ]}
                >
                  {/* Official / Pinned Announcement Badge */}
                  {isOfficialPost && (
                    <View style={[styles.pinnedBannerPill, isDark && styles.pinnedBannerPillDark]}>
                      <PinIcon size={12} color="#2563EB" />
                      <Text style={styles.pinnedBannerText}>PINNED ANNOUNCEMENT</Text>
                    </View>
                  )}

                  {/* Header: Avatar, Name, Role Badge, Time, and Bookmark */}
                  <View style={styles.postHeaderPremium}>
                    <View style={[styles.authorAvatarPremium, { backgroundColor: pBg }, isDark && { borderColor: '#334155' }]}>
                      {postAvatarSource ? (
                        <Image source={postAvatarSource} style={styles.authorAvatarImg} resizeMode="cover" />
                      ) : pImg ? (
                        <Image source={{ uri: pImg }} style={styles.authorAvatarImg} />
                      ) : pEmoji ? (
                        <Text style={{ fontSize: 18 }}>{pEmoji}</Text>
                      ) : (
                        <Text style={styles.authorAvatarTextPremium}>{pLetter}</Text>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.authorNameRow}>
                        <Text style={[styles.authorNamePremium, isDark && { color: '#F8FAFC' }]}>
                          {post.author}
                        </Text>

                        {/* Role Badge */}
                        {isOfficialPost ? (
                          <View style={styles.officialRoleBadge}>
                            <VerifiedIcon size={12} color="#2563EB" />
                            <Text style={styles.officialRoleBadgeText}>
                              {t(`community.role${post.authorRole || 'Official'}`, post.authorRole || 'Official')}
                            </Text>
                          </View>
                        ) : isHost ? (
                          <View style={styles.hostRoleBadge}>
                            <Text style={styles.hostRoleBadgeText}>👑 Host</Text>
                          </View>
                        ) : (
                          <View style={[styles.memberRoleBadge, isDark && styles.memberRoleBadgeDark]}>
                            <Text style={[styles.memberRoleBadgeText, isDark && { color: '#94A3B8' }]}>
                              {t(`community.role${post.authorRole || 'Member'}`, post.authorRole || 'Member')}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.postMetaRow}>
                        <Text style={[styles.postTimeText, isDark && { color: '#94A3B8' }]}>
                          {getLocalizedTimeAgo(post.timeAgo, currentLang)}
                        </Text>
                        {post.subject && (
                          <>
                            <Text style={[styles.postMetaDot, isDark && { color: '#64748B' }]}>•</Text>
                            <Text style={[styles.postSubjectTag, isDark && { color: '#94A3B8' }]}>
                              {post.subject}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>

                    {/* Bookmark Toggle in Header */}
                    <TouchableOpacity
                      style={[styles.headerBookmarkBtn, isDark && styles.headerBookmarkBtnDark]}
                      onPress={() => handleToggleBookmark(post.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      activeOpacity={0.7}
                    >
                      <BookmarkIcon
                        size={17}
                        isBookmarked={post.isBookmarked}
                        color={post.isBookmarked ? accentColor : (isDark ? '#64748B' : '#94A3B8')}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Post Title */}
                  <Text style={[styles.postTitlePremium, isDark && { color: '#F8FAFC' }]}>
                    {post.title}
                  </Text>

                  {/* Post Content Body */}
                  <Text style={[styles.postContentPremium, isDark && { color: '#CBD5E1' }]}>
                    {post.content}
                  </Text>

                  {/* Actions Footer */}
                  <View style={[styles.postActionsFooter, isDark && styles.postActionsFooterDark]}>
                    <View style={styles.actionsLeftGroup}>
                      {/* Like Action Pill */}
                      <TouchableOpacity
                        style={[
                          styles.actionPillBtn,
                          post.isLiked && styles.actionPillBtnLiked,
                          isDark && !post.isLiked && styles.actionPillBtnDark,
                        ]}
                        onPress={() => handleToggleLike(post.id)}
                        activeOpacity={0.75}
                      >
                        <HeartIcon
                          size={16}
                          isLiked={post.isLiked}
                          color={post.isLiked ? '#EF4444' : (isDark ? '#94A3B8' : '#64748B')}
                        />
                        <Text
                          style={[
                            styles.actionPillCount,
                            post.isLiked && styles.actionPillCountLiked,
                            isDark && !post.isLiked && { color: '#E2E8F0' },
                          ]}
                        >
                          {post.likesCount}
                        </Text>
                      </TouchableOpacity>

                      {/* Comment Action Pill */}
                      <TouchableOpacity
                        style={[
                          styles.actionPillBtn,
                          isDark && styles.actionPillBtnDark,
                        ]}
                        onPress={() => handleRequireMembership(() => {
                          const existingComments = (post.comments && post.comments.length > 0)
                            ? post.comments
                            : (DEFAULT_POST_COMMENTS[post.id] || []);
                          setSelectedPostForComments({
                            ...post,
                            comments: existingComments,
                            commentsCount: Math.max(post.commentsCount || 0, existingComments.length),
                          });
                        })}
                        activeOpacity={0.75}
                      >
                        <MessageSquareIcon size={16} color={isDark ? '#94A3B8' : '#64748B'} />
                        <Text style={[styles.actionPillCount, isDark && { color: '#E2E8F0' }]}>
                          {post.commentsCount}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Share Button */}
                    <TouchableOpacity
                      style={[styles.sharePillBtn, isDark && styles.actionPillBtnDark]}
                      onPress={() => {
                        try {
                          Share.share({
                            title: post.title,
                            message: `${post.title}\n\n"${post.content}"\n\nShared via StudPal Global Community`,
                          });
                        } catch (e) {
                          console.warn('Share error:', e);
                        }
                      }}
                      activeOpacity={0.75}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={[styles.shareActionText, isDark && { color: '#E2E8F0' }]}>Share ↗</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            {communityPosts.length === 0 && (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: '#94A3B8' }}>No posts yet. Be the first to share!</Text>
              </View>
            )}
          </View>
        )}

        {detailTab === 'Study & Challenges' && (
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={[styles.sectionHeading, isDark && { color: '#F8FAFC' }]}>{t("community.activeChallenges", "Active Study Challenges")}</Text>
              <TouchableOpacity 
                style={[
                  styles.createSprintPillBtn, 
                  { backgroundColor: accentColor + '15', borderColor: accentColor + '40' }
                ]} 
                onPress={() => handleRequireMembership(() => setCreateChallengeOpen(true))}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 13 }}>⚡</Text>
                <Text style={[styles.createSprintPillText, { color: accentColor }]}>{t("community.createSprint", "+ Create Sprint")}</Text>
              </TouchableOpacity>
            </View>

            {communityChallenges.map(ch => {
              const pct = Math.min(100, Math.round((ch.progress / ch.total) * 100));
              return (
                <View key={ch.id} style={[styles.challengeCardSpacious, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                  {/* 1. Header: Avatar + Title & Sprint Badge */}
                  <View style={styles.cardHeaderSpacious}>
                    <View style={[styles.challengeIconBadge, { backgroundColor: accentColor + '18' }]}>
                      <Text style={{ fontSize: 22 }}>{ch.progress >= ch.total ? '🏆' : '⚡'}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <Text style={[styles.challengeTitleSpacious, isDark && { color: '#F8FAFC' }]} numberOfLines={2}>
                          {ch.title}
                        </Text>
                        <View style={[styles.sprintGoalBadge, { backgroundColor: accentColor + '14', borderColor: accentColor + '30' }]}>
                          <Text style={[styles.sprintGoalBadgeText, { color: accentColor }]}>{ch.total} {t("community.days", "Days")}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* 2. Progress Tracker Section */}
                  <View style={{ marginVertical: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={[styles.progressMetaLabel, isDark && { color: '#E2E8F0' }]}>
                        <Text style={{ fontWeight: '800', color: accentColor }}>{ch.progress}</Text> {t("community.ofTotalDaysCompleted", { total: ch.total })}
                      </Text>
                      <Text style={[styles.progressPctLabel, { color: accentColor }]}>{pct}%</Text>
                    </View>

                    <View style={[styles.progressTrackSpacious, isDark && { backgroundColor: '#334155' }]}>
                      <View style={[styles.progressFillSpacious, { width: `${pct}%`, backgroundColor: accentColor }]} />
                    </View>
                  </View>

                  {/* 3. Action Footer */}
                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity 
                      style={[
                        styles.checkInBtnSpacious, 
                        !ch.joined
                          ? { backgroundColor: accentColor }
                          : (ch.progress >= ch.total || ch.checkedInToday
                              ? { backgroundColor: 'rgba(16, 185, 129, 0.14)', borderWidth: 1.5, borderColor: '#10B981' }
                              : { backgroundColor: accentColor })
                      ]} 
                      onPress={() => handleChallengeCheckIn(ch)}
                      activeOpacity={0.85}
                    >
                      <Text style={[
                        styles.checkInBtnTextSpacious, 
                        (!ch.joined || (!ch.checkedInToday && ch.progress < ch.total)) 
                          ? { color: '#FFFFFF' } 
                          : { color: '#10B981' }
                      ]}>
                        {!ch.joined 
                          ? '+ Join Study Challenge' 
                          : (ch.progress >= ch.total 
                              ? '🏆 Sprint Completed 🎉' 
                              : (ch.checkedInToday ? '✓ Checked In Today (+25 XP)' : '⚡ Daily Check-In (+25 XP)'))}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {communityChallenges.length === 0 && (
              <View style={[styles.emptyCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                <Text style={[styles.emptyText, isDark && { color: '#F8FAFC' }]}>
                  No active challenges in this community yet. Create the first study sprint!
                </Text>
              </View>
            )}
          </View>
        )}

        {detailTab === 'Members' && (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Ultra-Premium Functional Invite Banner */}
            <TouchableOpacity 
              style={[
                styles.inviteBanner, 
                isDark 
                  ? { backgroundColor: '#1E293B', borderColor: '#334155' } 
                  : { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' }
              ]}
              onPress={handleCopyInviteLink}
              activeOpacity={0.85}
            >
              {/* Icon Badge */}
              <View style={[styles.inviteIconBadge, { backgroundColor: accentColor + '1A' }]}>
                <UsersIcon size={22} color={accentColor} />
              </View>

              {/* Text Info */}
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.inviteTitle, isDark && { color: '#F8FAFC' }]}>
                  Invite Classmates & Peers
                </Text>
                <Text style={[styles.inviteSub, isDark && { color: '#CBD5E1' }]}>
                  Share community link to study together
                </Text>
              </View>

              {/* Copy Action Button with Feedback Animation */}
              <TouchableOpacity 
                style={[
                  styles.copyLinkBtnPill, 
                  isInviteLinkCopied ? { backgroundColor: '#10B981' } : { backgroundColor: accentColor }
                ]}
                onPress={handleCopyInviteLink}
                activeOpacity={0.8}
              >
                <Text style={styles.copyLinkBtnText}>
                  {isInviteLinkCopied ? 'Copied! ✓' : 'Copy Link'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 12 }}>
              <Text style={[styles.sectionHeading, isDark && { color: '#F8FAFC' }]}>
                {t("community.communityMembers", "Community Members")} ({activeCommunity?.membersCount || selectedCommunity?.membersCount || 1})
              </Text>
            </View>

            {/* Ultra-Premium Members Card Container */}
            <View style={[styles.membersCardContainer, isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' }]}>
              {/* Current User */}
              <View style={[styles.memberRowItemPremium, isDark && { borderBottomWidth: 0, borderBottomColor: 'transparent' }]}>
                <View style={{ position: 'relative' }}>
                  <View style={[styles.memberAvatarPremium, { backgroundColor: accentColor }]}>
                    <Text style={styles.memberAvatarText}>{(user?.name || 'A')[0]}</Text>
                  </View>
                  <View style={[styles.onlineDotCorner, isDark && { borderColor: '#1E293B' }]} />
                </View>

                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text style={[styles.memberNamePremium, isDark && { color: '#F8FAFC' }]}>{user?.name || 'Alex'}</Text>
                    <View style={[styles.roleBadgePremium, { backgroundColor: accentColor + '1A' }]}>
                      <Text style={[styles.roleBadgeTextPremium, { color: accentColor }]}>You {selectedCommunity?.isHost ? '• Host 👑' : ''}</Text>
                    </View>
                  </View>
                  <Text style={[styles.memberMetaPremium, isDark && { color: '#CBD5E1' }]}>
                    Level {currentLevel} • Active Member • 🔥 4d Streak
                  </Text>
                </View>
              </View>

              {/* Mock Peer Members with Rich Roles */}
              {[
                { id: 'm-1', name: 'Sarah Jenkins', role: 'Host 👑', badgeBg: 'rgba(245, 158, 11, 0.15)', badgeColor: '#D97706', level: 'Level 8 • 4,200 XP', streak: 12, isOnline: true, avatarBg: '#2D62FF' },
                { id: 'm-2', name: 'David Chen', role: 'Moderator 🛡️', badgeBg: 'rgba(99, 102, 241, 0.15)', badgeColor: '#4F46E5', level: 'Level 6 • 2,850 XP', streak: 9, isOnline: true, avatarBg: '#6366F1' },
                { id: 'm-3', name: 'Maya Patel', role: 'Top Contributor ⭐', badgeBg: 'rgba(14, 165, 233, 0.15)', badgeColor: '#0284C7', level: 'Level 7 • 3,400 XP', streak: 15, isOnline: false, avatarBg: '#0EA5E9' },
                { id: 'm-4', name: 'Emmanuel Eze', role: 'Peer Tutor 🎓', badgeBg: 'rgba(16, 185, 129, 0.15)', badgeColor: '#059669', level: 'Level 5 • 1,920 XP', streak: 5, isOnline: true, avatarBg: '#10B981' },
                { id: 'm-5', name: 'Fatima Abubakar', role: 'Member', badgeBg: '#F1F5F9', badgeColor: '#475569', level: 'Level 4 • 1,100 XP', streak: 4, isOnline: false, avatarBg: '#F59E0B' },
              ].map((m, idx, arr) => (
                <View 
                  key={m.id} 
                  style={[
                    styles.memberRowItemPremium, 
                    idx === arr.length - 1 && { borderBottomWidth: 0 },
                    isDark && { borderBottomWidth: 0, borderBottomColor: 'transparent' }
                  ]}
                >
                  <View style={{ position: 'relative' }}>
                    <View style={[styles.memberAvatarPremium, { backgroundColor: m.avatarBg }]}>
                      <Text style={styles.memberAvatarText}>{m.name[0]}</Text>
                    </View>
                    {m.isOnline && <View style={[styles.onlineDotCorner, isDark && { borderColor: '#1E293B' }]} />}
                  </View>

                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <Text style={[styles.memberNamePremium, isDark && { color: '#F8FAFC' }]}>{m.name}</Text>
                      <View style={[styles.roleBadgePremium, { backgroundColor: isDark && m.role === 'Member' ? '#334155' : m.badgeBg }]}>
                        <Text style={[styles.roleBadgeTextPremium, { color: isDark && m.role === 'Member' ? '#CBD5E1' : m.badgeColor }]}>{m.role}</Text>
                      </View>
                    </View>
                    <Text style={[styles.memberMetaPremium, isDark && { color: '#CBD5E1' }]}>
                      {m.level} • 🔥 {m.streak}d Streak
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {detailTab === 'Rules & Safety' && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.sectionHeading, isDark && { color: '#F8FAFC' }, { marginBottom: 14 }]}>
              Community Guidelines & Safety
            </Text>

            <View style={styles.rulesList}>
              {(activeCommunity?.rules ? getLocalizedRules(activeCommunity.rules, currentLang) : localizedRules).map((rule, idx) => (
                <View key={rule.id || idx} style={[styles.ruleCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                  <Text style={styles.ruleIcon}>{rule.icon || '📌'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ruleTitle, isDark && { color: '#F8FAFC' }]}>{rule.title}</Text>
                    <Text style={[styles.ruleDesc, isDark && { color: '#CBD5E1' }]}>{rule.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={{ marginTop: 28, gap: 12 }}>
              <TouchableOpacity 
                style={[
                  styles.actionCardTilePremium, 
                  isDark 
                    ? { backgroundColor: '#1E293B', borderColor: 'rgba(239, 68, 68, 0.4)' } 
                    : { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }
                ]} 
                onPress={() => setReportModalOpen(true)} 
                activeOpacity={0.85}
              >
                <View style={[styles.actionCardIconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <ShieldIcon size={20} color={Colors.error} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionCardTitle, { color: Colors.error }]}>Report Community</Text>
                  <Text style={[styles.actionCardSub, isDark && { color: '#94A3B8' }]}>Flag safety or policy issues for review</Text>
                </View>
                <ChevronRightIcon size={18} color={Colors.error} />
              </TouchableOpacity>

              {activeCommunity?.joined && (
                <TouchableOpacity 
                  style={[
                    styles.actionCardTilePremium, 
                    isDark 
                      ? { backgroundColor: '#1E293B', borderColor: '#334155' } 
                      : { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }
                  ]} 
                  onPress={handleLeaveCommunityConfirm} 
                  activeOpacity={0.85}
                >
                  <View style={[styles.actionCardIconBadge, { backgroundColor: 'rgba(100, 116, 139, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>🚪</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.actionCardTitle, isDark ? { color: '#E2E8F0' } : { color: '#475569' }]}>Leave Community</Text>
                    <Text style={[styles.actionCardSub, isDark && { color: '#94A3B8' }]}>Remove yourself from discussions & study sprints</Text>
                  </View>
                  <ChevronRightIcon size={18} color={isDark ? '#64748B' : '#94A3B8'} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
    );
  };

  return (
    <View style={[styles.root, isDark && { backgroundColor: '#0B0F19' }]}>
      <StatusBar barStyle={isDark || selectedCommunity ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      {selectedCommunity ? renderCommunityDetail() : (
         <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
           {renderCommunityHome()}
         </SafeAreaView>
      )}

      {/* ── CREATE NEW POST MODAL (DEDICATED ARRANGEMENT FOR EACH TYPE) ── */}
      <Modal visible={isCreatePostOpen} animationType="slide" transparent onRequestClose={() => setCreatePostOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { height: '88%', maxHeight: '94%' }, isDark && { backgroundColor: '#0F172A' }]}>
            <View style={styles.dragHandle} />
            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.modalSheetTitle, isDark && { color: '#F8FAFC' }]}>
                  {postType === 'tip' ? '💡 Share Study Tip' : postType === 'question' ? '❓ Ask a Question' : '📚 Share Study Notes'}
                </Text>
                <Text style={[styles.modalSheetSub, isDark && { color: '#94A3B8' }]}>
                  {postType === 'tip'
                    ? 'Share a formula trick, mnemonic, or study technique'
                    : postType === 'question'
                    ? 'Get step-by-step help from peers & community'
                    : 'Share high-yield summaries, formulas & resources'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setCreatePostOpen(false)} style={styles.closeBtnCircle}>
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Segmented Type Switcher */}
            <View style={[styles.postTypeSwitcher, isDark && styles.postTypeSwitcherDark]}>
              <TouchableOpacity
                style={[
                  styles.postTypeOption,
                  postType === 'tip' && [styles.postTypeOptionActive, { borderColor: '#F59E0B', backgroundColor: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FEF3C7' }],
                ]}
                onPress={() => setPostType('tip')}
                activeOpacity={0.8}
              >
                <Text style={styles.postTypeOptionEmoji}>💡</Text>
                <Text style={[styles.postTypeOptionText, postType === 'tip' && { color: '#D97706', fontWeight: '800' }, isDark && postType !== 'tip' && { color: '#94A3B8' }]}>
                  Study Tip
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.postTypeOption,
                  postType === 'question' && [styles.postTypeOptionActive, { borderColor: '#EF4444', backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2' }],
                ]}
                onPress={() => setPostType('question')}
                activeOpacity={0.8}
              >
                <Text style={styles.postTypeOptionEmoji}>❓</Text>
                <Text style={[styles.postTypeOptionText, postType === 'question' && { color: '#DC2626', fontWeight: '800' }, isDark && postType !== 'question' && { color: '#94A3B8' }]}>
                  Question
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.postTypeOption,
                  postType === 'notes' && [styles.postTypeOptionActive, { borderColor: '#10B981', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.18)' : '#D1FAE5' }],
                ]}
                onPress={() => setPostType('notes')}
                activeOpacity={0.8}
              >
                <Text style={styles.postTypeOptionEmoji}>📚</Text>
                <Text style={[styles.postTypeOptionText, postType === 'notes' && { color: '#059669', fontWeight: '800' }, isDark && postType !== 'notes' && { color: '#94A3B8' }]}>
                  Notes
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 28 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* ─── ARRANGEMENT 1: STUDY TIP ─── */}
              {postType === 'tip' && (
                <View style={styles.formGroupCustom}>
                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Concept or Trick Name *</Text>
                    <TextInput
                      style={[styles.modalTextInput, isDark && styles.modalTextInputDark]}
                      placeholder="e.g. LIATE Rule for Integration by Parts"
                      placeholderTextColor="#94A3B8"
                      value={tipTitle}
                      onChangeText={setTipTitle}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Subject Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'General Study'].map((subj) => (
                        <TouchableOpacity
                          key={subj}
                          style={[
                            styles.subjectChipPill,
                            tipSubject === subj && [styles.subjectChipPillActive, { borderColor: '#F59E0B', backgroundColor: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FEF3C7' }],
                            isDark && tipSubject !== subj && styles.subjectChipPillDark,
                          ]}
                          onPress={() => setTipSubject(subj)}
                        >
                          <Text style={[styles.subjectChipText, tipSubject === subj && { color: '#D97706', fontWeight: '800' }, isDark && tipSubject !== subj && { color: '#94A3B8' }]}>
                            {subj}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>How It Works / Steps *</Text>
                    <TextInput
                      style={[styles.modalTextInput, styles.modalTextAreaCustom, isDark && styles.modalTextInputDark]}
                      placeholder="Explain the shortcut, formula order, or technique clearly step-by-step..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={4}
                      value={tipMethod}
                      onChangeText={setTipMethod}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Pro Tip / Key Takeaway</Text>
                    <TextInput
                      style={[styles.modalTextInput, { height: 74, paddingTop: 10, textAlignVertical: 'top' }, isDark && styles.modalTextInputDark]}
                      placeholder="e.g. Saves ~5 mins per question on exam; watch out for negative signs!"
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={2}
                      value={tipTakeaway}
                      onChangeText={setTipTakeaway}
                    />
                  </View>
                </View>
              )}

              {/* ─── ARRANGEMENT 2: ASK QUESTION ─── */}
              {postType === 'question' && (
                <View style={styles.formGroupCustom}>
                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>What's your question? *</Text>
                    <TextInput
                      style={[styles.modalTextInput, isDark && styles.modalTextInputDark]}
                      placeholder="e.g. Why does acceleration equal zero at terminal velocity?"
                      placeholderTextColor="#94A3B8"
                      value={questionTitle}
                      onChangeText={setQuestionTitle}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Subject</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {['Physics', 'Mathematics', 'Chemistry', 'JAMB / WAEC', 'Computer Science'].map((subj) => (
                        <TouchableOpacity
                          key={subj}
                          style={[
                            styles.subjectChipPill,
                            questionSubject === subj && [styles.subjectChipPillActive, { borderColor: '#EF4444', backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2' }],
                            isDark && questionSubject !== subj && styles.subjectChipPillDark,
                          ]}
                          onPress={() => setQuestionSubject(subj)}
                        >
                          <Text style={[styles.subjectChipText, questionSubject === subj && { color: '#DC2626', fontWeight: '800' }, isDark && questionSubject !== subj && { color: '#94A3B8' }]}>
                            {subj}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Problem Details *</Text>
                    <TextInput
                      style={[styles.modalTextInput, styles.modalTextAreaCustom, isDark && styles.modalTextInputDark]}
                      placeholder="Paste the problem statement, formula, or question number..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={4}
                      value={questionDetails}
                      onChangeText={setQuestionDetails}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>What I've Tried / Where I'm Stuck</Text>
                    <TextInput
                      style={[styles.modalTextInput, { height: 74, paddingTop: 10, textAlignVertical: 'top' }, isDark && styles.modalTextInputDark]}
                      placeholder="e.g. I used F = ma and got mg - R, but don't know how R relates to velocity..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={2}
                      value={questionTried}
                      onChangeText={setQuestionTried}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Urgency Level</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {[
                        { id: 'Normal', label: '🟢 Normal Study' },
                        { id: 'Assignment', label: '🟡 Assignment Help' },
                        { id: 'Urgent', label: '🔴 Urgent (Exam Soon)' },
                      ].map((urg) => (
                        <TouchableOpacity
                          key={urg.id}
                          style={[
                            styles.urgencyPill,
                            questionUrgency === urg.id && styles.urgencyPillActive,
                            isDark && questionUrgency !== urg.id && styles.urgencyPillDark,
                          ]}
                          onPress={() => setQuestionUrgency(urg.id)}
                        >
                          <Text style={[styles.urgencyPillText, questionUrgency === urg.id && { fontWeight: '800', color: accentColor }]}>
                            {urg.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {/* ─── ARRANGEMENT 3: STUDY NOTES ─── */}
              {postType === 'notes' && (
                <View style={styles.formGroupCustom}>
                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Notes & Topic Title *</Text>
                    <TextInput
                      style={[styles.modalTextInput, isDark && styles.modalTextInputDark]}
                      placeholder="e.g. JAMB Physics 2015-2023 Past Q&A Compilation"
                      placeholderTextColor="#94A3B8"
                      value={notesTitle}
                      onChangeText={setNotesTitle}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Subject Area</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {['Physics', 'Chemistry', 'Biology', 'Exam Prep', 'Economics', 'Literature'].map((subj) => (
                        <TouchableOpacity
                          key={subj}
                          style={[
                            styles.subjectChipPill,
                            notesSubject === subj && [styles.subjectChipPillActive, { borderColor: '#10B981', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.18)' : '#D1FAE5' }],
                            isDark && notesSubject !== subj && styles.subjectChipPillDark,
                          ]}
                          onPress={() => setNotesSubject(subj)}
                        >
                          <Text style={[styles.subjectChipText, notesSubject === subj && { color: '#059669', fontWeight: '800' }, isDark && notesSubject !== subj && { color: '#94A3B8' }]}>
                            {subj}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Overview & Key Points *</Text>
                    <TextInput
                      style={[styles.modalTextInput, styles.modalTextAreaCustom, isDark && styles.modalTextInputDark]}
                      placeholder="• Summary of core formulas&#10;• Most repeated exam questions&#10;• Step-by-step solutions for chapters 1-5"
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={4}
                      value={notesHighlights}
                      onChangeText={setNotesHighlights}
                    />
                  </View>

                  <View style={styles.fieldBlock}>
                    <Text style={[styles.inputLabelCustom, isDark && { color: '#E2E8F0' }]}>Drive / PDF Link (Optional)</Text>
                    <TextInput
                      style={[styles.modalTextInput, isDark && styles.modalTextInputDark]}
                      placeholder="https://drive.google.com/..."
                      placeholderTextColor="#94A3B8"
                      value={notesLink}
                      onChangeText={setNotesLink}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.modalActionBtnCustom,
                  {
                    backgroundColor: postType === 'tip' ? '#D97706' : postType === 'question' ? '#DC2626' : '#059669',
                  },
                ]}
                onPress={handleCreatePostSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.modalActionBtnText}>
                  {postType === 'tip'
                    ? '💡 Publish Study Tip (+25 XP)'
                    : postType === 'question'
                    ? '❓ Ask Question (+25 XP)'
                    : '📚 Publish Notes (+25 XP)'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── CREATE STUDY GROUP MODAL ─────────────────────────────────── */}
      <Modal visible={isCreateGroupOpen} animationType="slide" transparent onRequestClose={() => setCreateGroupOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, { height: '88%', maxHeight: '94%' }, isDark && { backgroundColor: '#0F172A' }]}>
            <View style={styles.dragHandle} />
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={[styles.modalSheetTitle, isDark && { color: '#F8FAFC' }]}>Create Community</Text>
                <Text style={styles.modalSheetSub}>Tailor your study group for your peers</Text>
              </View>
              <TouchableOpacity onPress={() => setCreateGroupOpen(false)} style={styles.closeBtnCircle}>
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Live Preview Header Card */}
              <View style={[styles.createPreviewCardClean, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                <View style={styles.createPreviewHeader}>
                  <View style={[styles.createPreviewAvatarClean, { backgroundColor: newGroupAvatarBg || accentColor, overflow: 'hidden' }]}>
                    {customAvatarUri ? (
                      <Image source={{ uri: customAvatarUri }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <Text style={styles.createPreviewAvatarTextClean}>{newGroupAvatarIcon || newGroupName?.[0]?.toUpperCase() || '🎓'}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={[styles.categoryTagPill, { backgroundColor: (newGroupAvatarBg || accentColor) + '18' }]}>
                      <Text style={[styles.categoryTagText, { color: newGroupAvatarBg || accentColor }]}>
                        {newGroupCategory} • {newGroupSubject}
                      </Text>
                    </View>
                    <Text style={[styles.createPreviewTitleClean, isDark && { color: '#F8FAFC' }]}>
                      {newGroupName || 'Your Community Name'}
                    </Text>
                  </View>
                  <View style={[styles.createPreviewHostBadgeClean, isDark && { backgroundColor: '#334155', borderColor: '#475569' }]}>
                    <Text style={styles.createPreviewHostBadgeTextClean}>Host 👑</Text>
                  </View>
                </View>
                <Text style={[styles.createPreviewDescClean, isDark && { color: '#CBD5E1' }]}>
                  {newGroupDesc || 'Your community description will appear here as you type...'}
                </Text>
              </View>

              {/* ⚡ 1-Tap Quick Start Templates */}
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.inputLabel, { marginTop: 4 }, isDark && { color: '#CBD5E1' }]}>
                  ⚡ 1-Tap Quick Start Templates
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
                  {QUICK_COMMUNITY_TEMPLATES.map((tpl) => (
                    <TouchableOpacity
                      key={tpl.name}
                      style={[
                        styles.quickTemplatePill,
                        isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                        newGroupName === tpl.name && { borderColor: accentColor, backgroundColor: accentColor + '15', borderWidth: 2 }
                      ]}
                      onPress={() => handleApplyQuickTemplate(tpl)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontSize: 16 }}>{tpl.icon}</Text>
                      <Text style={[styles.quickTemplateText, isDark && { color: '#F8FAFC' }, newGroupName === tpl.name && { color: accentColor }]}>
                        {tpl.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                {/* 1. Community Name */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Community Name *</Text>
                  <Text style={{ fontSize: 12, color: newGroupName.length >= 80 ? Colors.error : '#94A3B8', marginTop: 14, fontWeight: '600' }}>
                    {newGroupName.length}/80
                  </Text>
                </View>
                <TextInput
                  style={[styles.modalTextInput, isDark && { backgroundColor: '#1E293B', color: '#F8FAFC' }]}
                  placeholder="e.g. Organic Chem Mastery Squad"
                  placeholderTextColor="#94A3B8"
                  maxLength={80}
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                />

                {/* 2. Category */}
                <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Category & Discovery Group</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                  {[
                    { label: 'Exam Prep', icon: '📝' },
                    { label: 'Subjects', icon: '📚' },
                    { label: 'Study Skills', icon: '⚡' },
                    { label: 'University & STEM', icon: '🏛️' },
                    { label: 'Trending', icon: '🔥' },
                  ].map(({ label, icon }) => {
                    const isSelected = newGroupCategory === label;
                    return (
                      <TouchableOpacity
                        key={label}
                        style={[
                          styles.choicePillPremium,
                          isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                          isSelected && { backgroundColor: accentColor + '18', borderColor: accentColor, borderWidth: 2 },
                        ]}
                        onPress={() => setNewGroupCategory(label)}
                        activeOpacity={0.85}
                      >
                        <Text style={{ fontSize: 14 }}>{icon}</Text>
                        <Text style={[
                          styles.choicePillTextPremium, 
                          isDark && { color: '#CBD5E1' }, 
                          isSelected && { color: accentColor, fontWeight: '800' }
                        ]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* 3. Subject Focus */}
                <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Primary Subject</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                  {[
                    { label: 'Mathematics', icon: '📐' },
                    { label: 'Chemistry', icon: '🧪' },
                    { label: 'Physics', icon: '⚡' },
                    { label: 'Biology', icon: '🧬' },
                    { label: 'Computer Science', icon: '💻' },
                    { label: 'General Study', icon: '📖' },
                  ].map(({ label, icon }) => {
                    const isSelected = newGroupSubject === label;
                    return (
                      <TouchableOpacity
                        key={label}
                        style={[
                          styles.choicePillPremium,
                          isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                          isSelected && { backgroundColor: accentColor + '18', borderColor: accentColor, borderWidth: 2 },
                        ]}
                        onPress={() => setNewGroupSubject(label)}
                        activeOpacity={0.85}
                      >
                        <Text style={{ fontSize: 14 }}>{icon}</Text>
                        <Text style={[
                          styles.choicePillTextPremium, 
                          isDark && { color: '#CBD5E1' }, 
                          isSelected && { color: accentColor, fontWeight: '800' }
                        ]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* 4. About / Bio */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>About & Community Bio *</Text>
                  <Text style={{ fontSize: 12, color: newGroupDesc.length >= 120 ? Colors.error : '#94A3B8', marginTop: 14, fontWeight: '600' }}>
                    {newGroupDesc.length}/120
                  </Text>
                </View>
                <TextInput
                  style={[styles.modalTextInput, styles.modalTextArea, isDark && { backgroundColor: '#1E293B', color: '#F8FAFC' }]}
                  placeholder="What is this community about? Share your goals, study guidelines, and topic highlights..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  maxLength={120}
                  value={newGroupDesc}
                  onChangeText={setNewGroupDesc}
                />

                {/* 5. Privacy Mode */}
                <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Privacy & Access</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {/* Public Card */}
                  <TouchableOpacity
                    style={[
                      styles.privacyCardPremium,
                      isDark 
                        ? { backgroundColor: '#1E293B', borderColor: '#334155' } 
                        : { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
                      newGroupPrivacy === 'public' && { 
                        borderColor: accentColor, 
                        borderWidth: 2,
                        backgroundColor: isDark ? 'rgba(45, 98, 255, 0.12)' : 'rgba(45, 98, 255, 0.05)',
                      },
                    ]}
                    onPress={() => setNewGroupPrivacy('public')}
                    activeOpacity={0.85}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                      <View style={[styles.privacyIconBadge, { backgroundColor: newGroupPrivacy === 'public' ? accentColor + '20' : (isDark ? '#334155' : '#F1F5F9') }]}>
                        <Text style={{ fontSize: 16 }}>🌐</Text>
                      </View>
                      <View style={[styles.radioDotCircle, newGroupPrivacy === 'public' && { borderColor: accentColor, backgroundColor: accentColor }]}>
                        {newGroupPrivacy === 'public' && <View style={styles.radioDotInner} />}
                      </View>
                    </View>
                    <Text style={[styles.privacyCardTitle, isDark && { color: '#F8FAFC' }, newGroupPrivacy === 'public' && { color: accentColor, fontWeight: '800' }]}>Public</Text>
                    <Text style={styles.privacyCardSub}>Open to all students. Anyone can join instantly.</Text>
                  </TouchableOpacity>

                  {/* Private Card */}
                  <TouchableOpacity
                    style={[
                      styles.privacyCardPremium,
                      isDark 
                        ? { backgroundColor: '#1E293B', borderColor: '#334155' } 
                        : { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
                      newGroupPrivacy === 'private' && { 
                        borderColor: accentColor, 
                        borderWidth: 2,
                        backgroundColor: isDark ? 'rgba(45, 98, 255, 0.12)' : 'rgba(45, 98, 255, 0.05)',
                      },
                    ]}
                    onPress={() => setNewGroupPrivacy('private')}
                    activeOpacity={0.85}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                      <View style={[styles.privacyIconBadge, { backgroundColor: newGroupPrivacy === 'private' ? accentColor + '20' : (isDark ? '#334155' : '#F1F5F9') }]}>
                        <Text style={{ fontSize: 16 }}>🔒</Text>
                      </View>
                      <View style={[styles.radioDotCircle, newGroupPrivacy === 'private' && { borderColor: accentColor, backgroundColor: accentColor }]}>
                        {newGroupPrivacy === 'private' && <View style={styles.radioDotInner} />}
                      </View>
                    </View>
                    <Text style={[styles.privacyCardTitle, isDark && { color: '#F8FAFC' }, newGroupPrivacy === 'private' && { color: accentColor, fontWeight: '800' }]}>Private</Text>
                    <Text style={styles.privacyCardSub}>Members must be invited or approved by host.</Text>
                  </TouchableOpacity>
                </View>

                {/* 6. Theme Color */}
                <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Community Banner & Theme Color</Text>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 4 }}>
                  {['#2D62FF', '#10B981', '#6366F1', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899'].map((c) => {
                    const isSelected = newGroupAvatarBg === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[
                          styles.colorSwatchRing,
                          isSelected && { borderColor: c, borderWidth: 2.5 }
                        ]}
                        onPress={() => setNewGroupAvatarBg(c)}
                        activeOpacity={0.85}
                      >
                        <View style={[styles.colorSwatchInner, { backgroundColor: c }]}>
                          {isSelected && (
                            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '900' }}>✓</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* 6b. Community Profile Avatar Icon & Device Upload */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Community Profile Avatar</Text>
                  {customAvatarUri && (
                    <TouchableOpacity onPress={() => setCustomAvatarUri(null)}>
                      <Text style={{ fontSize: 12, color: Colors.error, fontWeight: '700', marginTop: 14 }}>Remove Photo ✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginTop: 4 }}>
                  {/* Premium Upload Custom Image Tile */}
                  <TouchableOpacity
                    style={[
                      styles.avatarPickerUploadTilePremium,
                      { backgroundColor: accentColor + '12', borderColor: accentColor },
                      isDark && { backgroundColor: '#1E293B', borderColor: accentColor },
                      customAvatarUri && { borderWidth: 2.5, backgroundColor: accentColor + '20' }
                    ]}
                    onPress={handlePickCommunityImage}
                    activeOpacity={0.8}
                  >
                    {customAvatarUri ? (
                      <Image source={{ uri: customAvatarUri }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                    ) : (
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18 }}>📸</Text>
                        <View style={[styles.plusBadgeCorner, { backgroundColor: accentColor }]}>
                          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900', marginTop: -1 }}>+</Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Preset Emoji Avatars */}
                  {['🎓', '🧪', '📐', '💻', '📚', '📝', '⚡', '🧬', '⚖️', '🎨', '🏆', '🚀', '🌐', '🔥'].map((ico) => {
                    const isSelected = !customAvatarUri && newGroupAvatarIcon === ico;
                    return (
                      <TouchableOpacity
                        key={ico}
                        style={[
                          styles.avatarPickerTile,
                          isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                          isSelected && { borderColor: accentColor, backgroundColor: accentColor + '18', borderWidth: 2.5 }
                        ]}
                        onPress={() => {
                          setCustomAvatarUri(null);
                          setNewGroupAvatarIcon(ico);
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={{ fontSize: 22 }}>{ico}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* 7. Target Level */}
                <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Target Grade / Level</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                  {[
                    { label: 'All Levels', icon: '🎓' },
                    { label: 'High School (WAEC / JAMB)', icon: '🏫' },
                    { label: 'University / STEM', icon: '🏛️' },
                    { label: 'Postgraduate', icon: '📜' },
                  ].map(({ label, icon }) => {
                    const isSelected = newGroupLevel === label;
                    return (
                      <TouchableOpacity
                        key={label}
                        style={[
                          styles.choicePillPremium,
                          isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                          isSelected && { backgroundColor: accentColor + '18', borderColor: accentColor, borderWidth: 2 },
                        ]}
                        onPress={() => setNewGroupLevel(label)}
                        activeOpacity={0.85}
                      >
                        <Text style={{ fontSize: 14 }}>{icon}</Text>
                        <Text style={[
                          styles.choicePillTextPremium, 
                          isDark && { color: '#CBD5E1' }, 
                          isSelected && { color: accentColor, fontWeight: '800' }
                        ]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* 8. Community Guidelines & Rules */}
                <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Community Guidelines & Rules</Text>
                
                {/* Segmented Control Switcher */}
                <View style={[styles.ruleSegmentContainer, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                  <TouchableOpacity
                    style={[
                      styles.ruleSegmentTab,
                      ruleMode === 'preset' && [styles.ruleSegmentTabActive, isDark && { backgroundColor: '#0F172A' }],
                    ]}
                    onPress={() => setRuleMode('preset')}
                    activeOpacity={0.85}
                  >
                    <Text style={{ fontSize: 14 }}>📋</Text>
                    <Text style={[
                      styles.ruleSegmentTabText, 
                      isDark && { color: '#94A3B8' }, 
                      ruleMode === 'preset' && { color: accentColor, fontWeight: '800' }
                    ]}>
                      Preset Standard Rules
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.ruleSegmentTab,
                      ruleMode === 'custom' && [styles.ruleSegmentTabActive, isDark && { backgroundColor: '#0F172A' }],
                    ]}
                    onPress={() => setRuleMode('custom')}
                    activeOpacity={0.85}
                  >
                    <Text style={{ fontSize: 14 }}>⚙️</Text>
                    <Text style={[
                      styles.ruleSegmentTabText, 
                      isDark && { color: '#94A3B8' }, 
                      ruleMode === 'custom' && { color: accentColor, fontWeight: '800' }
                    ]}>
                      Custom Personalized Rules
                    </Text>
                  </TouchableOpacity>
                </View>

                {ruleMode === 'preset' ? (
                  <View style={{ gap: 10, marginTop: 4 }}>
                    {DEFAULT_COMMUNITY_RULES.map((rule) => (
                      <View 
                        key={rule.id} 
                        style={[
                          styles.presetRuleCardPremium, 
                          isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }
                        ]}
                      >
                        <View style={[styles.ruleIconBadgeCircle, { backgroundColor: accentColor + '14' }]}>
                          <Text style={{ fontSize: 18 }}>{rule.icon}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.presetRuleTitlePremium, isDark && { color: '#F8FAFC' }]}>
                            {rule.title}
                          </Text>
                          <Text style={[styles.presetRuleSubPremium, isDark && { color: '#CBD5E1' }]}>
                            {rule.desc}
                          </Text>
                        </View>
                        <View style={[styles.ruleStatusPill, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                          <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '800' }}>✓ Active</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={{ gap: 12, marginTop: 4 }}>
                    {/* Quick-Add Preset Rules Chips */}
                    <View style={{ marginBottom: 4 }}>
                      <Text style={[styles.inputLabel, { marginTop: 0, marginBottom: 8 }, isDark && { color: '#CBD5E1' }]}>
                        ⚡ Quick-Add Preset Rules
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {DEFAULT_COMMUNITY_RULES.map((preset) => {
                          const isAlreadyAdded = customRules.some((r) => r.title === preset.title);
                          const cleanLabel = preset.title.replace(/^\d+\.\s*/, '');
                          return (
                            <TouchableOpacity
                              key={preset.id}
                              style={[
                                styles.presetQuickAddChip,
                                isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                                isAlreadyAdded && { backgroundColor: accentColor + '14', borderColor: accentColor }
                              ]}
                              onPress={() => handleAddPresetToCustom(preset)}
                              activeOpacity={0.8}
                              disabled={isAlreadyAdded}
                            >
                              <Text style={{ fontSize: 13 }}>{preset.icon}</Text>
                              <Text style={[
                                styles.presetQuickAddChipText,
                                isDark && { color: '#CBD5E1' },
                                isAlreadyAdded && { color: accentColor, fontWeight: '800' }
                              ]}>
                                {isAlreadyAdded ? `✓ ${cleanLabel}` : `+ ${cleanLabel}`}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>

                    <View style={[styles.customRuleFormBox, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                      <Text style={[styles.inputLabel, { marginTop: 0 }, isDark && { color: '#CBD5E1' }]}>Rule Title *</Text>
                      <TextInput
                        style={[styles.modalTextInput, { height: 42 }, isDark && { backgroundColor: '#0F172A', color: '#F8FAFC' }]}
                        placeholder="e.g. Submit Weekly Assignments"
                        placeholderTextColor="#94A3B8"
                        value={newRuleTitle}
                        onChangeText={setNewRuleTitle}
                      />

                      <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Rule Description</Text>
                      <TextInput
                        style={[styles.modalTextInput, { height: 42 }, isDark && { backgroundColor: '#0F172A', color: '#F8FAFC' }]}
                        placeholder="Brief detail explaining rule requirement..."
                        placeholderTextColor="#94A3B8"
                        value={newRuleDesc}
                        onChangeText={setNewRuleDesc}
                      />

                      <TouchableOpacity
                        style={[styles.addRuleBtn, { backgroundColor: accentColor }]}
                        onPress={() => {
                          if (!newRuleTitle.trim()) return;
                          const addedRule = {
                            id: `cr-${Date.now()}`,
                            icon: '📌',
                            title: newRuleTitle.trim().replace(/^\d+\.\s*/, ''),
                            desc: newRuleDesc.trim() || 'Follow host guidelines.',
                          };
                          setCustomRules((prev) => [...prev, addedRule]);
                          setNewRuleTitle('');
                          setNewRuleDesc('');
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>+ Add Custom Rule</Text>
                      </TouchableOpacity>
                    </View>

                    {customRules.map((rule) => {
                      const cleanTitle = rule.title.replace(/^\d+\.\s*/, '');
                      return (
                        <View key={rule.id} style={[styles.presetRuleCardPremium, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                          <View style={[styles.ruleIconBadgeCircle, { backgroundColor: accentColor + '14' }]}>
                            <Text style={{ fontSize: 18 }}>{rule.icon}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.presetRuleTitlePremium, isDark && { color: '#F8FAFC' }]}>{cleanTitle}</Text>
                            <Text style={[styles.presetRuleSubPremium, isDark && { color: '#CBD5E1' }]}>{rule.desc}</Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.deleteRuleBtnCircle, isDark && { backgroundColor: 'rgba(239, 68, 68, 0.18)' }]}
                            onPress={() => setCustomRules((prev) => prev.filter((r) => r.id !== rule.id))}
                            activeOpacity={0.7}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 13 }}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: accentColor, marginTop: 16 }]} onPress={handleCreateGroupSubmit} activeOpacity={0.85}>
              <Text style={styles.modalActionBtnText}>Launch Community 🚀</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── JOIN REQUIRED MODAL SHEET ────────────────────────────────────── */}
      <Modal visible={isJoinRequiredModalOpen} animationType="slide" transparent onRequestClose={() => setJoinRequiredModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, isDark && { backgroundColor: '#0F172A' }]}>
            <View style={styles.dragHandle} />

            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.modalBadgeIcon, { backgroundColor: accentColor + '20' }]}>
                  <UsersIcon size={22} color={accentColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalSheetTitle, isDark && { color: '#F8FAFC' }]} numberOfLines={1}>
                    Join {selectedCommunity?.name || 'Community'}
                  </Text>
                  <Text style={styles.modalSheetSub}>Membership required to post & comment</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setJoinRequiredModalOpen(false)} style={styles.closeBtnCircle}>
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <View style={[styles.modalNoticeBox, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
              <Text style={[styles.modalNoticeText, isDark && { color: '#E2E8F0' }]}>
                You must be a member of <Text style={{ fontWeight: '700', color: accentColor }}>{selectedCommunity?.name}</Text> to start discussions, share study notes, or comment on posts.
              </Text>
            </View>

            <View style={styles.benefitsList}>
              <View style={styles.benefitRow}>
                <Text style={styles.benefitBullet}>💬</Text>
                <Text style={[styles.benefitText, isDark && { color: '#CBD5E1' }]}>Ask questions & share study notes</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.benefitBullet}>💡</Text>
                <Text style={[styles.benefitText, isDark && { color: '#CBD5E1' }]}>Leave comments on peer discussions</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.benefitBullet}>⚡</Text>
                <Text style={[styles.benefitText, isDark && { color: '#CBD5E1' }]}>Participate in study challenges & sprints</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.modalActionBtn, { backgroundColor: accentColor, marginTop: 16 }]} 
              onPress={handleJoinFromModal}
              activeOpacity={0.85}
            >
              <Text style={styles.modalActionBtnText}>Join Community Now ✓</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ marginTop: 12, paddingVertical: 10, alignItems: 'center' }} 
              onPress={() => setJoinRequiredModalOpen(false)}
            >
              <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '600' }}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── COMMENTS DRAWER MODAL ────────────────────────────────────── */}
      <Modal visible={!!selectedPostForComments} animationType="slide" transparent onRequestClose={() => setSelectedPostForComments(null)}>
        {(() => {
          const activePostComments = (selectedPostForComments?.comments && selectedPostForComments.comments.length > 0)
            ? selectedPostForComments.comments
            : (DEFAULT_POST_COMMENTS[selectedPostForComments?.id] || []);

          return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
              <View style={[styles.modalSheetContainer, { height: '75%' }, isDark && { backgroundColor: '#0F172A' }]}>
                <View style={styles.dragHandle} />
                <View style={styles.modalSheetHeader}>
                  <Text style={[styles.modalSheetTitle, isDark && { color: '#F8FAFC' }]}>
                    Comments ({activePostComments.length})
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedPostForComments(null)} style={styles.closeBtnCircle}>
                    <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1, paddingVertical: 6 }} showsVerticalScrollIndicator={false}>
                  {activePostComments.map((c) => {
                    const cImg = c.authorAvatar || c.avatarUri || (c.author === user?.name ? user?.avatarUri : null);
                    const cEmoji = c.authorEmoji || (c.author === user?.name ? user?.avatarEmoji : null);
                    const cLetter = c.avatarLetter || (c.author?.[0] || 'A').toUpperCase();
                    const cBg = c.avatarSource ? '#FFFFFF' : (c.avatarBg || (c.author === user?.name ? (user?.avatarBg || accentColor) : '#2D62FF'));
                    const isPostAuthor = c.author === selectedPostForComments?.author;

                    return (
                      <View key={c.id} style={[styles.commentItemRow, isDark && { borderBottomColor: 'rgba(255,255,255,0.06)' }]}>
                        <View style={[styles.commentAvatarCircle, { backgroundColor: cBg }, isDark && { borderColor: '#334155' }]}>
                          {c.avatarSource ? (
                            <Image source={c.avatarSource} style={styles.commentAvatarImg} resizeMode="cover" />
                          ) : cImg ? (
                            <Image source={{ uri: cImg }} style={styles.commentAvatarImg} />
                          ) : cEmoji ? (
                            <Text style={{ fontSize: 15 }}>{cEmoji}</Text>
                          ) : (
                            <Text style={styles.commentAvatarText}>{cLetter}</Text>
                          )}
                        </View>

                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                            <Text style={[styles.commentAuthorName, isDark && { color: '#F8FAFC' }]}>
                              {c.author}
                            </Text>
                            {isPostAuthor && (
                              <View style={styles.commentAuthorBadge}>
                                <Text style={styles.commentAuthorBadgeText}>Author</Text>
                              </View>
                            )}
                            {c.authorRole && c.authorRole !== 'Author' && !isPostAuthor && (
                              <View style={[styles.commentAuthorBadge, c.authorRole === 'Official' && { backgroundColor: 'rgba(37,99,235,0.1)' }]}>
                                <Text style={[styles.commentAuthorBadgeText, c.authorRole === 'Official' && { color: '#2563EB' }]}>{c.authorRole}</Text>
                              </View>
                            )}
                            <Text style={[styles.commentTimeAgo, isDark && { color: '#94A3B8' }]}>• {c.timeAgo || 'Just now'}</Text>
                          </View>
                          <Text style={[styles.commentTextBody, isDark && { color: '#CBD5E1' }]}>
                            {c.text}
                          </Text>
                        </View>
                      </View>
                    );
                  })}

                  {activePostComments.length === 0 && (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                      <Text style={{ color: '#94A3B8', fontSize: 14 }}>No comments yet. Start the conversation!</Text>
                    </View>
                  )}
                </ScrollView>

                <View style={styles.commentInputRow}>
                  <View style={[styles.commentAvatarCircle, { backgroundColor: user?.avatarBg || accentColor, width: 32, height: 32 }]}>
                    {user?.avatarUri ? (
                      <Image source={{ uri: user.avatarUri }} style={styles.commentAvatarImg} />
                    ) : user?.avatarEmoji ? (
                      <Text style={{ fontSize: 14 }}>{user.avatarEmoji}</Text>
                    ) : (
                      <Text style={[styles.commentAvatarText, { fontSize: 13 }]}>{(user?.name?.[0] || 'A').toUpperCase()}</Text>
                    )}
                  </View>

                  <TextInput
                    style={[styles.commentTextInput, isDark && { backgroundColor: '#1E293B', color: '#F8FAFC' }]}
                    placeholder="Write a comment..."
                    placeholderTextColor="#94A3B8"
                    value={newCommentText}
                    onChangeText={setNewCommentText}
                  />
                  <TouchableOpacity style={[styles.sendBtn, { backgroundColor: accentColor }]} onPress={handleAddCommentSubmit} activeOpacity={0.8}>
                    <SendIcon size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          );
        })()}
      </Modal>

      {/* ── REPORT COMMUNITY MODAL ────────────────────────────────────── */}
      <Modal visible={isReportModalOpen} animationType="slide" transparent onRequestClose={() => setReportModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, isDark && { backgroundColor: '#0F172A' }]}>
            <View style={styles.dragHandle} />
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={[styles.modalSheetTitle, isDark && { color: '#F8FAFC' }]}>Report Community</Text>
                <Text style={styles.modalSheetSub}>Help keep StudPal safe and academic</Text>
              </View>
              <TouchableOpacity onPress={() => setReportModalOpen(false)} style={styles.closeBtnCircle}>
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Select Reason *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {[
                  { reason: 'Spam or Promotion', icon: '🚫' },
                  { reason: 'Inappropriate Content', icon: '⚠️' },
                  { reason: 'Harassment', icon: '🛑' },
                  { reason: 'Academic Dishonesty', icon: '📖' },
                  { reason: 'Other', icon: '💬' },
                ].map(({ reason, icon }) => {
                  const isSelected = reportReason === reason;
                  return (
                    <TouchableOpacity
                      key={reason}
                      style={[
                        styles.choicePillPremium,
                        isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
                        isSelected && { backgroundColor: Colors.error + '18', borderColor: Colors.error, borderWidth: 2 },
                      ]}
                      onPress={() => setReportReason(reason)}
                      activeOpacity={0.85}
                    >
                      <Text style={{ fontSize: 14 }}>{icon}</Text>
                      <Text style={[
                        styles.choicePillTextPremium, 
                        isDark && { color: '#CBD5E1' }, 
                        isSelected && { color: Colors.error, fontWeight: '800' }
                      ]}>
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Additional Details (Optional)</Text>
              <TextInput
                style={[styles.modalTextInput, styles.modalTextArea, isDark && { backgroundColor: '#1E293B', color: '#F8FAFC' }]}
                placeholder="Provide specific details about the issue..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={reportDetails}
                onChangeText={setReportDetails}
              />
            </View>

            <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: Colors.error }]} onPress={handleReportCommunitySubmit} activeOpacity={0.85}>
              <Text style={styles.modalActionBtnText}>Submit Report 🛡️</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── CREATE CHALLENGE MODAL ────────────────────────────────────── */}
      <Modal visible={isCreateChallengeOpen} animationType="slide" transparent onRequestClose={() => setCreateChallengeOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, isDark && { backgroundColor: '#0F172A' }]}>
            <View style={styles.dragHandle} />
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={[styles.modalSheetTitle, isDark && { color: '#F8FAFC' }]}>Create Study Challenge</Text>
                <Text style={styles.modalSheetSub}>Set a sprint for {selectedCommunity?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setCreateChallengeOpen(false)} style={styles.closeBtnCircle}>
                <CloseIcon size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Sprint Title *</Text>
              <TextInput
                style={[styles.modalTextInput, isDark && { backgroundColor: '#1E293B', color: '#F8FAFC' }]}
                placeholder="e.g. 7-Day Calculus Derivatives Sprint"
                placeholderTextColor="#94A3B8"
                value={newChallengeTitle}
                onChangeText={setNewChallengeTitle}
              />

              <Text style={[styles.inputLabel, isDark && { color: '#CBD5E1' }]}>Sprint Goal Duration</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {[
                  { days: '5', label: '5 Days Sprint', icon: '⚡' },
                  { days: '7', label: '7 Days Sprint', icon: '📅' },
                  { days: '14', label: '14 Days Sprint', icon: '🚀' },
                  { days: '21', label: '21 Days Sprint', icon: '🔥' },
                  { days: '30', label: '30 Days Sprint', icon: '🏆' },
                ].map(({ days, label, icon }) => {
                  const isSelected = newChallengeDays === days;
                  return (
                    <TouchableOpacity
                      key={days}
                      style={[
                        styles.choicePillPremium,
                        isDark && { backgroundColor: '#1E293B', borderWidth: 0, borderColor: 'transparent' },
                        isSelected && { backgroundColor: accentColor + '18', borderColor: accentColor, borderWidth: 2 },
                      ]}
                      onPress={() => setNewChallengeDays(days)}
                      activeOpacity={0.85}
                    >
                      <Text style={{ fontSize: 14 }}>{icon}</Text>
                      <Text style={[
                        styles.choicePillTextPremium, 
                        isDark && { color: '#CBD5E1' }, 
                        isSelected && { color: accentColor, fontWeight: '800' }
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: accentColor }]} onPress={handleCreateChallengeSubmit} activeOpacity={0.85}>
              <Text style={styles.modalActionBtnText}>Launch Sprint ⚡</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── LEAVE COMMUNITY DOUBLE VERIFICATION MODAL ────────────────── */}
      <Modal visible={!!leavingGroupTarget} animationType="slide" transparent onRequestClose={() => setLeavingGroupTarget(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalSheetContainer, isDark && { backgroundColor: '#0F172A' }]}>
            <View style={styles.dragHandle} />
            
            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              <View style={[styles.modalBadgeIcon, { backgroundColor: leaveStep === 1 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                <Text style={{ fontSize: 24 }}>{leaveStep === 1 ? '🚪' : '⚠️'}</Text>
              </View>
              
              <Text style={[styles.modalSheetTitle, { marginTop: 12, textAlign: 'center' }, isDark && { color: '#F8FAFC' }]}>
                {leaveStep === 1 ? 'Leave Community?' : 'Final Verification Check'}
              </Text>
              
              <Text style={[styles.modalNoticeText, { textAlign: 'center', marginTop: 8, color: isDark ? '#CBD5E1' : '#334155' }]}>
                {leaveStep === 1 
                  ? `Are you sure you want to leave "${leavingGroupTarget?.name}"? You will no longer receive updates or study challenges.`
                  : `Are you REALLY sure you want to leave "${leavingGroupTarget?.name}"? This action will remove your study streak progress in this community.`}
              </Text>
            </View>

            <View style={{ gap: 10, marginTop: 16 }}>
              {leaveStep === 1 ? (
                <>
                  <TouchableOpacity 
                    style={[styles.modalActionBtn, { backgroundColor: Colors.error }]} 
                    onPress={() => setLeaveStep(2)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalActionBtnText}>Proceed to Leave 🚪</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalActionBtn, { backgroundColor: '#F1F5F9' }, isDark && { backgroundColor: '#334155' }]} 
                    onPress={() => setLeavingGroupTarget(null)}
                    activeOpacity={0.85}
                  >
                    <Text style={{ color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 16, fontWeight: '700' }}>
                      Keep Membership
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={[styles.modalActionBtn, { backgroundColor: Colors.error }]} 
                    onPress={() => {
                      if (leavingGroupTarget) {
                        const targetId = leavingGroupTarget.id;
                        setStudyGroups(prev => {
                          const updatedList = prev.map(g => {
                            if (g.id === targetId) {
                              const updated = { ...g, joined: false, membersCount: Math.max(0, g.membersCount - 1) };
                              if (selectedCommunity?.id === targetId) {
                                setSelectedCommunity(updated);
                              }
                              return updated;
                            }
                            return g;
                          });
                          saveCommunitiesToStorage(updatedList);
                          return updatedList;
                        });
                      }
                      setLeavingGroupTarget(null);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalActionBtnText}>Yes, Really Leave Community ⚠️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalActionBtn, { backgroundColor: '#F1F5F9' }, isDark && { backgroundColor: '#334155' }]} 
                    onPress={() => setLeavingGroupTarget(null)}
                    activeOpacity={0.85}
                  >
                    <Text style={{ color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 16, fontWeight: '700' }}>
                      Nevermind, Stay Joined
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  stickyHeader: { backgroundColor: '#F8FAFC', zIndex: 10, paddingBottom: 4 },
  pageHeader: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: '#334155', fontWeight: '600', marginTop: 4 },
  scrollContent: { paddingTop: 4 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 0, borderColor: 'transparent', marginHorizontal: 20, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#0F172A', fontWeight: '500' },
  featuredCard: { marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  featuredCardHeader: { marginBottom: 12 },
  featuredTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  featuredDesc: { fontSize: 14, color: 'rgba(255, 255, 255, 0.95)', lineHeight: 20, marginBottom: 16, fontWeight: '500' },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredMeta: { fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' },
  featuredBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  featuredBtnText: { color: Colors.brandNavy, fontWeight: '800', fontSize: 13 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionHeading: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  createSprintPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  createSprintPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  groupsRow: { gap: 12, paddingHorizontal: 20, paddingBottom: 24 },
  myGroupCard: { width: 140, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  myGroupAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  myGroupAvatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  myGroupName: { fontSize: 14, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 4 },
  myGroupMeta: { fontSize: 12, color: '#10B981', fontWeight: '700' },
  emptyCard: { marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', marginBottom: 24 },
  emptyText: { textAlign: 'center', color: '#334155', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  creationSection: { marginHorizontal: 20, marginBottom: 32 },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  createBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  lockedCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  lockedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  lockedTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  lockedDesc: { fontSize: 13, color: '#334155', marginBottom: 12, lineHeight: 18, fontWeight: '500' },
  progressTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  lockedMeta: { fontSize: 12, color: '#334155', marginTop: 8, fontWeight: '600' },
  filterPillsRow: { paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  filterPillText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  discoverList: { paddingHorizontal: 20, gap: 12, paddingBottom: 24 },
  discoverCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  discoverHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  groupAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  groupAvatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  discoverName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  discoverMeta: { fontSize: 13, color: '#475569', marginTop: 2, fontWeight: '600' },
  discoverDesc: { fontSize: 14, color: '#334155', lineHeight: 20, marginBottom: 16, fontWeight: '500' },
  joinBtnSmall: { paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  joinBtnTextSmall: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  detailContainer: { flex: 1, position: 'relative' },
  detailStickyNavWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  detailStickyNavRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  detailStickyTitleContainer: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  detailStickyTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  detailStickySubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  detailStickyJoinBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5.5,
    paddingHorizontal: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  detailStickyJoinedBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  detailStickyJoinText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 12,
  },
  detailHeroBanner: {
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailHeaderClean: {
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  backBtnClean: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHeaderContentClean: {
    paddingHorizontal: 18,
    marginTop: 8,
  },
  detailTitleRowClean: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  detailTitleClean: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 25,
    flexShrink: 1,
  },
  detailSubtitleClean: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  detailBioTextClean: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
    fontWeight: '400',
    marginBottom: 14,
  },
  detailJoinBtnClean: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailJoinBtnTextClean: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
  },
  /* ─── Ultra-Premium Sticky Detail Tabs ─── */
  detailTabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    marginBottom: 16,
  },
  detailTabsContainerDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  detailTabsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailTabPillDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  detailTabPillActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
  },
  detailTabIcon: {
    fontSize: 13,
  },
  detailTabPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  detailTabPillTextActive: {
    fontWeight: '800',
  },

  /* ─── Ultra-Premium Post Composer ─── */
  createPostCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  createPostCardDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  createPostTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createPostAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  createPostAvatarImg: {
    width: '100%',
    height: '100%',
  },
  createPostAvatarLetter: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  createPostInputMock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  createPostInputMockDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  createPostPlaceholder: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '500',
    flex: 1,
  },
  createPostPenCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  createPostQuickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  createPostQuickActionsDark: {
    borderTopColor: '#334155',
  },
  quickActionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickActionTagDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  quickActionEmoji: {
    fontSize: 12,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  /* ─── Ultra-Premium Post Card ─── */
  postCardPremium: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  postCardPremiumDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  officialPostCardGlow: {
    borderWidth: 1.5,
  },
  pinnedBannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pinnedBannerPillDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: 'rgba(37, 99, 235, 0.35)',
  },
  pinnedBannerText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  postHeaderPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  authorAvatarPremium: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  authorAvatarImg: {
    width: '100%',
    height: '100%',
  },
  authorAvatarTextPremium: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  authorNamePremium: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  officialRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 14,
  },
  officialRoleBadgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
  },
  hostRoleBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 14,
  },
  hostRoleBadgeText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '800',
  },
  memberRoleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  memberRoleBadgeDark: {
    backgroundColor: '#334155',
  },
  memberRoleBadgeText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  postMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  postTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  postMetaDot: {
    fontSize: 11,
    color: '#94A3B8',
  },
  postSubjectTag: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  headerBookmarkBtn: {
    padding: 6,
    borderRadius: 10,
  },
  headerBookmarkBtnDark: {
    backgroundColor: 'transparent',
  },
  postTitlePremium: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 23,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  postContentPremium: {
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '400',
  },
  postContentPremiumDark: {
    color: '#CBD5E1',
  },
  postActionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  postActionsFooterDark: {
    borderTopColor: '#334155',
  },
  actionsLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionPillBtnDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  actionPillBtnLiked: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  actionPillCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  actionPillCountLiked: {
    color: '#EF4444',
  },
  sharePillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shareActionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  detailAvatarBadgeClean: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  challengeCardPremium: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  challengeIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitlePremium: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  challengeSubMeta: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
    fontWeight: '600',
  },
  goalPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  goalPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrackPremium: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillPremium: {
    height: '100%',
    borderRadius: 4,
  },
  challengeCountText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  challengeCountSub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
    fontWeight: '500',
  },
  checkInBtnPremium: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkInBtnTextPremium: {
    fontSize: 12,
    fontWeight: '800',
  },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.error },
  dangerBtnText: { color: Colors.error, fontSize: 15, fontWeight: '700' },
  actionCardTilePremium: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionCardIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  actionCardSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  ruleSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ruleSegmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ruleSegmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ruleSegmentTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  presetQuickAddChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  presetQuickAddChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  presetRuleCardPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  ruleIconBadgeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetRuleTitlePremium: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  presetRuleSubPremium: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 17,
  },
  ruleStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  deleteRuleBtnCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customRuleFormBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  addRuleBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  createPreviewCardClean: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  createPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  createPreviewAvatarClean: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  createPreviewAvatarTextClean: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  categoryTagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 2,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  createPreviewTitleClean: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  createPreviewHostBadgeClean: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  createPreviewHostBadgeTextClean: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '800',
  },
  createPreviewDescClean: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  quickTemplatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  quickTemplateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  avatarPickerTile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPickerUploadTilePremium: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plusBadgeCorner: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 44 },
  modalSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalSheetTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  formGroup: { marginBottom: 24, gap: 12 },
  modalTextInput: { backgroundColor: '#F8FAFC', borderWidth: 0, borderColor: 'transparent', borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 15, color: '#0F172A', fontWeight: '500' },
  modalTextArea: { height: 120, paddingTop: 12, textAlignVertical: 'top' },
  modalActionBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#94A3B8', alignSelf: 'center', marginBottom: 16 },
  modalSheetSub: { fontSize: 13, color: '#334155', marginTop: 2, fontWeight: '600' },
  modalBadgeIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  closeBtnCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(148, 163, 184, 0.15)', alignItems: 'center', justifyContent: 'center' },
  modalNoticeBox: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 12, marginBottom: 14 },
  modalNoticeText: { fontSize: 13, color: '#1E293B', lineHeight: 19, fontWeight: '500' },
  /* ─── Post Form Arrangement Styles ─── */
  postTypeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  postTypeSwitcherDark: {
    backgroundColor: '#1E293B',
  },
  postTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  postTypeOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  postTypeOptionEmoji: {
    fontSize: 13,
  },
  postTypeOptionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  formGroupCustom: {
    gap: 14,
    marginBottom: 16,
  },
  fieldBlock: {
    gap: 6,
  },
  inputLabelCustom: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalTextAreaCustom: {
    height: 100,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  modalTextInputDark: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    borderColor: '#334155',
  },
  subjectChipPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subjectChipPillDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  subjectChipPillActive: {
    borderWidth: 1.5,
  },
  subjectChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  urgencyPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  urgencyPillDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  urgencyPillActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  urgencyPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  modalActionBtnCustom: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  benefitsList: { gap: 10, marginVertical: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitBullet: { fontSize: 16 },
  benefitText: { fontSize: 13, color: '#1E293B', fontWeight: '600' },
  commentItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  commentAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  commentAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  commentAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  commentAuthorName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  commentAuthorBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  commentAuthorBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  commentTimeAgo: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  commentTextBody: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '400',
  },
  commentItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  commentAuthor: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  commentText: { fontSize: 13, color: '#1E293B', lineHeight: 19, fontWeight: '500' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  commentTextInput: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 0, borderColor: 'transparent', borderRadius: 20, paddingHorizontal: 16, height: 40, fontSize: 14, color: '#0F172A', fontWeight: '500' },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 14, marginBottom: 6 },
  choicePillPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  choicePillTextPremium: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  privacyCardPremium: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'flex-start',
  },
  privacyIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  privacyCardTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  privacyCardSub: { fontSize: 12, color: '#334155', fontWeight: '500', lineHeight: 17 },
  colorSwatchRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  colorSwatchInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  checkInBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  checkInBtnText: { fontSize: 12, fontWeight: '800' },
  inviteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inviteIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inviteTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  inviteSub: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    marginTop: 2,
  },
  copyLinkBtnPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  copyLinkBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  challengeCardSpacious: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderSpacious: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 4,
  },
  challengeTitleSpacious: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    flex: 1,
  },
  sprintGoalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sprintGoalBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressMetaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  progressPctLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrackSpacious: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillSpacious: {
    height: '100%',
    borderRadius: 4,
  },
  checkInBtnSpacious: {
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  checkInBtnTextSpacious: {
    fontSize: 14,
    fontWeight: '800',
  },
  membersCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  memberRowItemPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  memberAvatarPremium: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  onlineDotCorner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: -1,
    right: -1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberNamePremium: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleBadgePremium: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleBadgeTextPremium: {
    fontSize: 11,
    fontWeight: '800',
  },
  memberMetaPremium: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginTop: 3,
  },
  rulesList: { gap: 12 },
  ruleCard: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1' },
  ruleIcon: { fontSize: 20 },
  ruleTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  ruleDesc: { fontSize: 13, color: '#334155', fontWeight: '500', lineHeight: 19 },
  storySection: { marginBottom: 16 },
  sectionHeaderRowCompact: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  sectionHeadingSmall: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  lockedPillInline: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.warning + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  lockedPillText: { fontSize: 11, fontWeight: '700', color: Colors.warning },
  storyRow: { paddingHorizontal: 20, gap: 12, alignItems: 'flex-start' },
  storyItem: { width: 90, alignItems: 'center' },
  storyAvatarRing: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  storyAvatarCreate: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  storyAvatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  storyName: { fontSize: 11.5, fontWeight: '700', color: '#1E293B', textAlign: 'center', lineHeight: 14.5 },
  noJoinedText: { fontSize: 13, color: '#475569', fontStyle: 'italic', fontWeight: '500', paddingVertical: 8 },
  featuredHubItem: { 
    padding: 16, 
    borderRadius: 18, 
    marginBottom: 14, 
    marginHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredHubTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featuredHubAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredHubAvatar: {
    width: '100%',
    height: '100%',
  },
  featuredHubTitleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredHubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  featuredHubTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#FFFFFF',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  featuredHubMeta: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginTop: 2,
  },
  featuredHubDesc: { 
    fontSize: 13.5, 
    color: 'rgba(255, 255, 255, 0.95)', 
    fontWeight: '400',
    lineHeight: 19.5,
    marginBottom: 8,
  },
  featuredHubBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  featuredHubBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 14, 
    paddingVertical: 7.5, 
    borderRadius: 18, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  featuredHubBtnText: { 
    color: Colors.brandNavy || '#112B8A', 
    fontWeight: '800', 
    fontSize: 13,
  },
  discoverCardClean: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  groupAvatarSmall: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  groupAvatarTextSmall: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  discoverNameClean: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4, lineHeight: 21, letterSpacing: -0.2 },
  discoverDescClean: { fontSize: 13, color: '#334155', fontWeight: '500', marginBottom: 4, lineHeight: 19 },
  discoverMetaClean: { fontSize: 12, color: '#475569', fontWeight: '600' },
  joinBtnClean: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18 },
  joinBtnTextClean: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  hostCommunityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hostCommunityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostCommunityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  hostCommunitySub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
    fontWeight: '500',
  },
  hostCommunityBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostCommunityBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  lvlBadgeSmall: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
