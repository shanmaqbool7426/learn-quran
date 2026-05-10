import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
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
import { AUDIO_CDN, TRANSLATION_OPTIONS } from "@/services/quranApi";

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setLastRead, fontSize, translationLang, setTranslationLang } = useApp();

  const surahId = parseInt(id ?? "1");
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTranslit, setShowTranslit] = useState(false);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [reciter, setReciter] = useState<Reciter>(DEFAULT_RECITER);
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const currentTranslation = TRANSLATION_OPTIONS.find(t => t.id === translationLang) ?? TRANSLATION_OPTIONS[0]!;

  const { data, isLoading, isError } = useQuranSurah(surahId, reciter.edition, translationLang);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const audioUrls =
    data?.audioAyahs.map((a) => a.audio ?? `${AUDIO_CDN}/${reciter.edition}/${a.number}.mp3`) ?? [];

  const ayahNumbers = data?.arabicAyahs.map((a) => a.numberInSurah) ?? [];

  const surahDescription = data?.surah.revelationType === "Meccan"
    ? "Meccan Surah — Revealed in Makkah"
    : "Medinan Surah — Revealed in Madinah";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPadding + 12, backgroundColor: colors.card, borderBottomColor: colors.border },
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
                ? `${data.surah.numberOfAyahs} Ayahs • ${surahDescription}`
                : "Loading..."}
            </Text>
          </View>
          <Text style={[styles.arabicName, { color: colors.primary }]}>
            {data?.surah.name ?? ""}
          </Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showTranslation ? colors.primary : colors.muted }]}
            onPress={() => setShowTranslation(p => !p)}
          >
            <Text style={[styles.controlText, { color: showTranslation ? "#FFFFFF" : colors.mutedForeground }]}>
              Translation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showTranslit ? colors.primary : colors.muted }]}
            onPress={() => setShowTranslit(p => !p)}
          >
            <Text style={[styles.controlText, { color: showTranslit ? "#FFFFFF" : colors.mutedForeground }]}>
              Transliteration
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: colors.muted, flexDirection: "row", gap: 4 }]}
            onPress={() => setLangModalVisible(true)}
          >
            <Text style={{ fontSize: 12 }}>{currentTranslation.flag}</Text>
            <Text style={[styles.controlText, { color: colors.mutedForeground }]}>
              {currentTranslation.label.split(" ")[0]}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fontRow}>
          <Text style={[styles.fontLabel, { color: colors.mutedForeground }]}>Arabic font:</Text>
          <TouchableOpacity
            style={[styles.fontBtn, { backgroundColor: colors.muted }]}
            onPress={() => { if (fontSize > 18) { /* handled in context */} }}
          >
            <Feather name="type" size={12} color={colors.mutedForeground} />
            <Text style={[styles.fontBtnText, { color: colors.mutedForeground }]}>{fontSize}px</Text>
          </TouchableOpacity>
        </View>
      </View>

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

      {isLoading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading Quran data...</Text>
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
        {surahId !== 9 && surahId !== 1 && data && (
          <View style={styles.bismillah}>
            <Text style={[styles.bismillahText, { color: colors.primary }]}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
            <Text style={[styles.bismillahTrans, { color: colors.mutedForeground }]}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </Text>
          </View>
        )}

        {data?.surah && (
          <View style={[styles.surahInfoBanner, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <View style={styles.surahInfoItem}>
              <Text style={[styles.surahInfoLabel, { color: colors.mutedForeground }]}>Surah No.</Text>
              <Text style={[styles.surahInfoValue, { color: colors.primary }]}>{surahId}</Text>
            </View>
            <View style={[styles.surahInfoDiv, { backgroundColor: colors.border }]} />
            <View style={styles.surahInfoItem}>
              <Text style={[styles.surahInfoLabel, { color: colors.mutedForeground }]}>Ayahs</Text>
              <Text style={[styles.surahInfoValue, { color: colors.primary }]}>{data.surah.numberOfAyahs}</Text>
            </View>
            <View style={[styles.surahInfoDiv, { backgroundColor: colors.border }]} />
            <View style={styles.surahInfoItem}>
              <Text style={[styles.surahInfoLabel, { color: colors.mutedForeground }]}>Origin</Text>
              <Text style={[styles.surahInfoValue, { color: colors.primary }]}>{data.surah.revelationType}</Text>
            </View>
            <View style={[styles.surahInfoDiv, { backgroundColor: colors.border }]} />
            <View style={styles.surahInfoItem}>
              <Text style={[styles.surahInfoLabel, { color: colors.mutedForeground }]}>Meaning</Text>
              <Text style={[styles.surahInfoValue, { color: colors.primary }]} numberOfLines={1}>{data.surah.englishNameTranslation}</Text>
            </View>
          </View>
        )}

        {data?.arabicAyahs.map((arabicAyah, idx) => {
          const translationAyah = data.translationAyahs[idx];
          const audioAyah = data.audioAyahs[idx];
          const audioUrl = audioAyah?.audio ?? `${AUDIO_CDN}/${reciter.edition}/${arabicAyah.number}.mp3`;

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
              surahName={data.surah.englishName}
              showTranslation={showTranslation}
              showTransliteration={showTranslit}
              isPlaying={playingIdx === idx}
              fontSize={fontSize}
              onPlayPress={() => {
                setCurrentAyahIdx(idx);
                setPlayingIdx(playingIdx === idx ? null : idx);
              }}
            />
          );
        })}
      </ScrollView>

      <Modal visible={langModalVisible} animationType="slide" transparent onRequestClose={() => setLangModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Translation Language</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={TRANSLATION_OPTIONS}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 16, gap: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.langOption,
                    { backgroundColor: translationLang === item.id ? colors.secondary : colors.card, borderColor: translationLang === item.id ? colors.primary : colors.border },
                  ]}
                  onPress={() => { setTranslationLang(item.id); setLangModalVisible(false); }}
                >
                  <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                  <Text style={[styles.langLabel, { color: translationLang === item.id ? colors.primary : colors.foreground }]}>
                    {item.label}
                  </Text>
                  {translationLang === item.id && <Feather name="check" size={16} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  controlsRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  controlBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  controlText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  fontRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  fontLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  fontBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  fontBtnText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  loadingState: { alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  bismillah: { alignItems: "center", paddingVertical: 20, gap: 6 },
  bismillahText: { fontSize: 26, fontWeight: "400", lineHeight: 44 },
  bismillahTrans: { fontSize: 12, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  surahInfoBanner: { flexDirection: "row", marginHorizontal: 20, marginBottom: 8, padding: 14, borderRadius: 14, borderWidth: 1 },
  surahInfoItem: { flex: 1, alignItems: "center", gap: 4 },
  surahInfoLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  surahInfoValue: { fontSize: 13, fontFamily: "Inter_700Bold" },
  surahInfoDiv: { width: 1, marginVertical: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "70%", minHeight: "40%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 8 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  langOption: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  langLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
});
