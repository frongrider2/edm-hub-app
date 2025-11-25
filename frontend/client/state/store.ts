import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { Dispatch, ReactNode } from "react";
import type { Action, AppState, Playlist, Song, User } from "./types";
import { mockSongs } from "@/data/mockSongs";
import { mockPlaylists } from "@/data/mockPlaylists";

const initialUser: User = {
  id: "demo-user",
  name: "Apisit Lomhome",
  email: "demo@muso.app",
  avatarUrl:
    "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=256",
  stats: {
    totalPlaylists: mockPlaylists.length,
    totalSongs: mockSongs.length,
    minutesListened: 1240,
  },
};

const initialState: AppState = {
  currentUser: initialUser,
  songs: mockSongs,
  playlists: mockPlaylists,
  currentSongId: mockSongs[0]?.id ?? null,
  isPlaying: false,
  currentCategory: "all",
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_CURRENT_USER": {
      return { ...state, currentUser: action.payload };
    }
    case "ADD_PLAYLIST": {
      const id = `${Date.now()}`;
      const newPlaylist: Playlist = {
        id,
        name: action.payload.name,
        description: action.payload.description,
        songIds: [],
        createdAt: new Date().toISOString(),
      };
      const playlists = [newPlaylist, ...state.playlists];
      return {
        ...state,
        playlists,
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              stats: {
                ...state.currentUser.stats,
                totalPlaylists: playlists.length,
              },
            }
          : state.currentUser,
      };
    }
    case "DELETE_PLAYLIST": {
      const playlists = state.playlists.filter(
        (playlist) => playlist.id !== action.payload.playlistId,
      );
      return {
        ...state,
        playlists,
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              stats: {
                ...state.currentUser.stats,
                totalPlaylists: playlists.length,
              },
            }
          : state.currentUser,
      };
    }
    case "ADD_SONG_TO_PLAYLIST": {
      const playlists = state.playlists.map((playlist) => {
        if (playlist.id !== action.payload.playlistId) return playlist;
        if (playlist.songIds.includes(action.payload.songId)) return playlist;
        return {
          ...playlist,
          songIds: [...playlist.songIds, action.payload.songId],
        };
      });
      return { ...state, playlists };
    }
    case "REMOVE_SONG_FROM_PLAYLIST": {
      const playlists = state.playlists.map((playlist) => {
        if (playlist.id !== action.payload.playlistId) return playlist;
        return {
          ...playlist,
          songIds: playlist.songIds.filter(
            (songId) => songId !== action.payload.songId,
          ),
        };
      });
      return { ...state, playlists };
    }
    case "SET_CURRENT_SONG": {
      return { ...state, currentSongId: action.payload.songId };
    }
    case "TOGGLE_PLAY": {
      return { ...state, isPlaying: !state.isPlaying };
    }
    case "SET_CATEGORY": {
      return { ...state, currentCategory: action.payload.category };
    }
    case "UPDATE_USER": {
      if (!state.currentUser) return state;
      const updated: User = { ...state.currentUser, ...action.payload };
      return { ...state, currentUser: updated };
    }
    default: {
      const exhaustiveCheck: never = action;
      return state;
    }
  }
}

interface AppStoreValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export function AppStoreProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return createElement(AppStoreContext.Provider, { value }, children);
}

export function useAppStore(): AppStoreValue {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return context;
}
