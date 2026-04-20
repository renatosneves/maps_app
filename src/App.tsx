import { useAppStore } from './hooks/useAppStore';
import { useIsMobile } from './hooks/useIsMobile';
import { ui } from './i18n';
import AudioProvider from './components/Audio/AudioProvider';
import HomeScreen from './components/Layout/HomeScreen';
import QuizScreen from './components/Quiz/QuizScreen';
import QuizResults from './components/Quiz/QuizResults';
import StudyScreen from './components/Study/StudyScreen';

function App() {
  const { view, quizMode, language, setLanguage } = useAppStore();
  const isMobile = useIsMobile();
  const copy = ui[language];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_32%,#fff7ed_100%)]">
      <AudioProvider />
      {view === 'home' && (
        <div className={`mx-auto flex max-w-[1760px] px-3 pt-3 sm:px-5 lg:px-6 lg:pt-5 ${isMobile ? 'justify-center' : 'justify-end'}`}>
          <div className="inline-flex items-center gap-1 rounded-full border border-white/75 bg-white/80 p-1 shadow-[0_12px_30px_rgba(148,163,184,0.14)] backdrop-blur">
            <button
              type="button"
              onClick={() => setLanguage('sv')}
              aria-label={copy.swedish}
              title={copy.swedish}
              className={language === 'sv' ? 'segmented-active min-h-0 rounded-full px-3 py-2 text-lg leading-none' : 'segmented-idle min-h-0 rounded-full px-3 py-2 text-lg leading-none'}
            >
              <span aria-hidden="true">🇸🇪</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-label={copy.english}
              title={copy.english}
              className={language === 'en' ? 'segmented-active min-h-0 rounded-full px-3 py-2 text-lg leading-none' : 'segmented-idle min-h-0 rounded-full px-3 py-2 text-lg leading-none'}
            >
              <span aria-hidden="true">🇬🇧</span>
            </button>
          </div>
        </div>
      )}
      {view === 'home' && <HomeScreen isMobile={isMobile} />}
      {view === 'quiz' && quizMode === 'study' && <StudyScreen isMobile={isMobile} />}
      {view === 'quiz' && quizMode !== 'study' && <QuizScreen isMobile={isMobile} />}
      {view === 'results' && <QuizResults isMobile={isMobile} />}
    </div>
  );
}

export default App;
