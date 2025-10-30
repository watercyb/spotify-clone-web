import type { Song } from "./Song";

export interface UsePlayerStore {
  playList: Song[];
  isPlaying: boolean;
  currentSongIdx: number;
  currentSong: Song | null;
  hasNext: boolean;
  hasPrev: boolean;

  updatePlayList: (playList: Song[], currentSong: number) => void;
  play: () => void;
  pause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
}
