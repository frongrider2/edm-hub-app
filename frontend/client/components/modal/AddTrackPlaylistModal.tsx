import { PlaylistResponseItem } from "@/apis/types/response.type";
import { useAuthApi } from "@/hooks/use-api";
import { useEffect, useState } from "react";
import { useModal } from "@/states/modal/hooks";
import { Music2, Plus, Star } from "lucide-react";
import { showSuccess, showError, showInfo } from "@/utils/toast";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/utils/motion";
import { useAppDispatch } from "@/states/hooks";
import { increment } from "@/states/counter/counterSlice";

export default function AddTrackPlaylistModal(): JSX.Element {
  const [playlistsList, setPlaylistsList] = useState<PlaylistResponseItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { closeModal, openModal, modalState } = useModal();
  const dispatch = useAppDispatch();

  // Get track ID from modal payload
  const trackId = (modalState["add-playlist_payload"] as any)?.trackId as
    | string
    | undefined;

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    const api = useAuthApi();
    const response = await api.playlist.getUserPlaylists(20, 1);
    if (response.isSuccess) {
      setPlaylistsList(response.data.items);
    } else {
      showError("Failed to load playlists");
    }
    setLoading(false);
  };

  const handleAddToPlaylist = async (
    playlistId: string,
    playlistName: string,
  ) => {
    if (!trackId) {
      showError("No track selected");
      return;
    }

    const api = useAuthApi();
    const response = await api.playlist.addTrackToPlaylist(playlistId, trackId);

    if (response.isSuccess) {
      showSuccess(`Added to ${playlistName}`);
      dispatch(increment());
      closeModal("add-playlist");
    } else {
      showError(response.message || "Failed to add track");
    }
  };

  const handleCreateNewPlaylist = () => {
    closeModal("add-playlist");
    openModal({ id: "create-playlist" });
  };

  return (
    <div className="space-y-4">
      {/* Playlist List */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-h-[400px] space-y-2 overflow-y-auto pr-2"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--neon-purple))] border-t-transparent" />
          </div>
        ) : playlistsList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
            <Music2 className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">No playlists yet</p>
            <p className="text-xs text-gray-500">
              Create your first playlist below
            </p>
          </div>
        ) : (
          playlistsList.map((playlist) => (
            <motion.button
              key={playlist._id}
              variants={staggerItem}
              onClick={() => handleAddToPlaylist(playlist._id, playlist.name)}
              className="group flex w-full items-center justify-between gap-3 rounded-xl bg-white p-3 text-left shadow-sm transition hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                {/* Playlist Icon/Thumbnail */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-md">
                  <Music2 className="h-6 w-6" />
                </div>

                {/* Playlist Info */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {playlist.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {playlist.tracks.length}{" "}
                    {playlist.tracks.length === 1 ? "track" : "tracks"}
                  </span>
                </div>
              </div>
            </motion.button>
          ))
        )}
      </motion.div>

      {/* Create New Playlist Button */}
      <button
        onClick={handleCreateNewPlaylist}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-[hsl(var(--neon-purple))] hover:bg-purple-50 hover:text-[hsl(var(--neon-purple))]"
      >
        <Plus className="h-4 w-4" />
        New Playlist
      </button>
    </div>
  );
}
