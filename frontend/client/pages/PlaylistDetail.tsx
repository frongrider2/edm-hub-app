import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants } from "@/utils/motion";
import {
  PlaylistResponseItem,
  TrackResponseItem,
} from "@/apis/types/response.type";
import { useAuthApi } from "@/hooks/use-api";
import { Loader, Music2 } from "lucide-react";
import { TrackList } from "@/components/track/TrackList";
import { useAuth } from "@/hooks/use-auth";
import { increment, useCounter } from "@/states/counter/counterSlice";
import { useAppDispatch } from "@/states/hooks";
import { showSuccess } from "@/utils/toast";

function PlaylistDetail(): JSX.Element {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [playlist, setPlaylist] = useState<PlaylistResponseItem | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const counter = useCounter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const api = useAuthApi();
        const response = await api.playlist.getPlaylistBySlug(playlistId!);
        if (response.isSuccess) {
          setPlaylist(response.data);
        } else {
          navigate(-1);
        }
      } finally {
        setLoading(false);
      }
    };
    if (playlistId) {
      fetchPlaylist();
    } else {
      navigate(-1);
    }
  }, [playlistId, navigate, counter]);

  const playlistName = playlist?.name ?? "Unknown Playlist";
  const coverUrl = playlist?.createdBy.picture;

  const [tracksList, setTracksList] = useState<TrackResponseItem[]>([]);
  const [hasTracksNext, setHasTracksNext] = useState(false);

  const { user } = useAuth();

  const isOwner = user?._id === playlist?.createdBy._id;

  const fetchTracks = async () => {
    if (!playlistId) return;
    const api = useAuthApi();
    const response = await api.track.getTracksByPlaylistId(playlistId, 40, 1);
    console.log({ response });
    if (response.isSuccess) {
      setTracksList(response.data.items);
      setHasTracksNext(response.data.hasNext);
    }
  };

  useEffect(() => {
    if (playlist) {
      fetchTracks();
    }
  }, [playlist]);

  const onDeleteTrack = async (trackId: string) => {
    if (!playlist) return;
    const api = useAuthApi();
    const response = await api.playlist.deleteTrackToPlaylist(
      playlist._id,
      trackId,
    );
    if (response.isSuccess) {
      showSuccess(`Track deleted from playlist ${playlistName}`);
      dispatch(increment());
    }
  };

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
          <Loader className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-3xl bg-gradient-to-tr from-[hsl(var(--neon-purple))] via-[hsl(var(--neon-pink))] to-[hsl(var(--neon-cyan))] p-0.5 shadow-neon-sm">
                <div className="h-full w-full overflow-hidden rounded-[1.25rem] bg-black/60">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={playlistName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Music2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Playlist
                </p>
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {playlistName}
                </h1>
                {playlist?.description && (
                  <p className="max-w-md text-xs text-muted-foreground">
                    {playlist.description}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  {playlist.tracks.length}{" "}
                  {playlist.tracks.length === 1 ? "track" : "tracks"}
                </p>
              </div>
            </div>
          </div>

          {tracksList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/40 px-4 py-12 text-center">
              <Music2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No tracks in this playlist yet
              </p>
              <p className="text-xs text-muted-foreground/70">
                Add some tracks from the Discover page
              </p>
            </div>
          ) : (
            <TrackList
              tracksList={tracksList}
              hasNext={hasTracksNext}
              isCanDelete={isOwner}
              onDeleteTrack={onDeleteTrack}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}

export default PlaylistDetail;
