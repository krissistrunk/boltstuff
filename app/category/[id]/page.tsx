import { CategoryQuizzes } from "@/components/category/category-quizzes";
import { categories, sampleQuizzes } from "@/lib/sample-data";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = categories.find((c) => c.id === params.id);
  
  if (!category) {
    notFound();
  }

  const categoryQuizzes = sampleQuizzes.filter((quiz) => quiz.category === params.id);

  return (
    <main className="container mx-auto min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        
        <CategoryQuizzes quizzes={categoryQuizzes} />
      </div>
    </main>
  );
}