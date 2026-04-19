import { create } from 'zustand';
import type { QuizItem, QuizMode, QuizState, RegionFilter } from '../types';
import { countries } from '../data/countries';
import { seas } from '../data/seas';
import { useAppStore } from './useAppStore';
import { shuffle } from '../utils/shuffle';
import { fuzzyMatch } from '../utils/fuzzyMatch';
import { getLocalizedQuizItem } from '../i18n';

interface QuizStore extends QuizState {
  startQuiz: (filter: RegionFilter, mode: QuizMode) => void;
  submitClickAnswer: (clickedId: string) => void;
  submitTypeAnswer: (typed: string) => void;
  nextQuestion: () => void;
  reset: () => void;
}

function getItemsForRegion(filter: RegionFilter): QuizItem[] {
  let countryItems: QuizItem[] = [];
  let seaItems: QuizItem[] = [];

  if (filter.type === 'continent') {
    countryItems = countries
      .filter((c) => c.continent === filter.value)
      .map((c) => ({ id: c.id, name: c.name, type: 'country' as const, aliases: c.aliases }));
  } else if (filter.type === 'ocean') {
    seaItems = seas
      .filter((s) => s.ocean === filter.value)
      .map((s) => ({ id: s.id, name: s.name, type: 'sea' as const, aliases: s.aliases }));
  } else {
    countryItems = countries.map((c) => ({
      id: c.id,
      name: c.name,
      type: 'country' as const,
      aliases: c.aliases,
    }));
    seaItems = seas.map((s) => ({
      id: s.id,
      name: s.name,
      type: 'sea' as const,
      aliases: s.aliases,
    }));
  }

  return shuffle([...countryItems, ...seaItems]);
}

const initialState: QuizState = {
  mode: 'click',
  items: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  answers: [],
  highlightedId: null,
  feedbackState: 'none',
  correctAnswerId: null,
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  startQuiz: (filter, mode) => {
    const items = getItemsForRegion(filter);
    set({
      ...initialState,
      mode,
      items,
    });
  },

  submitClickAnswer: (clickedId: string) => {
    const { items, currentIndex, score, streak, bestStreak, answers } = get();
    const current = items[currentIndex];
    if (!current) return;

    const correct = clickedId === current.id;
    const newStreak = correct ? streak + 1 : 0;

    set({
      feedbackState: correct ? 'correct' : 'wrong',
      highlightedId: clickedId,
      correctAnswerId: correct ? null : current.id,
      score: correct ? score + 1 : score,
      streak: newStreak,
      bestStreak: Math.max(bestStreak, newStreak),
      answers: [...answers, { item: current, correct }],
    });
  },

  submitTypeAnswer: (typed: string) => {
    const { items, currentIndex, score, streak, bestStreak, answers } = get();
    const current = items[currentIndex];
    if (!current) return;

    const language = useAppStore.getState().language;
    const localizedCurrent = getLocalizedQuizItem(current, language);
    const correct = fuzzyMatch(typed, localizedCurrent.name, localizedCurrent.aliases);
    const newStreak = correct ? streak + 1 : 0;

    set({
      feedbackState: correct ? 'correct' : 'wrong',
      highlightedId: current.id,
      correctAnswerId: correct ? null : current.id,
      score: correct ? score + 1 : score,
      streak: newStreak,
      bestStreak: Math.max(bestStreak, newStreak),
      answers: [...answers, { item: current, correct }],
    });
  },

  nextQuestion: () => {
    const { currentIndex } = get();
    set({
      currentIndex: currentIndex + 1,
      feedbackState: 'none',
      highlightedId: null,
      correctAnswerId: null,
    });
  },

  reset: () => set(initialState),
}));
