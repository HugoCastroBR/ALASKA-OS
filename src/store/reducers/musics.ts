import { MusicProps } from "@/types/programs";
import { createSlice } from "@reduxjs/toolkit";


type MusicSliceProps = {
  musics: MusicProps[];
  queue: MusicProps[];
  currentMusicIndex: number;
  isPaused: boolean;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentPlayingIndex: number;
  currentMusic: MusicProps;

}

export const MusicsSlice = createSlice({
  name: "MusicsSlice",
  initialState: {
    musics: [],
    queue: [],
    currentMusicIndex: 0,
    isPaused: true,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    isMuted: false,
    volume: 1,
    progress: 0,
    duration: 0,
    currentPlayingIndex: 0,
    currentMusic: {} as MusicProps,
  } as MusicSliceProps,
  reducers: {
    ADD_MUSIC(state, { payload }: { payload: MusicProps }) {
      state.musics.push(payload);
    },
    SET_MUSICS(state, { payload }: { payload: MusicProps[] }) {
      state.musics = payload;
    },
    SET_CURRENT_MUSIC_INDEX(state, { payload }: { payload: number }) {
      state.currentMusicIndex = payload;
    },
    SET_IS_PLAYING(state, { payload }: { payload: boolean }) {
      state.isPlaying = payload;
    },
    SET_IS_SHUFFLE(state, { payload }: { payload: boolean }) {
      state.isShuffle = payload;
    },
    SET_IS_REPEAT(state, { payload }: { payload: boolean }) {
      state.isRepeat = payload;
    },
    SET_IS_MUTED(state, { payload }: { payload: boolean }) {
      state.isMuted = payload;
    },
    SET_VOLUME(state, { payload }: { payload: number }) {
      state.volume = payload;
    },
    SET_PROGRESS(state, { payload }: { payload: number }) {
      state.progress = payload;
    },
    SET_DURATION(state, { payload }: { payload: number }) {
      state.duration = payload;
    },
    SET_CURRENT_MUSIC(state, { payload }: { payload: MusicProps }) {
      state.currentMusic = payload;
    },
    SET_NEXT_MUSIC(state) {
      if (state.currentMusicIndex < state.musics.length - 1) {
        state.currentMusicIndex++;
      } else {
        state.currentMusicIndex = 0;
      }
    },
    SET_PREVIOUS_MUSIC(state) {
      if (state.currentMusicIndex > 0) {
        state.currentMusicIndex--;
      } else {
        state.currentMusicIndex = state.musics.length - 1;
      }
    },
    SET_IS_PAUSED(state, { payload }: { payload: boolean }) {
      state.isPaused = payload;
    },
    ADD_MUSIC_TO_QUEUE(state, { payload }: { payload: MusicProps }) {
      state.queue.push(payload);
    },
    REMOVE_MUSIC_FROM_QUEUE(state, { payload }: { payload: MusicProps }) {
      state.queue = state.queue.filter((music) => music !== payload);
    },
    CLEAR_MUSIC(state) {
      state.currentMusicIndex = 0;
      state.isPaused = true;
      state.isPlaying = false;
      state.isShuffle = false;
      state.isRepeat = false;
      state.isMuted = false;
      state.progress = 0;
      state.duration = 0;
      state.currentMusic = {} as MusicProps;
    },
    SET_CURRENT_PLAYING_INDEX(state, { payload }: { payload: number }) {
      state.currentPlayingIndex = payload;
    },
    CLEAR_EVERYTHING(state) {
      state.musics = [];
      state.queue = [];
      state.currentMusicIndex = 0;
      state.isPaused = true;
      state.isPlaying = false;
      state.isShuffle = false;
      state.isRepeat = false;
      state.isMuted = false;
      state.volume = 1;
      state.progress = 0;
      state.duration = 0;
      state.currentPlayingIndex = 0;
      state.currentMusic = {} as MusicProps;
    },
  }
});