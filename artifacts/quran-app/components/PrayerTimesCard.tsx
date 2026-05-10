import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useColors } from "@/hooks/useColors";

const PRAYER_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Fajr: "sunrise",
  Dhuhr: "sun",
  Asr: "cloud",
  Maghrib: "sunset",
  Isha: "moon",
};

export default function PrayerTimesCard() {
  const colors = useColors();
  const { prayers, nextPrayer, timeToNext } = usePrayerTimes();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Prayer Times</Text>
        {nextPrayer && (
          <View style={[styles.nextBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.nextText, { color: colors.primary }]}>{nextPrayer.name} in {timeToNext}</Text>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {prayers.map(prayer => (
          <View
            key={prayer.name}
            style={[
              styles.prayerItem,
              prayer.isNext && { backgroundColor: colors.primary },
              prayer.passed && { opacity: 0.5 },
            ]}
          >
            <Feather
              name={PRAYER_ICONS[prayer.name] ?? "clock"}
              size={18}
              color={prayer.isNext ? "#FFFFFF" : colors.primary}
            />
            <Text style={[styles.prayerName, { color: prayer.isNext ? "#FFFFFF" : colors.mutedForeground }]}>
              {prayer.name}
            </Text>
            <Text style={[styles.prayerArabic, { color: prayer.isNext ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
              {prayer.arabicName}
            </Text>
            <Text style={[styles.prayerTime, { color: prayer.isNext ? "#FFFFFF" : colors.foreground }]}>
              {prayer.time}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  nextBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  nextText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  list: {
    gap: 10,
    paddingRight: 4,
  },
  prayerItem: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 72,
  },
  prayerName: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  prayerArabic: {
    fontSize: 12,
    fontWeight: "400",
  },
  prayerTime: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
});
