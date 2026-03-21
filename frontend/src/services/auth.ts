import apiPublic from "./apiPublic";

/**
 * User type definition representing an authenticated user.
 */
type User = {
  id: string;
  email: string;
  name: string;
};

/**
 * Response data structure from authentication endpoints.
 */
type Data = {
  success: boolean;
  message: string;
  user?: User;
  errors?: object[];
  accessToken?: string;
};

/**
 * Axios response type for authentication requests.
 * Extends the default axios response to include our custom Data type.
 */
interface ReturnType {
  data: Data;
  status: number;
  statusText?: string;
  headers: object;
  config: object;
  request?: object;
}

/**
 * Registers a new user with the backend API.
 *
 * @param name - User's display name
 * @param email - User's email address
 * @param password - User's password
 * @param confirmPassword - Password confirmation (must match password)
 * @returns Promise resolving to the API response containing user data and access token
 *
 * @example
 * const result = await registerService("John", "john@example.com", "password123", "password123");
 * if (result.data.success) {
 *   console.log("User registered:", result.data.user);
 * }
 */
export const registerService = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<ReturnType | null> => {
  const res = await apiPublic.post("/auth/register", {
    name,
    email,
    password,
    confirmPassword,
  });
  return res;
};

/**
 * Authenticates a user with email and password.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to the API response containing user data and access token
 *
 * @example
 * const result = await loginService("john@example.com", "password123");
 * if (result.data.success) {
 *   console.log("User logged in:", result.data.user);
 * }
 */
export const loginService = async (
  email: string,
  password: string,
): Promise<ReturnType | null> => {
  const res = await apiPublic.post("/auth/login", { email, password });
  return res;
};
