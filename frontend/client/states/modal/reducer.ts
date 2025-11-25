/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  [key: string]: boolean;
}

const initialState: ModalState = {};

export const ModalSlide = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }: { payload: { id: string; payload?: any } }) => {
      state[payload.id] = true;
      state[`${payload.id}_payload`] = payload.payload;
    },
    closeModal: (state, { payload }) => {
      state[payload] = false;
      // Remove the key for payload instead of setting to undefined
      // delete state[`${payload}_payload`];
    },
    closeModalAll: (state) => {
      // Clear all modal states
      Object.keys(state).forEach((key) => {
        delete state[key];
      });
    },
  },
});

export const { openModal, closeModal, closeModalAll } = ModalSlide.actions;
export default ModalSlide.reducer;
