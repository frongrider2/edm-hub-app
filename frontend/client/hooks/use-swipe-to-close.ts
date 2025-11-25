import { useRef, useCallback } from "react";

interface UseSwipeToCloseOptions {
  onClose: () => void;
  threshold?: number; // Minimum distance to trigger close (default: 100px)
}

export function useSwipeToClose({
  onClose,
  threshold = 100,
}: UseSwipeToCloseOptions) {
  const modalRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    // Only allow dragging downward
    if (deltaY > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${deltaY}px)`;
      modalRef.current.style.transition = "none";
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || !modalRef.current) return;

    const deltaY = currentY.current - startY.current;

    // If dragged more than threshold down, close the modal
    if (deltaY > threshold) {
      onClose();
    } else {
      // Reset position with animation
      modalRef.current.style.transform = "translateY(0)";
      modalRef.current.style.transition = "transform 0.3s ease-out";
    }

    isDragging.current = false;
  }, [onClose, threshold]);

  return {
    modalRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
