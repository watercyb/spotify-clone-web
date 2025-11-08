import type { AddSongDialoginputs } from "./AddSongDialogInputs";
import type { Album } from "./Album";
import type { Song } from "./Song";

export default interface UseAdminStore {
  isLoading: boolean;
  isUploading: boolean;
  albums: Album[];
  songs: Song[];
  stats: {
    totalAlbums: number;
    totalArtists: number;
    totalSongs: number;
    totalUsers: number;
  };
  error: string;

  getAll: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  uploadSong: (
    inputs: AddSongDialoginputs,
    audioFile: File | null,
    imageFile: File | null
  ) => Promise<void>;
}
