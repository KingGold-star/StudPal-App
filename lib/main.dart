import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/screens/auth_screen.dart';
import 'features/auth/presentation/screens/role_selection_screen.dart';
import 'features/dashboard/presentation/screens/dashboard_screen.dart';
import 'features/onboarding/presentation/screens/onboarding_screen_1.dart';
import 'features/onboarding/presentation/screens/onboarding_screen_2.dart';
import 'features/onboarding/presentation/screens/onboarding_screen_3.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const StudPalApp());
}

class StudPalApp extends StatelessWidget {
  const StudPalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StudPal',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const OnboardingFlow(),
    );
  }
}

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});

  @override
  State<OnboardingFlow> createState() => _OnboardingFlowState();
}

class _OnboardingFlowState extends State<OnboardingFlow> {
  final PageController _pageController = PageController();

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
    );
  }

  void _previousPage() {
    _pageController.previousPage(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
    );
  }

  void _navigateToDashboard() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => DashboardScreen(
          onBackToOnboarding: () {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const OnboardingFlow()),
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PageView(
      controller: _pageController,
      physics: const BouncingScrollPhysics(),
      children: [
        OnboardingScreen1(
          onNext: _nextPage,
        ),
        OnboardingScreen2(
          onNext: _nextPage,
          onBack: _previousPage,
        ),
        OnboardingScreen3(
          onGetStarted: _nextPage,
          onBack: _previousPage,
        ),
        RoleSelectionScreen(
          onContinue: _nextPage,
          onBack: _previousPage,
        ),
        AuthScreen(
          onAuthSuccess: _navigateToDashboard,
          onBack: _previousPage,
        ),
      ],
    );
  }
}
