import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DailyAyahCard from "@/components/DailyAyahCard";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import StreakWidget from "@/components/StreakWidget";
import { SURAHS } from "@/constants/quranData";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const QUICK_ACTIONS = [
  { icon: "mic" as const, label: "Recite", color: "#8B5CF6", route: "/recitation" },
  { icon: "book-open" as const, label: "Read", color: "#0D5C3A", route: "/(tabs)/quran" },
  { icon: "headphones" as const, label: "Listen", color: "#2563EB", route: "/(tabs)/quran" },
  { icon: "navigation" as const, label: "Qibla", color: "#C8972A", route: "/qibla" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { progress, lastRead } = useApp();
  const colorScheme = useColorScheme();

  const todayDate = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const lastSurah = SURAHS.find(s => s.id === lastRead?.surahId);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={[styles.header, { paddingTop: topPadding + 16 }]}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Assalamu Alaikum</Text>
              <Text style={styles.date}>{todayDate}</Text>
            </View>
            <TouchableOpacity style={[styles.notifBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="bell" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Daily Goal Progress */}
          <View style={[styles.goalCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Daily Goal</Text>
              <Text style={styles.goalPercent}>60%</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: "60%" }]} />
            </View>
            <Text style={styles.goalSub}>18 of 30 minutes completed</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Streak + XP Widget */}
          <StreakWidget streak={progress.streak} xp={progress.xp} level={progress.level} />

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Access</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map(action => (
                <TouchableOpacity
                  key={action.label}
                  style={[styles.quickItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickIcon, { backgroundColor: action.color + "18" }]}>
                    <Feather name={action.icon} size={22} color={action.color} />
                  </View>
                  <Text style={[styles.quickLabel, { color: colors.foreground }]}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Daily Ayah */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Daily Ayah</Text>
            <DailyAyahCard />
          </View>

          {/* Continue Reading */}
          {lastSurah && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Continue Reading</Text>
              <TouchableOpacity
                style={[styles.continueCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/surah/${lastSurah.id}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.continueLeft}>
                  <View style={[styles.continueIcon, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.continueNum, { color: colors.primary }]}>{lastSurah.id}</Text>
                  </View>
                  <View>
                    <Text style={[styles.continueName, { color: colors.foreground }]}>{lastSurah.name}</Text>
                    <Text style={[styles.continueSub, { color: colors.mutedForeground }]}>
                      {lastSurah.arabicName} • Ayah {lastRead?.ayah}
                    </Text>
                  </View>
                </View>
                <View style={[styles.resumeBtn, { backgroundColor: colors.primary }]}>
                  <Feather name="play" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Prayer Times */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Prayer Times</Text>
              <TouchableOpacity onPress={() => router.push("/tools" as any)}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <PrayerTimesCard />
          </View>

          {/* Daily Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Progress</Text>
            <View style={[styles.statsRow, { gap: 12 }]}>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="book" size={20} color={colors.primary} />
                <Text style={[styles.statVal, { color: colors.foreground }]}>{progress.ayahsMemorized}</Text>
                <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Ayahs</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="clock" size={20} color="#8B5CF6" />
                <Text style={[styles.statVal, { color: colors.foreground }]}>{progress.totalMinutes}</Text>
                <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Minutes</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="check-circle" size={20} color="#C8972A" />
                <Text style={[styles.statVal, { color: colors.foreground }]}>
                  {Object.values(progress.surahs).filter(s => s.completed).length + 12}
                </Text>
                <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Surahs</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greeting: { color: "#FFFFFF", fontSize: 22, fontFamily: "Inter_700Bold" },
  date: { color: "rgba(255,255,255,0.75)", fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  goalCard: { borderRadius: 14, padding: 16 },
  goalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  goalTitle: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontFamily: "Inter_500Medium" },
  goalPercent: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_700Bold" },
  goalBar: { height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden", marginBottom: 8 },
  goalFill: { height: "100%", backgroundColor: "#FFFFFF", borderRadius: 3 },
  goalSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Inter_400Regular" },
  content: { gap: 24, paddingTop: 24 },
  section: { gap: 12 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", paddingHorizontal: 20 },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  quickGrid: { flexDirection: "row", paddingHorizontal: 20, gap: 12 },
  quickItem: { flex: 1, alignItems: "center", gap: 8, padding: 14, borderRadius: 16, borderWidth: 1 },
  quickIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  continueCard: { marginHorizontal: 20, padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  continueLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  continueIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  continueNum: { fontSize: 15, fontFamily: "Inter_700Bold" },
  continueName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  continueSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  resumeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", paddingHorizontal: 20 },
  statCard: { flex: 1, alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 1, gap: 6 },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
