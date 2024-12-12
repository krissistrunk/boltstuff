"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizTimer } from "./quiz-timer";
import { PlayerScores } from "./player-scores";
import { useRouter } from "next/navigation";
import { sampleQuestions } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

interface QuizGameProps {
  code: string;
  playerName: string;
}

interface QuestionState {
  selectedAnswer: number | null;
  isAnswered: boolean;
}

export function QuizGame({ code, playerName }: QuizGameProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionState, setQuestionState] = useState<QuestionState>({
    selectedAnswer: null,
    isAnswered: false,
  });

  // Get questions once at component mount
  const questions = useState(() => [
    ...sampleQuestions.science,
    ...sampleQuestions.history,
    ...sampleQuestions.technology,
  ].sort(() => Math.random() - 0.5).slice(0, 5))[0];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (questionState.isAnswered) return;

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setQuestionState({
      selectedAnswer: answerIndex,
      isAnswered: true,
    });

    if (isCorrect) {
      setScore(score + 100);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionState({
        selectedAnswer: null,
        isAnswered: false,
      });
    } else {
      router.push(`/quiz/${code}/results?name=${playerName}&score=${score}`);
    }
  };

  const handleTimeUp = () => {
    if (questionState.isAnswered) return;
    setQuestionState({
      selectedAnswer: null,
      isAnswered: true,
    });
  };

  const getButtonStyles = (index: number) => {
    if (!questionState.isAnswered) {
      return {
        variant: "outline" as const,
        className: "hover:bg-secondary/80"
      };
    }

    // This is the correct answer
    if (index === currentQuestion.correctAnswer) {
      return {
        variant: "outline" as const,
        className: questionState.selectedAnswer === index 
          ? "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/20"  // User selected correct answer
          : "bg-blue-500/20 border-blue-500 text-blue-500 hover:bg-blue-500/20"      // Show correct answer
      };
    }

    // User selected wrong answer
    if (index === questionState.selectedAnswer) {
      return {
        variant: "outline" as const,
        className: "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/20"
      };
    }

    // Unselected wrong answers
    return {
      variant: "outline" as const,
      className: "opacity-50"
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Question {currentQuestionIndex + 1}</h1>
        <div className="text-xl font-semibold">Score: {score}</div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <QuizTimer 
            duration={20} 
            onTimeUp={handleTimeUp} 
            key={currentQuestionIndex}
            disabled={questionState.isAnswered} 
          />
        </div>

        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            const buttonStyles = getButtonStyles(index);
            return (
              <Button
                key={index}
                variant={buttonStyles.variant}
                className={cn("p-6 h-auto text-lg justify-start", buttonStyles.className)}
                onClick={() => handleAnswerSelect(index)}
                disabled={questionState.isAnswered}
              >
                {option}
              </Button>
            );
          })}
        </div>

        {questionState.isAnswered && (
          <Button 
            onClick={handleNextQuestion} 
            className="w-full mt-6"
          >
            {currentQuestionIndex + 1 < questions.length ? "Next Question" : "View Results"}
          </Button>
        )}
      </Card>

      <PlayerScores />
    </div>
  );
}