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

function Register(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const api = usePublicApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AuthFormValues) => {
    // Validate required fields
    if (!values.email || !values.password || !values.name) {
      showError("Please fill in all required fields");
      return;
    }

    // Validate password confirmation if provided
    if (values.confirmPassword && values.password !== values.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const toastId = showLoading("Creating your account...");

    try {
      const response = await api.auth.register({
        email: values.email,
        password: values.password,
        name: values.name,
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
        showSuccess("Account created successfully! Welcome to EDM Hub!");
        
        // Navigate to home/songs page
        navigate("/");
      } else {
        console.log(response)
        dismissToast(toastId);
        showError(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      dismissToast(toastId);
      console.error("Registration error:", error);
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
        mode="register"
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        isLoading={isSubmitting}
        footer={
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-[hsl(var(--neon-cyan))]">
              Login
            </Link>
          </p>
        }
      />
    </motion.div>
  );
}

export default Register;
