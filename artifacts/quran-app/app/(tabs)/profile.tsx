import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const BADGES = [
  { icon: "zap" as const, label: "7-Day Streak", color: "#FF6B2B", earned: true },
  { icon: "book" as const, label: "Surah Master", color: "#0D5C3A", earned: true },
  { icon: "star" as const, label: "1000 XP", color: "#C8972A", earned: true },
  { icon: "mic" as const, label: "First Recitation", color: "#8B5CF6", earned: true },
  { icon: "heart" as const, label: "Memorizer", color: "#DC2626", earned: false },
  { icon: "award" as const, label: "Quran Finisher", color: "#2563EB", earned: false },
];

const SETTINGS = [
  { icon: "bell" as const, label: "Prayer Reminders" },
  { icon: "volume-2" as const, label: "Audio Settings" },
  { icon: "type" as const, label: "Font Size" },
  { icon: "globe" as const, label: "Language" },
  { icon: "shield" as const, label: "Privacy" },
  { icon: "help-circle" as const, label: "Help & Support" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { progress, isDarkMode, toggleDarkMode } = useApp();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const xpToNext = 500 - (progress.xp % 500);
  const xpProgress = ((progress.xp % 500) / 500) * 100;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={[styles.profileHeader, { paddingTop: topPadding + 20 }]}
        >
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Feather name="user" size={36} color="#FFFFFF" />
            </View>
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.accent }]}>
              <Feather name="edit-2" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Ahmad Al-Rashid</Text>
          <Text style={styles.userTitle}>Level {progress.level} Learner</Text>

          {/* XP Bar */}
          <View style={styles.xpContainer}>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>Lv. {progress.level}</Text>
              <Text style={styles.xpLabel}>{progress.xp} / {progress.level * 500} XP</Text>
            </View>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${xpProgress}%` as any }]} />
            </View>
            <Text style={styles.xpNext}>{xpToNext} XP to Level {progress.level + 1}</Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {[
            { val: progress.streak, lbl: "Day Streak", icon: "zap" as const, color: "#FF6B2B" },
            { val: progress.ayahsMemorized, lbl: "Ayahs", icon: "book" as const, color: colors.primary },
            { val: progress.totalMinutes, lbl: "Minutes", icon: "clock" as const, color: "#8B5CF6" },
          ].map(stat => (
            <View key={stat.lbl} style={styles.statItem}>
              <Feather name={stat.icon} size={18} color={stat.color} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{stat.val}</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{stat.lbl}</Text>
            </View>
          ))}
        </View>

        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Achievements</Text>
            <View style={styles.badgesGrid}>
              {BADGES.map(badge => (
                <View
                  key={badge.label}
                  style={[
                    styles.badgeItem,
                    { backgroundColor: badge.earned ? badge.color + "15" : colors.muted, borderColor: badge.earned ? badge.color + "40" : colors.border }
                  ]}
                >
                  <View style={[styles.badgeIcon, { backgroundColor: badge.earned ? badge.color : colors.border }]}>
                    <Feather name={badge.icon} size={16} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.badgeLabel, { color: badge.earned ? colors.foreground : colors.mutedForeground }]}>
                    {badge.label}
                  </Text>
                  {!badge.earned && <Feather name="lock" size={12} color={colors.mutedForeground} />}
                </View>
              ))}
            </View>
          </View>

          {/* Premium Card */}
          <LinearGradient
            colors={["#C8972A", "#F0BB54"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.premiumCard, { borderRadius: colors.radius }]}
          >
            <Feather name="star" size={24} color="#FFFFFF" />
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSub}>AI corrections, offline Quran, advanced analytics</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </LinearGradient>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Settings</Text>
            <View style={[styles.settingsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
                <View style={styles.settingLeft}>
                  <Feather name="moon" size={18} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Dark Mode</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {SETTINGS.map((s, i) => (
                <TouchableOpacity
                  key={s.label}
                  style={[styles.settingRow, i < SETTINGS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Feather name={s.icon} size={18} color={colors.primary} />
                    <Text style={[styles.settingLabel, { color: colors.foreground }]}>{s.label}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  profileHeader: { paddingHorizontal: 20, paddingBottom: 28, alignItems: "center" },
  avatarContainer: { position: "relative", marginBottom: 14 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.3)" },
  editBtn: { position: "absolute", right: 0, bottom: 0, width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFFFFF" },
  userName: { color: "#FFFFFF", fontSize: 22, fontFamily: "Inter_700Bold" },
  userTitle: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4, marginBottom: 20 },
  xpContainer: { width: "100%", gap: 6 },
  xpRow: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_500Medium" },
  xpBarBg: { height: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden" },
  xpBarFill: { height: "100%", backgroundColor: "#FFFFFF", borderRadius: 4 },
  xpNext: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", paddingVertical: 20, borderBottomWidth: 1 },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 11, fontFamily: "Inter_400Regular" },
  content: { padding: 20, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  badgesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badgeItem: { width: "47%", flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  badgeIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  badgeLabel: { flex: 1, fontSize: 12, fontFamily: "Inter_500Medium" },
  premiumCard: { padding: 20, flexDirection: "row", alignItems: "center", gap: 14 },
  premiumInfo: { flex: 1 },
  premiumTitle: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  premiumSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  settingsList: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  settingLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
