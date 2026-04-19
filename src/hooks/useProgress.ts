import { useCallback } from 'react';
import type { ProgressData, ProgressEntry } from '../types';

const STORAGE_KEY = 'geo-quiz-progress';

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const getProgress = useCallback((regionKey: string, itemId: string): ProgressEntry => {
    const data = loadProgress();
    return data[regionKey]?.[itemId] ?? {
      correctCount: 0,
      wrongCount: 0,
      lastAttempt: 0,
      box: 1,
    };
  }, []);

  const recordAnswer = useCallback((regionKey: string, itemId: string, correct: boolean) => {
    const data = loadProgress();
    if (!data[regionKey]) data[regionKey] = {};

    const entry = data[regionKey][itemId] ?? {
      correctCount: 0,
      wrongCount: 0,
      lastAttempt: 0,
      box: 1 as const,
    };

    if (correct) {
      entry.correctCount++;
      entry.box = Math.min(4, entry.box + 1) as 1 | 2 | 3 | 4;
    } else {
      entry.wrongCount++;
      entry.box = 1;
    }
    entry.lastAttempt = Date.now();

    data[regionKey][itemId] = entry;
    saveProgress(data);
  }, []);

  const getRegionProgress = useCallback((regionKey: string) => {
    const data = loadProgress();
    return data[regionKey] ?? {};
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getProgress, recordAnswer, getRegionProgress, resetProgress };
}
