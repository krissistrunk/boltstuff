"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownQuestion } from "@/types/quiz";
import { useState } from "react";

interface DropdownProps {
  question: DropdownQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function DropdownQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: DropdownProps) {
  const [answers, setAnswers] = useState<number[]>(
    new Array(question.dropdowns.length).fill(-1)
  );

  const handleSelect = (value: string, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (disabled) return;

    const isCorrect = answers.every(
      (answer, index) => answer === question.dropdowns[index].correctAnswer
    );
    onAnswer(isCorrect);
  };

  // Split the text into segments based on dropdown positions
  const textSegments = question.text.split("___");

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {textSegments.map((segment, index) => (
            <div key={index} className="flex items-center">
              <span>{segment}</span>
              {index < question.dropdowns.length && (
                <Select
                  value={answers[index].toString()}
                  onValueChange={(value) => handleSelect(value, index)}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-[200px] mx-2">
                    <SelectValue placeholder="Select answer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {question.dropdowns[index].options.map((option, optIndex) => (
                      <SelectItem
                        key={optIndex}
                        value={optIndex.toString()}
                        className={
                          showAnswer &&
                          optIndex === question.dropdowns[index].correctAnswer
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
        {!disabled && (
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={answers.includes(-1)}
          >
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
}