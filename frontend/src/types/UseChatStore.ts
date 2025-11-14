import type { Song } from "./Song";
import type { Socket } from "socket.io-client";
import type { Message } from "./Message";
import type { User } from "./User";

export interface UseChatStore {
  isLoadingUser: boolean;
  isLoadingMessage: boolean;
  socket: Socket | null;
  user: User | null;
  selectedUser: User | null;
  users: User[];
  onlineUsers: Set<string>;
  userActivities: Map<string, Song | null>;
  messages: Message[];

  setSelectedUser: (selectedUser: User) => void;
  connect: (token: string) => Promise<void>;
  getUsers: () => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  getMessages: (receiverId: string) => Promise<void>;
  updateActivity: (song: Song | null) => void;
}
