import { QuizLobby } from "@/components/quiz/quiz-lobby";

export default function QuizLobbyPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { name: string };
}) {
  return (
    <main className="container mx-auto min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <QuizLobby code={params.code} playerName={searchParams.name} />
      </div>
    </main>
  );
}