import type { Song } from "@/states/songs/songsSlice";

export const mockSongs: Song[] = [
  {
    id: "lost-found",
    title: "Lost & Found",
    artist: "Faheem Abdul",
    album: "City Echoes",
    coverUrl:
      "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: "3:33",
    isTrending: true,
    isPopular: true,
    categories: ["all", "trending", "popular"],
  },
  {
    id: "midnight-drive",
    title: "Midnight Drive",
    artist: "Nova Lights",
    album: "Neon Skies",
    coverUrl:
      "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: "4:12",
    isTrending: true,
    isNew: true,
    categories: ["all", "trending", "new"],
  },
  {
    id: "electric-heart",
    title: "Electric Heart",
    artist: "Kira Lane",
    album: "Voltage",
    coverUrl:
      "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: "2:58",
    isPopular: true,
    categories: ["all", "popular"],
  },
  {
    id: "echoes-of-rain",
    title: "Echoes of Rain",
    artist: "Lena Voss",
    album: "Aurora City",
    coverUrl:
      "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: "3:47",
    isNew: true,
    categories: ["all", "new"],
  },
];
