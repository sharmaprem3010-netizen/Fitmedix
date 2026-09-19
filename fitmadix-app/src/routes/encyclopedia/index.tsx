import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Pill, Apple, Dumbbell, Activity, ShieldPlus, TestTube, ShoppingCart, BookText } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/encyclopedia/")({
  component: EncyclopediaIndex,
});

const CATEGORIES = [
  { id: "medicine", title: "Medicines", icon: Pill, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "food", title: "Foods & Nutrition", icon: Apple, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "exercise", title: "Fitness & Exercises", icon: Dumbbell, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "condition", title: "Health Conditions", icon: Activity, color: "text-red-500", bg: "bg-red-500/10" },
  { id: "nutrient", title: "Vitamins & Minerals", icon: ShieldPlus, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "test", title: "Medical Tests", icon: TestTube, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "product", title: "Health Products", icon: ShoppingCart, color: "text-teal-500", bg: "bg-teal-500/10" },
  { id: "term", title: "Medical Terms", icon: BookText, color: "text-slate-500", bg: "bg-slate-500/10" },
];

function EncyclopediaIndex() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/encyclopedia/search", search: { q: query } });
    }
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
          Fitmadix Health Encyclopedia
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Understand medicines, foods, fitness, health conditions, vitamins and everyday health topics in simple language.
        </p>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              className="w-full h-14 pl-12 pr-4 bg-surface border border-border rounded-full shadow-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Search medicines, foods, conditions, exercises, vitamins..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2 h-10 px-6 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to="/encyclopedia/$category"
            params={{ category: cat.id }}
            className="flex flex-col items-center p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all group"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${cat.bg} group-hover:scale-110 transition-transform`}>
              <cat.icon className={`w-7 h-7 ${cat.color}`} />
            </div>
            <h3 className="font-semibold text-center text-foreground">{cat.title}</h3>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-20 p-6 bg-secondary/50 rounded-2xl border border-border/50 text-center max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Disclaimer:</strong> Health information is educational and is not a diagnosis or a substitute for professional medical advice. Always consult a qualified healthcare provider for medical advice, diagnoses, or treatment.
        </p>
      </div>

    </div>
  );
}
