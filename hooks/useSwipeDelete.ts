import { useRef, useState, useCallback } from "react";

const SWIPE_LIMIT = -120;
const DELETE_THRESHOLD = -80;

interface UseSwipeDeleteProps {
  onDelete: (id: string) => void;
}

export function useSwipeDelete({ onDelete }: UseSwipeDeleteProps) {
  const startX = useRef(0);
  const draggingId = useRef<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el;
  };

  const handleStart = useCallback(
    (id: string, e: React.PointerEvent) => {
      draggingId.current = id;
      startX.current = e.clientX;

      const el = cardRefs.current[id];
      if (el) {
        el.style.transition = "none";
      }
    },
    []
  );

  const handleMove = useCallback((id: string, e: React.PointerEvent) => {
    if (draggingId.current !== id) return;

    const diff = Math.min(
      0,
      Math.max(SWIPE_LIMIT, e.clientX - startX.current)
    );

    const el = cardRefs.current[id];
    if (el) {
      el.style.transform = `translateX(${diff}px)`;
    }
  }, []);

  const handleEnd = useCallback(
    (id: string) => {
      const el = cardRefs.current[id];
      if (!el) return;

      const matrix = new DOMMatrixReadOnly(
        getComputedStyle(el).transform
      );
      const offset = matrix.m41;

      if (offset < DELETE_THRESHOLD) {
        setDeletingIds(prev => new Set(prev).add(id));

        el.style.transition =
          "transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.25s ease-out";
        el.style.transform = "translateX(-120vw)";
        el.style.opacity = "0";

        setTimeout(() => {
          onDelete(id);
          setDeletingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 250);
      } else {
        // ✅ SNAP BACK SUAVE
        el.style.transition =
          "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)";
        el.style.transform = "translateX(0)";
      }

      draggingId.current = null;
    },
    [onDelete]
  );

  return {
    setRef,
    deletingIds,
    handleStart,
    handleMove,
    handleEnd,
  };
}
