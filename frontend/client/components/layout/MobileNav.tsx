import { Home, ListMusic, ScanFace } from "lucide-react";
import { MobileNavItem } from "./MobileNavItem";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const items = [
  { to: "/discover", label: "Discover", icon: <Home className="w-4 h-4" /> },
  // { to: "/playlists", label: "Playlists", icon: ListMusic },
  // { to: "/profile", label: "Profile", icon: User },
];

function MobileNav(): JSX.Element {
  const { isLogin, user } = useAuth();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 block bg-gradient-to-t from-black/90 via-black/80 to-black/70 pb-4 pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-6">
        {items.map((item) => (
          <MobileNavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
          />
        ))}

        {isLogin && (
          <MobileNavItem
            to="/playlists"
            label="Playlists"
            icon={<ListMusic className="w-4 h-4" />}
          />
        )}

        {isLogin && (
          <MobileNavItem
            to="/profile"
            label=""
            icon={
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.picture || "/images/profile.jpg"} />
              </Avatar>
            }
          />
        )}

        {!isLogin && (
          <MobileNavItem
            to="/login"
            label="Login"
            icon={<ScanFace className="w-4 h-4" />}
          />
        )}
      </div>
    </nav>
  );
}

export default MobileNav;
