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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export function DropdownForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    text: "",
    dropdowns: [{
      options: [""],
      correctAnswer: 0,
    }],
    type: 'dropdown',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addDropdown = () => {
    setCurrentQuestion({
      ...currentQuestion,
      dropdowns: [...currentQuestion.dropdowns, {
        options: [""],
        correctAnswer: 0,
      }],
    });
  };

  const removeDropdown = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      dropdowns: currentQuestion.dropdowns.filter((_, i) => i !== index),
    });
  };

  const addOption = (dropdownIndex: number) => {
    const newDropdowns = [...currentQuestion.dropdowns];
    newDropdowns[dropdownIndex].options.push("");
    setCurrentQuestion({ ...currentQuestion, dropdowns: newDropdowns });
  };

  const removeOption = (dropdownIndex: number, optionIndex: number) => {
    const newDropdowns = [...currentQuestion.dropdowns];
    newDropdowns[dropdownIndex].options = newDropdowns[dropdownIndex].options.filter((_, i) => i !== optionIndex);
    if (newDropdowns[dropdownIndex].correctAnswer >= optionIndex) {
      newDropdowns[dropdownIndex].correctAnswer = Math.max(0, newDropdowns[dropdownIndex].correctAnswer - 1);
    }
    setCurrentQuestion({ ...currentQuestion, dropdowns: newDropdowns });
  };

  const updateOption = (dropdownIndex: number, optionIndex: number, value: string) => {
    const newDropdowns = [...currentQuestion.dropdowns];
    newDropdowns[dropdownIndex].options[optionIndex] = value;
    setCurrentQuestion({ ...currentQuestion, dropdowns: newDropdowns });
  };

  const setCorrectAnswer = (dropdownIndex: number, value: string) => {
    const newDropdowns = [...currentQuestion.dropdowns];
    newDropdowns[dropdownIndex].correctAnswer = parseInt(value);
    setCurrentQuestion({ ...currentQuestion, dropdowns: newDropdowns });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.text.trim()) {
      toast({
        title: "Error",
        description: "Please enter both question and text with placeholders",
        variant: "destructive",
      });
      return;
    }

    const emptyOptions = currentQuestion.dropdowns.some(
      dropdown => dropdown.options.some(option => !option.trim())
    );
    if (emptyOptions) {
      toast({
        title: "Error",
        description: "Please fill in all dropdown options",
        variant: "destructive",
      });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      text: "",
      dropdowns: [{
        options: [""],
        correctAnswer: 0,
      }],
      type: 'dropdown',
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
      type: 'dropdown',
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
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-muted-foreground">Text with placeholders: {q.text}</p>
                        <div className="space-y-2">
                          {q.dropdowns.map((dropdown: any, dropdownIndex: number) => (
                            <div key={dropdownIndex}>
                              <p className="text-sm font-medium">Dropdown {dropdownIndex + 1}:</p>
                              <div className="pl-4">
                                <p className="text-sm">Options: {dropdown.options.join(", ")}</p>
                                <p className="text-sm text-primary">
                                  Correct answer: {dropdown.options[dropdown.correctAnswer]}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
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
                    <FormLabel>Question</FormLabel>
                    <Input
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      placeholder="Enter your question"
                    />
                  </div>

                  <div>
                    <FormLabel>Text with Placeholders (use ___ for dropdown positions)</FormLabel>
                    <Input
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                      placeholder="Enter text with ___ for dropdowns"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Dropdowns</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addDropdown}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Dropdown
                      </Button>
                    </div>

                    {currentQuestion.dropdowns.map((dropdown, dropdownIndex) => (
                      <Card key={dropdownIndex} className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <FormLabel>Dropdown {dropdownIndex + 1} Options</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(dropdownIndex)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Option
                            </Button>
                          </div>

                          {dropdown.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(dropdownIndex, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              {dropdown.options.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(dropdownIndex, optionIndex)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}

                          <div>
                            <FormLabel>Correct Answer</FormLabel>
                            <Select
                              value={dropdown.correctAnswer.toString()}
                              onValueChange={(value) => setCorrectAnswer(dropdownIndex, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdown.options.map((option, optionIndex) => (
                                  <SelectItem key={optionIndex} value={optionIndex.toString()}>
                                    {option || `Option ${optionIndex + 1}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {currentQuestion.dropdowns.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full text-destructive"
                              onClick={() => removeDropdown(dropdownIndex)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Dropdown
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