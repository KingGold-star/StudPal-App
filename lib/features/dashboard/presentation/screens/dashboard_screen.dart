import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/bottom_nav_bar.dart';
import '../widgets/home_header_widget.dart';
import '../widgets/ai_prompt_search_bar.dart';
import '../widgets/daily_goal_card.dart';
import '../widgets/subject_card_carousel.dart';
import '../widgets/srs_revision_queue_widget.dart';

class DashboardScreen extends StatefulWidget {
  final VoidCallback? onBackToOnboarding;

  const DashboardScreen({
    super.key,
    this.onBackToOnboarding,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentNavIndex = 0;
  int _dailyCompletedMinutes = 45;
  int _dailyTargetMinutes = 60;
  int _dailyXp = 320;
  int _streakDays = 5;

  void _onNavTapped(int index) {
    setState(() {
      _currentNavIndex = index;
    });

    if (index != 0) {
      final tabNames = ['Home', 'Subjects', 'Branco', 'Progress', 'Profile'];
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✨ Navigating to ${tabNames[index]} module...'),
          duration: const Duration(milliseconds: 1200),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _startFocusTimer() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: isDark ? AppColors.surfaceDark : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              const Text('⏱️', style: TextStyle(fontSize: 40)),
              const SizedBox(height: 10),
              Text(
                '25-Minute Pomodoro Focus Session',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Branco will monitor your focus, block distractions, and reward +50 XP upon completion!',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 13.5,
                  color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  setState(() {
                    _dailyCompletedMinutes = (_dailyCompletedMinutes + 15).clamp(0, _dailyTargetMinutes);
                    _dailyXp += 50;
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('🎯 Focus session started! +50 XP awarded.'),
                      backgroundColor: AppColors.primary,
                    ),
                  );
                },
                child: const Text('Start Focus Session Now'),
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  void _handleQuickPrompt(String prompt) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🤖 Branco is generating explanations for: "$prompt"'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _handleSubjectTap(SubjectItem subject) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('📖 Continuing ${subject.title}: ${subject.currentTopic}'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _handleSrsItemTap(SrsItem item) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('⚡ Reviewing Flashcards: ${item.title}'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _startSrsReview() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🚀 Launching Spaced Repetition (SRS) Engine Queue!'),
        backgroundColor: AppColors.accent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.surfaceLight,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await Future.delayed(const Duration(milliseconds: 600));
            setState(() {
              _streakDays = 5;
            });
          },
          color: AppColors.accent,
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
            slivers: [
              // Top Header Bar
              SliverToBoxAdapter(
                child: HomeHeaderWidget(
                  userName: 'Alex',
                  streakDays: _streakDays,
                  unreadNotifications: 2,
                  onNotificationTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('🔔 You have 2 new study recommendations!'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  onStreakTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('🔥 You are on a $_streakDays-day study streak! Keep it up!'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  onProfileTap: () {
                    setState(() => _currentNavIndex = 4);
                  },
                ),
              ),

              // Search & AI Prompt Bar
              SliverToBoxAdapter(
                child: AiPromptSearchBar(
                  onSubmitted: (query) => _handleQuickPrompt(query),
                  onQuickPromptSelected: (prompt) => _handleQuickPrompt(prompt),
                  onCameraTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('📸 Homework Scanner Activated! Snap any problem to solve.'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  onVoiceTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('🎙️ Voice Assistant Listening...'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 20)),

              // Daily Study Goal Progress Card
              SliverToBoxAdapter(
                child: DailyGoalCard(
                  completedMinutes: _dailyCompletedMinutes,
                  targetMinutes: _dailyTargetMinutes,
                  earnedXp: _dailyXp,
                  userLevel: 4,
                  onStartTimer: _startFocusTimer,
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 24)),

              // Continue Studying Active Subjects Carousel
              SliverToBoxAdapter(
                child: SubjectCardCarousel(
                  onSubjectTap: _handleSubjectTap,
                  onSeeAllTap: () {
                    setState(() => _currentNavIndex = 1);
                  },
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 24)),

              // Revision Queue (SRS Spaced Repetition Engine)
              SliverToBoxAdapter(
                child: SrsRevisionQueueWidget(
                  onItemTap: _handleSrsItemTap,
                  onStartQueueTap: _startSrsReview,
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 32)),
            ],
          ),
        ),
      ),
      bottomNavigationBar: StudPalBottomNavBar(
        currentIndex: _currentNavIndex,
        onTap: _onNavTapped,
      ),
    );
  }
}
