import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface UserProgress {
  streak: number;
  xp: number;
  level: number;
  totalMinutes: number;
  ayahsMemorized: number;
  surahs: Record<number, { started: boolean; completed: boolean; progress: number }>;
}

export interface AppContextType {
  progress: UserProgress;
  bookmarks: number[];
  lastRead: { surahId: number; ayah: number } | null;
  isDarkMode: boolean;
  tasbeehCount: number;
  fontSize: number;
  translationLang: string;
  userName: string;
  dailyGoalMinutes: number;
  sessionMinutes: number;
  addXP: (amount: number) => void;
  toggleBookmark: (ayahId: number) => void;
  setLastRead: (surahId: number, ayah: number) => void;
  toggleDarkMode: () => void;
  incrementTasbeeh: () => void;
  resetTasbeeh: () => void;
  updateSurahProgress: (surahId: number, progress: number, completed?: boolean) => void;
  setFontSize: (size: number) => void;
  setTranslationLang: (lang: string) => void;
  setUserName: (name: string) => void;
  addSessionMinutes: (mins: number) => void;
  setDailyGoalMinutes: (mins: number) => void;
}

const defaultProgress: UserProgress = {
  streak: 7,
  xp: 1240,
  level: 5,
  totalMinutes: 342,
  ayahsMemorized: 47,
  surahs: {},
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lastRead, setLastReadState] = useState<{ surahId: number; ayah: number } | null>({ surahId: 1, ayah: 1 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [fontSize, setFontSizeState] = useState(24);
  const [translationLang, setTranslationLangState] = useState("en.asad");
  const [userName, setUserNameState] = useState("Ahmad Al-Rashid");
  const [dailyGoalMinutes, setDailyGoalMinutesState] = useState(30);
  const [sessionMinutes, setSessionMinutes] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        savedProgress, savedBookmarks, savedLastRead, savedDark,
        savedTasbeeh, savedFontSize, savedLang, savedName, savedGoal,
      ] = await Promise.all([
        AsyncStorage.getItem("progress"),
        AsyncStorage.getItem("bookmarks"),
        AsyncStorage.getItem("lastRead"),
        AsyncStorage.getItem("darkMode"),
        AsyncStorage.getItem("tasbeeh"),
        AsyncStorage.getItem("fontSize"),
        AsyncStorage.getItem("translationLang"),
        AsyncStorage.getItem("userName"),
        AsyncStorage.getItem("dailyGoalMinutes"),
      ]);
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
      if (savedLastRead) setLastReadState(JSON.parse(savedLastRead));
      if (savedDark) setIsDarkMode(JSON.parse(savedDark));
      if (savedTasbeeh) setTasbeehCount(JSON.parse(savedTasbeeh));
      if (savedFontSize) setFontSizeState(JSON.parse(savedFontSize));
      if (savedLang) setTranslationLangState(JSON.parse(savedLang));
      if (savedName) setUserNameState(JSON.parse(savedName));
      if (savedGoal) setDailyGoalMinutesState(JSON.parse(savedGoal));
    } catch {}
  };

  const addXP = useCallback((amount: number) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      const updated = { ...prev, xp: newXP, level: newLevel };
      AsyncStorage.setItem("progress", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleBookmark = useCallback((ayahId: number) => {
    setBookmarks(prev => {
      const updated = prev.includes(ayahId)
        ? prev.filter(id => id !== ayahId)
        : [...prev, ayahId];
      AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setLastRead = useCallback((surahId: number, ayah: number) => {
    const val = { surahId, ayah };
    setLastReadState(val);
    AsyncStorage.setItem("lastRead", JSON.stringify(val));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      AsyncStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  }, []);

  const incrementTasbeeh = useCallback(() => {
    setTasbeehCount(prev => {
      const next = prev + 1;
      AsyncStorage.setItem("tasbeeh", JSON.stringify(next));
      return next;
    });
  }, []);

  const resetTasbeeh = useCallback(() => {
    setTasbeehCount(0);
    AsyncStorage.setItem("tasbeeh", JSON.stringify(0));
  }, []);

  const updateSurahProgress = useCallback((surahId: number, progress_pct: number, completed = false) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        surahs: {
          ...prev.surahs,
          [surahId]: { started: true, completed, progress: progress_pct },
        },
      };
      AsyncStorage.setItem("progress", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setFontSize = useCallback((size: number) => {
    setFontSizeState(size);
    AsyncStorage.setItem("fontSize", JSON.stringify(size));
  }, []);

  const setTranslationLang = useCallback((lang: string) => {
    setTranslationLangState(lang);
    AsyncStorage.setItem("translationLang", JSON.stringify(lang));
  }, []);

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    AsyncStorage.setItem("userName", JSON.stringify(name));
  }, []);

  const addSessionMinutes = useCallback((mins: number) => {
    setSessionMinutes(prev => prev + mins);
    setProgress(prev => {
      const updated = { ...prev, totalMinutes: prev.totalMinutes + mins };
      AsyncStorage.setItem("progress", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setDailyGoalMinutes = useCallback((mins: number) => {
    setDailyGoalMinutesState(mins);
    AsyncStorage.setItem("dailyGoalMinutes", JSON.stringify(mins));
  }, []);

  return (
    <AppContext.Provider
      value={{
        progress,
        bookmarks,
        lastRead,
        isDarkMode,
        tasbeehCount,
        fontSize,
        translationLang,
        userName,
        dailyGoalMinutes,
        sessionMinutes,
        addXP,
        toggleBookmark,
        setLastRead,
        toggleDarkMode,
        incrementTasbeeh,
        resetTasbeeh,
        updateSurahProgress,
        setFontSize,
        setTranslationLang,
        setUserName,
        addSessionMinutes,
        setDailyGoalMinutes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
