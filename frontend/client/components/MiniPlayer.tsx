import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useApp, useAppDispatch } from "@/context/AppContext";

export const MiniPlayer: React.FC = () => {
  const { currentPlayingSong, songs } = useApp();
  const dispatch = useAppDispatch();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!currentPlayingSong) {
    return null;
  }

  const song = songs.find((s) => s.id === currentPlayingSong);
  if (!song) return null;

  const handlePrevious = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentPlayingSong);
    if (currentIndex > 0) {
      dispatch({
        type: "SET_CURRENT_SONG",
        payload: songs[currentIndex - 1].id,
      });
    }
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentPlayingSong);
    if (currentIndex < songs.length - 1) {
      dispatch({
        type: "SET_CURRENT_SONG",
        payload: songs[currentIndex + 1].id,
      });
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 md:bottom-0 md:left-64 border-t border-border bg-card/95 backdrop-blur md:mb-0 mb-20 z-30"
    >
      <div className="max-w-full px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={song.cover}
              alt={song.title}
              className="w-12 h-12 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {song.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {song.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors text-foreground"
              title="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-primary text-primary-foreground transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors text-foreground"
              title="Next"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>

            <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden hidden sm:block">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "30%" }}
                className="h-full bg-primary"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors text-foreground hidden sm:flex"
              title="Volume"
            >
              <Volume2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
