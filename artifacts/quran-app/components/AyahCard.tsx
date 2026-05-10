import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { fetchTafseer } from "@/services/aiService";

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
  surahName?: string;
  showTranslation?: boolean;
  showTransliteration?: boolean;
  isPlaying?: boolean;
  isLoading?: boolean;
  onPlayPress?: () => void;
  fontSize?: number;
}

export default function AyahCard({
  ayah,
  surahId,
  surahName = "Surah",
  showTranslation = true,
  showTransliteration = false,
  isPlaying = false,
  isLoading = false,
  onPlayPress,
  fontSize = 24,
}: Props) {
  const colors = useColors();
  const { toggleBookmark, bookmarks } = useApp();
  const ayahId = surahId * 1000 + ayah.number;
  const isBookmarked = bookmarks.includes(ayahId);
  const [highlighted, setHighlighted] = useState(false);
  const [tafseerVisible, setTafseerVisible] = useState(false);
  const [tafseerText, setTafseerText] = useState("");
  const [tafseerLoading, setTafseerLoading] = useState(false);

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(ayahId);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${ayah.arabic}\n\n"${ayah.translation}"\n\n— ${surahName} ${surahId}:${ayah.number} | Quran`,
        title: `${surahName} ${surahId}:${ayah.number}`,
      });
    } catch {}
  };

  const handleTafseer = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTafseerVisible(true);
    if (!tafseerText) {
      setTafseerLoading(true);
      try {
        const result = await fetchTafseer(
          surahId,
          surahName,
          ayah.number,
          ayah.arabic,
          ayah.translation
        );
        setTafseerText(result.tafseer);
      } catch {
        setTafseerText("Could not load tafseer. Please check your connection and try again.");
      } finally {
        setTafseerLoading(false);
      }
    }
  };

  return (
    <>
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
              onPress={handleTafseer}
              style={[styles.iconBtn, { backgroundColor: "#8B5CF620", borderRadius: 12 }]}
            >
              <Feather name="book" size={14} color="#8B5CF6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.iconBtn}
            >
              <Feather name="share-2" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setHighlighted(p => !p); }}
              style={styles.iconBtn}
            >
              <Feather name="edit-2" size={14} color={highlighted ? colors.accent : colors.mutedForeground} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBookmark} style={styles.iconBtn}>
              <Feather name="bookmark" size={14} color={isBookmarked ? colors.accent : colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.arabic, { color: colors.foreground, fontSize }]}>{ayah.arabic}</Text>

        {showTransliteration && ayah.transliteration && (
          <Text style={[styles.transliteration, { color: colors.mutedForeground }]}>{ayah.transliteration}</Text>
        )}

        {showTranslation && (
          <Text style={[styles.translation, { color: colors.mutedForeground }]}>{ayah.translation}</Text>
        )}

        <TouchableOpacity
          style={[styles.tafseerBtn, { backgroundColor: "#8B5CF610", borderColor: "#8B5CF630" }]}
          onPress={handleTafseer}
        >
          <Feather name="cpu" size={12} color="#8B5CF6" />
          <Text style={styles.tafseerBtnText}>AI Tafseer</Text>
          <Feather name="chevron-right" size={12} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={tafseerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTafseerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.modalAIBadge, { backgroundColor: "#8B5CF620" }]}>
                  <Feather name="cpu" size={14} color="#8B5CF6" />
                  <Text style={styles.modalAIText}>AI Tafseer</Text>
                </View>
                <TouchableOpacity onPress={() => setTafseerVisible(false)}>
                  <Feather name="x" size={22} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.modalRef, { color: colors.mutedForeground }]}>
                {surahName} • Ayah {ayah.number}
              </Text>
            </View>

            <View style={[styles.modalAyahBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.modalArabic, { color: colors.foreground }]}>{ayah.arabic}</Text>
              <Text style={[styles.modalTranslation, { color: colors.mutedForeground }]}>{ayah.translation}</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              {tafseerLoading ? (
                <View style={styles.tafseerLoading}>
                  <ActivityIndicator color="#8B5CF6" size="large" />
                  <Text style={[styles.tafseerLoadingText, { color: colors.mutedForeground }]}>
                    Generating Tafseer...
                  </Text>
                </View>
              ) : (
                <View style={[styles.tafseerContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.tafseerText, { color: colors.foreground }]}>{tafseerText}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.refreshTafseer, { borderColor: colors.border }]}
                onPress={() => { setTafseerText(""); setTafseerLoading(true); handleTafseer(); }}
              >
                <Feather name="refresh-cw" size={14} color={colors.mutedForeground} />
                <Text style={[styles.refreshTafseerText, { color: colors.mutedForeground }]}>Regenerate</Text>
              </TouchableOpacity>

              <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
                AI-generated tafseer. For authoritative scholarship, consult certified Islamic scholars.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, marginHorizontal: 20, marginBottom: 12, borderRadius: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  ayahNum: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ayahNumText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  actions: { flexDirection: "row", gap: 6, alignItems: "center" },
  actionBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  iconBtn: { padding: 5 },
  arabic: { textAlign: "right", lineHeight: 44, fontWeight: "400", writingDirection: "rtl", marginBottom: 12 },
  transliteration: { fontSize: 13, fontFamily: "Inter_400Regular", fontStyle: "italic", marginBottom: 8, lineHeight: 20 },
  translation: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  tafseerBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, alignSelf: "flex-start" },
  tafseerBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#8B5CF6" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "85%", minHeight: "60%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 8 },
  modalHeader: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  modalTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalAIBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  modalAIText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#8B5CF6" },
  modalRef: { fontSize: 13, fontFamily: "Inter_400Regular" },
  modalAyahBox: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 14, borderWidth: 1, gap: 8 },
  modalArabic: { fontSize: 20, textAlign: "right", lineHeight: 38, fontWeight: "400", writingDirection: "rtl" },
  modalTranslation: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, fontStyle: "italic" },
  modalContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  tafseerLoading: { alignItems: "center", paddingVertical: 40, gap: 16 },
  tafseerLoadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  tafseerContent: { padding: 18, borderRadius: 16, borderWidth: 1 },
  tafseerText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 24 },
  refreshTafseer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderWidth: 1, borderRadius: 12 },
  refreshTafseerText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  disclaimer: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 18 },
});
