import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  ayah: {
    number: number;
    arabic: string;
    translation: string;
    transliteration?: string;
    audioUrl?: string;
    globalNumber?: number;
  };
  surahId: number;
  showTranslation?: boolean;
  showTransliteration?: boolean;
  isPlaying?: boolean;
  isLoading?: boolean;
  onPlayPress?: () => void;
}

export default function AyahCard({
  ayah,
  surahId,
  showTranslation = true,
  showTransliteration = false,
  isPlaying = false,
  isLoading = false,
  onPlayPress,
}: Props) {
  const colors = useColors();
  const { toggleBookmark, bookmarks } = useApp();
  const ayahId = surahId * 1000 + ayah.number;
  const isBookmarked = bookmarks.includes(ayahId);
  const [highlighted, setHighlighted] = useState(false);

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(ayahId);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isPlaying
            ? colors.secondary
            : highlighted
            ? colors.muted
            : colors.card,
          borderColor: isPlaying ? colors.primary : colors.border,
          borderWidth: isPlaying ? 2 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.ayahNum, { backgroundColor: isPlaying ? colors.primary : colors.secondary }]}>
          <Text style={[styles.ayahNumText, { color: isPlaying ? "#FFFFFF" : colors.primary }]}>
            {ayah.number}
          </Text>
        </View>

        <View style={styles.actions}>
          {onPlayPress && (
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPlayPress(); }}
              style={[styles.actionBtn, { backgroundColor: isPlaying ? colors.primary : colors.muted }]}
            >
              {isLoading ? (
                <ActivityIndicator size={13} color={isPlaying ? "#FFFFFF" : colors.primary} />
              ) : (
                <Feather
                  name={isPlaying ? "pause" : "play"}
                  size={13}
                  color={isPlaying ? "#FFFFFF" : colors.primary}
                />
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setHighlighted(p => !p); }}
            style={styles.iconBtn}
          >
            <Feather name="edit-2" size={15} color={highlighted ? colors.accent : colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark} style={styles.iconBtn}>
            <Feather name="bookmark" size={15} color={isBookmarked ? colors.accent : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.arabic, { color: colors.foreground }]}>{ayah.arabic}</Text>

      {showTransliteration && ayah.transliteration && (
        <Text style={[styles.transliteration, { color: colors.mutedForeground }]}>{ayah.transliteration}</Text>
      )}

      {showTranslation && (
        <Text style={[styles.translation, { color: colors.mutedForeground }]}>{ayah.translation}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, marginHorizontal: 20, marginBottom: 12, borderRadius: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  ayahNum: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ayahNumText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  actions: { flexDirection: "row", gap: 8, alignItems: "center" },
  actionBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  iconBtn: { padding: 4 },
  arabic: { fontSize: 24, textAlign: "right", lineHeight: 42, fontWeight: "400", writingDirection: "rtl", marginBottom: 12 },
  transliteration: { fontSize: 13, fontFamily: "Inter_400Regular", fontStyle: "italic", marginBottom: 8, lineHeight: 20 },
  translation: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
});
