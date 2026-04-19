import { Howl, Howler } from 'howler';
import { useAudioStore } from '../hooks/useAudioStore';
import { effectManifest, trackManifest } from './assets';
import type { AudioTrackId, SoundEffectId } from './assets';

export type AudioScene = 'none' | 'study' | 'quiz';

const MUSIC_FADE_MS = 650;
const STOP_DELAY_MS = 40;

let initialized = false;
let activeTrack: AudioTrackId | null = null;
let currentScene: AudioScene = 'none';

const trackPlayers = {} as Record<AudioTrackId, Howl>;
const effectPlayers = {} as Record<SoundEffectId, Howl>;
const stopTimers = new Map<AudioTrackId, ReturnType<typeof setTimeout>>();

function clearStopTimer(trackId: AudioTrackId) {
  const timer = stopTimers.get(trackId);
  if (!timer) return;
  clearTimeout(timer);
  stopTimers.delete(trackId);
}

function initializeAudio() {
  if (initialized) return;

  Howler.autoSuspend = true;

  (Object.keys(trackManifest) as AudioTrackId[]).forEach((trackId) => {
    const config = trackManifest[trackId];
    trackPlayers[trackId] = new Howl({
      src: config.src,
      loop: true,
      preload: true,
      html5: false,
      volume: 0,
    });
  });

  (Object.keys(effectManifest) as SoundEffectId[]).forEach((effectId) => {
    const config = effectManifest[effectId];
    effectPlayers[effectId] = new Howl({
      src: config.src,
      preload: true,
      html5: false,
      pool: 6,
      volume: config.volume,
    });
  });

  initialized = true;
}

function getTargetTrack(scene: AudioScene): AudioTrackId | null {
  if (scene === 'study') return 'study-loop';
  if (scene === 'quiz') return 'quiz-loop';
  return null;
}

function canPlayMusic() {
  const { masterEnabled, musicEnabled, hasUnlockedAudio } = useAudioStore.getState();
  return masterEnabled && musicEnabled && hasUnlockedAudio;
}

function canPlayEffects() {
  const { masterEnabled, sfxEnabled, hasUnlockedAudio } = useAudioStore.getState();
  return masterEnabled && sfxEnabled && hasUnlockedAudio;
}

function stopTrack(trackId: AudioTrackId, immediate = false) {
  const player = trackPlayers[trackId];
  if (!player) return;

  clearStopTimer(trackId);

  if (immediate || !player.playing()) {
    player.stop();
    player.volume(0);
    return;
  }

  player.fade(player.volume(), 0, MUSIC_FADE_MS);
  const timer = setTimeout(() => {
    player.stop();
    player.volume(0);
    stopTimers.delete(trackId);
  }, MUSIC_FADE_MS + STOP_DELAY_MS);
  stopTimers.set(trackId, timer);
}

function startTrack(trackId: AudioTrackId) {
  const player = trackPlayers[trackId];
  const targetVolume = trackManifest[trackId].volume;

  clearStopTimer(trackId);

  if (!player.playing()) {
    player.volume(0);
    player.play();
  }

  player.fade(player.volume(), targetVolume, MUSIC_FADE_MS);
}

export async function unlockAudioPlayback() {
  initializeAudio();

  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    await Howler.ctx.resume();
  }
}

export function syncAudioScene(scene: AudioScene) {
  currentScene = scene;

  if (!canPlayMusic()) {
    if (activeTrack) {
      stopTrack(activeTrack);
      activeTrack = null;
    }
    return;
  }

  initializeAudio();

  const nextTrack = getTargetTrack(scene);
  if (!nextTrack) {
    if (activeTrack) {
      stopTrack(activeTrack);
      activeTrack = null;
    }
    return;
  }

  if (activeTrack && activeTrack !== nextTrack) {
    stopTrack(activeTrack);
  }

  if (activeTrack !== nextTrack) {
    startTrack(nextTrack);
    activeTrack = nextTrack;
    return;
  }

  const activePlayer = trackPlayers[nextTrack];
  if (!activePlayer.playing()) {
    startTrack(nextTrack);
  }
}

export function refreshAudioScene() {
  syncAudioScene(currentScene);
}

export function playEffect(effectId: SoundEffectId) {
  if (!canPlayEffects()) return;

  initializeAudio();
  const player = effectPlayers[effectId];
  if (!player) return;

  player.stop();
  player.volume(effectManifest[effectId].volume);
  player.play();
}
