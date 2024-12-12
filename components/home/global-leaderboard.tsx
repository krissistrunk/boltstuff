import { Card } from "@/components/ui/card";
import { globalLeaderboard } from "@/lib/sample-data";
import { Crown, Medal, Trophy } from "lucide-react";

export function GlobalLeaderboard() {
  const rankIcons = {
    1: <Crown className="w-5 h-5 text-yellow-500" />,
    2: <Medal className="w-5 h-5 text-gray-400" />,
    3: <Trophy className="w-5 h-5 text-amber-700" />,
  };

  return (
    <Card className="p-6 bg-secondary/50 border-0">
      <div className="space-y-4">
        {globalLeaderboard.map((entry) => (
          <div
            key={entry.username}
            className="flex items-center justify-between p-4 bg-background/40 rounded-lg hover:bg-background/60 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-8">
                {rankIcons[entry.rank as keyof typeof rankIcons] || entry.rank}
              </div>
              <div>
                <div className="font-medium">{entry.username}</div>
                <div className="text-sm text-muted-foreground">
                  {entry.quizzesTaken} quizzes • {entry.winRate}% win rate
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-1">
                {entry.achievements.slice(0, 2).map((achievement, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
              <div className="text-xl font-bold text-primary">{entry.score}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}