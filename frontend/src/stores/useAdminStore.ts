import { axiosInstance } from "@/lib/axios";
import type { Album } from "@/types/Album";
import type { Song } from "@/types/Song";
import type UseAdminStore from "@/types/UseAdminStore";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAdminStore = create<UseAdminStore>((set, get) => ({
  isLoading: false,
  isUploading: false,
  albums: [],
  songs: [],
  stats: { totalAlbums: -1, totalArtists: -1, totalSongs: -1, totalUsers: -1 },
  error: "",

  getAll: async () => {
    set({ isLoading: true });
    set({ error: "" });
    try {
      const songs = await axiosInstance.get("/songs");
      songs.data.sort((a: Song, b: Song) => a.title.localeCompare(b.title));
      set({ songs: songs.data || [] });

      const albums = await axiosInstance.get("/albums");
      albums.data.sort((a: Album, b: Album) => a.title.localeCompare(b.title));
      set({ albums: albums.data || [] });

      const stats = await axiosInstance.get("/stats");
      set({ stats: stats.data || [] });
    } catch (error: unknown) {
      console.log("Error in useAdminStrore getAll: " + error);
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message || error.message });
      } else {
        set({ error: String(error) });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (id: string) => {
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      get().stats.totalSongs--;
      toast.success("Song deleted successfully");
    } catch (error: unknown) {
      console.log("Error in useAdminStrore deleteSong: " + error);
      toast.error("Error deleting song");
    }
  },

  uploadSong: async (inputs, audioFile, imageFile) => {
    set({ isUploading: true });
    set({ error: "" });
    try {
      if (
        !inputs ||
        !inputs.artist ||
        !inputs.title ||
        !audioFile ||
        !imageFile
      ) {
        toast.error("Please complete all required fields.");
        return;
      }
      const formData = new FormData();
      formData.append("audioFile", audioFile);
      formData.append("imageFile", imageFile);
      Object.entries(inputs).forEach(([key, value]) => {
        if (value != null) formData.append(key, value);
      });

      const res = await axiosInstance.post("/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newSong = res.data;
      set((state) => ({ songs: [...state.songs, newSong] }));

      toast.success("Song uploaded successfully");
    } catch (error: unknown) {
      console.log("Error in useAdminStrore uploadSong: " + error);
      console.log(error);
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message || error.message });
      } else {
        set({ error: String(error) });
      }
      toast.error("Error uploading song");
    } finally {
      set({ isUploading: false });
    }
  },
}));
