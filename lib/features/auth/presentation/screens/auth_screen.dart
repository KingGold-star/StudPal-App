import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/primary_button.dart';

/// StudPal Industry-Level Authentication Screen (Sign Up / Log In)
/// Form layout matching reference image: Title -> Inputs -> Action Button -> Divider -> Social Auth -> Footer.
class AuthScreen extends StatefulWidget {
  final VoidCallback? onAuthSuccess;
  final VoidCallback? onBack;

  const AuthScreen({
    super.key,
    this.onAuthSuccess,
    this.onBack,
  });

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();

  bool _isSignUp = true;
  bool _obscurePassword = true;
  bool _rememberMe = false;
  bool _isLoading = false;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  String? _nameError;
  String? _emailError;
  String? _passwordError;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _toggleAuthMode() {
    setState(() {
      _isSignUp = !_isSignUp;
      _nameError = null;
      _emailError = null;
      _passwordError = null;
    });
  }

  bool _validateForm() {
    bool isValid = true;
    setState(() {
      _nameError = null;
      _emailError = null;
      _passwordError = null;

      if (_isSignUp && _nameController.text.trim().isEmpty) {
        _nameError = 'Please enter your full name';
        isValid = false;
      }

      final email = _emailController.text.trim();
      if (email.isEmpty) {
        _emailError = 'Please enter your email address';
        isValid = false;
      } else if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email)) {
        _emailError = 'Please enter a valid email address';
        isValid = false;
      }

      final password = _passwordController.text;
      if (password.isEmpty) {
        _passwordError = 'Please enter your password';
        isValid = false;
      } else if (password.length < 6) {
        _passwordError = 'Password must be at least 6 characters';
        isValid = false;
      }
    });
    return isValid;
  }

  Future<void> _handleSubmit() async {
    if (!_validateForm()) return;

    setState(() {
      _isLoading = true;
    });

    await Future.delayed(const Duration(milliseconds: 1200));

    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isSignUp
            ? '🎉 Welcome to StudPal, ${_nameController.text.trim()}!'
            : '👋 Welcome back! Login successful.'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );

    if (widget.onAuthSuccess != null) {
      widget.onAuthSuccess!();
    }
  }

  void _handleForgotPassword() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.lock_reset_rounded, color: AppColors.primary),
            SizedBox(width: 8),
            Text('Reset Password', style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w700)),
          ],
        ),
        content: const Text(
          'Enter your registered email address and we will send you a password reset link.',
          style: TextStyle(fontFamily: 'Inter', fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(fontFamily: 'Inter', color: AppColors.secondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('📧 Password reset link sent to your email!'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
            child: const Text('Send Link', style: TextStyle(fontFamily: 'Inter', color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
            child: Form(
              key: _formKey,
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

                  const SizedBox(height: 32),

                  // 2. Headline & Subtitle (Exact Match to Reference Screenshot)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 250),
                        child: Text(
                          _isSignUp ? 'Create Your Account' : 'Welcome Back',
                          key: ValueKey(_isSignUp),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                            letterSpacing: -0.6,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _isSignUp ? 'Start your journey with StudPal' : 'Log in to continue learning',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // 3. Form Input Fields (Full Name, Email, Password)
                  if (_isSignUp) ...[
                    _buildTextField(
                      controller: _nameController,
                      hintText: 'Full Name',
                      icon: Icons.person_outline_rounded,
                      errorText: _nameError,
                      isDark: isDark,
                      onChanged: (val) {
                        if (_nameError != null) setState(() => _nameError = null);
                      },
                    ),
                    const SizedBox(height: 16),
                  ],

                  _buildTextField(
                    controller: _emailController,
                    hintText: 'Email Address',
                    icon: Icons.mail_outline_rounded,
                    keyboardType: TextInputType.emailAddress,
                    errorText: _emailError,
                    isDark: isDark,
                    onChanged: (val) {
                      if (_emailError != null) setState(() => _emailError = null);
                    },
                  ),

                  const SizedBox(height: 16),

                  _buildTextField(
                    controller: _passwordController,
                    hintText: 'Password',
                    icon: Icons.lock_outline_rounded,
                    obscureText: _obscurePassword,
                    errorText: _passwordError,
                    isDark: isDark,
                    onChanged: (val) {
                      if (_passwordError != null) setState(() => _passwordError = null);
                    },
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                        color: AppColors.secondary,
                        size: 20,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Remember Me & Forgot Password Options
                  if (!_isSignUp) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            SizedBox(
                              width: 24,
                              height: 24,
                              child: Checkbox(
                                value: _rememberMe,
                                activeColor: AppColors.primary,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                                onChanged: (val) {
                                  setState(() {
                                    _rememberMe = val ?? false;
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Remember me',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 13,
                                color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                              ),
                            ),
                          ],
                        ),
                        GestureDetector(
                          onTap: _handleForgotPassword,
                          child: const Text(
                            'Forgot Password?',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                  ],

                  const SizedBox(height: 10),

                  // 4. Primary CTA Button ("Sign Up" / "Log In") positioned right below password!
                  _isLoading
                      ? Container(
                          height: 56,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.8),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Center(
                            child: SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        )
                      : PrimaryButton(
                          label: _isSignUp ? 'Sign Up' : 'Log In',
                          backgroundColor: AppColors.primary,
                          onPressed: _handleSubmit,
                        ),

                  const SizedBox(height: 28),

                  // 5. Divider
                  Row(
                    children: [
                      Expanded(
                        child: Divider(
                          color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                          thickness: 1,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14.0),
                        child: Text(
                          'or continue with',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Divider(
                          color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
                          thickness: 1,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // 6. Social Sign-In Row (Google, Apple, Facebook)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildSocialButton(
                        isDark: isDark,
                        iconWidget: Image.network(
                          'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                          width: 22,
                          height: 22,
                          errorBuilder: (context, error, stackTrace) => const Text('🔴', style: TextStyle(fontSize: 20)),
                        ),
                        onPressed: () {},
                      ),
                      const SizedBox(width: 16),
                      _buildSocialButton(
                        isDark: isDark,
                        iconWidget: Icon(
                          Icons.apple_rounded,
                          size: 26,
                          color: isDark ? Colors.white : Colors.black,
                        ),
                        onPressed: () {},
                      ),
                      const SizedBox(width: 16),
                      _buildSocialButton(
                        isDark: isDark,
                        iconWidget: const Icon(
                          Icons.facebook_rounded,
                          size: 26,
                          color: Color(0xFF1877F2),
                        ),
                        onPressed: () {},
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // 7. Footer Mode Toggle Link
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _isSignUp ? 'Already have an account? ' : "Don't have an account? ",
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          color: isDark ? AppColors.textSecondaryDark : AppColors.secondary,
                        ),
                      ),
                      GestureDetector(
                        onTap: _toggleAuthMode,
                        child: Text(
                          _isSignUp ? 'Log in' : 'Sign up',
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
    bool obscureText = false,
    TextInputType keyboardType = TextInputType.text,
    String? errorText,
    Widget? suffixIcon,
    required bool isDark,
    Function(String)? onChanged,
  }) {
    final hasError = errorText != null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: BoxDecoration(
            color: isDark ? AppColors.cardDark : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: hasError
                  ? AppColors.error
                  : (isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
              width: hasError ? 1.5 : 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: (hasError ? AppColors.error : Colors.black).withValues(alpha: isDark ? 0.1 : 0.03),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: TextField(
            controller: controller,
            obscureText: obscureText,
            keyboardType: keyboardType,
            onChanged: onChanged,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 15,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
            decoration: InputDecoration(
              hintText: hintText,
              hintStyle: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 15,
                color: AppColors.secondary,
              ),
              prefixIcon: Icon(
                icon,
                color: hasError ? AppColors.error : AppColors.secondary,
                size: 20,
              ),
              suffixIcon: suffixIcon,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            ),
          ),
        ),
        if (hasError) ...[
          const SizedBox(height: 6),
          Padding(
            padding: const EdgeInsets.only(left: 12.0),
            child: Row(
              children: [
                const Icon(Icons.error_outline_rounded, size: 14, color: AppColors.error),
                const SizedBox(width: 4),
                Text(
                  errorText,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12,
                    color: AppColors.error,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildSocialButton({
    required bool isDark,
    required Widget iconWidget,
    required VoidCallback onPressed,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 76,
          height: 56,
          decoration: BoxDecoration(
            color: isDark ? AppColors.cardDark : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Center(child: iconWidget),
        ),
      ),
    );
  }
}
