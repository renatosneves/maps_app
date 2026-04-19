import { useEffect, useRef } from 'react';
import { playEffect } from '../../audio';
import { useQuizStore } from '../../hooks/useQuiz';
import { useProgress } from '../../hooks/useProgress';
import { useAppStore } from '../../hooks/useAppStore';
import { getLocalizedQuizItem, ui } from '../../i18n';

export default function QuizFeedback() {
  const { feedbackState, items, currentIndex, answers, nextQuestion } = useQuizStore();
  const { regionFilter, language } = useAppStore();
  const { recordAnswer } = useProgress();
  const recordedAnswerCount = useRef(0);
  const playedFeedbackCount = useRef(0);
  const copy = ui[language];

  const current = items[currentIndex];
  const lastAnswer = answers[answers.length - 1];

  useEffect(() => {
    if (feedbackState === 'none') {
      recordedAnswerCount.current = answers.length;
      playedFeedbackCount.current = answers.length;
      return;
    }

    if (lastAnswer && recordedAnswerCount.current < answers.length) {
      const regionKey =
        regionFilter.type === 'world'
          ? 'world'
          : regionFilter.value;
      recordAnswer(regionKey, lastAnswer.item.id, lastAnswer.correct);
      recordedAnswerCount.current = answers.length;
    }
  }, [answers.length, feedbackState, lastAnswer, regionFilter, recordAnswer]);

  useEffect(() => {
    if (feedbackState === 'none') {
      playedFeedbackCount.current = answers.length;
      return;
    }

    if (!lastAnswer || playedFeedbackCount.current >= answers.length) return;

    playEffect(lastAnswer.correct ? 'correct' : 'wrong');
    playedFeedbackCount.current = answers.length;
  }, [answers.length, feedbackState, lastAnswer]);

  if (feedbackState === 'none' || !current) return null;
  const localizedCurrent = getLocalizedQuizItem(current, language);

  const isLast = currentIndex >= items.length - 1;

  return (
    <div className="mt-5 space-y-4">
      <div
        className={`rounded-[22px] border px-4 py-4 font-medium shadow-sm ${
          feedbackState === 'correct'
            ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
            : 'border-red-100 bg-red-50 text-red-700'
        }`}
      >
        {feedbackState === 'correct' ? (
          copy.correctFeedback
        ) : (
          <span>
            {copy.wrongFeedbackPrefix}{' '}
            <strong>{localizedCurrent.name}</strong>
            <span className="ml-1 text-emerald-600">{copy.highlightedGreen}</span>
          </span>
        )}
      </div>
      <button
        onClick={() => {
          if (isLast) {
            useAppStore.getState().setView('results');
          } else {
            playEffect('advance');
            nextQuestion();
          }
        }}
        className="touch-secondary w-full justify-center"
      >
        {isLast ? copy.seeResults : copy.nextPrompt}
      </button>
    </div>
  );
}
