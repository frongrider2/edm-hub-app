import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="p-3 rounded-2xl bg-primary text-primary-foreground"
            >
              <Music className="w-8 h-8" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">MusixHub</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-card/40 backdrop-blur border border-border/30 rounded-2xl p-8 shadow-2xl"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};
