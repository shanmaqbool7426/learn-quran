import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useQuranSurahs } from "@/hooks/useQuranSurahs";
import { ApiSurah } from "@/services/quranApi";

const TABS = ["Surah", "Juz", "Bookmarks"];

function SurahItem({ item, onPress, progress, isBookmarked }: {
  item: ApiSurah;
  onPress: () => void;
  progress?: number;
  isBookmarked?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.surahRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.numBadge, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.numText, { color: colors.primary }]}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <View style={styles.surahNameRow}>
          <Text style={[styles.surahName, { color: colors.foreground }]}>{item.englishName}</Text>
          {isBookmarked && (
            <Feather name="bookmark" size={12} color={colors.accent} />
          )}
        </View>
        <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>
          {item.englishNameTranslation} • {item.numberOfAyahs} Ayahs • {item.revelationType}
        </Text>
        {progress !== undefined && progress > 0 && (
          <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress * 100}%` as any }]} />
          </View>
        )}
      </View>
      <Text style={[styles.arabicName, { color: colors.primary }]}>{item.name}</Text>
    </TouchableOpacity>
  );
}

export default function QuranScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { progress, bookmarks } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const { data: surahs, isLoading, isError, refetch } = useQuranSurahs();

  const filtered = (surahs ?? []).filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search)
  );

  const displayed =
    activeTab === 2
      ? filtered.filter((s) => bookmarks.some((b) => Math.floor(b / 1000) === s.number))
      : filtered;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 16,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Al-Quran</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {surahs ? `${surahs.length} Surahs • 30 Juz • 6,236 Ayahs` : "Loading..."}
            </Text>
          </View>
          {isLoading && <ActivityIndicator color={colors.primary} />}
          {isError && (
            <TouchableOpacity onPress={() => refetch()}>
              <Feather name="refresh-cw" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search by name or number..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { backgroundColor: colors.muted }]}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === i && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab(i)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === i ? "#FFFFFF" : colors.mutedForeground },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <SurahItem
            item={item}
            onPress={() => router.push(`/surah/${item.number}` as any)}
            progress={progress.surahs[item.number]?.progress}
            isBookmarked={bookmarks.some((b) => Math.floor(b / 1000) === item.number)}
          />
        )}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Loading surahs from Quran API...
                </Text>
              </>
            ) : (
              <>
                <Feather name="search" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No surahs found
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  tabRow: { flexDirection: "row", borderRadius: 10, padding: 4 },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 8 },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  surahRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, gap: 14 },
  numBadge: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  numText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  surahInfo: { flex: 1, gap: 4 },
  surahNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  surahName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  surahMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  progressBar: { height: 3, borderRadius: 2, overflow: "hidden", marginTop: 4 },
  progressFill: { height: "100%", borderRadius: 2 },
  arabicName: { fontSize: 20, fontWeight: "400" },
  empty: { alignItems: "center", paddingTop: 60, gap: 14 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
