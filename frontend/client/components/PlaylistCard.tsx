import React from "react";
import { motion } from "framer-motion";
import { Play, MoreVertical } from "lucide-react";
import type { Playlist, Song } from "@shared/types";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: Playlist;
  songs: Song[];
  onPlay: (playlist: Playlist) => void;
  onDelete?: (playlistId: string) => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  songs,
  onPlay,
  onDelete,
}) => {
  const playlistSongs = songs.filter((song) =>
    playlist.songs.includes(song.id),
  );
  const firstSongCover = playlistSongs[0]?.cover;

  // Create a gradient background using the playlist data
  const gradientColors = [
    "from-purple-500 to-blue-500",
    "from-pink-500 to-red-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-yellow-500",
    "from-indigo-500 to-purple-500",
  ];
  const gradientColor =
    gradientColors[playlist.songs.length % gradientColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
    >
      <div className="relative mb-4 rounded-lg overflow-hidden bg-card/30 backdrop-blur border border-border/30 aspect-square">
        {firstSongCover ? (
          <img
            src={firstSongCover}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn("w-full h-full bg-gradient-to-br", gradientColor)}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm line-clamp-2">
              {playlist.name}
            </h4>
            <p className="text-xs text-gray-300 mt-1">
              {playlistSongs.length} song{playlistSongs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay(playlist);
            }}
            className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg ml-2"
            title="Play playlist"
          >
            <Play className="w-5 h-5 fill-current" />
          </motion.button>
        </div>

        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete playlist "${playlist.name}"?`)) {
                onDelete(playlist.id);
              }
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete playlist"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-foreground line-clamp-1 text-sm">
          {playlist.name}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          {playlistSongs.length} song{playlistSongs.length !== 1 ? "s" : ""}
        </p>
        {playlist.description && (
          <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-1">
            {playlist.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};
