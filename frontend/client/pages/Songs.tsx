import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "@/utils/motion";
import ArtistList from "@/components/artists/ArtistList";
import PlaylistLists from "@/components/playlists/playlistLists";
import { TrackList } from "@/components/track/TrackList";
import { TrackResponseItem } from "@/apis/types/response.type";
import { useAuthApi } from "@/hooks/use-api";

interface Artist {
  name: string;
  avatarUrl: string;
  tag?: string;
}

function Songs(): JSX.Element {
  const [tracksList, setTracksList] = useState<TrackResponseItem[]>([]);
  const [hasTracksNext, setHasTracksNext] = useState(false);

  const fetchTracks = async () => {
    const api = useAuthApi();
    const response = await api.track.getTracksPopular(40, 1);
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
      className="space-y-4"
    >
      {/* <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"> */}
      {/* <div className="relative w-full md:max-w-sm">
          <input
            className="neon-input pl-9 pr-4"
            placeholder="Search tracks, artists, or moods"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div> */}
      {/* <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                "neon-chip",
                currentCategory === category.id && "neon-chip-active",
              )}
            >
              {category.label}
            </button>
          ))}
        </div> */}
      {/* </div> */}

      <ArtistList />
      <PlaylistLists />
      <TrackList tracksList={tracksList} hasNext={hasTracksNext} />
    </motion.div>
  );
}

export default Songs;
