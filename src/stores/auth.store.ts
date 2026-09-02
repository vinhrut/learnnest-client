import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth';
import type { RoleCode } from '@/types/user';

export type AuthStatus = 'idle' | 'loading' | 'authed' | 'guest';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  status: AuthStatus;

  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  setTokens: (payload: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: AuthUser) => void;
  setStatus: (status: AuthStatus) => void;
  clearSession: () => void;
}

const REMEMBER_KEY = 'ln.remember';

export function setRemember(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
}

function pickStorage(): Storage {
  return localStorage.getItem(REMEMBER_KEY) === 'false'
    ? sessionStorage
    : localStorage;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      status: 'idle',

      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user, status: 'authed' }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setStatus: (status) => set({ status }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          status: 'guest',
        }),
    }),
    {
      name: 'ln.auth',
      storage: createJSONStorage(() => ({
        getItem: (name) => pickStorage().getItem(name),
        setItem: (name, value) => pickStorage().setItem(name, value),
        removeItem: (name) => pickStorage().removeItem(name),
      })),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);

export const authStore = useAuthStore;

export function hasRole(
  user: AuthUser | { roles: RoleCode[] } | null | undefined,
  ...codes: RoleCode[]
): boolean {
  if (!user) return false;
  return user.roles.some((r) => codes.includes(r));
}
