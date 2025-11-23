import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { AppState, AppAction, Playlist, User } from "@shared/types";
import { mockSongs, mockPlaylists, mockUser } from "@/lib/mockData";

const initialState: AppState = {
  user: null,
  songs: mockSongs,
  playlists: mockPlaylists,
  currentPlayingSong: null,
  currentPlaylist: null,
  likedSongs: [],
};

const AppContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(
  undefined,
);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        currentPlayingSong: null,
        currentPlaylist: null,
      };

    case "CREATE_PLAYLIST": {
      const newPlaylist: Playlist = {
        ...action.payload,
        id: `playlist-${Date.now()}`,
      };
      return {
        ...state,
        playlists: [...state.playlists, newPlaylist],
        user: state.user
          ? {
              ...state.user,
              playlists: [...state.user.playlists, newPlaylist.id],
            }
          : null,
      };
    }

    case "DELETE_PLAYLIST":
      return {
        ...state,
        playlists: state.playlists.filter((p) => p.id !== action.payload),
        user: state.user
          ? {
              ...state.user,
              playlists: state.user.playlists.filter(
                (id) => id !== action.payload,
              ),
            }
          : null,
      };

    case "ADD_SONG_TO_PLAYLIST":
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.payload.playlistId
            ? {
                ...p,
                songs: [...new Set([...p.songs, action.payload.songId])],
              }
            : p,
        ),
      };

    case "REMOVE_SONG_FROM_PLAYLIST":
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.payload.playlistId
            ? {
                ...p,
                songs: p.songs.filter((id) => id !== action.payload.songId),
              }
            : p,
        ),
      };

    case "SET_CURRENT_SONG":
      return {
        ...state,
        currentPlayingSong: action.payload,
      };

    case "SET_CURRENT_PLAYLIST":
      return {
        ...state,
        currentPlaylist: action.payload,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              ...action.payload,
            }
          : null,
      };

    case "TOGGLE_LIKE_SONG": {
      const isLiked = state.likedSongs.includes(action.payload);
      return {
        ...state,
        likedSongs: isLiked
          ? state.likedSongs.filter((id) => id !== action.payload)
          : [...state.likedSongs, action.payload],
      };
    }

    case "INIT_STATE":
      return action.payload;

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error("useAppDispatch must be used within AppProvider");
  }
  return context;
}
