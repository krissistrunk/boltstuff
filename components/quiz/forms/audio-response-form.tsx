"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { QuizPreview } from "../quiz-preview";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export function AudioResponseForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    audioUrl: "",
    questions: [{
      question: "",
      options: [""],
      correctAnswer: 0,
    }],
    type: 'audio-response',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addSubQuestion = () => {
    setCurrentQuestion({
      ...currentQuestion,
      questions: [...currentQuestion.questions, {
        question: "",
        options: [""],
        correctAnswer: 0,
      }],
    });
  };

  const removeSubQuestion = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      questions: currentQuestion.questions.filter((_, i) => i !== index),
    });
  };

  const updateSubQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...currentQuestion.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, questions: newQuestions });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...currentQuestion.questions];
    newQuestions[questionIndex].options.push("");
    setCurrentQuestion({ ...currentQuestion, questions: newQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...currentQuestion.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    if (newQuestions[questionIndex].correctAnswer >= optionIndex) {
      newQuestions[questionIndex].correctAnswer = Math.max(0, newQuestions[questionIndex].correctAnswer - 1);
    }
    setCurrentQuestion({ ...currentQuestion, questions: newQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...currentQuestion.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setCurrentQuestion({ ...currentQuestion, questions: newQuestions });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.audioUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter both main question and audio URL",
        variant: "destructive",
      });
      return;
    }

    const emptySubQuestions = currentQuestion.questions.some(
      q => !q.question.trim() || q.options.some(opt => !opt.trim())
    );
    if (emptySubQuestions) {
      toast({
        title: "Error",
        description: "Please fill in all sub-questions and their options",
        variant: "destructive",
      });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      audioUrl: "",
      questions: [{
        question: "",
        options: [""],
        correctAnswer: 0,
      }],
      type: 'audio-response',
    });

    toast({
      title: "Success",
      description: "Question added successfully",
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question",
        variant: "destructive",
      });
      return;
    }

    const quizCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    localStorage.setItem(quizCode, JSON.stringify({
      ...values,
      questions,
      type: 'audio-response',
      createdAt: new Date().toISOString(),
    }));

    toast({
      title: "Success",
      description: "Quiz created successfully!",
    });

    router.push(`/quiz/${quizCode}/lobby?name=Host`);
  }

  return (
    <Tabs defaultValue="edit">
      <TabsList className="mb-4">
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="edit">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter quiz description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Questions ({questions.length})</FormLabel>
              </div>

              {questions.map((q, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{q.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">Audio: {q.audioUrl}</p>
                      <div className="mt-4 space-y-4">
                        {q.questions.map((subQ: any, subIndex: number) => (
                          <div key={subIndex} className="pl-4 border-l-2">
                            <p className="font-medium">{subQ.question}</p>
                            <div className="mt-2 space-y-1">
                              {subQ.options.map((option: string, optIndex: number) => (
                                <p key={optIndex} className={optIndex === subQ.correctAnswer ? "text-primary" : ""}>
                                  {option}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
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

              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <FormLabel>Main Question</FormLabel>
                    <Input
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      placeholder="Enter main question"
                    />
                  </div>

                  <div>
                    <FormLabel>Audio URL</FormLabel>
                    <Input
                      value={currentQuestion.audioUrl}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, audioUrl: e.target.value })}
                      placeholder="Enter audio URL"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Sub-Questions</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addSubQuestion}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sub-Question
                      </Button>
                    </div>

                    {currentQuestion.questions.map((subQuestion, questionIndex) => (
                      <Card key={questionIndex} className="p-4">
                        <div className="space-y-4">
                          <div>
                            <FormLabel>Sub-Question {questionIndex + 1}</FormLabel>
                            <Input
                              value={subQuestion.question}
                              onChange={(e) => updateSubQuestion(questionIndex, "question", e.target.value)}
                              placeholder="Enter sub-question"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <FormLabel>Options</FormLabel>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(questionIndex)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                              </Button>
                            </div>

                            <RadioGroup
                              value={subQuestion.correctAnswer.toString()}
                              onValueChange={(value) => updateSubQuestion(questionIndex, "correctAnswer", parseInt(value))}
                            >
                              {subQuestion.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={optionIndex.toString()}
                                    id={`question-${questionIndex}-option-${optionIndex}`}
                                  />
                                  <div className="flex-1">
                                    <Input
                                      value={option}
                                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                  </div>
                                  {subQuestion.options.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeOption(questionIndex, optionIndex)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {currentQuestion.questions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full text-destructive"
                              onClick={() => removeSubQuestion(questionIndex)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Sub-Question
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button type="button" onClick={addQuestion} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </Card>
            </div>

            <Button type="submit" className="w-full">Create Quiz</Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview">
        <QuizPreview 
          title={form.getValues("title")}
          description={form.getValues("description")}
          questions={questions}
        />
      </TabsContent>
    </Tabs>
  );
}