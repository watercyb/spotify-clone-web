import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import type { UseUserStore } from "@/types/UseUserStore";

export const useUserStore = create<UseUserStore>((set) => ({
  users: [],
  isLoadingUsers: false,
  getUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/users");
      const users = res.data || [];
      set({ users });
    } catch (error) {
      console.log("Error in userUserStore: " + error);
    } finally {
      set({ isLoadingUsers: false });
    }
  },
}));
