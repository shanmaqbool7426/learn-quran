import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AyahCard from "@/components/AyahCard";
import { FATIHA_AYAHS, IKHLAS_AYAHS, SURAHS } from "@/constants/quranData";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setLastRead } = useApp();

  const surahId = parseInt(id ?? "1");
  const surah = SURAHS.find(s => s.id === surahId);

  const [showTranslation, setShowTranslation] = useState(true);
  const [showTranslit, setShowTranslit] = useState(false);
  const [fontSize, setFontSize] = useState(24);

  const ayahs = surahId === 1 ? FATIHA_AYAHS : surahId === 112 ? IKHLAS_AYAHS : FATIHA_AYAHS;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  if (!surah) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.surahName, { color: colors.foreground }]}>{surah.name}</Text>
            <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>
              {surah.ayahs} Ayahs • {surah.type}
            </Text>
          </View>
          <Text style={[styles.arabicName, { color: colors.primary }]}>{surah.arabicName}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showTranslation ? colors.primary : colors.muted }]}
            onPress={() => setShowTranslation(p => !p)}
          >
            <Text style={[styles.controlText, { color: showTranslation ? "#FFFFFF" : colors.mutedForeground }]}>Translation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showTranslit ? colors.primary : colors.muted }]}
            onPress={() => setShowTranslit(p => !p)}
          >
            <Text style={[styles.controlText, { color: showTranslit ? "#FFFFFF" : colors.mutedForeground }]}>Transliteration</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fontBtn, { backgroundColor: colors.muted }]}
            onPress={() => setFontSize(p => p === 24 ? 20 : p === 20 ? 28 : 24)}
          >
            <Feather name="type" size={16} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: 16, paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const progress = nativeEvent.contentOffset.y / (nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height);
          const ayahIndex = Math.floor(progress * ayahs.length);
          setLastRead(surahId, Math.min(ayahIndex + 1, ayahs.length));
        }}
        scrollEventThrottle={200}
      >
        {/* Bismillah */}
        {surahId !== 9 && surahId !== 1 && (
          <View style={styles.bismillah}>
            <Text style={[styles.bismillahText, { color: colors.primary }]}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
          </View>
        )}

        {ayahs.map(ayah => (
          <AyahCard
            key={ayah.number}
            ayah={{ ...ayah, arabic: ayah.arabic }}
            surahId={surahId}
            showTranslation={showTranslation}
            showTransliteration={showTranslit}
          />
        ))}

        {/* Placeholder for other surahs */}
        {surahId !== 1 && surahId !== 112 && (
          <View style={[styles.placeholder, { backgroundColor: colors.muted, borderRadius: colors.radius, marginHorizontal: 20, marginTop: 8 }]}>
            <Feather name="download-cloud" size={28} color={colors.mutedForeground} />
            <Text style={[styles.placeholderTitle, { color: colors.foreground }]}>Full Surah Coming Soon</Text>
            <Text style={[styles.placeholderSub, { color: colors.mutedForeground }]}>
              The complete Arabic text for {surah.name} ({surah.ayahs} ayahs) will be available in the next update. Showing Al-Fatiha as preview.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1 },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  backBtn: { padding: 4 },
  headerInfo: { flex: 1 },
  surahName: { fontSize: 17, fontFamily: "Inter_700Bold" },
  surahMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  arabicName: { fontSize: 22, fontWeight: "400" },
  controls: { flexDirection: "row", gap: 8, alignItems: "center" },
  controlBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  controlText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  fontBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", marginLeft: "auto" },
  bismillah: { alignItems: "center", paddingVertical: 20 },
  bismillahText: { fontSize: 26, fontWeight: "400", lineHeight: 44 },
  placeholder: { padding: 24, alignItems: "center", gap: 10, marginBottom: 20 },
  placeholderTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  placeholderSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
});
