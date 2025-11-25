import { PlaylistResponseItem } from "@/apis/types/response.type";
import { PlayButton } from "@/components/track/PlayButton";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: PlaylistResponseItem;
}

function PlaylistCard({ playlist }: PlaylistCardProps): JSX.Element {
  return (
    <article
      className={cn(
        // More padding, vibrant shadow, better spacing
        "h-full border-primary bg-black/60 md:bg-transparent relative border-2 flex flex-col justify-between rounded-2xl p-4 sm:p-5 text-xs shadow-lg shadow-[hsl(var(--neon-pink))/0.10] transition-shadow hover:shadow-[0_4px_32px_0_hsl(var(--neon-cyan)/0.20)] hover:scale-[1.01] group focus-within:ring-2 focus-within:ring-neon-pink/60 cursor-pointer",
      )}
      tabIndex={0}
    >
      <div className="h-6 w-6 overflow-hidden rounded-full bg-primary flex items-center justify-center p-[1px] absolute bottom-4 right-4">
        <img
          src={playlist.createdBy.picture || "/images/profile.jpg"}
          alt={playlist.createdBy.name}
          className="h-full w-full object-cover rounded-full"
        />
      </div>

      <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <PlayButton
          isPlaying={false}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("play");
          }}
          size="sm"
          variant="primary"
        />
      </div>

      <div>
        <h3 className="mt-0.5 text-[12px]  md:text-base font-semibold text-foreground leading-tight truncate">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="mt-1 line-clamp-2 text-[10px] md:text-[12px] text-muted-foreground/80 leading-snug">
            {playlist.description}
          </p>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground/90">
        <span className="flex items-center gap-1">
          {playlist.tracks.length}{" "}
          {playlist.tracks.length === 1 ? "song" : "songs"}
        </span>
      </div>
    </article>
  );
}

export default PlaylistCard;
