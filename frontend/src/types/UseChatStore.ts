import type { Socket } from "socket.io-client";
import type { Message } from "./Message";

export interface UseChatStore {
  isLoading: boolean;
  socket: Socket | null;
  userId: string | null;
  users: string[];
  userActivities: Map<string, string>;
  messages: Message[];

  connect: (token: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  getAllMessages: (receiverId: string) => Promise<void>;
}
