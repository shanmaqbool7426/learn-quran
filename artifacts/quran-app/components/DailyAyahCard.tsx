import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { DAILY_AYAHS } from "@/constants/quranData";
import { useColors } from "@/hooks/useColors";

export default function DailyAyahCard() {
  const colors = useColors();
  const [ayah, setAyah] = useState(DAILY_AYAHS[0]);

  useEffect(() => {
    const idx = new Date().getDay() % DAILY_AYAHS.length;
    setAyah(DAILY_AYAHS[idx]);
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryLight, "#1DB874"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderRadius: colors.radius }]}
    >
      <View style={styles.header}>
        <Text style={styles.label}>Daily Ayah</Text>
        <Text style={styles.ref}>{ayah.reference}</Text>
      </View>

      <Text style={styles.arabic}>{ayah.arabic}</Text>

      <View style={styles.divider} />

      <Text style={styles.translation} numberOfLines={3}>{ayah.translation}</Text>

      <View style={styles.ornament}>
        <Text style={styles.ornamentText}>✦</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    marginHorizontal: 20,
    overflow: "hidden",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  ref: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  arabic: {
    color: "#FFFFFF",
    fontSize: 26,
    textAlign: "right",
    lineHeight: 46,
    fontWeight: "400",
    marginBottom: 16,
    writingDirection: "rtl",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 14,
  },
  translation: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    fontStyle: "italic",
  },
  ornament: {
    position: "absolute",
    right: 20,
    bottom: 20,
    opacity: 0.15,
  },
  ornamentText: {
    color: "#FFFFFF",
    fontSize: 48,
  },
});
