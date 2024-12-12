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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export function CheckboxForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: [""],
    correctAnswers: [] as number[],
    type: 'checkbox',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, ""],
    });
  };

  const removeOption = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((_, i) => i !== index),
      correctAnswers: currentQuestion.correctAnswers
        .filter(i => i !== index)
        .map(i => (i > index ? i - 1 : i)),
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const toggleCorrectAnswer = (index: number) => {
    const newCorrectAnswers = currentQuestion.correctAnswers.includes(index)
      ? currentQuestion.correctAnswers.filter(i => i !== index)
      : [...currentQuestion.correctAnswers, index];
    setCurrentQuestion({ ...currentQuestion, correctAnswers: newCorrectAnswers });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    const emptyOptions = currentQuestion.options.some(option => !option.trim());
    if (emptyOptions) {
      toast({
        title: "Error",
        description: "Please fill in all options",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion.correctAnswers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one correct answer",
        variant: "destructive",
      });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      options: [""],
      correctAnswers: [],
      type: 'checkbox',
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
      type: 'checkbox',
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
                        {q.options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Checkbox checked={q.correctAnswers.includes(optionIndex)} disabled />
                            <span className={q.correctAnswers.includes(optionIndex) ? "text-primary" : ""}>
                              {option}
                            </span>
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
                    <FormLabel>Question</FormLabel>
                    <Input
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Options (select all correct answers)</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addOption}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Option
                      </Button>
                    </div>

                    {currentQuestion.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Checkbox
                          checked={currentQuestion.correctAnswers.includes(optionIndex)}
                          onCheckedChange={() => toggleCorrectAnswer(optionIndex)}
                        />
                        <Input
                          value={option}
                          onChange={(e) => updateOption(optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1"
                        />
                        {currentQuestion.options.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(optionIndex)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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