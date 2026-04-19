import { create } from 'zustand';

const STORAGE_KEY = 'geo-audio-preferences';

interface StoredAudioPreferences {
  masterEnabled: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

interface AudioStore extends StoredAudioPreferences {
  hasUnlockedAudio: boolean;
  setMasterEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setSfxEnabled: (enabled: boolean) => void;
  toggleMaster: () => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
  markAudioUnlocked: () => void;
  resetAudioUnlock: () => void;
}

function loadPreferences(): StoredAudioPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        masterEnabled: false,
        musicEnabled: true,
        sfxEnabled: true,
      };
    }

    const parsed = JSON.parse(raw) as Partial<StoredAudioPreferences>;
    return {
      masterEnabled: parsed.masterEnabled ?? false,
      musicEnabled: parsed.musicEnabled ?? true,
      sfxEnabled: parsed.sfxEnabled ?? true,
    };
  } catch {
    return {
      masterEnabled: false,
      musicEnabled: true,
      sfxEnabled: true,
    };
  }
}

function persistPreferences(state: AudioStore) {
  const snapshot: StoredAudioPreferences = {
    masterEnabled: state.masterEnabled,
    musicEnabled: state.musicEnabled,
    sfxEnabled: state.sfxEnabled,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

const stored = loadPreferences();

export const useAudioStore = create<AudioStore>((set, get) => ({
  ...stored,
  hasUnlockedAudio: false,

  setMasterEnabled: (enabled) => {
    set((state) => {
      const nextState = { ...state, masterEnabled: enabled };
      persistPreferences(nextState);
      return nextState;
    });
  },

  setMusicEnabled: (enabled) => {
    set((state) => {
      const nextState = { ...state, musicEnabled: enabled };
      persistPreferences(nextState);
      return nextState;
    });
  },

  setSfxEnabled: (enabled) => {
    set((state) => {
      const nextState = { ...state, sfxEnabled: enabled };
      persistPreferences(nextState);
      return nextState;
    });
  },

  toggleMaster: () => get().setMasterEnabled(!get().masterEnabled),
  toggleMusic: () => get().setMusicEnabled(!get().musicEnabled),
  toggleSfx: () => get().setSfxEnabled(!get().sfxEnabled),

  markAudioUnlocked: () => set({ hasUnlockedAudio: true }),
  resetAudioUnlock: () => set({ hasUnlockedAudio: false }),
}));
