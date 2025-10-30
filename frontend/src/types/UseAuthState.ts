export default interface UseAuthState {
  isAdmin: boolean;
  checkIsAdmin: () => Promise<void>;
}
