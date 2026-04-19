import { useQuizStore } from '../../hooks/useQuiz';
import { useAppStore } from '../../hooks/useAppStore';
import { getLocalizedQuizItem, getMapKindLabel, ui } from '../../i18n';

export default function QuizPrompt() {
  const { language } = useAppStore();
  const { items, currentIndex, mode } = useQuizStore();
  const current = items[currentIndex];
  const copy = ui[language];

  if (!current) return null;
  const localizedCurrent = getLocalizedQuizItem(current, language);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="section-label">
          {mode === 'click' ? copy.tapTheMap : copy.typeTheAnswer}
        </p>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          {mode === 'click' ? copy.precisionRound : copy.recognitionRound}
        </span>
      </div>
      {mode === 'click' && (
        <>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{localizedCurrent.name}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            {copy.selectMatchingPlace}
          </p>
        </>
      )}
      {mode === 'type' && (
        <>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{copy.nameHighlighted} {getMapKindLabel(current.type, language)}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            {copy.useShapeCue}
          </p>
        </>
      )}
    </div>
  );
}
