import toast from "react-hot-toast";
import { type AxiosError } from "axios";
import { AUTH_TOKEN_KEY } from "../constants/api";

// Error types for better categorization
export const ErrorType = {
  NETWORK: "network",
  AUTHENTICATION: "authentication",
  AUTHORIZATION: "authorization",
  VALIDATION: "validation",
  SERVER: "server",
  NOT_FOUND: "not_found",
  TIMEOUT: "timeout",
  UNKNOWN: "unknown",
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

// Error handler configuration
interface ErrorHandlerConfig {
  showToast?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
  onError?: (error: AxiosError, errorType: ErrorType) => void;
}

class ErrorHandlerService {
  private defaultConfig: ErrorHandlerConfig = {
    showToast: true,
    logToConsole: true,
  };

  /**
   * Handle API errors with comprehensive error categorization
   * @param error - Axios error object
   * @param config - Optional configuration
   */
  handleError(error: AxiosError, config: ErrorHandlerConfig = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };
    const errorType = this.categorizeError(error);
    const errorMessage =
      finalConfig.customMessage || this.getErrorMessage(error, errorType);

    // Log error to console if enabled
    if (finalConfig.logToConsole) {
      this.logError(error, errorType);
    }

    // Show toast notification if enabled
    if (finalConfig.showToast) {
      this.showToast(errorMessage, errorType);
    }

    // Handle specific error types
    this.handleSpecificErrors(error, errorType);

    // Call custom error handler if provided
    if (finalConfig.onError) {
      finalConfig.onError(error, errorType);
    }
  }

  /**
   * Categorize error based on status code and error type
   */
  private categorizeError(error: AxiosError): ErrorType {
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return ErrorType.TIMEOUT;
      }
      return ErrorType.NETWORK;
    }

    const status = error.response.status;

    switch (status) {
      case 401:
        return ErrorType.AUTHENTICATION;
      case 403:
        return ErrorType.AUTHORIZATION;
      case 404:
        return ErrorType.NOT_FOUND;
      case 400:
      case 422:
        return ErrorType.VALIDATION;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorType.SERVER;
      default:
        return ErrorType.UNKNOWN;
    }
  }

  /**
   * Get appropriate error message based on error type
   */
  private getErrorMessage(error: AxiosError, errorType: ErrorType): string {
    // Try to extract message from response first
    const responseMessage = this.extractResponseMessage(error);
    if (responseMessage) {
      return responseMessage;
    }

    // Fallback to default messages based on error type
    switch (errorType) {
      case ErrorType.AUTHENTICATION:
        return "Session expired. Please login again.";
      case ErrorType.AUTHORIZATION:
        return "Access denied. You don't have permission to perform this action.";
      case ErrorType.NOT_FOUND:
        return "Resource not found.";
      case ErrorType.VALIDATION:
        return "Please check your input and try again.";
      case ErrorType.SERVER:
        return "Server error. Please try again later.";
      case ErrorType.TIMEOUT:
        return "Request timeout. Please check your connection.";
      case ErrorType.NETWORK:
        return "Network error. Please check your internet connection.";
      default:
        return "An unexpected error occurred.";
    }
  }

  /**
   * Extract error message from API response
   */
  private extractResponseMessage(error: AxiosError): string | null {
    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;

      // Common message fields in API responses
      const messageFields = [
        "message",
        "error",
        "details",
        "description",
        "title",
      ];

      for (const field of messageFields) {
        if (data[field] && typeof data[field] === "string") {
          return data[field] as string;
        }
      }

      // Handle array of errors (common in validation)
      if (Array.isArray(data.errors)) {
        return data.errors.join(", ");
      }
    }

    return null;
  }

  /**
   * Show appropriate toast notification
   */
  private showToast(message: string, errorType: ErrorType) {
    switch (errorType) {
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        toast.error(message, { duration: 6000 });
        break;
      case ErrorType.VALIDATION:
        toast.error(message, { duration: 5000 });
        break;
      case ErrorType.NETWORK:
      case ErrorType.TIMEOUT:
        toast.error(message, { duration: 7000 });
        break;
      default:
        toast.error(message, { duration: 4000 });
    }
  }

  /**
   * Handle specific error types with custom logic
   */
  private handleSpecificErrors(_error: AxiosError, errorType: ErrorType) {
    switch (errorType) {
      case ErrorType.AUTHENTICATION:
        // Clear auth token and redirect to login
        localStorage.removeItem(AUTH_TOKEN_KEY);
        // You can dispatch a logout action or redirect here
        // window.location.href = '/login';
        break;

      case ErrorType.NETWORK:
        // You could implement retry logic here
        break;

      case ErrorType.SERVER:
        // You could send error reports to monitoring service
        break;
    }
  }

  /**
   * Log error details to console
   */
  private logError(error: AxiosError, errorType: ErrorType) {
    const logData = {
      errorType,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    console.error("API Error:", logData);
  }

  /**
   * Show success toast notification
   */
  success(message: string, duration = 3000) {
    toast.success(message, { duration });
  }

  /**
   * Show info toast notification
   */
  info(message: string, duration = 4000) {
    toast(message, { duration, icon: "ℹ️" });
  }

  /**
   * Show warning toast notification
   */
  warning(message: string, duration = 4000) {
    toast(message, {
      duration,
      icon: "⚠️",
      style: {
        background: "#f59e0b",
        color: "#fff",
      },
    });
  }

  /**
   * Manually show error toast
   */
  error(message: string, duration = 4000) {
    toast.error(message, { duration });
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandlerService();

// Export the class for creating new instances if needed
export default ErrorHandlerService;
