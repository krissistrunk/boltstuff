"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScenarioQuestion } from "@/types/quiz";
import { useState } from "react";

interface ScenarioProps {
  question: ScenarioQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function ScenarioQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: ScenarioProps) {
  const [answers, setAnswers] = useState<number[]>(
    new Array(question.questions.length).fill(-1)
  );

  const handleAnswer = (questionIndex: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const isCorrect = answers.every(
      (answer, index) => answer === question.questions[index].correctAnswer
    );
    onAnswer(isCorrect);
  };

  return (
    <Card className="p-6">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        <div className="bg-secondary/50 p-4 rounded-lg mb-6">
          {question.scenario}
        </div>
      </div>

      <div className="space-y-8">
        {question.questions.map((q, questionIndex) => (
          <div key={questionIndex} className="space-y-4">
            <h4 className="font-medium">{q.question}</h4>
            <RadioGroup
              value={answers[questionIndex].toString()}
              onValueChange={(value) => handleAnswer(questionIndex, value)}
              disabled={disabled}
            >
              {q.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`flex items-center space-x-2 p-4 rounded-lg ${
                    showAnswer
                      ? optionIndex === q.correctAnswer
                        ? "bg-green-500/10"
                        : answers[questionIndex] === optionIndex
                        ? "bg-red-500/10"
                        : ""
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    id={`q${questionIndex}-o${optionIndex}`}
                  />
                  <label
                    htmlFor={`q${questionIndex}-o${optionIndex}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {showAnswer && (
              <div className="text-sm bg-secondary/50 p-4 rounded-lg mt-2">
                <span className="font-medium">Explanation: </span>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!disabled && !answers.includes(-1) && (
        <Button onClick={handleSubmit} className="w-full mt-6">
          Submit Answers
        </Button>
      )}
    </Card>
  );
}