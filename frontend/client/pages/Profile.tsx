import { motion } from "framer-motion";
import { pageVariants } from "@/utils/motion";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { LogOut, Mail, User as UserIcon, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Profile(): JSX.Element {
  const { user } = useAuth();
  const { logout } = useLogout();

  if (!user) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex h-96 items-center justify-center"
      >
        <p className="text-sm text-muted-foreground">
          Please login to view your profile
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 border-2 border-white/20">
          <AvatarImage src={user.picture} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-tr from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-cyan))] text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase() ||
              user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Info Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))]">
            <UserIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{user.name || "Not set"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-blue))]">
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-purple))]">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Member since</p>
            <p className="text-sm font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:border-red-500/50"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </motion.div>
  );
}

export default Profile;
