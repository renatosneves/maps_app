import { useEffect, useRef } from 'react';
import { syncAudioScene, playEffect, unlockAudioPlayback } from '../../audio';
import { useAppStore } from '../../hooks/useAppStore';
import { useAudioStore } from '../../hooks/useAudioStore';

export default function AudioProvider() {
  const { view, quizMode } = useAppStore();
  const {
    masterEnabled,
    musicEnabled,
    hasUnlockedAudio,
    markAudioUnlocked,
  } = useAudioStore();
  const previousViewRef = useRef(view);

  const scene =
    view === 'quiz'
      ? quizMode === 'study'
        ? 'study'
        : 'quiz'
      : 'none';

  useEffect(() => {
    syncAudioScene(scene);
  }, [scene, masterEnabled, musicEnabled, hasUnlockedAudio]);

  useEffect(() => {
    if (view === 'results' && previousViewRef.current !== 'results') {
      playEffect('results-sting');
    }

    previousViewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (!masterEnabled || hasUnlockedAudio) return;

    let active = true;

    const handleUnlock = async () => {
      if (!active) return;

      try {
        await unlockAudioPlayback();
        if (active) {
          markAudioUnlocked();
        }
      } catch {
        // Leave audio muted for this session if the browser refuses playback.
      }

      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', handleUnlock, true);
      window.removeEventListener('keydown', handleUnlock, true);
    };

    window.addEventListener('pointerdown', handleUnlock, true);
    window.addEventListener('keydown', handleUnlock, true);

    return () => {
      active = false;
      cleanup();
    };
  }, [hasUnlockedAudio, markAudioUnlocked, masterEnabled]);

  return null;
}
