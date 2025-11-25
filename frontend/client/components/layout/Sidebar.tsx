import { NavLink } from "react-router-dom";
import { Home, ListMusic, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarAuth } from "./SidebarAuth";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { to: "/discover", label: "Discover", icon: Home, isAuth: false },
  { to: "/playlists", label: "Playlists", icon: ListMusic, isAuth: true },
  // { to: "/profile", label: "Profile", icon: User, isAuth: true },
];

function Sidebar(): JSX.Element {
  const { isLogin } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (item.isAuth) {
      return isLogin;
    }
    return true;
  });

  return (
    <aside className="sidebar-glass neon-scrollbar flex w-full flex-row items-center justify-between gap-2 rounded-2xl p-3 md:h-full md:w-64 md:flex-col md:items-stretch md:justify-between md:py-6">
      <div className="flex w-full items-center justify-between gap-3 md:flex-col md:items-start">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="EDM-HUB" className="h-9 w-9 rounded-[0.5rem]" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              EDM
            </span>
            <span className="text-base font-semibold text-foreground">HUB</span>
          </div>
        </div>
        <div className="hidden text-xs font-medium text-muted-foreground/80 md:block">
          EDM-powered music hub
        </div>
      </div>

      <nav className="mt-0 flex w-full flex-1 items-center justify-start gap-2 md:mt-6 md:flex-col md:items-stretch">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex w-full items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 md:rounded-2xl",
                  isActive
                    ? "bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))] text-foreground shadow-neon-md"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                )
              }
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 group-hover:text-[hsl(var(--neon-cyan))]"
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <SidebarAuth />
    </aside>
  );
}

export default Sidebar;
