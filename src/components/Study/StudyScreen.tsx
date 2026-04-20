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

export default function StudyScreen({ isMobile = false }: { isMobile?: boolean }) {
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
    <div className={`mx-auto max-w-[1820px] px-3 sm:px-4 lg:px-5 ${isMobile ? 'pb-6 pt-2' : 'py-3 lg:py-4'}`}>
      <div className="atlas-shell">
        <header className="atlas-header">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={goHome}
              className="touch-secondary min-h-[2.9rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]"
            >
              {copy.back}
            </button>
            <div className="min-w-0">
              <p className="section-label">{copy.studyPlayground}</p>
              <h1 className="font-display mt-1 text-3xl text-slate-950 sm:text-[2.6rem]">{regionLabel}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
        </header>

        <div className={`grid gap-4 ${isMobile ? '' : 'xl:grid-cols-[minmax(0,1.95fr)_minmax(320px,390px)]'}`}>
          <section className="atlas-map-panel">
            <div className="atlas-panel-header">
              <div>
                <p className="section-label text-slate-500">{copy.mapArena}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">{copy.studyPlayground}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="atlas-stat-chip">⭐ {stars}</span>
                <span className="atlas-stat-chip">{knownCount}/{totalCount} {copy.known.toLowerCase()}</span>
                <span className="atlas-stat-chip">{completionPercent}% {copy.mastery.toLowerCase()}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <p>{copy.inspectAndMark}</p>
              {nextMilestone && (
                <p className={`font-medium text-slate-500 ${isMobile ? 'w-full' : ''}`}>
                  {nextMilestone.label} · {nextMilestone.remaining} {copy.left}
                </p>
              )}
            </div>

            <div className={`mt-4 ${isMobile ? 'min-h-[360px]' : 'min-h-[460px] lg:min-h-[calc(100vh-16.5rem)]'}`}>
              <WorldMap
                key={`${regionKey}-${language}-${tab}-${tab === 'guided' ? guidedHighlightId ?? 'guided' : 'free'}`}
                filter={regionFilter}
                mode="study"
                highlightedId={null}
                feedbackState="none"
                correctAnswerId={null}
                knownIds={knownIds}
                guidedHighlightId={guidedHighlightId}
                showMountains={showMountains}
                selectedFeatureId={activeSelection?.id ?? guidedHighlightId ?? null}
                preferredFocusId={guidedHighlightId ?? activeSelection?.id ?? null}
                onSelectFeature={setSelectedFeature}
                showLabels={false}
                fillHeight
                compactControls={isMobile}
              />
            </div>
          </section>

          <aside className="atlas-rail">
            <section className="atlas-side-card atlas-side-dark">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-label text-blue-200">{copy.progression}</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{completionPercent}%</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-amber-300">
                  ⭐ {stars}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#fbbf24)] transition-[width] duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="mt-4 flex items-end justify-between gap-4 text-sm text-slate-200">
                <div>
                  <p className="section-label text-blue-200">{copy.known}</p>
                  <p className="mt-1 text-xl font-bold text-white">{knownCount}/{totalCount}</p>
                </div>
                <div className="max-w-[180px] text-right">
                  <p className="section-label text-blue-200">{copy.next}</p>
                  <p className="mt-1 leading-5">
                    {nextMilestone
                      ? `${nextMilestone.label} · ${nextMilestone.remaining} ${copy.left}`
                      : copy.completeHere}
                  </p>
                </div>
              </div>
            </section>

            {tab === 'guided' && <GuidedPanel compact />}

            <section className="atlas-side-card">
              <p className="section-label">{copy.selectedOnMap}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">{copy.quickDetail}</h2>

              {localizedSelection ? (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    {localizedSelection.flag && (
                      <span className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-3xl shadow-sm">
                        {localizedSelection.flag}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-2xl font-semibold text-slate-950">{localizedSelection.name}</h3>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{getMapKindLabel(localizedSelection.kind, language)}</p>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm">
                    <p className="text-sm leading-6 text-slate-700">{localizedSelection.detail}</p>
                    {localizedSelection.secondaryDetail && (
                      <p className="mt-2 text-sm text-slate-500">{localizedSelection.secondaryDetail}</p>
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
                      className={selectionKnown ? 'touch-secondary w-full justify-center' : 'touch-primary w-full justify-center'}
                    >
                      {selectionKnown ? copy.markStillLearning : copy.markKnown}
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-[22px] border border-dashed border-slate-200 bg-white/75 px-4 py-5">
                  <p className="text-sm leading-6 text-slate-500">{copy.tapToPinDetails}</p>
                </div>
              )}
            </section>

            <section className="atlas-side-card atlas-side-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-label text-amber-700">{copy.badgeShelf}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">{copy.regionRewards}</h2>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  {regionBadges.length} {copy.earned}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {regionBadges.length > 0 ? (
                  regionBadges.slice(0, 3).map((badge) => {
                    const localizedBadge = getLocalizedBadge(badge, language);
                    return (
                      <div key={badge.id} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-slate-900">
                        {localizedBadge.title}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm leading-6 text-slate-500">{copy.unlockBadgesHint}</p>
                )}
              </div>

              {recentUnlocks.length > 0 && (
                <div className="mt-4 space-y-3">
                  {recentUnlocks.slice(0, 1).map((unlock) => {
                    const localizedUnlock = getLocalizedUnlock(unlock, language);
                    return (
                      <div key={unlock.id} className="rounded-[22px] border border-white/80 bg-white/86 px-4 py-4 shadow-sm">
                        <p className="section-label text-amber-700">
                          {unlock.kind === 'star' ? copy.newStars : copy.badgeUnlocked}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-slate-900">{localizedUnlock.title}</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{localizedUnlock.description}</p>
                        <button
                          type="button"
                          onClick={() => dismissUnlock(unlock.id)}
                          className="mt-3 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500"
                        >
                          {copy.dismiss}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
