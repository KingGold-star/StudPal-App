import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// StudPal Official Typography System
/// Uses `Inter` everywhere as specified in the Brand Identity.
abstract class AppTypography {
  static TextTheme textTheme(Brightness brightness) {
    final bool isDark = brightness == Brightness.dark;
    final Color primaryColor = isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final Color secondaryColor = isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;

    return GoogleFonts.interTextTheme().copyWith(
      // H1: 40-56px, Bold
      displayLarge: GoogleFonts.inter(
        fontSize: 48,
        fontWeight: FontWeight.w700,
        color: primaryColor,
        letterSpacing: -1.0,
        height: 1.15,
      ),
      displayMedium: GoogleFonts.inter(
        fontSize: 40,
        fontWeight: FontWeight.w700,
        color: primaryColor,
        letterSpacing: -0.8,
        height: 1.2,
      ),
      // H2: 24px, Bold
      headlineMedium: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        color: primaryColor,
        letterSpacing: -0.4,
        height: 1.3,
      ),
      // H3: 20px, Semibold
      headlineSmall: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        letterSpacing: -0.2,
        height: 1.35,
      ),
      // Body: 16px, Regular
      bodyLarge: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: secondaryColor,
        height: 1.5,
      ),
      // Small: 14px, Regular
      bodyMedium: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: secondaryColor,
        height: 1.45,
      ),
      // Caption: 12px, Medium
      bodySmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: secondaryColor,
        height: 1.4,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
      ),
      labelSmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: secondaryColor,
      ),
    );
  }
}
