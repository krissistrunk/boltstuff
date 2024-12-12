import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ChevronRight, Star, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoryGrid } from "@/components/home/category-grid";
import { GlobalLeaderboard } from "@/components/home/global-leaderboard";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { categories } from "@/lib/sample-data";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">QuizMaster</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/categories" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Browse Categories
            </Link>
            <Link href="/dashboard">
              <Button>Quiz Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold">
                Create and Share Interactive Quizzes
              </h1>
              <p className="text-xl text-muted-foreground">
                Engage your audience with dynamic quizzes. Perfect for education,
                training, or just having fun!
              </p>
              <div className="flex gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline" className="gap-2">
                    Browse Quizzes
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=1200&auto=format&fit=crop"
                alt="Quiz Platform"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose QuizMaster?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Star className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy to Create</h3>
              <p className="text-muted-foreground">
                Create professional quizzes in minutes with our intuitive interface.
              </p>
            </Card>
            <Card className="p-6">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Multiple Question Types</h3>
              <p className="text-muted-foreground">
                Support for various question formats to keep your quizzes engaging.
              </p>
            </Card>
            <Card className="p-6">
              <Quote className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Results</h3>
              <p className="text-muted-foreground">
                Get instant feedback and detailed analytics for each quiz.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Categories</h2>
            <Link href="/categories">
              <Button variant="outline" className="gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <CategoryGrid categories={categories.slice(0, 6)} />
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Global Leaderboard</h2>
          <GlobalLeaderboard />
        </div>
      </section>
    </div>
  );
}