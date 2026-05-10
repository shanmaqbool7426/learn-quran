import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ARABIC_ALPHABET, QAIDA_LESSONS } from "@/constants/qaida";
import { useColors } from "@/hooks/useColors";

export default function QaidaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"alphabet" | "lessons">("alphabet");
  const [selected, setSelected] = useState<string | null>(null);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const selectedLetter = ARABIC_ALPHABET.find(l => l.id === selected);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Arabic Qaida</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Mode switcher */}
      <View style={[styles.modeSwitcher, { backgroundColor: colors.muted }]}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "alphabet" && { backgroundColor: colors.primary }]}
          onPress={() => setMode("alphabet")}
        >
          <Text style={[styles.modeBtnText, { color: mode === "alphabet" ? "#FFFFFF" : colors.mutedForeground }]}>Alphabet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "lessons" && { backgroundColor: colors.primary }]}
          onPress={() => setMode("lessons")}
        >
          <Text style={[styles.modeBtnText, { color: mode === "lessons" ? "#FFFFFF" : colors.mutedForeground }]}>Lessons</Text>
        </TouchableOpacity>
      </View>

      {/* Selected letter detail */}
      {selected && selectedLetter && mode === "alphabet" && (
        <View style={[styles.letterDetail, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.letterBig}
          >
            <Text style={styles.letterBigText}>{selectedLetter.letter}</Text>
          </LinearGradient>
          <View style={styles.letterInfo}>
            <Text style={[styles.letterName, { color: colors.foreground }]}>{selectedLetter.name}</Text>
            <Text style={[styles.letterTranslit, { color: colors.primary }]}>/{selectedLetter.transliteration}/</Text>
            <Text style={[styles.letterExample, { color: colors.mutedForeground }]}>
              {selectedLetter.example} — {selectedLetter.exampleMeaning}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setSelected(null)}>
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      )}

      {mode === "alphabet" ? (
        <FlatList
          data={ARABIC_ALPHABET}
          keyExtractor={item => item.id}
          numColumns={4}
          contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20, gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.letterCard,
                {
                  backgroundColor: selected === item.id ? colors.primary : colors.card,
                  borderColor: selected === item.id ? colors.primary : colors.border
                }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelected(selected === item.id ? null : item.id);
              }}
              activeOpacity={0.75}
            >
              <Text style={[styles.letterMain, { color: selected === item.id ? "#FFFFFF" : colors.foreground }]}>
                {item.letter}
              </Text>
              <Text style={[styles.letterSub, { color: selected === item.id ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={QAIDA_LESSONS}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.lessonCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: item.locked ? 0.6 : 1 }]}
              disabled={item.locked}
              activeOpacity={0.75}
            >
              <View style={[styles.lessonNum, { backgroundColor: item.locked ? colors.muted : colors.secondary }]}>
                {item.locked
                  ? <Feather name="lock" size={14} color={colors.mutedForeground} />
                  : <Text style={[styles.lessonNumText, { color: colors.primary }]}>{item.id}</Text>
                }
              </View>
              <View style={styles.lessonInfo}>
                <Text style={[styles.lessonTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.lessonSub, { color: colors.mutedForeground }]}>{item.subtitle}</Text>
              </View>
              {!item.locked && (
                <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.startBtn}>
                  <Feather name="play" size={14} color="#FFFFFF" />
                </LinearGradient>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  modeSwitcher: { flexDirection: "row", margin: 16, borderRadius: 12, padding: 4 },
  modeBtn: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10 },
  modeBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  letterDetail: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderBottomWidth: 1 },
  letterBig: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  letterBigText: { color: "#FFFFFF", fontSize: 26, fontWeight: "400" },
  letterInfo: { flex: 1 },
  letterName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  letterTranslit: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  letterExample: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  letterCard: { flex: 1, alignItems: "center", gap: 4, padding: 12, borderRadius: 14, borderWidth: 1 },
  letterMain: { fontSize: 28, fontWeight: "400" },
  letterSub: { fontSize: 10, fontFamily: "Inter_500Medium" },
  lessonCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  lessonNum: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  lessonNumText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  lessonSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 3 },
  startBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});
