import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Songs from "@/pages/Songs";
import Playlists from "@/pages/Playlists";
import PlaylistDetail from "@/pages/PlaylistDetail";
import Artist from "@/pages/Artist";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import GoogleCallback from "@/pages/GoogleCallback";

function AppRoutes(): JSX.Element {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/discover" replace />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google" element={<GoogleCallback />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/discover" element={<Songs />} />
        <Route path="/artists/:artistId" element={<Artist />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
