"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";

interface QuizTimerProps {
  duration: number;
  onTimeUp: () => void;
  disabled?: boolean;
}

export function QuizTimer({ duration, onTimeUp, disabled = false }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;

  useEffect(() => {
    if (timeLeft === 0 || disabled) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0 || disabled) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, disabled]);

  useEffect(() => {
    if (disabled) {
      setTimeLeft(0);
    }
  }, [disabled]);

  return (
    <div className="flex items-center gap-4 min-w-[120px]">
      <Timer className="w-4 h-4" />
      <div className="flex-1">
        <Progress 
          value={progress} 
          className={`h-2 transition-all duration-200 ${
            disabled ? 'opacity-50' : ''
          }`} 
        />
      </div>
      <div className="w-8 text-right font-mono">{timeLeft}s</div>
    </div>
  );
}