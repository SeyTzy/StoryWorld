import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('storyworld_token'),
  isAuthenticated: !!localStorage.getItem('storyworld_token'),
  isLoading: true,

  login: (user: User, token: string) => {
    localStorage.setItem('storyworld_token', token);
    localStorage.setItem('storyworld_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('storyworld_token');
    localStorage.removeItem('storyworld_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: User) => {
    localStorage.setItem('storyworld_user', JSON.stringify(user));
    set({ user });
  },

  initialize: () => {
    try {
      const token = localStorage.getItem('storyworld_token');
      const userStr = localStorage.getItem('storyworld_user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
