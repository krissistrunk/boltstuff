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

export function HotspotForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    image: "",
    hotspots: [{ x: 50, y: 50, radius: 10, label: "" }],
    type: 'hotspot',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addHotspot = () => {
    setCurrentQuestion({
      ...currentQuestion,
      hotspots: [...currentQuestion.hotspots, { x: 50, y: 50, radius: 10, label: "" }],
    });
  };

  const removeHotspot = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      hotspots: currentQuestion.hotspots.filter((_, i) => i !== index),
    });
  };

  const updateHotspot = (index: number, field: keyof typeof currentQuestion.hotspots[0], value: string | number) => {
    const newHotspots = [...currentQuestion.hotspots];
    newHotspots[index] = { ...newHotspots[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, hotspots: newHotspots });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.image.trim()) {
      toast({
        title: "Error",
        description: "Please enter both question and image URL",
        variant: "destructive",
      });
      return;
    }

    const emptyHotspots = currentQuestion.hotspots.some(hotspot => !hotspot.label.trim());
    if (emptyHotspots) {
      toast({
        title: "Error",
        description: "Please fill in all hotspot labels",
        variant: "destructive",
      });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      image: "",
      hotspots: [{ x: 50, y: 50, radius: 10, label: "" }],
      type: 'hotspot',
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
      type: 'hotspot',
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
                        <p className="text-sm text-muted-foreground">Image URL: {q.image}</p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Hotspots:</p>
                          {q.hotspots.map((hotspot: any, spotIndex: number) => (
                            <p key={spotIndex} className="text-sm">
                              {hotspot.label} (x: {hotspot.x}%, y: {hotspot.y}%, radius: {hotspot.radius}px)
                            </p>
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
                    <FormLabel>Image URL</FormLabel>
                    <Input
                      value={currentQuestion.image}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, image: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Hotspots</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addHotspot}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Hotspot
                      </Button>
                    </div>

                    {currentQuestion.hotspots.map((hotspot, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-4">
                          <div>
                            <FormLabel>Label</FormLabel>
                            <Input
                              value={hotspot.label}
                              onChange={(e) => updateHotspot(index, "label", e.target.value)}
                              placeholder="Enter hotspot label"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <FormLabel>X Position (%)</FormLabel>
                              <Input
                                type="number"
                                value={hotspot.x}
                                onChange={(e) => updateHotspot(index, "x", parseFloat(e.target.value))}
                                min="0"
                                max="100"
                              />
                            </div>
                            <div>
                              <FormLabel>Y Position (%)</FormLabel>
                              <Input
                                type="number"
                                value={hotspot.y}
                                onChange={(e) => updateHotspot(index, "y", parseFloat(e.target.value))}
                                min="0"
                                max="100"
                              />
                            </div>
                            <div>
                              <FormLabel>Radius (px)</FormLabel>
                              <Input
                                type="number"
                                value={hotspot.radius}
                                onChange={(e) => updateHotspot(index, "radius", parseInt(e.target.value))}
                                min="5"
                                max="50"
                              />
                            </div>
                          </div>

                          {currentQuestion.hotspots.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full text-destructive"
                              onClick={() => removeHotspot(index)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Hotspot
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