// API Configuration Constants
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Other API related constants
export const API_TIMEOUT = 10000;
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Auth related constants
export const AUTH_TOKEN_KEY = "authToken";

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
