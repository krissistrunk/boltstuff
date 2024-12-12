import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Category } from "@/types/quiz";
import { Brain, Cpu, Globe, Landmark, Trophy, Palette, BookOpen, Music, Film, Utensils, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

interface CategoryGridProps {
  categories: Category[];
}

const iconMap = {
  Flask: Brain,
  Landmark: Landmark,
  Cpu: Cpu,
  Globe: Globe,
  Trophy: Trophy,
  Palette: Palette,
  BookOpen: BookOpen,
  Music: Music,
  Film: Film,
  Utensils: Utensils,
  Leaf: Leaf,
  Sparkles: Sparkles,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const Icon = iconMap[category.icon as keyof typeof iconMap];
        return (
          <Link key={category.id} href={`/category/${category.id}`}>
            <Card className="bg-secondary/50 border-0 hover:bg-secondary/70 transition-colors cursor-pointer h-full group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary group-hover:text-primary/80" />
                    {category.name}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {category.quizCount} quizzes
                  </span>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}