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

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export function InteractiveForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    simulation: "",
    successConditions: [""],
    hints: [""],
    type: 'interactive',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addSuccessCondition = () => {
    setCurrentQuestion({
      ...currentQuestion,
      successConditions: [...currentQuestion.successConditions, ""],
    });
  };

  const removeSuccessCondition = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      successConditions: currentQuestion.successConditions.filter((_, i) => i !== index),
    });
  };

  const updateSuccessCondition = (index: number, value: string) => {
    const newConditions = [...currentQuestion.successConditions];
    newConditions[index] = value;
    setCurrentQuestion({ ...currentQuestion, successConditions: newConditions });
  };

  const addHint = () => {
    setCurrentQuestion({
      ...currentQuestion,
      hints: [...currentQuestion.hints, ""],
    });
  };

  const removeHint = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      hints: currentQuestion.hints.filter((_, i) => i !== index),
    });
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...currentQuestion.hints];
    newHints[index] = value;
    setCurrentQuestion({ ...currentQuestion, hints: newHints });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.simulation.trim()) {
      toast({
        title: "Error",
        description: "Please enter both question and simulation URL",
        variant: "destructive",
      });
      return;
    }

    const emptyConditions = currentQuestion.successConditions.some(cond => !cond.trim());
    const emptyHints = currentQuestion.hints.some(hint => !hint.trim());
    if (emptyConditions || emptyHints) {
      toast({
        title: "Error",
        description: "Please fill in all success conditions and hints",
        variant: "destructive",
      });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      simulation: "",
      successConditions: [""],
      hints: [""],
      type: 'interactive',
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
      type: 'interactive',
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
                      <p className="text-sm text-muted-foreground mt-1">Simulation URL: {q.simulation}</p>
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-sm font-medium">Success Conditions:</p>
                          <ul className="list-disc list-inside">
                            {q.successConditions.map((condition: string, i: number) => (
                              <li key={i} className="text-sm">{condition}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hints:</p>
                          <ul className="list-disc list-inside">
                            {q.hints.map((hint: string, i: number) => (
                              <li key={i} className="text-sm">{hint}</li>
                            ))}
                          </ul>
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
                    <FormLabel>Simulation URL</FormLabel>
                    <Input
                      value={currentQuestion.simulation}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, simulation: e.target.value })}
                      placeholder="Enter simulation URL"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Success Conditions</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addSuccessCondition}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>

                    {currentQuestion.successConditions.map((condition, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={condition}
                          onChange={(e) => updateSuccessCondition(index, e.target.value)}
                          placeholder="Enter success condition"
                        />
                        {currentQuestion.successConditions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSuccessCondition(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Hints</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addHint}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Hint
                      </Button>
                    </div>

                    {currentQuestion.hints.map((hint, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={hint}
                          onChange={(e) => updateHint(index, e.target.value)}
                          placeholder="Enter hint"
                        />
                        {currentQuestion.hints.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHint(index)}
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