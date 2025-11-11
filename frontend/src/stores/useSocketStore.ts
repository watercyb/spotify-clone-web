import { create } from "zustand";
import type { UseSocketStore } from "@/types/UseSocketStore";
import { io } from "socket.io-client";

export const useSocketStore = create<UseSocketStore>((set, get) => ({
  socket: null,

  connect: async (token) => {
    if (get().socket) return;

    const socket = io("http://localhost:5000", { auth: { token } });

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    set({ socket });
  },
}));
