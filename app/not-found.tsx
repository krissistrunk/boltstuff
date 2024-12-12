import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto min-h-screen flex items-center justify-center py-8 px-4">
      <div className="text-center space-y-6">
        <Brain className="w-16 h-16 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn't find what you were looking for. The page you requested may have been moved or doesn't exist.
        </p>
        <Link href="/">
          <Button size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  );
}