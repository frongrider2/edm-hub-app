import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListMusic, Plus, ChevronLeft, Trash2, X } from "lucide-react";
import { PlaylistCard } from "@/components/PlaylistCard";
import { SongCard } from "@/components/SongCard";
import { useApp, useAppDispatch } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { Playlist } from "@shared/types";

const Playlists: React.FC = () => {
  const { playlists, songs, currentPlayingSong } = useApp();
  const dispatch = useAppDispatch();

  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistForm, setNewPlaylistForm] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPlaylistForm.name.trim()) {
      setError("Playlist name is required");
      return;
    }

    dispatch({
      type: "CREATE_PLAYLIST",
      payload: {
        name: newPlaylistForm.name,
        description: newPlaylistForm.description,
        songs: [],
        created: new Date(),
      },
    });

    setNewPlaylistForm({ name: "", description: "" });
    setIsCreating(false);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    dispatch({ type: "DELETE_PLAYLIST", payload: playlistId });
    setSelectedPlaylist(null);
  };

  const handlePlaySong = (id: string) => {
    dispatch({ type: "SET_CURRENT_SONG", payload: id });
  };

  const handleRemoveSongFromPlaylist = (playlistId: string, songId: string) => {
    dispatch({
      type: "REMOVE_SONG_FROM_PLAYLIST",
      payload: { playlistId, songId },
    });
  };

  const currentPlaylist = selectedPlaylist
    ? playlists.find((p) => p.id === selectedPlaylist)
    : null;
  const playlistSongs = currentPlaylist
    ? songs.filter((s) => currentPlaylist.songs.includes(s.id))
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (selectedPlaylist && currentPlaylist) {
    return (
      <div className="md:pl-64 pb-32 md:pb-24 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPlaylist(null)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Playlists
          </motion.button>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30 border border-border/30 flex-shrink-0 flex items-center justify-center">
                {playlistSongs[0]?.cover ? (
                  <img
                    src={playlistSongs[0].cover}
                    alt={currentPlaylist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ListMusic className="w-16 h-16 text-muted-foreground/30" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  PLAYLIST
                </p>
                <h1 className="text-4xl font-bold text-foreground mb-3">
                  {currentPlaylist.name}
                </h1>
                {currentPlaylist.description && (
                  <p className="text-muted-foreground mb-4">
                    {currentPlaylist.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {playlistSongs.length} song
                  {playlistSongs.length !== 1 ? "s" : ""}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeletePlaylist(currentPlaylist.id)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Playlist
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {playlistSongs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <ListMusic className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No songs in this playlist yet
                </p>
              </motion.div>
            ) : (
              playlistSongs.map((song) => (
                <motion.div
                  key={song.id}
                  variants={itemVariants}
                  className="group flex items-center gap-4 p-4 rounded-lg bg-card/30 backdrop-blur border border-border/30 hover:bg-card/50 transition-colors"
                >
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handlePlaySong(song.id)}
                  >
                    <h4 className="font-semibold text-foreground truncate">
                      {song.title}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(song.duration / 60)}:
                    {String(song.duration % 60).padStart(2, "0")}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleRemoveSongFromPlaylist(currentPlaylist.id, song.id)
                    }
                    className="p-2 rounded-full opacity-0 group-hover:opacity-100 bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors"
                    title="Remove from playlist"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:pl-64 pb-32 md:pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <ListMusic className="w-8 h-8 text-primary" />
              Your Playlists
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              New Playlist
            </motion.button>
          </div>
        </motion.div>

        {playlists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ListMusic className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-6">
              No playlists yet
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Your First Playlist
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                variants={itemVariants}
                onClick={() => setSelectedPlaylist(playlist.id)}
              >
                <PlaylistCard
                  playlist={playlist}
                  songs={songs}
                  onPlay={() => setSelectedPlaylist(playlist.id)}
                  onDelete={handleDeletePlaylist}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCreating(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border/30 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Create New Playlist
              </h3>

              <form onSubmit={handleCreatePlaylist} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <label
                    htmlFor="playlistName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Playlist Name
                  </label>
                  <input
                    id="playlistName"
                    type="text"
                    value={newPlaylistForm.name}
                    onChange={(e) =>
                      setNewPlaylistForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="My Awesome Playlist"
                    className="w-full px-4 py-3 bg-secondary/30 border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="playlistDescription"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="playlistDescription"
                    value={newPlaylistForm.description}
                    onChange={(e) =>
                      setNewPlaylistForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add a description for your playlist..."
                    rows={3}
                    className="w-full px-4 py-3 bg-secondary/30 border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-3 rounded-lg border border-border/30 text-foreground hover:bg-secondary/20 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-medium"
                  >
                    Create
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Playlists;
