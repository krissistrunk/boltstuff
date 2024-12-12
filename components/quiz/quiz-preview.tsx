"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizQuestion } from "@/types/quiz";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { QuizTimer } from "./quiz-timer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuizPreviewProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export function QuizPreview({ title, description, questions }: QuizPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  if (questions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Add some questions to preview your quiz.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2">{title || "Untitled Quiz"}</h1>
        <p className="text-muted-foreground">{description || "No description provided."}</p>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <QuizTimer duration={20} onTimeUp={() => setShowAnswer(true)} disabled={showAnswer} />
        </div>

        <Progress value={progress} className="h-2" />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-3"
            disabled={showAnswer}
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-4 rounded-lg ${
                  showAnswer
                    ? index === currentQuestion.correctAnswer
                      ? "bg-green-500/10 border-green-500"
                      : selectedAnswer === index
                      ? "bg-red-500/10 border-red-500"
                      : "bg-secondary/50"
                    : "hover:bg-secondary/50"
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </label>
                {showAnswer && index === currentQuestion.correctAnswer && (
                  <span className="text-green-500 text-sm">Correct Answer</span>
                )}
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <div className="space-x-2">
              {!showAnswer && selectedAnswer !== null && (
                <Button onClick={() => setShowAnswer(true)}>
                  Check Answer
                </Button>
              )}
              {showAnswer && (
                <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}