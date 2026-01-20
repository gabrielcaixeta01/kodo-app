import { useState, useCallback } from "react";

const SWIPE_LIMIT = -120;
const DELETE_THRESHOLD = -80;

interface UseSwipeDeleteProps {
  onDelete: (id: string) => void;
}

export function useSwipeDelete({ onDelete }: UseSwipeDeleteProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [clickTimes, setClickTimes] = useState<Record<string, number>>({});
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const getClientX = useCallback(
    (e: TouchEvent | React.TouchEvent | React.MouseEvent) => {
      return "touches" in e ? e.touches[0].clientX : e.clientX;
    },
    []
  );

  const handleStart = useCallback(
    (id: string, e: unknown) => {
      setDraggingId(id);
      setStartX(
        getClientX(e as TouchEvent | React.TouchEvent | React.MouseEvent)
      );
      setClickTimes((prev) => ({ ...prev, [id]: Date.now() }));
    },
    [getClientX]
  );

  const handleMove = useCallback(
    (id: string, e: unknown) => {
      if (draggingId !== id) return;

      const currentX = getClientX(
        e as TouchEvent | React.TouchEvent | React.MouseEvent
      );
      let diff = currentX - startX;

      if (diff > 0) diff = 0;
      if (diff < SWIPE_LIMIT) diff = SWIPE_LIMIT;

      setOffsets((prev) => ({ ...prev, [id]: diff }));
    },
    [draggingId, startX, getClientX]
  );

  const handleEnd = useCallback(
    (id: string) => {
      const offset = offsets[id] || 0;

      if (offset < DELETE_THRESHOLD) {
        setDeletingIds((prev) => new Set(prev).add(id));
        setOffsets((prev) => ({ ...prev, [id]: -300 }));

        setTimeout(() => {
          onDelete(id);
          setDeletingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }, 300);
      } else {
        setOffsets((prev) => ({ ...prev, [id]: 0 }));
      }

      setDraggingId(null);
      setClickTimes((prev) => ({ ...prev, [id]: 0 }));
    },
    [offsets, onDelete]
  );

  return {
    draggingId,
    offsets,
    clickTimes,
    deletingIds,
    handleStart,
    handleMove,
    handleEnd,
  };
}
