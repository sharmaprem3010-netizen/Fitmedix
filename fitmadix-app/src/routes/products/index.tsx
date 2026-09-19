import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/products/")({
  component: ProductsIndex,
});

function ProductsIndex() {
  const popularCategories = ["Supplements", "Fitness Equipment", "Wearables", "Recovery Tools"];

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 text-teal-500 rounded-2xl mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
          Health & Fitness Product Guide
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Unbiased reviews, specs, and comparisons for supplements, gear, and wellness products.
        </p>
        
        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              className="w-full h-14 pl-12 pr-4 bg-surface border border-border rounded-full shadow-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Search for products, brands, or categories..."
          />
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularCategories.map((cat, i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-2xl text-center hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-foreground">{cat}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Reviews</h2>
          <Link to="/products/compare" className="text-primary text-sm font-medium hover:underline flex items-center">
            Compare Products <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Link key={item} to="/products/$slug" params={{ slug: `whey-protein-${item}` }} className="group">
              <div className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-glow hover:border-primary/50 transition-all h-full flex flex-col">
                <div className="h-48 bg-secondary/50 flex items-center justify-center p-6">
                  <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center shadow-inner">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-500 bg-teal-500/10 px-2 py-1 rounded">Supplement</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Premium Whey Protein Isolate</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">High-quality protein powder with zero artificial sweeteners. Ideal for post-workout recovery.</p>
                  <div className="font-semibold">₹2,499.00</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
