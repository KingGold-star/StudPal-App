import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/primary_button.dart';

/// StudPal Onboarding Screen 2
/// "You're Never Alone in Your Studies"
/// Features ultra-premium back button and no skip action.
class OnboardingScreen2 extends StatelessWidget {
  final VoidCallback? onNext;
  final VoidCallback? onBack;

  const OnboardingScreen2({
    super.key,
    this.onNext,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 8),

              // 1. Header Navigation: Ultra-Premium Back Button & Centered Logo (No Skip)
              Stack(
                alignment: Alignment.center,
                children: [
                  // Premium Back Button Positioned Left
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: onBack ?? () => Navigator.of(context).pop(),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.cardDark : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                              width: 1.2,
                            ),
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

              const Spacer(flex: 1),

              // 2. Hero 3D Illustration
              Center(
                child: SizedBox(
                  height: 330,
                  width: double.infinity,
                  child: Image.asset(
                    'assets/images/onboarding_hero_2.png',
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(
                        child: Icon(Icons.image_outlined, size: 64, color: Colors.grey),
                      );
                    },
                  ),
                ),
              ),

              const Spacer(flex: 1),

              // 3. Encouraging Headline & Subtitle
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: "You're Never Alone,\n",
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 30,
                            fontWeight: FontWeight.w700,
                            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                            height: 1.18,
                            letterSpacing: -0.6,
                          ),
                        ),
                        const TextSpan(
                          text: 'In Your Studies',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 30,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                            height: 1.18,
                            letterSpacing: -0.6,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12.0),
                    child: Text(
                      'Connect your learning, revision and progress in one organized study space.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                        height: 1.45,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // 4. Step Indicator (Dot 2 active)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.borderDark : AppColors.borderLight,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    width: 24,
                    height: 8,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.borderDark : AppColors.borderLight,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // 5. Action Button: "Next" (#112B8A Navy, 12px Radius)
              PrimaryButton(
                label: 'Next',
                backgroundColor: AppColors.primary,
                onPressed: onNext ?? () {},
              ),

              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}
