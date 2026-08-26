import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class SrsItem {
  final String id;
  final String title;
  final String subject;
  final String emoji;
  final int retentionPercent;
  final String dueStatus;
  final bool isOverdue;
  final Color subjectColor;

  const SrsItem({
    required this.id,
    required this.title,
    required this.subject,
    required this.emoji,
    required this.retentionPercent,
    required this.dueStatus,
    this.isOverdue = false,
    required this.subjectColor,
  });
}

class SrsRevisionQueueWidget extends StatelessWidget {
  final List<SrsItem> items;
  final ValueChanged<SrsItem>? onItemTap;
  final VoidCallback? onStartQueueTap;

  const SrsRevisionQueueWidget({
    super.key,
    this.items = defaultItems,
    this.onItemTap,
    this.onStartQueueTap,
  });

  static const List<SrsItem> defaultItems = [
    SrsItem(
      id: 'srs-1',
      title: 'Integration by Parts & Substitution',
      subject: 'Mathematics',
      emoji: '📐',
      retentionPercent: 65,
      dueStatus: 'Due Today',
      subjectColor: Color(0xFF2D62FF),
    ),
    SrsItem(
      id: 'srs-2',
      title: 'Wave Optics & Interference Patterns',
      subject: 'Physics',
      emoji: '⚛️',
      retentionPercent: 48,
      dueStatus: 'Overdue (1d)',
      isOverdue: true,
      subjectColor: Color(0xFF8B5CF6),
    ),
    SrsItem(
      id: 'srs-3',
      title: 'Acid-Base Equilibria & pH Buffers',
      subject: 'Chemistry',
      emoji: '🧪',
      retentionPercent: 78,
      dueStatus: 'Due in 3h',
      subjectColor: Color(0xFF10B981),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Title Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    'Revision Queue',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.brandOrange.withAlpha(isDark ? 50 : 20),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: AppColors.brandOrange.withAlpha(isDark ? 100 : 70),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      '${items.length} Due Today',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.brandOrange,
                      ),
                    ),
                  ),
                ],
              ),
              const Text(
                'SRS Engine',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 11.5,
                  fontWeight: FontWeight.w600,
                  color: AppColors.secondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Revision Items List
          Column(
            children: items.map((item) => _buildQueueItem(context, item, isDark)).toList(),
          ),
          const SizedBox(height: 12),

          // Primary Quick Review CTA Button
          InkWell(
            onTap: onStartQueueTap,
            borderRadius: BorderRadius.circular(16),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.accent, AppColors.primary],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.accent.withAlpha(isDark ? 80 : 50),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.flash_on_rounded,
                    color: Colors.white,
                    size: 19,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Start SRS Quick Review (5 mins)',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQueueItem(BuildContext context, SrsItem item, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: () => onItemTap?.call(item),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: isDark ? AppColors.cardDark : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: item.isOverdue
                  ? AppColors.error.withAlpha(isDark ? 80 : 50)
                  : (isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
              width: item.isOverdue ? 1.4 : 1.1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withAlpha(isDark ? 30 : 5),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              // Emoji Box
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: item.subjectColor.withAlpha(isDark ? 40 : 20),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(item.emoji, style: const TextStyle(fontSize: 18)),
                ),
              ),
              const SizedBox(width: 12),

              // Title + Subject
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13.5,
                        fontWeight: FontWeight.w600,
                        color: isDark ? AppColors.textPrimaryDark : const Color(0xFF0F172A),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        Text(
                          item.subject,
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: item.subjectColor,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '•',
                          style: TextStyle(
                            color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Retention: ${item.retentionPercent}%',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),

              // Due Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: item.isOverdue
                      ? AppColors.error.withAlpha(isDark ? 40 : 15)
                      : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  item.dueStatus,
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                    color: item.isOverdue
                        ? AppColors.error
                        : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
