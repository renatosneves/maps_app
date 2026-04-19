import { useQuizStore } from '../../hooks/useQuiz';
import { useAppStore } from '../../hooks/useAppStore';
import { ui } from '../../i18n';

export default function QuizProgress() {
  const { language } = useAppStore();
  const { items, currentIndex, score, streak, bestStreak } = useQuizStore();
  const copy = ui[language];
  const total = items.length;
  const progress = total > 0 ? (currentIndex / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-blue-200">
            {copy.question} {Math.min(currentIndex + 1, total)} {copy.of} {total}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {score}/{Math.max(currentIndex, 1)} {copy.correct}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {streak > 1 ? copy.momentumBuilding : copy.calmAccuracy}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-[0.22em] text-blue-200">{copy.bestStreak}</p>
          <p className="mt-2 text-2xl font-bold text-white">{Math.max(streak, bestStreak)}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#f59e0b)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{streak > 1 ? `🔥 ${streak} ${copy.inARow}` : copy.steadyPace}</span>
          <span>{Math.round(progress)}% {copy.through}</span>
        </div>
      </div>
    </div>
  );
}
