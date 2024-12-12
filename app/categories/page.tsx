import { CategoryGrid } from "@/components/home/category-grid";
import { categories } from "@/lib/sample-data";
import { Brain, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">QuizMaster</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-8">Quiz Categories</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Explore our diverse range of quiz categories. From science and history to technology and beyond,
          find the perfect challenge for your interests and expertise level.
        </p>
        <CategoryGrid categories={categories} />
      </main>
    </div>
  );
}