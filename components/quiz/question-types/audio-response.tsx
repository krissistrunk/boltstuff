"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AudioResponseQuestion } from "@/types/quiz";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useState, useRef } from "react";

interface AudioResponseProps {
  question: AudioResponseQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function AudioResponseQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: AudioResponseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<number[]>(
    new Array(question.questions.length).fill(-1)
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

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
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      
      <div className="mb-8">
        <audio
          ref={audioRef}
          src={question.audioUrl}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={restart}
            className="w-12 h-12"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
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
                  {showAnswer && optionIndex === q.correctAnswer && (
                    <span className="text-green-500 text-sm">Correct</span>
                  )}
                </div>
              ))}
            </RadioGroup>
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