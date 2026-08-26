import 'package:flutter/material.dart';

/// StudPal Official Brand Colors
/// Sourced directly from the official StudPal Brand Identity & Design System.
abstract class AppColors {
  // Brand Primary & Accent
  static const Color primary = Color(0xFF112B8A);       // Deep Royal Navy
  static const Color brandOrange = Color(0xFFFF5B00);  // StudPal Vibrant Orange Accent
  static const Color secondary = Color(0xFF8F95A5);     // Cool Slate Muted
  static const Color accent = Color(0xFF2D62FF);        // Bright Royal Blue
  static const Color link = Color(0xFF2D62FF);

  // Surface & Neutrals (Light Mode)
  static const Color backgroundLight = Color(0xFFFFFFFF);
  static const Color surfaceLight = Color(0xFFF7F8FA);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color textPrimaryLight = Color(0xFF0B0B0F);
  static const Color textSecondaryLight = Color(0xFF71717A);
  static const Color borderLight = Color(0xFFE5E7EB);
  static const Color dividerLight = Color(0xFFF3F4F6);

  // Feedback & State Colors
  static const Color success = Color(0xFF22C55E);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);

  // Dark Mode Palette
  static const Color backgroundDark = Color(0xFF070B19);
  static const Color surfaceDark = Color(0xFF0F172A);
  static const Color cardDark = Color(0xFF131D38);
  static const Color textPrimaryDark = Color(0xFFF8FAFC);
  static const Color textSecondaryDark = Color(0xFF94A3B8);
  static const Color borderDark = Color(0xFF1E293B);
  static const Color dividerDark = Color(0xFF1E293B);
}
