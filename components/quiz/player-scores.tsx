"use client";

import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface PlayerScore {
  name: string;
  score: number;
  position: number;
}

// Mock data - in a real app, this would be updated in real-time
const mockScores: PlayerScore[] = [
  { name: "Alice", score: 300, position: 1 },
  { name: "Bob", score: 200, position: 2 },
  { name: "Charlie", score: 100, position: 3 },
];

export function PlayerScores() {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Live Scores</h3>
      <div className="space-y-2">
        {mockScores.map((player) => (
          <div
            key={player.name}
            className="flex items-center justify-between p-2 bg-muted rounded"
          >
            <div className="flex items-center gap-3">
              {player.position === 1 && (
                <Trophy className="w-4 h-4 text-yellow-500" />
              )}
              <span className="font-medium">{player.name}</span>
            </div>
            <span className="font-mono">{player.score}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}