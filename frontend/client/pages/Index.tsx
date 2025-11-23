import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, ArrowRight, Play, BarChart3, Layers } from "lucide-react";

const Index: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: Music,
      title: "Discover Music",
      description: "Browse and search through thousands of songs",
    },
    {
      icon: Layers,
      title: "Create Playlists",
      description: "Organize your favorite songs into custom playlists",
    },
    {
      icon: BarChart3,
      title: "Your Profile",
      description: "Track your listening stats and saved songs",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation bar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-border/30 bg-background/30"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="p-2 rounded-lg bg-primary text-primary-foreground"
            >
              <Music className="w-6 h-6" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">MusixHub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex items-center justify-center pt-20 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
          >
            Lost In The
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/60">
              World Of Music
            </span>
            <br />
            With Us!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover your next favorite song, create playlists, and share your
            music taste with the world.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary/10 rounded-xl font-bold text-lg transition-all"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Hero Image Placeholder */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/30 backdrop-blur flex items-center justify-center group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-8 rounded-full bg-primary text-primary-foreground shadow-2xl"
              >
                <Play className="w-16 h-16 fill-current" />
              </motion.div>

              {/* Floating music note animations */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="absolute text-primary/40 text-4xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                >
                  ♪
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-200px" }}
        className="py-20 px-4 relative"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose MusixHub?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for an amazing music experience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group p-8 bg-card/40 backdrop-blur border border-border/30 rounded-xl hover:bg-card/60 transition-all hover:border-border/50"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="p-4 rounded-lg bg-primary/20 text-primary w-fit mb-4 group-hover:bg-primary/30 transition-colors"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-200px" }}
        className="py-20 px-4 relative"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-border/30 rounded-2xl p-12 text-center backdrop-blur"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to Start?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of music lovers and discover your new favorite
              songs today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="border-t border-border/30 bg-background/50 backdrop-blur py-8 px-4"
      >
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 MusixHub. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
