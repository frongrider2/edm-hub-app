import { toast, ToastOptions, Id } from "react-toastify";

/**
 * Default toast configuration
 */
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Show a success toast notification
 */
export const showSuccess = (message: string, options?: ToastOptions): Id => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show an error toast notification
 */
export const showError = (message: string, options?: ToastOptions): Id => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show a warning toast notification
 */
export const showWarning = (message: string, options?: ToastOptions): Id => {
  return toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show an info toast notification
 */
export const showInfo = (message: string, options?: ToastOptions): Id => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show a default toast notification
 */
export const showToast = (message: string, options?: ToastOptions): Id => {
  return toast(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show a loading toast notification
 * Returns the toast ID which can be used to update or dismiss the toast
 */
export const showLoading = (
  message: string = "Loading...",
  options?: ToastOptions,
): Id => {
  return toast.loading(message, {
    ...defaultOptions,
    autoClose: false,
    closeOnClick: false,
    ...options,
  });
};

/**
 * Update an existing toast
 */
export const updateToast = (
  toastId: Id,
  message: string,
  type: "success" | "error" | "warning" | "info" | "default" = "default",
  options?: ToastOptions,
): void => {
  toast.update(toastId, {
    render: message,
    type: type === "default" ? "default" : type,
    isLoading: false,
    autoClose: 3000,
    ...options,
  });
};

/**
 * Dismiss a specific toast by ID
 */
export const dismissToast = (toastId: Id): void => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = (): void => {
  toast.dismiss();
};

/**
 * Handle promise-based operations with toast notifications
 * Shows loading state, then success or error based on promise resolution
 */
export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error: string;
  },
  options?: ToastOptions,
): Promise<T> => {
  return toast.promise(promise, messages, {
    ...defaultOptions,
    ...options,
  }) as Promise<T>;
};

/**
 * Helper for API call toasts - commonly used pattern
 */
export const apiCallToast = async <T>(
  apiCall: () => Promise<T>,
  messages?: {
    loading?: string;
    success?: string | ((data: T) => string);
    error?: string | ((error: unknown) => string);
  },
): Promise<T> => {
  const toastId = showLoading(messages?.loading ?? "Processing...");

  try {
    const result = await apiCall();
    const successMsg =
      typeof messages?.success === "function"
        ? messages.success(result)
        : (messages?.success ?? "Operation completed successfully!");

    updateToast(toastId, successMsg, "success");
    return result;
  } catch (error) {
    const errorMsg =
      typeof messages?.error === "function"
        ? messages.error(error)
        : (messages?.error ?? "An error occurred");

    updateToast(toastId, errorMsg, "error");
    throw error;
  }
};

// Export the toast instance for advanced use cases
export { toast };
