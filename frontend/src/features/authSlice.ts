import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { id: string; 
    username: string; 
    email: string, 
    bio?: string;
    location?: string;
    joinedAt?: string;
    guest?: boolean;
    role?: 'user' | 'admin'; } | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthState>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token || '');
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
