// src/store/slices/uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIState {
  toasts: Toast[];
  showLoginModal: boolean;
  showQRModal: boolean;
}

const initialState: UIState = {
  toasts: [],
  showLoginModal: false,
  showQRModal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openLoginModal: (state) => {
      state.showLoginModal = true;
    },
    closeLoginModal: (state) => {
      state.showLoginModal = false;
    },
    openQRModal: (state) => {
      state.showQRModal = true;
    },
    closeQRModal: (state) => {
      state.showQRModal = false;
    },
  },
});

export const {
  showToast,
  removeToast,
  openLoginModal,
  closeLoginModal,
  openQRModal,
  closeQRModal,
} = uiSlice.actions;

export default uiSlice.reducer;