import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AudioPlayer from "@/components/AudioPlayer";
import AyahCard from "@/components/AyahCard";
import { DEFAULT_RECITER, Reciter } from "@/constants/reciters";
import { useApp } from "@/context/AppContext";
import { useQuranSurah } from "@/hooks/useQuranSurah";
import { useColors } from "@/hooks/useColors";
import { AUDIO_CDN } from "@/services/quranApi";

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setLastRead } = useApp();

  const surahId = parseInt(id ?? "1");
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTranslit, setShowTranslit] = useState(false);
  const [reciter, setReciter] = useState<Reciter>(DEFAULT_RECITER);
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const { data, isLoading, isError } = useQuranSurah(surahId, reciter.edition);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const audioUrls =
    data?.audioAyahs.map((a) => a.audio ?? `${AUDIO_CDN}/${reciter.edition}/${a.number}.mp3`) ??
    [];

  const ayahNumbers = data?.arabicAyahs.map((a) => a.numberInSurah) ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.surahName, { color: colors.foreground }]}>
              {data?.surah.englishName ?? `Surah ${surahId}`}
            </Text>
            <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>
              {data
                ? `${data.surah.numberOfAyahs} Ayahs • ${data.surah.revelationType}`
                : "Loading..."}
            </Text>
          </View>
          <Text style={[styles.arabicName, { color: colors.primary }]}>
            {data?.surah.name ?? ""}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showTranslation ? colors.primary : colors.muted }]}
            onPress={() => setShowTranslation((p) => !p)}
          >
            <Text style={[styles.controlText, { color: showTranslation ? "#FFFFFF" : colors.mutedForeground }]}>
              Translation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showTranslit ? colors.primary : colors.muted }]}
            onPress={() => setShowTranslit((p) => !p)}
          >
            <Text style={[styles.controlText, { color: showTranslit ? "#FFFFFF" : colors.mutedForeground }]}>
              Transliteration
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio Player */}
      {data && (
        <AudioPlayer
          audioUrls={audioUrls}
          ayahNumbers={ayahNumbers}
          currentIndex={currentAyahIdx}
          onAyahChange={(idx) => {
            setCurrentAyahIdx(idx);
            setPlayingIdx(idx);
            setLastRead(surahId, ayahNumbers[idx] ?? idx + 1);
          }}
          reciter={reciter}
          onReciterChange={(r) => {
            setReciter(r);
            setPlayingIdx(null);
          }}
          totalAyahs={data.surah.numberOfAyahs}
          surahName={data.surah.englishName}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading Quran data...
          </Text>
        </View>
      )}

      {isError && (
        <View style={styles.loadingState}>
          <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Could not load surah. Check your connection.
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          if (!data) return;
          const progress =
            nativeEvent.contentOffset.y /
            Math.max(1, nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height);
          const ayahIndex = Math.floor(progress * (data.arabicAyahs.length - 1));
          setLastRead(surahId, ayahNumbers[ayahIndex] ?? ayahIndex + 1);
        }}
        scrollEventThrottle={400}
      >
        {/* Bismillah */}
        {surahId !== 9 && surahId !== 1 && data && (
          <View style={styles.bismillah}>
            <Text style={[styles.bismillahText, { color: colors.primary }]}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
          </View>
        )}

        {data?.arabicAyahs.map((arabicAyah, idx) => {
          const translationAyah = data.translationAyahs[idx];
          const audioAyah = data.audioAyahs[idx];
          const audioUrl =
            audioAyah?.audio ?? `${AUDIO_CDN}/${reciter.edition}/${arabicAyah.number}.mp3`;

          return (
            <AyahCard
              key={arabicAyah.numberInSurah}
              ayah={{
                number: arabicAyah.numberInSurah,
                arabic: arabicAyah.text,
                translation: translationAyah?.text ?? "",
                audioUrl,
                globalNumber: arabicAyah.number,
              }}
              surahId={surahId}
              showTranslation={showTranslation}
              showTransliteration={showTranslit}
              isPlaying={playingIdx === idx}
              onPlayPress={() => {
                setCurrentAyahIdx(idx);
                setPlayingIdx(playingIdx === idx ? null : idx);
              }}
            />
          );
        })}
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
  controls: { flexDirection: "row", gap: 8 },
  controlBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  controlText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  bismillah: { alignItems: "center", paddingVertical: 20 },
  bismillahText: { fontSize: 26, fontWeight: "400", lineHeight: 44 },
  loadingState: { alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
