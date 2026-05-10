import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { TRANSLATION_OPTIONS } from "@/services/quranApi";

const BADGES = [
  { icon: "zap" as const, label: "7-Day Streak", color: "#FF6B2B", earned: true },
  { icon: "book" as const, label: "Surah Master", color: "#0D5C3A", earned: true },
  { icon: "star" as const, label: "1000 XP", color: "#C8972A", earned: true },
  { icon: "mic" as const, label: "First Recitation", color: "#8B5CF6", earned: true },
  { icon: "heart" as const, label: "Memorizer", color: "#DC2626", earned: false },
  { icon: "award" as const, label: "Quran Finisher", color: "#2563EB", earned: false },
];

const FONT_SIZES = [18, 20, 22, 24, 26, 28, 32];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { progress, isDarkMode, toggleDarkMode, fontSize, setFontSize, translationLang, setTranslationLang, userName, setUserName, dailyGoalMinutes, setDailyGoalMinutes } = useApp();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [fontModalVisible, setFontModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const xpToNext = 500 - (progress.xp % 500);
  const xpProgress = ((progress.xp % 500) / 500) * 100;

  const currentLang = TRANSLATION_OPTIONS.find(t => t.id === translationLang) ?? TRANSLATION_OPTIONS[0]!;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={[styles.profileHeader, { paddingTop: topPadding + 20 }]}
        >
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Text style={styles.avatarInitial}>{(userName[0] ?? "A").toUpperCase()}</Text>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: colors.accent }]}
              onPress={() => { setTempName(userName); setNameModalVisible(true); }}
            >
              <Feather name="edit-2" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userTitle}>Level {progress.level} Learner</Text>

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

          <LinearGradient
            colors={["#C8972A", "#F0BB54"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.premiumCard, { borderRadius: colors.radius }]}
          >
            <Feather name="star" size={24} color="#FFFFFF" />
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSub}>Offline Quran, advanced analytics, ad-free</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </LinearGradient>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Settings</Text>
            <View style={[styles.settingsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
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

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                onPress={() => setFontModalVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Feather name="type" size={18} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Arabic Font Size</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{fontSize}px</Text>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                onPress={() => setLangModalVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Feather name="globe" size={18} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Translation Language</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>
                    {currentLang.flag} {currentLang.label.split(" ")[0]}
                  </Text>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                onPress={() => setGoalModalVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Feather name="target" size={18} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Daily Goal</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{dailyGoalMinutes} min</Text>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                onPress={() => router.push("/ai-chat" as any)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Feather name="cpu" size={18} color="#8B5CF6" />
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>AI Islamic Scholar</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                onPress={() => router.push("/zakat" as any)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Feather name="dollar-sign" size={18} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Zakat Calculator</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Feather name="help-circle" size={18} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Help & Support</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={nameModalVisible} animationType="slide" transparent onRequestClose={() => setNameModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Edit Name</Text>
              <TouchableOpacity onPress={() => setNameModalVisible(false)}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <TextInput
                style={[styles.nameInput, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter your name"
                placeholderTextColor={colors.mutedForeground}
              />
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                onPress={() => { setUserName(tempName); setNameModalVisible(false); }}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={fontModalVisible} animationType="slide" transparent onRequestClose={() => setFontModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Arabic Font Size</Text>
              <TouchableOpacity onPress={() => setFontModalVisible(false)}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={[styles.fontPreview, { color: colors.foreground, fontSize }]}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
              <View style={styles.fontGrid}>
                {FONT_SIZES.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.fontOption,
                      { backgroundColor: fontSize === size ? colors.primary : colors.card, borderColor: fontSize === size ? colors.primary : colors.border }
                    ]}
                    onPress={() => setFontSize(size)}
                  >
                    <Text style={[styles.fontOptionText, { color: fontSize === size ? "#FFFFFF" : colors.foreground }]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
            <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={{ padding: 16, gap: 8 }}>
              {TRANSLATION_OPTIONS.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.langOption,
                    { backgroundColor: translationLang === item.id ? colors.secondary : colors.card, borderColor: translationLang === item.id ? colors.primary : colors.border }
                  ]}
                  onPress={() => { setTranslationLang(item.id); setLangModalVisible(false); }}
                >
                  <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                  <Text style={[styles.langLabel, { color: translationLang === item.id ? colors.primary : colors.foreground }]}>{item.label}</Text>
                  {translationLang === item.id && <Feather name="check" size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={goalModalVisible} animationType="slide" transparent onRequestClose={() => setGoalModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Daily Goal</Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              {[10, 15, 20, 30, 45, 60].map(mins => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.goalOption,
                    { backgroundColor: dailyGoalMinutes === mins ? colors.secondary : colors.card, borderColor: dailyGoalMinutes === mins ? colors.primary : colors.border }
                  ]}
                  onPress={() => { setDailyGoalMinutes(mins); setGoalModalVisible(false); }}
                >
                  <Feather name="clock" size={18} color={dailyGoalMinutes === mins ? colors.primary : colors.mutedForeground} />
                  <Text style={[styles.goalOptionText, { color: dailyGoalMinutes === mins ? colors.primary : colors.foreground }]}>
                    {mins} minutes per day
                  </Text>
                  {dailyGoalMinutes === mins && <Feather name="check" size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  profileHeader: { paddingHorizontal: 20, paddingBottom: 28, alignItems: "center" },
  avatarContainer: { position: "relative", marginBottom: 14 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.3)" },
  avatarInitial: { color: "#FFFFFF", fontSize: 32, fontFamily: "Inter_700Bold" },
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
  settingRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  settingLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  settingValue: { fontSize: 13, fontFamily: "Inter_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "80%", minHeight: "30%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 8 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  modalContent: { padding: 20, gap: 14 },
  nameInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, fontFamily: "Inter_400Regular" },
  saveBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  saveBtnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  fontPreview: { textAlign: "center", lineHeight: 56, marginBottom: 8 },
  fontGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  fontOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  fontOptionText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  langOption: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  langLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  goalOption: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  goalOptionText: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
});
