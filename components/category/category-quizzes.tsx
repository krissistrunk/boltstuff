import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";
import { Brain, Clock, Users } from "lucide-react";
import Link from "next/link";

interface CategoryQuizzesProps {
  quizzes: Quiz[];
}

export function CategoryQuizzes({ quizzes }: CategoryQuizzesProps) {
  return (
    <div className="grid gap-6">
      {quizzes.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No quizzes available in this category yet.</p>
        </Card>
      ) : (
        quizzes.map((quiz) => (
          <Link key={quiz.id} href={`/quiz/${quiz.id}/lobby?name=Player`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    {quiz.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quiz.timeLimit}s
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {quiz.playCount}
                    </div>
                  </div>
                </div>
                <CardDescription>{quiz.description}</CardDescription>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {quiz.questionCount} questions
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Created by {quiz.createdBy}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}