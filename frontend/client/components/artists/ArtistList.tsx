import { ArtistResponseItem } from "@/apis/types/response.type";
import { useAuthApi } from "@/hooks/use-api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ArtistList() {
  const [artistsList, setArtistsList] = useState<ArtistResponseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      const api = useAuthApi();
      const response = await api.artist.getArtistsPopular(30, 1);
      if (response.isSuccess) {
        setArtistsList(response.data.items);
        setHasNext(response.data.hasNext);
      }
    };
    fetchArtists();
  }, []);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Artists
        </h2>
        <span className="text-[11px] text-muted-foreground/80">
          Curated for you
        </span>
      </div>
      <div className="neon-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 min-h-[5rem]">
        {artistsList.map((artist) => (
          <button
            key={artist.name}
            type="button"
            onClick={() => navigate(`/artists/${artist._id}`)}
            className="md:glass-panel bg-black flex w-32 flex-shrink-0 flex-col items-center gap-2 rounded-2xl md:bg-white/5 bg-black/50 px-3 py-3 text-center text-[11px] text-muted-foreground transition hover:bg-white/10"
          >
            <div className="h-10 w-10 overflow-hidden rounded-full bg-white/10">
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="line-clamp-1 text-xs font-medium text-foreground">
              {artist.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
