import { axiosInstance, checkError } from "@/lib/axios";
import type UseAuthState from "@/types/UseAuthState";
import { create } from "zustand";

export const useAuthStore = create<UseAuthState>((set) => ({
  isAdmin: false,
  checkIsAdmin: async () => {
    try {
      const res = await axiosInstance.get("/admin/check");
      set({ isAdmin: res.data?.admin || false });
    } catch (error) {
      set({ isAdmin: false });
      if (checkError(error) != "Unauthorized")
        console.log("Error in useAuthStore checkIsAdmin: " + error);
    }
  },
}));
