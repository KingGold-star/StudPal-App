// src/components/LevelUpModal.js

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Modal from "./CustomModal";
import Svg, { Path, Circle, Polygon } from "react-native-svg";

const StarIcon = ({ size = 20, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

const SparkleIcon = ({ size = 24, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </Svg>
);

export default function LevelUpModal({ levelInfo, visible, onClose }) {
  if (!visible || !levelInfo) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.cardContainer}>
          {/* Sparkle Header */}
          <View style={styles.sparkleBox}>
            <SparkleIcon size={32} color="#6236FF" />
          </View>

          <Text style={styles.tagline}>LEVEL UP!</Text>
          <Text style={styles.headline}>You reached Level {levelInfo.level}</Text>
          <Text style={styles.titleText}>{levelInfo.title}</Text>

          {/* Level Badge Circle */}
          <View style={styles.badgeCircle}>
            <Text style={styles.badgeNumber}>{levelInfo.level}</Text>
          </View>

          <Text style={styles.subtext}>
            Your dedication and consistency are paying off. Keep building your study momentum!
          </Text>

          <TouchableOpacity style={styles.dismissBtn} onPress={onClose} activeOpacity={0.88}>
            <Text style={styles.dismissBtnText}>Continue Learning →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "rgba(98, 54, 255, 0.15)",
  },
  sparkleBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "900",
    color: "#6236FF",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headline: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D62FF",
    marginBottom: 16,
    textAlign: "center",
  },
  badgeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#6236FF",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    shadowColor: "#6236FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  subtext: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginVertical: 14,
  },
  dismissBtn: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#6236FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  dismissBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
