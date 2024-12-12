"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FillBlankQuestion } from "@/types/quiz";
import { useState } from "react";

interface FillBlankProps {
  question: FillBlankQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function FillBlankQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: FillBlankProps) {
  const [answers, setAnswers] = useState<string[]>(
    new Array(question.blanks.length).fill("")
  );

  const handleAnswer = () => {
    if (disabled) return;
    
    const isCorrect = answers.every((answer, index) => {
      const acceptableAnswers = question.acceptableAnswers[index];
      return acceptableAnswers.some(
        (acceptable) => answer.toLowerCase().trim() === acceptable.toLowerCase()
      );
    });

    onAnswer(isCorrect);
  };

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      <div className="space-y-4">
        {question.blanks.map((blank, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>{blank.before}</span>
            <Input
              className="w-40"
              value={answers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              disabled={disabled}
              placeholder="Type your answer"
            />
            <span>{blank.after}</span>
            {showAnswer && (
              <span className="text-green-500 ml-2">
                Answer: {question.acceptableAnswers[index][0]}
              </span>
            )}
          </div>
        ))}
        {!disabled && (
          <Button onClick={handleAnswer} className="w-full mt-4">
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
}