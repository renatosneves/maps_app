import { create } from 'zustand';
import type {
  PlaygroundBadge,
  PlaygroundUnlock,
  RegionFilter,
  StudyItem,
  StudyTab,
} from '../types';
import { useAppStore } from './useAppStore';
import { getFilteredIds, getRegionKey, getRegionLabel, getStudyItems } from '../utils/regions';

const STORAGE_KEY = 'geo-study-playground';

const MILESTONES = [
  { ratio: 0.25, stars: 1, label: 'Explorer tier', id: '25' },
  { ratio: 0.5, stars: 2, label: 'Navigator tier', id: '50' },
  { ratio: 0.75, stars: 3, label: 'Cartographer tier', id: '75' },
  { ratio: 1, stars: 5, label: 'Mastery tier', id: '100' },
] as const;

interface StoredStudyState {
  knownIds: string[];
  stars: number;
  badges: PlaygroundBadge[];
  recentUnlocks: PlaygroundUnlock[];
  claimedMilestones: string[];
  completedGuidedRegions: string[];
}

interface StudyStore {
  knownIds: Set<string>;
  tab: StudyTab;
  guidedItems: StudyItem[];
  guidedIndex: number;
  isGuidedActive: boolean;
  stars: number;
  badges: PlaygroundBadge[];
  recentUnlocks: PlaygroundUnlock[];
  claimedMilestones: string[];
  completedGuidedRegions: string[];
  activeGuidedRegion: RegionFilter | null;

  toggleKnown: (id: string, filter: RegionFilter) => void;
  isKnown: (id: string) => boolean;
  setTab: (tab: StudyTab) => void;
  startGuided: (filter: RegionFilter) => void;
  guidedNext: () => void;
  guidedPrev: () => void;
  guidedMarkAndNext: () => void;
  dismissUnlock: (unlockId: string) => void;
  resetKnown: (filter: RegionFilter) => void;
  getKnownCount: (filter: RegionFilter) => number;
  getTotalCount: (filter: RegionFilter) => number;
  getCompletionPercent: (filter: RegionFilter) => number;
  getNextMilestone: (filter: RegionFilter) => { label: string; remaining: number; stars: number } | null;
}

function loadState(): StoredStudyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        knownIds: [],
        stars: 0,
        badges: [],
        recentUnlocks: [],
        claimedMilestones: [],
        completedGuidedRegions: [],
      };
    }

    const parsed = JSON.parse(raw) as Partial<StoredStudyState>;
    return {
      knownIds: parsed.knownIds ?? [],
      stars: parsed.stars ?? 0,
      badges: parsed.badges ?? [],
      recentUnlocks: parsed.recentUnlocks ?? [],
      claimedMilestones: parsed.claimedMilestones ?? [],
      completedGuidedRegions: parsed.completedGuidedRegions ?? [],
    };
  } catch {
    return {
      knownIds: [],
      stars: 0,
      badges: [],
      recentUnlocks: [],
      claimedMilestones: [],
      completedGuidedRegions: [],
    };
  }
}

