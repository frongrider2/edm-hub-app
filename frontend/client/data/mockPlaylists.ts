import type { Playlist } from "@/states/playlists/playlistsSlice";

export const mockPlaylists: Playlist[] = [
  {
    id: "late-night-vibes",
    name: "Late Night Vibes",
    description: "Neon-soaked tracks for coding past midnight.",
    songIds: ["lost-found", "midnight-drive"],
    createdAt: new Date().toISOString(),
    isFavorite: true,
    accentColor: "from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))]",
  },
  {
    id: "synthetic-sunrise",
    name: "Synthetic Sunrise",
    description: "Uplifting synthwave to start the day.",
    songIds: ["electric-heart", "echoes-of-rain"],
    createdAt: new Date().toISOString(),
    isFavorite: false,
    accentColor: "from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-cyan))]",
  },
];
