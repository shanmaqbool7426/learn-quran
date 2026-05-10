import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ayah } from "@/constants/quranData";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  ayah: Ayah;
  surahId: number;
  showTranslation?: boolean;
  showTransliteration?: boolean;
}

export default function AyahCard({ ayah, surahId, showTranslation = true, showTransliteration = false }: Props) {
  const colors = useColors();
  const { toggleBookmark, bookmarks } = useApp();
  const ayahId = surahId * 1000 + ayah.number;
  const isBookmarked = bookmarks.includes(ayahId);
  const [highlighted, setHighlighted] = useState(false);

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(ayahId);
  };

  const handleHighlight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHighlighted(prev => !prev);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: highlighted ? colors.secondary : colors.card, borderColor: colors.border }
    ]}>
      <View style={styles.header}>
        <View style={[styles.ayahNum, { backgroundColor: colors.primary }]}>
          <Text style={styles.ayahNumText}>{ayah.number}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleHighlight} style={styles.actionBtn}>
            <Feather name="edit-2" size={16} color={highlighted ? colors.accent : colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark} style={styles.actionBtn}>
            <Feather name="bookmark" size={16} color={isBookmarked ? colors.accent : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.arabic, { color: colors.foreground }]}>{ayah.arabic}</Text>

      {showTransliteration && (
        <Text style={[styles.transliteration, { color: colors.mutedForeground }]}>{ayah.transliteration}</Text>
      )}

      {showTranslation && (
        <Text style={[styles.translation, { color: colors.mutedForeground }]}>{ayah.translation}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ayahNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  ayahNumText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  arabic: {
    fontSize: 24,
    textAlign: "right",
    lineHeight: 42,
    fontWeight: "400",
    writingDirection: "rtl",
    marginBottom: 12,
  },
  transliteration: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    marginBottom: 8,
    lineHeight: 20,
  },
  translation: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
});
