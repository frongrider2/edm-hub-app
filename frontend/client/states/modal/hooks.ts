/* eslint-disable @typescript-eslint/no-explicit-any */
// export const useSideBar = () => useAppSelector((state) => state.layout.sidebarOpen);

import { ModalSlide } from '@/states/modal/reducer';
import { useAppDispatch, useAppSelector } from '../hooks';

export const useModal = () => {
  const modalState = useAppSelector((state) => state.modal);
  const modalPayload = useAppSelector((state) => state.modal.payload);
  const { openModal, closeModal, closeModalAll } = ModalSlide.actions;
  const dispatch = useAppDispatch();

  return {
    modalState,
    openModal: (payload: { id: string; payload?: any }) => dispatch(openModal(payload)),
    modalPayload,
    closeModal: (id: string) => dispatch(closeModal(id)),
    closeModalAll: () => dispatch(closeModalAll()),
  };
};
