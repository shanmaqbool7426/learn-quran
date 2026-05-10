import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { fetchWordByWord, WordByWord } from "@/services/quranApi";

interface Props {
  surahId: number;
  ayahNumber: number;
  fontSize?: number;
  /** 0–1 fraction of ayah playback — drives word highlight */
  playbackProgress?: number;
  isPlaying?: boolean;
}

/** Single word chip, highlights and pulses when it is the active word */
function WordChip({
  word,
  isActive,
  isEven,
  colors,
  fontSize,
}: {
  word: WordByWord;
  isActive: boolean;
  isEven: boolean;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  fontSize: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Pulse scale
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.06, duration: 420, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
        ])
      ).start();
      // Fade glow in
      Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    } else {
      scaleAnim.stopAnimation();
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  }, [isActive]);

  const chipBg = isActive
    ? colors.primary
    : isEven
    ? colors.secondary
    : colors.muted;

  const arabicColor = isActive ? "#FFFFFF" : colors.primary;
  const translitColor = isActive ? "rgba(255,255,255,0.75)" : colors.mutedForeground;
  const meaningColor = isActive ? "#FFFFFF" : colors.foreground;

  return (
    <Animated.View
      style={[
        styles.wordChip,
        {
          backgroundColor: chipBg,
          borderColor: isActive ? colors.primary : colors.border,
          transform: [{ scale: scaleAnim }],
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glowAnim as any,
          shadowRadius: 8,
          elevation: isActive ? 6 : 0,
        },
      ]}
    >
      <Text
        style={[styles.arabic, { color: arabicColor, fontSize: Math.min(fontSize, 26) }]}
      >
        {word.word}
      </Text>

      <View style={[styles.divider, { backgroundColor: isActive ? "rgba(255,255,255,0.3)" : colors.border }]} />

      {!!word.transliteration && (
        <Text style={[styles.translit, { color: translitColor }]} numberOfLines={1}>
          {word.transliteration}
        </Text>
      )}

      {!!word.translation && (
        <Text style={[styles.meaning, { color: meaningColor }]} numberOfLines={2}>
          {word.translation}
        </Text>
      )}
    </Animated.View>
  );
}

export default function WordByWordView({
  surahId,
  ayahNumber,
  fontSize = 24,
  playbackProgress = 0,
  isPlaying = false,
}: Props) {
  const colors = useColors();
  const [words, setWords] = useState<WordByWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setWords([]);

    fetchWordByWord(surahId, ayahNumber).then((result) => {
      if (cancelled) return;
      if (result.length === 0) setError(true);
      else setWords(result);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [surahId, ayahNumber]);

  // Derive which word index is active from playback progress
  const activeWordIndex = isPlaying && words.length > 0
    ? Math.min(
        Math.floor(playbackProgress * words.length),
        words.length - 1
      )
    : -1;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
          Loading word analysis...
        </Text>
      </View>
    );
  }

  if (error || words.length === 0) {
    return (
      <View style={[styles.errorBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          Word-by-word data unavailable for this ayah
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Active word callout strip */}
      {isPlaying && activeWordIndex >= 0 && words[activeWordIndex] && (
        <View style={[styles.activeStrip, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
          <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.activeArabic, { color: colors.primary }]}>
            {words[activeWordIndex]!.word}
          </Text>
          {!!words[activeWordIndex]!.transliteration && (
            <Text style={[styles.activeTranslit, { color: colors.mutedForeground }]}>
              {words[activeWordIndex]!.transliteration}
            </Text>
          )}
          <View style={[styles.activeDiv, { backgroundColor: colors.border }]} />
          {!!words[activeWordIndex]!.translation && (
            <Text style={[styles.activeMeaning, { color: colors.foreground }]}>
              {words[activeWordIndex]!.translation}
            </Text>
          )}
          <Text style={[styles.activeCounter, { color: colors.mutedForeground }]}>
            {activeWordIndex + 1}/{words.length}
          </Text>
        </View>
      )}

      {/* RTL wrapped word chips */}
      <View style={styles.wordsRow}>
        {words.map((word, i) => (
          <WordChip
            key={i}
            word={word}
            isActive={i === activeWordIndex}
            isEven={i % 2 === 0}
            colors={colors}
            fontSize={fontSize}
          />
        ))}
      </View>

      {/* Legend */}
      <View style={[styles.legend, { borderTopColor: colors.border }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary, borderColor: colors.border }]} />
          <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
            Arabic · Transliteration · Meaning
          </Text>
        </View>
        <Text style={[styles.wordCount, { color: colors.mutedForeground }]}>
          {words.length} words
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  loadingText: { fontSize: 13, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  errorBox: { padding: 14, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  activeStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    flexWrap: "wrap",
  },
  activeDot: { width: 7, height: 7, borderRadius: 4 },
  activeArabic: { fontSize: 20, fontWeight: "400", lineHeight: 30 },
  activeTranslit: { fontSize: 12, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  activeDiv: { width: 1, height: 16 },
  activeMeaning: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  activeCounter: { fontSize: 11, fontFamily: "Inter_500Medium" },
  wordsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
  },
  wordChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
    minWidth: 72,
    maxWidth: 110,
  },
  arabic: {
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 36,
    writingDirection: "rtl",
  },
  divider: { width: "100%", height: 1 },
  translit: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 14,
  },
  meaning: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    lineHeight: 14,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  wordCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
});
