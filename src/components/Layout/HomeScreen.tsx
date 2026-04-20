import { useState } from 'react';
import AudioControls from '../Audio/AudioControls';
import { continents, oceans } from '../../data/continents';
import { useAppStore } from '../../hooks/useAppStore';
import { useStudyStore } from '../../hooks/useStudyStore';
import { useQuizStore } from '../../hooks/useQuiz';
import { getContinentLabel, getOceanLabel, ui } from '../../i18n';
import type { QuizMode, RegionFilter } from '../../types';

export default function HomeScreen({ isMobile = false }: { isMobile?: boolean }) {
  const { setView, setRegionFilter, setQuizMode, language } = useAppStore();
  const { startQuiz } = useQuizStore();
  const { stars, badges } = useStudyStore();
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>({ type: 'world' });
  const [selectedMode, setSelectedMode] = useState<QuizMode>('study');
  const copy = ui[language];
  const modeOptions = [
    {
      mode: 'study' as QuizMode,
      title: copy.studyModeTitle,
      description: copy.studyModeDescription,
      accent: 'from-amber-300 via-orange-300 to-pink-300',
    },
    {
      mode: 'click' as QuizMode,
      title: copy.clickModeTitle,
      description: copy.clickModeDescription,
      accent: 'from-sky-300 via-blue-300 to-indigo-300',
    },
    {
      mode: 'type' as QuizMode,
      title: copy.typeModeTitle,
      description: copy.typeModeDescription,
      accent: 'from-emerald-300 via-lime-300 to-cyan-300',
    },
  ] as const;

  const handleStart = () => {
    setRegionFilter(selectedRegion);
    setQuizMode(selectedMode);
    startQuiz(selectedRegion, selectedMode);
    setView('quiz');
  };

  return (
    <div className={`mx-auto max-w-[1760px] px-3 sm:px-5 lg:px-6 ${isMobile ? 'pb-6 pt-2' : 'py-3 lg:py-5'}`}>
      <div className={`border border-white/65 bg-[linear-gradient(135deg,rgba(239,246,255,0.96),rgba(255,251,235,0.98))] shadow-[0_30px_120px_rgba(15,23,42,0.12)] ${isMobile ? 'rounded-[28px] p-3' : 'rounded-[34px] p-5 sm:p-6 lg:p-7'}`}>
        <div className={`grid gap-5 ${isMobile ? 'gap-4' : 'xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,400px)] 2xl:grid-cols-[minmax(0,1.75fr)_380px]'}`}>
          <section className="space-y-5">
            <div className={`panel-card bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(239,246,255,0.9)_40%,rgba(219,234,254,0.88)_100%)] ${isMobile ? 'rounded-[26px] p-4' : ''}`}>
              <div className={`flex flex-wrap items-start justify-between gap-4 ${isMobile ? 'flex-col' : ''}`}>
                <div className={isMobile ? '' : 'max-w-3xl'}>
                  <h1 className={`font-display text-slate-950 ${isMobile ? 'text-[2.35rem]' : 'text-4xl sm:text-5xl lg:text-6xl'}`}>
                    {copy.heroTitle}
                  </h1>
                  <p className={`mt-4 text-slate-600 ${isMobile ? 'max-w-none text-[0.98rem] leading-7' : 'max-w-2xl text-base leading-7 sm:text-lg'}`}>
                    {copy.heroDescription}
                  </p>
                </div>
                <div className={`rounded-[28px] border border-white/80 bg-white/80 shadow-sm ${isMobile ? 'grid w-full grid-cols-2 gap-4 px-4 py-4' : 'px-5 py-4'}`}>
                  <p className="section-label text-amber-700">{copy.yourPlayground}</p>
                  <div className={`flex gap-6 ${isMobile ? 'col-span-2 mt-0 justify-between' : 'mt-3'}`}>
                    <div>
                      <p className="text-3xl font-extrabold text-slate-950">{stars}</p>
                      <p className="text-sm text-slate-500">{copy.stars}</p>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-slate-950">{badges.length}</p>
                      <p className="text-sm text-slate-500">{copy.badges}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`panel-card ${isMobile ? 'rounded-[26px] p-4' : ''}`}>
              <p className="section-label">{copy.pickRegion}</p>
              <div className={`mt-4 ${isMobile ? 'space-y-4' : 'space-y-5'}`}>
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{copy.continents}</p>
                  <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {continents.filter((continent) => continent.name !== 'Antarctica').map((continent) => {
                      const selected =
                        selectedRegion.type === 'continent' && selectedRegion.value === continent.name;
                      return (
                        <button
                          key={continent.name}
                          type="button"
                          onClick={() => setSelectedRegion({ type: 'continent', value: continent.name })}
                          className={selected ? 'region-card-active' : 'region-card'}
                        >
                          <span className="text-lg font-semibold text-slate-950">{getContinentLabel(continent.name, language)}</span>
                          <span className="mt-2 text-sm text-slate-500">{copy.focusedRegionalPractice}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{copy.oceans}</p>
                  <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {oceans.map((ocean) => {
                      const selected =
                        selectedRegion.type === 'ocean' && selectedRegion.value === ocean.name;
                      return (
                        <button
                          key={ocean.name}
                          type="button"
                          onClick={() => setSelectedRegion({ type: 'ocean', value: ocean.name })}
                          className={selected ? 'region-card-active' : 'region-card'}
                        >
                          <span className="text-lg font-semibold text-slate-950">{getOceanLabel(ocean.name, language)}</span>
                          <span className="mt-2 text-sm text-slate-500">{copy.seaFocusedGeography}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRegion({ type: 'world' })}
                  className={selectedRegion.type === 'world' ? 'region-card-active w-full' : 'region-card w-full'}
                >
                  <span className="text-lg font-semibold text-slate-950">{copy.world}</span>
                  <span className="mt-2 text-sm text-slate-500">{copy.fullAtlasChallenge}</span>
                </button>
              </div>
            </div>
          </section>

          <aside className={`space-y-4 ${isMobile ? '' : 'xl:sticky xl:top-5 xl:self-start'}`}>
            <section className={`panel-card ${isMobile ? 'rounded-[26px] p-4' : ''}`}>
              <p className="section-label">{copy.chooseMode}</p>
              <div className="mt-4 grid gap-3">
                {modeOptions.map((option) => {
                  const selected = selectedMode === option.mode;
                  return (
                    <button
                      key={option.mode}
                      type="button"
                      onClick={() => setSelectedMode(option.mode)}
                      className={`relative overflow-hidden rounded-[26px] border p-4 text-left transition duration-200 ${
                        selected
                          ? 'border-slate-900 bg-slate-950 text-white shadow-[0_18px_55px_rgba(15,23,42,0.28)]'
                          : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(148,163,184,0.18)]'
                      }`}
                    >
                      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${option.accent}`} />
                      <div className="pt-2">
                        <h3 className="text-xl font-semibold">{option.title}</h3>
                        <p className={`mt-2 text-sm leading-6 ${selected ? 'text-slate-200' : 'text-slate-500'}`}>
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <AudioControls showHelper compact={isMobile} />

            <section className={`panel-card bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] ${isMobile ? 'rounded-[26px] p-4' : ''}`}>
              <p className="section-label text-blue-200">{copy.ready}</p>
              <h2 className="mt-2 text-3xl font-semibold">{copy.launchSession}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {copy.launchDescription}
              </p>
              <button type="button" onClick={handleStart} className={`touch-primary mt-6 w-full justify-center bg-white text-slate-950 hover:bg-slate-100 ${isMobile ? 'min-h-[3.4rem]' : ''}`}>
                {selectedMode === 'study' ? copy.openStudy : copy.startSession}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
