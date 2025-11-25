import { PlaylistResponseItem } from "@/apis/types/response.type";
import PlaylistCard from "@/components/PlaylistCard";
import { useAuthApi } from "@/hooks/use-api";
import { useCounter } from "@/states/counter/counterSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlaylistLists() {
  const [playlistsList, setPlaylistsList] = useState<PlaylistResponseItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const navigate = useNavigate();
  const counter = useCounter();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const api = useAuthApi();
      const response = await api.playlist.getPlaylistsPopular(10, 1);
      if (response.isSuccess) {
        setPlaylistsList(response.data.items);
        setHasNext(response.data.hasNext);
      }
    };
    fetchPlaylists();
  }, [counter]);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Playlists
        </h2>
        <span className="text-[11px] text-muted-foreground/80">
          {playlistsList.length} curated
        </span>
      </div>
      <div className="neon-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {playlistsList.map((playlist) => (
          <button
            key={playlist._id}
            type="button"
            onClick={() => navigate(`/playlists/${playlist.slug}`)}
            className="md:w-48 w-40 flex-shrink-0 text-left"
          >
            <PlaylistCard playlist={playlist} />
          </button>
        ))}
      </div>
    </section>
  );
}
