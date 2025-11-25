import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: (e: any) => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
  ariaLabel?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10 md:h-11 md:w-11",
  lg: "h-12 w-12 md:h-14 md:w-14",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const variantClasses = {
  primary: "neon-button-primary",
  secondary:
    "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
};

/**
 * Reusable play/pause button component
 * Used in PlayerBar and can be used in track cards, etc.
 */
export function AddButton({
  onClick,
  size = "md",
  variant = "primary",
  className,
  ariaLabel,
}: PlayButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full p-0 transition-all",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      aria-label={ariaLabel || "Add to playlist"}
    >
      <Plus className={iconSizeClasses[size]} />
    </button>
  );
}
