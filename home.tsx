import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse through thousands of job opportunities from top companies. 
            Updated daily with new positions from LinkedIn and other major job boards.
          </p>
          <Link href="/jobs">
            <Button size="lg" className="text-lg">
              Browse Jobs
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Daily Updates</h3>
            <p className="text-muted-foreground">
              New job listings added every 24 hours from multiple sources
            </p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-muted-foreground">
              Find exactly what you're looking for with powerful filters
            </p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Easy Apply</h3>
            <p className="text-muted-foreground">
              Direct application links to your dream positions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}