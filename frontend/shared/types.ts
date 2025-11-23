export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover: string;
  albumArt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: string[];
  created: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  playlists: string[];
  savedSongs: string[];
}

export interface AppState {
  user: User | null;
  songs: Song[];
  playlists: Playlist[];
  currentPlayingSong: string | null;
  currentPlaylist: string | null;
  likedSongs: string[];
}

export type AppAction =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "CREATE_PLAYLIST"; payload: Omit<Playlist, "id"> }
  | { type: "DELETE_PLAYLIST"; payload: string }
  | {
      type: "ADD_SONG_TO_PLAYLIST";
      payload: { playlistId: string; songId: string };
    }
  | {
      type: "REMOVE_SONG_FROM_PLAYLIST";
      payload: { playlistId: string; songId: string };
    }
  | { type: "SET_CURRENT_SONG"; payload: string | null }
  | { type: "SET_CURRENT_PLAYLIST"; payload: string | null }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "TOGGLE_LIKE_SONG"; payload: string }
  | { type: "INIT_STATE"; payload: AppState };
