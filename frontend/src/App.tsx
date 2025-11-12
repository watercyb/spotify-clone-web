import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth_callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./pages/layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import ChatPage from "./pages/chat/ChatPage";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {

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
          <Route path='/chat' element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
