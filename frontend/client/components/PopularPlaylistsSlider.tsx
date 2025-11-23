import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlaylistCard } from "@/components/PlaylistCard";
import type { Playlist, Song } from "@shared/types";
import { cn } from "@/lib/utils";

interface PopularPlaylistsSliderProps {
  playlists: Playlist[];
  songs: Song[];
  onPlaylistClick: (playlist: Playlist) => void;
}

export const PopularPlaylistsSlider: React.FC<PopularPlaylistsSliderProps> = ({
  playlists,
  songs,
  onPlaylistClick,
}) => {
  const [scrollPos, setScrollPos] = useState(0);
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const popularPlaylists = playlists.slice(0, 6);

  if (popularPlaylists.length === 0) {
    return null;
  }

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainer.current) return;

    const { scrollLeft, clientWidth } = scrollContainer.current;
    const cardWidth = 220; // Approximate card width with gap
    const newPosition =
      direction === "left"
        ? scrollLeft - cardWidth * 2
        : scrollLeft + cardWidth * 2;

    scrollContainer.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPos(newPosition);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Popular Playlists
        </h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleScroll("left")}
            className="p-2 rounded-full bg-secondary/30 hover:bg-secondary/50 text-foreground border border-border/30 transition-all"
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleScroll("right")}
            className="p-2 rounded-full bg-secondary/30 hover:bg-secondary/50 text-foreground border border-border/30 transition-all"
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div
        ref={scrollContainer}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {popularPlaylists.map((playlist) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-shrink-0 w-56 snap-start cursor-pointer"
            onClick={() => onPlaylistClick(playlist)}
          >
            <PlaylistCard
              playlist={playlist}
              songs={songs}
              onPlay={() => onPlaylistClick(playlist)}
            />
          </motion.div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};
