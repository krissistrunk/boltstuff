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

export function ShortAnswerForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    sampleAnswer: "",
    keywords: [""],
    minWords: 0,
    maxWords: 100,
    type: 'short-answer',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addKeyword = () => {
    setCurrentQuestion({
      ...currentQuestion,
      keywords: [...currentQuestion.keywords, ""],
    });
  };

  const removeKeyword = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      keywords: currentQuestion.keywords.filter((_, i) => i !== index),
    });
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...currentQuestion.keywords];
    newKeywords[index] = value;
    setCurrentQuestion({ ...currentQuestion, keywords: newKeywords });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.sampleAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please enter both question and sample answer",
        variant: "destructive",
      });
      return;
    }

    const emptyKeywords = currentQuestion.keywords.some(keyword => !keyword.trim());
    if (emptyKeywords) {
      toast({
        title: "Error",
        description: "Please fill in all keywords",
        variant: "destructive",
      });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      sampleAnswer: "",
      keywords: [""],
      minWords: 0,
      maxWords: 100,
      type: 'short-answer',
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
      type: 'short-answer',
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
                        <p><span className="text-muted-foreground">Sample answer:</span> {q.sampleAnswer}</p>
                        <p><span className="text-muted-foreground">Keywords:</span> {q.keywords.join(", ")}</p>
                        <p className="text-sm text-muted-foreground">
                          Word limit: {q.minWords} - {q.maxWords} words
                        </p>
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
                    <FormLabel>Sample Answer</FormLabel>
                    <Textarea
                      value={currentQuestion.sampleAnswer}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, sampleAnswer: e.target.value })}
                      placeholder="Enter a sample answer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Minimum Words</FormLabel>
                      <Input
                        type="number"
                        value={currentQuestion.minWords}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, minWords: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>
                    <div>
                      <FormLabel>Maximum Words</FormLabel>
                      <Input
                        type="number"
                        value={currentQuestion.maxWords}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, maxWords: parseInt(e.target.value) })}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Keywords (for answer validation)</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addKeyword}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Keyword
                      </Button>
                    </div>

                    {currentQuestion.keywords.map((keyword, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={keyword}
                          onChange={(e) => updateKeyword(index, e.target.value)}
                          placeholder="Enter keyword"
                        />
                        {currentQuestion.keywords.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKeyword(index)}
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