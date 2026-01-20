import { useState, useCallback, useRef } from "react";

interface UseLongPressProps {
  onLongPress: () => void;
  duration?: number;
}

export function useLongPress({ onLongPress, duration = 1000 }: UseLongPressProps) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = useCallback(() => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, duration);
  }, [onLongPress, duration]);

  const handleEnd = useCallback(() => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    isPressed,
    handleStart,
    handleEnd,
  };
}
