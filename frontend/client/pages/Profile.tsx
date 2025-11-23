import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, ListMusic, Music, Edit2, Check, X } from "lucide-react";
import { useApp, useAppDispatch } from "@/context/AppContext";
import { PlaylistCard } from "@/components/PlaylistCard";
import { cn } from "@/lib/utils";

const Profile: React.FC = () => {
  const { user, playlists, songs } = useApp();
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user) {
    return null;
  }

  const handleSaveProfile = () => {
    dispatch({
      type: "UPDATE_USER",
      payload: {
        name: editForm.name,
        email: editForm.email,
      },
    });
    setIsEditing(false);
  };

  const userPlaylists = playlists.filter((p) => user.playlists.includes(p.id));
  const savedSongsCount = user.savedSongs.length;
  const playlistsCount = userPlaylists.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="md:pl-64 pb-32 md:pb-24 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Profile Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 border border-border/30 backdrop-blur">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-primary object-cover"
              />

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-secondary/30 border border-border/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-secondary/30 border border-border/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ name: user.name, email: user.email });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary/30 hover:bg-secondary/50 text-foreground rounded-lg font-medium transition-colors border border-border/30"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-foreground">
                      {user.name}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="bg-card/40 backdrop-blur border border-border/30 rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Total Playlists
                </p>
                <p className="text-4xl font-bold text-primary">
                  {playlistsCount}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="p-3 rounded-lg bg-primary/20 text-primary"
              >
                <ListMusic className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-card/40 backdrop-blur border border-border/30 rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Saved Songs
                </p>
                <p className="text-4xl font-bold text-primary">
                  {savedSongsCount}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="p-3 rounded-lg bg-primary/20 text-primary"
              >
                <Music className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Playlists */}
        {userPlaylists.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <ListMusic className="w-6 h-6 text-primary" />
              Your Playlists
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {userPlaylists.slice(0, 3).map((playlist) => (
                <motion.div key={playlist.id} variants={itemVariants}>
                  <PlaylistCard
                    playlist={playlist}
                    songs={songs}
                    onPlay={() => {}}
                  />
                </motion.div>
              ))}
            </motion.div>
            {userPlaylists.length > 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-muted-foreground mt-6"
              >
                +{userPlaylists.length - 3} more playlist
                {userPlaylists.length - 3 !== 1 ? "s" : ""}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
