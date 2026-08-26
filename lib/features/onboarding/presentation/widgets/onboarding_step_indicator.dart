import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Clean animated pill indicator for onboarding progression
class OnboardingStepIndicator extends StatelessWidget {
  final int totalSteps;
  final int currentStep;

  const OnboardingStepIndicator({
    super.key,
    this.totalSteps = 3,
    required this.currentStep,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(totalSteps, (index) {
        final bool isActive = index == currentStep;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          margin: const EdgeInsets.symmetric(horizontal: 4),
          height: 8,
          width: isActive ? 28 : 8,
          decoration: BoxDecoration(
            color: isActive ? AppColors.primary : AppColors.borderLight,
            borderRadius: BorderRadius.circular(4),
          ),
        );
      }),
    );
  }
}
