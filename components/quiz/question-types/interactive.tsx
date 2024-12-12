"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InteractiveQuestion } from "@/types/quiz";
import { HelpCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

interface InteractiveProps {
  question: InteractiveQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function InteractiveQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: InteractiveProps) {
  const [currentHint, setCurrentHint] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleHint = () => {
    if (currentHint < question.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
    setShowHint(true);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
        <iframe
          src={question.simulation}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      <div className="space-y-4">
        <div className="bg-secondary/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Success Conditions:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {question.successConditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </div>

        {!disabled && (
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleHint}
              className="flex-1"
              disabled={currentHint === question.hints.length - 1 && showHint}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              {showHint ? "Next Hint" : "Get Hint"}
            </Button>
            <Button
              onClick={() => onAnswer(true)}
              className="flex-1"
            >
              Submit Solution
            </Button>
          </div>
        )}

        {showHint && (
          <div className="bg-primary/10 p-4 rounded-lg flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-medium mb-1">Hint {currentHint + 1}:</div>
              <div className="text-sm">{question.hints[currentHint]}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}