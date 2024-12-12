import { JoinQuizForm } from "@/components/quiz/join-quiz-form";

export default function JoinQuizPage() {
  return (
    <main className="container mx-auto min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Join a Quiz</h1>
        <JoinQuizForm />
      </div>
    </main>
  );
}