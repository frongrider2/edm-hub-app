import type { Song, Playlist, User } from "@shared/types";

export const mockSongs: Song[] = [
  {
    id: "song1",
    title: "Yummy",
    artist: "Justin Bieber",
    duration: 190,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80&auto=format",
  },
  {
    id: "song2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: 200,
    cover:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&q=80&auto=format",
  },
  {
    id: "song3",
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: 234,
    cover:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80&auto=format",
  },
  {
    id: "song4",
    title: "Someone Like You",
    artist: "Adele",
    duration: 285,
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80&auto=format",
  },
  {
    id: "song5",
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    duration: 269,
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80&auto=format",
  },
  {
    id: "song6",
    title: "One Dance",
    artist: "Drake ft. Wizkid & Kyla",
    duration: 213,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80&auto=format",
  },
  {
    id: "song7",
    title: "God's Plan",
    artist: "Drake",
    duration: 238,
    cover:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&q=80&auto=format",
  },
  {
    id: "song8",
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: 263,
    cover:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80&auto=format",
  },
  {
    id: "song9",
    title: "Closer",
    artist: "The Chainsmokers ft. Halsey",
    duration: 244,
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80&auto=format",
  },
  {
    id: "song10",
    title: "Havana",
    artist: "Camila Cabello ft. Young Thug",
    duration: 231,
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80&auto=format",
  },
  {
    id: "song11",
    title: "Old Town Road",
    artist: "Lil Nas X ft. Billy Ray Cyrus",
    duration: 262,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80&auto=format",
  },
  {
    id: "song12",
    title: "Levitating",
    artist: "Dua Lipa ft. DaBaby",
    duration: 203,
    cover:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&q=80&auto=format",
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: "playlist1",
    name: "Chill Vibes",
    description: "Relaxing tracks for any mood",
    songs: ["song1", "song4", "song8"],
    created: new Date("2024-01-15"),
  },
  {
    id: "playlist2",
    name: "Party Hits",
    description: "Dance and party anthems",
    songs: ["song5", "song6", "song7", "song9"],
    created: new Date("2024-01-20"),
  },
];

export const mockUser: User = {
  id: "user1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format",
  playlists: ["playlist1", "playlist2"],
  savedSongs: ["song1", "song2", "song3", "song4", "song5"],
};
