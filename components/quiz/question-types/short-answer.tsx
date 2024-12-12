"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ShortAnswerQuestion } from "@/types/quiz";
import { useState } from "react";

interface ShortAnswerProps {
  question: ShortAnswerQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function ShortAnswerQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: ShortAnswerProps) {
  const [answer, setAnswer] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleTextChange = (value: string) => {
    setAnswer(value);
    setWordCount(countWords(value));
  };

  const handleSubmit = () => {
    if (disabled) return;

    // Check word count limits
    if (
      (question.minWords && wordCount < question.minWords) ||
      (question.maxWords && wordCount > question.maxWords)
    ) {
      return;
    }

    // Check if the answer contains required keywords
    const isCorrect = question.keywords.some((keyword) =>
      answer.toLowerCase().includes(keyword.toLowerCase())
    );

    onAnswer(isCorrect);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
      {(question.minWords || question.maxWords) && (
        <p className="text-sm text-muted-foreground mb-4">
          {question.minWords && `Minimum ${question.minWords} words`}
          {question.minWords && question.maxWords && " | "}
          {question.maxWords && `Maximum ${question.maxWords} words`}
        </p>
      )}
      <div className="space-y-4">
        <Textarea
          value={answer}
          onChange={(e) => handleTextChange(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer here..."
          className="min-h-[150px]"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{wordCount} words</span>
          {showAnswer && (
            <span className="text-primary">
              Sample answer: {question.sampleAnswer}
            </span>
          )}
        </div>
        {!disabled && (
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              (question.minWords && wordCount < question.minWords) ||
              (question.maxWords && wordCount > question.maxWords)
            }
          >
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
}