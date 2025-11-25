import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/states/store";
import { mockSongs } from "@/data/mockSongs";
import { mockPlaylists } from "@/data/mockPlaylists";

export interface UserStats {
  totalPlaylists: number;
  totalSongs: number;
  minutesListened: number;
}

export interface User {
  _id: string;
  email: string;
  isEnabled: boolean;
  isEmailVerified: boolean;
  role: string;
  name: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  stats: UserStats;
}

interface UserState {
  isLogin: boolean;
  currentUser: User | null;
}

const initialState: UserState = {
  isLogin: false,
  currentUser: {
    _id: "",
    email: "",
    name: "",
    picture: "",
    isEnabled: false,
    isEmailVerified: false,
    role: "",
    createdAt: "",
    updatedAt: "",
    stats: {
      totalPlaylists: 0,
      totalSongs: 0,
      minutesListened: 0,
    },
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.isLogin = true;
      state.currentUser.email = action.payload?.email || "";
      state.currentUser._id = action.payload?._id || "";
      state.currentUser.isEnabled = action.payload?.isEnabled || false;
      state.currentUser.name = action.payload?.name || "";
      state.currentUser.picture = action.payload?.picture || "";
      state.currentUser.isEmailVerified =
        action.payload?.isEmailVerified || false;
      state.currentUser.role = action.payload?.role || "";
      state.currentUser.createdAt = action.payload?.createdAt || "";
      state.currentUser.updatedAt = action.payload?.updatedAt || "";
      state.currentUser.stats = action.payload?.stats || {
        totalPlaylists: 0,
        totalSongs: 0,
        minutesListened: 0,
      };
    },
    removeCurrentUser: (state) => {
      state.isLogin = false;
      state.currentUser._id = "";
      state.currentUser.createdAt = state.currentUser.updatedAt = "";
      state.currentUser.email = "";
      state.currentUser.name = "";
      state.currentUser.picture = "";
      state.currentUser.isEnabled = false;
      state.currentUser.isEmailVerified = false;
      state.currentUser.role = "";
      state.currentUser.stats = {
        totalPlaylists: 0,
        totalSongs: 0,
        minutesListened: 0,
      };
    },
  },
});

export const { setCurrentUser, removeCurrentUser } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserStats = (state: RootState) =>
  state.user.currentUser?.stats;

export default userSlice.reducer;
