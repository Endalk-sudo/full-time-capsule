import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";
import { loginService, registerService } from "@/services/auth";

/**
 * User type representing an authenticated user in the system.
 */
type user = {
  id: string;
  name: string;
  email: string;
};

/**
 * Authentication store state and actions.
 *
 * This store manages:
 * - User authentication state (logged in/out)
 * - JWT token storage
 * - Loading and error states
 * - Authentication actions (login, register, logout)
 *
 * @example
 * // Using the auth store
 * const { isAuthenticated, user, login } = useAuthStore();
 */
type AuthStore = {
  /** The currently authenticated user, or null if not logged in */
  user: user | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** JWT access token for API requests */
  token: string | null;
  /** Whether an auth operation is in progress */
  isLoading: boolean;
  /** Error message from failed auth operations */
  authError: string | null;
  /** Success message from auth operations */
  successMessage: string | null;

  /**
   * Registers a new user account.
   *
   * @param name - User's display name
   * @param email - User's email address
   * @param password - User's password
   * @param confirmPassword - Password confirmation
   */
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;

  /**
   * Logs in an existing user.
   *
   * @param email - User's email address
   * @param password - User's password
   */
  login: (email: string, password: string) => Promise<void>;

  /** Logs out the current user and clears auth state */
  logout: () => void;
};

/**
 * Type guard to check if an error is an AxiosError with response data.
 */
const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === "object" && error !== null && "response" in error;
};

/**
 * Creates the authentication store with persist middleware.
 *
 * The persist middleware automatically saves the auth state to localStorage
 * under the key "auth", allowing users to stay logged in across page refreshes.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: true,
      authError: null,
      successMessage: null,

      /**
       * Handles user registration.
       *
       * On success: Stores user data, token, and redirects to home page.
       * On failure: Sets appropriate error message based on error type.
       */
      register: async (name, email, password, confirmPassword) => {
        try {
          set({ isLoading: true, authError: null });

          const res = await registerService(
            name,
            email,
            password,
            confirmPassword,
          );

          if (res?.data.success) {
            set({
              isLoading: false,
              user: res.data.user,
              token: res.data.accessToken,
              isAuthenticated: true,
              successMessage: res.data.message,
              authError: null,
            });

            // Redirect to home page after successful registration
            location.href = "/";
          }
        } catch (error: unknown) {
          // Handle Axios errors with response
          if (isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as Record<string, unknown>;

            // Handle 409 Conflict (user already exists)
            if (status === 409) {
              set({
                authError:
                  (data.errors?.email as string) || "User already exists",
                isLoading: false,
              });
            }
            // Handle 500 Internal Server Error
            else if (status === 500) {
              set({
                authError: (data.message as string) || "Server error",
                isLoading: false,
              });
            }
            // Handle other HTTP errors
            else {
              set({
                isLoading: false,
                authError: "An unexpected error occurred",
              });
            }
          }
          // Network error (no response received)
          else if (
            error instanceof Error &&
            error.message === "Network Error"
          ) {
            set({ authError: "Network Error", isLoading: false });
          }
          // Request setup error
          else {
            set({
              isLoading: false,
              authError: "An unexpected error occurred",
            });
          }
        }
      },

      /**
       * Handles user login.
       *
       * On success: Stores user data, token, and redirects to home page.
       * On failure: Sets appropriate error message (invalid credentials, etc.).
       */
      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const res = await loginService(email, password);

          if (res?.data.success) {
            set({
              isLoading: false,
              user: res.data.user,
              token: res.data.accessToken,
              isAuthenticated: true,
              successMessage: res.data.message,
              authError: null,
            });

            // Redirect to home page after successful login
            location.href = "/";
          }
        } catch (error: unknown) {
          // Handle Axios errors with response
          if (isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as Record<string, unknown>;

            // Handle 401 Unauthorized (invalid credentials)
            if (status === 401) {
              set({
                authError:
                  (data.errors?.credentials as string) || "Invalid credentials",
                isLoading: false,
              });
            }
            // Handle 500 Internal Server Error
            else if (status === 500) {
              set({
                authError: (data.message as string) || "Server error",
                isLoading: false,
              });
            }
            // Handle other HTTP errors
            else {
              set({
                isLoading: false,
                authError: "An unexpected error occurred",
              });
            }
          }
          // Network error
          else if (
            error instanceof Error &&
            error.message === "Network Error"
          ) {
            set({ authError: "Network Error", isLoading: false });
          }
          // Request setup error
          else {
            set({
              isLoading: false,
              authError: "An unexpected error occurred",
            });
          }
        }
      },

      logout: () => {
        localStorage.removeItem("auth");
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      // Key used for localStorage persistence
      name: "auth",
    },
  ),
);
