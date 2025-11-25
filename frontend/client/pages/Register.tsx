import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm, { AuthFormValues } from "@/components/AuthForm";
import { useAppDispatch } from "@/states/hooks";
import { pageVariants } from "@/utils/motion";

function Register(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (values: AuthFormValues) => {};

  const handleGoogleSignIn = () => {};

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
