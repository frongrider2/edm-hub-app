import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm, { AuthFormValues } from "@/components/AuthForm";
import { useAppDispatch } from "@/states/hooks";
import { pageVariants } from "@/utils/motion";
import { usePublicApi } from "@/hooks/use-api";
import { toast } from "@/utils/toast";
import { ENV } from "@/utils/env";

function Login(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const api = usePublicApi();

  const handleSubmit = (values: AuthFormValues) => {};

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
