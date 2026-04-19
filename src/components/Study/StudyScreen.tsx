import { useEffect, useMemo, useRef, useState } from 'react';
import { playEffect } from '../../audio';
import { useAppStore } from '../../hooks/useAppStore';
import { useStudyStore } from '../../hooks/useStudyStore';
import {
  getLocalizedBadge,
  getLocalizedMapSelection,
  getLocalizedStudyItem,
  getLocalizedUnlock,
  getMapKindLabel,
  ui,
} from '../../i18n';
import type { MapSelection } from '../../types';
import { getRegionKey, getRegionLabel } from '../../utils/regions';
import WorldMap from '../Map/WorldMap';
import GuidedPanel from './GuidedPanel';

export default function StudyScreen() {
  const { regionFilter, goHome, language } = useAppStore();
  const {
    knownIds,
    tab,
    setTab,
    toggleKnown,
    guidedItems,
    guidedIndex,
    isGuidedActive,
    startGuided,
    getKnownCount,
    getTotalCount,
    getCompletionPercent,
    getNextMilestone,
    stars,
    badges,
    recentUnlocks,
    dismissUnlock,
    resetKnown,
  } = useStudyStore();

  const [showMountains, setShowMountains] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<MapSelection | null>(null);
  const lastSelectedIdRef = useRef<string | null>(null);
  const seenUnlockIdsRef = useRef(new Set(recentUnlocks.map((unlock) => unlock.id)));

  const copy = ui[language];
  const regionLabel = getRegionLabel(regionFilter, language);
  const regionKey = getRegionKey(regionFilter);
  const knownCount = getKnownCount(regionFilter);
  const totalCount = getTotalCount(regionFilter);
  const completionPercent = getCompletionPercent(regionFilter);
  const nextMilestone = getNextMilestone(regionFilter);
  const regionBadges = badges.filter((badge) => badge.regionKey === regionKey);

  const currentGuided = isGuidedActive ? guidedItems[guidedIndex] : null;
  const localizedGuided = currentGuided ? getLocalizedStudyItem(currentGuided, language) : null;
  const guidedHighlightId = tab === 'guided' && currentGuided ? currentGuided.id : null;

  useEffect(() => {
    if (tab === 'guided' && !isGuidedActive) {
      startGuided(regionFilter);
    }
  }, [tab, isGuidedActive, startGuided, regionFilter]);

  const activeSelection = useMemo(
    () => (tab === 'guided' && currentGuided
      ? {
          id: currentGuided.id,
          name: localizedGuided?.name ?? currentGuided.name,
          kind: currentGuided.type,
          detail: localizedGuided?.detail ?? currentGuided.detail,
          flag: currentGuided.flag,
        }
      : selectedFeature),
    [currentGuided, localizedGuided, selectedFeature, tab],
  );

  const localizedSelection = activeSelection ? getLocalizedMapSelection(activeSelection, language) : null;

  const selectionKnown = useMemo(() => {
    if (!activeSelection) return false;
    return knownIds.has(activeSelection.id);
  }, [activeSelection, knownIds]);

  useEffect(() => {
    if (tab !== 'free') {
      lastSelectedIdRef.current = selectedFeature?.id ?? null;
      return;
    }

    const inspectedId = selectedFeature?.id ?? null;

    if (!inspectedId) {
      lastSelectedIdRef.current = null;
      return;
    }

    if (lastSelectedIdRef.current === inspectedId) return;

    lastSelectedIdRef.current = inspectedId;
    playEffect('inspect');
  }, [selectedFeature, tab]);

  useEffect(() => {
    const seenUnlockIds = seenUnlockIdsRef.current;
    const hasNewUnlock = recentUnlocks.some((unlock) => !seenUnlockIds.has(unlock.id));

    recentUnlocks.forEach((unlock) => seenUnlockIds.add(unlock.id));

    if (hasNewUnlock) {
      playEffect('unlock');
    }
  }, [recentUnlocks]);

  return (
    <div className="mx-auto max-w-[1760px] px-3 py-3 sm:px-4 lg:h-screen lg:max-h-screen lg:px-5 lg:py-4">
      <div className="rounded-[34px] border border-white/65 bg-[linear-gradient(135deg,rgba(248,250,252,0.97),rgba(239,246,255,0.98))] p-3.5 shadow-[0_30px_120px_rgba(15,23,42,0.12)] sm:p-4 lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
        <div className="mb-3 grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.72fr)_minmax(320px,0.82fr)] xl:items-start lg:mb-2 lg:shrink-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={goHome}
              className="touch-secondary min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]"
            >
            {copy.back}
            </button>
            <div className="min-w-0 pr-2">
              <p className="section-label">{copy.studyPlayground}</p>
              <h1 className="font-display mt-1 text-2xl text-slate-950 sm:text-[2rem]">{regionLabel}</h1>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('free')}
              className={tab === 'free' ? 'segmented-active min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]' : 'segmented-idle min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]'}
            >
              {copy.freeExplore}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('guided');
                startGuided(regionFilter);
              }}
              className={tab === 'guided' ? 'segmented-active min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]' : 'segmented-idle min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]'}
            >
              {copy.guidedTour}
            </button>
            {tab === 'free' && (
              <button
                type="button"
                onClick={() => resetKnown(regionFilter)}
                className="touch-secondary min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]"
              >
                {copy.resetRegionProgress}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowMountains((value) => !value)}
              className={showMountains ? 'touch-primary min-h-[2.85rem] rounded-[1rem] bg-amber-500 px-4 py-2.5 text-[0.95rem] hover:bg-amber-400' : 'touch-secondary min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]'}
            >
              {showMountains ? copy.hideMountains : copy.showMountains}
            </button>
          </div>
          </div>
          <div className="min-h-[126px] min-w-0 rounded-[24px] border border-slate-200/80 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] px-4 py-3 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <p className="section-label text-blue-200">{copy.progression}</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                ⭐ {stars}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#fbbf24)] transition-[width] duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-blue-200">{copy.mastery}</p>
                <p className="mt-1 text-xl font-bold">{completionPercent}%</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-blue-200">{copy.known}</p>
                <p className="mt-1 text-xl font-bold">{knownCount}/{totalCount}</p>
              </div>
              <div className="max-w-[180px]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-blue-200">{copy.next}</p>
                <p className="mt-1 text-xs leading-4 text-white/90">
                  {nextMilestone
                    ? `${nextMilestone.label} · ${nextMilestone.remaining} ${copy.left}`
                    : copy.completeHere}
                </p>
              </div>
            </div>
          </div>
          <div className="min-h-[126px] min-w-0 rounded-[24px] border border-amber-200/70 bg-[linear-gradient(145deg,rgba(255,251,235,0.98),rgba(255,255,255,0.98))] px-4 py-3 shadow-[0_12px_34px_rgba(245,158,11,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-label text-amber-700">{copy.badgeShelf}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{copy.regionRewards}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                {regionBadges.length} {copy.earned}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {regionBadges.length > 0 ? (
                regionBadges.slice(0, 2).map((badge) => {
                  const localizedBadge = getLocalizedBadge(badge, language);
                  return (
                    <div key={badge.id} className="min-w-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs">🏅</span>
                        <span className="max-w-[120px] truncate text-xs font-semibold text-slate-900">{localizedBadge.title}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm leading-5 text-slate-500">{copy.unlockBadgesHint}</p>
              )}
            </div>
          </div>
        </div>

        <div className={`grid gap-3 lg:shrink-0 ${tab === 'guided' ? 'xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]' : 'xl:grid-cols-[minmax(0,1fr)]'}`}>
          {tab === 'guided' && <GuidedPanel compact />}

          <section className="panel-card bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,251,0.94))] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-label">{copy.selectedOnMap}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">{copy.quickDetail}</h2>
              </div>
            </div>

            {localizedSelection ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {localizedSelection.flag && (
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {localizedSelection.flag}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold text-slate-950">{localizedSelection.name}</h3>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                      {getMapKindLabel(localizedSelection.kind, language)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-slate-700">{localizedSelection.detail}</p>
                  {localizedSelection.secondaryDetail && (
                    <p className="mt-1 text-sm text-slate-500">{localizedSelection.secondaryDetail}</p>
                  )}
                </div>
                {(localizedSelection.kind === 'country' || localizedSelection.kind === 'sea') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectionKnown) {
                        playEffect('mark-known');
                      }
                      toggleKnown(localizedSelection.id, regionFilter);
                    }}
                    className={selectionKnown ? 'touch-secondary justify-center max-xl:w-full lg:min-h-[2.9rem] lg:px-4 lg:py-3' : 'touch-primary justify-center max-xl:w-full lg:min-h-[2.9rem] lg:px-4 lg:py-3'}
                  >
                    {selectionKnown ? copy.markStillLearning : copy.markKnown}
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-3 rounded-[20px] border border-dashed border-slate-200 bg-white/75 px-4 py-3">
                <p className="text-sm leading-5 text-slate-500">
                  {copy.tapToPinDetails}
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="mt-3 space-y-2.5 lg:mt-2 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
          <div className="lg:shrink-0">
            <p className="text-sm text-slate-500">
              {copy.inspectAndMark}
            </p>
          </div>

          <div className="lg:min-h-0 lg:flex-1">
            <WorldMap
              key={`${regionKey}-${language}`}
              filter={regionFilter}
              mode="study"
              highlightedId={null}
              feedbackState="none"
              correctAnswerId={null}
              knownIds={knownIds}
              guidedHighlightId={guidedHighlightId}
              showMountains={showMountains}
              selectedFeatureId={activeSelection?.id ?? guidedHighlightId ?? null}
              onSelectFeature={setSelectedFeature}
              showLabels
              fillHeight
            />
          </div>

          {recentUnlocks.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2 lg:shrink-0">
              {recentUnlocks.slice(0, 1).map((unlock) => {
                const localizedUnlock = getLocalizedUnlock(unlock, language);
                return (
                  <div key={unlock.id} className="panel-card flex items-start justify-between gap-3 bg-[linear-gradient(145deg,rgba(255,251,235,0.98),rgba(255,255,255,0.98))] px-4 py-4 lg:px-3.5 lg:py-3">
                    <div>
                      <p className="section-label text-amber-700">
                        {unlock.kind === 'star' ? copy.newStars : copy.badgeUnlocked}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">{localizedUnlock.title}</h3>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{localizedUnlock.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dismissUnlock(unlock.id)}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500"
                    >
                      {copy.dismiss}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
