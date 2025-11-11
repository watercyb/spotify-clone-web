import type { Socket } from "socket.io-client";

export interface UseSocketStore {
  socket: Socket | null;

  connect: (token: string) => Promise<void>;
}
