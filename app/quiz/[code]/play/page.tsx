import { QuizGame } from "@/components/quiz/quiz-game";

export default function QuizGamePage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { name: string };
}) {
  return (
    <main className="container mx-auto min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <QuizGame code={params.code} playerName={searchParams.name} />
      </div>
    </main>
  );
}