"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrueFalseQuestion } from "@/types/quiz";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface TrueFalseProps {
  question: TrueFalseQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function TrueFalseQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: TrueFalseProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleAnswer = (answer: boolean) => {
    if (disabled) return;
    setSelected(answer);
    onAnswer(answer === question.correctAnswer);
  };

  const getButtonStyle = (value: boolean) => {
    if (!showAnswer) {
      return selected === value ? "bg-primary text-primary-foreground" : "";
    }

    if (value === question.correctAnswer) {
      return "bg-green-500 text-white";
    }

    if (selected === value && value !== question.correctAnswer) {
      return "bg-red-500 text-white";
    }

    return "opacity-50";
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      <div className="flex gap-4">
        <Button
          className={`flex-1 h-16 text-lg ${getButtonStyle(true)}`}
          variant="outline"
          onClick={() => handleAnswer(true)}
          disabled={disabled}
        >
          <Check className="w-6 h-6 mr-2" />
          True
        </Button>
        <Button
          className={`flex-1 h-16 text-lg ${getButtonStyle(false)}`}
          variant="outline"
          onClick={() => handleAnswer(false)}
          disabled={disabled}
        >
          <X className="w-6 h-6 mr-2" />
          False
        </Button>
      </div>
    </Card>
  );
}