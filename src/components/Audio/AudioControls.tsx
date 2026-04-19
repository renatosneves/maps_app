import type { MouseEvent } from 'react';
import { unlockAudioPlayback } from '../../audio';
import { useAudioStore } from '../../hooks/useAudioStore';
import { useAppStore } from '../../hooks/useAppStore';
import { ui } from '../../i18n';

interface AudioControlsProps {
  compact?: boolean;
  showHelper?: boolean;
  tone?: 'light' | 'dark';
}

function getButtonClass(enabled: boolean, tone: 'light' | 'dark', compact: boolean) {
  if (tone === 'dark') {
    return [
      'rounded-full border px-3 font-semibold transition',
      compact ? 'min-h-10 py-2 text-xs' : 'min-h-11 py-2.5 text-sm',
      enabled
        ? 'border-amber-300/70 bg-amber-300 text-slate-950 shadow-[0_12px_28px_rgba(250,204,21,0.18)]'
        : 'border-white/15 bg-white/10 text-white hover:bg-white/15',
    ].join(' ');
  }

  return [
    'rounded-full border px-3 font-semibold transition',
    compact ? 'min-h-10 py-2 text-xs' : 'min-h-11 py-2.5 text-sm',
    enabled
      ? 'border-slate-900 bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)]'
      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-slate-950',
  ].join(' ');
}

export default function AudioControls({
  compact = false,
  showHelper = false,
  tone = 'light',
}: AudioControlsProps) {
  const { language } = useAppStore();
  const {
    masterEnabled,
    musicEnabled,
    sfxEnabled,
    hasUnlockedAudio,
    setMasterEnabled,
    toggleMusic,
    toggleSfx,
    markAudioUnlocked,
  } = useAudioStore();
  const copy = ui[language];

  const handleMasterToggle = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (masterEnabled) {
      setMasterEnabled(false);
      return;
    }

    try {
      await unlockAudioPlayback();
      markAudioUnlocked();
    } catch {
      // Keep the preference change even if the browser delays playback.
    }

    setMasterEnabled(true);
  };

  const helperText = !masterEnabled
    ? copy.audioHintDisabled
    : hasUnlockedAudio
      ? copy.audioHintActive
      : copy.audioHintPending;

  return (
    <section
      className={[
        'rounded-[24px] border',
        tone === 'dark'
          ? 'border-white/12 bg-white/8 text-white'
          : 'border-slate-200/80 bg-white/80 text-slate-950 shadow-sm',
        compact ? 'px-3 py-3' : 'px-4 py-4',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`section-label ${tone === 'dark' ? 'text-sky-200' : ''}`}>{copy.audio}</p>
          {showHelper && (
            <p className={`mt-1 max-w-sm text-sm leading-5 ${tone === 'dark' ? 'text-slate-200' : 'text-slate-600'}`}>
              {helperText}
            </p>
          )}
        </div>
        {!showHelper && (
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
              tone === 'dark'
                ? 'bg-white/10 text-sky-100'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {masterEnabled ? copy.audioOn : copy.audioOff}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={masterEnabled}
          onClick={handleMasterToggle}
          className={getButtonClass(masterEnabled, tone, compact)}
        >
          {masterEnabled ? copy.audioOn : copy.audioOff}
        </button>
        <button
          type="button"
          aria-pressed={musicEnabled}
          onClick={toggleMusic}
          className={getButtonClass(musicEnabled, tone, compact)}
        >
          {copy.music}
        </button>
        <button
          type="button"
          aria-pressed={sfxEnabled}
          onClick={toggleSfx}
          className={getButtonClass(sfxEnabled, tone, compact)}
        >
          {copy.soundEffects}
        </button>
      </div>
    </section>
  );
}
