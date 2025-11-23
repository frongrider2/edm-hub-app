import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";

const NotFound: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(user ? "/songs" : "/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6 flex justify-center"
        >
          <Music className="w-24 h-24 text-primary/40" />
        </motion.div>

        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Looks like this page doesn't exist. Let's get you back to the music!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
