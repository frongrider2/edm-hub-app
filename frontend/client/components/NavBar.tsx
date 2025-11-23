import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Search, ListMusic, User, LogOut, Home } from "lucide-react";
import { useAppDispatch, useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/songs", label: "Songs", icon: Search },
    { path: "/playlists", label: "Playlists", icon: ListMusic },
    { path: "/profile", label: "Profile", icon: User },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-sidebar/80 backdrop-blur border-r border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/50 p-6 z-40">
        <Link to="/songs" className="flex items-center gap-2 mb-8 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="p-2 rounded-lg bg-primary text-primary-foreground"
          >
            <Music className="w-6 h-6" />
          </motion.div>
          <span className="text-xl font-bold text-sidebar-foreground">
            MusixHub
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                isActive(path)
                  ? "bg-sidebar-primary/30 text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20",
              )}
            >
              {isActive(path) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-sidebar-primary/20 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur border-t border-border bg-gradient-to-t from-card to-card/50 z-40">
        <div className="flex items-center justify-around h-full px-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors relative group",
                isActive(path) ? "text-primary" : "text-muted-foreground",
              )}
            >
              {isActive(path) && (
                <motion.div
                  layoutId="activeMobileNav"
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform group-hover:scale-110",
                )}
              />
              <span className="text-xs mt-1 text-center truncate">{label}</span>
            </Link>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs mt-1">Logout</span>
          </motion.button>
        </div>
      </nav>
    </>
  );
};
