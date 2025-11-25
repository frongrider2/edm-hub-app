import { motion } from "framer-motion";
import { staggerItem } from "@/utils/motion";
import { TrackResponseItem } from "@/apis/types/response.type";
import { formatDuration } from "@/lib/utils";
import { AddButton } from "@/components/track/AddButton";
import { useModal } from "@/states/modal/hooks";
import { useAuth } from "@/hooks/use-auth";
import { DeleteButton } from "@/components/track/DeleteButton";

interface RowTrackProps {
  track: TrackResponseItem;
  onPlay: () => void;
  isCanDelete?: boolean;
  onDeleteTrack?: (trackId: string) => void;
}

/**
 * Row track component for list/table view
 * Displays track name, artist, and duration in a compact row format
 * AddButton only visible on hover
 */
function RowTrack({
  track,
  onPlay,
  isCanDelete,
  onDeleteTrack,
}: RowTrackProps): JSX.Element {
  const { user, isLogin } = useAuth();
  const coverUrl = () => {
    const album = track.albumRef.images[0].url;
    if (album) {
      return album;
    }
    return track.artistRefs[0].images[0].url;
  };

  const { openModal } = useModal();

  const handleAddToPlaylist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    openModal({ id: "add-playlist", payload: { trackId: track._id } });
  };

  const handleDeleteTrack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDeleteTrack) {
      onDeleteTrack(track._id);
    }
  };

  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={onPlay}
      // "group" is added here for group-hover
      className="group relative flex w-full items-center justify-between gap-3 bg-white/0 px-3 py-2 text-left text-[11px] text-muted-foreground transition hover:bg-white/5"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex gap-2 items-center">
        <div className="relative bg-black">
          {coverUrl() && (
            <img
              src={coverUrl()}
              alt={track.name}
              className="h-6 w-6 object-contain md:h-6 md:w-6"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-col max-w-[60%] md:max-w-full">
          <span className="truncate text-foreground">{track.name}</span>
          <span className="truncate text-[11px] text-muted-foreground">
            {track.artists[0].name}
          </span>
        </div>
      </div>
      <span className="absolute right-2 shrink-0 bg-white/5 mr-8 px-2 py-0.5 text-[10px] text-muted-foreground/80">
        {formatDuration(track.duration_ms)}
      </span>

      {/* Show AddButton only on hover */}
      {isLogin && !isCanDelete && (
        <div className="absolute right-2 self-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <AddButton
            isPlaying={false}
            onClick={handleAddToPlaylist}
            size="sm"
            variant="secondary"
          />
        </div>
      )}

      {isLogin && isCanDelete && (
        <div className="absolute right-2 self-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <DeleteButton
            isPlaying={false}
            onClick={handleDeleteTrack}
            size="sm"
            variant="secondary"
          />
        </div>
      )}
    </motion.button>
  );
}

export default RowTrack;
