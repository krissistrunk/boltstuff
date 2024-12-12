"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizQuestion } from "@/types/quiz";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface QuestionListProps {
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
}

export function QuestionList({ questions, setQuestions }: QuestionListProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  const addQuestion = () => {
    // Validate question
    if (!currentQuestion.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    // Validate options
    const emptyOptions = currentQuestion.options.filter(opt => !opt.trim());
    if (emptyOptions.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all options",
        variant: "destructive",
      });
      return;
    }

    // Add the question
    setQuestions([...questions, { ...currentQuestion }]);
    
    // Reset form
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });

    // Show success message
    toast({
      title: "Success",
      description: "Question added successfully",
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Questions ({questions.length})</Label>
        {questions.map((q, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">{q.question}</p>
                <ul className="mt-2 space-y-1">
                  {q.options.map((option, i) => (
                    <li key={i} className={i === q.correctAnswer ? "text-green-600 font-medium" : ""}>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Question</Label>
            <Input
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
              placeholder="Enter your question"
            />
          </div>

          <div className="space-y-2">
            <Label>Options (select the correct answer)</Label>
            <RadioGroup
              value={currentQuestion.correctAnswer.toString()}
              onValueChange={(value) =>
                setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(value) })
              }
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button type="button" onClick={addQuestion} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </Card>
    </div>
  );
}