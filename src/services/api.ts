import axios, { type AxiosResponse, type AxiosError } from "axios";
import {
  BASE_URL,
  API_TIMEOUT,
  DEFAULT_HEADERS,
  AUTH_TOKEN_KEY,
} from "@/constants/api";
import { loadingService } from "./loading";
import { errorHandler } from "./errorHandler";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Request interceptor - for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Start loading spinner
    loadingService.startLoading();

    // Add auth token if available
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Stop loading spinner on error
    loadingService.stopLoading();
    return Promise.reject(error);
  }
);

// Response interceptor - for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Stop loading spinner on success
    loadingService.stopLoading();
    return response;
  },
  (error: AxiosError) => {
    // Stop loading spinner on error
    loadingService.stopLoading();

    // Use reusable error handler
    errorHandler.handleError(error);

    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// API service class
class ApiService {
  /**
   * GET request
   * @param endpoint - API endpoint (without base URL)
   * @param params - Query parameters
   * @param showSuccessToast - Whether to show success toast
   * @returns Promise with response data
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    showSuccessToast = false
  ): Promise<T> {
    try {
      const response = await apiClient.get<T>(endpoint, { params });
      if (showSuccessToast) {
        errorHandler.success("Data loaded successfully!");
      }
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  /**
   * POST request
   * @param endpoint - API endpoint (without base URL)
   * @param data - Request body data
   * @param successMessage - Custom success message
   * @returns Promise with response data
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    successMessage = "Created successfully!"
  ): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, data);
      errorHandler.success(successMessage);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  /**
   * PUT request
   * @param endpoint - API endpoint (without base URL)
   * @param data - Request body data
   * @param successMessage - Custom success message
   * @returns Promise with response data
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    successMessage = "Updated successfully!"
  ): Promise<T> {
    try {
      const response = await apiClient.put<T>(endpoint, data);
      errorHandler.success(successMessage);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint (without base URL)
   * @param successMessage - Custom success message
   * @returns Promise with response data
   */
  async delete<T = unknown>(
    endpoint: string,
    successMessage = "Deleted successfully!"
  ): Promise<T> {
    try {
      const response = await apiClient.delete<T>(endpoint);
      errorHandler.success(successMessage);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  /**
   * Handle API errors
   * @param error - Axios error object
   */
  private handleError(error: AxiosError) {
    // Use the reusable error handler with custom configuration
    errorHandler.handleError(error, {
      showToast: true,
      logToConsole: true,
    });
  }

  /**
   * Set auth token
   * @param token - JWT or auth token
   */
  setAuthToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * Remove auth token
   */
  removeAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the class for creating new instances if needed
export default ApiService;
