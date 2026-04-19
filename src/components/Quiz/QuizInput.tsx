import { useState } from 'react';
import { useQuizStore } from '../../hooks/useQuiz';
import { useAppStore } from '../../hooks/useAppStore';
import { ui } from '../../i18n';

export default function QuizInput() {
  const { language } = useAppStore();
  const { mode, feedbackState, submitTypeAnswer } = useQuizStore();
  const [value, setValue] = useState('');
  const copy = ui[language];

  if (mode !== 'type') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && feedbackState === 'none') {
      submitTypeAnswer(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={copy.typeTheName}
        disabled={feedbackState !== 'none'}
        className="min-h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
        autoFocus
      />
      <button
        type="submit"
        disabled={!value.trim() || feedbackState !== 'none'}
        className="touch-primary justify-center disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copy.submit}
      </button>
    </form>
  );
}
