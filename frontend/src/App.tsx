import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth_callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react";
import MainLayout from "./pages/layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";

import { useSocketStore } from "./stores/useSocketStore";
import { useEffect } from "react";

function App() {
  const { connect } = useSocketStore();
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      const token = await getToken();
      if (token) connect(token);
    })();
  }, [connect, getToken, isLoaded]);

  return (
    <>
      <Routes>
        <Route
          path="/sso_callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth_callback"}
            />
          }
        />
        <Route path="/auth_callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
