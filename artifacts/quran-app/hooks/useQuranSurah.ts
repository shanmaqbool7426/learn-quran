import { useQuery } from "@tanstack/react-query";
import { fetchSurahDetail, SurahDetail } from "@/services/quranApi";

export function useQuranSurah(surahId: number, edition: string = "ar.alafasy") {
  return useQuery<SurahDetail>({
    queryKey: ["surah", surahId, edition],
    queryFn: () => fetchSurahDetail(surahId, edition),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    enabled: surahId > 0,
  });
}
