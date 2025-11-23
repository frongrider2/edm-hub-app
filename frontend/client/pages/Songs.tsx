import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Music,
  ListMusic,
  Columns3,
  Play,
  Plus,
  Heart,
} from "lucide-react";
import { SongCard } from "@/components/SongCard";
import { PopularPlaylistsSlider } from "@/components/PopularPlaylistsSlider";
import { useApp, useAppDispatch } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { Song } from "@shared/types";

type FilterType = "all" | "popular" | "recent";
type LayoutType = "grid" | "list" | "table";

const Songs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const { songs, playlists, currentPlayingSong } = useApp();
  const dispatch = useAppDispatch();

  const filteredSongs = useMemo(() => {
    let result = songs;

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(lowerSearch) ||
          song.artist.toLowerCase().includes(lowerSearch),
      );
    }

    // Apply category filter
    if (filter === "popular") {
      result = result.slice(0, Math.ceil(result.length * 0.6));
    } else if (filter === "recent") {
      result = result.slice(-Math.ceil(result.length * 0.4));
    }

    return result;
  }, [searchTerm, filter, songs]);

  const handlePlaySong = (song: Song) => {
    dispatch({ type: "SET_CURRENT_SONG", payload: song.id });
  };

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setIsAddingToPlaylist(true);
  };

  const handleConfirmAddToPlaylist = (playlistId: string) => {
    if (selectedSong) {
      dispatch({
        type: "ADD_SONG_TO_PLAYLIST",
        payload: { playlistId, songId: selectedSong.id },
      });
      setIsAddingToPlaylist(false);
      setSelectedSong(null);
    }
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All Songs" },
    { value: "popular", label: "Popular" },
    { value: "recent", label: "Recent" },
  ];

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

  return (
    <div className="md:pl-64 pb-32 md:pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Music className="w-8 h-8 text-primary" />
            Discover Songs
          </h1>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search songs, artists…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card/30 backdrop-blur border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {filters.map(({ value, label }) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm",
                    filter === value
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary/30 hover:bg-secondary/50 text-foreground border border-border/30",
                  )}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (layout === "grid") setLayout("list");
                  else if (layout === "list") setLayout("table");
                  else setLayout("grid");
                }}
                className="p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 text-foreground border border-border/30 transition-all"
                title="Cycle through view modes"
              >
                {layout === "grid" ? (
                  <Music className="w-5 h-5" />
                ) : layout === "list" ? (
                  <ListMusic className="w-5 h-5" />
                ) : (
                  <Columns3 className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {layout === "table" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Cover
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Title
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Artist
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Duration
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song) => (
                  <motion.tr
                    key={song.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                    className="border-b border-border/20 hover:bg-card/30 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-foreground truncate">
                        {song.title}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-muted-foreground truncate">
                        {song.artist}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-muted-foreground">
                        {Math.floor(song.duration / 60)}:
                        {String(song.duration % 60).padStart(2, "0")}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePlaySong(song)}
                          className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          title="Play"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToPlaylist(song)}
                          className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                          title="Add to playlist"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              layout === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-3",
            )}
          >
            {filteredSongs.map((song) => (
              <motion.div key={song.id} variants={itemVariants}>
                <SongCard
                  song={song}
                  onPlay={handlePlaySong}
                  onAddToPlaylist={handleAddToPlaylist}
                  isPlaying={currentPlayingSong === song.id}
                  layout={layout}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredSongs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Music className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              No songs found matching your search
            </p>
          </motion.div>
        )}
      </div>

      {/* Add to Playlist Modal */}
      {isAddingToPlaylist && selectedSong && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAddingToPlaylist(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border/30 rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">
              Add "{selectedSong.title}" to Playlist
            </h3>

            {playlists.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No playlists yet. Create one to add songs!
              </p>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <motion.button
                    key={playlist.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConfirmAddToPlaylist(playlist.id)}
                    className="w-full text-left p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 text-foreground transition-colors"
                  >
                    <p className="font-semibold">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {playlist.songs.length} songs
                    </p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Songs;
