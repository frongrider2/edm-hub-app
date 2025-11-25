import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/states/counter/counterSlice";
import modalReducer from "@/states/modal/reducer";
import userReducer from "@/states/user/userSlice";
import playerReducer from "@/states/player/playerSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    modal: modalReducer,
    user: userReducer,
    player: playerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
