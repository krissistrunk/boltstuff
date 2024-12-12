"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function DashboardPage() {
  const quizTypes = [
    { type: "multiple-choice", name: "Multiple Choice", description: "Classic multiple choice questions" },
    { type: "true-false", name: "True/False", description: "Simple true or false statements" },
    { type: "fill-blank", name: "Fill in the Blank", description: "Complete sentences with missing words" },
    { type: "matching", name: "Matching", description: "Match items from two columns" },
    { type: "ordering", name: "Ordering", description: "Arrange items in correct sequence" },
    { type: "checkbox", name: "Checkbox", description: "Select all correct answers" },
    { type: "short-answer", name: "Short Answer", description: "Brief written responses" },
    { type: "dropdown", name: "Dropdown", description: "Select from dropdown options" },
    { type: "hotspot", name: "Hotspot", description: "Click on specific image areas" },
    { type: "audio-response", name: "Audio Response", description: "Answer questions about audio clips" },
    { type: "scenario", name: "Scenario Based", description: "Answer questions about given scenarios" },
    { type: "interactive", name: "Interactive", description: "Engage with interactive simulations" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">QuizMaster</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a New Quiz</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizTypes.map((quizType) => (
              <Link key={quizType.type} href={`/dashboard/create/${quizType.type}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{quizType.name}</h3>
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground">{quizType.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}