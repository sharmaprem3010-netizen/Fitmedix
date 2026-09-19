import { Link } from "@tanstack/react-router";
import { BookOpen, Search, User } from "lucide-react";
import { Button } from "@/components/ui/AppButton";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center px-4 max-w-6xl mx-auto justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
            <img src="/logo.jpg" alt="Fitmadix Logo" className="h-8 w-8 rounded-lg" />
            <span className="inline-block font-bold">Fitmadix</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/encyclopedia"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Encyclopedia
            </Link>
            <Link
              to="/products"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Product Guide
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/auth" search={{ mode: "signin" }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-4 hidden sm:block">
              Log in
            </Link>
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button variant="primary" size="sm" className="hidden sm:flex">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
