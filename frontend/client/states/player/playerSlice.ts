import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/states/store";
import { TrackResponseItem } from "@/apis/types/response.type";

interface PlayerState {
  currentSongId: string | null;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentSongId: null,
  isPlaying: false,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<string | null>) => {
      state.currentSongId = action.payload;
      // Auto-play when a new song is set
      if (action.payload) {
        state.isPlaying = true;
      }
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
  },
});

export const { setCurrentSong, togglePlay, play, pause } = playerSlice.actions;

export const selectCurrentSongId = (state: RootState) =>
  state.player.currentSongId;
export const selectIsPlaying = (state: RootState) => state.player.isPlaying;

export default playerSlice.reducer;
