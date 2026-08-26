// src/components/XpHistoryModal.js

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "./CustomModal";
import Svg, { Path, Circle } from "react-native-svg";

const CloseIcon = ({ size = 20, color = "#64748B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const BoltIcon = ({ size = 16, color = "#6236FF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

export default function XpHistoryModal({ history = [], visible, onClose }) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.headerRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={styles.iconCircle}>
                <BoltIcon size={18} color="#6236FF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>XP Activity Log</Text>
                <Text style={styles.headerSub}>Detailed breakdown of earned points</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
            {history.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No XP transactions recorded yet.</Text>
              </View>
            ) : (
              history.map((evt) => {
                const dateObj = new Date(evt.timestamp);
                const timeFormatted = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateFormatted = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                return (
                  <View key={evt.id} style={styles.eventRow}>
                    <View style={styles.eventLeft}>
                      <Text style={styles.eventTitle}>{evt.title}</Text>
                      <Text style={styles.eventMeta}>
                        {dateFormatted} at {timeFormatted} • {evt.activityType.replace('_', ' ')}
                      </Text>
                    </View>
                    <View style={styles.xpPill}>
                      <Text style={styles.xpPillText}>+{evt.xpAmount} XP</Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSub: {
    fontSize: 12,
    color: "#64748B",
  },
  closeBtn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  listScroll: {
    paddingTop: 12,
  },
  emptyBox: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  eventLeft: {
    flex: 1,
    paddingRight: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  eventMeta: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  xpPill: {
    backgroundColor: "rgba(98, 54, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  xpPillText: {
    color: "#6236FF",
    fontWeight: "800",
    fontSize: 13,
  },
});
