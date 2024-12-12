"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award } from "lucide-react";
import Link from "next/link";

interface QuizResultsProps {
  code: string;
  playerName: string;
  score: number;
}

interface PlayerResult {
  name: string;
  score: number;
  position: number;
}

// Mock results - in a real app, these would come from the server
const mockResults: PlayerResult[] = [
  { name: "Alice", score: 300, position: 1 },
  { name: "Bob", score: 200, position: 2 },
  { name: "Charlie", score: 100, position: 3 },
];

export function QuizResults({ code, playerName, score }: QuizResultsProps) {
  const positionIcons = {
    1: <Trophy className="w-8 h-8 text-yellow-500" />,
    2: <Medal className="w-8 h-8 text-gray-400" />,
    3: <Award className="w-8 h-8 text-amber-700" />,
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-muted-foreground">Here are the final results</p>
      </div>

      <Card className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Your Score</h2>
          <div className="text-4xl font-bold text-primary">{score}</div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Leaderboard</h3>
          {mockResults.map((player) => (
            <div
              key={player.name}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-4">
                {positionIcons[player.position as keyof typeof positionIcons]}
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Position #{player.position}
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">{player.score}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link href="/join" className="flex-1">
            <Button className="w-full">Play Again</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}