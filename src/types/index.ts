export type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'
  | 'Antarctica';

export type OceanName =
  | 'Atlantic'
  | 'Pacific'
  | 'Indian'
  | 'Arctic'
  | 'Southern';

export type RegionFilter =
  | { type: 'continent'; value: Continent }
  | { type: 'ocean'; value: OceanName }
  | { type: 'world' };

export interface Country {
  id: string; // ISO 3166-1 numeric (matches TopoJSON)
  name: string;
  continent: Continent;
  capital: string;
  flag: string;
  aliases?: string[];
  mapMarkerCoordinates?: [number, number];
}

export interface SeaRegion {
  id: string;
  name: string;
  ocean: OceanName;
  coordinates: [number, number]; // [longitude, latitude]
  aliases?: string[];
}

export interface ContinentConfig {
  name: Continent;
  center: [number, number];
  scale: number;
  label: string;
}

export interface OceanConfig {
  name: OceanName;
  center: [number, number];
  scale: number;
  label: string;
}

export type QuizMode = 'click' | 'type' | 'study';
export type StudyTab = 'free' | 'guided';

export type QuizItemType = 'country' | 'sea';
export type MapFeatureKind = 'country' | 'sea' | 'mountain';

export interface QuizItem {
  id: string;
  name: string;
  type: QuizItemType;
  aliases?: string[];
}

export interface QuizState {
  mode: QuizMode;
  items: QuizItem[];
  currentIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  answers: Array<{ item: QuizItem; correct: boolean }>;
  highlightedId: string | null;
  feedbackState: 'none' | 'correct' | 'wrong';
  correctAnswerId: string | null;
}

export interface ProgressEntry {
  correctCount: number;
  wrongCount: number;
  lastAttempt: number;
  box: 1 | 2 | 3 | 4;
}

export type ProgressData = Record<string, Record<string, ProgressEntry>>;

export interface StudyItem {
  id: string;
  name: string;
  type: QuizItemType;
  detail: string;
  flag?: string;
}

export interface MapSelection {
  id: string;
  name: string;
  kind: MapFeatureKind;
  detail: string;
  secondaryDetail?: string;
  flag?: string;
}

export interface PlaygroundBadge {
  id: string;
  title: string;
  description: string;
  regionKey: string;
  earnedAt: number;
}

export interface PlaygroundUnlock {
  id: string;
  kind: 'star' | 'badge';
  title: string;
  description: string;
  amount?: number;
  earnedAt: number;
}
