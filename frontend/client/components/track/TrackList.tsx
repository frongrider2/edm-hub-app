import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LayoutGrid, ListMusic as ListViewIcon } from "lucide-react";
import { staggerContainer } from "@/utils/motion";
import { TrackResponseItem } from "@/apis/types/response.type";
import CardTrack from "@/components/track/CardTrack";
import RowTrack from "@/components/track/RowTrack";
import { useAppDispatch } from "@/states/hooks";
import { setCurrentSong } from "@/states/player/playerSlice";

const VIEWMODE_LS_KEY = "trackListViewMode";

interface TrackListProps {
  tracksList: TrackResponseItem[];
  hasNext: boolean;
  isCanDelete?: boolean;
  onDeleteTrack?: (trackId: string) => void;
}

export const TrackList = ({
  tracksList,
  hasNext,
  isCanDelete,
  onDeleteTrack,
}: TrackListProps) => {
  // Read from localStorage safely (SSR + first render guard)
  const getInitialViewMode = (): "grid" | "table" => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(VIEWMODE_LS_KEY);
      if (stored === "grid" || stored === "table") return stored;
    }
    return "grid";
  };

  const [viewMode, setViewModeState] = useState<"grid" | "table">(
    getInitialViewMode,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEWMODE_LS_KEY, viewMode);
    }
  }, [viewMode]);

  const dispatch = useAppDispatch();

  const onPlay = (track: TrackResponseItem) => {
    dispatch(setCurrentSong(track._id));
  };

  // Wrap the setter so localStorage and state always in sync
  const setViewMode = (mode: "grid" | "table") => {
    setViewModeState(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEWMODE_LS_KEY, mode);
    }
  };

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Songs
          </h2>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition",
                viewMode === "grid"
                  ? "bg-[hsl(var(--neon-purple))/30] text-[hsl(var(--neon-cyan))]"
                  : "text-muted-foreground",
              )}
              aria-label="Card view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition",
                viewMode === "table"
                  ? "bg-[hsl(var(--neon-purple))/30] text-[hsl(var(--neon-cyan))]"
                  : "text-muted-foreground",
              )}
              aria-label="Table view"
            >
              <ListViewIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3  min-h-[20rem]">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          {viewMode === "grid" && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            >
              {tracksList.map((track) => (
                <CardTrack
                  key={track.id}
                  track={track}
                  onPlay={() => {
                    onPlay(track);
                  }}
                  onAddToPlaylist={() => {}}
                  isCanDelete={isCanDelete}
                  onDeleteTrack={onDeleteTrack}
                />
              ))}
              {tracksList.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-black/40 px-4 py-8 text-center text-sm text-muted-foreground">
                  No songs match that vibe yet. Try a different search or
                  category.
                </div>
              )}
            </motion.div>
          )}

          {viewMode === "table" && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-1 rounded-2xl border border-white/10 bg-black/60 p-3 text-xs"
            >
              {tracksList.map((track) => (
                <RowTrack
                  key={track.id}
                  track={track}
                  onPlay={() => {
                    onPlay(track);
                  }}
                  isCanDelete={isCanDelete}
                  onDeleteTrack={onDeleteTrack}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>
    </>
  );
};
