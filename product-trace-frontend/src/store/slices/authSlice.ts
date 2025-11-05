// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'admin123456';
const STORAGE_KEY = 'admin_key';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem(STORAGE_KEY) === ADMIN_KEY,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      if (action.payload === ADMIN_KEY) {
        state.isAuthenticated = true;
        localStorage.setItem(STORAGE_KEY, action.payload);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEY);
    },
    checkAuth: (state) => {
      const savedKey = localStorage.getItem(STORAGE_KEY);
      state.isAuthenticated = savedKey === ADMIN_KEY;
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;