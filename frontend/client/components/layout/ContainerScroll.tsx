import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * ContainerScroll - A scrollable container component
 * This is the only component that should scroll in the app.
 * The main app layout is fixed height with overflow-hidden.
 */
function ContainerScroll({ children, className }: ContainerScrollProps): JSX.Element {
  return (
    <div
      className={cn(
        "neon-scrollbar h-full w-full overflow-y-auto overflow-x-hidden pb-20 md:pb-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export default ContainerScroll;

