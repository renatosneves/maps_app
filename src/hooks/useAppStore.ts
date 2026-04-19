import { create } from 'zustand';
import type { QuizMode, RegionFilter } from '../types';
import type { Language } from '../i18n';

type AppView = 'home' | 'quiz' | 'results';
const STORAGE_KEY = 'geo-app-language';

function loadLanguage(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'en' ? 'en' : 'sv';
  } catch {
    return 'sv';
  }
}

interface AppStore {
  view: AppView;
  regionFilter: RegionFilter;
  quizMode: QuizMode;
  language: Language;
  setView: (view: AppView) => void;
  setRegionFilter: (filter: RegionFilter) => void;
  setQuizMode: (mode: QuizMode) => void;
  setLanguage: (language: Language) => void;
  goHome: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  view: 'home',
  regionFilter: { type: 'world' },
  quizMode: 'click',
  language: loadLanguage(),
  setView: (view) => set({ view }),
  setRegionFilter: (filter) => set({ regionFilter: filter }),
  setQuizMode: (mode) => set({ quizMode: mode }),
  setLanguage: (language) => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage failures and keep the in-memory selection.
    }
    set({ language });
  },
  goHome: () => set({ view: 'home', regionFilter: { type: 'world' }, quizMode: 'click' }),
}));
