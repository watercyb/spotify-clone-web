import { create } from "zustand";
import type { UsePlayerStore } from "@/types/UsePlayerStore";
import type { Song } from "@/types/Song";
import { useChatStore } from "./useChatStore";

export const usePlayerStore = create<UsePlayerStore>((set, get) => ({
  playList: [],
  isPlaying: false,
  currentSongIdx: -1,
  currentSong: null,
  hasNext: false,
  hasPrev: false,

  updatePlayList: (playList: Song[], currentSongIdx: number) => {
    set({ isPlaying: false });
    if (!playList) playList = [];
    if (
      !currentSongIdx ||
      currentSongIdx < 0 ||
      currentSongIdx >= playList.length
    )
      currentSongIdx = 0;
    if (playList.length == 0) {
      set({
        playList,
        currentSongIdx,
        currentSong: null,
        isPlaying: false,
        hasPrev: false,
        hasNext: false,
      });
    } else {
      set({
        playList,
        currentSongIdx,
        currentSong: playList[currentSongIdx],
        isPlaying: true,
        hasPrev: currentSongIdx > 0,
        hasNext: currentSongIdx < playList.length - 1,
      });
    }
  },

  play: () => {
    set({ isPlaying: true });
    useChatStore
      .getState()
      .updateActivity(get().playList[get().currentSongIdx]);
  },

  pause: () => {
    set({ isPlaying: false });
    useChatStore.getState().updateActivity(null);
  },

  playNext: () => {
    let currentSongIdx = get().currentSongIdx;
    const playList = get().playList;

    if (playList.length > 0 && currentSongIdx < playList.length - 1) {
      currentSongIdx++;
      set({
        isPlaying: true,
        currentSongIdx,
        currentSong: playList[currentSongIdx],
        hasPrev: currentSongIdx > 0,
        hasNext: currentSongIdx < playList.length - 1,
      });
    }

    if (get().isPlaying) {
      useChatStore
        .getState()
        .updateActivity(get().playList[get().currentSongIdx]);
    } else {
      useChatStore.getState().updateActivity(null);
    }
  },

  playPrevious: () => {
    let currentSongIdx = get().currentSongIdx;
    const playList = get().playList;

    if (playList.length > 0 && currentSongIdx > 0) {
      currentSongIdx--;
      set({
        isPlaying: true,
        currentSongIdx,
        currentSong: playList[currentSongIdx],
        hasPrev: currentSongIdx > 0,
        hasNext: currentSongIdx < playList.length - 1,
      });
    }

    if (get().isPlaying) {
      useChatStore
        .getState()
        .updateActivity(get().playList[get().currentSongIdx]);
    } else {
      useChatStore.getState().updateActivity(null);
    }
  },

  togglePlay: () => {
    const isPlaying = !get().isPlaying;
    if (isPlaying) {
      useChatStore
        .getState()
        .updateActivity(get().playList[get().currentSongIdx]);
    } else {
      useChatStore.getState().updateActivity(null);
    }
    set({ isPlaying });
  },
}));
