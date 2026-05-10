export interface ArabicLetter {
  id: string;
  letter: string;
  name: string;
  transliteration: string;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  example: string;
  exampleMeaning: string;
}

export const ARABIC_ALPHABET: ArabicLetter[] = [
  { id: "1", letter: "ا", name: "Alif", transliteration: "a/aa", isolated: "ا", initial: "ا", medial: "ـا", final: "ـا", example: "أَب", exampleMeaning: "Father" },
  { id: "2", letter: "ب", name: "Ba", transliteration: "b", isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب", example: "بَيْت", exampleMeaning: "House" },
  { id: "3", letter: "ت", name: "Ta", transliteration: "t", isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت", example: "تَمْر", exampleMeaning: "Date (fruit)" },
  { id: "4", letter: "ث", name: "Tha", transliteration: "th", isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث", example: "ثَوْب", exampleMeaning: "Garment" },
  { id: "5", letter: "ج", name: "Jim", transliteration: "j", isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج", example: "جَبَل", exampleMeaning: "Mountain" },
  { id: "6", letter: "ح", name: "Ha", transliteration: "h (heavy)", isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح", example: "حَلِيب", exampleMeaning: "Milk" },
  { id: "7", letter: "خ", name: "Kha", transliteration: "kh", isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ", example: "خُبْز", exampleMeaning: "Bread" },
  { id: "8", letter: "د", name: "Dal", transliteration: "d", isolated: "د", initial: "د", medial: "ـد", final: "ـد", example: "دَرْس", exampleMeaning: "Lesson" },
  { id: "9", letter: "ذ", name: "Dhal", transliteration: "dh", isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ", example: "ذَهَب", exampleMeaning: "Gold" },
  { id: "10", letter: "ر", name: "Ra", transliteration: "r", isolated: "ر", initial: "ر", medial: "ـر", final: "ـر", example: "رَأْس", exampleMeaning: "Head" },
  { id: "11", letter: "ز", name: "Zay", transliteration: "z", isolated: "ز", initial: "ز", medial: "ـز", final: "ـز", example: "زَيْت", exampleMeaning: "Oil" },
  { id: "12", letter: "س", name: "Sin", transliteration: "s", isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس", example: "سَمَاء", exampleMeaning: "Sky" },
  { id: "13", letter: "ش", name: "Shin", transliteration: "sh", isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش", example: "شَمْس", exampleMeaning: "Sun" },
  { id: "14", letter: "ص", name: "Sad", transliteration: "s (heavy)", isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص", example: "صَبْر", exampleMeaning: "Patience" },
  { id: "15", letter: "ض", name: "Dad", transliteration: "d (heavy)", isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض", example: "ضَوْء", exampleMeaning: "Light" },
  { id: "16", letter: "ط", name: "Ta", transliteration: "t (heavy)", isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط", example: "طَائِر", exampleMeaning: "Bird" },
  { id: "17", letter: "ظ", name: "Dha", transliteration: "dh (heavy)", isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ", example: "ظِل", exampleMeaning: "Shadow" },
  { id: "18", letter: "ع", name: "Ayn", transliteration: "'a", isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع", example: "عَيْن", exampleMeaning: "Eye" },
  { id: "19", letter: "غ", name: "Ghayn", transliteration: "gh", isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ", example: "غَيْم", exampleMeaning: "Cloud" },
  { id: "20", letter: "ف", name: "Fa", transliteration: "f", isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف", example: "فَجْر", exampleMeaning: "Dawn" },
  { id: "21", letter: "ق", name: "Qaf", transliteration: "q", isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق", example: "قَلْب", exampleMeaning: "Heart" },
  { id: "22", letter: "ك", name: "Kaf", transliteration: "k", isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك", example: "كِتَاب", exampleMeaning: "Book" },
  { id: "23", letter: "ل", name: "Lam", transliteration: "l", isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل", example: "لَيْل", exampleMeaning: "Night" },
  { id: "24", letter: "م", name: "Mim", transliteration: "m", isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم", example: "مَاء", exampleMeaning: "Water" },
  { id: "25", letter: "ن", name: "Nun", transliteration: "n", isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن", example: "نُور", exampleMeaning: "Light" },
  { id: "26", letter: "ه", name: "Ha", transliteration: "h (light)", isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه", example: "هَوَاء", exampleMeaning: "Air" },
  { id: "27", letter: "و", name: "Waw", transliteration: "w/uu", isolated: "و", initial: "و", medial: "ـو", final: "ـو", example: "وَرْد", exampleMeaning: "Rose" },
  { id: "28", letter: "ي", name: "Ya", transliteration: "y/ii", isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي", example: "يَد", exampleMeaning: "Hand" },
];

export const TAJWEED_RULES = [
  { id: "1", name: "Ikhfa", arabic: "إخفاء", description: "Concealment of Noon Sakin/Tanwin", color: "#C8972A" },
  { id: "2", name: "Idgham", arabic: "إدغام", description: "Merging of Noon Sakin/Tanwin", color: "#0D5C3A" },
  { id: "3", name: "Iqlab", arabic: "إقلاب", description: "Conversion of Noon Sakin to Mim", color: "#8B5CF6" },
  { id: "4", name: "Izhar", arabic: "إظهار", description: "Clear pronunciation of Noon Sakin", color: "#2563EB" },
  { id: "5", name: "Madd", arabic: "مد", description: "Prolongation of letters", color: "#DC2626" },
  { id: "6", name: "Qalqalah", arabic: "قلقلة", description: "Echo/Rebound sound", color: "#D97706" },
];

export const QAIDA_LESSONS = [
  { id: "1", title: "Arabic Alphabet", subtitle: "28 letters", completed: false, locked: false },
  { id: "2", title: "Harakat (Vowels)", subtitle: "Fatha, Kasra, Damma", completed: false, locked: true },
  { id: "3", title: "Tanwin", subtitle: "Double vowels", completed: false, locked: true },
  { id: "4", title: "Madd (Stretching)", subtitle: "Long vowels", completed: false, locked: true },
  { id: "5", title: "Sukun & Shaddah", subtitle: "No vowel & double letter", completed: false, locked: true },
  { id: "6", title: "Noon Sakin Rules", subtitle: "Izhar, Idgham, Iqlab, Ikhfa", completed: false, locked: true },
  { id: "7", title: "Mim Sakin Rules", subtitle: "Ikhfa Shafawi, Idgham", completed: false, locked: true },
  { id: "8", title: "Madd Rules", subtitle: "Types of prolongation", completed: false, locked: true },
];
