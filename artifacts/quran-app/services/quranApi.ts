const BASE = "https://api.alquran.cloud/v1";
export const AUDIO_CDN = "https://cdn.islamic.network/quran/audio/128";

export interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface ApiAyah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  audioSecondary?: string[];
}

export interface SurahDetail {
  surah: ApiSurah;
  arabicAyahs: ApiAyah[];
  translationAyahs: ApiAyah[];
  audioAyahs: ApiAyah[];
}

export interface TranslationOption {
  id: string;
  label: string;
  edition: string;
  flag: string;
}

export const TRANSLATION_OPTIONS: TranslationOption[] = [
  { id: "en.asad", label: "English (Asad)", edition: "en.asad", flag: "🇬🇧" },
  { id: "en.sahih", label: "English (Sahih)", edition: "en.sahih", flag: "🇬🇧" },
  { id: "en.pickthall", label: "English (Pickthall)", edition: "en.pickthall", flag: "🇬🇧" },
  { id: "ur.ahmedali", label: "Urdu (Ahmed Ali)", edition: "ur.ahmedali", flag: "🇵🇰" },
  { id: "ur.jalandhry", label: "Urdu (Jalandhry)", edition: "ur.jalandhry", flag: "🇵🇰" },
  { id: "fr.hamidullah", label: "French", edition: "fr.hamidullah", flag: "🇫🇷" },
  { id: "tr.diyanet", label: "Turkish", edition: "tr.diyanet", flag: "🇹🇷" },
  { id: "de.bubenheim", label: "German", edition: "de.bubenheim", flag: "🇩🇪" },
  { id: "id.indonesian", label: "Indonesian", edition: "id.indonesian", flag: "🇮🇩" },
  { id: "ms.basmeih", label: "Malay", edition: "ms.basmeih", flag: "🇲🇾" },
  { id: "ru.kuliev", label: "Russian", edition: "ru.kuliev", flag: "🇷🇺" },
  { id: "zh.majian", label: "Chinese", edition: "zh.majian", flag: "🇨🇳" },
  { id: "es.cortes", label: "Spanish", edition: "es.cortes", flag: "🇪🇸" },
  { id: "bn.bengali", label: "Bengali", edition: "bn.bengali", flag: "🇧🇩" },
];

export interface WordByWord {
  word: string;
  translation: string;
  transliteration: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`AlQuran API error: ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

export async function fetchAllSurahs(): Promise<ApiSurah[]> {
  return get<ApiSurah[]>("/surah");
}

export async function fetchSurahDetail(
  surahId: number,
  reciterEdition: string = "ar.alafasy",
  translationEdition: string = "en.asad"
): Promise<SurahDetail> {
  const editions = `quran-simple,${translationEdition},${reciterEdition}`;
  const data = await get<
    Array<{ number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string; ayahs: ApiAyah[] }>
  >(`/surah/${surahId}/editions/${editions}`);

  return {
    surah: {
      number: data[0].number,
      name: data[0].name,
      englishName: data[0].englishName,
      englishNameTranslation: data[0].englishNameTranslation,
      numberOfAyahs: data[0].numberOfAyahs,
      revelationType: data[0].revelationType as "Meccan" | "Medinan",
    },
    arabicAyahs: data[0].ayahs,
    translationAyahs: data[1].ayahs,
    audioAyahs: data[2].ayahs,
  };
}

export async function fetchWordByWord(surahId: number, ayahNumber: number): Promise<WordByWord[]> {
  try {
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surahId}:${ayahNumber}?words=true&word_fields=text_uthmani,transliteration,translation`);
    if (!res.ok) return [];
    const data = await res.json() as { verse?: { words?: Array<{ text_uthmani?: string; transliteration?: { text?: string }; translation?: { text?: string } }> } };
    const words = data?.verse?.words ?? [];
    return words
      .filter(w => w.text_uthmani)
      .map(w => ({
        word: w.text_uthmani ?? "",
        translation: w.translation?.text ?? "",
        transliteration: w.transliteration?.text ?? "",
      }));
  } catch {
    return [];
  }
}

export async function fetchJuzAyahs(juzNumber: number): Promise<Array<{ surah: ApiSurah; firstAyah: number; lastAyah: number }>> {
  try {
    const res = await fetch(`${BASE}/juz/${juzNumber}/quran-simple`);
    if (!res.ok) return [];
    const data = await res.json() as { data?: { ayahs?: Array<{ surah?: { number?: number; englishName?: string; name?: string; englishNameTranslation?: string; numberOfAyahs?: number; revelationType?: string }; numberInSurah?: number }> } };
    const ayahs = data?.data?.ayahs ?? [];

    const surahMap = new Map<number, { surah: ApiSurah; firstAyah: number; lastAyah: number }>();
    for (const ayah of ayahs) {
      const s = ayah.surah;
      if (!s?.number) continue;
      const num = s.number;
      if (!surahMap.has(num)) {
        surahMap.set(num, {
          surah: {
            number: num,
            name: s.name ?? "",
            englishName: s.englishName ?? "",
            englishNameTranslation: s.englishNameTranslation ?? "",
            numberOfAyahs: s.numberOfAyahs ?? 0,
            revelationType: (s.revelationType ?? "Meccan") as "Meccan" | "Medinan",
          },
          firstAyah: ayah.numberInSurah ?? 1,
          lastAyah: ayah.numberInSurah ?? 1,
        });
      } else {
        const existing = surahMap.get(num)!;
        existing.lastAyah = ayah.numberInSurah ?? existing.lastAyah;
      }
    }
    return Array.from(surahMap.values());
  } catch {
    return [];
  }
}

export async function fetchRandomAyah(surahId: number = 2): Promise<{
  arabic: string;
  translation: string;
  reference: string;
  audioUrl: string;
  globalNumber: number;
}> {
  const detail = await fetchSurahDetail(surahId, "ar.alafasy", "en.asad");
  const idx = Math.floor(Math.random() * detail.arabicAyahs.length);
  const arabic = detail.arabicAyahs[idx];
  const translation = detail.translationAyahs[idx];
  const audio = detail.audioAyahs[idx];
  return {
    arabic: arabic?.text ?? "",
    translation: translation?.text ?? "",
    reference: `${detail.surah.englishName} ${surahId}:${arabic?.numberInSurah ?? idx + 1}`,
    audioUrl: audio?.audio ?? `${AUDIO_CDN}/ar.alafasy/${arabic?.number ?? 1}.mp3`,
    globalNumber: arabic?.number ?? 1,
  };
}
