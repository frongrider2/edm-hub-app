import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import PlayerBar from "./PlayerBar";
import MobileNav from "./MobileNav";
import { useEffect } from "react";
import { useProfile } from "@/hooks/use-auth";
import ContainerScroll from "@/components/layout/ContainerScroll";

function AppLayout(): JSX.Element {
  const { handleProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      handleProfile();
    } else {
      if (location.pathname === "/profile") {
        navigate("/");
      }
    }
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-transparent text-foreground relative">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 overflow-hidden px-4 py-8 md:flex-row md:px-6 md:py-8">
        <div className="hidden md:block md:w-64">
          <Sidebar />
        </div>
        <motion.main
          layout
          className="md:glass-panel flex flex-1 flex-col overflow-hidden md:rounded-3xl md:border border-white/10 md:bg-black/40 md:px-6 md:py-6"
        >
          <div className="relative flex-1 overflow-hidden md:rounded-2xl md:bg-gradient-to-b from-white/5 via-white/0 to-white/5">
            <div className="h-full overflow-hidden md:rounded-2xl md:bg-gradient-to-b from-black/60 via-black/40 to-black/60 md:p-3">
              <ContainerScroll>
                <Outlet />
              </ContainerScroll>
            </div>
          </div>
        </motion.main>
      </div>
      <PlayerBar />
      <MobileNav />
    </div>
  );
}

export default AppLayout;
