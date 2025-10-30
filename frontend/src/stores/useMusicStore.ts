import { axiosInstance } from "@/lib/axios";
import type { UseMusicStore } from "@/types/UseMusicStore";
import { create } from "zustand";

export const useMusicStore = create<UseMusicStore>((set) => ({
  isLoadingAlbumList: false,
  isLoadingAlbum: false,
  albums: [],
  currentAlbum: null,
  isLoadingMadeForYouSongs: false,
  madeForYouSongs: [],
  isLoadingFeaturedSongs: false,
  featuredSongs: [],
  isLoadingTrendingSongs: false,
  trendingSongs: [],

  getAlbums: async () => {
    set({ isLoadingAlbumList: true });
    try {
      const res = await axiosInstance.get("/albums");
      const albums = res.data || [];
      set({ albums });
    } catch (error) {
      console.log("Error in useMusicStore getAlbums: " + error);
    } finally {
      set({ isLoadingAlbumList: false });
    }
  },

  getAlbumById: async (albumId: string) => {
    set({ isLoadingAlbum: true });
    try {
      const res = await axiosInstance.get(`/albums/${albumId}`);
      set({ currentAlbum: res.data || null });
    } catch (error) {
      console.log("Error in useMusicStore getAlbumById: " + error);
    } finally {
      set({ isLoadingAlbum: false });
    }
  },

  getMadeForYouSongs: async () => {
    set({ isLoadingMadeForYouSongs: true });
    try {
      const res = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: res.data || [] });
    } catch (error) {
      console.log("Error in useMusicStore getMadeForYouSongs: " + error);
    } finally {
      set({ isLoadingMadeForYouSongs: false });
    }
  },

  getFeaturedSongs: async () => {
    set({ isLoadingFeaturedSongs: true });
    try {
      const res = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: res.data || [] });
    } catch (error) {
      console.log("Error in useMusicStore getFeaturedSongs: " + error);
    } finally {
      set({ isLoadingFeaturedSongs: false });
    }
  },
  
  getTrendingSongs: async () => {
    set({ isLoadingTrendingSongs: true });
    try {
      const res = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: res.data || [] });
    } catch (error) {
      console.log("Error in useMusicStore getTrendingSongs: " + error);
    } finally {
      set({ isLoadingTrendingSongs: false });
    }
  },
}));
