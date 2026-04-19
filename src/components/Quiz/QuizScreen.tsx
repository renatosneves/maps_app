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
  const mapFocusId =
    activeSelection?.id
    ?? highlightedId
    ?? correctAnswerId
    ?? (mode === 'type' && feedbackState === 'none' ? current?.id ?? null : null);

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
    <div className="mx-auto max-w-[1760px] px-3 py-3 sm:px-5 lg:px-6 lg:py-5">
      <div className="overflow-hidden rounded-[34px] border border-white/65 bg-[linear-gradient(135deg,rgba(248,250,252,0.97),rgba(239,246,255,0.98))] p-4 shadow-[0_30px_120px_rgba(15,23,42,0.12)] sm:p-5">
        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92)_58%,rgba(3,105,161,0.88))] px-5 py-5 text-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:px-6">
          <div className="absolute inset-y-0 right-0 w-48 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.34),transparent_55%)]" />
          <div className="relative flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={goHome}
              className="touch-secondary border-white/15 bg-white/10 text-white hover:bg-white/15"
            >
              {copy.back}
            </button>
            <div className="min-w-0 flex-1">
              <p className="section-label text-sky-200">{copy.quizFloor}</p>
              <h1 className="font-display mt-1 text-3xl text-white sm:text-4xl">{regionLabel}</h1>
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
              {mode === 'click' ? copy.tapChallenge : copy.typeChallenge}
            </div>
            <button
              type="button"
              onClick={() => setShowMountains((value) => !value)}
              className={
                showMountains
                  ? 'touch-primary bg-amber-500 hover:bg-amber-400'
                  : 'touch-secondary border-white/15 bg-white/10 text-white hover:bg-white/15'
              }
            >
              {showMountains ? copy.hideMountains : copy.showMountains}
            </button>
          </div>
          <div className="relative mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5">
              {copy.noReveal}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5">
              {copy.selectionPinned}
            </span>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.95fr)_minmax(340px,390px)] 2xl:grid-cols-[minmax(0,2.15fr)_370px]">
          <section className="min-w-0 space-y-4">
            <div className="panel-card bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(241,245,249,0.88))]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="section-label text-sky-700">{copy.mapArena}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    {mode === 'click' ? copy.findByTouch : copy.nameByShape}
                  </h2>
                </div>
                <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                  {mode === 'click' ? copy.noHintMode : copy.guidedSilhouette}
                </div>
              </div>

              <WorldMap
                key={`${regionLabel}-${mode}-${language}`}
                filter={regionFilter}
                mode={mode}
                highlightedId={highlightedId}
                feedbackState={feedbackState}
                correctAnswerId={correctAnswerId}
                currentItemId={current?.id}
                showMountains={showMountains}
                selectedFeatureId={mapFocusId}
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
              />
            </div>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
            <section className="panel-card bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
              <p className="section-label text-blue-200">{mode === 'click' ? copy.tapQuiz : copy.typeChallenge}</p>
              <QuizProgress />
            </section>

            <section className="panel-card bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))]">
              <QuizPrompt />
              <QuizInput key={currentIndex} />
              <QuizFeedback />
            </section>

            <section className="panel-card relative overflow-hidden bg-[linear-gradient(145deg,rgba(255,251,235,0.94),rgba(255,255,255,0.96))]">
              <div className="absolute right-0 top-0 h-20 w-24 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.25),transparent_65%)]" />
              <p className="section-label text-amber-700">{copy.mapSelection}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">{copy.touchDetails}</h2>
              {localizedSelection ? (
                <div className="relative mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    {localizedSelection.flag && (
                      <span className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-3xl shadow-sm">
                        {localizedSelection.flag}
                      </span>
                    )}
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-950">{localizedSelection.name}</h3>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{getMapKindLabel(localizedSelection.kind, language)}</p>
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/80 bg-white/80 px-4 py-4 shadow-sm">
                    <p className="text-sm leading-6 text-slate-700">{localizedSelection.detail}</p>
                    {localizedSelection.secondaryDetail && (
                      <p className="mt-2 text-sm text-slate-500">{localizedSelection.secondaryDetail}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative mt-4 rounded-[22px] border border-dashed border-amber-200 bg-white/70 px-4 py-5">
                  <p className="text-sm leading-6 text-slate-600">
                    {copy.tapMapToInspect}
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
