import { motion } from "framer-motion";
import { pageVariants } from "@/utils/motion";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useGoogleCallback } from "@/hooks/use-auth";

const GoogleCallback = (): JSX.Element => {
  const { handleGoogleCallback } = useGoogleCallback();

  useEffect(() => {
    handleGoogleCallback();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col items-center justify-center gap-4 text-center"
    >
      <div>
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    </motion.div>
  );
};

export default GoogleCallback;
