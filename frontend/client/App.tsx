import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "@/context/AppContext";
import { NavBar } from "@/components/NavBar";
import { MiniPlayer } from "@/components/MiniPlayer";

// Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Songs from "@/pages/Songs";
import Playlists from "@/pages/Playlists";
import Profile from "@/pages/Profile";
import Index from "@/pages/Index";

// Route transition wrapper
function RouteTransition({ children }: { children: React.ReactNode }) {
  return children;
}

function AppContent() {
  const { user } = useApp();
  const location = useLocation();

  // If user is not logged in, show auth pages or landing
  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  // If user is logged in, show main app with navigation
  return (
    <>
      <NavBar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/songs" element={<Songs />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/songs" replace />} />
          <Route path="/login" element={<Navigate to="/songs" replace />} />
          <Route path="/register" element={<Navigate to="/songs" replace />} />
          <Route path="*" element={<Navigate to="/songs" replace />} />
        </Routes>
      </AnimatePresence>
      <MiniPlayer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
