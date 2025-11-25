import { motion } from "framer-motion";
import { pageVariants } from "@/utils/motion";
import PlaylistCard from "@/components/PlaylistCard";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "@/states/modal/hooks";
import { useEffect, useState } from "react";
import { useAuthApi } from "@/hooks/use-api";
import { PlaylistResponseItem } from "@/apis/types/response.type";
import { Plus } from "lucide-react";
import { increment, useCounter } from "@/states/counter/counterSlice";
import { useAuth } from "@/hooks/use-auth";
import { showSuccess } from "@/utils/toast";
import { useAppDispatch } from "@/states/hooks";

function Playlists(): JSX.Element {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleCreatePlaylist = () => {
    openModal({ id: "create-playlist" });
  };

  const [playlistsList, setPlaylistsList] = useState<PlaylistResponseItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const counter = useCounter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const api = useAuthApi();
      const response = await api.playlist.getUserPlaylists(10, 1);
      if (response.isSuccess) {
        setPlaylistsList(response.data.items);
        setHasNext(response.data.hasNext);
      }
    };
    fetchPlaylists();
  }, [counter]);

  const onDeleteTrack = async (playlistId: string) => {
    const api = useAuthApi();
    const response = await api.playlist.deletePlaylist(playlistId);
    if (response.isSuccess) {
      showSuccess("Playlist deleted");
      dispatch(increment());
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Playlists</h2>
          <p className="text-xs text-muted-foreground">
            Curated collections powered by your favorite tracks.
          </p>
        </div>
        {/* <button
          onClick={handleCreatePlaylist}
          type="button"
          className="neon-button-primary text-xs"
        >
          + New playlist
        </button> */}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <div
          onClick={handleCreatePlaylist}
          className="cursor-pointer hover:text-primary hover:border-primary transition-all duration-300 col-span-1 flex flex-col gap-2 w-full h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/40 px-4 py-6 text-xs text-muted-foreground"
        >
          <Plus className="w-12 h-12" />
          <span>Add Playlist</span>
        </div>
        {playlistsList.map((playlist) => (
          <Link
            to={`/playlists/${playlist.slug}`}
            className="text-left"
            key={playlist.slug}
          >
            <PlaylistCard
              playlist={playlist}
              isCanDelete={true}
              onDeleteTrack={onDeleteTrack}
            />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default Playlists;
