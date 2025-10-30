import type { Album } from "./Album";
import type { Song } from "./Song";

export interface UseMusicStore {
  isLoadingAlbumList: boolean;
  isLoadingAlbum: boolean;
  albums: Album[];
  currentAlbum: Album | null;
  isLoadingMadeForYouSongs: boolean;
  madeForYouSongs: Song[];
  isLoadingFeaturedSongs: boolean;
  featuredSongs: Song[];
  isLoadingTrendingSongs: boolean;
  trendingSongs: Song[];
  getAlbums: () => Promise<void>;
  getAlbumById: (albumId: string) => Promise<void>;
  getMadeForYouSongs: () => Promise<void>;
  getFeaturedSongs: () => Promise<void>;
  getTrendingSongs: () => Promise<void>;
}
