import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
}

export default function WordByWordView({ surahId, ayahNumber, fontSize = 24 }: Props) {
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
      {/* RTL wrapped row of word chips */}
      <View style={styles.wordsRow}>
        {words.map((word, i) => (
          <View
            key={i}
            style={[
              styles.wordChip,
              {
                backgroundColor: i % 2 === 0 ? colors.secondary : colors.muted,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Arabic word — large */}
            <Text
              style={[
                styles.arabic,
                { color: colors.primary, fontSize: Math.min(fontSize, 26) },
              ]}
            >
              {word.word}
            </Text>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Transliteration */}
            {!!word.transliteration && (
              <Text
                style={[styles.translit, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                {word.transliteration}
              </Text>
            )}

            {/* English meaning */}
            {!!word.translation && (
              <Text
                style={[styles.meaning, { color: colors.foreground }]}
                numberOfLines={2}
              >
                {word.translation}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={[styles.legend, { borderTopColor: colors.border }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary, borderColor: colors.border }]} />
          <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
            Arabic • Transliteration • Meaning
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
  container: {
    gap: 12,
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  errorBox: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
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
  divider: {
    width: "100%",
    height: 1,
  },
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
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  wordCount: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
