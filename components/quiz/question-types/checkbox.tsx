"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxQuestion } from "@/types/quiz";
import { useState } from "react";

interface CheckboxProps {
  question: CheckboxQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function CheckboxQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: CheckboxProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleCheckboxChange = (index: number) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleSubmit = () => {
    if (disabled) return;

    const isCorrect =
      selectedAnswers.length === question.correctAnswers.length &&
      selectedAnswers.every((answer) => question.correctAnswers.includes(answer));

    onAnswer(isCorrect);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      <div className="space-y-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswers.includes(index);
          const isCorrect = question.correctAnswers.includes(index);
          
          return (
            <label
              key={index}
              className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer ${
                disabled ? "cursor-default" : ""
              } ${
                showAnswer
                  ? isCorrect
                    ? "bg-green-500/10"
                    : isSelected && !isCorrect
                    ? "bg-red-500/10"
                    : "bg-secondary/50"
                  : "hover:bg-secondary/50"
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => !disabled && handleCheckboxChange(index)}
                disabled={disabled}
              />
              <span className="flex-1">{option}</span>
              {showAnswer && isCorrect && (
                <span className="text-green-500 text-sm">Correct</span>
              )}
            </label>
          );
        })}
      </div>
      {!disabled && (
        <Button onClick={handleSubmit} className="w-full mt-6">
          Submit Answer
        </Button>
      )}
    </Card>
  );
}