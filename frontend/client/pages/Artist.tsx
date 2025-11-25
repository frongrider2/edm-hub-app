import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants } from "@/utils/motion";
import {
  ArtistResponseItem,
  TrackResponseItem,
} from "@/apis/types/response.type";
import { useAuthApi } from "@/hooks/use-api";
import { Loader } from "lucide-react";
import { TrackList } from "@/components/track/TrackList";

export const GenreBadge = ({ genre }: { genre: string }) => {
  return <span className="neon-chip text-[11px]">#{genre}</span>;
};

function Artist(): JSX.Element {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<ArtistResponseItem | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      try {
        const api = useAuthApi();
        const response = await api.artist.getArtistById(artistId);
        if (response.isSuccess) {
          setArtist(response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    if (artistId) {
      fetchArtist();
    } else {
      navigate("/discover");
    }
  }, [artistId, navigate]);

  const artistName = artist?.name ?? "Unknown Artist";
  const coverUrl = artist?.images[0].url!;

  const [tracksList, setTracksList] = useState<TrackResponseItem[]>([]);
  const [hasTracksNext, setHasTracksNext] = useState(false);

  const fetchTracks = async () => {
    const api = useAuthApi();
    const response = await api.track.getTracksByArtistId(artistId, 40, 1);
    if (response.isSuccess) {
      setTracksList(response.data.items);
      setHasTracksNext(response.data.hasNext);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-neon-primary border-t-transparent" />
          <Loader className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-3xl bg-gradient-to-tr from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] p-0.5 shadow-neon-sm">
                <div className="h-full w-full overflow-hidden rounded-[1.25rem] bg-black/60">
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt={artistName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {artistName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {artist?.genres.slice(0, 4).map((genre) => (
                    <GenreBadge key={genre.slug} genre={genre.name} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <TrackList tracksList={tracksList} hasNext={hasTracksNext} />
        </div>
      )}
    </motion.div>
  );
}

export default Artist;
