"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Users, Clock, Trophy, Share2 } from "lucide-react";
import { Player } from "@/types/quiz";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { activePlayers } from "@/lib/sample-data";

interface QuizLobbyProps {
  code: string;
  playerName: string;
}

export function QuizLobby({ code, playerName }: QuizLobbyProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: playerName, isHost: true },
    // Add some sample players from our data
    ...activePlayers
      .filter(p => p.status === "in-lobby")
      .map(p => ({ id: p.id, name: p.username, isHost: false }))
  ]);

  const [countdown, setCountdown] = useState<number | null>(null);

  const startGame = () => {
    setCountdown(5);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: "Share this code with your friends to join the quiz.",
    });
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      router.push(`/quiz/${code}/play?name=${playerName}`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, code, playerName, router]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quiz Lobby</h1>
        <Button variant="outline" onClick={copyCode}>
          <Share2 className="w-4 h-4 mr-2" />
          <span className="font-mono font-bold">{code}</span>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Players ({players.length})</h2>
          </div>
          {countdown !== null && (
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-bold">{countdown}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                {player.isHost && <Trophy className="w-4 h-4 text-primary" />}
                <span className="font-medium">{player.name}</span>
              </div>
              {player.isHost && (
                <span className="text-sm text-muted-foreground">Host</span>
              )}
            </div>
          ))}
        </div>

        {players[0].name === playerName && countdown === null && (
          <Button onClick={startGame} className="w-full mt-6">
            Start Quiz
          </Button>
        )}
      </Card>
    </div>
  );
}