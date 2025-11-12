import { create } from "zustand";
import type { UseChatStore } from "@/types/UseChatStore";
import { io } from "socket.io-client";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create<UseChatStore>((set, get) => ({
  isLoading: false,
  socket: null,
  userId: null,
  users: [],
  userActivities: new Map(),
  messages: [],
  connect: async (token) => {
    if (get().socket) return;

    const socket = io("http://localhost:5000", { auth: { token } });

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("user_id", (userId) => {
      set({ userId });
    });

    socket.on("users_online", (users: string[]) => {
      set({ users: users.filter((id: string) => id != get().userId) });
    });

    socket.on("activities", (activities: [string, string][]) => {
      set({ userActivities: new Map(activities) });
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    set({ socket });
  },

  sendMessage: async (receiverId, content) => {
    const socket = get().socket;
    if (!socket) return;
    socket.emit("send_message", { receiverId, content });
  },

  getAllMessages: async (receiverId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/users/messages/${receiverId}`);
      if (res) set({ messages: res.data });
    } catch (error) {
      console.log("Error in useChatStore getAllMessages: " + error);
      toast.error("Error receiving messages");
    } finally {
      set({ isLoading: false });
    }
  },
}));
