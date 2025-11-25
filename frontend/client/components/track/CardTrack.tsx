import { motion } from "framer-motion";
import { staggerItem } from "@/utils/motion";
import { TrackResponseItem } from "@/apis/types/response.type";
import { PlayButton } from "@/components/track/PlayButton";
import { AddButton } from "@/components/track/AddButton";
import { useModal } from "@/states/modal/hooks";
import { useAuth } from "@/hooks/use-auth";
import { DeleteButton } from "@/components/track/DeleteButton";

interface CardSongProps {
  track: TrackResponseItem;
  onPlay: () => void;
  onAddToPlaylist: () => void;
  isCanDelete?: boolean;
  onDeleteTrack?: (trackId: string) => void;
}

function CardTrack({
  track,
  onPlay,
  onAddToPlaylist,
  isCanDelete,
  onDeleteTrack,
}: CardSongProps): JSX.Element {
  const { user, isLogin } = useAuth();
  const coverUrl = () => {
    const album = track.albumRef.images[0].url;
    if (album) {
      return album;
    }
    return track.artistRefs[0].images[0].url;
  };
  const { openModal } = useModal();

  const handleDeleteTrack = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDeleteTrack) {
      onDeleteTrack(track._id);
    }
  };

  return (
    <motion.article
      onClick={onPlay}
      variants={staggerItem}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white/5 py-2 px-3 md:shadow-[0_16px_40px_rgba(0,0,0,0.75)] transition-colors hover:bg-white/10"
    >
      <div className="relative overflow-hidden">
        <div className="mb-4">
          {coverUrl() && (
            <img
              src={coverUrl()}
              alt={track.name}
              className="md:h-auth w-full object-contain h-18 rounded-md"
            />
          )}
        </div>
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" /> */}
        <div className="pointer-events-none inset-x-3 bottom-3 flex items-center justify-between">
          <div className="text-left">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
              {track.albumRef.name ?? "Single"}
            </p> */}
            <p className="text-[11px] text-muted-foreground mb-1">
              {track.artists[0].name}
            </p>
            <p className="text-sm font-semibold leading-tight text-foreground">
              {track.name}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100 self-center top-[20%]">
        <PlayButton
          isPlaying={false}
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          size="md"
          variant="primary"
        />
      </div>

      {isLogin && !isCanDelete && (
        <div className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100 self-center bottom-2 right-2">
          <AddButton
            isPlaying={false}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openModal({
                id: "add-playlist",
                payload: { trackId: track._id },
              });
            }}
            size="sm"
            variant="secondary"
          />
        </div>
      )}

      {isLogin && isCanDelete && (
        <div className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100 self-center bottom-2 right-2">
          <DeleteButton
            isPlaying={false}
            onClick={handleDeleteTrack}
            size="sm"
            variant="secondary"
          />
        </div>
      )}
    </motion.article>
  );
}

export default CardTrack;
