import { QuizResults } from "@/components/quiz/quiz-results";

export default function QuizResultsPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { name: string; score: string };
}) {
  return (
    <main className="container mx-auto min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <QuizResults
          code={params.code}
          playerName={searchParams.name}
          score={parseInt(searchParams.score)}
        />
      </div>
    </main>
  );
}