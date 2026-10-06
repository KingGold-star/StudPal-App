import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../theme/themeContext";

export default function GoalActivityHeatmap({
  monthName = "AUGUST",
  heatmapData = [
    [ { day: 1, pct: 100, completed: 4, planned: 4 }, { day: 2, pct: 80, completed: 4, planned: 5 }, { day: 3, pct: 100, completed: 3, planned: 3 }, { day: 4, pct: 75, completed: 3, planned: 4 }, { day: 5, pct: 100, completed: 5, planned: 5 }, { day: 6, pct: 67, completed: 2, planned: 3 }, { day: 7, pct: 0, completed: 0, planned: 0 } ],
    [ { day: 8, pct: 100, completed: 4, planned: 4 }, { day: 9, pct: 85, completed: 6, planned: 7 }, { day: 10, pct: 90, completed: 9, planned: 10 }, { day: 11, pct: 100, completed: 4, planned: 4 }, { day: 12, pct: 75, completed: 3, planned: 4 }, { day: 13, pct: 100, completed: 5, planned: 5 }, { day: 14, pct: 0, completed: 0, planned: 0 } ],
    [ { day: 15, pct: 80, completed: 4, planned: 5 }, { day: 16, pct: 100, completed: 5, planned: 5 }, { day: 17, pct: 100, completed: 4, planned: 4 }, { day: 18, pct: 70, completed: 7, planned: 10 }, { day: 19, pct: 90, completed: 9, planned: 10 }, { day: 20, pct: 100, completed: 4, planned: 4 }, { day: 21, pct: 86, completed: 6, planned: 7 } ],
    [ { day: 22, pct: 100, completed: 4, planned: 4 }, { day: 23, pct: 80, completed: 4, planned: 5 }, { day: 24, pct: 100, completed: 3, planned: 3 }, { day: 25, pct: 100, completed: 4, planned: 4 }, { day: 26, pct: 75, completed: 3, planned: 4 }, { day: 27, pct: 100, completed: 5, planned: 5 }, { day: 28, pct: 80, completed: 4, planned: 5 } ],
  ],
}) {
  const { isDark, accentColor } = useTheme();
  const [selectedCell, setSelectedCell] = useState(heatmapData[2][6]); // Default Aug 21

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  const getCellBgColor = (cell) => {
    if (!cell || cell.planned === 0) return isDark ? "#1E293B" : "#F1F5F9";
    if (cell.pct === 100) return accentColor || "#1E40AF";
    if (cell.pct >= 80) return "#2D62FF";
    if (cell.pct >= 60) return "#3B82F6";
    return isDark ? "#243247" : "#93C5FD";
  };

  const legendColors = isDark
    ? ["#1E293B", "#243247", "#3B82F6", "#2D62FF", accentColor || "#1E40AF"]
    : ["#F1F5F9", "#93C5FD", "#3B82F6", "#2D62FF", "#1E40AF"];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.monthTitle, isDark && { color: "#F8FAFC" }]}>{monthName}</Text>
        <View style={styles.legendRow}>
          <Text style={[styles.legendText, isDark && { color: "#94A3B8" }]}>Less</Text>
          {legendColors.map((c, i) => (
            <View key={i} style={[styles.legendBox, { backgroundColor: c }]} />
          ))}
          <Text style={[styles.legendText, isDark && { color: "#94A3B8" }]}>More</Text>
        </View>
      </View>

      {/* Floating Dark Glass Tooltip */}
      {selectedCell && (
        <View style={[
          styles.tooltipContainer,
          isDark && { backgroundColor: "#1E293B", borderWidth: 0, borderColor: "transparent" }
        ]}>
          <Text style={[styles.tooltipTitle, { color: accentColor || "#60A5FA" }]}>{monthName} {selectedCell.day}</Text>
          <Text style={styles.tooltipSub}>
            {selectedCell.planned > 0
              ? `${selectedCell.completed} of ${selectedCell.planned} goals completed (${selectedCell.pct}%)`
              : "No goals scheduled"}
          </Text>
        </View>
      )}

      {/* Heatmap Grid */}
      <View style={styles.gridContainer}>
        {/* Days Header */}
        <View style={styles.daysHeaderRow}>
          {daysOfWeek.map((d, i) => (
            <Text key={i} style={[styles.dayHeaderCell, isDark && { color: "#94A3B8" }]}>{d}</Text>
          ))}
        </View>

        {/* Heatmap Rows */}
        {heatmapData.map((row, rIdx) => (
          <View key={rIdx} style={styles.weekRow}>
            {row.map((cell, cIdx) => {
              const isSelected = selectedCell && selectedCell.day === cell.day;
              return (
                <TouchableOpacity
                  key={cIdx}
                  style={[
                    styles.cellBox,
                    { backgroundColor: getCellBgColor(cell) },
                    isDark && { borderColor: "transparent" },
                    isSelected && [styles.cellBoxSelected, { borderColor: accentColor || "#2D62FF" }],
                  ]}
                  onPress={() => setSelectedCell(cell)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.cellText,
                    isDark && cell.pct < 60 && { color: "#94A3B8" },
                    cell.pct >= 60 && styles.cellTextLight
                  ]}>
                    {cell.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#2D62FF",
    letterSpacing: 1.2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#94A3B8",
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  tooltipContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: "center",
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#2D62FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tooltipTitle: {
    color: "#60A5FA",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  tooltipSub: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "700",
    marginTop: 2,
  },
  gridContainer: {
    gap: 7,
  },
  daysHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  dayHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 7,
  },
  cellBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cellBoxSelected: {
    borderWidth: 2.5,
    borderColor: "#0F172A",
  },
  cellText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#475569",
  },
  cellTextLight: {
    color: "#FFFFFF",
  },
});
