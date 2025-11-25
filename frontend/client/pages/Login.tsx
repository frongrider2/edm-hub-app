import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm, { AuthFormValues } from "@/components/AuthForm";
import { useAppDispatch } from "@/states/hooks";
import { setCurrentUser } from "@/states/user/userSlice";
import { pageVariants } from "@/utils/motion";
import { usePublicApi } from "@/hooks/use-api";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { ENV } from "@/utils/env";

function Login(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const api = usePublicApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AuthFormValues) => {
    // Validate required fields
    if (!values.email || !values.password) {
      showError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const toastId = showLoading("Signing you in...");

    try {
      const response = await api.auth.login({
        email: values.email,
        password: values.password,
      });

      if (response.isSuccess && response.data) {
        // Store tokens in localStorage
        localStorage.setItem("access_token", response.data.tokens.accessToken);
        localStorage.setItem("refresh_token", response.data.tokens.refreshToken);

        // Set user in Redux store
        dispatch(
          setCurrentUser({
            _id: (response.data.user as any)._id || "",
            email: response.data.user.email,
            name: response.data.user.name,
            picture: response.data.user.picture || "",
            isEnabled: response.data.user.isEnabled,
            isEmailVerified: response.data.user.isEmailVerified,
            role: response.data.user.role,
            createdAt: response.data.user.createdAt,
            updatedAt: response.data.user.updatedAt,
            stats: {
              totalPlaylists: 0,
              totalSongs: 0,
              minutesListened: 0,
            },
          }),
        );

        dismissToast(toastId);
        showSuccess(`Welcome back, ${response.data.user.name}!`);
        
        // Navigate to home page
        navigate("/");
      } else {
        console.log(response);
        dismissToast(toastId);
        showError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      dismissToast(toastId);
      console.error("Login error:", error);
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const redirectUrl = `${ENV.API_ENDPOINT}/auth/google-login`;
    window.location.href = redirectUrl;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        isLoading={isSubmitting}
        footer={
          <p>
            New here?{" "}
            <Link to="/register" className="text-[hsl(var(--neon-cyan))]">
              Create an account
            </Link>
          </p>
        }
      />
    </motion.div>
  );
}

export default Login;