function saveState(state: StudyStore) {
  const snapshot: StoredStudyState = {
    knownIds: [...state.knownIds],
    stars: state.stars,
    badges: state.badges,
    recentUnlocks: state.recentUnlocks,
    claimedMilestones: state.claimedMilestones,
    completedGuidedRegions: state.completedGuidedRegions,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function pushUnlocks(existing: PlaygroundUnlock[], incoming: PlaygroundUnlock[]) {
  return [...incoming, ...existing].slice(0, 6);
}

function awardProgress(
  knownIds: Set<string>,
  filter: RegionFilter,
  stars: number,
  badges: PlaygroundBadge[],
  recentUnlocks: PlaygroundUnlock[],
  claimedMilestones: string[],
) {
  const regionKey = getRegionKey(filter);
  const regionLabel = getRegionLabel(filter);
  const total = getFilteredIds(filter).length;
  const knownCount = getFilteredIds(filter).filter((id) => knownIds.has(id)).length;

  let nextStars = stars;
  let nextBadges = [...badges];
  let nextUnlocks = [...recentUnlocks];
  const nextMilestones = [...claimedMilestones];

  for (const milestone of MILESTONES) {
    const milestoneKey = `${regionKey}:${milestone.id}`;
    if (knownCount / Math.max(total, 1) >= milestone.ratio && !nextMilestones.includes(milestoneKey)) {
      nextMilestones.push(milestoneKey);
      nextStars += milestone.stars;
      nextUnlocks = pushUnlocks(nextUnlocks, [
        {
          id: `star:${milestoneKey}`,
          kind: 'star',
          title: `+${milestone.stars} stars`,
          description: `${milestone.label} reached in ${regionLabel}`,
          amount: milestone.stars,
          earnedAt: Date.now(),
        },
      ]);
    }
  }

  const masteryBadgeId = `badge:mastery:${regionKey}`;
  if (knownCount === total && total > 0 && !nextBadges.some((badge) => badge.id === masteryBadgeId)) {
    const badge: PlaygroundBadge = {
      id: masteryBadgeId,
      title: `${regionLabel} Master`,
      description: `Learned every item in ${regionLabel}.`,
      regionKey,
      earnedAt: Date.now(),
    };
    nextBadges = [badge, ...nextBadges];
    nextUnlocks = pushUnlocks(nextUnlocks, [
      {
        id: `unlock:${masteryBadgeId}`,
        kind: 'badge',
        title: badge.title,
        description: badge.description,
        earnedAt: badge.earnedAt,
      },
    ]);
  }

  return {
    stars: nextStars,
    badges: nextBadges,
    recentUnlocks: nextUnlocks,
    claimedMilestones: nextMilestones,
  };
}

function awardGuidedCompletion(
  filter: RegionFilter,
  stars: number,
  badges: PlaygroundBadge[],
  recentUnlocks: PlaygroundUnlock[],
  completedGuidedRegions: string[],
) {
  const regionKey = getRegionKey(filter);
  if (completedGuidedRegions.includes(regionKey)) {
    return {
      stars,
      badges,
      recentUnlocks,
      completedGuidedRegions,
    };
  }

  const regionLabel = getRegionLabel(filter);
  const earnedAt = Date.now();
  const badge: PlaygroundBadge = {
    id: `badge:guided:${regionKey}`,
    title: `${regionLabel} Tour Complete`,
    description: `Finished the guided tour for ${regionLabel}.`,
    regionKey,
    earnedAt,
  };

  return {
    stars: stars + 2,
    badges: [badge, ...badges],
    recentUnlocks: pushUnlocks(recentUnlocks, [
      {
        id: `star:guided:${regionKey}`,
        kind: 'star',
        title: '+2 stars',
        description: `Completed the guided tour for ${regionLabel}`,
        amount: 2,
        earnedAt,
      },
      {
        id: `unlock:${badge.id}`,
        kind: 'badge',
        title: badge.title,
        description: badge.description,
        earnedAt,
      },
    ]),
    completedGuidedRegions: [...completedGuidedRegions, regionKey],
  };
}

const stored = loadState();

export const useStudyStore = create<StudyStore>((set, get) => ({
  knownIds: new Set(stored.knownIds),
  tab: 'free',
  guidedItems: [],
  guidedIndex: 0,
  isGuidedActive: false,
  stars: stored.stars,
  badges: stored.badges,
  recentUnlocks: stored.recentUnlocks,
  claimedMilestones: stored.claimedMilestones,
  completedGuidedRegions: stored.completedGuidedRegions,
  activeGuidedRegion: null,

  toggleKnown: (id, filter) => {
    set((state) => {
      const knownIds = new Set(state.knownIds);
      if (knownIds.has(id)) {
        knownIds.delete(id);
      } else {
        knownIds.add(id);
      }

      const rewards = awardProgress(
        knownIds,
        filter,
        state.stars,
        state.badges,
        state.recentUnlocks,
        state.claimedMilestones,
      );

      const nextState = {
        ...state,
        knownIds,
        ...rewards,
      };
      saveState(nextState);
      return nextState;
    });
  },

  isKnown: (id) => get().knownIds.has(id),

  setTab: (tab) => set({ tab }),

  startGuided: (filter) => {
    const knownIds = get().knownIds;
    const items = getStudyItems(filter);
    const unknownFirst = [
      ...items.filter((item) => !knownIds.has(item.id)),
      ...items.filter((item) => knownIds.has(item.id)),
    ];
    set({
      guidedItems: unknownFirst,
      guidedIndex: 0,
      isGuidedActive: true,
      tab: 'guided',
      activeGuidedRegion: filter,
    });
  },

  guidedNext: () => {
    set((state) => {
      if (state.guidedIndex < state.guidedItems.length - 1) {
        return { guidedIndex: state.guidedIndex + 1 };
      }

      if (!state.activeGuidedRegion) return state;
      const rewards = awardGuidedCompletion(
        state.activeGuidedRegion,
        state.stars,
        state.badges,
        state.recentUnlocks,
        state.completedGuidedRegions,
      );
      const nextState = { ...state, ...rewards };
      saveState(nextState);
      return nextState;
    });
  },

  guidedPrev: () => {
    set((state) => {
      if (state.guidedIndex <= 0) return state;
      return { guidedIndex: state.guidedIndex - 1 };
    });
  },

  guidedMarkAndNext: () => {
    set((state) => {
      const current = state.guidedItems[state.guidedIndex];
      if (!current || !state.activeGuidedRegion) return state;

      const knownIds = new Set(state.knownIds);
      knownIds.add(current.id);

      const progressRewards = awardProgress(
        knownIds,
        state.activeGuidedRegion,
        state.stars,
        state.badges,
        state.recentUnlocks,
        state.claimedMilestones,
      );

      let nextState: StudyStore = {
        ...state,
        knownIds,
        ...progressRewards,
      };

      if (state.guidedIndex < state.guidedItems.length - 1) {
        nextState = {
          ...nextState,
          guidedIndex: state.guidedIndex + 1,
        };
      } else {
        const guidedRewards = awardGuidedCompletion(
          state.activeGuidedRegion,
          nextState.stars,
          nextState.badges,
          nextState.recentUnlocks,
          nextState.completedGuidedRegions,
        );
        nextState = {
          ...nextState,
          ...guidedRewards,
        };
      }

      saveState(nextState);
      return nextState;
    });
  },

  dismissUnlock: (unlockId) => {
    set((state) => {
      const nextState = {
        ...state,
        recentUnlocks: state.recentUnlocks.filter((unlock) => unlock.id !== unlockId),
      };
      saveState(nextState);
      return nextState;
    });
  },

  resetKnown: (filter) => {
    set((state) => {
      const ids = getFilteredIds(filter);
      const knownIds = new Set(state.knownIds);
      ids.forEach((id) => knownIds.delete(id));
      const nextState = {
        ...state,
        knownIds,
      };
      saveState(nextState);
      return nextState;
    });
  },

  getKnownCount: (filter) => {
    const ids = getFilteredIds(filter);
    const knownIds = get().knownIds;
    return ids.filter((id) => knownIds.has(id)).length;
  },

  getTotalCount: (filter) => getFilteredIds(filter).length,

  getCompletionPercent: (filter) => {
    const total = getFilteredIds(filter).length;
    const knownCount = get().getKnownCount(filter);
    return total > 0 ? Math.round((knownCount / total) * 100) : 0;
  },

  getNextMilestone: (filter) => {
    const total = getFilteredIds(filter).length;
    const knownCount = get().getKnownCount(filter);
    const regionKey = getRegionKey(filter);
    const claimed = get().claimedMilestones;

    const nextMilestone = MILESTONES.find(
      (milestone) => !claimed.includes(`${regionKey}:${milestone.id}`),
    );

    if (!nextMilestone) return null;

    return {
      label: `${Math.round(nextMilestone.ratio * 100)}% ${useAppStore.getState().language === 'sv' ? 'behärskning' : 'mastery'}`,
      remaining: Math.max(0, Math.ceil(total * nextMilestone.ratio) - knownCount),
      stars: nextMilestone.stars,
    };
  },
}));
