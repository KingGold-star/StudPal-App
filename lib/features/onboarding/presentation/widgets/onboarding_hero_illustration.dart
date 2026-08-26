import 'package:flutter/material.dart';

/// StudPal Onboarding Screen 1 Hero Illustration
/// Displays the custom generated 3D illustration asset with responsive sizing.
class OnboardingHeroIllustration extends StatelessWidget {
  const OnboardingHeroIllustration({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        height: 330,
        width: double.infinity,
        child: Image.asset(
          'assets/images/onboarding_hero_1.png',
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            return const Center(
              child: Icon(Icons.image_outlined, size: 64, color: Colors.grey),
            );
          },
        ),
      ),
    );
  }
}
