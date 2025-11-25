import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants } from "@/utils/motion";

const NotFound = (): JSX.Element => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col items-center justify-center gap-4 text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-[hsl(var(--neon-pink))]" />
        Lost in the mix
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">404</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This route does not exist yet. Use the navigation to jump back into the
        playlist or discover view.
      </p>
      <Link to="/songs" className="neon-button-primary text-sm">
        Back to Discover
      </Link>
    </motion.div>
  );
};

export default NotFound;
