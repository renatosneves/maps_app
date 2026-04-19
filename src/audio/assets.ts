import studyLoopUrl from '../assets/audio/study-loop.wav';
import quizLoopUrl from '../assets/audio/quiz-loop.wav';
import inspectUrl from '../assets/audio/inspect.wav';
import correctUrl from '../assets/audio/correct.wav';
import wrongUrl from '../assets/audio/wrong.wav';
import advanceUrl from '../assets/audio/advance.wav';
import markKnownUrl from '../assets/audio/mark-known.wav';
import unlockUrl from '../assets/audio/unlock.wav';
import resultsStingUrl from '../assets/audio/results-sting.wav';

export type AudioTrackId = 'study-loop' | 'quiz-loop';
export type SoundEffectId =
  | 'inspect'
  | 'correct'
  | 'wrong'
  | 'advance'
  | 'mark-known'
  | 'unlock'
  | 'results-sting';

interface AudioAssetConfig {
  src: string[];
  volume: number;
}

export const trackManifest: Record<AudioTrackId, AudioAssetConfig> = {
  'study-loop': {
    src: [studyLoopUrl],
    volume: 0.16,
  },
  'quiz-loop': {
    src: [quizLoopUrl],
    volume: 0.18,
  },
};

export const effectManifest: Record<SoundEffectId, AudioAssetConfig> = {
  inspect: {
    src: [inspectUrl],
    volume: 0.26,
  },
  correct: {
    src: [correctUrl],
    volume: 0.28,
  },
  wrong: {
    src: [wrongUrl],
    volume: 0.26,
  },
  advance: {
    src: [advanceUrl],
    volume: 0.2,
  },
  'mark-known': {
    src: [markKnownUrl],
    volume: 0.24,
  },
  unlock: {
    src: [unlockUrl],
    volume: 0.27,
  },
  'results-sting': {
    src: [resultsStingUrl],
    volume: 0.22,
  },
};
