import { useAppStore } from '../../hooks/useAppStore';
import { useQuizStore } from '../../hooks/useQuiz';
import { useStudyStore } from '../../hooks/useStudyStore';
import { getLocalizedQuizItem, ui } from '../../i18n';

export default function QuizResults({ isMobile = false }: { isMobile?: boolean }) {
  const { score, answers, bestStreak, items } = useQuizStore();
  const { goHome, setView, setQuizMode, language } = useAppStore();
  const { stars, badges } = useStudyStore();
  const copy = ui[language];
  const total = items.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const wrong = answers.filter((answer) => !answer.correct);
  const correct = answers.filter((answer) => answer.correct);

  let headline: string = copy.perfectMapSense;
  let tone: string = copy.perfectTone;
  if (percentage < 100) { headline = copy.strongNavigation; tone = copy.strongTone; }
  if (percentage < 80) { headline = copy.goodProgress; tone = copy.goodTone; }
  if (percentage < 60) { headline = copy.keepExploring; tone = copy.keepExploringTone; }

  return (
    <div className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ${isMobile ? 'pb-6 pt-2' : 'py-4 lg:py-8'}`}>
      <div className={`rounded-[34px] border border-white/65 bg-[linear-gradient(135deg,rgba(248,250,252,0.97),rgba(239,246,255,0.98))] shadow-[0_30px_120px_rgba(15,23,42,0.12)] ${isMobile ? 'rounded-[28px] p-4' : 'p-6'}`}>
        <section className="panel-card bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
          <p className="section-label text-blue-200">{copy.sessionComplete}</p>
          <h1 className={`mt-2 font-semibold ${isMobile ? 'text-[2rem]' : 'text-4xl'}`}>{headline}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">{tone}</p>

          <div className={`mt-8 grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
            <div className="rounded-3xl bg-white/8 px-5 py-5">
              <p className="text-sm uppercase tracking-[0.22em] text-blue-200">{copy.accuracy}</p>
              <p className="mt-2 text-4xl font-bold">{percentage}%</p>
            </div>
            <div className="rounded-3xl bg-white/8 px-5 py-5">
              <p className="text-sm uppercase tracking-[0.22em] text-blue-200">{copy.bestStreak}</p>
              <p className="mt-2 text-4xl font-bold">{bestStreak}</p>
            </div>
            <div className="rounded-3xl bg-white/8 px-5 py-5">
              <p className="text-sm uppercase tracking-[0.22em] text-blue-200">{copy.playground}</p>
              <p className="mt-2 text-4xl font-bold">{stars}</p>
              <p className="mt-1 text-sm text-slate-300">{badges.length} {copy.badgesEarned}</p>
            </div>
          </div>
        </section>

        <div className={`mt-6 grid gap-6 ${isMobile ? '' : 'lg:grid-cols-2'}`}>
          <section className="panel-card">
            <p className="section-label text-green-700">{copy.known}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">{correct.length} {copy.correctAnswers}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {correct.map((answer, index) => (
                <span
                  key={`${answer.item.id}-${index}`}
                  className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                >
                  {getLocalizedQuizItem(answer.item, language).name}
                </span>
              ))}
            </div>
          </section>

          <section className="panel-card">
            <p className="section-label text-red-700">{copy.review}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">{wrong.length} {copy.placesToRevisit}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {wrong.length > 0 ? (
                wrong.map((answer, index) => (
                  <span
                    key={`${answer.item.id}-${index}`}
                    className="rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                  >
                    {getLocalizedQuizItem(answer.item, language).name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">{copy.noMisses}</p>
              )}
            </div>
          </section>
        </div>

        <div className={`mt-6 flex flex-wrap gap-3 ${isMobile ? 'flex-col' : ''}`}>
          <button type="button" onClick={goHome} className="touch-secondary">
            {copy.home}
          </button>
          <button
            type="button"
            onClick={() => {
              setQuizMode('study');
              setView('quiz');
            }}
            className="touch-primary"
          >
            {copy.openStudy}
          </button>
        </div>
      </div>
    </div>
  );
}
