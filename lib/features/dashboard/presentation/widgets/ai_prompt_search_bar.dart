import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class AiPromptSearchBar extends StatelessWidget {
  final ValueChanged<String>? onSubmitted;
  final ValueChanged<String>? onQuickPromptSelected;
  final VoidCallback? onCameraTap;
  final VoidCallback? onVoiceTap;

  const AiPromptSearchBar({
    super.key,
    this.onSubmitted,
    this.onQuickPromptSelected,
    this.onCameraTap,
    this.onVoiceTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final quickPrompts = [
      {'icon': '📐', 'label': 'Calculus Rules'},
      {'icon': '⚛️', 'label': 'Quantum Physics'},
      {'icon': '🧪', 'label': 'Organic Chem'},
      {'icon': '📝', 'label': 'Summarize Notes'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Tactile Claymorphic Input Container
          Container(
            height: 52,
            decoration: BoxDecoration(
              color: isDark ? AppColors.cardDark : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                width: 1.2,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(isDark ? 40 : 10),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
                if (!isDark)
                  const BoxShadow(
                    color: Colors.white,
                    blurRadius: 0,
                    offset: Offset(0, -1),
                  ),
              ],
            ),
            child: Row(
              children: [
                const SizedBox(width: 14),
                // AI Sparkle Gradient Icon
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.accent, Color(0xFF6366F1)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.auto_awesome,
                      color: Colors.white,
                      size: 16,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextField(
                    onSubmitted: onSubmitted,
                    minLines: 1,
                    maxLines: 7,
                    textAlignVertical: TextAlignVertical.center,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Ask Branco anything...',
                      hintStyle: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13.5,
                        color: isDark ? AppColors.textSecondaryDark : const Color(0xFF94A3B8),
                        fontWeight: FontWeight.w400,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(
                    Icons.mic_none_rounded,
                    size: 20,
                    color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                  ),
                  onPressed: onVoiceTap,
                  splashRadius: 20,
                  tooltip: 'Voice Search',
                ),
                IconButton(
                  icon: const Icon(
                    Icons.document_scanner_outlined,
                    size: 20,
                    color: AppColors.accent,
                  ),
                  onPressed: onCameraTap,
                  splashRadius: 20,
                  tooltip: 'Scan Homework',
                ),
                const SizedBox(width: 4),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Quick Prompt Pills
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: quickPrompts.map((p) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: InkWell(
                    onTap: () => onQuickPromptSelected?.call(p['label']!),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF16203A) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isDark ? const Color(0xFF22325A) : const Color(0xFFE2E8F0),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(p['icon']!, style: const TextStyle(fontSize: 12)),
                          const SizedBox(width: 5),
                          Text(
                            p['label']!,
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 11.5,
                              fontWeight: FontWeight.w500,
                              color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
