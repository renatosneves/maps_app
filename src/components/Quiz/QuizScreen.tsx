import { useEffect, useRef, useState } from 'react';
import { playEffect } from '../../audio';
import { useAppStore } from '../../hooks/useAppStore';
import { useQuizStore } from '../../hooks/useQuiz';
import { getLocalizedMapSelection, getMapKindLabel, ui } from '../../i18n';
import type { MapSelection } from '../../types';
import { getRegionLabel } from '../../utils/regions';
import WorldMap from '../Map/WorldMap';
import QuizFeedback from './QuizFeedback';
import QuizInput from './QuizInput';
import QuizProgress from './QuizProgress';
import QuizPrompt from './QuizPrompt';

export default function QuizScreen() {
  const { regionFilter, goHome, language } = useAppStore();
  const {
    items,
    currentIndex,
    highlightedId,
    feedbackState,
    correctAnswerId,
    mode,
    submitClickAnswer,
  } = useQuizStore();
  const [showMountains, setShowMountains] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<MapSelection | null>(null);
  const [selectionQuestionIndex, setSelectionQuestionIndex] = useState<number | null>(null);
  const lastInspectedIdRef = useRef<string | null>(null);

  const current = items[currentIndex];
  const copy = ui[language];
  const regionLabel = getRegionLabel(regionFilter, language);
  const activeSelection = selectionQuestionIndex === currentIndex ? selectedFeature : null;
  const localizedSelection = activeSelection ? getLocalizedMapSelection(activeSelection, language) : null;
  const shouldHideCurrentTarget = mode === 'click' && feedbackState === 'none' && !activeSelection;
  const mapFocusId =
    activeSelection?.id
    ?? highlightedId
    ?? correctAnswerId
    ?? (shouldHideCurrentTarget ? null : current?.id)
    ?? null;

  useEffect(() => {
    const inspectedId =
      mode === 'type' && selectionQuestionIndex === currentIndex
        ? selectedFeature?.id ?? null
        : null;

    if (!inspectedId) {
      lastInspectedIdRef.current = null;
      return;
    }

    if (lastInspectedIdRef.current === inspectedId) return;

    lastInspectedIdRef.current = inspectedId;
    playEffect('inspect');
  }, [currentIndex, mode, selectedFeature, selectionQuestionIndex]);

  return (
    <div className="mx-auto max-w-[1820px] px-3 py-3 sm:px-4 lg:px-5 lg:py-4">
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
              <p className="section-label">{copy.quizFloor}</p>
              <h1 className="font-display mt-1 text-3xl text-slate-950 sm:text-[2.6rem]">{regionLabel}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="atlas-stat-chip bg-slate-950 text-white">
              {mode === 'click' ? copy.tapChallenge : copy.typeChallenge}
            </span>
            <button
              type="button"
              onClick={() => setShowMountains((value) => !value)}
              className={
                showMountains
                  ? 'touch-primary min-h-[2.85rem] rounded-[1rem] bg-amber-500 px-4 py-2.5 text-[0.95rem] hover:bg-amber-400'
                  : 'touch-secondary min-h-[2.85rem] rounded-[1rem] px-4 py-2.5 text-[0.95rem]'
              }
            >
              {showMountains ? copy.hideMountains : copy.showMountains}
            </button>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.95fr)_minmax(320px,390px)]">
          <section className="atlas-map-panel">
            <div className="atlas-panel-header">
              <div>
                <p className="section-label text-slate-500">{copy.mapArena}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  {mode === 'click' ? copy.findByTouch : copy.nameByShape}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="atlas-stat-chip">{copy.noReveal}</span>
                <span className="atlas-stat-chip">{copy.selectionPinned}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <p>{mode === 'click' ? copy.selectMatchingPlace : copy.useShapeCue}</p>
              <p className="font-medium text-slate-500">
                {mode === 'click' ? copy.noHintMode : copy.guidedSilhouette}
              </p>
            </div>

            <div className="mt-4 min-h-[460px] lg:min-h-[calc(100vh-16.5rem)]">
              <WorldMap
                key={`${regionLabel}-${mode}-${language}-${current?.id ?? 'complete'}`}
                filter={regionFilter}
                mode={mode}
                highlightedId={highlightedId}
                feedbackState={feedbackState}
                correctAnswerId={correctAnswerId}
                currentItemId={current?.id}
                showMountains={showMountains}
                selectedFeatureId={mapFocusId}
                preferredFocusId={mapFocusId}
                onSelectFeature={(selection) => {
                  setSelectedFeature(selection);
                  setSelectionQuestionIndex(currentIndex);
                }}
                onCountryClick={
                  mode === 'click' && feedbackState === 'none'
                    ? submitClickAnswer
                    : undefined
                }
                onSeaClick={
                  mode === 'click' && feedbackState === 'none'
                    ? submitClickAnswer
                    : undefined
                }
                showLabels={false}
                fillHeight
              />
            </div>
          </section>

          <aside className="atlas-rail">
            <section className="atlas-side-card atlas-side-dark">
              <p className="section-label text-blue-200">{mode === 'click' ? copy.tapQuiz : copy.typeChallenge}</p>
              <div className="mt-3">
                <QuizProgress />
              </div>
            </section>

            <section className="atlas-side-card">
              <QuizPrompt />
              <QuizInput key={currentIndex} />
              <QuizFeedback />
            </section>

            <section className="atlas-side-card atlas-side-soft">
              <p className="section-label text-amber-700">{copy.mapSelection}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">{copy.touchDetails}</h2>
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
                  <div className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4 shadow-sm">
                    <p className="text-sm leading-6 text-slate-700">{localizedSelection.detail}</p>
                    {localizedSelection.secondaryDetail && (
                      <p className="mt-2 text-sm text-slate-500">{localizedSelection.secondaryDetail}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[22px] border border-dashed border-amber-200 bg-white/72 px-4 py-5">
                  <p className="text-sm leading-6 text-slate-600">{copy.tapMapToInspect}</p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
