import { useEffect, useEffectEvent } from 'react';
import { playEffect } from '../../audio';
import { useAppStore } from '../../hooks/useAppStore';
import { useStudyStore } from '../../hooks/useStudyStore';
import { getLocalizedStudyItem, ui } from '../../i18n';

export default function GuidedPanel({ compact = false }: { compact?: boolean }) {
  const { language } = useAppStore();
  const {
    guidedItems,
    guidedIndex,
    guidedNext,
    guidedPrev,
    guidedMarkAndNext,
    knownIds,
  } = useStudyStore();

  const current = guidedItems[guidedIndex];
  const localizedCurrent = current ? getLocalizedStudyItem(current, language) : null;
  const isLast = guidedIndex >= guidedItems.length - 1;
  const isFirst = guidedIndex === 0;
  const alreadyKnown = current ? knownIds.has(current.id) : false;
  const copy = ui[language];

  const handlePrev = () => {
    guidedPrev();
  };

  const handleNext = () => {
    playEffect('advance');
    guidedNext();
  };

  const handleMarkAndNext = () => {
    playEffect(alreadyKnown ? 'advance' : 'mark-known');
    guidedMarkAndNext();
  };

  const handleKeyAction = useEffectEvent((key: string) => {
    if (key === 'ArrowRight' || key === ' ') {
      handleNext();
    } else if (key === 'ArrowLeft') {
      handlePrev();
    } else if (key === 'Enter') {
      handleMarkAndNext();
    }
  });

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'ArrowLeft' || event.key === 'Enter') {
        event.preventDefault();
        handleKeyAction(event.key);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!current || !localizedCurrent) return null;

  return (
    <section className={`panel-card bg-[linear-gradient(145deg,rgba(254,243,199,0.95),rgba(255,251,235,0.95))] ${compact ? 'px-4 py-3.5' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`flex items-center justify-center rounded-2xl bg-white/80 shadow-sm ${compact ? 'h-11 w-11 text-2xl' : 'h-14 w-14 text-3xl'}`}>
            {localizedCurrent.flag ?? '🧭'}
          </div>
          <div>
            <p className="section-label text-amber-700">{copy.guidedTour}</p>
            <h3 className={`mt-1 font-semibold text-slate-900 ${compact ? 'text-lg' : 'text-2xl'}`}>{localizedCurrent.name}</h3>
            <p className={`mt-1 text-slate-600 ${compact ? 'text-sm leading-5' : 'text-sm'}`}>{localizedCurrent.detail}</p>
          </div>
        </div>
        <div className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-amber-700 shadow-sm">
          {guidedIndex + 1} / {guidedItems.length}
        </div>
      </div>

      <div className={`flex flex-wrap gap-3 ${compact ? 'mt-3' : 'mt-5'}`}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
          className={`touch-secondary disabled:cursor-not-allowed disabled:opacity-35 ${compact ? 'min-h-[2.9rem] px-4 py-3' : ''}`}
        >
          {copy.prev}
        </button>
        <button
          type="button"
          onClick={handleMarkAndNext}
          className={`touch-primary ${compact ? 'min-h-[2.9rem] px-4 py-3' : ''} ${
            alreadyKnown ? 'bg-emerald-100 text-emerald-700 shadow-none hover:bg-emerald-200' : ''
          }`}
        >
          {alreadyKnown ? copy.alreadyKnownNext : copy.knowThisNext}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={`touch-secondary ${compact ? 'min-h-[2.9rem] px-4 py-3' : ''}`}
        >
          {isLast ? copy.finishTour : copy.skipAhead}
        </button>
      </div>
    </section>
  );
}
