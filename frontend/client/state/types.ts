export type Category = "all" | "trending" | "popular" | "new";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  duration: string;
  isTrending?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  categories: Category[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songIds: string[];
  createdAt: string;
  isFavorite?: boolean;
  accentColor?: string;
}

export interface UserStats {
  totalPlaylists: number;
  totalSongs: number;
  minutesListened: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  stats: UserStats;
}

export interface AppState {
  currentUser: User | null;
  songs: Song[];
  playlists: Playlist[];
  currentSongId: string | null;
  isPlaying: boolean;
  currentCategory: Category;
}

export type Action =
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "ADD_PLAYLIST"; payload: { name: string; description?: string } }
  | { type: "DELETE_PLAYLIST"; payload: { playlistId: string } }
  | {
      type: "ADD_SONG_TO_PLAYLIST";
      payload: { playlistId: string; songId: string };
    }
  | {
      type: "REMOVE_SONG_FROM_PLAYLIST";
      payload: { playlistId: string; songId: string };
    }
  | { type: "SET_CURRENT_SONG"; payload: { songId: string | null } }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_CATEGORY"; payload: { category: Category } }
  | { type: "UPDATE_USER"; payload: Partial<User> };
