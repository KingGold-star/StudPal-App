import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/primary_button.dart';

/// Role Option Data Model
class RoleOption {
  final String id;
  final String emoji;
  final String title;
  final String tag;
  final String description;
  final Color accentColor;

  const RoleOption({
    required this.id,
    required this.emoji,
    required this.title,
    required this.tag,
    required this.description,
    required this.accentColor,
  });
}

/// StudPal Account Setup - Role Selection Screen
/// Enhanced with ultra-premium styling and subtle Claymorphism (tactile 3D shadows & pillowed curves).
class RoleSelectionScreen extends StatefulWidget {
  final Function(String roleId)? onRoleSelected;
  final VoidCallback? onContinue;
  final VoidCallback? onBack;

  const RoleSelectionScreen({
    super.key,
    this.onRoleSelected,
    this.onContinue,
    this.onBack,
  });

  @override
  State<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends State<RoleSelectionScreen> {
  String _selectedRoleId = 'student';

  static const List<RoleOption> _roles = [
    RoleOption(
      id: 'student',
      emoji: '🎓',
      title: 'Student',
      tag: 'Most Popular',
      description: 'Master your subjects, solve practice quizzes, and boost your GPA with your personalized AI tutor.',
      accentColor: AppColors.primary,
    ),
    RoleOption(
      id: 'parent',
      emoji: '👨‍👩‍👧',
      title: 'Parent / Guardian',
      tag: 'Family Support',
      description: "Support, motivate and track your child's revision progress and study milestones effortlessly.",
      accentColor: Color(0xFF8B5CF6),
    ),
    RoleOption(
      id: 'educator',
      emoji: '👨‍🏫',
      title: 'Educator / Tutor',
      tag: 'Classroom',
      description: 'Assign interactive revision modules, generate study sets, and guide your students to success.',
      accentColor: Color(0xFF10B981),
    ),
  ];

  void _selectRole(String roleId) {
    setState(() {
      _selectedRoleId = roleId;
    });
    if (widget.onRoleSelected != null) {
      widget.onRoleSelected!(roleId);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 8),

              // 1. Header Navigation: Premium Back Button & Centered Logo
              Stack(
                alignment: Alignment.center,
                children: [
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: widget.onBack ?? () => Navigator.of(context).pop(),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.cardDark : Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                              width: 1.2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Icon(
                            Icons.chevron_left_rounded,
                            size: 24,
                            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Centered Brand Logo
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.school_rounded,
                        color: isDark ? AppColors.accent : AppColors.primary,
                        size: 24,
                      ),
                      const SizedBox(width: 6),
                      RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: 'StudPal',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                letterSpacing: -0.4,
                              ),
                            ),
                            const TextSpan(
                              text: '.',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: AppColors.accent,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // 2. Step Badge Indicator
              Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppColors.accent.withValues(alpha: 0.2),
                    ),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '✨ STEP 1 OF 2',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.accent,
                          letterSpacing: 0.6,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // 3. Title & Subtitle
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome! What best describes you?',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 25,
                      fontWeight: FontWeight.w800,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      letterSpacing: -0.5,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "We'll customize your study workspace, smart tools, and AI companion to match your exact goals.",
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                      height: 1.45,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // 4. Claymorphic Selectable Role Cards
              Expanded(
                child: ListView.separated(
                  physics: const BouncingScrollPhysics(),
                  itemCount: _roles.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 14),
                  itemBuilder: (context, index) {
                    final role = _roles[index];
                    final isSelected = role.id == _selectedRoleId;

                    return GestureDetector(
                      onTap: () => _selectRole(role.id),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 220),
                        curve: Curves.easeInOut,
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          // Subtle 3D Claymorphic Gradient & Surface
                          gradient: isSelected
                              ? LinearGradient(
                                  colors: isDark
                                      ? [const Color(0xFF1E3A8A), const Color(0xFF112B8A)]
                                      : [const Color(0xFFF0F6FF), const Color(0xFFE0EDFF)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                )
                              : null,
                          color: isSelected
                              ? null
                              : (isDark ? AppColors.cardDark : Colors.white),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected
                                ? AppColors.accent
                                : (isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
                            width: isSelected ? 2.2 : 1.2,
                          ),
                          // Dual 3D Clay Shadows (Soft Ambient + Inset Depth Feel)
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: AppColors.accent.withValues(alpha: isDark ? 0.35 : 0.2),
                                    blurRadius: 18,
                                    spreadRadius: 1,
                                    offset: const Offset(0, 8),
                                  ),
                                  BoxShadow(
                                    color: Colors.white.withValues(alpha: isDark ? 0.05 : 0.6),
                                    blurRadius: 2,
                                    offset: const Offset(-2, -2),
                                  ),
                                ]
                              : [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.04),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // 3D Clay Emoji Badge Container
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 220),
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                gradient: isSelected
                                    ? const LinearGradient(
                                        colors: [AppColors.accent, AppColors.primary],
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      )
                                    : LinearGradient(
                                        colors: isDark
                                            ? [const Color(0xFF1E293B), const Color(0xFF0F172A)]
                                            : [const Color(0xFFF1F5F9), const Color(0xFFE2E8F0)],
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      ),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: (isSelected ? AppColors.accent : Colors.black)
                                        .withValues(alpha: 0.15),
                                    blurRadius: 8,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Center(
                                child: Text(
                                  role.emoji,
                                  style: const TextStyle(fontSize: 26),
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),

                            // Details & Description
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        role.title,
                                        style: TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 17,
                                          fontWeight: FontWeight.w700,
                                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                          letterSpacing: -0.3,
                                        ),
                                      ),
                                      const SizedBox(width: 8),

                                      // Tag Pill
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: isSelected
                                              ? AppColors.accent.withValues(alpha: 0.15)
                                              : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          role.tag,
                                          style: TextStyle(
                                            fontFamily: 'Inter',
                                            fontSize: 10,
                                            fontWeight: FontWeight.w700,
                                            color: isSelected ? AppColors.accent : AppColors.secondary,
                                          ),
                                        ),
                                      ),
                                      const Spacer(),

                                      // 3D Clay Radio Checkmark Badge
                                      AnimatedContainer(
                                        duration: const Duration(milliseconds: 200),
                                        width: 24,
                                        height: 24,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          gradient: isSelected
                                              ? const LinearGradient(
                                                  colors: [AppColors.accent, AppColors.primary],
                                                )
                                              : null,
                                          color: isSelected ? null : Colors.transparent,
                                          border: Border.all(
                                            color: isSelected
                                                ? AppColors.accent
                                                : (isDark ? AppColors.borderDark : const Color(0xFFCBD5E1)),
                                            width: 2,
                                          ),
                                          boxShadow: isSelected
                                              ? [
                                                  BoxShadow(
                                                    color: AppColors.accent.withValues(alpha: 0.3),
                                                    blurRadius: 6,
                                                    offset: const Offset(0, 2),
                                                  ),
                                                ]
                                              : null,
                                        ),
                                        child: isSelected
                                            ? const Icon(
                                                Icons.check_rounded,
                                                size: 14,
                                                color: Colors.white,
                                              )
                                            : null,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    role.description,
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 13,
                                      fontWeight: FontWeight.w400,
                                      color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                                      height: 1.42,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 16),

              // 5. Tactile 3D Primary Button (#112B8A Navy, 12px Radius)
              PrimaryButton(
                label: 'Continue',
                backgroundColor: AppColors.primary,
                onPressed: widget.onContinue ?? () {},
              ),

              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}
