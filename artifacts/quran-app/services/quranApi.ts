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
  reciterEdition: string = "ar.alafasy"
): Promise<SurahDetail> {
  const editions = `quran-simple,en.asad,${reciterEdition}`;
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

export async function fetchRandomAyah(surahId: number = 2): Promise<{
  arabic: string;
  translation: string;
  reference: string;
  audioUrl: string;
  globalNumber: number;
}> {
  const detail = await fetchSurahDetail(surahId, "ar.alafasy");
  const idx = Math.floor(Math.random() * detail.arabicAyahs.length);
  const arabic = detail.arabicAyahs[idx];
  const translation = detail.translationAyahs[idx];
  const audio = detail.audioAyahs[idx];
  return {
    arabic: arabic.text,
    translation: translation.text,
    reference: `${detail.surah.englishName} ${surahId}:${arabic.numberInSurah}`,
    audioUrl: audio.audio ?? `${AUDIO_CDN}/ar.alafasy/${arabic.number}.mp3`,
    globalNumber: arabic.number,
  };
}
