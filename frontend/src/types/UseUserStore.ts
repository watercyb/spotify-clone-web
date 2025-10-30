import type { User } from "./User";

export interface UseUserStore {
  users: User[];
  isLoadingUsers: boolean;
  getUsers: () => Promise<void>;
}
