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

export function FillBlankForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    blanks: [{ before: "", answer: "", after: "" }],
    acceptableAnswers: [[""]],
    type: 'fill-blank',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addBlank = () => {
    setCurrentQuestion({
      ...currentQuestion,
      blanks: [...currentQuestion.blanks, { before: "", answer: "", after: "" }],
      acceptableAnswers: [...currentQuestion.acceptableAnswers, [""]],
    });
  };

  const removeBlank = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      blanks: currentQuestion.blanks.filter((_, i) => i !== index),
      acceptableAnswers: currentQuestion.acceptableAnswers.filter((_, i) => i !== index),
    });
  };

  const updateBlank = (index: number, field: keyof typeof currentQuestion.blanks[0], value: string) => {
    const newBlanks = [...currentQuestion.blanks];
    newBlanks[index] = { ...newBlanks[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, blanks: newBlanks });
  };

  const addAlternativeAnswer = (blankIndex: number) => {
    const newAcceptableAnswers = [...currentQuestion.acceptableAnswers];
    newAcceptableAnswers[blankIndex] = [...newAcceptableAnswers[blankIndex], ""];
    setCurrentQuestion({ ...currentQuestion, acceptableAnswers: newAcceptableAnswers });
  };

  const updateAcceptableAnswer = (blankIndex: number, answerIndex: number, value: string) => {
    const newAcceptableAnswers = [...currentQuestion.acceptableAnswers];
    newAcceptableAnswers[blankIndex][answerIndex] = value;
    setCurrentQuestion({ ...currentQuestion, acceptableAnswers: newAcceptableAnswers });
  };

  const removeAcceptableAnswer = (blankIndex: number, answerIndex: number) => {
    const newAcceptableAnswers = [...currentQuestion.acceptableAnswers];
    newAcceptableAnswers[blankIndex] = newAcceptableAnswers[blankIndex].filter((_, i) => i !== answerIndex);
    setCurrentQuestion({ ...currentQuestion, acceptableAnswers: newAcceptableAnswers });
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

    const emptyBlanks = currentQuestion.blanks.some(
      blank => !blank.answer.trim() || currentQuestion.acceptableAnswers[currentQuestion.blanks.indexOf(blank)].some(answer => !answer.trim())
    );

    if (emptyBlanks) {
      toast({
        title: "Error",
        description: "Please fill in all blanks and their acceptable answers",
        variant: "destructive",
      });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      blanks: [{ before: "", answer: "", after: "" }],
      acceptableAnswers: [[""]],
      type: 'fill-blank',
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
      type: 'fill-blank',
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
                        {q.blanks.map((blank: any, blankIndex: number) => (
                          <div key={blankIndex}>
                            <p>
                              {blank.before}
                              <span className="text-primary font-bold mx-1">
                                {blank.answer}
                              </span>
                              {blank.after}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Alternative answers: {q.acceptableAnswers[blankIndex].join(", ")}
                            </p>
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
                      <FormLabel>Blanks</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addBlank}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Blank
                      </Button>
                    </div>

                    {currentQuestion.blanks.map((blank, blankIndex) => (
                      <Card key={blankIndex} className="p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <FormLabel>Before</FormLabel>
                              <Input
                                value={blank.before}
                                onChange={(e) => updateBlank(blankIndex, "before", e.target.value)}
                                placeholder="Text before blank"
                              />
                            </div>
                            <div>
                              <FormLabel>Answer</FormLabel>
                              <Input
                                value={blank.answer}
                                onChange={(e) => updateBlank(blankIndex, "answer", e.target.value)}
                                placeholder="Correct answer"
                              />
                            </div>
                            <div>
                              <FormLabel>After</FormLabel>
                              <Input
                                value={blank.after}
                                onChange={(e) => updateBlank(blankIndex, "after", e.target.value)}
                                placeholder="Text after blank"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <FormLabel>Alternative Answers</FormLabel>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addAlternativeAnswer(blankIndex)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Alternative
                              </Button>
                            </div>

                            {currentQuestion.acceptableAnswers[blankIndex].map((answer, answerIndex) => (
                              <div key={answerIndex} className="flex gap-2">
                                <Input
                                  value={answer}
                                  onChange={(e) => updateAcceptableAnswer(blankIndex, answerIndex, e.target.value)}
                                  placeholder="Alternative answer"
                                />
                                {answerIndex > 0 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAcceptableAnswer(blankIndex, answerIndex)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          {currentQuestion.blanks.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full text-destructive"
                              onClick={() => removeBlank(blankIndex)}
                            >
                              <Trash2 className="w-4 h 4 mr-2" />
                              Remove Blank
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