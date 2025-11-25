import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthApi } from "./use-api";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { removeCurrentUser, setCurrentUser } from "@/states/user/userSlice";
import { showSuccess, showError } from "@/utils/toast";

/**
 * Hook to access authentication state
 * Returns isLogin status and current user data from Redux store
 */
export const useAuth = () => {
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  return {
    isLogin,
    user: currentUser,
    isAuthenticated: isLogin,
  };
};

/**
 * Hook to fetch and set user profile in Redux store
 */
export const useAuthProfile = () => {
  const api = useAuthApi();
  const dispatch = useAppDispatch();

  const fetchAndSetProfile = useCallback(async () => {
    try {
      const response = await api.auth.getProfile();

      if (response.isSuccess) {
        const user = response.data;
        dispatch(
          setCurrentUser({
            _id: user._id,
            email: user.email,
            isEnabled: user.isEnabled,
            isEmailVerified: user.isEmailVerified,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            name: user.name,
            picture: user.picture,
            stats: {
              totalPlaylists: 0,
              totalSongs: 0,
              minutesListened: 0,
            },
          }),
        );
        return { success: true, user };
      }

      return { success: false, user: null };
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return { success: false, user: null };
    }
  }, [api, dispatch]);

  return { fetchAndSetProfile };
};

/**
 * Hook to handle Google OAuth callback flow
 * Extracts tokens from URL, stores them, and fetches user profile
 */
export const useGoogleCallback = () => {
  const navigate = useNavigate();
  const { fetchAndSetProfile } = useAuthProfile();

  const handleGoogleCallback = useCallback(async () => {
    // Get token and refresh params from URL
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("access");
    const refresh = searchParams.get("refresh");

    if (!token || !refresh) {
      showError("Failed to get authentication tokens");
      navigate("/");
      return;
    }

    // Store tokens
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refresh);

    navigate("/");

    // // Fetch and set user profile
    // const result = await fetchAndSetProfile();

    // if (result.success) {
    //   showSuccess("Login successfully");
    //   navigate("/");
    // } else {
    //   showError("Failed to fetch user profile");
    //   navigate("/");
    // }
  }, [navigate, fetchAndSetProfile]);

  return { handleGoogleCallback };
};

export const useProfile = () => {
  const { fetchAndSetProfile } = useAuthProfile();
  const { isLogin } = useAuth();

  const handleProfile = useCallback(async () => {
    if (isLogin) {
      return;
    }
    const result = await fetchAndSetProfile();
    if (result.success) {
      showSuccess("Login successfully");
      return result.user;
    } else {
      showError("Failed to fetch user profile");
      // Remove tokens from localStorage on failed profile fetch
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }, [fetchAndSetProfile]);

  return { handleProfile };
};

/**
 * Hook to handle user logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = useCallback(() => {
    // Clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Clear user state
    dispatch(removeCurrentUser());

    // Navigate to login
    showSuccess("Logged out successfully");

    navigate("/");
  }, [navigate, dispatch]);

  return { logout };
};
