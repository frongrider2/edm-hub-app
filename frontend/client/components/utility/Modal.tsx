import { useSwipeToClose } from "@/hooks/use-swipe-to-close";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  isBox?: boolean;
  className?: string;
  classNameContainer?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  isBox = false,
  className = "",
  classNameContainer = "",
}: ModalProps) {
  const { modalRef, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useSwipeToClose({ onClose });
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const sheetMotion = {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
    transition: { type: "spring", damping: 30, stiffness: 300 },
  } as const;

  const boxMotion = {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: 8 },
    transition: { duration: 0.2, ease: [0.22, 0.8, 0.4, 1] },
  } as const;

  const motionPreset = isBox ? boxMotion : sheetMotion;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[900] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div
            className={`fixed inset-0 z-[1000] flex justify-center pointer-events-none ${
              isBox ? "items-center p-4" : "items-center"
            }`}
          >
            <motion.div
              ref={!isBox ? modalRef : undefined}
              initial={motionPreset.initial}
              animate={motionPreset.animate}
              exit={motionPreset.exit}
              transition={motionPreset.transition}
              style={{ originY: isBox ? 0.5 : 0 }}
              className={cn(
                "w-full pointer-events-auto",
                isBox ? "max-w-md" : "max-w-md",
              )}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={!isBox ? handleTouchStart : undefined}
              onTouchMove={!isBox ? handleTouchMove : undefined}
              onTouchEnd={!isBox ? handleTouchEnd : undefined}
            >
              <div
                className={cn(
                  "overflow-y-auto bg-[rgba(10,10,17,0.96)] text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.9)] border border-white/10",
                  isBox
                    ? "rounded-2xl max-h-[95vh]"
                    : "rounded-b-2xl max-h-[95vh]",
                  className,
                )}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div
                    className={`sticky top-0 z-[1000] flex items-center justify-between gap-3 bg-[rgba(10,10,17,0.98)] px-4 py-3 backdrop-blur-md ${
                      isBox ? "rounded-t-2xl" : ""
                    }`}
                  >
                    {title && (
                      <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
                        {title}
                      </h2>
                    )}

                    <div className="flex flex-1 items-center justify-end gap-3">
                      {title && (
                        <div className="h-px flex-1 rounded-full bg-white/8" />
                      )}
                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/15 hover:text-foreground"
                          aria-label="Close modal"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className={cn("p-4", classNameContainer)}>{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
