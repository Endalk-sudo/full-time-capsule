import axios from "axios";

// Base URL for API requests - should be set in environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Axios instance for private API requests that require authentication.
 *
 * This instance includes a request interceptor that automatically attaches
 * the JWT token from localStorage to outgoing requests.
 *
 * @example
 * import apiPrivate from "./apiPrivate";
 *
 * // Example protected request
 * const response = await apiPrivate.get("/capsules");
 */
const apiPrivate = axios.create({
  baseURL: BASE_URL,
});

/**
 * Request interceptor for adding authentication token to headers.
 *
 * IMPORTANT: Token is retrieved on each request, not at module initialization.
 * This ensures that tokens added to localStorage after page load (e.g., after
 * login) are properly included in subsequent API requests.
 *
 * The token is stored in localStorage under the "auth" key by Zustand's
 * persist middleware, with the following structure:
 * {
 *   state: {
 *     token: string,
 *     user: object,
 *     isAuthenticated: boolean
 *   }
 * }
 */
apiPrivate.interceptors.request.use(
  /**
   * Interceptor callback that runs on every request made with apiPrivate.
   * Retrieves the current token from localStorage and adds it to the
   * Authorization header if it exists.
   *
   * @param config - The axios request configuration
   * @returns Modified config with Authorization header if token exists
   */
  (config) => {
    // Retrieve auth state from localStorage on each request
    // This ensures we get the latest token after login
    const authString = localStorage.getItem("auth");

    if (authString) {
      try {
        const { state } = JSON.parse(authString);

        // Check if token exists in the persisted state
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        // Log parsing errors but don't block the request
        console.error("Failed to parse auth state from localStorage:", error);
      }
    }

    return config;
  },
  /**
   * Error handler for interceptor - called if interceptor throws
   * @param error - The error that occurred
   * @returns Promise.reject(error) - Passes error to calling code
   */
  (error) => {
    return Promise.reject(error);
  },
);

export default apiPrivate;
