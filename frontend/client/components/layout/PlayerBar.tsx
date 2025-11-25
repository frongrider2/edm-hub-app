import { motion, AnimatePresence } from "framer-motion";
import { SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import {
  selectCurrentSongId,
  selectIsPlaying,
  setCurrentSong,
  togglePlay,
} from "@/states/player/playerSlice";
import { PlayButton } from "@/components/track/PlayButton";
import { formatDuration } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { TrackResponseItem } from "@/apis/types/response.type";
import { useAuthApi } from "@/hooks/use-api";

/**
 * Helper for determining animation direction on song change.
 */
function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function PlayerBar(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const currentSongId = useAppSelector(selectCurrentSongId);
  const isPlaying = useAppSelector(selectIsPlaying);
  const [currentSong, setCurrentSong] = useState<TrackResponseItem | null>(
    null,
  );

  // Track previous song id to infer direction
  const prevSongId = usePrevious(currentSongId);

  useEffect(() => {
    if (!currentSongId) {
      setCurrentSong(null);
      return;
    }
    let isMounted = true;
    const fetchSong = async () => {
      const api = useAuthApi();
      const response = await api.track.getTrackById(currentSongId);
      if (isMounted && response.isSuccess) {
        setCurrentSong(response.data);
      }
    };
    fetchSong();
    return () => {
      isMounted = false;
    };
  }, [currentSongId]);

  // Simple direction logic: forward = new song, backward = previous in playlist?
  // Here, new id different or not is enough: up if new, down if repeated
  // You can adapt direction detection depending on your song order logic
  const getAnimationDirection = () => {
    // No previous, treat as up
    if (!prevSongId || !currentSongId) return "up";
    if (prevSongId === currentSongId) return "up";
    // could compare order in a tracklist for real up/down
    // Default: "up" if changing song
    // Alternate directions for demonstration
    return "down";
  };

  const direction = getAnimationDirection();

  const motionVariants = {
    initial: (direction: string) =>
      direction === "up"
        ? { opacity: 0, y: 40, scale: 0.97 }
        : { opacity: 0, y: -40, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: (direction: string) =>
      direction === "up"
        ? { opacity: 0, y: -40, scale: 0.97 }
        : { opacity: 0, y: 40, scale: 0.97 },
  };

  const handlePlayPause = () => {};
  const handleNext = () => {};
  const handlePrev = () => {};

  return (
    <div className="fixed z-50 max-w-6xl right-8 md:bottom-8 bottom-[5.4rem] transition-opacity duration-300">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto"
      >
        <AnimatePresence mode="wait" initial={false}>
          {currentSong && (
            <motion.iframe
              key={currentSong.id}
              custom={direction}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={motionVariants}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              style={{
                borderRadius: "12px",
                width: "100%",
                height: "152px",
                backdropFilter: "blur(8px)",
              }}
              src={`https://open.spotify.com/embed/track/${currentSong.id}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default PlayerBar;
