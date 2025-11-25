import { Outlet, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

function AuthLayout(): JSX.Element {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/");
    } else {
    }
  }, []);
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 md:items-center">
        <motion.section
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back</span>
            </Link>
          </div>
          <Outlet />
        </motion.section>
      </div>
    </div>
  );
}

export default AuthLayout;
