"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MultipleChoiceForm } from "@/components/quiz/forms/multiple-choice-form";
import { TrueFalseForm } from "@/components/quiz/forms/true-false-form";
import { FillBlankForm } from "@/components/quiz/forms/fill-blank-form";
import { MatchingForm } from "@/components/quiz/forms/matching-form";
import { OrderingForm } from "@/components/quiz/forms/ordering-form";
import { CheckboxForm } from "@/components/quiz/forms/checkbox-form";
import { ShortAnswerForm } from "@/components/quiz/forms/short-answer-form";
import { HotspotForm } from "@/components/quiz/forms/hotspot-form";
import { DropdownForm } from "@/components/quiz/forms/dropdown-form";
import { AudioResponseForm } from "@/components/quiz/forms/audio-response-form";
import { ScenarioForm } from "@/components/quiz/forms/scenario-form";
import { InteractiveForm } from "@/components/quiz/forms/interactive-form";

const formComponents = {
  'multiple-choice': MultipleChoiceForm,
  'true-false': TrueFalseForm,
  'fill-blank': FillBlankForm,
  'matching': MatchingForm,
  'ordering': OrderingForm,
  'checkbox': CheckboxForm,
  'short-answer': ShortAnswerForm,
  'hotspot': HotspotForm,
  'dropdown': DropdownForm,
  'audio-response': AudioResponseForm,
  'scenario': ScenarioForm,
  'interactive': InteractiveForm,
};

export default function CreateQuizPage({ params }: { params: { type: string } }) {
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  const FormComponent = formComponents[params.type as keyof typeof formComponents];

  if (!FormComponent) {
    return <div>Invalid quiz type</div>;
  }

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
              href="/dashboard" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Create {params.type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Quiz
          </h1>
          <FormComponent />
        </div>
      </main>
    </div>
  );
}