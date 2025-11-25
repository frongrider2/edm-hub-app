import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Mobile navigation item component
 * Displays a navigation link with icon and label for mobile bottom navigation
 */
export function MobileNavItem({
  to,
  label,
  icon,
}: MobileNavItemProps): JSX.Element {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-medium transition",
          isActive ? "text-[hsl(var(--neon-cyan))]" : "text-muted-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-white/5 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.75)]",
              isActive
                ? "border-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-purple))/20] text-[hsl(var(--neon-cyan))]"
                : "text-muted-foreground",
            )}
            aria-hidden
          >
            {icon}
          </span>
          <span className="leading-none">{label}</span>
        </>
      )}
    </NavLink>
  );
}
