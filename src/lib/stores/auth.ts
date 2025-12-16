import { writable } from 'svelte/store';
import type { User } from '$lib/types/user';

const STORAGE_KEY = 'movie_app_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
}

/**
 * Create the auth store with methods for managing authentication
 */
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
    expiresAt: null
  });

  let logoutTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Save session to localStorage
   */
  function saveToStorage(user: User, expiresAt: number) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          expiresAt
        })
      );
    }
  }

  /**
   * Clear session from localStorage
   */
  function clearStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Setup auto-logout timer
   */
  function setupLogoutTimer(expiresAt: number) {
    // Clear existing timer
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    if (timeUntilExpiry > 0) {
      logoutTimer = setTimeout(() => {
        authStore.logout();
      }, timeUntilExpiry);
    } else {
      // Session already expired
      authStore.logout();
    }
  }

  return {
    subscribe,

    /**
     * Login user and create session
     */
    login: (user: User) => {
      const expiresAt = Date.now() + SESSION_DURATION;

      set({
        user,
        isAuthenticated: true,
        expiresAt
      });

      saveToStorage(user, expiresAt);
      setupLogoutTimer(expiresAt);
    },

    /**
     * Logout user and clear session
     */
    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
        expiresAt: null
      });

      clearStorage();

      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }
    },

    /**
     * Check if session is valid
     */
    checkSession: (): boolean => {
      let isValid = false;

      update((state) => {
        if (!state.expiresAt) {
          return state;
        }

        const now = Date.now();
        isValid = now < state.expiresAt;

        if (!isValid) {
          // Session expired
          clearStorage();
          if (logoutTimer) {
            clearTimeout(logoutTimer);
            logoutTimer = null;
          }
          return {
            user: null,
            isAuthenticated: false,
            expiresAt: null
          };
        }

        return state;
      });

      return isValid;
    },

    /**
     * Initialize auth state from localStorage
     */
    init: () => {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
          return;
        }

        const { user, expiresAt } = JSON.parse(stored);
        const now = Date.now();

        if (now < expiresAt) {
          // Session is still valid
          set({
            user,
            isAuthenticated: true,
            expiresAt
          });

          setupLogoutTimer(expiresAt);
        } else {
          // Session expired, clear it
          clearStorage();
        }
      } catch (error) {
        console.error('Error initializing auth from storage:', error);
        clearStorage();
      }
    }
  };
}

export const authStore = createAuthStore();
