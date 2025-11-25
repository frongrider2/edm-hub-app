import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Authentication section for the sidebar
 * Shows login/register buttons when logged out
 * Shows user info and logout when logged in
 */
export function SidebarAuth(): JSX.Element {
  const { isLogin, user } = useAuth();
  const { logout } = useLogout();

  if (isLogin) {
    return (
      <div className="hidden w-full flex-col gap-2 md:flex">
        <Link to="/profile">
          <div className="flex cursor-pointer hover:bg-white/10 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.picture || "/images/profile.jpg"} />
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="truncate text-xs font-medium text-foreground">
                {user.name}
              </p>
              <p className="text-[11px] text-muted-foreground capitalize">
                {user.email}
              </p>
            </div>
          </div>
        </Link>

        <button
          onClick={logout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/5 px-3 py-2 text-[11px] font-medium text-muted-foreground transition hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
        >
          <LogOut className="h-3 w-3" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="hidden w-full flex-col gap-2 md:flex">
      <NavLink
        to="/login"
        className="neon-button-primary w-full justify-center text-xs text-center"
      >
        Login
      </NavLink>
      <NavLink
        to="/register"
        className="mt-1 inline-flex w-full items-center justify-center rounded-full border border-white/14 bg-white/5 px-3 py-2 text-[11px] font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
      >
        Create account
      </NavLink>
      <p className="text-[11px] text-muted-foreground/70">
        Access your EDM playlists by logging in or creating an account.
      </p>
    </div>
  );
}
