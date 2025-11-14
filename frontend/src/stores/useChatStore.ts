import { create } from "zustand";
import type { UseChatStore } from "@/types/UseChatStore";
import { io } from "socket.io-client";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import type { Message } from "@/types/Message";
import type { Song } from "@/types/Song";

export const useChatStore = create<UseChatStore>((set, get) => ({
  isLoadingUser: false,
  isLoadingMessage: false,
  socket: null,
  user: null,
  selectedUser: null,
  users: [],
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  connect: async (token) => {
    if (get().socket) return;

    const socket = io(
      import.meta.env.VITE_NODE_ENV === "development"
        ? "http://localhost:5000"
        : "/",
      { auth: { token }}
    );

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("user", (user) => {
      set({ user });
    });

    socket.on("users_online", (onlineUsers: string[]) => {
      set({ onlineUsers: new Set(onlineUsers) });
    });

    socket.on("receive_message", (newMessage: Message) => {
      const user = get().user;
      const selectedUser = get().selectedUser;
      if (
        selectedUser &&
        user &&
        ((user._id == newMessage.senderId &&
          selectedUser._id == newMessage.receiverId) ||
          (selectedUser._id == newMessage.senderId &&
            user._id == newMessage.receiverId))
      ) {
        set({ messages: [...get().messages, newMessage] });
      }
    });

    socket.on("user_connected", (userId: string) => {
      set({
        onlineUsers: new Set([...get().onlineUsers, userId]),
      });
    });

    socket.on("user_disconnected", (userId: string) => {
      const onlineUsers = new Set(get().onlineUsers);
      onlineUsers.delete(userId);
      set({ onlineUsers });
    });

    socket.on("activities", (activities: [string, Song | null][]) => {
      set({ userActivities: new Map(activities) });
    });

    socket.on("activity_updated", ({ userId, activity }) => {
      const userActivities = new Map(get().userActivities);
      userActivities.set(userId, activity);
      set({ userActivities });
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    set({ socket });
  },

  getUsers: async () => {
    set({ isLoadingUser: true });
    try {
      const res = await axiosInstance.get("/users");
      const users = res.data || [];
      set({ users });
    } catch (error) {
      console.log("Error in useChatStore getUsers: " + error);
    } finally {
      set({ isLoadingUser: false });
    }
  },

  sendMessage: async (receiverId, content) => {
    const socket = get().socket;
    if (!socket) return;
    socket.emit("send_message", { receiverId, content });
  },

  getMessages: async (receiverId) => {
    try {
      set({ isLoadingMessage: true });
      const res = await axiosInstance.get(`/users/messages/${receiverId}`);
      if (res) set({ messages: res.data });
    } catch (error) {
      console.log("Error in useChatStore getAllMessages: " + error);
      toast.error("Error receiving messages");
    } finally {
      set({ isLoadingMessage: false });
    }
  },

  updateActivity: (song) => {
    const socket = get().socket;
    socket?.emit("update_activity", song);
  },
}));
