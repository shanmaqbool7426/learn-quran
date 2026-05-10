import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrayerTimesCard from "@/components/PrayerTimesCard";
import { useColors } from "@/hooks/useColors";

const TOOLS = [
  { icon: "navigation" as const, label: "Qibla", subtitle: "Find direction", color: "#C8972A", route: "/qibla" },
  { icon: "repeat" as const, label: "Tasbeeh", subtitle: "Digital counter", color: "#8B5CF6", route: "/tasbeeh" },
  { icon: "book-open" as const, label: "Duas", subtitle: "Collection", color: "#0D5C3A", route: "/duas" },
  { icon: "book" as const, label: "Hadith", subtitle: "6 major collections", color: "#2563EB", route: "/hadith" },
  { icon: "dollar-sign" as const, label: "Zakat", subtitle: "Calculator", color: "#D97706", route: "/tools" },
  { icon: "map-pin" as const, label: "Mosque", subtitle: "Finder", color: "#DC2626", route: "/tools" },
];

export default function ToolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const today = new Date();
  const hijriDay = ((today.getDate() + 9) % 30) + 1;
  const hijriMonths = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qidah", "Dhu al-Hijjah"];
  const hijriMonth = hijriMonths[today.getMonth()];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Islamic Tools</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Your spiritual companion</Text>
        </View>

        <View style={styles.content}>
          {/* Islamic Date Banner */}
          <LinearGradient
            colors={[colors.accent, "#D4A840"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.dateBanner, { borderRadius: colors.radius }]}
          >
            <View>
              <Text style={styles.dateLabel}>Hijri Date</Text>
              <Text style={styles.dateValue}>{hijriDay} {hijriMonth}</Text>
              <Text style={styles.dateSub}>1446 AH</Text>
            </View>
            <Feather name="moon" size={44} color="rgba(255,255,255,0.3)" />
          </LinearGradient>

          {/* Prayer Times */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Prayer Times</Text>
            <PrayerTimesCard />
          </View>

          {/* Tool Grid */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tools</Text>
            <View style={styles.toolGrid}>
              {TOOLS.map(tool => (
                <TouchableOpacity
                  key={tool.label}
                  style={[styles.toolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push(tool.route as any)}
                  activeOpacity={0.75}
                >
                  <LinearGradient
                    colors={[tool.color + "20", tool.color + "10"]}
                    style={[styles.toolIconBg, { borderRadius: 16 }]}
                  >
                    <Feather name={tool.icon} size={26} color={tool.color} />
                  </LinearGradient>
                  <Text style={[styles.toolLabel, { color: colors.foreground }]}>{tool.label}</Text>
                  <Text style={[styles.toolSub, { color: colors.mutedForeground }]}>{tool.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ramadan Card */}
          <LinearGradient
            colors={["#1A0533", "#3B0764"]}
            style={[styles.ramadanCard, { borderRadius: colors.radius }]}
          >
            <View>
              <Text style={styles.ramadanLabel}>Ramadan Mode</Text>
              <Text style={styles.ramadanTitle}>Special Features</Text>
              <Text style={styles.ramadanSub}>Suhoor & Iftar times, Tarawih tracker, special duas</Text>
            </View>
            <View style={[styles.ramadanBadge, { backgroundColor: "#C8972A" }]}>
              <Text style={styles.ramadanBadgeText}>Soon</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  content: { padding: 20, gap: 20 },
  dateBanner: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 1 },
  dateValue: { color: "#FFFFFF", fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 4 },
  dateSub: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  toolGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  toolCard: { width: "47%", alignItems: "center", padding: 18, borderRadius: 16, borderWidth: 1, gap: 10 },
  toolIconBg: { width: 56, height: 56, alignItems: "center", justifyContent: "center" },
  toolLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  toolSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  ramadanCard: { padding: 20, gap: 12 },
  ramadanLabel: { color: "#C8972A", fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 1 },
  ramadanTitle: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold", marginTop: 4 },
  ramadanSub: { color: "rgba(255,255,255,0.75)", fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },
  ramadanBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: "flex-start" },
  ramadanBadgeText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_700Bold" },
});
