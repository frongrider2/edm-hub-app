import React from "react";
import { motion } from "framer-motion";
import { Play, Plus, Heart } from "lucide-react";
import type { Song } from "@shared/types";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  onToggleLike?: (songId: string) => void;
  isPlaying?: boolean;
  isLiked?: boolean;
  layout?: "grid" | "list";
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onPlay,
  onAddToPlaylist,
  onToggleLike,
  isPlaying = false,
  isLiked = false,
  layout = "grid",
}) => {
  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ x: 4 }}
        className="flex items-center gap-4 p-4 rounded-lg bg-card/30 backdrop-blur border border-border/30 hover:bg-card/50 transition-colors group"
      >
        <img
          src={song.cover}
          alt={song.title}
          className="w-12 h-12 rounded-md object-cover"
        />
        <div className="flex-1 min-w-0">
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
        {onToggleLike && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(song.id);
            }}
            className={cn(
              "p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100",
              isLiked
                ? "bg-destructive/20 text-destructive"
                : "bg-secondary hover:bg-secondary/80 text-foreground",
            )}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPlay(song)}
          className={cn(
            "p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100",
            isPlaying
              ? "bg-primary text-primary-foreground"
              : "bg-primary text-primary-foreground",
          )}
          title="Play"
        >
          <Play className="w-4 h-4 fill-current" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToPlaylist(song)}
          className="p-2 rounded-full opacity-0 group-hover:opacity-100 bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          title="Add to playlist"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={() => onPlay(song)}
    >
      <div className="relative mb-4 rounded-lg overflow-hidden bg-card/30 backdrop-blur border border-border/30">
        <img
          src={song.cover}
          alt={song.title}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm line-clamp-1">
              {song.title}
            </h4>
            <p className="text-xs text-gray-300 line-clamp-1">{song.artist}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg ml-2"
            title="Play"
          >
            <Play className="w-5 h-5 fill-current" />
          </motion.button>
        </div>
        {onToggleLike && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(song.id);
            }}
            className={cn(
              "absolute top-2 left-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg",
              isLiked
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary/90 text-foreground hover:bg-secondary",
            )}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(song);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-primary/90 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          title="Add to playlist"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
      <div>
        <h4 className="font-semibold text-foreground line-clamp-1 text-sm">
          {song.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {song.artist}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {Math.floor(song.duration / 60)}:
          {String(song.duration % 60).padStart(2, "0")}
        </p>
      </div>
    </motion.div>
  );
};
