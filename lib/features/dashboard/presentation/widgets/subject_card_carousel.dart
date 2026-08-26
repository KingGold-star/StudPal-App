import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class SubjectItem {
  final String id;
  final String title;
  final String currentTopic;
  final String emoji;
  final double mastery;
  final int completedTopics;
  final int totalTopics;
  final Color themeColor;

  const SubjectItem({
    required this.id,
    required this.title,
    required this.currentTopic,
    required this.emoji,
    required this.mastery,
    required this.completedTopics,
    required this.totalTopics,
    required this.themeColor,
  });
}

class SubjectCardCarousel extends StatelessWidget {
  final List<SubjectItem> subjects;
  final ValueChanged<SubjectItem>? onSubjectTap;
  final VoidCallback? onSeeAllTap;

  const SubjectCardCarousel({
    super.key,
    this.subjects = defaultSubjects,
    this.onSubjectTap,
    this.onSeeAllTap,
  });

  static const List<SubjectItem> defaultSubjects = [
    SubjectItem(
      id: 'math',
      title: 'Mathematics',
      currentTopic: 'Calculus II: Derivatives',
      emoji: '📐',
      mastery: 0.82,
      completedTopics: 14,
      totalTopics: 18,
      themeColor: Color(0xFF2D62FF),
    ),
    SubjectItem(
      id: 'physics',
      title: 'Physics',
      currentTopic: 'Electromagnetism & Flux',
      emoji: '⚛️',
      mastery: 0.64,
      completedTopics: 9,
      totalTopics: 15,
      themeColor: Color(0xFF8B5CF6),
    ),
    SubjectItem(
      id: 'chemistry',
      title: 'Chemistry',
      currentTopic: 'Organic Reactions',
      emoji: '🧪',
      mastery: 0.45,
      completedTopics: 6,
      totalTopics: 14,
      themeColor: Color(0xFF10B981),
    ),
    SubjectItem(
      id: 'biology',
      title: 'Biology',
      currentTopic: 'Cellular Respiration',
      emoji: '🧬',
      mastery: 0.90,
      completedTopics: 11,
      totalTopics: 12,
      themeColor: Color(0xFFF59E0B),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Title Row
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Continue Studying',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  letterSpacing: -0.3,
                ),
              ),
              GestureDetector(
                onTap: onSeeAllTap,
                child: const Text(
                  'See All',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.accent,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Horizontal Subject Cards Carousel
        SizedBox(
          height: 168,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: subjects.length,
            separatorBuilder: (context, index) => const SizedBox(width: 14),
            itemBuilder: (context, index) {
              final item = subjects[index];
              return _buildSubjectCard(context, item, isDark);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSubjectCard(BuildContext context, SubjectItem item, bool isDark) {
    final int percent = (item.mastery * 100).toInt();

    return InkWell(
      onTap: () => onSubjectTap?.call(item),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 220,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(isDark ? 40 : 8),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Header: Emoji + Title + Mastery %
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: item.themeColor.withAlpha(isDark ? 50 : 25),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(item.emoji, style: const TextStyle(fontSize: 18)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.title,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        '${item.completedTopics}/${item.totalTopics} topics',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Active Topic Name
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CURRENT TOPIC',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: item.themeColor,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  item.currentTopic,
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.textPrimaryDark : const Color(0xFF1E293B),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),

            // Progress Bar + %
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Mastery',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 10.5,
                        color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),
                    Text(
                      '$percent%',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: item.themeColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 5),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: item.mastery,
                    minHeight: 5,
                    backgroundColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                    valueColor: AlwaysStoppedAnimation<Color>(item.themeColor),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
